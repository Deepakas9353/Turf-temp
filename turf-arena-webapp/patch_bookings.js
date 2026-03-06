const fs = require('fs');
let html = fs.readFileSync('my-bookings.html', 'utf8');

// Normalize to LF for easy processing
html = html.replace(/\r\n/g, '\n');

let patched = false;

// 1. Replace const with let for statusText/statusColor and add b.rec logic
const oldStatus = `const isAccepted = b.pwo && Math.random() > 0.6;
                    const statusText = isAccepted ? 'Opponent Accepted' : b.status;
                    const statusColor = isAccepted ? '#ff9800' : (b.status === 'Confirmed' ? 'var(--primary)' : '#666');`;

const newStatus = `const isAccepted = b.pwo && Math.random() > 0.6;
                    let statusText = isAccepted ? 'Opponent Accepted' : b.status;
                    let statusColor = isAccepted ? '#ff9800' : (b.status === 'Confirmed' ? 'var(--primary)' : '#666');

                    if (b.rec) {
                        statusText = 'Recruiting';
                        statusColor = '#8e44ad';
                    }`;

if (html.includes(oldStatus)) {
    html = html.replace(oldStatus, newStatus);
    console.log('✓ Status block updated');
    patched = true;
} else {
    console.log('✗ Status block not found');
}

// 2. Add teammate badge tag after the "Open Challenge" badge
const oldChallengeBadge = `\${b.pwo ? \`<span style="background: #e1f5fe; color: #0288d1; font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; font-weight: 700; text-transform: uppercase;"><i class="fas fa-shield-halved"></i> Open Challenge</span>\` : ''}
                                    </div>`;

const newChallengeBadge = `\${b.pwo ? \`<span style="background: #e1f5fe; color: #0288d1; font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; font-weight: 700; text-transform: uppercase;"><i class="fas fa-shield-halved"></i> Open Challenge</span>\` : ''}
                                        \${b.rec ? \`<span style="background: #f4ecf7; color: #8e44ad; font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; font-weight: 700; text-transform: uppercase;"><i class="fas fa-user-plus"></i> Teammates Needed (\${b.recPlayers})</span>\` : ''}
                                    </div>`;

if (html.includes(oldChallengeBadge)) {
    html = html.replace(oldChallengeBadge, newChallengeBadge);
    console.log('✓ Challenge badge title updated');
    patched = true;
} else {
    console.log('✗ Challenge badge not found');
}

// 3. Add "Missing: X Players" after the "Opponent Joined" span and before closing div
const oldJoinedSection = `<i class="fas fa-handshake"></i> Opponent Joined: <strong>\${isAccepted ? 'YES' : 'NO'}</strong>
                                        </span>
                                    </div>
                                </div>`;

const newJoinedSection = `<i class="fas fa-handshake"></i> Opponent Joined: <strong>\${isAccepted ? 'YES' : 'NO'}</strong>
                                        </span>
                                        \${b.rec ? \`<span style="color: #8e44ad; font-weight: 600; font-size: 0.85rem;"><i class="fas fa-users"></i> Missing: <strong>\${b.recPlayers} Players</strong></span>\` : ''}
                                    </div>
                                </div>`;

if (html.includes(oldJoinedSection)) {
    html = html.replace(oldJoinedSection, newJoinedSection);
    console.log('✓ Recruitment players missing info added');
    patched = true;
} else {
    console.log('✗ Joined section not found — scanning...');
    const idx = html.indexOf('Opponent Joined');
    if (idx !== -1) {
        console.log('Context: ', JSON.stringify(html.substring(idx - 10, idx + 250)));
    }
}

// 4. Fix status badge background to be purple when b.rec
const oldBagBg = `background: \${isAccepted ? '#fff3e0' : '#e8f5e9'}`;
const newBadgeBg = `background: \${isAccepted ? '#fff3e0' : (b.rec ? '#f4ecf7' : '#e8f5e9')}`;
if (html.includes(oldBagBg)) {
    html = html.replace(oldBagBg, newBadgeBg);
    console.log('✓ Badge bg updated');
    patched = true;
} else {
    console.log('✗ Badge bg not found');
}

// Write back with CRLF
fs.writeFileSync('my-bookings.html', html.replace(/\n/g, '\r\n'));
console.log(patched ? '\nFile saved successfully!' : '\nNo changes were patched.');
