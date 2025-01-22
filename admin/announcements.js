// announcements.js
class AnnouncementsManager {
    constructor() {
        this.announcements = [];
        this.selectedAnnouncements = new Set();
        this.currentView = 'list';
        this.quill = null;
        this.initializeElements();
        this.initializeQuillEditor();
        this.initializeEventListeners();
        this.loadAnnouncements();
        this.initializeAdminFeatures();
    }

    // Initialize DOM elements
    initializeElements() {
        // Admin elements
        this.sidebar = document.querySelector('.sidebar');
        this.notifications = document.querySelector('.notifications');
        this.adminProfile = document.querySelector('.admin-profile');
        this.searchBar = document.querySelector('.search-bar input');

        // Announcements elements
        this.createBtn = document.getElementById('createAnnouncementBtn');
        this.bulkActionsBtn = document.getElementById('bulkActionsBtn');
        this.viewButtons = document.querySelectorAll('.view-btn');
        this.selectAllCheckbox = document.getElementById('selectAll');
        this.announcementsTable = document.getElementById('announcementsTable');
        this.announcementsGrid = document.querySelector('.announcements-grid');
        
        // Modals
        this.announcementModal = document.getElementById('announcementModal');
        this.previewModal = document.getElementById('previewModal');
        this.bulkActionsModal = document.getElementById('bulkActionsModal');
        
        // Forms and filters
        this.announcementForm = document.getElementById('announcementForm');
        this.searchInput = document.getElementById('searchAnnouncements');
        this.statusFilter = document.getElementById('statusFilter');
        this.priorityFilter = document.getElementById('priorityFilter');
        this.dateFilter = document.getElementById('dateFilter');
    }

