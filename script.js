// Smart Parking System JavaScript
// Konfigurasi Sistem
const CONFIG = {
    blynkToken: "nod0SZ0c9ViUv_x7L-jlTdQXVOMDhohu", // Ganti dengan token Blynk Anda
    updateInterval: 2500, // Update setiap 2.5 detik
    sensorBlinkInterval: 2000, // Sensor indicator blink setiap 2 detik
    notificationDuration: 3000 // Notifikasi tampil selama 3 detik
};

// Mapping slot parkir ke pin Blynk
const slotMap = {
    'l1s1': 'V0', 
    'l1s2': 'V1', 
    'l1s3': 'V2',
    'l2s1': 'V3', 
    'l2s2': 'V4', 
    'l2s3': 'V5'
};

// URL gambar icon
const carImages = {
    available: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f697.svg",
    occupied: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f698.svg"
};

// Fungsi untuk mengambil data dari pin Blynk
async function fetchBlynkPin(pin) {
    try {
        const response = await fetch(`https://blynk.cloud/external/api/get?token=${CONFIG.blynkToken}&${pin}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Error fetching pin ${pin}:`, error);
        showNotification(`Error: Tidak dapat terhubung ke sensor ${pin}`, 'error');
        return "0"; // Default ke status kosong jika error
    }
}

// Fungsi untuk update status parkir
async function updateParkingStatus() {
    let totalAvailable = 0;
    let totalOccupied = 0;
    let floor1Available = 0;
    let floor2Available = 0;

    try {
        // Update status setiap slot
        for (const [slotId, pin] of Object.entries(slotMap)) {
            const sensorValue = await fetchBlynkPin(pin);
            const isOccupied = sensorValue === "1";
            const status = isOccupied ? "occupied" : "available";

            // Hitung statistik
            if (status === "available") {
                totalAvailable++;
                if (slotId.startsWith('l1')) floor1Available++;
                if (slotId.startsWith('l2')) floor2Available++;
            } else {
                totalOccupied++;
            }

            // Update tampilan slot
            updateSlotDisplay(slotId, status);
        }

        // Update statistik di dashboard
        updateStatistics(totalAvailable, totalOccupied, floor1Available, floor2Available);

    } catch (error) {
        console.error('Error updating parking status:', error);
        showNotification('Error: Gagal memperbarui status parkir', 'error');
    }
}

// Fungsi untuk update tampilan slot individual
function updateSlotDisplay(slotId, status) {
    const slotElement = document.getElementById(`slot-${slotId}`);
    const imgElement = document.getElementById(`img-${slotId}`);
    const statusElement = document.getElementById(`status-${slotId}`);

    if (!slotElement || !imgElement || !statusElement) {
        console.error(`Elements not found for slot: ${slotId}`);
        return;
    }

    // Update class CSS
    slotElement.classList.remove('available', 'occupied', 'reserved');
    slotElement.classList.add(status);

    // Update gambar
    imgElement.src = carImages[status] || carImages.available;
    imgElement.alt = status === "available" ? "Kosong" : "Terisi";

    // Update text status
    statusElement.textContent = status === "available" ? "Tersedia" : "Terisi";
}

// Fungsi untuk update statistik
function updateStatistics(totalAvailable, totalOccupied, floor1Available, floor2Available) {
    // Update total statistics
    const totalAvailableEl = document.getElementById('total-available');
    const totalOccupiedEl = document.getElementById('total-occupied');
    
    if (totalAvailableEl) totalAvailableEl.textContent = totalAvailable;
    if (totalOccupiedEl) totalOccupiedEl.textContent = totalOccupied;

    // Update floor statistics
    const floor1AvailableEl = document.getElementById('floor1-available');
    const floor2AvailableEl = document.getElementById('floor2-available');
    
    if (floor1AvailableEl) floor1AvailableEl.textContent = floor1Available;
    if (floor2AvailableEl) floor2AvailableEl.textContent = floor2Available;
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    if (!notification || !notificationText) {
        console.error('Notification elements not found');
        return;
    }

    notificationText.textContent = message;
    notification.style.background = type === 'error' ? '#e74c3c' : '#2ecc71';
    notification.classList.add('show');

    // Auto hide notification
    setTimeout(() => {
        notification.classList.remove('show');
    }, CONFIG.notificationDuration);
}

// Fungsi untuk animasi sensor indicator
function animateSensorIndicators() {
    const indicators = document.querySelectorAll('.sensor-indicator');
    indicators.forEach(indicator => {
        const currentColor = getComputedStyle(indicator).backgroundColor;
        const isBlue = currentColor === 'rgb(52, 152, 219)'; // #3498db
        indicator.style.backgroundColor = isBlue ? '#e74c3c' : '#3498db';
    });
}

// Fungsi untuk mendeteksi perubahan status dan memberikan notifikasi
let previousStatus = {};

function checkStatusChanges() {
    // This would be called after updateParkingStatus to compare with previous state
    // Implementation can be added based on specific requirements
}

// Event listener ketika DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Smart Parking System initialized');
    
    // Initial update
    updateParkingStatus()
        .then(() => {
            showNotification('🚀 Smart Parking System siap digunakan!');
        })
        .catch(error => {
            console.error('Initial update failed:', error);
            showNotification('⚠️ Sistem memiliki masalah koneksi', 'error');
        });

    // Set up automatic updates
    setInterval(updateParkingStatus, CONFIG.updateInterval);
    
    // Set up sensor indicator animation
    setInterval(animateSensorIndicators, CONFIG.sensorBlinkInterval);
});

// Error handling untuk uncaught errors
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    showNotification('⚠️ Terjadi kesalahan sistem', 'error');
});

// Handle online/offline status
window.addEventListener('online', function() {
    showNotification('🌐 Koneksi internet tersambung kembali');
    updateParkingStatus();
});

window.addEventListener('offline', function() {
    showNotification('⚠️ Koneksi internet terputus', 'error');
});

// Export functions untuk testing (jika diperlukan)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateParkingStatus,
        showNotification,
        fetchBlynkPin
    };
}
