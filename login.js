document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('loginLink');
    const profileMenu = document.getElementById('profileMenu');
    const logoutBtn = document.getElementById('logoutBtn');

    // Check session
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        showProfile();
    }

    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.setItem('isLoggedIn', 'true');
            if (window.showToast) window.showToast('Login successful', 'success');
            showProfile();
            // Still reload after a tiny delay to update other UI components if needed,
            // but the profile icon should have appeared via showProfile() immediately.
            setTimeout(() => {
                location.reload();
            }, 500);
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('isLoggedIn');
            if (window.showToast) window.showToast('Logged out successfully', 'success');
            hideProfile();
            setTimeout(() => {
                location.href = 'index.html';
            }, 500);
        });
    }

    function hideProfile() {
        document.documentElement.classList.remove('auth-logged-in');
        document.documentElement.classList.add('auth-logged-out');
        if (window.updateHeaderBadges) window.updateHeaderBadges();
    }

    function showProfile() {
        document.documentElement.classList.remove('auth-logged-out');
        document.documentElement.classList.add('auth-logged-in');
        if (window.updateHeaderBadges) window.updateHeaderBadges();
    }

    // Dropdown toggle
    const profileIcon = document.querySelector('.profile-icon');
    if (profileIcon) {
        profileIcon.addEventListener('click', () => {
            const dropdown = document.querySelector('.profile-dropdown');
            if (dropdown) dropdown.classList.toggle('show');
        });
    }

    window.addEventListener('click', (e) => {
        if (!e.target.closest('.profile-menu')) {
            const dropdown = document.querySelector('.profile-dropdown');
            if (dropdown) dropdown.classList.remove('show');
        }
    });
});
