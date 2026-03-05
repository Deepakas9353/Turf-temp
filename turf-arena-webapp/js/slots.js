/**
 * TURF ARENA - ENHANCED SLOT BOOKING SYSTEM (IST Focus)
 * Supports: 12-hour selection (AM/PM), Date selection, Multi-slot merging, and conflict detection.
 */

let selectedSlots = [];
let bookedSlotsMap = {
    // Dummy: mapping date string to indices of booked slots
    'default': [2]
};

function timeToMinutes(timeStr) {
    if (!timeStr) return null;

    // Handle 12h format (HH:mm AM/PM)
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return null;

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const modifier = match[3].toUpperCase();

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
}

function minutesTo12h(totalMinutes) {
    let hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const modifier = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${modifier}`;
}

function isOverlapping(s1, e1, s2, e2) {
    return Math.max(s1, s2) < Math.min(e1, e2);
}

function initSlots(facility) {
    const slotsGrid = document.getElementById('slotsGrid');
    const bookBtn = document.getElementById('bookNowBtn');
    const dateInput = document.getElementById('bookingDate');
    const summaryBox = document.getElementById('bookingSummary');
    const errorBox = document.getElementById('bookingError');
    const errorText = document.getElementById('errorText');
    const summaryTimeLabel = document.getElementById('summaryTime');
    const summaryDurationLabel = document.getElementById('summaryDuration');

    // Hour/Min Dropdowns
    const startH = document.getElementById('startH');
    const startM = document.getElementById('startM');
    const startAP = document.getElementById('startAP');
    const endH = document.getElementById('endH');
    const endM = document.getElementById('endM');
    const endAP = document.getElementById('endAP');

    if (!slotsGrid || !bookBtn) return;

    // Populate Dropdowns
    if (startH) {
        let hoursHtml = '<option value="">Hour</option>';
        for (let i = 1; i <= 12; i++) hoursHtml += `<option value="${i}">${i}</option>`;
        startH.innerHTML = hoursHtml;
        endH.innerHTML = hoursHtml;

        let minsHtml = '<option value="00">00</option><option value="30">30</option>';
        startM.innerHTML = minsHtml;
        endM.innerHTML = minsHtml;
    }

    // Set Default Date
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    dateInput.value = tomorrowStr;
    dateInput.min = today.toISOString().split('T')[0];

    const slotDefinitions = [
        { start: "06:00 AM", end: "07:00 AM" },
        { start: "06:00 AM", end: "07:30 AM" },
        { start: "07:00 AM", end: "08:00 AM" },
        { start: "07:00 AM", end: "08:30 AM" },
        { start: "08:00 AM", end: "09:00 AM" },
        { start: "09:00 AM", end: "10:00 AM" },
        { start: "06:00 PM", end: "07:00 PM" },
        { start: "07:00 PM", end: "08:00 PM" },
        { start: "08:00 PM", end: "09:00 PM" }
    ];

    function renderSlots() {
        const curDate = dateInput.value;
        const bookedIndices = [...(bookedSlotsMap[curDate] || bookedSlotsMap['default'])];

        // 1. Check local storage history for overlaps on this date
        const history = JSON.parse(localStorage.getItem('user_history') || '[]');
        const todayBookings = history.filter(b => b.date === curDate && (b.facility === facility.name || b.turf === facility.name));

        // 2. Add extra indices based on time overlaps
        slotDefinitions.forEach((slot, idx) => {
            if (bookedIndices.includes(idx)) return;

            const sM = timeToMinutes(slot.start);
            const eM = timeToMinutes(slot.end);

            const isOverlap = todayBookings.some(b => {
                const [bStartStr, bEndStr] = b.time.split(' - ');
                return isOverlapping(sM, eM, timeToMinutes(bStartStr), timeToMinutes(bEndStr));
            });

            if (isOverlap) bookedIndices.push(idx);
        });

        const bookedSummary = document.getElementById('bookedSlotsSummary');

        // Populate Top Booked List
        if (bookedSummary) {
            if (bookedIndices.length > 0) {
                // Remove duplicates and sort by time
                const uniqueIndices = [...new Set(bookedIndices)].sort((a, b) => timeToMinutes(slotDefinitions[a].start) - timeToMinutes(slotDefinitions[b].start));

                bookedSummary.innerHTML = uniqueIndices.map(idx => {
                    const d = slotDefinitions[idx];
                    return `<div style="display: flex; justify-content: space-between; margin-bottom: 5px; padding-bottom: 5px; border-bottom: 1px solid #f9f9f9;">
                        <span><i class="fas fa-clock" style="color: #fc8181; font-size: 0.8rem;"></i> ${d.start} - ${d.end}</span>
                        <span style="color: #e53935; font-size: 0.75rem; font-weight: 700;">Reserved</span>
                    </div>`;
                }).join('');
            } else {
                bookedSummary.innerHTML = `<div style="text-align: center; color: #a0aec0; padding: 10px;">No bookings for this date yet!</div>`;
            }
        }

        slotsGrid.innerHTML = slotDefinitions.map((d, i) => {
            const booked = bookedIndices.includes(i);
            const timeText = `${d.start} - ${d.end}`;
            return `
                <div class="slot ${booked ? 'booked' : 'available'}" 
                     data-index="${i}" 
                     data-start="${d.start}" 
                     data-end="${d.end}">
                    ${timeText}
                </div>`;
        }).join('');

        // Re-attach listeners
        const slots = slotsGrid.querySelectorAll('.slot.available');
        slots.forEach(slot => {
            slot.addEventListener('click', () => {
                const index = parseInt(slot.dataset.index);
                const startStr = slot.dataset.start;
                const endStr = slot.dataset.end;
                const startM = timeToMinutes(startStr);
                const endM = timeToMinutes(endStr);

                if (selectedSlots.find(s => s.index === index)) {
                    selectedSlots = selectedSlots.filter(s => s.index !== index);
                    slot.classList.remove('selected');
                } else {
                    const overlap = selectedSlots.some(s => isOverlapping(startM, endM, timeToMinutes(s.start), timeToMinutes(s.end)));
                    if (overlap) {
                        showError("This slot overlaps with your current selection. Please adjust.");
                        return;
                    }
                    selectedSlots.push({ index, start: startStr, end: endStr });
                    slot.classList.add('selected');

                    // Clear custom dropdown selections
                    [startH, endH].forEach(sel => sel.value = "");
                }
                updateSummary(facility);
            });
        });
    }

    renderSlots();

    // Listeners for Date and Dropdowns
    dateInput.addEventListener('change', () => {
        selectedSlots = [];
        renderSlots();
        updateSummary(facility);
    });

    [startH, startM, startAP, endH, endM, endAP].forEach(el => {
        if (!el) return;
        el.addEventListener('change', () => {
            if (startH.value || endH.value) {
                selectedSlots = [];
                slotsGrid.querySelectorAll('.slot.selected').forEach(s => s.classList.remove('selected'));
            }
            updateSummary(facility);
        });
    });

    function showError(msg) {
        errorText.innerText = msg;
        errorBox.style.display = 'block';
    }

    function hideError() {
        errorBox.style.display = 'none';
        errorText.innerText = '';
    }

    function updateSummary(facility) {
        let finalStart = null;
        let finalEnd = null;
        let warning = "";

        hideError();

        // 1. Process Custom Dropdowns
        if (startH.value && endH.value) {
            const sTime = `${startH.value.padStart(2, '0')}:${startM.value} ${startAP.value}`;
            const eTime = `${endH.value.padStart(2, '0')}:${endM.value} ${endAP.value}`;
            const sM = timeToMinutes(sTime);
            const eM = timeToMinutes(eTime);

            // IST Limits: 06:00 AM to 09:00 PM (360 to 1260 mins)
            if (sM < 360 || eM > 1260 || sM > 1260 || eM < 360) {
                warning = "Bookings are available only between 6:00 AM and 9:00 PM.";
            } else if (eM <= sM) {
                warning = "End time must be after start time.";
            } else {
                const curDate = dateInput.value;
                const bookedIndices = bookedSlotsMap[curDate] || bookedSlotsMap['default'];
                const conflict = slotDefinitions.some((d, idx) => {
                    if (!bookedIndices.includes(idx)) return false;
                    return isOverlapping(sM, eM, timeToMinutes(d.start), timeToMinutes(d.end));
                });

                if (conflict) {
                    warning = "Part of this time range is already booked on this date. Please adjust.";
                } else {
                    finalStart = sM;
                    finalEnd = eM;
                }
            }
        }
        // 2. Process Grid Selection
        else if (selectedSlots.length > 0) {
            let sorted = [...selectedSlots].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
            let tempStart = timeToMinutes(sorted[0].start);
            let tempEnd = timeToMinutes(sorted[0].end);

            for (let i = 1; i < sorted.length; i++) {
                let nextStart = timeToMinutes(sorted[i].start);
                let nextEnd = timeToMinutes(sorted[i].end);
                if (nextStart !== tempEnd) {
                    warning = "Please select consecutive slots for a continuous booking.";
                    break;
                }
                tempEnd = Math.max(tempEnd, nextEnd);
            }
            if (!warning) {
                finalStart = tempStart;
                finalEnd = tempEnd;
            }
        }

        if (finalStart !== null && finalEnd !== null && !warning) {
            const durM = finalEnd - finalStart;
            const h = Math.floor(durM / 60);
            const m = durM % 60;
            const durText = `${h > 0 ? h + ' hour' + (h > 1 ? 's' : '') : ''} ${m > 0 ? m + ' minutes' : ''}`.trim();

            summaryTimeLabel.innerText = `${minutesTo12h(finalStart)} - ${minutesTo12h(finalEnd)}`;
            summaryDurationLabel.innerText = durText;

            // Encouraging header
            const summaryHeader = summaryBox.querySelector('h3');
            if (summaryHeader) {
                summaryHeader.innerHTML = `<i class="fas fa-check-circle" style="color: #4caf50;"></i> Great! You're ready to book.`;
            }

            summaryBox.style.display = 'block';
            bookBtn.disabled = false;
        } else {
            summaryBox.style.display = 'none';
            bookBtn.disabled = true;
            if (warning) showError(warning);
        }
    }

    bookBtn.addEventListener('click', () => {
        let timeRange = summaryTimeLabel.innerText;
        let [s, e] = timeRange.split(' - ');
        let totalMin = timeToMinutes(e) - timeToMinutes(s);
        let finalPrice = (totalMin / 60) * facility.price;

        localStorage.setItem('booking_fac_id', facility.id);
        localStorage.setItem('booking_fac', facility.name);
        localStorage.setItem('booking_date', dateInput.value);
        localStorage.setItem('booking_time', timeRange);
        localStorage.setItem('booking_price', Math.round(finalPrice));
        localStorage.setItem('booking_duration', summaryDurationLabel.innerText);
        localStorage.setItem('booking_pwo', document.getElementById('playWithOpponent').value);
        localStorage.setItem('booking_sport', facility.sport || 'General');
        localStorage.setItem('booking_players', facility.maxPlayers || '10');

        location.href = 'booking.html';
    });
}

/**
 * Toggle for Play with Opponent
 */
function setPlayWithOpponent(choice) {
    const noBtn = document.getElementById('pwoNo');
    const yesBtn = document.getElementById('pwoYes');
    const input = document.getElementById('playWithOpponent');
    input.value = choice;

    if (choice) {
        yesBtn.style.background = 'var(--primary)';
        yesBtn.style.color = 'white';
        noBtn.style.background = 'transparent';
        noBtn.style.color = '#666';
    } else {
        noBtn.style.background = 'var(--primary)';
        noBtn.style.color = 'white';
        yesBtn.style.background = 'transparent';
        yesBtn.style.color = '#666';
    }
}
