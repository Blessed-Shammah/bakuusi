document.addEventListener('DOMContentLoaded', function() {
    // Initialize all major functions
    initSlideshow();
    initMobileMenu();
    initNotices();
    initUpcomingEvents();
    initNewsGrid();
});

// Slideshow Variables
let slideIndex = 1;
let slideInterval;

// Slideshow Functions
function initSlideshow() {
    showSlides(slideIndex);
    startAutoSlide();
}

function startAutoSlide() {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

function changeSlide(n) {
    stopAutoSlide();
    showSlides(slideIndex += n);
    startAutoSlide();
}

function currentSlide(n) {
    stopAutoSlide();
    showSlides(slideIndex = n);
    startAutoSlide();
}

function showSlides(n) {
    let slides = document.getElementsByClassName("slides");
    let dots = document.getElementsByClassName("dot");
    
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    
    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    
    // Deactivate all dots
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    
    // Show current slide and activate corresponding dot
    slides[slideIndex-1].classList.add("active");
    dots[slideIndex-1].classList.add("active");
}

// Mobile Menu Functions
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    
    hamburger.addEventListener('click', () => {
        menu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// Sample Data for Notices
const noticesData = [
    {
        title: 'Monthly Clan Meeting',
        date: 'February 15, 2024',
        description: 'Join us for our monthly gathering to discuss clan matters and future plans.',
        location: 'Main Hall'
    },
    {
        title: 'Cultural Festival',
        date: 'March 1, 2024',
        description: 'Annual cultural celebration featuring traditional performances and ceremonies.',
        location: 'Clan Grounds'
    },
    {
        title: 'Youth Workshop',
        date: 'March 10, 2024',
        description: 'Special workshop for young clan members to learn about our heritage and traditions.',
        location: 'Learning Center'
    }
];

// Initialize Notices Section
function initNotices() {
    const cardGrid = document.querySelector('.card-grid');
    
    noticesData.forEach(notice => {
        const card = createNoticeCard(notice);
        cardGrid.appendChild(card);
    });
}

function createNoticeCard(notice) {
    const card = document.createElement('div');
    card.classList.add('notice-card');
    
    card.innerHTML = `
        <h3>${notice.title}</h3>
        <div class="notice-info">
            <p class="date"><i class="far fa-calendar"></i> ${notice.date}</p>
            <p class="location"><i class="fas fa-map-marker-alt"></i> ${notice.location}</p>
        </div>
        <p class="description">${notice.description}</p>
        <button class="primary-btn glow-effect">Learn More</button>
    `;
    
    return card;
}

// Sample Data for Upcoming Events
const upcomingEventsData = [
    {
        title: 'Elders Council Meeting',
        date: 'February 20, 2024',
        time: '10:00 AM'
    },
    {
        title: 'Youth Sports Day',
        date: 'February 25, 2024',
        time: '2:00 PM'
    },
    {
        title: 'Traditional Dance Practice',
        date: 'March 5, 2024',
        time: '4:00 PM'
    }
];

// Initialize Upcoming Events
function initUpcomingEvents() {
    const eventsList = document.querySelector('.events-list');
    
    upcomingEventsData.forEach(event => {
        const eventItem = createEventItem(event);
        eventsList.appendChild(eventItem);
    });
}

function createEventItem(event) {
    const eventItem = document.createElement('div');
    eventItem.classList.add('event-item');
    
    eventItem.innerHTML = `
        <h4>${event.title}</h4>
        <p><i class="far fa-calendar"></i> ${event.date}</p>
        <p><i class="far fa-clock"></i> ${event.time}</p>
    `;
    
    return eventItem;
}

// News Section

function initNewsScroll() {
    const scrollContainer = document.querySelector('.news-scroll-wrapper');
    const scrollContent = document.querySelector('.news-grid');
    const btnLeft = document.getElementById('scrollLeft');
    const btnRight = document.getElementById('scrollRight');
    
    // Scroll amount for each button click
    const scrollAmount = 300;
    
    // Update scroll buttons state
    function updateScrollButtons() {
        const scrollLeft = scrollContainer.scrollLeft;
        const maxScroll = scrollContent.scrollWidth - scrollContainer.clientWidth;
        
        btnLeft.disabled = scrollLeft <= 0;
        btnRight.disabled = scrollLeft >= maxScroll;
    }
    
    // Scroll left
    btnLeft.addEventListener('click', () => {
        scrollContainer.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Scroll right
    btnRight.addEventListener('click', () => {
        scrollContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Update buttons on scroll
    scrollContainer.addEventListener('scroll', updateScrollButtons);
    
    // Initial button state
    updateScrollButtons();
    
    // Touch scroll functionality
    let isDown = false;
    let startX;
    let scrollLeft;

    scrollContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mouseleave', () => {
        isDown = false;
    });

    scrollContainer.addEventListener('mouseup', () => {
        isDown = false;
    });

    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainer.scrollLeft = scrollLeft - walk;
    });
}

// Update your existing newsData array with more items for scrolling
const newsData = [
    {
        title: 'New Family Members Welcome Ceremony',
        date: 'February 10, 2024',
        image: 'images/news1.jpg',
        excerpt: 'Celebrating the addition of new members to our clan family.'
    },
    {
        title: 'Heritage Preservation Project',
        date: 'February 5, 2024',
        image: 'images/news2.jpg',
        excerpt: 'Launch of new initiative to document and preserve clan history.'
    },
    {
        title: 'Community Outreach Success',
        date: 'January 30, 2024',
        image: 'images/news3.jpg',
        excerpt: 'Recent community service project receives recognition.'
    },
    {
        title: 'Community Outreach Success',
        date: 'January 30, 2024',
        image: 'images/news3.jpg',
        excerpt: 'Recent community service project receives recognition.'
    },
    {
        title: 'Community Outreach Success',
        date: 'January 30, 2024',
        image: 'images/news3.jpg',
        excerpt: 'Recent community service project receives recognition.'
    },
    {
        title: 'Community Outreach Success',
        date: 'January 30, 2024',
        image: 'images/news3.jpg',
        excerpt: 'Recent community service project receives recognition.'
    },
    // Add more news items...
];

// Initialize the news scroll when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initNewsScroll();
});

// Initialize News Grid
function initNewsGrid() {
    const newsGrid = document.querySelector('.news-grid');
    
    newsData.forEach(news => {
        const newsCard = createNewsCard(news);
        newsGrid.appendChild(newsCard);
    });
}

function createNewsCard(news) {
    const newsCard = document.createElement('div');
    newsCard.classList.add('news-card');
    
    newsCard.innerHTML = `
        <div class="news-image">
            <img src="${news.image}" alt="${news.title}">
        </div>
        <div class="news-content">
            <h3>${news.title}</h3>
            <p class="date">${news.date}</p>
            <p class="excerpt">${news.excerpt}</p>
            <button class="secondary-btn glow-effect">Read More</button>
        </div>
    `;
    
    return newsCard;
}

// Form Handling
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    // Add your newsletter subscription logic here
    alert(`Thank you for subscribing with: ${email}`);
    this.reset();
});

// Add smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});