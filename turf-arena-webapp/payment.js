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
                rec: localStorage.getItem('booking_rec') === 'true',
                recPlayers: localStorage.getItem('booking_rec_players') || '1',
                duration: localStorage.getItem('booking_duration') || '1 hr'
            };

            const existing = JSON.parse(localStorage.getItem('user_history') || '[]');
            existing.push(newBooking);
            localStorage.setItem('user_history', JSON.stringify(existing));

            // Teammates required?
            const needRec = localStorage.getItem('booking_rec') === 'true';
            if (needRec) {
                const recPlayers = parseInt(localStorage.getItem('booking_rec_players')) || 1;
                const newRec = {
                    id: 'REC' + Date.now().toString().slice(-4),
                    teamName: 'Mighty Mavericks',
                    sport: localStorage.getItem('booking_sport') || 'Football',
                    currentPlayers: 1,
                    neededPlayers: recPlayers,
                    date: date,
                    time: time,
                    location: name,
                    status: 'Waiting for Joiners',
                    teamIcon: 'fas fa-shield-halved',
                    allowJoin: true,
                    isUserCreated: true
                };
                const recArr = JSON.parse(sessionStorage.getItem('user_recruitment') || '[]');
                recArr.push(newRec);
                sessionStorage.setItem('user_recruitment', JSON.stringify(recArr));

                const modalP = modal.querySelector('p');
                if (modalP) modalP.innerHTML = `Confirmed! A recruitment post for ${recPlayers} player(s) has been added to <strong>Team Recruitment</strong>!`;
            }

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
                window.showToast('Payment successful! Booking confirmed.', 'success');
                setTimeout(() => {
                    window.location.href = 'my-bookings.html';
                }, 2000);
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
