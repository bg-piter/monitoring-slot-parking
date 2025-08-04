
// Smart Parking System Configuration
// File konfigurasi untuk mempermudah setup dan maintenance

const PARKING_CONFIG = {
    // Konfigurasi Blynk
    blynk: {
        token: "HGogwHSm4fpsabLEw6gLp_uIl8s_F4P4", // Ganti dengan token Blynk Anda
        baseUrl: "https://blynk.cloud/external/api",
        timeout: 5000 // 5 detik timeout
    },

    // Mapping Pin Blynk ke Slot Parkir
    slots: {
        'l1s1': { pin: 'V0', floor: 1, position: 1, name: 'Lantai 1 Slot 1' },
        'l1s2': { pin: 'V1', floor: 1, position: 2, name: 'Lantai 1 Slot 2' },
        'l1s3': { pin: 'V2', floor: 1, position: 3, name: 'Lantai 1 Slot 3' },
        'l2s1': { pin: 'V3', floor: 2, position: 1, name: 'Lantai 2 Slot 1' },
        'l2s2': { pin: 'V4', floor: 2, position: 2, name: 'Lantai 2 Slot 2' },
        'l2s3': { pin: 'V5', floor: 2, position: 3, name: 'Lantai 2 Slot 3' }
    },

    // Konfigurasi Timing
    timing: {
        updateInterval: 2500,        // Update data setiap 2.5 detik
        sensorBlink: 2000,          // Sensor indicator blink setiap 2 detik
        notificationDuration: 3000,  // Notifikasi tampil selama 3 detik
        retryDelay: 1000,           // Delay retry jika koneksi gagal
        maxRetries: 3               // Maksimal retry attempts
    },

    // Konfigurasi UI
    ui: {
        theme: {
            primaryColor: '#4CAF50',
            secondaryColor: '#45a049',
            errorColor: '#e74c3c',
            successColor: '#2ecc71',
            warningColor: '#f39c12'
        },
        animations: {
            transitionDuration: '0.3s',
            pulseSpeed: '2s'
        }
    },

    // URL Resources
    resources: {
        carIcons: {
            available: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f697.svg",
            occupied: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f698.svg",
            reserved: "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f699.svg"
        },
        sounds: {
            // Bisa ditambahkan URL sound effects jika diperlukan
            notification: null,
            alert: null
        }
    },

    // Konfigurasi Sensor
    sensor: {
        // Nilai sensor untuk status parkir
        occupiedValue: "1",    // Nilai ketika slot terisi
        availableValue: "0",   // Nilai ketika slot kosong
        
        // Kalibrasi sensor (jika diperlukan)
        calibration: {
            threshold: 0.5,    // Threshold untuk deteksi
            debounceTime: 500  // Debounce time dalam ms
        }
    },

    // Konfigurasi Notifikasi
    notifications: {
        enabled: true,
        types: {
            slotOccupied: {
                enabled: true,
                message: "Slot {slot} telah terisi",
                type: "info"
            },
            slotAvailable: {
                enabled: true,
                message: "Slot {slot} tersedia",
                type: "success"
            },
            systemReady: {
                enabled: true,
                message: "🚀 Smart Parking System siap digunakan!",
                type: "success"
            },
            connectionError: {
                enabled: true,
                message: "⚠️ Error koneksi ke server",
                type: "error"
            },
            offline: {
                enabled: true,
                message: "⚠️ Koneksi internet terputus",
                type: "error"
            },
            online: {
                enabled: true,
                message: "🌐 Koneksi internet tersambung kembali",
                type: "success"
            }
        }
    },

    // Konfigurasi Debug
    debug: {
        enabled: false,        // Set true untuk development
        logLevel: 'info',      // 'debug', 'info', 'warn', 'error'
        showPinValues: false,  // Tampilkan nilai pin di console
        showTimings: false     // Tampilkan timing di console
    },

    // Konfigurasi Backup dan Recovery
    backup: {
        enabled: false,
        storageKey: 'smartParkingBackup',
        interval: 30000,      // Backup setiap 30 detik
        maxBackups: 10        // Simpan maksimal 10 backup
    }
};

// Fungsi untuk mengambil konfigurasi
function getConfig(path = null) {
    if (!path) return PARKING_CONFIG;
    
    const keys = path.split('.');
    let value = PARKING_CONFIG;
    
    for (const key of keys) {
        if (value && value.hasOwnProperty(key)) {
            value = value[key];
        } else {
            return null;
        }
    }
    
    return value;
}

// Fungsi untuk mengupdate konfigurasi
function updateConfig(path, newValue) {
    const keys = path.split('.');
    let current = PARKING_CONFIG;
    
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
