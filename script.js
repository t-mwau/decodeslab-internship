const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const authModeButtons = document.querySelectorAll('.auth-mode');
const authForm = document.getElementById('authForm');
const authStatus = document.getElementById('authStatus');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const themeToggle = document.getElementById('themeToggle');
const compactToggle = document.getElementById('compactToggle');
const nameField = document.getElementById('nameField');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const growthLine = document.getElementById('growthLine');
const depositedAmount = document.getElementById('depositedAmount');
const owedAmount = document.getElementById('owedAmount');
const depositedMetric = document.getElementById('depositedMetric');
const owedMetric = document.getElementById('owedMetric');
const balanceMetric = document.getElementById('balanceMetric');
const graphSummary = document.getElementById('graphSummary');
const learnMoreButtons = document.querySelectorAll('.learn-more');
const tabButtons = document.querySelectorAll('.tab-button');
const serviceButtons = document.querySelectorAll('.service-button');

const state = {
  mode: 'login',
  fontScale: 1,
  zoom: 1,
  theme: 'light',
  compact: false,
  profile: {
    deposited: 0,
    owed: 0,
    name: '',
    email: ''
  }
};

function setAuthStatus(message, type = 'success') {
  authStatus.textContent = message;
  authStatus.className = `status-pill ${type}`;
}

function syncAuthMode() {
  const isRegister = state.mode === 'register';
  nameField.classList.toggle('hidden', !isRegister);
  fullNameInput.required = isRegister;
  fullNameInput.setAttribute('aria-required', String(isRegister));
  fullNameInput.setAttribute('placeholder', isRegister ? 'Enter your full name' : '');
  if (!isRegister) {
    fullNameInput.value = '';
  }
}

function updateProfile() {
  const deposited = state.profile.deposited;
  const owed = state.profile.owed;
  const balance = Math.max(0, deposited - owed);

  depositedAmount.textContent = `$${deposited.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  owedAmount.textContent = `$${owed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  depositedMetric.textContent = `$${deposited.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  owedMetric.textContent = `$${owed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  balanceMetric.textContent = `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  graphSummary.textContent = balance > 0 ? 'Your balance is growing and your progress is healthy.' : 'You are still building momentum and can keep moving forward.';
  drawChart(deposited, owed);
}

function drawChart(deposited, owed) {
  const depositPoints = Math.max(10, Math.min(90, deposited / 140));
  const owedPoints = Math.max(10, Math.min(70, owed / 160));
  const balancePoints = Math.max(20, Math.min(90, (deposited - owed) / 120));

  const points = [
    `20,${180 - depositPoints}`,
    `100,${180 - (depositPoints + 18)}`,
    `180,${180 - (depositPoints + 32 + owedPoints / 2)}`,
    `260,${180 - (balancePoints + 20)}`,
    `340,${180 - (balancePoints + 30)}`
  ].join(' ');

  growthLine.setAttribute('points', points);
}

function addChatMessage(text, sender) {
  const message = document.createElement('div');
  message.className = `message ${sender}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function toggleProjectDetails(button) {
  const targetId = button.dataset.target;
  const panel = document.getElementById(targetId);

  if (!panel) {
    return false;
  }

  const isVisible = panel.classList.toggle('visible');
  button.textContent = isVisible ? 'Hide details' : 'Learn More';
  button.setAttribute('aria-expanded', String(isVisible));
  return isVisible;
}

window.toggleProjectDetails = toggleProjectDetails;

function getBotReply(message) {
  const text = message.toLowerCase();

  if (text.includes('deposit')) {
    return 'You can update your deposit and debt values in the auth card and the dashboard will reflect them instantly.';
  }

  if (text.includes('login') || text.includes('register')) {
    return 'Use the login/register switch on the sidebar to manage your account and access your dashboard.';
  }

  if (text.includes('support') || text.includes('contact')) {
    return 'You can reach us at timmulwa123@gmail.com for technical assistance and inquiries.';
  }

  if (text.includes('setting')) {
    return 'Adjust the zoom, font size, and theme from the top controls and settings panel.';
  }

  return 'I can help with account access, deposits, balances, support, and settings. Try asking about login or support.';
}

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

authModeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    authModeButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    state.mode = button.dataset.form;
    syncAuthMode();
    setAuthStatus(state.mode === 'register' ? 'Create a new account' : 'Ready for sign in');
  });
});

authForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const deposited = Number(document.getElementById('deposited').value) || 0;
  const owed = Number(document.getElementById('owed').value) || 0;

  if (!email || !password) {
    setAuthStatus('Please enter your email and password.', 'error');
    return;
  }

  if (state.mode === 'register' && !fullName) {
    setAuthStatus('Please enter your full name to register.', 'error');
    return;
  }

  if (password.length < 6) {
    setAuthStatus('Password must be at least 6 characters.', 'error');
    return;
  }

  state.profile = {
    name: fullName || 'Guest',
    email,
    deposited,
    owed
  };

  setAuthStatus(`${state.mode === 'register' ? 'Registered' : 'Signed in'} as ${state.profile.name}`, 'success');
  updateProfile();
});

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();

  if (!message) {
    setAuthStatus('Ask the AI assistant before sending a message.', 'error');
    return;
  }

  addChatMessage(message, 'user');
  addChatMessage(getBotReply(message), 'bot');
  chatInput.value = '';
  chatInput.focus();
});

themeToggle.addEventListener('change', (event) => {
  state.theme = event.target.checked ? 'dark' : 'light';
  document.body.classList.toggle('dark', state.theme === 'dark');
});

compactToggle.addEventListener('change', (event) => {
  state.compact = event.target.checked;
  document.body.classList.toggle('compact', state.compact);
});

learnMoreButtons.forEach((button) => {
  button.addEventListener('click', () => {
    toggleProjectDetails(button);
  });
});

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    tabButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    document.querySelectorAll('.tab-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.id === button.dataset.panel);
    });
  });
});

serviceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    serviceButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    document.querySelectorAll('.service-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.id === button.dataset.service);
    });
  });
});

syncAuthMode();
updateProfile();
