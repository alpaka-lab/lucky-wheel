import { State } from './state.js'
import { Wheel } from './wheel.js'
import { translations } from './i18n.js'

// Initialize
const state = new State();
const wheel = new Wheel('wheelCanvas', state);

let currentLang = localStorage.getItem('appLang') || 'th'; // Load saved lang or default to Thai

// DOM Elements
const nameInput = document.getElementById('nameInput');
const addBtn = document.getElementById('addBtn');
const participantList = document.getElementById('participantList');
const langToggle = document.getElementById('langToggle');

// I18n Function
const updateLanguage = (lang) => {
  currentLang = lang;
  localStorage.setItem('appLang', lang); // Save preference
  const t = translations[lang];

  // Update Text Content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });

  // Update Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) el.placeholder = t[key];
  });

  // Toggle Button Text
  langToggle.textContent = lang === 'en' ? '🇹🇭 TH' : '🇬🇧 EN';
};

// Initial Load
updateLanguage(currentLang);

langToggle.addEventListener('click', () => {
  const newLang = currentLang === 'en' ? 'th' : 'en';
  updateLanguage(newLang);
});

const shuffleBtn = document.getElementById('shuffleBtn');
shuffleBtn.addEventListener('click', () => {
  state.shuffleParticipants();
});

// State Subscription (UI Update)
// State Subscription (UI Update)
state.subscribe((participants, customTitle, duration, speedLevel, theme) => {
  // Apply Theme
  document.body.className = `theme-${theme || 'default'}`;

  // Update Title
  // Update Title
  const titleEl = document.getElementById('mainTitle');

  if (customTitle && customTitle.trim() !== '') {
    titleEl.textContent = customTitle;
    titleEl.removeAttribute('data-i18n');
  } else {
    // Revert to default i18n
    titleEl.setAttribute('data-i18n', 'title');
    // Trigger immediate re-translation for this element
    const key = 'title';
    if (translations[currentLang] && translations[currentLang][key]) {
      titleEl.textContent = translations[currentLang][key];
    }
  }

  participantList.innerHTML = '';
  participants.forEach(p => {
    const li = document.createElement('li');
    li.className = `participant-item ${!p.active ? 'inactive' : ''}`;

    li.innerHTML = `
      <input type="checkbox" ${p.active ? 'checked' : ''} class="toggle-active">
      <span class="p-name">${p.name}</span>
      <button class="remove-btn">×</button>
    `;

    // Toggle Active
    const toggle = li.querySelector('.toggle-active');
    toggle.addEventListener('change', () => state.toggleParticipant(p.id));

    // Remove
    const remove = li.querySelector('.remove-btn');
    remove.addEventListener('click', () => state.removeParticipant(p.id));

    participantList.appendChild(li);
  });
});

// Settings Logic
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const settingTitleInput = document.getElementById('settingTitleInput');
const settingDurationInput = document.getElementById('settingDurationInput');
const durationValue = document.getElementById('durationValue');
const settingSpeedInput = document.getElementById('settingSpeedInput');
const speedValue = document.getElementById('speedValue');
const themeGrid = document.getElementById('themeGrid');
let selectedTheme = 'default';

const themes = [
  'default', 'red', 'orange', 'yellow', 'green', 'teal',
  'cyan', 'blue', 'indigo', 'purple', 'pink', 'rose'
];

const renderThemeGrid = () => {
  themeGrid.innerHTML = '';
  themes.forEach(theme => {
    const btn = document.createElement('div');
    btn.className = `theme-btn ${theme === selectedTheme ? 'active' : ''}`;
    // Inline style to preview the theme
    // We can map theme to gradient or just rely on CSS class if we want to preview on the button itself.
    // Simpler: Just rely on clicking to see effect or map colors.
    // Let's create a mini gradient for the button background
    const gradientMap = {
      default: 'linear-gradient(-45deg, #1f005c, #ffb56b)',
      red: 'linear-gradient(-45deg, #FF416C, #FF4B2B)',
      orange: 'linear-gradient(-45deg, #fc4a1a, #f7b733)',
      yellow: 'linear-gradient(-45deg, #CAC531, #F3F9A7)',
      green: 'linear-gradient(-45deg, #11998e, #38ef7d)',
      teal: 'linear-gradient(-45deg, #1CD8D2, #93EDC7)',
      cyan: 'linear-gradient(-45deg, #00C9FF, #92FE9D)',
      blue: 'linear-gradient(-45deg, #00c6ff, #0072ff)',
      indigo: 'linear-gradient(-45deg, #4facfe, #00f2fe)',
      purple: 'linear-gradient(-45deg, #8E2DE2, #4A00E0)',
      pink: 'linear-gradient(-45deg, #FF0099, #493240)',
      rose: 'linear-gradient(-45deg, #833ab4, #fd1d1d)'
    };
    btn.style.background = gradientMap[theme] || '#fff';

    btn.addEventListener('click', () => {
      selectedTheme = theme;
      renderThemeGrid(); // Update active state
      // Optional: Preview immediately? No, let's wait for save for consistent UX or maybe immediate for fun?
      // User request usually implies setting. Let's stick to Save.
      // But previewing on body is nice. Let's do preview on body immediately but only save on Save.
      document.body.className = `theme-${theme}`;
    });
    themeGrid.appendChild(btn);
  });
};

