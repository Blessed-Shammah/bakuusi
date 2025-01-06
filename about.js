// about.js

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initLeadershipSection();
    initScrollAnimations();
    initImageLazyLoading();
});

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

// Leadership Data
const leadershipData = {
    patron: {
        title: "Clan Patron",
        members: [
            {
                name: "Dr. James Bakuusi",
                position: "Clan Patron",
                image: "images/leaders/patron.jpg",
                description: "Leading the clan with wisdom and vision"
            }
        ]
    },
    elders: {
        title: "Council of Elders",
        members: [
            {
                name: "Elder John Mukasa",
                position: "Head Elder",
                image: "images/leaders/elder1.jpg",
                description: "Guardian of clan traditions"
            },
            {
                name: "Elder Sarah Namukasa",
                position: "Cultural Advisor",
                image: "images/leaders/elder2.jpg",
                description: "Preserving our cultural heritage"
            },
            // Add more elders as needed
        ]
    },
    officeBearers: {
        title: "Office Bearers",
        members: [
            {
                name: "Mr. Peter Walusimbi",
                position: "Chairman",
                image: "images/leaders/bearer1.jpg",
                description: "Executive leadership"
            },
            {
                name: "Ms. Mary Nakirija",
                position: "Secretary",
                image: "images/leaders/bearer2.jpg",
                description: "Administrative coordination"
            },
            // Add more office bearers
        ]
    },
    trustees: {
        title: "Trustees",
        members: [
            {
                name: "Mr. David Kisitu",
                position: "Head Trustee",
                image: "images/leaders/trustee1.jpg",
                description: "Financial oversight"
            },
            // Add more trustees
        ]
    }
};

// Initialize Leadership Section
function initLeadershipSection() {
    const container = document.getElementById('leadership-container');
    
    // Create and append sections for each leadership category
    for (const [key, category] of Object.entries(leadershipData)) {
        const section = createLeadershipCategory(category);
        container.appendChild(section);
    }
}

// Create Leadership Category Section
function createLeadershipCategory(category) {
    const section = document.createElement('div');
    section.classList.add('leadership-category');
    
    section.innerHTML = `
        <h3>${category.title}</h3>
        <div class="leader-cards">
            ${category.members.map(leader => createLeaderCard(leader)).join('')}
        </div>
    `;
    
    return section;
}

// Create Individual Leader Card
function createLeaderCard(leader) {
    return `
        <div class="leader-card">
            <div class="leader-image">
                <img src="${leader.image}" alt="${leader.name}" loading="lazy">
            </div>
            <div class="leader-info">
                <h4>${leader.name}</h4>
                <p class="position">${leader.position}</p>
                <p class="description">${leader.description}</p>
            </div>
        </div>
    `;
}

// Scroll Animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('.history-section, .leader-card');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Lazy Loading for Images
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Audio Player Enhancement
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.querySelector('audio');
    if (audio) {
        audio.addEventListener('play', function() {
            // Add animation or visual feedback when anthem plays
            document.querySelector('.anthem-lyrics').classList.add('playing');
        });
        
        audio.addEventListener('pause', function() {
            document.querySelector('.anthem-lyrics').classList.remove('playing');
        });
    }
});

// Smooth Scrolling for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Handle Form Submissions
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add your form submission logic here
        console.log('Form submitted');
    });
});

// Error Handling
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
    // Add your error handling logic here
});

// Performance Monitoring
window.addEventListener('load', function() {
    // Report performance metrics
    if (window.performance) {
        const timing = window.performance.timing;
        const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    }
});