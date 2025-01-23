// news.js
class NewsManager {
    constructor() {
        this.news = [];
        this.selectedNews = new Set();
        this.currentView = 'list';
        this.quill = null;
        this.featuredImage = null;
        this.galleryImages = [];
        this.initializeElements();
        this.initializeQuillEditor();
        this.initializeEventListeners();
        this.loadNews();
    }

    initializeElements() {
        // Main elements
        this.newsContainer = document.querySelector('.news-container');
        this.newsTable = document.getElementById('newsTable');
        this.newsGrid = document.querySelector('.news-grid');
        
        // Buttons and controls
        this.createBtn = document.getElementById('createNewsBtn');
        this.bulkActionsBtn = document.getElementById('bulkActionsBtn');
        this.viewButtons = document.querySelectorAll('.view-btn');
        this.selectAllCheckbox = document.getElementById('selectAll');
        
        // Modals
        this.newsModal = document.getElementById('newsModal');
        this.previewModal = document.getElementById('previewModal');
        this.bulkActionsModal = document.getElementById('bulkActionsModal');
        
        // Forms and inputs
        this.newsForm = document.getElementById('newsForm');
        this.searchInput = document.getElementById('searchNews');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.statusFilter = document.getElementById('statusFilter');
        this.dateFilter = document.getElementById('dateFilter');
        
        // File upload elements
        this.featuredImageInput = document.getElementById('featuredImage');
        this.galleryInput = document.getElementById('gallery');
        this.imagePreview = document.querySelector('.image-preview');
        this.galleryPreview = document.querySelector('.gallery-preview');
    }