settingsBtn.addEventListener('click', () => {
  settingTitleInput.value = state.customTitle;
  settingDurationInput.value = state.duration;
  if (settingSpeedInput) {
    settingSpeedInput.value = state.speedLevel || 0.9;
    speedValue.textContent = Math.round((state.speedLevel || 0.9) * 100) + '%';
  }
  durationValue.textContent = state.duration;

  selectedTheme = state.theme || 'default';
  renderThemeGrid();

  settingsModal.classList.remove('hidden');
});

closeSettingsBtn.addEventListener('click', () => {
  // Revert theme if not saved?
  // Current logic: click changes body class. If we close without save, we should revert.
  document.body.className = `theme-${state.theme || 'default'}`;
  settingsModal.classList.add('hidden');
});

// Close Settings Modal on Overlay Click
settingsModal.addEventListener('click', (e) => {
  if (e.target === settingsModal) {
    closeSettingsBtn.click(); // Reuse close logic
  }
});

settingDurationInput.addEventListener('input', (e) => {
  durationValue.textContent = e.target.value;
});

settingSpeedInput.addEventListener('input', (e) => {
  speedValue.textContent = Math.round(e.target.value * 100) + '%';
});

saveSettingsBtn.addEventListener('click', () => {
  state.updateSettings(
    settingTitleInput.value,
    parseInt(settingDurationInput.value),
    parseFloat(settingSpeedInput.value),
    selectedTheme
  );
  settingsModal.classList.add('hidden');
});

// Controls
addBtn.addEventListener('click', () => {
  const name = nameInput.value;
  if (name) {
    state.addParticipant(name);
    nameInput.value = '';
    nameInput.focus();
  }
});

nameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});

// Controls moved to settings
// Spin Logic handled by Center Button
const centerSpinBtn = document.getElementById('centerSpinBtn');
centerSpinBtn.addEventListener('click', () => {
  if (state.activeParticipants.length > 0) {
    wheel.spin();
  } else {
    alert(translations[currentLang].alertNoParticipants);
  }
});



// Modal Elements
const winnerModal = document.getElementById('winnerModal');
const winnerNameEl = document.getElementById('winnerName');
const confirmationSection = document.getElementById('confirmationSection');
const keepBtn = document.getElementById('keepBtn');
const removeBtn = document.getElementById('removeBtn');

let currentWinnerId = null;

const closeModal = () => {
  winnerModal.classList.add('hidden');
  winnerNameEl.textContent = '';
};

// Close Winner Modal on Overlay Click
winnerModal.addEventListener('click', (e) => {
  if (e.target === winnerModal) {
    if (currentWinnerId) {
      // If they click outside without deciding, we keep by default?
      // Or simply close. The "Keep" button just closes.
      closeModal();
    } else {
      closeModal();
    }
  }
});

// Wheel Callback
wheel.onSpinEnd = (winner) => {
  currentWinnerId = winner.id;
  winnerNameEl.textContent = winner.name;
  winnerModal.classList.remove('hidden');

  // Always show confirmation since checkbox is gone
  confirmationSection.classList.remove('hidden');
};

// Start Sound Effect (Browser often blocks audio without user interaction, 
// but we can try basic beep or rely on user to add sound later)

// Modal Actions
keepBtn.onclick = () => {
  closeModal();
};

removeBtn.onclick = () => {
  if (currentWinnerId) {
    state.toggleParticipant(currentWinnerId);
  }
  closeModal();
};


