// admin.js

document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    setupSidebar();
    setupNotifications();
    setupAdminProfile();
    setupQuickActions();
    setupActivityActions();
    initializeCharts();
    setupSearch();
}

// Sidebar Functionality
function setupSidebar() {
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }
}

// Notifications
function setupNotifications() {
    const notificationBtn = document.querySelector('.notifications');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            // Implement notifications dropdown
            console.log('Show notifications');
        });
    }
}

// Admin Profile Dropdown
function setupAdminProfile() {
    const profileBtn = document.querySelector('.admin-profile');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            // Implement profile dropdown
            console.log('Show profile options');
        });
    }
}

// Quick Actions
function setupQuickActions() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.classList[1];
            handleQuickAction(action);
        });
    });
}

function handleQuickAction(action) {
    switch(action) {
        case 'announcements':
            // Handle new announcement
            window.location.href = 'announcements/new';
            break;
        case 'events':
            // Handle new event
            window.location.href = 'events/new';
            break;
        case 'news':
            // Handle new news post
            window.location.href = 'news/new';
            break;
        case 'media':
            // Handle media upload
            window.location.href = 'media/upload';
            break;
    }
}

// Activity Actions
function setupActivityActions() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('approve')) {
            handleApproval(e.target.closest('.activity-item'));
        } else if (e.target.classList.contains('reject')) {
            handleRejection(e.target.closest('.activity-item'));
        }
    });
}

function handleApproval(activityItem) {
    // Implement approval logic
    activityItem.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => {
        activityItem.remove();
        updateActivityCount();
    }, 300);
}

function handleRejection(activityItem) {
    // Implement rejection logic
    activityItem.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => {
        activityItem.remove();
        updateActivityCount();
    }, 300);
}

// Search Functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            handleSearch(e.target.value);
        }, 300));
    }
}

function handleSearch(query) {
    // Implement search logic
    console.log('Searching for:', query);
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

function updateActivityCount() {
    const count = document.querySelectorAll('.activity-item').length;
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = count;
        if (count === 0) {
            badge.style.display = 'none';
        }
    }
}

// Charts and Metrics
function initializeCharts() {
    // Implement charts using a library like Chart.js
    // This is a placeholder for chart initialization
    console.log('Charts initialized');
}

// Add these styles for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateX(30px);
        }
    }

    .activity-item {
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);