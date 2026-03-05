document.addEventListener('DOMContentLoaded', () => {
    const payBtn = document.getElementById('payBtn');
    const modal = document.getElementById('successModal');

    const name = localStorage.getItem('booking_fac');
    const time = localStorage.getItem('booking_time');
    const date = localStorage.getItem('booking_date');
    const price = localStorage.getItem('booking_price');

    const summary = document.getElementById('paymentSummary');
    if (summary) {
        summary.innerHTML = `
            <div class="summary-row"><span>Facility</span><span>${name}</span></div>
            <div class="summary-row"><span>Date</span><span>${date}</span></div>
            <div class="summary-row"><span>Time</span><span>${time}</span></div>
            <div class="summary-row summary-total"><span>Total</span><span>₹${price}</span></div>
        `;
    }

    if (payBtn) {
        payBtn.addEventListener('click', () => {
            payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            payBtn.disabled = true;

            // Save to dummy bookings
            const newBooking = {
                id: 'BK' + Date.now().toString().slice(-5),
                facility: name,
                date: date,
                time: time,
                price: price,
                status: 'Confirmed',
                pwo: localStorage.getItem('booking_pwo') === 'true',
                duration: localStorage.getItem('booking_duration') || '1 hr'
            };

            const existing = JSON.parse(localStorage.getItem('user_history') || '[]');
            existing.push(newBooking);
            localStorage.setItem('user_history', JSON.stringify(existing));

            // Play with Opponent?
            const pwo = localStorage.getItem('booking_pwo') === 'true';
            if (pwo) {
                const userName = sessionStorage.getItem('userName') || 'John Doe';
                const userTeam = localStorage.getItem('booking_team_name') || `${userName} Team`;

                const newChallenge = {
                    id: 'CH' + Date.now().toString().slice(-4),
                    teamName: userTeam,
                    sport: localStorage.getItem('booking_sport') || 'Football',
                    players: localStorage.getItem('booking_players') || 10,
                    date: date,
                    time: time,
                    location: name,
                    status: 'Open Status/Request Join',
                    teamIcon: 'fas fa-shield-halved',
                    sportIcon: 'fas fa-futbol',
                    isUserCreated: true
                };
                const challenges = JSON.parse(localStorage.getItem('open_challenges') || '[]');
                challenges.push(newChallenge);
                localStorage.setItem('open_challenges', JSON.stringify(challenges));

                // Update modal feedback
                const modalP = modal.querySelector('p');
                if (modalP) modalP.innerHTML = `Confirmed! Your challenge for <strong>${userTeam}</strong> has been added to the <strong>Open Challenges</strong> section.`;
            }

            setTimeout(() => {
                modal.style.display = 'flex'; // Use flex for visibility
            }, 1000);
        });
    }

    // Payment option toggle
    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
        });
    });
});
