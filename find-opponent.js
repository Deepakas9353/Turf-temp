document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('challengesGrid');
    const sentGrid = document.getElementById('sentChallengesGrid');
    const receivedGrid = document.getElementById('receivedChallengesGrid');
    const historyGrid = document.getElementById('historyChallengesGrid');
    const recruitmentGrid = document.getElementById('recruitmentGrid');

    if (!grid) return;

    // Merge user-created challenges from localStorage
    const userChallenges = JSON.parse(localStorage.getItem('open_challenges') || '[]');
    let challenges = [...userChallenges, ...window.arenaData.challenges];

    // Load user recruitment from localStorage (cleared on refresh as requested by user's "disappear" rule)
    // Actually, to make them disappear on refresh, we can just not use localStorage, 
    // but the user might want them to persist *during* the session.
    // Let's use sessionStorage so they stay until the tab is closed, or just leave it in-memory.
    // The user said "once refresh... newly created has to disappear". 
    const userRecruitment = JSON.parse(sessionStorage.getItem('user_recruitment') || '[]');
    sessionStorage.removeItem('user_recruitment'); // Disappear upon page refresh
    window.arenaData.recruitment = [...userRecruitment, ...window.arenaData.recruitment];

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
            },
            {
                id: 'JOIN_REC_01',
                teamName: 'Solo Striker (Amit)',
                sport: 'Football',
                players: 1,
                date: '2026-03-12',
                time: '08:00 PM - 10:00 PM',
                matchDateTime: new Date(Date.now() + 12 * 3600000),
                location: 'Turf Arena',
                status: 'Join Request',
                teamIcon: 'fas fa-user',
                sportIcon: 'fas fa-user-plus',
                isJoinRequest: true,
                message: "I usually play as a defender. Would love to join your Friday night game!"
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

        if (type === 'recruitment') {
            return `
            <div class="challenge-card" id="rec-${ch.id}">
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
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 5px;">
                        <span class="challenge-badge" style="background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9;">
                            <i class="fas fa-check-circle"></i> Confirmed
                        </span>
                        <div class="challenge-badge badge-open" style="background: #f4ecf7; color: #8e44ad; border: 1px dashed #8e44ad;">
                            ${ch.neededPlayers} Joiners Required
                        </div>
                    </div>
                </div>

                <div class="challenge-details-list">
                    <div class="detail-row">
                        <label>Current Members</label>
                        <span>${ch.currentPlayers} Members</span>
                    </div>
                    <div class="detail-row">
                        <label>Date</label>
                        <span>${ch.date}</span>
                    </div>
                    <div class="detail-row">
                        <label>Time</label>
                        <span>${ch.time}</span>
                    </div>
                    <div class="detail-row">
                        <label>Location</label>
                        <span>${ch.location}</span>
                    </div>
                </div>

                <div class="card-actions">
                    <button class="btn btn-outline" onclick="viewDetails('${ch.id}')">View Team</button>
                    <button class="btn btn-primary" onclick="requestToJoin('${ch.id}')" ${!ch.allowJoin ? 'disabled' : ''}>Request to Join</button>
                </div>
            </div>
            `;
        }

        // SPECIAL HANDLING FOR JOIN REQUESTS IN RECEIVED TAB
        if (ch.isJoinRequest && type === 'received') {
            return `
                <div class="challenge-card" id="card-${ch.id}">
                    <div class="card-top">
                        <div class="team-info-main">
                            <div class="team-icon-small">
                                <i class="${ch.teamIcon}"></i>
                            </div>
                            <div class="team-name-sport">
                                <h3>${ch.teamName}</h3>
                                <p>Player Request • ${ch.sport}</p>
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 5px;">
                            <span class="challenge-badge" style="background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9;">
                                <i class="fas fa-check-circle"></i> Confirmed
                            </span>
                            <div class="challenge-badge badge-pending">
                                Join Request
                            </div>
                        </div>
                    </div>

                    <div class="timer-section">
                        <span class="timer-label"><i class="fas fa-clock"></i> Accept Before:</span>
                        <span class="timer-countdown ${timerClass}" data-deadline="${deadline.toISOString()}">${timerStr}</span>
                    </div>

                    <div style="background: rgba(240, 247, 241, 0.5); padding: 12px; border-radius: 8px; margin-bottom: 20px; font-style: italic; font-size: 0.9rem; color: var(--accent); border-left: 3px solid var(--primary);">
                        "${ch.message}"
                    </div>

                    <div class="challenge-details-list">
                        <div class="detail-row">
                            <label>Target Activity</label>
                            <span>${ch.time}</span>
                        </div>
                        <div class="detail-row">
                            <label>Date</label>
                            <span>${ch.date}</span>
                        </div>
                        <div class="detail-row">
                            <label>Location</label>
                            <span>${ch.location || 'Turf Arena'}</span>
                        </div>
                        <div class="detail-row">
                            <label>Players</label>
                            <span>${ch.players || 1} Player(s)</span>
                        </div>
                    </div>

                    <div class="card-actions">
                        <button class="btn btn-outline" onclick="reviewJoinRequest('${ch.id}')">Review Player</button>
                        <button class="btn btn-primary" onclick="reviewJoinRequest('${ch.id}')">Accept</button>
                    </div>
                </div>
            `;
        }

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
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 5px;">
                        <span class="challenge-badge" style="background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9;">
                            <i class="fas fa-check-circle"></i> Confirmed
                        </span>
                        <div class="challenge-badge ${statusClass}">
                            ${ch.status}
                        </div>
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

    function renderChallenges(data, recData = null) {
        if (!recData) recData = window.arenaData.recruitment;
        grid.innerHTML = data.map(ch => createChallengeCard(ch, 'open')).join('');
        if (recruitmentGrid) {
            recruitmentGrid.innerHTML = recData.map(ch => createChallengeCard(ch, 'recruitment')).join('');
        }
    }

    function renderMyChallenges() {
        if (sentGrid) sentGrid.innerHTML = myChallenges.sent.map(ch => createChallengeCard(ch, 'sent')).join('');
        if (receivedGrid) receivedGrid.innerHTML = myChallenges.received.map(ch => createChallengeCard(ch, 'received')).join('');
        if (historyGrid) historyGrid.innerHTML = myChallenges.history.map(ch => createChallengeCard(ch, 'history')).join('');

        const sentCount = myChallenges.sent.length;
        const receivedCount = myChallenges.received.length;

        const sentBadge = document.getElementById('sentCount');
        const receivedBadge = document.getElementById('receivedCount');

        if (sentBadge) sentBadge.innerText = sentCount;
        if (receivedBadge) receivedBadge.innerText = receivedCount;

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
            'recruitment': document.getElementById('recruitmentView'),
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
        if (tab === 'recruitment') btns[1] && btns[1].classList.add('active');
        if (tab === 'sent') { btns[2] && btns[2].classList.add('active'); renderMyChallenges(); }
        if (tab === 'received') { btns[3] && btns[3].classList.add('active'); renderMyChallenges(); }
        if (tab === 'history') { btns[4] && btns[4].classList.add('active'); renderMyChallenges(); }
    };

    window.applyFilters = () => {
        const sport = document.getElementById('sportFilter').value;
        const date = document.getElementById('dateFilter').value;
        const players = document.getElementById('playerFilter').value;

        const filterFn = (ch) => {
            let match = true;
            if (sport !== 'All' && ch.sport !== sport) match = false;
            if (date && ch.date !== date) match = false;
            if (players) {
                const count = ch.players || ch.neededPlayers || 0;
                if (count !== parseInt(players)) match = false;
            }
            return match;
        };

        const filteredChallenges = challenges.filter(filterFn);
        const filteredRecruitment = window.arenaData.recruitment.filter(filterFn);

        renderChallenges(filteredChallenges, filteredRecruitment);
        window.showToast('Filters applied', 'info');
    };

    window.reviewJoinRequest = (id) => {
        const req = myChallenges.received.find(c => c.id === id);
        if (!req) return;

        showModal('Review Player', `Accept <strong>${req.teamName}</strong> into your team for the session on ${req.date}?`, 'join_review', id);
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
        } else if (iconType === 'join') {
            icon.innerHTML = '<i class="fas fa-handshake"></i>';
            actions.innerHTML = `
                <button class="btn btn-outline" onclick="closeModal()">Maybe Later</button>
                <button class="btn btn-primary" onclick="confirmJoin('${id}')">Send Request</button>
            `;
        } else if (iconType === 'join_review') {
            icon.innerHTML = '<i class="fas fa-user-check" style="color: var(--primary);"></i>';
            actions.innerHTML = `
                <button class="btn btn-outline" onclick="handleJoinReview('${id}', 'reject')" style="color: var(--danger); border-color: var(--danger);">Decline</button>
                <button class="btn btn-primary" onclick="handleJoinReview('${id}', 'accept')">Accept Player</button>
            `;
        }
        modal.style.display = 'flex';
    }

    window.handleJoinReview = (id, action) => {
        myChallenges.received = myChallenges.received.filter(c => c.id !== id);
        closeModal();
        renderMyChallenges();
        window.showToast(action === 'accept' ? 'Player accepted!' : 'Request declined', action === 'accept' ? 'success' : 'info');
    };

    window.confirmChallenge = (id) => {
        // Update dummy data and move to "My Challenges"
        const ch = challenges.find(c => c.id === id);
        if (ch) {
            const newSent = { ...ch, id: 'SENT_' + Date.now(), status: 'Challenge Pending', matchDateTime: calculateMockMatchTime(ch.time) };
            myChallenges.sent.push(newSent);

            const modal = document.getElementById('challengeModal');
            document.getElementById('challengeModalIcon').innerHTML = '<i class="fas fa-check-circle" style="color: #4cd137;"></i>';
            document.getElementById('challengeModalTitle').innerText = 'Request Sent!';
            document.getElementById('challengeModalText').innerText = '₹600 reserved. Opponent notified.';
            document.getElementById('challengeModalActions').innerHTML = `<button class="btn btn-primary" onclick="closeModal(); switchTab('sent');">View My Requests</button>`;
        }
    };

    window.requestToJoin = (id) => {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            showModal('Login Required', 'Please login to join teams and explore player opportunities.', 'lock');
            return;
        }

        const rec = window.arenaData.recruitment.find(r => r.id === id);
        if (rec) {
            showModal('Join Request', `Are you sure you want to request to join <strong>${rec.teamName}</strong>? <br><br> Slots needed: ${rec.neededPlayers}`, 'join', id);
        }
    };

    window.confirmJoin = (id) => {
        const rec = window.arenaData.recruitment.find(r => r.id === id);
        if (rec) {
            const newReq = {
                id: 'JOIN_' + Date.now(),
                teamName: rec.teamName,
                sport: rec.sport,
                date: rec.date,
                time: rec.time,
                location: rec.location,
                status: 'Join Request Sent',
                teamIcon: rec.teamIcon,
                sportIcon: 'fas fa-user-plus'
            };
            myChallenges.sent.push(newReq);

            const modal = document.getElementById('challengeModal');
            document.getElementById('challengeModalIcon').innerHTML = '<i class="fas fa-paper-plane" style="color: var(--primary);"></i>';
            document.getElementById('challengeModalTitle').innerText = 'Request Dispatched!';
            document.getElementById('challengeModalText').innerText = 'Your request to join the team has been sent to the creator. You will be notified once they review it.';
            document.getElementById('challengeModalActions').innerHTML = `<button class="btn btn-primary" onclick="closeModal(); switchTab('sent');">Track Requests</button>`;
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
    // Create Modal Logic
    let currentPostType = 'challenge';

    window.openCreateModal = () => {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            showModal('Login Required', 'Please login to post challenges or recruitment openings.', 'lock');
            return;
        }
        document.getElementById('createModal').style.display = 'flex';
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('postDate').value = today;
    };

    window.closeCreateModal = () => {
        document.getElementById('createModal').style.display = 'none';
    };

    window.setPostType = (type) => {
        currentPostType = type;
        const challBtn = document.getElementById('typeChallenge');
        const recruitBtn = document.getElementById('typeRecruit');
        const extra = document.getElementById('recruitExtra');
        const label = document.getElementById('numLabel');

        if (type === 'challenge') {
            challBtn.style.borderColor = 'var(--primary)';
            challBtn.classList.add('active');
            recruitBtn.style.borderColor = '#eee';
            recruitBtn.classList.remove('active');
            extra.style.display = 'none';
            label.innerText = 'Total Team Players';
        } else {
            recruitBtn.style.borderColor = 'var(--primary)';
            recruitBtn.classList.add('active');
            challBtn.style.borderColor = '#eee';
            challBtn.classList.remove('active');
            extra.style.display = 'block';
            label.innerText = 'Current Members';
        }
    };

    window.submitPost = () => {
        const teamName = document.getElementById('postTeamName').value;
        const sport = document.getElementById('postSport').value;
        const num = parseInt(document.getElementById('postNum').value);
        const date = document.getElementById('postDate').value;
        const time = document.getElementById('postTime').value;
        const allowJoin = document.getElementById('postAllowJoin').checked;

        if (!teamName) {
            alert('Please enter a team name');
            return;
        }

        const newId = 'USER_' + Date.now();
        const base = {
            id: newId,
            teamName,
            sport,
            date,
            time,
            location: 'Turf Arena (Home)',
            teamIcon: sport === 'Cricket' ? 'fas fa-bat' : sport === 'Football' ? 'fas fa-futbol' : 'fas fa-medal',
            allowJoin
        };

        if (currentPostType === 'challenge') {
            const post = { ...base, players: num, status: 'Looking for opponent' };
            challenges.unshift(post);
            // Save to localStorage for persistence in session
            const stored = JSON.parse(localStorage.getItem('open_challenges') || '[]');
            stored.unshift(post);
            localStorage.setItem('open_challenges', JSON.stringify(stored));
        } else {
            const needed = parseInt(document.getElementById('postNeeded').value);
            const post = { ...base, currentPlayers: num, neededPlayers: needed, status: 'Waiting for Joiners' };
            window.arenaData.recruitment.unshift(post);
        }

        closeCreateModal();
        renderChallenges(challenges);
        window.showToast('Activity posted successfully!', 'success');

        // Auto switch tab to relevant view
        if (currentPostType === 'challenge') switchTab('open');
        else switchTab('recruitment');
    };

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeReviewModal();
            closeModal();
            closeCreateModal();
            if (window.closeTeamHighlight) window.closeTeamHighlight();
        }
    });

    const creModal = document.getElementById('createModal');
    if (creModal) {
        creModal.addEventListener('click', (e) => {
            if (e.target === creModal) closeCreateModal();
        });
    }

    const chalModal = document.getElementById('challengeModal');
    if (chalModal) {
        chalModal.addEventListener('click', (e) => {
            if (e.target === chalModal) closeModal();
        });
    }

    // Timer Loop
    setInterval(updateTimers, 1000);

    // Initial render
    renderChallenges(challenges);
    renderMyChallenges();
});