    // Initialize Quill editor
    initializeQuillEditor() {
        this.quill = new Quill('#editor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'header': 1 }, { 'header': 2 }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'script': 'sub'}, { 'script': 'super' }],
                    [{ 'indent': '-1'}, { 'indent': '+1' }],
                    [{ 'direction': 'rtl' }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'font': [] }],
                    [{ 'align': [] }],
                    ['clean'],
                    ['link', 'image', 'video']
                ]
            }
        });
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Create and bulk actions buttons
        this.createBtn.addEventListener('click', () => this.openAnnouncementModal());
        this.bulkActionsBtn.addEventListener('click', () => this.openBulkActionsModal());

        // View toggle
        this.viewButtons.forEach(button => {
            button.addEventListener('click', () => this.toggleView(button.dataset.view));
        });

        // Select all checkbox
        this.selectAllCheckbox.addEventListener('change', (e) => this.handleSelectAll(e));

        // Form submission
        this.announcementForm.addEventListener('submit', (e) => this.handleAnnouncementSubmit(e));

        // Filters
        this.searchInput.addEventListener('input', () => this.applyFilters());
        this.statusFilter.addEventListener('change', () => this.applyFilters());
        this.priorityFilter.addEventListener('change', () => this.applyFilters());
        this.dateFilter.addEventListener('change', () => this.applyFilters());

        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', () => this.closeAllModals());
        });

        // Preview button
        document.getElementById('previewBtn').addEventListener('click', () => this.previewAnnouncement());

        // Save as draft button
        document.getElementById('saveDraftBtn').addEventListener('click', () => this.saveAsDraft());

        // File upload preview
        document.getElementById('attachments').addEventListener('change', (e) => this.handleFileUpload(e));
    }

    // Initialize admin features
    initializeAdminFeatures() {
        // Notifications dropdown
        this.notifications.addEventListener('click', () => this.toggleNotifications());

        // Admin profile dropdown
        this.adminProfile.addEventListener('click', () => this.toggleProfileDropdown());

        // Global search
        this.searchBar.addEventListener('input', (e) => this.handleGlobalSearch(e.target.value));

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.notifications')) {
                this.closeNotifications();
            }
            if (!e.target.closest('.admin-profile')) {
                this.closeProfileDropdown();
            }
        });
    }

    // Load announcements from storage/API
    async loadAnnouncements() {
        try {
            const stored = localStorage.getItem('announcements');
            this.announcements = stored ? JSON.parse(stored) : [];
            this.renderAnnouncements();
        } catch (error) {
            console.error('Error loading announcements:', error);
            this.showNotification('Error loading announcements', 'error');
        }
    }

    // Render announcements based on current view
    renderAnnouncements() {
        const filteredAnnouncements = this.getFilteredAnnouncements();
        
        if (this.currentView === 'list') {
            this.renderListView(filteredAnnouncements);
        } else {
            this.renderGridView(filteredAnnouncements);
        }
    }

    // Render list view
    renderListView(announcements) {
        const tbody = this.announcementsTable.querySelector('tbody');
        tbody.innerHTML = '';

        announcements.forEach(announcement => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="announcement-checkbox" 
                           value="${announcement.id}" 
                           ${this.selectedAnnouncements.has(announcement.id) ? 'checked' : ''}>
                </td>
                <td>${announcement.title}</td>
                <td>
                    <span class="priority-badge priority-${announcement.priority.toLowerCase()}">
                        ${announcement.priority}
                    </span>
                </td>
                <td>${announcement.status}</td>
                <td>${new Date(announcement.publishDate).toLocaleDateString()}</td>
                <td>${announcement.expiryDate ? new Date(announcement.expiryDate).toLocaleDateString() : '-'}</td>
                <td>
                    <button class="btn-icon" onclick="announcementsManager.editAnnouncement('${announcement.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="announcementsManager.deleteAnnouncement('${announcement.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Add checkbox event listeners
        tbody.querySelectorAll('.announcement-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleAnnouncementSelect(e));
        });
    }

    // Render grid view
    renderGridView(announcements) {
        this.announcementsGrid.innerHTML = '';

        announcements.forEach(announcement => {
            const card = document.createElement('div');
            card.className = 'announcement-card';
            card.innerHTML = `
                <div class="card-header">
                    <input type="checkbox" class="announcement-checkbox" 
                           value="${announcement.id}"
                           ${this.selectedAnnouncements.has(announcement.id) ? 'checked' : ''}>
                    <span class="priority-badge priority-${announcement.priority.toLowerCase()}">
                        ${announcement.priority}
                    </span>
                </div>
                <h3>${announcement.title}</h3>
                <div class="card-content">${announcement.content.substring(0, 100)}...</div>
                <div class="card-footer">
                    <span>${new Date(announcement.publishDate).toLocaleDateString()}</span>
                    <div class="card-actions">
                        <button class="btn-icon" onclick="announcementsManager.editAnnouncement('${announcement.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="announcementsManager.deleteAnnouncement('${announcement.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            this.announcementsGrid.appendChild(card);
        });

        // Add checkbox event listeners
        this.announcementsGrid.querySelectorAll('.announcement-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleAnnouncementSelect(e));
        });
    }

    // Handle announcement form submission
    async handleAnnouncementSubmit(e) {
        e.preventDefault();
        
        const formData = {
            id: this.announcementForm.dataset.announcementId || Date.now().toString(),
            title: document.getElementById('title').value,
            content: this.quill.root.innerHTML,
            priority: document.getElementById('priority').value,
            status: document.getElementById('status').value,
            publishDate: document.getElementById('publishDate').value,
            expiryDate: document.getElementById('expiryDate').value,
            tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()),
            attachments: [], // Handle file attachments
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        try {
            await this.saveAnnouncement(formData);
            this.closeAllModals();
            this.renderAnnouncements();
            this.showNotification('Announcement saved successfully', 'success');
        } catch (error) {
            console.error('Error saving announcement:', error);
            this.showNotification('Error saving announcement', 'error');
        }
    }

    // Save announcement to storage/API
    async saveAnnouncement(announcementData) {
        const index = this.announcements.findIndex(a => a.id === announcementData.id);
        if (index >= 0) {
            this.announcements[index] = announcementData;
        } else {
            this.announcements.push(announcementData);
        }
        localStorage.setItem('announcements', JSON.stringify(this.announcements));
    }

    // Handle file upload
    handleFileUpload(e) {
        const files = Array.from(e.target.files);
        const preview = document.querySelector('.upload-preview');
        preview.innerHTML = '';

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                if (file.type.startsWith('image/')) {
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="${file.name}">
                        <span>${file.name}</span>
                    `;
                } else {
                    previewItem.innerHTML = `
                        <i class="fas fa-file"></i>
                        <span>${file.name}</span>
                    `;
                }
                preview.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });
    }

    // Toggle view (list/grid)
    toggleView(view) {
        this.currentView = view;
        this.viewButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.view === view);
        });
        
        this.announcementsTable.style.display = view === 'list' ? 'table' : 'none';
        this.announcementsGrid.style.display = view === 'grid' ? 'grid' : 'none';
    }

    // Filter announcements
    getFilteredAnnouncements() {
        return this.announcements.filter(announcement => {
            const searchMatch = announcement.title.toLowerCase().includes(this.searchInput.value.toLowerCase());
            const statusMatch = !this.statusFilter.value || announcement.status === this.statusFilter.value;
            const priorityMatch = !this.priorityFilter.value || announcement.priority === this.priorityFilter.value;
            const dateMatch = !this.dateFilter.value || 
                new Date(announcement.publishDate).toISOString().startsWith(this.dateFilter.value);
            
            return searchMatch && statusMatch && priorityMatch && dateMatch;
        });
    }

    // Apply filters
    applyFilters() {
        this.renderAnnouncements();
    }

    // Modal operations
    openAnnouncementModal(announcement = null) {
        this.announcementModal.style.display = 'block';
        if (announcement) {
            // Populate form for editing
            this.announcementForm.dataset.announcementId = announcement.id;
            document.getElementById('title').value = announcement.title;
            this.quill.root.innerHTML = announcement.content;
            document.getElementById('priority').value = announcement.priority;
            document.getElementById('status').value = announcement.status;
            document.getElementById('publishDate').value = announcement.publishDate;
            document.getElementById('expiryDate').value = announcement.expiryDate || '';
            document.getElementById('tags').value = announcement.tags.join(', ');
        } else {
            // Clear form for new announcement
            this.announcementForm.reset();
            delete this.announcementForm.dataset.announcementId;
            this.quill.root.innerHTML = '';
        }
    }

    closeAllModals() {
        this.announcementModal.style.display = 'none';
        this.previewModal.style.display = 'none';
        this.bulkActionsModal.style.display = 'none';
    }

    // Preview announcement
    previewAnnouncement() {
        const previewContent = document.querySelector('.preview-content');
        previewContent.innerHTML = `
            <h1>${document.getElementById('title').value}</h1>
            <div class="announcement-meta">
                <span class="priority-badge priority-${document.getElementById('priority').value.toLowerCase()}">
                    ${document.getElementById('priority').value}
                </span>
                <span>Publish Date: ${document.getElementById('publishDate').value}</span>
            </div>
            <div class="announcement-content">
                ${this.quill.root.innerHTML}
            </div>
        `;
        this.previewModal.style.display = 'block';
    }

    // Notification system
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Admin feature methods
    toggleNotifications() {
        // Implementation for notifications dropdown
    }

    toggleProfileDropdown() {
        // Implementation for profile dropdown
    }

    handleGlobalSearch(query) {
        // Implementation for global search
    }
}

// Initialize the Announcements Manager
const announcementsManager = new AnnouncementsManager();