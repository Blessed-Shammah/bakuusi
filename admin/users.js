document.addEventListener('DOMContentLoaded', function() {
    initializeUsersPage();
});

function initializeUsersPage() {
    // Initialize all components
    setupUserModal();
    setupDeleteModal();
    setupFilters();
    loadUsers();
    setupPagination();
    setupSearch();
}

// Mock user data (replace with actual API calls)
const mockUsers = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'member',
        status: 'active',
        joinDate: '2024-01-15'
    },
    // Add more mock users as needed
];

// User Modal
function setupUserModal() {
    const addUserBtn = document.getElementById('addUserBtn');
    const userModal = document.getElementById('userModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const userForm = document.getElementById('userForm');

    addUserBtn.addEventListener('click', () => {
        userModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        userModal.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
        userModal.style.display = 'none';
    });

    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleUserSubmit();
    });
}

function handleUserSubmit() {
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const userRole = document.getElementById('userRole').value;
    const userStatus = document.getElementById('userStatus').value;

    // Add validation here

    // Mock API call to save user
    console.log('Saving user:', { userName, userEmail, userRole, userStatus });
    
    // Close modal and refresh users list
    document.getElementById('userModal').style.display = 'none';
    loadUsers();
}

// Delete Modal
function setupDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDelete = document.getElementById('confirmDelete');

    closeDeleteModal.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });

    cancelDelete.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });

    confirmDelete.addEventListener('click', () => {
        handleDeleteUser();
    });
}

function handleDeleteUser() {
    const userId = document.getElementById('deleteModal').dataset.userId;
    
    // Mock API call to delete user
    console.log('Deleting user:', userId);
    
    // Close modal and refresh users list
    document.getElementById('deleteModal').style.display = 'none';
    loadUsers();
}

// Filters
function setupFilters() {
    const roleFilter = document.getElementById('roleFilter');
    const statusFilter = document.getElementById('statusFilter');

    roleFilter.addEventListener('change', () => {
        loadUsers();
    });

    statusFilter.addEventListener('change', () => {
        loadUsers();
    });
}

// Search
function setupSearch() {
    const searchInput = document.getElementById('userSearch');
    
    searchInput.addEventListener('input', debounce(() => {
        loadUsers();
    }, 300));
}

// Users Table
function loadUsers() {
    const tableBody = document.getElementById('usersTableBody');
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    // Filter users based on search and filters
    let filteredUsers = mockUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) ||
                            user.email.toLowerCase().includes(searchTerm);
        const matchesRole = !roleFilter || user.role === roleFilter;
        const matchesStatus = !statusFilter || user.status === statusFilter;
        
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Clear table
    tableBody.innerHTML = '';

    // Add filtered users to table
    filteredUsers.forEach(user => {
        const row = createUserRow(user);
        tableBody.appendChild(row);
    });
}

function createUserRow(user) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="checkbox" class="user-select" value="${user.id}"></td>
        <td>
            <div class="user-info">
                <img src="../images/default-avatar.jpg" alt="${user.name}" class="user-avatar">
                <div class="user-details">
                    <span class="user-name">${user.name}</span>
                    <span class="user-email">${user.email}</span>
                </div>
            </div>
        </td>
        <td>${user.role}</td>
        <td>${formatDate(user.joinDate)}</td>
        <td><span class="user-status status-${user.status}">${user.status}</span></td>
        <td>
            <div class="user-actions">
                <button class="action-btn edit" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="showDeleteModal(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    return row;
}

// Pagination
function setupPagination() {
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const paginationNumbers = document.getElementById('paginationNumbers');

    // Add pagination logic here
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Edit User
function editUser(userId) {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return;

    // Populate form
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userStatus').value = user.status;

    // Show modal
    document.getElementById('modalTitle').textContent = 'Edit User';
    document.getElementById('userModal').style.display = 'block';
}

// Delete User
function showDeleteModal(userId) {
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.dataset.userId = userId;
    deleteModal.style.display = 'block';
}