// DOM elements
const userTableBody = document.querySelector('#userTable tbody');
const userFormContainer = document.querySelector('#userFormContainer');
const userForm = document.querySelector('#userForm');
const addUserBtn = document.querySelector('#addUserBtn');
const cancelBtn = document.querySelector('#cancelBtn');

// Data state
let users = [];
let editingUserId = null;

// Fetch users from API
async function fetchUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        users = await response.json();
        displayUsers();
    } catch (error) {
        alert('Failed to fetch users');
    }
}

// Display users in the table
function displayUsers() {
    userTableBody.innerHTML = ''; // Clear current table
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name.split(' ')[0]}</td>
            <td>${user.name.split(' ')[1]}</td>
            <td>${user.email}</td>
            <td>${user.company.name}</td>
            <td>
                <button class="edit-btn" onclick="editUser(${user.id})">Edit</button>
                <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

// Show form for adding a new user
addUserBtn.addEventListener('click', () => {
    editingUserId = null; // Reset for new user
    userForm.reset();
    userFormContainer.classList.remove('hidden');
    userFormContainer.classList.add('show');
});

// Cancel form
cancelBtn.addEventListener('click', () => {
    userFormContainer.classList.add('hidden');
    userFormContainer.classList.remove('show');
});

// Submit form (add/edit user)
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newUser = {
        name: `${userForm.firstName.value} ${userForm.lastName.value}`,
        email: userForm.email.value,
        company: {
            name: userForm.department.value
        }
    };

    if (editingUserId) {
        // Edit user
        try {
            await fetch(`https://jsonplaceholder.typicode.com/users/${editingUserId}`, {
                method: 'PUT',
                body: JSON.stringify(newUser),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            users = users.map(user => user.id === editingUserId ? {
                ...user,
                ...newUser
            } : user);
        } catch (error) {
            alert('Failed to edit user');
        }
    } else {
        // Add user
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users', {
                method: 'POST',
                body: JSON.stringify(newUser),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const addedUser = await response.json();
            users.push(addedUser);
        } catch (error) {
            alert('Failed to add user');
        }
    }

    displayUsers();
    userFormContainer.classList.add('hidden');
    userFormContainer.classList.remove('show');
});

// Edit user
window.editUser = (id) => {
    const user = users.find(u => u.id === id);
    const [firstName, lastName] = user.name.split(' ');
    userForm.firstName.value = firstName;
    userForm.lastName.value = lastName;
    userForm.email.value = user.email;
    userForm.department.value = user.company.name;
    editingUserId = id;
    userFormContainer.classList.remove('hidden');
    userFormContainer.classList.add('show');
};

// Delete user
window.deleteUser = async (id) => {
    try {
        await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
            method: 'DELETE'
        });
        users = users.filter(user => user.id !== id);
        displayUsers();
    } catch (error) {
        alert('Failed to delete user');
    }
};

// Fetch users on page load
fetchUsers();