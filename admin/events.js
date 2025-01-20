// events.js - Combined admin and events functionality
class AdminEvents {
    constructor() {
        this.events = [];
        this.currentView = 'calendar';
        this.currentDate = new Date();
        this.quill = null;
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeQuillEditor();
        this.loadEvents();
        this.initializeAdminFeatures();
    }

    // Initialize DOM elements
    initializeElements() {
        // Admin elements
        this.sidebar = document.querySelector('.sidebar');
        this.notifications = document.querySelector('.notifications');
        this.adminProfile = document.querySelector('.admin-profile');
        this.searchBar = document.querySelector('.search-bar input');

        // Events elements
        this.createEventBtn = document.getElementById('createEventBtn');
        this.viewButtons = document.querySelectorAll('.view-btn');
        this.modal = document.getElementById('eventModal');
        this.closeModalBtn = document.querySelector('.close');
        this.calendarView = document.querySelector('.calendar-view');
        this.listView = document.querySelector('.list-view');
        this.calendarGrid = document.getElementById('calendarGrid');
        this.currentMonthElement = document.getElementById('currentMonth');
        this.prevMonthBtn = document.getElementById('prevMonth');
        this.nextMonthBtn = document.getElementById('nextMonth');
        this.eventForm = document.getElementById('eventForm');
        this.searchEvents = document.getElementById('searchEvents');
        this.categoryFilter = document.getElementById('filterCategory');
        this.dateFilter = document.getElementById('filterDate');
    }

    // Initialize admin features
    initializeAdminFeatures() {
        // Notifications dropdown
        this.notifications.addEventListener('click', () => {
            this.toggleNotifications();
        });

        // Admin profile dropdown
        this.adminProfile.addEventListener('click', () => {
            this.toggleProfileDropdown();
        });

        // Global search
        this.searchBar.addEventListener('input', (e) => {
            this.handleGlobalSearch(e.target.value);
        });

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

    // Initialize event listeners
    initializeEventListeners() {
        this.createEventBtn.addEventListener('click', () => this.openModal());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.eventForm.addEventListener('submit', (e) => this.handleEventSubmit(e));
        
        // View toggle listeners
        this.viewButtons.forEach(button => {
            button.addEventListener('click', () => this.toggleView(button.dataset.view));
        });

        // Calendar navigation
        this.prevMonthBtn.addEventListener('click', () => this.navigateMonth(-1));
        this.nextMonthBtn.addEventListener('click', () => this.navigateMonth(1));

        // Filter listeners
        this.searchEvents.addEventListener('input', () => this.applyFilters());
        this.categoryFilter.addEventListener('change', () => this.applyFilters());
        this.dateFilter.addEventListener('change', () => this.applyFilters());

        // Modal close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    // Initialize Quill editor
    initializeQuillEditor() {
        this.quill = new Quill('#eventDescription', {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                ]
            }
        });
    }

    // Admin Features Methods
    toggleNotifications() {
        const dropdown = document.createElement('div');
        dropdown.className = 'notification-dropdown';
        dropdown.innerHTML = `
            <div class="notification-header">
                <h3>Notifications</h3>
                <span class="mark-all-read">Mark all as read</span>
            </div>
            <div class="notification-list">
                <div class="notification-item">
                    <i class="fas fa-user-plus"></i>
                    <div class="notification-content">
                        <p>New user registration</p>
                        <span>2 minutes ago</span>
                    </div>
                </div>
                <!-- Add more notification items as needed -->
            </div>
        `;
        this.notifications.appendChild(dropdown);
    }

    closeNotifications() {
        const dropdown = this.notifications.querySelector('.notification-dropdown');
        if (dropdown) {
            dropdown.remove();
        }
    }

    toggleProfileDropdown() {
        const dropdown = document.createElement('div');
        dropdown.className = 'profile-dropdown';
        dropdown.innerHTML = `
            <a href="#" class="dropdown-item"><i class="fas fa-user"></i> My Profile</a>
            <a href="#" class="dropdown-item"><i class="fas fa-cog"></i> Settings</a>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item"><i class="fas fa-sign-out-alt"></i> Logout</a>
        `;
        this.adminProfile.appendChild(dropdown);
    }

    closeProfileDropdown() {
        const dropdown = this.adminProfile.querySelector('.profile-dropdown');
        if (dropdown) {
            dropdown.remove();
        }
    }

    handleGlobalSearch(query) {
        // Implement global search functionality
        console.log('Global search:', query);
    }

    // Events Management Methods
    async loadEvents() {
        try {
            const storedEvents = localStorage.getItem('events');
            this.events = storedEvents ? JSON.parse(storedEvents) : [];
            this.renderCurrentView();
        } catch (error) {
            console.error('Error loading events:', error);
            this.showNotification('Error loading events', 'error');
        }
    }

