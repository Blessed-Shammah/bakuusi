// history.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeMobileMenu();
    populateTimeline();
    populatePersonalities();
    populateDownloads();
    addScrollAnimation();
    setupEventListeners();
    setupSearch();
});

// Mobile Menu Toggle
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    
    if (hamburger && menu) {
        hamburger.addEventListener('click', function() {
            menu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.querySelector('#searchInput');
    const searchBtn = document.querySelector('#searchBtn');
    const treeNodes = document.querySelectorAll('.tree li a');

    if (!searchInput || !searchBtn) return;

    function performSearch(term) {
        const searchTerm = term.toLowerCase();
        
        treeNodes.forEach(node => {
            const text = node.textContent.toLowerCase();
            const li = node.closest('li');
            
            if (searchTerm === '') {
                li.style.opacity = '1';
            } else {
                li.style.opacity = text.includes(searchTerm) ? '1' : '0.3';
            }
        });
    }

    searchBtn.addEventListener('click', () => performSearch(searchInput.value));
    searchInput.addEventListener('input', (e) => performSearch(e.target.value));
}

// Timeline Data and Functions
const timelineData = [
    {
        year: 1920,
        title: "Initial Formation",
        content: "Formation of the first Bakuusi clan council."
    },
    {
        year: 1945,
        title: "Post-War Reorganization",
        content: "Restructuring of clan leadership and establishment of new traditions."
    },
    {
        year: 1960,
        title: "Cultural Renaissance",
        content: "Revival of traditional practices and documentation of clan history."
    },
    {
        year: 1985,
        title: "Modern Era Begins",
        content: "Implementation of new governance structure and digital records."
    },
    {
        year: 2000,
        title: "Millennium Milestone",
        content: "Establishment of the Bakuusi Cultural Center."
    }
];

function populateTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    timeline.innerHTML = timelineData.map((item, index) => `
        <div class="timeline-item" style="animation-delay: ${index * 0.2}s">
            <div class="date">${item.year}</div>
            <div class="content">
                <h3>${item.title}</h3>
                <p>${item.content}</p>
            </div>
        </div>
    `).join('');
}

// Personalities Data and Functions
const personalitiesData = [
    {
        name: "Dr. James Bakuusi",
        role: "Clan Elder (1920-1995)",
        bio: "Pioneer in establishing modern clan governance.",
        image: "images/leader1.jpg"
    },
    {
        name: "Sarah Namukuwa",
        role: "Cultural Ambassador (1940-2015)",
        bio: "Preserved and documented clan traditions.",
        image: "images/leader2.jpg"
    },
    {
        name: "John Wafula",
        role: "Education Pioneer (1955-Present)",
        bio: "Established the clan's education foundation.",
        image: "images/leader3.jpg"
    }
];

function populatePersonalities() {
    const grid = document.querySelector('.personalities-grid');
    if (!grid) return;

    grid.innerHTML = personalitiesData.map((person, index) => `
        <div class="personality-card" style="animation-delay: ${index * 0.2}s">
            <div class="image-container">
                <img src="${person.image}" alt="${person.name}" onerror="this.src='images/placeholder.jpg'">
            </div>
            <h3>${person.name}</h3>
            <p class="role">${person.role}</p>
            <p class="bio">${person.bio}</p>
            <button class="learn-more" data-name="${person.name}">Learn More</button>
        </div>
    `).join('');
}

// Downloadable Materials Data and Functions
const materialsData = [
    {
        title: "Clan Constitution",
        type: "PDF",
        size: "2.5MB",
        icon: "fas fa-file-pdf",
        url: "documents/constitution.pdf"
    },
    {
        title: "Historical Records",
        type: "PDF",
        size: "5.1MB",
        icon: "fas fa-file-alt",
        url: "documents/records.pdf"
    },
    {
        title: "Photo Archive",
        type: "ZIP",
        size: "150MB",
        icon: "fas fa-file-archive",
        url: "documents/photos.zip"
    }
];

function populateDownloads() {
    const grid = document.querySelector('.downloads-grid');
    if (!grid) return;

    grid.innerHTML = materialsData.map((item, index) => `
        <div class="download-card" style="animation-delay: ${index * 0.2}s">
            <i class="${item.icon} document-icon"></i>
            <h3>${item.title}</h3>
            <p>${item.type} - ${item.size}</p>
            <button class="download-btn" data-url="${item.url}">Download</button>
        </div>
    `).join('');
}

// Event Listeners Setup
function setupEventListeners() {
    // Learn More buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('learn-more')) {
            const name = e.target.dataset.name;
            const person = personalitiesData.find(p => p.name === name);
            if (person) {
                showPersonModal(person);
            }
        }
    });

    // Download buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('download-btn')) {
            const url = e.target.dataset.url;
            handleDownload(url);
        }
    });

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSubmit(this);
        });
    }
}

// Modal Functions
function showPersonModal(person) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <img src="${person.image}" alt="${person.name}" onerror="this.src='images/placeholder.jpg'">
            <h2>${person.name}</h2>
            <h3>${person.role}</h3>
            <p>${person.bio}</p>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.close').onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

// Download Handler
function handleDownload(url) {
    window.open(url, '_blank');
}

// Newsletter Handler
function handleNewsletterSubmit(form) {
    const email = form.querySelector('input[type="email"]').value;
    alert(`Thank you for subscribing with: ${email}`);
    form.reset();
}

// Scroll Animation
function addScrollAnimation() {
    const elements = document.querySelectorAll('.history-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => observer.observe(element));
}