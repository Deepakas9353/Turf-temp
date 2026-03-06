/**
 * TURF ARENA - GLOBAL ROUTER & LAYOUT MANAGER
 * Handles SPA-style navigation and standardized header updates.
 */

const routes = {
    'our-turfs.html': {
        icon: 'fa-futbol',
        title: 'Book Turf',
        subtitle: 'Book Your Favourite Sport Turf',
        filter: {
            label: 'Sport',
            options: ['All Turfs', 'Cricket', 'Football', 'Badminton', 'Swimming'],
            callback: 'filterTurfs'
        }
    },
    'facilities.html': {
        icon: 'fa-building',
        title: 'Our Facilities',
        subtitle: 'Premium Amenities at Turf Arena',
        filter: false
    },
    'find-opponent.html': {
        icon: '⚔️',
        isEmoji: true,
        title: 'Find Opponent',
        subtitle: 'Challenge Other Teams at Turf Arena',
        filter: false
    },
    'leaderboard.html': {
        icon: 'fa-trophy',
        title: 'Leaderboard',
        subtitle: 'Top Teams Competing at Turf Arena',
        filter: {
            label: 'Sport',
            options: ['All Sports', 'Cricket', 'Football', 'Badminton', 'Swimming'],
            callback: 'filterLeaderboard'
        }
    },
    'gallery.html': {
        icon: 'fa-images',
        title: 'Gallery',
        subtitle: 'A Visual Tour of Turf Arena',
        filter: false
    },
    'nearby-facilities.html': {
        icon: 'fa-map-marker-alt',
        title: 'Nearby Facilities',
        subtitle: 'Explore Everything Around Turf Arena',
        filter: false
    },
    'my-bookings.html': {
        icon: 'fa-calendar-check',
        title: 'My Bookings',
        subtitle: 'Your Turf Booking History',
        filter: false
    },
    'contact.html': {
        icon: 'fa-envelope',
        title: 'Contact Us',
        subtitle: 'Reach Out for Bookings or Queries',
        filter: false
    },
    'profile.html': {
        icon: 'fa-user',
        title: 'My Profile',
        subtitle: 'Manage Your Account and Preferences',
        filter: false
    }
};

class Router {
    constructor() {
        this.contentArea = document.getElementById('main-content');
        this.header = {
            container: document.getElementById('global-header'),
            icon: document.getElementById('header-icon'),
            emoji: document.getElementById('header-emoji'),
            title: document.getElementById('header-title'),
            subtitle: document.getElementById('header-subtitle'),
            filter: document.getElementById('header-filter-container'),
            filterLabel: document.getElementById('header-filter-label'),
            filterSelect: document.getElementById('header-select')
        };
        this.init();
    }

    init() {
        // Intercept navigation
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            const href = link.getAttribute('href');
            if (href && href.endsWith('.html') && !href.startsWith('http') && !link.hasAttribute('target')) {
                // If local file:// protocol, avoid fetch-based navigation to prevent CORS errors on some systems
                if (window.location.protocol === 'file:') return;
                e.preventDefault();
                this.navigate(href);
            }
        });

        // Initial update
        const path = window.location.pathname.split('/').pop() || 'index.html';
        this.updateHeader(path);
    }

    async navigate(path) {
        const [cleanPath, hash] = path.split('#');
        try {
            await this.loadPage(cleanPath);
            window.history.pushState({}, '', path);
            if (hash) {
                const el = document.getElementById(hash);
                if (el) el.scrollIntoView();
            }
        } catch (e) {
            window.location.href = path;
        }
    }

    async loadPage(path) {
        if (!this.contentArea) return;
        this.contentArea.style.opacity = '0.4';

        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error('Fetch failed');
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            let newContent;
            if (path === 'index.html' || path === '') {
                const body = doc.querySelector('body');
                const nav = body.querySelector('.navbar');
                const footer = body.querySelector('.footer');
                const header = body.querySelector('.page-hero');
                if (nav) nav.remove();
                if (footer) footer.remove();
                if (header) header.remove();
                newContent = body.innerHTML;
            } else {
                const hero = doc.querySelector('.page-hero');
                if (hero) {
                    let sibling = hero.nextElementSibling;
                    const wrapper = document.createElement('div');
                    while (sibling && !sibling.classList.contains('footer')) {
                        wrapper.appendChild(sibling.cloneNode(true));
                        sibling = sibling.nextElementSibling;
                    }
                    newContent = wrapper.innerHTML;
                } else {
                    const body = doc.querySelector('body');
                    const nav = body.querySelector('.navbar');
                    const footer = body.querySelector('.footer');
                    if (nav) nav.remove();
                    if (footer) footer.remove();
                    newContent = body.innerHTML;
                }
            }

            this.contentArea.innerHTML = newContent;
            this.contentArea.style.opacity = '1';
            this.updateHeader(path);
            this.updateActiveLink(path);

            if (window.initializeUI) window.initializeUI();

            // Close mobile menu
            document.querySelector('.nav-menu')?.classList.remove('active');
            window.scrollTo(0, 0);

        } catch (error) {
            console.error('Failed to load page:', error);
            window.location.href = path;
        }
    }

    updateHeader(path) {
        if (!this.header.container) return;

        const cleanPath = path.split('/').pop() || 'index.html';

        // Hide on Home Page ONLY
        if (cleanPath === 'index.html' || cleanPath === '' || cleanPath === '/') {
            this.header.container.style.display = 'none';
            return;
        }

        const config = routes[cleanPath];
        if (!config) {
            this.header.container.style.display = 'none';
            return;
        }

        this.header.container.style.display = 'flex';

        // Update Icon
        if (this.header.icon && this.header.emoji) {
            if (config.isEmoji) {
                this.header.icon.style.display = 'none';
                this.header.emoji.style.display = 'inline-block';
                this.header.emoji.innerText = config.icon || '';
            } else {
                this.header.emoji.style.display = 'none';
                this.header.icon.style.display = 'inline-block';
                this.header.icon.className = `fas ${config.icon || ''}`;
            }
        }

        // Update Text
        if (this.header.title) this.header.title.innerText = config.title || '';
        if (this.header.subtitle) this.header.subtitle.innerText = config.subtitle || '';

        // Update Filter
        if (this.header.filter && this.header.filterLabel && this.header.filterSelect) {
            if (config.filter) {
                this.header.filter.classList.remove('hidden');
                this.header.filterLabel.innerHTML = `<i class="fas fa-filter"></i> ${config.filter.label}:`;
                this.header.filterSelect.innerHTML = (config.filter.options || []).map(opt =>
                    `<option value="${opt}">${opt}</option>`
                ).join('');
                this.header.filterSelect.onchange = (e) => {
                    if (window[config.filter.callback]) window[config.filter.callback](e.target.value);
                };
            } else {
                this.header.filter.classList.add('hidden');
            }
        }
    }

    updateActiveLink(path) {
        const cleanPath = path.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === cleanPath);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => { window.appRouter = new Router(); });
