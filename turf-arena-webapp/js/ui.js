// Global Image Error Handling
document.addEventListener('error', function (e) {
    if (e.target.tagName && e.target.tagName.toLowerCase() === 'img') {
        console.warn('Image failed to load:', e.target.src);
        e.target.src = '../images/sports-placeholder.png';
        e.target.onerror = null; // Prevent infinite loop
    }
}, true);

document.addEventListener('DOMContentLoaded', () => {
    // Demo Reset: Clear local storage data on manual page refresh to maintain a fresh demo state
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
        const keysToClear = [
            'user_history',
            'open_challenges',
            'booking_fac_id',
            'booking_fac',
            'booking_date',
            'booking_time',
            'booking_price',
            'booking_duration',
            'booking_pwo',
            'booking_sport',
            'booking_players',
            'booking_team_name'
        ];
        keysToClear.forEach(key => localStorage.removeItem(key));
        console.log("Demo State Reset: User data cleared on reload.");
    }

    console.log("Turf Arena UI Initialized");

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Handle initial hash scroll with offset
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }, 500);
    }

    // Create toast container if not exists
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Hero Slider
    initHeroSlider();

    // Render Offers
    renderOffers();

    // Render Nearby Home
    renderNearbyHome();

    // Facility Strip interaction
    initFacilityStrip();
});

/* ── Facility Strip: drag, mousewheel, auto-scroll ── */
function initFacilityStrip() {
    // Apply interactive scroll behaviour to each side zone
    ['facilityLeft', 'facilityRight'].forEach(id => {
        const zone = document.getElementById(id);
        if (!zone) return;
        enableZoneScroll(zone);
    });
}

function enableZoneScroll(zone) {
    const AUTO_SPEED = 0.5; // px per frame
    let isDragging = false, startX = 0, scrollStart = 0;
    let paused = false;

    // ── Mousewheel ──
    zone.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            zone.scrollBy({ left: e.deltaY * 2, behavior: 'smooth' });
        }
    }, { passive: false });

    // ── Drag ──
    zone.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        scrollStart = zone.scrollLeft;
        zone.classList.add('dragging');
        paused = true;
    });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        zone.scrollLeft = scrollStart - (e.pageX - startX);
    });
    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        zone.classList.remove('dragging');
        paused = false;
    });

    // ── Touch ──
    let touchStartX = 0, touchScrollStart = 0;
    zone.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchScrollStart = zone.scrollLeft;
        paused = true;
    }, { passive: true });
    zone.addEventListener('touchmove', (e) => {
        zone.scrollLeft = touchScrollStart - (e.touches[0].clientX - touchStartX);
    }, { passive: true });
    zone.addEventListener('touchend', () => { paused = false; });

    // ── Pause on hover ──
    zone.addEventListener('mouseenter', () => { paused = true; });
    zone.addEventListener('mouseleave', () => { paused = false; });
}

function renderOffers() {
    const grid = document.getElementById('offerGrid');
    if (!grid || !window.arenaData.offers) return;

    grid.innerHTML = window.arenaData.offers.map(offer => `
        <div class="offer-card" style="background: ${offer.color}">
            <div class="offer-tag">Flash Sale</div>
            <h3>${offer.title}</h3>
            <p>${offer.desc}</p>
        </div>
    `).join('');
}

function renderNearbyHome() {
    const grid = document.getElementById('nearbyHomeGrid');
    if (!grid || !window.arenaData.nearby) return;

    // Show only first 6 for home
    const items = window.arenaData.nearby.slice(0, 6);

    grid.innerHTML = items.map(item => `
        <div class="card nearby-card">
            <div class="card-img">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="card-content">
                <h3 class="card-title">${item.name}</h3>
                <div class="card-location">
                    <i class="fas fa-map-marker-alt" onclick="window.open('https://www.google.com/maps?q=${encodeURIComponent(item.name + ' Turf Arena')}', '_blank')"></i>
                    <span>📍 ${item.distance} away</span>
                </div>
            </div>
        </div>
    `).join('');
}

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    // Local Hero Images Mapping (Update to use local files where possible)
    const localHeroImages = [
        '../images/hero.jpg',
        '../images/cricket.jpg',
        '../images/football.jpg',
        '../images/swimming.jpg'
    ];

    // Preload Hero Images
    localHeroImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Update slides to use preloaded local images
    slides.forEach((slide, index) => {
        if (localHeroImages[index]) {
            slide.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${localHeroImages[index]}')`;
        }
    });

    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 4000); // Rotate every 4 seconds
}

function showToast(message, type = 'success') {
    const container = document.querySelector('.toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

window.showToast = showToast;
