document.addEventListener('DOMContentLoaded', () => {
    const facName = document.getElementById('facName');
    const facTime = document.getElementById('facTime');
    const facPrice = document.getElementById('facPrice');
    const totalPrice = document.getElementById('totalPrice');
    const bookingDate = document.getElementById('bookingDate');

    const name = localStorage.getItem('booking_fac');
    const time = localStorage.getItem('booking_time');
    const price = localStorage.getItem('booking_price');
    const duration = localStorage.getItem('booking_duration');

    if (facName) {
        facName.value = name || '';
        facTime.value = time || '';
        if (document.getElementById('facDuration')) document.getElementById('facDuration').innerText = duration || '--';
        if (document.getElementById('facRate')) {
            // Calculate hourly rate back if needed or just use dummy from data
            const fac = window.arenaData.turfs.find(f => f.name === name);
            if (fac) document.getElementById('facRate').innerText = `₹${fac.price}/hr`;
        }
        if (totalPrice) totalPrice.innerText = `₹${price}`;

        // Get saved date or fallback to tomorrow
        const savedDate = localStorage.getItem('booking_date');
        if (savedDate) {
            bookingDate.value = savedDate;
        } else {
            const today = new Date();
            today.setDate(today.getDate() + 1);
            bookingDate.value = today.toISOString().split('T')[0];
        }
    }

    const pwo = localStorage.getItem('booking_pwo') === 'true';
    const teamSection = document.getElementById('teamNameSection');
    const teamInput = document.getElementById('teamNameInput');

    if (pwo && teamSection && teamInput) {
        teamSection.style.display = 'block';
        // Default: [User Name] Team
        const userName = sessionStorage.getItem('userName') || 'John Doe';
        teamInput.value = `${userName} Team`;
    }

    // Go Back button - point to specific facility
    const goBack = document.getElementById('goBackBtn');
    if (goBack) {
        goBack.addEventListener('click', (e) => {
            const facId = localStorage.getItem('booking_fac_id');
            if (facId) {
                e.preventDefault();
                location.href = `turf-details.html?id=${facId}`;
            } else {
                // If no ID, standard history back is safer than a dead link
                e.preventDefault();
                window.history.back();
            }
        });
    }

    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            localStorage.setItem('booking_date', bookingDate.value);
            if (pwo && teamInput) {
                localStorage.setItem('booking_team_name', teamInput.value);
            }
            location.href = 'payment.html';
        });
    }
});
