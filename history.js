// history.js

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    
    hamburger.addEventListener('click', function() {
        menu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Initialize all components
    initializeFamilyTree();
    populateTimeline();
    populatePersonalities();
    populateDownloads();
    addScrollAnimation();
    setupEventListeners();
});

// Family Tree Data
const familyTreeData = {
    name: "Bakuusi Clan Founder",
    title: "First Generation",
    birthYear: "1850",
    deathYear: "1925",
    children: [
        {
            name: "James Bakuusi",
            title: "Elder Son",
            birthYear: "1875",
            deathYear: "1940",
            children: [
                {
                    name: "Robert Bakuusi",
                    title: "First Branch",
                    birthYear: "1900",
                    deathYear: "1975",
                    children: [
                        {
                            name: "Mary Bakuusi",
                            title: "Elder Daughter",
                            birthYear: "1925",
                            deathYear: "2000"
                        },
                        {
                            name: "John Bakuusi",
                            title: "Younger Son",
                            birthYear: "1928",
                            deathYear: "2005",
                            children: [
                                {
                                    name: "Sarah Bakuusi",
                                    title: "Current Elder",
                                    birthYear: "1955",
                                    living: true
                                },
                                {
                                    name: "Michael Bakuusi",
                                    title: "Council Member",
                                    birthYear: "1958",
                                    living: true
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "Margaret Bakuusi",
            title: "Younger Daughter",
            birthYear: "1878",
            deathYear: "1945",
            children: [
                {
                    name: "Thomas Bakuusi",
                    title: "Second Branch",
                    birthYear: "1905",
                    deathYear: "1970"
                }
            ]
        }
    ]
};

// Family Tree Initialization
function initializeFamilyTree() {
    const container = document.getElementById('family-tree-visualization');
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Set dimensions - adjusted for vertical layout
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = container.offsetWidth - margin.left - margin.right;
    // Increased height for vertical layout
    const height = 800 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select('#family-tree-visualization')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create tree layout - modified for vertical orientation
    const tree = d3.tree()
        .size([width, height - 160]); // Swapped width and height

    // Create hierarchy
    const root = d3.hierarchy(familyTreeData);
    const treeData = tree(root);

    // Add links - modified for vertical paths
    const links = svg.selectAll('.link')
        .data(treeData.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkVertical()    // Changed to linkVertical
            .x(d => d.x)                // Swapped x and y
            .y(d => d.y));              // Swapped x and y

    // Add nodes - modified for vertical positioning
    const nodes = svg.selectAll('.node')
        .data(treeData.descendants())
        .enter()
        .append('g')
        .attr('class', d => `node ${d.children ? 'node--internal' : 'node--leaf'}`)
        .attr('transform', d => `translate(${d.x},${d.y})`); // Swapped x and y

    // Add circles to nodes
    nodes.append('circle')
        .attr('r', 10)
        .style('fill', d => d.data.living ? '#00D094' : '#666')
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 15);
            showTooltip(d.data, event);
        })
        .on('mouseout', function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 10);
            hideTooltip();
        });

    // Add labels - modified for vertical text positioning
    nodes.append('text')
        .attr('dy', d => d.children ? -20 : 20) // Position text above/below nodes
        .attr('x', 0)                           // Center text horizontally
        .attr('text-anchor', 'middle')          // Center text alignment
        .text(d => d.data.name)
        .call(wrapText, 100);                   // Wrap long text

    // Add zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.5, 2])
        .on('zoom', (event) => {
            svg.attr('transform', event.transform);
        });

    d3.select('#family-tree-visualization svg').call(zoom);

    // Setup search functionality
    setupSearch();
}

// Helper function for wrapping text
function wrapText(text, width) {
    text.each(function() {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        const lineHeight = 1.1; // ems
        const y = text.attr("y");
        const dy = parseFloat(text.attr("dy"));
        let word;
        let line = [];
        let lineNumber = 0;
        let tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

// Tooltip functions
function showTooltip(data, event) {
    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background', 'white')
        .style('padding', '10px')
        .style('border-radius', '5px')
        .style('box-shadow', '0 2px 5px rgba(0,0,0,0.2)')
        .html(`
            <h4>${data.name}</h4>
            <p><strong>Title:</strong> ${data.title}</p>
            <p><strong>Birth Year:</strong> ${data.birthYear}</p>
            <p><strong>Death Year:</strong> ${data.deathYear || 'Present'}</p>
        `);

    // Position tooltip near the mouse but not overlapping
    const tooltipNode = tooltip.node();
    const tooltipRect = tooltipNode.getBoundingClientRect();
    const xPosition = event.pageX + 10;
    const yPosition = event.pageY - tooltipRect.height / 2;

    tooltip
        .style('left', `${xPosition}px`)
        .style('top', `${yPosition}px`);
}

function hideTooltip() {
    d3.select('.tooltip').remove();
}

// Search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-btn');

    if (!searchInput || !searchBtn) return;

    function performSearch(term) {
        const nodes = d3.selectAll('.node');
        if (term === '') {
            nodes.style('opacity', 1);
        } else {
            nodes.style('opacity', 0.2)
                .filter(d => d.data.name.toLowerCase().includes(term.toLowerCase()))
                .style('opacity', 1);
        }
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

    timeline.innerHTML = '';

    timelineData.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="date">${item.year}</div>
            <div class="content">
                <h3>${item.title}</h3>
                <p>${item.content}</p>
            </div>
        `;
        timelineItem.style.animationDelay = `${index * 0.2}s`;
        timeline.appendChild(timelineItem);
    });
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

    grid.innerHTML = '';

    personalitiesData.forEach((person, index) => {
        const card = document.createElement('div');
        card.className = 'personality-card';
        card.style.animationDelay = `${index * 0.2}s`;
        card.innerHTML = `
            <div class="image-container">
                <img src="${person.image}" alt="${person.name}" onerror="this.src='images/placeholder.jpg'">
            </div>
            <h3>${person.name}</h3>
            <p class="role">${person.role}</p>
            <p class="bio">${person.bio}</p>
            <button class="learn-more" data-name="${person.name}">Learn More</button>
        `;
        grid.appendChild(card);
    });
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

    grid.innerHTML = '';

    materialsData.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'download-card';
        card.style.animationDelay = `${index * 0.2}s`;
        card.innerHTML = `
            <i class="${item.icon} document-icon"></i>
            <h3>${item.title}</h3>
            <p>${item.type} - ${item.size}</p>
            <button class="download-btn" data-url="${item.url}">Download</button>
        `;
        grid.appendChild(card);
    });
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
    // Add download tracking or authentication here if needed
    window.open(url, '_blank');
}

// Newsletter Handler
function handleNewsletterSubmit(form) {
    const email = form.querySelector('input[type="email"]').value;
    // Add newsletter subscription logic here
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

// Window resize handler
window.addEventListener('resize', debounce(() => {
    initializeFamilyTree();
}, 250));

// Utility function for debouncing
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