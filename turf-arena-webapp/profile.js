document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // Initialize sidebar navigation
    window.switchProfileTab = (tabId) => {
        // Update menu items
        document.querySelectorAll('.sidebar-menu-item').forEach(item => {
            item.classList.remove('active');
        });

        // Find the clicked item - identifying by innerText or better yet, passed index/id if we had it.
        // For simplicity, let's find the one matching the onclick call's tabId if we had mapped them.
        // Since we are using hardcoded onclicks, let's just target the sections.

        // Update sections
        document.querySelectorAll('.profile-section').forEach(section => {
            section.classList.remove('active');
        });

        const activeSection = document.getElementById(`profile-${tabId}`);
        if (activeSection) {
            activeSection.classList.add('active');
        }

        // Highlight active sidebar item
        // Find which one was clicked by mapping tabId to icon or text
        const sidebarItems = document.querySelectorAll('.sidebar-menu-item');
        sidebarItems.forEach(item => {
            if (item.getAttribute('onclick').includes(`'${tabId}'`)) {
                item.classList.add('active');
            }
        });

        // Save active tab to session if needed
        sessionStorage.setItem('activeProfileTab', tabId);
    };

    // Load last active tab if exists
    const lastTab = sessionStorage.getItem('activeProfileTab');
    if (lastTab) {
        switchProfileTab(lastTab);
    }

    // Profile Edit Mode Toggle
    window.toggleEditMode = () => {
        const infoCard = document.querySelector('#profile-info .dashboard-card:not([style*="display: none"])');
        const editCard = document.getElementById('edit-form-card');

        if (editCard.style.display === 'none') {
            editCard.style.display = 'block';
            // Find the display card (first one)
            document.querySelector('#profile-info .dashboard-card').style.display = 'none';
        } else {
            editCard.style.display = 'none';
            document.querySelector('#profile-info .dashboard-card').style.display = 'block';
        }
    };

    window.saveProfileChanges = () => {
        if (window.showToast) window.showToast('Profile updated successfully!', 'success');
        toggleEditMode();
    };

    window.confirmDeleteAccount = () => {
        if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
            sessionStorage.removeItem('isLoggedIn');
            window.location.href = 'index.html';
        }
    };

    window.handleLogout = () => {
        sessionStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
    };
});
