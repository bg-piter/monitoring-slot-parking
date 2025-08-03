// config.js Smart Parking System

const CONFIG = {
    blynkToken: "nod0SZ0c9ViUv_x7L-jlTdQXVOMDhohu", // Ganti dengan token Blynk kamu
    updateInterval: 2500, // ms, interval update status dari Blynk
    sensorBlinkInterval: 2000, // ms, interval animasi indikator sensor
    notificationDuration: 3000 // ms, lama notifikasi muncul
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

// URL gambar icon mobil by status
const carImages = {
    available: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f697.svg", // Hijau
    occupied: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f698.svg",  // Merah
    booking:  "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f699.svg"   // Kuning
};

// Status parkir yang dipakai di JS dan UI
const slotStatus = {
    available:  { value: "0", label: "Tersedia", color: "#2ecc71", class: "available", img: carImages.available },
    occupied:   { value: "1", label: "Terisi",   color: "#e74c3c", class: "occupied",  img: carImages.occupied },
    booking:    { value: "2", label: "Booking",  color: "#ffd700", class: "reserved",  img: carImages.booking }
};

// Helper: konversi nilai dari Blynk ke status string
function blynkValueToStatus(val) {
    if (val === "0") return "available";
    if (val === "1") return "occupied";
    if (val === "2") return "booking";
    return "unknown";
}

// Helper: dapatkan data status slot
function getSlotStatus(val) {
    const key = blynkValueToStatus(val);
    return slotStatus[key] || slotStatus.available;
}

window.CONFIG = CONFIG;
window.slotMap = slotMap;
window.carImages = carImages;
window.slotStatus = slotStatus;
window.blynkValueToStatus = blynkValueToStatus;
window.getSlotStatus = getSlotStatus;

