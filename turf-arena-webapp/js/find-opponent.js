document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('challengesGrid');
    const sentGrid = document.getElementById('sentChallengesGrid');
    const receivedGrid = document.getElementById('receivedChallengesGrid');
    const historyGrid = document.getElementById('historyChallengesGrid');

    if (!grid) return;

    // Merge user-created challenges from localStorage
    const userChallenges = JSON.parse(localStorage.getItem('open_challenges') || '[]');
    let challenges = [...userChallenges, ...window.arenaData.challenges];

    // Add MatchDateTime for dynamic user entries
    challenges.forEach(ch => {
        if (!ch.matchDateTime && ch.date && ch.time) {
            try {
                const startTime = ch.time.split(' - ')[0];
                const [time, modifier] = startTime.split(' ');
                let [h, m] = time.split(':');
                if (h === '12') h = '00';
                if (modifier === 'PM') h = parseInt(h) + 12;
                ch.matchDateTime = new Date(`${ch.date}T${h.toString().padStart(2, '0')}:${m || '00'}:00`);
            } catch (e) { }
        }
    });
    let myChallenges = {
        sent: [
            {
                id: 'CH_SENT_01',
                teamName: 'Night Warriors',
                sport: 'Football',
                players: 5,
                date: '2026-03-12',
                time: '07:00 PM - 08:30 PM',
                matchDateTime: new Date(Date.now() + 10 * 3600000), // 10 hours from now
                location: 'Turf Arena',
                status: 'Challenge Pending',
                teamIcon: 'fas fa-moon',
                sportIcon: 'fas fa-futbol'
            }
        ],
        received: [
            {
                id: 'CH_REC_01',
                teamName: 'Fire Dragons',
                sport: 'Cricket',
                players: 11,
                date: '2026-03-10',
                time: '05:00 PM - 06:00 PM',
                matchDateTime: new Date(Date.now() + 6 * 3600000), // 6 hours from now
                location: 'Turf Arena',
                status: 'Challenge Received',
                teamIcon: 'fas fa-fire',
                sportIcon: 'fas fa-bat'
            },
            {
                id: 'CH_REC_02',
                teamName: 'Thunder Strikers',
                sport: 'Cricket',
                players: 8,
                date: '2026-03-11',
                time: '04:00 PM - 05:00 PM',
                matchDateTime: new Date(Date.now() + 24 * 3600000),
                location: 'Turf Arena',
                status: 'Challenge Received',
                teamIcon: 'fas fa-bolt',
                sportIcon: 'fas fa-bat'
            }
        ],
        history: [
            {
                id: 'CH_HIST_01',
                teamName: 'Mighty Strikers',
                sport: 'Cricket',
                players: 11,
                date: '2026-02-28',
                time: '04:00 PM - 07:00 PM',
                matchDateTime: new Date('2026-02-28T16:00:00'),
                location: 'Turf Arena',
                status: 'Won',
                teamIcon: 'fas fa-bat',
                sportIcon: 'fas fa-cricket',
                resultText: 'Won by 2 Wickets',
                matchDetails: 'Mighty Strikers scored 152/8 (20 overs). We chased 155/8 in 19.4 overs. Top Scorer: A. Sharma (65*)'
            },
            {
                id: 'CH_HIST_02',
                teamName: 'Goal Getters',
                sport: 'Football',
                players: 5,
                date: '2026-02-15',
                time: '08:00 PM - 09:00 PM',
                matchDateTime: new Date('2026-02-15T20:00:00'),
                location: 'Turf Arena',
                status: 'Lost',
                teamIcon: 'fas fa-bullseye',
                sportIcon: 'fas fa-futbol',
                resultText: 'Lost 1-2',
                matchDetails: 'Goals: Them (25\', 67\'), Us (42\'). Cards: 2 Yellows (Us), 1 Yellow (Them).'
            }
        ]
    };

    let notifications = [
        { text: 'Thunder Strikers accepted your challenge!', time: '2 mins ago', type: 'accepted' },
        { text: 'Goal Getters challenged your team!', time: '1 hour ago', type: 'received' },
        { text: 'Smash Kings rejected your challenge.', time: '3 hours ago', type: 'rejected' }
    ];

    function calculateAcceptBefore(matchTime) {
        // Rule: Accept 4 hours before match time
        const matchDate = new Date(matchTime);
        return new Date(matchDate.getTime() - (4 * 60 * 60 * 1000));
    }

    function getTimerString(deadline) {
        const now = new Date();
        const diff = deadline - now;

        if (diff <= 0) return "Expired";

        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function getTimerClass(deadline) {
        const now = new Date();
        const diff = deadline - now;
        if (diff < 600000) return 'timer-danger'; // < 10 mins
        if (diff < 3600000) return 'timer-warning'; // < 1 hour
        return '';
    }

    function createChallengeCard(ch, type = 'open') {
        const matchDate = ch.matchDateTime || calculateMockMatchTime(ch.time);
        const deadline = calculateAcceptBefore(matchDate);
        const timerStr = getTimerString(deadline);
        const timerClass = getTimerClass(deadline);

        const statusClass = ch.status.toLowerCase() === 'won' ? 'badge-accepted' :
            ch.status.toLowerCase() === 'lost' ? 'badge-rejected' :
                ch.status.toLowerCase().includes('pending') ? 'badge-pending' :
                    ch.status.toLowerCase().includes('accepted') ? 'badge-accepted' :
                        ch.status.toLowerCase().includes('rejected') ? 'badge-rejected' : 'badge-open';

        const actionText = type === 'open' ? 'Challenge' :
            type === 'sent' ? 'Wait Response' :
                type === 'history' ? 'Match Details' : 'Review Request';

        const actionFunc = type === 'open' ? `initiateChallenge('${ch.id}')` :
            type === 'history' ? `viewDetails('${ch.id}', true)` :
                type === 'received' ? `reviewChallenge('${ch.id}')` : '';

        const actionClass = type === 'open' ? 'btn-primary' :
            type === 'history' ? 'btn-outline' :
                type === 'received' ? 'btn-primary' : 'btn-secondary';

        const actionDisabled = type === 'sent' ? 'disabled' : '';

        return `
            <div class="challenge-card" id="card-${ch.id}">
                <div class="card-top">
                    <div class="team-info-main">
                        <div class="team-icon-small">
                            <i class="${ch.teamIcon}"></i>
                        </div>
                        <div class="team-name-sport">
                            <h3>${ch.teamName}</h3>
                            <p>${ch.sport}</p>
                        </div>
                    </div>
                    <div class="challenge-badge ${statusClass}">
                        ${ch.status}
                    </div>
                </div>

                <div class="${type === 'history' ? 'hidden' : 'timer-section'}" ${type === 'history' ? 'style="display:none;"' : ''}>
                    <span class="timer-label"><i class="fas fa-clock"></i> Accept Before:</span>
                    <span class="timer-countdown ${timerClass}" data-deadline="${deadline.toISOString()}">${timerStr}</span>
                </div>
                
                ${type === 'history' ? `
                <div style="background: ${ch.status === 'Won' ? 'rgba(46, 213, 115, 0.1)' : 'rgba(255, 71, 87, 0.1)'}; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                    <strong style="color: ${ch.status === 'Won' ? 'var(--success)' : 'var(--danger)'}; display: block; margin-bottom: 5px;">${ch.resultText}</strong>
                    <div style="font-size: 0.8rem; color: var(--gray);">${ch.matchDetails || ''}</div>
                </div>` : ''}

                <div class="challenge-details-list">
                    <div class="detail-row">
                        <label>Players</label>
                        <span>${ch.players} Players</span>
                    </div>
                    <div class="detail-row">
                        <label>Date</label>
                        <span>${ch.date}</span>
                    </div>
                    <div class="detail-row">
                        <label>Match Time</label>
                        <span>${ch.time}</span>
                    </div>
                    <div class="detail-row">
                        <label>Location</label>
                        <span>${ch.location}</span>
                    </div>
                </div>

                <div class="card-actions">
                    <button class="btn btn-outline" onclick="viewDetails('${ch.id}')">View Details</button>
                    <button class="btn ${actionClass}" onclick="${actionFunc}" ${actionDisabled}>${actionText}</button>
                </div>
            </div>
        `;
    }

    function calculateMockMatchTime(timeStr) {
        // DUMMY: Converts "05:00 PM - 06:00 PM" to a Date object (assuming tomorrow)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const [time, modifier] = timeStr.split('-')[0].trim().split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
        tomorrow.setHours(hours, minutes || 0, 0, 0);
        return tomorrow;
    }

    function renderChallenges(data) {
        grid.innerHTML = data.map(ch => createChallengeCard(ch, 'open')).join('');
    }

    function renderMyChallenges() {
        if (sentGrid) sentGrid.innerHTML = myChallenges.sent.map(ch => createChallengeCard(ch, 'sent')).join('');
        if (receivedGrid) receivedGrid.innerHTML = myChallenges.received.map(ch => createChallengeCard(ch, 'received')).join('');
        if (historyGrid) historyGrid.innerHTML = myChallenges.history.map(ch => createChallengeCard(ch, 'history')).join('');

        const sentCount = myChallenges.sent.length;
        const receivedCount = myChallenges.received.length;

        const sentBadge = document.getElementById('sentCount');
        const receivedBadge = document.getElementById('receivedCount');

        if (sentBadge) sentBadge.innerText = `(${sentCount})`;
        if (receivedBadge) receivedBadge.innerText = `(${receivedCount})`;

        renderHeaderBadge(sentCount + receivedCount);
        renderUniversalNotifs();
    }

    function renderHeaderBadge(count) {
        const badge = document.getElementById('headerNotifBadge');
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

        if (badge) {
            if (isLoggedIn && count > 0) {
                badge.style.display = 'flex'; // Use flex to center text in circle
                badge.innerText = count;
                badge.className = 'menu-notif-badge'; // New CSS class
            } else {
                badge.style.display = 'none';
            }
        }
    }

    function renderUniversalNotifs() {
        if (window.updateHeaderBadges) window.updateHeaderBadges();
    }

    function updateTimers() {
        document.querySelectorAll('.timer-countdown').forEach(el => {
            const deadline = new Date(el.dataset.deadline);
            el.innerText = getTimerString(deadline);
            el.className = 'timer-countdown ' + getTimerClass(deadline);

            if (el.innerText === 'Expired') {
                const card = el.closest('.challenge-card');
                const badge = card.querySelector('.challenge-badge');
                if (badge && badge.innerText !== 'Expired') {
                    badge.innerText = 'Expired';
                    badge.className = 'challenge-badge badge-expired';
                }
            }
        });

        // Sync review modal timer if open
        const revModal = document.getElementById('reviewModal');
        if (revModal && revModal.style.display === 'flex' && window.currentReviewId) {
            const ch = myChallenges.received.find(c => c.id === window.currentReviewId);
            if (ch) {
                const matchDate = ch.matchDateTime || calculateMockMatchTime(ch.time);
                const deadline = calculateAcceptBefore(matchDate);
                document.getElementById('revTimer').innerText = getTimerString(deadline);
            }
        }
    }

    // Tab Switching Logic
    window.switchTab = (tab) => {
        const views = {
            'open': document.getElementById('openChallengesView'),
            'sent': document.getElementById('sentChallengesView'),
            'received': document.getElementById('receivedChallengesView'),
            'history': document.getElementById('historyChallengesView')
        };
        const btns = document.querySelectorAll('.tab-btn');

        // Hide all views
        Object.values(views).forEach(v => { if (v) v.style.display = 'none'; });
        btns.forEach(b => b.classList.remove('active'));

        // Show selected view
        if (views[tab]) views[tab].style.display = 'block';

        // Active button logic
        if (tab === 'open') btns[0] && btns[0].classList.add('active');
        if (tab === 'sent') { btns[1] && btns[1].classList.add('active'); renderMyChallenges(); }
        if (tab === 'received') { btns[2] && btns[2].classList.add('active'); renderMyChallenges(); }
        if (tab === 'history') { btns[3] && btns[3].classList.add('active'); renderMyChallenges(); }
    };

    window.applyFilters = () => {
        const sport = document.getElementById('sportFilter').value;
        const date = document.getElementById('dateFilter').value;
        const players = document.getElementById('playerFilter').value;

        let filtered = challenges;
        if (sport !== 'All') filtered = filtered.filter(ch => ch.sport === sport);
        if (date) filtered = filtered.filter(ch => ch.date === date);
        if (players) filtered = filtered.filter(ch => ch.players >= parseInt(players));

        renderChallenges(filtered);
    };

    window.initiateChallenge = (id) => {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            showModal('Login Required', 'Please login to challenge teams and track your matches.', 'lock');
            return;
        }
        showModal('Wallet Reservation', '<strong>₹600</strong> will be reserved from your wallet for this challenge.', 'wallet', id);
    };

    function showModal(title, text, iconType, id = null) {
        const modal = document.getElementById('challengeModal');
        const icon = document.getElementById('challengeModalIcon');
        document.getElementById('challengeModalTitle').innerText = title;
        document.getElementById('challengeModalText').innerHTML = text;

        const actions = document.getElementById('challengeModalActions');
        if (iconType === 'lock') {
            icon.innerHTML = '<i class="fas fa-lock"></i>';
            actions.innerHTML = `
                <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="location.href='index.html#login'">Login</button>
            `;
        } else if (iconType === 'wallet') {
            icon.innerHTML = '<i class="fas fa-wallet"></i>';
            actions.innerHTML = `
                <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="confirmChallenge('${id}')">Continue</button>
            `;
        }
        modal.style.display = 'flex';
    }

    window.confirmChallenge = (id) => {
        // Update dummy data and move to "My Challenges"
        const ch = challenges.find(c => c.id === id);
        if (ch) {
            const newSent = { ...ch, status: 'Challenge Pending', matchDateTime: calculateMockMatchTime(ch.time) };
            myChallenges.sent.push(newSent);

            const modal = document.getElementById('challengeModal');
            document.getElementById('challengeModalIcon').innerHTML = '<i class="fas fa-check-circle" style="color: #4cd137;"></i>';
            document.getElementById('challengeModalTitle').innerText = 'Request Sent!';
            document.getElementById('challengeModalText').innerText = '₹600 reserved. Opponent notified.';
            document.getElementById('challengeModalActions').innerHTML = `<button class="btn btn-primary" onclick="closeModal(); switchTab('sent');">View My Challenges</button>`;
        }
    };

    // Review Challenge Logic
    window.reviewChallenge = (id) => {
        const ch = myChallenges.received.find(c => c.id === id);
        if (!ch) return;

        window.currentReviewId = id;
        document.getElementById('revTeamIcon').innerHTML = `<i class="${ch.teamIcon}"></i>`;
        document.getElementById('revTeamName').innerText = ch.teamName;
        document.getElementById('revSport').innerText = `${ch.sport} • ${ch.players} Players`;
        document.getElementById('revDate').innerText = ch.date;
        document.getElementById('revTime').innerText = ch.time;
        document.getElementById('revLocation').innerText = ch.location;
        document.getElementById('revRemark').value = '';

        const matchDate = ch.matchDateTime || calculateMockMatchTime(ch.time);
        const deadline = calculateAcceptBefore(matchDate);
        document.getElementById('revTimer').innerText = getTimerString(deadline);

        document.getElementById('revActions').innerHTML = `
            <button class="btn btn-outline" onclick="handleReviewAction('reject', '${id}')" style="border-color: #ff4757; color: #ff4757;">Reject Challenge</button>
            <button class="btn btn-primary" onclick="handleReviewAction('accept', '${id}')" style="background: #2ed573; border: none;">Accept Challenge</button>
        `;

        document.getElementById('reviewModal').style.display = 'flex';
    };

    window.closeReviewModal = () => {
        document.getElementById('reviewModal').style.display = 'none';
        window.currentReviewId = null;
    };

    window.handleReviewAction = (action, id) => {
        const remark = document.getElementById('revRemark').value;
        const ch = myChallenges.received.find(c => c.id === id);

        if (action === 'accept') {
            // Logic: Move to Accepted Matches (Dummy: just remove and show success)
            myChallenges.received = myChallenges.received.filter(c => c.id !== id);
            showModal('Challenge Accepted', `Match confirmed successfully. ${remark ? '<br>Remark sent: ' + remark : ''}`, 'success');
        } else {
            // Logic: Reject
            myChallenges.received = myChallenges.received.filter(c => c.id !== id);
            showModal('Challenge Rejected', `Opponent team has been notified. ${remark ? '<br>Remark sent: ' + remark : ''}`, 'reject');
        }

        closeReviewModal();
        renderMyChallenges();
    };

    // Overriding showModal to support more icons
    const originalShowModal = showModal;
    showModal = (title, text, type, id = null) => {
        if (type === 'success' || type === 'reject') {
            const modal = document.getElementById('challengeModal');
            const icon = document.getElementById('challengeModalIcon');
            document.getElementById('challengeModalTitle').innerText = title;
            document.getElementById('challengeModalText').innerHTML = text;

            const actions = document.getElementById('challengeModalActions');
            icon.innerHTML = type === 'success' ?
                '<i class="fas fa-check-circle" style="color: #2ed573;"></i>' :
                '<i class="fas fa-times-circle" style="color: #ff4757;"></i>';

            actions.innerHTML = `<button class="btn btn-primary" onclick="closeModal()">Close</button>`;
            modal.style.display = 'flex';
        } else {
            originalShowModal(title, text, type, id);
        }
    };

    window.closeModal = () => document.getElementById('challengeModal').style.display = 'none';

    window.viewDetails = (id) => {
        // If it's a received challenge, open review. Else go to details page.
        if (myChallenges.received.some(c => c.id === id)) {
            reviewChallenge(id);
        } else {
            window.location.href = `opponent-details.html?id=${id}`;
        }
    };

    // Close on click outside & Escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeReviewModal();
            closeModal();
            closeTeamHighlight();
        }
    });

    const revModal = document.getElementById('reviewModal');
    if (revModal) {
        revModal.addEventListener('click', (e) => {
            if (e.target === revModal) closeReviewModal();
        });
    }

    const chalModal = document.getElementById('challengeModal');
    if (chalModal) {
        chalModal.addEventListener('click', (e) => {
            if (e.target === chalModal) closeModal();
        });
    }

    const thModal = document.getElementById('teamHighlightModal');
    if (thModal) {
        thModal.addEventListener('click', (e) => {
            if (e.target === thModal) closeTeamHighlight();
        });
    }

    // Timer Loop
    setInterval(updateTimers, 1000);

    // Initial render
    renderChallenges(challenges);
    renderMyChallenges();
});
