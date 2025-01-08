document.addEventListener('DOMContentLoaded', function() {
    // Sample events data
    const events = [
        {
            id: 1,
            category: 'cultural',
            image: 'images/event1.jpg',
            title: 'Annual Cultural Festival',
            date: '2023-09-15',
            description: 'Celebrating our rich cultural heritage'
        },
        {
            id: 2,
            category: 'meetings',
            image: 'images/event2.jpg',
            title: 'Clan Assembly',
            date: '2023-09-20',
            description: 'Monthly clan meeting and discussions'
        },
        {
            id: 3,
            category: 'celebrations',
            image: 'images/event3.jpg',
            title: 'Heritage Day',
            date: '2023-09-25',
            description: 'Celebrating our ancestors and traditions'
        },
        {
            id: 4,
            category: 'community',
            image: 'images/event4.jpg',
            title: 'Community Outreach',
            date: '2023-09-30',
            description: 'Supporting our local community'
        },
        {
            id: 5,
            category: 'cultural',
            image: 'images/event5.jpg',
            title: 'Traditional Dance',
            date: '2023-10-05',
            description: 'Showcasing our traditional dances'
        },
        {
            id: 6,
            category: 'meetings',
            image: 'images/event6.jpg',
            title: 'Youth Forum',
            date: '2023-10-10',
            description: 'Engaging our youth in clan activities'
        },
        {
            id: 7,
            category: 'celebrations',
            image: 'images/event7.jpg',
            title: 'Harvest Festival',
            date: '2023-10-15',
            description: 'Annual harvest celebration'
        },
        {
            id: 8,
            category: 'cultural',
            image: 'images/event8.jpg',
            title: 'Cultural Exhibition',
            date: '2023-10-20',
            description: 'Showcasing our cultural artifacts'
        },
        {
            id: 9,
            category: 'meetings',
            image: 'images/event9.jpg',
            title: 'Elders Council',
            date: '2023-10-25',
            description: 'Monthly council meeting'
        },
        {
            id: 10,
            category: 'community',
            image: 'images/event10.jpg',
            title: 'Community Service',
            date: '2023-10-30',
            description: 'Giving back to the community'
        }
    ];

    // DOM Elements
    const galleryGrid = document.querySelector('.gallery-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    // Mobile Menu Toggle
    if (hamburger && menu) {
        hamburger.addEventListener('click', () => {
            menu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.hamburger') && !e.target.closest('.menu')) {
                menu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }

    // Gallery Filter Function
    function filterGallery(category) {
        galleryGrid.innerHTML = '';
        const filteredEvents = category === 'all' 
            ? events 
            : events.filter(event => event.category === category);

        filteredEvents.forEach(event => {
            const item = document.createElement('div');
            item.className = 'gallery-item fade-in';
            item.innerHTML = `
                <img src="${event.image}" alt="${event.title}">
                <div class="overlay">
                    <h4>${event.title}</h4>
                    <p>${event.description}</p>
                    <span class="date">${formatDate(event.date)}</span>
                </div>
            `;
            galleryGrid.appendChild(item);
        });

        // Add scroll indicator if there are more than 6 items
        // if (filteredEvents.length > 6) {
        //     const indicator = document.createElement('div');
        //     indicator.className = 'scroll-indicator';
        //     indicator.innerHTML = `<span>Scroll to see more events</span>`;
        //     galleryGrid.appendChild(indicator);
        // }
    }

    // Filter Button Event Listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterGallery(button.dataset.category);
        });
    });

    // Calendar Functionality
    const calendar = {
        currentDate: new Date(),
        selectedDate: new Date()
    };

    function renderCalendar() {
        const calendarGrid = document.querySelector('.calendar-grid');
        const currentMonth = document.getElementById('currentMonth');
        
        const firstDay = new Date(calendar.currentDate.getFullYear(), calendar.currentDate.getMonth(), 1);
        const lastDay = new Date(calendar.currentDate.getFullYear(), calendar.currentDate.getMonth() + 1, 0);
        
        currentMonth.textContent = calendar.currentDate.toLocaleString('default', { 
            month: 'long', 
            year: 'numeric' 
        });

        calendarGrid.innerHTML = '';

        // Add day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            const dateStr = `${calendar.currentDate.getFullYear()}-${(calendar.currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            if (events.some(event => event.date === dateStr)) {
                dayElement.classList.add('has-event');
                dayElement.addEventListener('click', () => showEventsForDate(dateStr));
            }

            calendarGrid.appendChild(dayElement);
        }
    }

    // Calendar Navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
        calendar.currentDate.setMonth(calendar.currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        calendar.currentDate.setMonth(calendar.currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Show events for selected date
    function showEventsForDate(dateStr) {
        const eventsList = document.getElementById('eventsList');
        const dayEvents = events.filter(event => event.date === dateStr);
        
        eventsList.innerHTML = dayEvents.map(event => `
            <div class="event-item">
                <div class="event-date">${formatDate(event.date)}</div>
                <div class="event-details">
                    <h5>${event.title}</h5>
                    <p>${event.description}</p>
                </div>
            </div>
        `).join('');
    }

    // Lightbox Functionality
    galleryGrid.addEventListener('click', (e) => {
        const galleryItem = e.target.closest('.gallery-item');
        if (galleryItem) {
            const img = galleryItem.querySelector('img');
            lightbox.style.display = 'block';
            lightboxImg.src = img.src;
        }
    });

    document.querySelector('.close').addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });

    // Handle ESC key to close lightbox
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            lightbox.style.display = 'none';
        }
    });

    // Update breadcrumb based on current page
    function updateBreadcrumb() {
        const currentPath = window.location.pathname;
        const breadcrumbLinks = document.querySelectorAll('.breadcrumb a');
        
        breadcrumbLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath.split('/').pop()) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Helper function to format dates
    function formatDate(dateStr) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    }

    // Initialize
    filterGallery('all');
    renderCalendar();
    updateBreadcrumb();
});