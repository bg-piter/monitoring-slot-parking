// script.js Smart Parking System

async function fetchBlynkPin(pin) {
    try {
        const response = await fetch(`https://blynk.cloud/external/api/get?token=${CONFIG.blynkToken}&${pin}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.text();
    } catch (error) {
        console.error(`Error fetching pin ${pin}:`, error);
        showNotification(`Error: Tidak dapat terhubung ke sensor ${pin}`, 'error');
        return "0";
    }
}

async function updateParkingStatus() {
    let totalAvailable = 0;
    let totalOccupied = 0;
    let totalBooking = 0;
    let floor1Available = 0;
    let floor2Available = 0;

    for (const [slotId, pin] of Object.entries(slotMap)) {
        const sensorValue = await fetchBlynkPin(pin);
        const statusKey = blynkValueToStatus(sensorValue);
        const statusObj = slotStatus[statusKey] || slotStatus.available;

        if (statusKey === "available") {
            totalAvailable++;
            if (slotId.startsWith('l1')) floor1Available++;
            if (slotId.startsWith('l2')) floor2Available++;
        } else if (statusKey === "occupied") {
            totalOccupied++;
        } else if (statusKey === "booking") {
            totalBooking++;
        }

        updateSlotDisplay(slotId, statusObj);
    }
    updateStatistics(totalAvailable, totalOccupied, floor1Available, floor2Available, totalBooking);
}

function updateSlotDisplay(slotId, statusObj) {
    const slotElement = document.getElementById(`slot-${slotId}`);
    const imgElement = document.getElementById(`img-${slotId}`);
    const statusElement = document.getElementById(`status-${slotId}`);

    if (!slotElement || !imgElement || !statusElement) return;

    slotElement.classList.remove('available', 'occupied', 'reserved');
    slotElement.classList.add(statusObj.class);

    imgElement.src = statusObj.img;
    imgElement.alt = statusObj.label;
    statusElement.textContent = statusObj.label;
}

function updateStatistics(totalAvailable, totalOccupied, floor1Available, floor2Available, totalBooking) {
    const totalAvailableEl = document.getElementById('total-available');
    const totalOccupiedEl = document.getElementById('total-occupied');
    const floor1AvailableEl = document.getElementById('floor1-available');
    const floor2AvailableEl = document.getElementById('floor2-available');
    if (totalAvailableEl) totalAvailableEl.textContent = totalAvailable;
    if (totalOccupiedEl) totalOccupiedEl.textContent = totalOccupied;
    if (floor1AvailableEl) floor1AvailableEl.textContent = floor1Available;
    if (floor2AvailableEl) floor2AvailableEl.textContent = floor2Available;
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    if (!notification || !notificationText) return;
    notificationText.textContent = message;
    notification.style.background = type === 'error' ? '#e74c3c' : '#2ecc71';
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), CONFIG.notificationDuration);
}

function animateSensorIndicators() {
    document.querySelectorAll('.sensor-indicator').forEach(sensor => {
        sensor.style.backgroundColor = sensor.style.backgroundColor === 'rgb(231, 76, 60)' ? '#3498db' : '#e74c3c';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateParkingStatus();
    showNotification('🚀 Smart Parking System siap digunakan!');
    setInterval(updateParkingStatus, CONFIG.updateInterval);
    setInterval(animateSensorIndicators, CONFIG.sensorBlinkInterval);
});

window.addEventListener('error', function(event) {
    showNotification('⚠️ Terjadi kesalahan sistem', 'error');
});

window.addEventListener('online', function() {
    showNotification('🌐 Koneksi internet tersambung kembali');
    updateParkingStatus();
});

window.addEventListener('offline', function() {
    showNotification('⚠️ Koneksi internet terputus', 'error');
});