    renderCurrentView() {
        if (this.currentView === 'calendar') {
            this.renderCalendarView();
        } else {
            this.renderListView();
        }
    }

    renderCalendarView() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        this.currentMonthElement.textContent = new Date(year, month).toLocaleString('default', { 
            month: 'long', 
            year: 'numeric' 
        });

        this.calendarGrid.innerHTML = '';

        // Add day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-header-day';
            dayHeader.textContent = day;
            this.calendarGrid.appendChild(dayHeader);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Add blank cells for days before start of month
        for (let i = 0; i < firstDay; i++) {
            this.calendarGrid.appendChild(this.createCalendarDay());
        }

        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = this.createCalendarDay(day);
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            // Add events for this day
            const dayEvents = this.events.filter(event => event.date.startsWith(dateStr));
            dayEvents.forEach(event => {
                const eventElement = this.createEventElement(event);
                dayCell.appendChild(eventElement);
            });

            this.calendarGrid.appendChild(dayCell);
        }
    }

    createCalendarDay(day = '') {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        if (day) {
            dayCell.innerHTML = `<span class="day-number">${day}</span>`;
        }
        return dayCell;
    }

    createEventElement(event) {
        const eventElement = document.createElement('div');
        eventElement.className = 'calendar-event';
        eventElement.style.backgroundColor = this.getCategoryColor(event.category);
        eventElement.textContent = event.title;
        eventElement.addEventListener('click', () => this.openModal(event));
        return eventElement;
    }

    renderListView() {
        const tbody = document.querySelector('#eventsTable tbody');
        tbody.innerHTML = '';

        const filteredEvents = this.getFilteredEvents();
        
        filteredEvents.forEach(event => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.title}</td>
                <td>${new Date(event.date).toLocaleString()}</td>
                <td>${event.category}</td>
                <td>${event.status}</td>
                <td>
                    <button onclick="eventsManager.openModal('${event.id}')" class="btn-edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="eventsManager.deleteEvent('${event.id}')" class="btn-delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getFilteredEvents() {
        return this.events.filter(event => {
            const searchMatch = event.title.toLowerCase().includes(this.searchEvents.value.toLowerCase());
            const categoryMatch = !this.categoryFilter.value || event.category === this.categoryFilter.value;
            const dateMatch = !this.dateFilter.value || event.date.startsWith(this.dateFilter.value);
            return searchMatch && categoryMatch && dateMatch;
        });
    }

    openModal(event = null) {
        this.modal.style.display = 'block';
        if (event) {
            document.getElementById('eventTitle').value = event.title;
            document.getElementById('eventDate').value = event.date;
            document.getElementById('eventCategory').value = event.category;
            this.quill.root.innerHTML = event.description;
            this.eventForm.dataset.eventId = event.id;
        } else {
            this.eventForm.reset();
            this.quill.root.innerHTML = '';
            delete this.eventForm.dataset.eventId;
        }
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    async handleEventSubmit(e) {
        e.preventDefault();
        
        const eventData = {
            id: this.eventForm.dataset.eventId || Date.now().toString(),
            title: document.getElementById('eventTitle').value,
            date: document.getElementById('eventDate').value,
            category: document.getElementById('eventCategory').value,
            description: this.quill.root.innerHTML,
            status: 'active'
        };

        try {
            await this.saveEvent(eventData);
            this.closeModal();
            this.renderCurrentView();
            this.showNotification('Event saved successfully', 'success');
        } catch (error) {
            console.error('Error saving event:', error);
            this.showNotification('Error saving event', 'error');
        }
    }

    async saveEvent(eventData) {
        const eventIndex = this.events.findIndex(e => e.id === eventData.id);
        if (eventIndex >= 0) {
            this.events[eventIndex] = eventData;
        } else {
            this.events.push(eventData);
        }
        localStorage.setItem('events', JSON.stringify(this.events));
    }

    async deleteEvent(eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            try {
                this.events = this.events.filter(e => e.id !== eventId);
                localStorage.setItem('events', JSON.stringify(this.events));
                this.renderCurrentView();
                this.showNotification('Event deleted successfully', 'success');
            } catch (error) {
                console.error('Error deleting event:', error);
                this.showNotification('Error deleting event', 'error');
            }
        }
    }

    toggleView(view) {
        this.currentView = view;
        this.viewButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.view === view);
        });
        this.calendarView.style.display = view === 'calendar' ? 'block' : 'none';
        this.listView.style.display = view === 'list' ? 'block' : 'none';
        this.renderCurrentView();
    }

    navigateMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendarView();
    }

    getCategoryColor(category) {
        const colors = {
            meeting: '#FFD700',
            ceremony: '#FF6B6B',
            celebration: '#4CAF50'
        };
        return colors[category] || '#00D094';
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the Events Manager
const eventsManager = new AdminEvents();