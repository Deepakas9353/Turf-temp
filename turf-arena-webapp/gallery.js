function initGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    const images = [
        // Cricket (6) - Realistic high-quality photos
        { cat: 'Cricket', src: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800', alt: 'Cricket Stadium Match' },
        { cat: 'Cricket', src: 'https://images.unsplash.com/photo-1589485273598-8f8b8965f391?auto=format&fit=crop&q=80&w=800', alt: 'Cricket Batting Action' },
        { cat: 'Cricket', src: 'https://images.unsplash.com/photo-1629285483773-6b5cbed0672f?auto=format&fit=crop&q=80&w=800', alt: 'Cricket Bowling Net' },
        { cat: 'Cricket', src: 'https://images.unsplash.com/photo-1552072047-3bb93817228c?auto=format&fit=crop&q=80&w=800', alt: 'Professional Cricket Turf' },
        { cat: 'Cricket', src: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&q=80&w=800', alt: 'Night Cricket Match' },
        { cat: 'Cricket', src: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?auto=format&fit=crop&q=80&w=800', alt: 'Cricket Pitch Close-up' },

        // Football (6) - Realistic high-quality photos
        { cat: 'Football', src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800', alt: 'Football Tournament Match' },
        { cat: 'Football', src: 'https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?auto=format&fit=crop&q=80&w=800', alt: 'Football Player Action' },
        { cat: 'Football', src: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800', alt: 'Night Football Turf' },
        { cat: 'Football', src: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=800', alt: 'Penalty Shootout' },
        { cat: 'Football', src: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=800', alt: 'Football Stadium Lights' },
        { cat: 'Football', src: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&q=80&w=800', alt: 'Pro Football Turf Arena' },

        // Badminton (4) - Realistic high-quality photos
        { cat: 'Badminton', src: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800', alt: 'Indoor Badminton Court' },
        { cat: 'Badminton', src: 'https://images.unsplash.com/photo-1613912360812-429d64465bc1?auto=format&fit=crop&q=80&w=800', alt: 'Badminton Smash Action' },
        { cat: 'Badminton', src: 'https://images.unsplash.com/photo-1617083281297-af310eb413e1?auto=format&fit=crop&q=80&w=800', alt: 'Badminton Player Service' },
        { cat: 'Badminton', src: 'https://images.unsplash.com/photo-1613912313134-2e29302bf376?auto=format&fit=crop&q=80&w=800', alt: 'Elite Badminton Facility' },

        // Swimming (4) - Realistic high-quality photos
        { cat: 'Swimming', src: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&q=80&w=800', alt: 'Olympic Sized Pool' },
        { cat: 'Swimming', src: 'https://images.unsplash.com/photo-1600965962361-9035dbfd1c50?auto=format&fit=crop&q=80&w=800', alt: 'Luxury Indoor Pool' },
        { cat: 'Swimming', src: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=800', alt: 'Swimming Practice Session' },
        { cat: 'Swimming', src: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&q=80&w=800', alt: 'Turf Arena Luxury Pool' }
    ];

    function filterGallery(cat) {
        const filtered = cat === 'All' ? images : images.filter(img => img.cat.toLowerCase() === cat.toLowerCase().trim());
        grid.innerHTML = filtered.map(img => `
            <div class="gallery-item" data-category="${img.cat.toLowerCase()}">
                <img src="${img.src}" alt="${img.alt}" loading="lazy">
                <div class="gallery-overlay">
                    <span>${img.alt}</span>
                </div>
            </div>
        `).join('');
    }

    // Default
    filterGallery('All');

    document.querySelectorAll('.gallery-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.gallery-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterGallery(btn.innerText.trim());
        };
    });
}

document.addEventListener('DOMContentLoaded', initGallery);
window.initGallery = initGallery;
