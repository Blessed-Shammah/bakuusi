document.addEventListener('DOMContentLoaded', function() {
    // Sample news data
    const newsData = [
        {
            id: 1,
            category: 'announcements',
            featured: true,
            title: 'Annual Clan Meeting Announcement',
            excerpt: 'Join us for our annual clan gathering where we\'ll discuss important matters and celebrate our heritage.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            image: 'images/news1.jpg',
            date: '2023-10-15',
            author: 'Clan Secretary'
        },
        {
            id: 2,
            category: 'family',
            featured: true,
            title: 'Celebrating New Additions to Our Clan',
            excerpt: 'We warmly welcome the newest members of our clan family and celebrate their arrival.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            image: 'images/news2.jpg',
            date: '2023-10-12',
            author: 'Family Committee'
        },
        {
            id: 4,
            category: 'announcements',
            featured: false,
            title: 'Education Fund Launch',
            excerpt: 'New scholarship program launched to support clan members in their educational pursuits.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. The scholarship program aims to support higher education.',
            image: 'images/news4.jpg',
            date: '2023-10-05',
            author: 'Education Committee'
        },
        {
            id: 5,
            category: 'community',
            featured: false,
            title: 'Community Service Initiative',
            excerpt: 'Clan members participated in local community service projects, making a positive impact.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Our members helped clean local parks and assist elderly residents.',
            image: 'images/news5.jpg',
            date: '2023-10-03',
            author: 'Community Outreach Team'
        },
        {
            id: 6,
            category: 'family',
            featured: false,
            title: 'Annual Sports Tournament',
            excerpt: 'Exciting competitions and games brought clan members together for a day of fun and fellowship.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. The tournament included traditional and modern sports.',
            image: 'images/news6.jpg',
            date: '2023-09-30',
            author: 'Sports Committee'
        },
        {
            id: 7,
            category: 'community',
            featured: false,
            title: 'Health Awareness Camp',
            excerpt: 'Free health check-ups and awareness sessions organized for clan members and local community.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Medical professionals from our clan provided free consultations.',
            image: 'images/news7.jpg',
            date: '2023-09-28',
            author: 'Health Committee'
        },
        {
            id: 8,
            category: 'announcements',
            featured: false,
            title: 'Youth Leadership Program',
            excerpt: 'New initiative launched to develop leadership skills among young clan members.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. The program includes mentorship and practical leadership training.',
            image: 'images/news8.jpg',
            date: '2023-09-25',
            author: 'Youth Development Team'
        },
        {
            id: 9,
            category: 'cultural',
            featured: false,
            title: 'Traditional Dance Performance',
            excerpt: 'Clan members showcased our cultural heritage through traditional dance performances.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. The event celebrated our rich cultural dance traditions.',
            image: 'images/news9.jpg',
            date: '2023-09-22',
            author: 'Cultural Committee'
        },
        {
            id: 10,
            category: 'family',
            featured: false,
            title: 'Elders Recognition Day',
            excerpt: 'Special ceremony held to honor and recognize the contributions of our clan elders.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. The ceremony included traditional blessings and sharing of wisdom.',
            image: 'images/news10.jpg',
            date: '2023-09-20',
            author: 'Council of Elders'
        }
        
        // Add more news items as needed
    ];

    // DOM Elements
    const featuredNewsGrid = document.querySelector('.featured-news-grid');
    const newsGrid = document.querySelector('.news-grid');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');

    // State management
    let currentPage = 1;
    const itemsPerPage = 6;
    let currentCategory = 'all';

    // Mobile menu toggle
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

    // Render featured news
    function renderFeaturedNews() {
        const featuredNews = newsData.filter(item => item.featured);
        featuredNewsGrid.innerHTML = featuredNews.map(news => `
            <article class="featured-news-item fade-in">
                <div class="featured-news-image">
                    <img src="${news.image}" alt="${news.title}">
                </div>
                <div class="featured-news-content">
                    <h3>${news.title}</h3>
                    <p>${news.excerpt}</p>
                    <div class="news-meta">
                        <span class="date"><i class="far fa-calendar"></i> ${formatDate(news.date)}</span>
                        <span class="author"><i class="far fa-user"></i> ${news.author}</span>
                    </div>
                    <button class="read-more-btn" data-id="${news.id}">
                        Read More <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </article>
        `).join('');
    }

    // Render news grid
    function renderNewsGrid(page = 1, category = 'all') {
        let filteredNews = category === 'all' 
            ? newsData.filter(item => !item.featured)
            : newsData.filter(item => !item.featured && item.category === category);

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const newsToShow = filteredNews.slice(startIndex, endIndex);

        const newsHTML = newsToShow.map(news => `
            <article class="news-card fade-in">
                <div class="news-image">
                    <img src="${news.image}" alt="${news.title}">
                </div>
                <div class="news-content">
                    <h3>${news.title}</h3>
                    <p>${news.excerpt}</p>
                    <div class="news-meta">
                        <span class="date"><i class="far fa-calendar"></i> ${formatDate(news.date)}</span>
                    </div>
                    <a href="#" class="read-more-btn" data-id="${news.id}">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `).join('');

        if (page === 1) {
            newsGrid.innerHTML = newsHTML;
        } else {
            newsGrid.insertAdjacentHTML('beforeend', newsHTML);
        }

        // Show/hide load more button
        loadMoreBtn.style.display = endIndex < filteredNews.length ? 'block' : 'none';
    }

    // Category filter functionality
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = button.dataset.category;
            currentPage = 1;
            renderNewsGrid(currentPage, currentCategory);
        });
    });

    // Load more functionality
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderNewsGrid(currentPage, currentCategory);
    });

    // Expand/collapse news content
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('read-more') || e.target.classList.contains('read-more-btn')) {
            e.preventDefault();
            const newsId = e.target.dataset.id;
            const newsItem = newsData.find(item => item.id === parseInt(newsId));
            
            if (newsItem) {
                showNewsModal(newsItem);
            }
        }
    });

    // News modal functionality
    function showNewsModal(news) {
        const modal = document.createElement('div');
        modal.className = 'news-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img src="${news.image}" alt="${news.title}">
                <h2>${news.title}</h2>
                <div class="modal-meta">
                    <span><i class="far fa-calendar"></i> ${formatDate(news.date)}</span>
                    <span><i class="far fa-user"></i> ${news.author}</span>
                </div>
                <div class="modal-body">
                    ${news.content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);

        // Close modal functionality
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            }
        });
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            // Add your newsletter subscription logic here
            alert(`Thank you for subscribing with: ${email}`);
            newsletterForm.reset();
        });
    }

    // Helper function to format dates
    function formatDate(dateStr) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    }

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

    // Initialize the page
    renderFeaturedNews();
    renderNewsGrid();
    updateBreadcrumb();
});

// Add these styles to your CSS file for the modal
const modalStyles = `
.news-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1000;
}

.news-modal.show {
    opacity: 1;
}

.modal-content {
    background: white;
    padding: 30px;
    border-radius: 15px;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    transform: translateY(20px);
    transition: transform 0.3s ease;
}

.news-modal.show .modal-content {
    transform: translateY(0);
}

.close-modal {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 30px;
    cursor: pointer;
    color: #333;
}

.modal-content img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 20px;
}

.modal-meta {
    margin: 15px 0;
    color: #666;
}

.modal-meta span {
    margin-right: 20px;
}

.modal-body {
    line-height: 1.8;
}

@media (max-width: 768px) {
    .modal-content {
        padding: 20px;
    }
    
    .modal-content img {
        height: 200px;
    }
}
`;

// Add the modal styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);