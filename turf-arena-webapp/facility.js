function renderFacilityCards(containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container || !window.arenaData) return;

    const data = limit ? window.arenaData.turfs.slice(0, limit) : window.arenaData.turfs;

    container.innerHTML = data.map(f => `
        <div class="card">
            <div class="card-img">
                <img src="${f.images[0]}" alt="${f.name}">
                <div class="sport-badge">${f.sportType}</div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${f.name}</h3>
                <p class="card-tagline" style="color: var(--primary); font-size: 0.85rem; font-weight: 600; margin-bottom: 10px;">${f.tagline}</p>
                <p class="card-desc">${f.shortDesc}</p>
                <div class="card-footer">
                    <div class="card-price">₹${f.price} / hour</div>
                    <div class="card-rating">
                        <i class="fas fa-star"></i> ${f.rating}
                    </div>
                </div>
                <a href="turf-details.html?id=${f.id}" class="btn btn-primary" style="width: 100%; margin-top: 20px;">Book Turf</a>
            </div>
        </div>
    `).join('');
}


// Amenity Rendering
function renderAmenities(containerId, limit = null) {
    const grid = document.getElementById(containerId);
    if (!grid || !window.arenaData.amenities) return;

    const items = limit ? window.arenaData.amenities.slice(0, limit) : window.arenaData.amenities;

    grid.innerHTML = items.map(item => `
        <div class="amenity-card" id="${item.id}">
            <div class="amenity-card-img">
                <img src="${item.img}" alt="${item.name}">
                <div class="amenity-icon-overlay">
                    <i class="${item.icon}"></i>
                </div>
            </div>
            <div class="amenity-card-content">
                <h3 class="amenity-card-title">${item.name}</h3>
                <p class="amenity-card-desc">${item.description}</p>
                <a href="facility-details.html?id=${item.id}" class="btn btn-outline" 
                    style="width: 100%; border: 1px solid var(--primary); color: var(--primary); display: block; text-align: center;">
                    View Details
                </a>
            </div>
        </div>
    `).join('');
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // For index.html
    if (document.getElementById('homeFacilities')) {
        renderFacilityCards('homeFacilities', 3);
    }
    if (document.getElementById('amenityGrid')) {
        renderAmenities('amenityGrid', 4); // Homepage preview limit 4
    }

    // For facilities.html
    if (document.getElementById('allFacilities')) {
        renderFacilityCards('allFacilities');
    }
    if (document.getElementById('allAmenitiesGrid')) {
        renderAmenities('allAmenitiesGrid'); // Full list
    }
});

function showAmenityDetail(id) {
    const item = window.arenaData.amenities.find(a => a.id === id);
    if (!item) return;

    const modal = document.getElementById('facilityModal');
    const modalBody = document.getElementById('facilityModalBody');
    const closeBtn = document.getElementById('closeFacilityModal');

    modalBody.innerHTML = `
        <div style="height: 100%;">
            <img src="${item.img}" class="modal-detail-img">
        </div>
        <div>
            <h2 style="color: var(--primary); font-size: 2rem; margin-bottom: 20px;">${item.name}</h2>
            <p style="color: var(--gray); font-size: 1.1rem; line-height: 1.6; margin-bottom: 25px;">${item.description}</p>
            <h4 style="margin-bottom: 15px;">Key Benefits:</h4>
            <ul class="benefit-list">
                ${item.benefits.map(b => `<li><i class="fas fa-check-circle"></i> ${b}</li>`).join('')}
            </ul>
        </div>
    `;

    modal.style.display = 'flex';

    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
}

window.showAmenityDetail = showAmenityDetail;
