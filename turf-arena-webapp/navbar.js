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

    // Dropdown toggle on arrow click (Desktop style)
    document.querySelectorAll('.dropdown-trigger-group').forEach(group => {
        const arrow = group.querySelector('.dropdown-arrow');
        const parent = group.closest('.nav-item-dropdown');

        if (arrow) {
            arrow.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const isShown = parent.classList.contains('show');

                // Close other dropdowns
                document.querySelectorAll('.nav-item-dropdown').forEach(item => {
                    item.classList.remove('show');
                });

                if (!isShown) {
                    parent.classList.add('show');
                }
            });
        }
    });

    // Profile Dropdown
    const profileIcon = document.getElementById('profileIcon');
    const profileDropdown = document.getElementById('profileDropdown');

    if (profileIcon && profileDropdown) {
        profileIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });
    }

    // Close on click outside
    window.addEventListener('click', () => {
        document.querySelectorAll('.nav-item-dropdown').forEach(item => {
            item.classList.remove('show');
        });
        if (profileDropdown) profileDropdown.classList.remove('show');
    });
});