    initializeQuillEditor() {
        this.quill = new Quill('#editor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'image', 'video'],
                    ['clean']
                ]
            },
            placeholder: 'Write your news article here...'
        });
    }

    initializeEventListeners() {
        // Create and bulk actions
        this.createBtn.addEventListener('click', () => this.openNewsModal());
        this.bulkActionsBtn.addEventListener('click', () => this.openBulkActionsModal());

        // View toggle
        this.viewButtons.forEach(button => {
            button.addEventListener('click', () => this.toggleView(button.dataset.view));
        });

        // Form submission
        this.newsForm.addEventListener('submit', (e) => this.handleNewsSubmit(e));

        // Filters
        this.searchInput.addEventListener('input', () => this.applyFilters());
        this.categoryFilter.addEventListener('change', () => this.applyFilters());
        this.statusFilter.addEventListener('change', () => this.applyFilters());
        this.dateFilter.addEventListener('change', () => this.applyFilters());

        // File uploads
        this.featuredImageInput.addEventListener('change', (e) => this.handleFeaturedImageUpload(e));
        this.galleryInput.addEventListener('change', (e) => this.handleGalleryUpload(e));

        // Modal controls
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', () => this.closeAllModals());
        });

        // Preview button
        document.getElementById('previewBtn').addEventListener('click', () => this.previewNews());

        // Save as draft
        document.getElementById('saveDraftBtn').addEventListener('click', () => this.saveAsDraft());

        // Select all checkbox
        this.selectAllCheckbox.addEventListener('change', (e) => this.handleSelectAll(e));

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });

        // Setup drag and drop
        this.setupDragAndDrop();
    }

    openNewsModal(newsItem = null) {
        this.resetForm();
        
        if (newsItem) {
            // Populate form for editing
            this.populateForm(newsItem);
            this.newsModal.querySelector('.modal-header h2').textContent = 'Edit News Article';
        } else {
            this.newsModal.querySelector('.modal-header h2').textContent = 'Create News Article';
        }

        this.newsModal.style.display = 'block';
    }

    closeAllModals() {
        this.newsModal.style.display = 'none';
        this.previewModal.style.display = 'none';
        this.bulkActionsModal.style.display = 'none';
    }

    resetForm() {
        this.newsForm.reset();
        this.quill.root.innerHTML = '';
        this.imagePreview.innerHTML = '';
        this.galleryPreview.innerHTML = '';
        this.featuredImage = null;
        this.galleryImages = [];
    }

    setupDragAndDrop() {
        const dropZones = document.querySelectorAll('.file-upload-label');

        dropZones.forEach(dropZone => {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });

            dropZone.addEventListener('dragenter', () => dropZone.classList.add('drag-over'));
            dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
            dropZone.addEventListener('drop', (e) => {
                dropZone.classList.remove('drag-over');
                const files = Array.from(e.dataTransfer.files);
                
                if (dropZone.getAttribute('for') === 'featuredImage') {
                    this.handleFeaturedImageUpload({ target: { files: [files[0]] } });
                } else {
                    this.handleGalleryUpload({ target: { files } });
                }
            });
        });
    }

    handleFeaturedImageUpload(e) {
        const file = e.target.files[0];
        if (file && this.validateImage(file)) {
            this.featuredImage = file;
            this.displayFeaturedImagePreview(file);
        }
    }

    handleGalleryUpload(e) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (this.validateImage(file)) {
                this.galleryImages.push(file);
                this.displayGalleryImagePreview(file);
            }
        });
    }

    validateImage(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            this.showNotification('Please upload only image files (JPEG, PNG, GIF)', 'error');
            return false;
        }

        if (file.size > maxSize) {
            this.showNotification('Image size should not exceed 5MB', 'error');
            return false;
        }

        return true;
    }

    displayFeaturedImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.imagePreview.innerHTML = `
                <div class="preview-item">
                    <img src="${e.target.result}" alt="Featured Image">
                    <button class="remove-file" onclick="newsManager.removeFeaturedImage()">×</button>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    }

    displayGalleryImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.createElement('div');
            preview.className = 'preview-item';
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Gallery Image">
                <button class="remove-file" data-name="${file.name}">×</button>
            `;
            
            preview.querySelector('.remove-file').addEventListener('click', () => {
                this.removeGalleryImage(file.name);
                preview.remove();
            });
            
            this.galleryPreview.appendChild(preview);
        };
        reader.readAsDataURL(file);
    }

    removeFeaturedImage() {
        this.featuredImage = null;
        this.imagePreview.innerHTML = '';
        this.featuredImageInput.value = '';
    }

    removeGalleryImage(fileName) {
        this.galleryImages = this.galleryImages.filter(image => image.name !== fileName);
    }

    async handleNewsSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) return;

        const formData = this.gatherFormData();

        try {
            await this.saveNews(formData);
            this.showNotification('News article saved successfully', 'success');
            this.closeAllModals();
            this.loadNews();
        } catch (error) {
            console.error('Error saving news:', error);
            this.showNotification('Error saving news article', 'error');
        }
    }

    validateForm() {
        const title = document.getElementById('title').value.trim();
        const content = this.quill.root.innerHTML.trim();

        if (!title) {
            this.showNotification('Please enter a title', 'error');
            return false;
        }

        if (!content || content === '<p><br></p>') {
            this.showNotification('Please enter content', 'error');
            return false;
        }

        return true;
    }

    gatherFormData() {
        return {
            id: Date.now().toString(),
            title: document.getElementById('title').value.trim(),
            category: document.getElementById('category').value,
            status: document.getElementById('status').value,
            excerpt: document.getElementById('excerpt').value.trim(),
            content: this.quill.root.innerHTML,
            tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(Boolean),
            featured: document.getElementById('featured').checked,
            allowComments: document.getElementById('comments').checked,
            author: 'Admin Name', // Replace with actual admin name
            createdAt: new Date().toISOString(),
            views: 0
        };
    }

    async saveNews(newsData) {
        this.news.push(newsData);
        localStorage.setItem('news', JSON.stringify(this.news));
    }

    async loadNews() {
        try {
            const stored = localStorage.getItem('news');
            this.news = stored ? JSON.parse(stored) : [];
            this.renderNews();
        } catch (error) {
            console.error('Error loading news:', error);
            this.showNotification('Error loading news articles', 'error');
        }
    }

    renderNews() {
        const filteredNews = this.getFilteredNews();
        
        if (this.currentView === 'list') {
            this.renderListView(filteredNews);
        } else {
            this.renderGridView(filteredNews);
        }
    }

    renderListView(newsItems) {
        const tbody = this.newsTable.querySelector('tbody');
        tbody.innerHTML = '';

        newsItems.forEach(news => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="news-checkbox" value="${news.id}"></td>
                <td>${news.title}</td>
                <td><span class="category-badge category-${news.category}">${news.category}</span></td>
                <td>${news.author}</td>
                <td>${news.status}</td>
                <td>${new Date(news.createdAt).toLocaleDateString()}</td>
                <td>${news.views}</td>
                <td>
                    <button class="btn-icon" onclick="newsManager.editNews('${news.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="newsManager.deleteNews('${news.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderGridView(newsItems) {
        this.newsGrid.innerHTML = '';

        newsItems.forEach(news => {
            const card = document.createElement('div');
            card.className = 'news-card';
            card.innerHTML = `
                <div class="news-card-image">
                    <!-- Add featured image here -->
                </div>
                <div class="news-card-content">
                    <h3>${news.title}</h3>
                    <p>${news.excerpt || ''}</p>
                    <div class="news-card-meta">
                        <span>${new Date(news.createdAt).toLocaleDateString()}</span>
                        <span>${news.views} views</span>
                    </div>
                    <div class="news-card-actions">
                        <button onclick="newsManager.editNews('${news.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="newsManager.deleteNews('${news.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            this.newsGrid.appendChild(card);
        });
    }

    toggleView(view) {
        this.currentView = view;
        this.viewButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.view === view);
        });
        
        this.newsTable.style.display = view === 'list' ? 'table' : 'none';
        this.newsGrid.style.display = view === 'grid' ? 'grid' : 'none';
    }

    getFilteredNews() {
        return this.news.filter(news => {
            const searchMatch = news.title.toLowerCase().includes(this.searchInput.value.toLowerCase());
            const categoryMatch = !this.categoryFilter.value || news.category === this.categoryFilter.value;
            const statusMatch = !this.statusFilter.value || news.status === this.statusFilter.value;
            const dateMatch = !this.dateFilter.value || 
                new Date(news.createdAt).toISOString().startsWith(this.dateFilter.value);
            
            return searchMatch && categoryMatch && statusMatch && dateMatch;
        });
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the News Manager
const newsManager = new NewsManager();