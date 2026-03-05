document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Active link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Dropdown toggle on arrow click
    document.querySelectorAll('.dropdown-arrow').forEach(arrow => {
        arrow.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const parent = arrow.closest('.nav-item-dropdown');

            // Close other dropdowns
            document.querySelectorAll('.nav-item-dropdown').forEach(item => {
                if (item !== parent) item.classList.remove('show');
            });

            parent.classList.toggle('show');
        });
    });

    // Close on click outside
    window.addEventListener('click', () => {
        document.querySelectorAll('.nav-item-dropdown').forEach(item => {
            item.classList.remove('show');
        });

        const notifDropdown = document.getElementById('notifDropdown');
        if (notifDropdown) notifDropdown.style.display = 'none';
    });

    // Global Notification Badge Logic
    function updateHeaderBadges() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        const challengeBadge = document.getElementById('headerNotifBadge');
        const universalBell = document.getElementById('universalBell');

        if (challengeBadge) {
            if (isLoggedIn) {
                challengeBadge.style.display = 'flex';
                challengeBadge.innerText = '2'; // User requested count 2 after login
                challengeBadge.className = 'menu-notif-badge';
            } else {
                challengeBadge.style.display = 'none';
            }
        }

        if (universalBell) {
            universalBell.style.display = isLoggedIn ? 'flex' : 'none';

            const dot = document.getElementById('universalDot');
            if (dot) {
                dot.style.display = isLoggedIn ? 'block' : 'none';
            }

            // Toggle Logic
            universalBell.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleNotifDropdown();
            };
        }
    }

    function toggleNotifDropdown() {
        let dropdown = document.getElementById('notifDropdown');
        if (!dropdown) {
            // Create dropdown if it doesn't exist (centralized for all pages)
            dropdown = document.createElement('div');
            dropdown.id = 'notifDropdown';
            dropdown.style.cssText = `
                position: fixed; top: 80px; right: 20px; width: 320px; 
                background: white; border-radius: 12px; 
                box-shadow: 0 10px 30px rgba(0,0,0,0.2); 
                z-index: 5000; padding: 20px; display: none;
            `;
            dropdown.innerHTML = `
                <h3 style="margin-top:0; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; color: var(--accent);">Notifications</h3>
                <div id="notifList" style="max-height: 300px; overflow-y: auto;"></div>
            `;
            document.body.appendChild(dropdown);
        }

        const list = document.getElementById('notifList');
        const dummyNotifications = [
            { text: 'Slot booked successfully at Turf Arena', time: '10 mins ago' },
            { text: 'Thunder Strikers accepted your challenge!', time: '1 hour ago' },
            { text: 'Payment of ₹1200 confirmed', time: '2 hours ago' }
        ];

        list.innerHTML = dummyNotifications.map(n => `
            <div style="padding: 12px; border-bottom: 1px solid #f2f2f2; font-size: 0.85rem;">
                <div style="color: var(--accent); font-weight: 500; line-height: 1.4;">${n.text}</div>
                <div style="color: var(--gray); font-size: 0.75rem; margin-top: 5px;"><i class="far fa-clock"></i> ${n.time}</div>
            </div>
        `).join('');

        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }

    function renderHeaderLeaderboardData() {
        const list = document.getElementById('headerLeaderboardList');
        if (!list) return;

        // Display only rank 1 teams for each sport
        const leaderboardData = window.arenaData?.leaderboard || [];
        const topTeams = leaderboardData.filter(team => team.rank === 1);

        list.innerHTML = '';
        if (topTeams.length === 0) {
            list.innerHTML = '<div style="text-align: center; color: var(--gray); font-size: 0.9rem;">No data available</div>';
            return;
        }

        topTeams.forEach(team => {
            list.innerHTML += `
                <div style="background: white; border-radius: 8px; padding: 10px; display: flex; align-items: center; gap: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #f1c40f; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#fffcf0'" onmouseout="this.style.background='white'" onclick="window.location.href='leaderboard.html?sport=${team.sport}'">
                    <div style="width: 30px; text-align: center; font-weight: 700; color: #f1c40f; font-size: 1.2rem;">
                        <i class="fas fa-medal"></i>
                    </div>
                    <div style="flex-grow: 1;">
                        <strong style="color: var(--accent); font-size: 0.95rem;">${team.teamName}</strong>
                        <div style="font-size: 0.75rem; color: var(--gray);">${team.sport} - ${team.points} pts</div>
                    </div>
                    <div style="text-align: right;">
                        <strong style="color: var(--primary); font-size: 0.9rem;">${team.won} W</strong>
                        <div style="font-size: 0.7rem; color: var(--gray);">${team.played} P</div>
                    </div>
                </div>
            `;
        });
    }

    // Run badge update on load
    updateHeaderBadges();
    renderHeaderLeaderboardData();

    // Expose for login.js
    window.updateHeaderBadges = updateHeaderBadges;
    window.renderHeaderLeaderboardData = renderHeaderLeaderboardData;
});
