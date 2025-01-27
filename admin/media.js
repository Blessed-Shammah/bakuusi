class MediaGallery {
    constructor() {
        this.mediaItems = [];
        this.albums = [];
        this.selectedItems = new Set();
        this.selectedFiles = new Set();
        this.currentView = 'grid';
        this.currentAlbum = null;
        this.initializeElements();
        this.initializeEventListeners();
        this.loadMedia();
        this.loadAlbums();
    }

    initializeElements() {
        // Main containers
        this.mediaGrid = document.getElementById('mediaGrid');
        this.mediaList = document.getElementById('mediaList');
        this.albumsContainer = document.getElementById('albumsContainer');

        // Modals
        this.uploadModal = document.getElementById('uploadModal');
        this.albumModal = document.getElementById('albumModal');
        this.previewModal = document.getElementById('previewModal');

        // Upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.uploadList = document.getElementById('uploadList');

        // Filters and controls
        this.filterType = document.getElementById('filterType');
        this.sortBy = document.getElementById('sortBy');
        this.viewButtons = document.querySelectorAll('.view-btn');
        this.searchInput = document.querySelector('.search-bar input');
    }

    initializeEventListeners() {
        // View toggle
        this.viewButtons.forEach(button => {
            button.addEventListener('click', () => this.toggleView(button.dataset.view));
        });

        // File input change
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Filters
        this.filterType.addEventListener('change', () => this.applyFilters());
        this.sortBy.addEventListener('change', () => this.applyFilters());
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Setup drag and drop
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        this.uploadArea.addEventListener('dragenter', () => {
            this.uploadArea.classList.add('drag-over');
        });

        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('drag-over');
        });

        this.uploadArea.addEventListener('drop', (e) => {
            this.uploadArea.classList.remove('drag-over');
            const files = Array.from(e.dataTransfer.files);
            this.handleFileSelect({ target: { files } });
        });
    }

    async loadMedia() {
        try {
            const storedMedia = localStorage.getItem('mediaItems');
            this.mediaItems = storedMedia ? JSON.parse(storedMedia) : [];
            this.renderMedia();
        } catch (error) {
            this.showNotification('Error loading media', 'error');
        }
    }

    async loadAlbums() {
        try {
            const storedAlbums = localStorage.getItem('albums');
            this.albums = storedAlbums ? JSON.parse(storedAlbums) : [];
            this.renderAlbums();
        } catch (error) {
            this.showNotification('Error loading albums', 'error');
        }
    }

    renderMedia() {
        const filteredMedia = this.getFilteredMedia();
        if (this.currentView === 'grid') {
            this.renderGridView(filteredMedia);
        } else {
            this.renderListView(filteredMedia);
        }
    }

    renderGridView(media) {
        this.mediaGrid.innerHTML = '';
        media.forEach(item => {
            const mediaElement = document.createElement('div');
            mediaElement.className = 'media-item';
            mediaElement.innerHTML = `
                <div class="media-preview">
                    ${this.getMediaPreview(item)}
                    <div class="media-overlay">
                        <button class="btn-icon" onclick="mediaGallery.previewMedia('${item.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="mediaGallery.downloadMedia('${item.id}')">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="btn-icon" onclick="mediaGallery.deleteMedia('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="media-info">
                    <div class="media-name">${item.name}</div>
                    <div class="media-meta">
                        <span>${this.formatFileSize(item.size)}</span>
                        <span>${new Date(item.dateAdded).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
            this.mediaGrid.appendChild(mediaElement);
        });
    }

    renderListView(media) {
        const tbody = this.mediaList.querySelector('tbody');
        tbody.innerHTML = '';
        media.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" value="${item.id}"></td>
                <td>
                    <div class="media-name-cell">
                        <i class="fas ${this.getFileIcon(item.type)}"></i>
                        ${item.name}
                    </div>
                </td>
                <td>${item.type}</td>
                <td>${this.formatFileSize(item.size)}</td>
                <td>${new Date(item.dateAdded).toLocaleDateString()}</td>
                <td>
                    <button class="btn-icon" onclick="mediaGallery.previewMedia('${item.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="mediaGallery.downloadMedia('${item.id}')">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn-icon" onclick="mediaGallery.deleteMedia('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderAlbums() {
        this.albumsContainer.innerHTML = '';
        this.albums.forEach(album => {
            const albumElement = document.createElement('div');
            albumElement.className = 'album-card';
            albumElement.innerHTML = `
                <div class="album-preview">
                    <i class="fas fa-folder"></i>
                </div>
                <div class="album-info">
                    <h3>${album.name}</h3>
                    <span>${album.itemCount || 0} items</span>
                </div>
            `;
            this.albumsContainer.appendChild(albumElement);
        });
    }

    openUploadModal() {
        this.uploadModal.style.display = 'block';
        this.selectedFiles.clear();
        this.uploadList.innerHTML = '';
    }

    openAlbumModal() {
        this.albumModal.style.display = 'block';
        document.getElementById('albumForm').reset();
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
        if (modalId === 'uploadModal') {
            this.selectedFiles.clear();
            this.uploadList.innerHTML = '';
        }
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (this.validateFile(file)) {
                this.selectedFiles.add(file);
                this.addFileToUploadList(file);
            }
        });
    }

    validateFile(file) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'video/mp4',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (file.size > maxSize) {
            this.showNotification(`File ${file.name} is too large. Maximum size is 10MB`, 'error');
            return false;
        }

        if (!allowedTypes.includes(file.type)) {
            this.showNotification(`File type ${file.type} is not supported`, 'error');
            return false;
        }

        return true;
    }

    addFileToUploadList(file) {
        const listItem = document.createElement('div');
        listItem.className = 'upload-item';
        listItem.innerHTML = `
            <div class="upload-item-preview">
                ${file.type.startsWith('image/') 
                    ? `<img src="${URL.createObjectURL(file)}" alt="${file.name}">` 
                    : `<i class="fas ${this.getFileIcon(file.type)}"></i>`}
            </div>
            <div class="upload-item-info">
                <div class="upload-item-name">${file.name}</div>
                <div class="upload-item-size">${this.formatFileSize(file.size)}</div>
            </div>
            <button class="btn-icon" onclick="mediaGallery.removeFileFromUpload('${file.name}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        this.uploadList.appendChild(listItem);
    }

    removeFileFromUpload(fileName) {
        this.selectedFiles.forEach(file => {
            if (file.name === fileName) {
                this.selectedFiles.delete(file);
            }
        });
        
        const items = this.uploadList.getElementsByClassName('upload-item');
        for (let item of items) {
            if (item.querySelector('.upload-item-name').textContent === fileName) {
                item.remove();
                break;
            }
        }
    }

    async uploadFiles() {
        if (this.selectedFiles.size === 0) {
            this.showNotification('Please select files to upload', 'error');
            return;
        }

        try {
            const uploadPromises = Array.from(this.selectedFiles).map(file => this.uploadFile(file));
            await Promise.all(uploadPromises);
            
            this.showNotification('Files uploaded successfully', 'success');
            this.closeModal('uploadModal');
            this.loadMedia();
        } catch (error) {
            this.showNotification('Error uploading files', 'error');
        }
    }

    async uploadFile(file) {
        // Simulate file upload - replace with actual API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const mediaItem = {
                    id: Date.now().toString(),
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    url: URL.createObjectURL(file),
                    dateAdded: new Date().toISOString()
                };

                this.mediaItems.push(mediaItem);
                localStorage.setItem('mediaItems', JSON.stringify(this.mediaItems));
                resolve(mediaItem);
            }, 1000);
        });
    }

    async createAlbum(event) {
        event.preventDefault();
        
        const name = document.getElementById('albumName').value;
        const description = document.getElementById('albumDescription').value;

        const album = {
            id: Date.now().toString(),
            name: name.trim(),
            description: description.trim(),
            dateCreated: new Date().toISOString(),
            itemCount: 0,
            items: []
        };

        try {
            this.albums.push(album);
            localStorage.setItem('albums', JSON.stringify(this.albums));
            this.showNotification('Album created successfully', 'success');
            this.closeModal('albumModal');
            this.renderAlbums();
        } catch (error) {
            this.showNotification('Error creating album', 'error');
        }
    }

    getFileIcon(fileType) {
        if (fileType.startsWith('image/')) return 'fa-image';
        if (fileType.startsWith('video/')) return 'fa-video';
        if (fileType === 'application/pdf') return 'fa-file-pdf';
        if (fileType.includes('word')) return 'fa-file-word';
        return 'fa-file';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

    toggleView(view) {
        this.currentView = view;
        this.viewButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.view === view);
        });
        
        this.mediaGrid.style.display = view === 'grid' ? 'grid' : 'none';
        this.mediaList.style.display = view === 'list' ? 'block' : 'none';
    }

    getFilteredMedia() {
        let filtered = [...this.mediaItems];

        // Apply type filter
        if (this.filterType.value !== 'all') {
            filtered = filtered.filter(item => item.type.startsWith(this.filterType.value));
        }

        // Apply search filter
        const searchTerm = this.searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(item => 
                item.name.toLowerCase().includes(searchTerm)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.sortBy.value) {
                case 'date-desc':
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
                case 'date-asc':
                    return new Date(a.dateAdded) - new Date(b.dateAdded);
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'size':
                    return b.size - a.size;
                default:
                    return 0;
            }
        });

        return filtered;
    }

    applyFilters() {
        this.renderMedia();
    }

    handleSearch(value) {
        this.renderMedia();
    }
}

// Initialize the Media Gallery
const mediaGallery = new MediaGallery();