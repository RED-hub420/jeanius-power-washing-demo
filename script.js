const addressInput = document.getElementById('address');
const suggestionsEl = document.getElementById('suggestions');
const mapPreview = document.getElementById('mapPreview');
const mapAddress = document.getElementById('mapAddress');
const quoteForm = document.getElementById('quoteForm');
const resultCard = document.getElementById('resultCard');
const chatWindow = document.getElementById('chatWindow');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatToggle = document.getElementById('chatToggle');
const chatWidget = document.getElementById('chatWidget');
const chatClose = document.getElementById('chatClose');

const sampleAddresses = [
  '101 Desoto Blvd, Hot Springs Village, AR',
  '110 Calella Rd, Hot Springs Village, AR',
  '14 Cortez Trace, Hot Springs Village, AR',
  '23 Salamanca Way, Hot Springs Village, AR',
  '870 Desoto Blvd, Hot Springs Village, AR',
];

const chatAnswers = {
  'how does the estimate work?': 'You enter the address, choose the services you need, answer a few quick questions, and get a ballpark range. Final pricing can still be confirmed after review.',
  'can i still call instead?': 'Yes. The website keeps call, text, and Facebook options visible so reaching a real person still feels easy.',
  'do you clean exterior windows?': 'Yes. Exterior window cleaning is one of the main service options in this build.',
  'what areas do you serve?': 'This preview positions the business around Hot Springs Village and nearby areas. That wording can be tightened once the exact service area is confirmed.',
  default: 'This helper is meant for simple questions about services, estimate requests, and contact options. For anything detailed, the site still pushes people toward a direct call or message.',
};

function clamp(min, value, max) {
  return Math.min(max, Math.max(min, value));
}

function seededNumber(seed, offset = 0) {
  let total = 0;
  const source = `${seed}${offset}`;
  for (let i = 0; i < source.length; i += 1) {
    total += source.charCodeAt(i) * (i + 3);
  }
  return total;
}

function renderSuggestions(value) {
  const cleaned = value.trim().toLowerCase();
  suggestionsEl.innerHTML = '';
  if (!cleaned) return;

  const matches = sampleAddresses.filter((item) => item.toLowerCase().includes(cleaned)).slice(0, 4);
  matches.forEach((match) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'suggestion';
    btn.textContent = match;
    btn.addEventListener('click', () => {
      addressInput.value = match;
      suggestionsEl.innerHTML = '';
      updateMapPreview(match);
    });
    suggestionsEl.appendChild(btn);
  });
}

function generateMapSVG(address = '') {
  const seed = seededNumber(address || 'Jeanius');
  const houseX = 130 + (seed % 90);
  const houseY = 104 + (seed % 56);
  const houseW = 94 + (seed % 34);
  const houseH = 58 + (seed % 26);
  const lotShift = seed % 80;
  const tree1 = 72 + (seed % 58);
  const tree2 = 320 + (seed % 72);
  const pathCurve = 70 + (seed % 40);

  return `
  <svg viewBox="0 0 640 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Property preview concept">
    <defs>
      <linearGradient id="grass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#8fb785" />
        <stop offset="100%" stop-color="#5e855f" />
      </linearGradient>
      <linearGradient id="road" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#57616b" />
        <stop offset="100%" stop-color="#38414b" />
      </linearGradient>
      <pattern id="texture" width="24" height="24" patternUnits="userSpaceOnUse">
        <rect width="24" height="24" fill="url(#grass)" />
        <circle cx="5" cy="6" r="2" fill="#99c18f" opacity="0.35" />
        <circle cx="16" cy="14" r="2.2" fill="#6e9970" opacity="0.35" />
      </pattern>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#163025" flood-opacity="0.18" />
      </filter>
    </defs>

    <rect width="640" height="420" fill="url(#texture)" />
    <path d="M -40 340 C 120 ${300 + pathCurve}, 220 ${370 + (seed % 20)}, 700 300" stroke="url(#road)" stroke-width="96" fill="none" />
    <path d="M -40 340 C 120 ${300 + pathCurve}, 220 ${370 + (seed % 20)}, 700 300" stroke="#f2d45e" stroke-width="4" stroke-dasharray="18 14" fill="none" opacity="0.8" />

    <polygon points="${120 + lotShift},74 ${384 + lotShift},62 ${490 + lotShift},224 ${436 + lotShift},338 ${160 + lotShift},348 ${82 + lotShift},206"
      fill="rgba(255,255,255,0.02)" stroke="#eef5ff" stroke-width="4" stroke-dasharray="12 9" />

    <rect x="${houseX}" y="${houseY}" width="${houseW}" height="${houseH}" rx="7" fill="#d8dde2" stroke="#f8fbfe" stroke-width="4" filter="url(#shadow)" />
    <rect x="${houseX + 18}" y="${houseY + 16}" width="${Math.max(26, houseW - 50)}" height="${Math.max(18, houseH - 30)}" rx="4" fill="#8f969d" opacity="0.56" />
    <path d="M ${houseX + houseW * 0.18} ${houseY + houseH} C ${houseX + houseW * 0.26} ${houseY + houseH + 26}, ${houseX + houseW * 0.44} ${houseY + houseH + 42}, ${houseX + houseW * 0.55} 314" stroke="#dac8a7" stroke-width="22" stroke-linecap="round" fill="none" />

    <circle cx="${tree1}" cy="110" r="34" fill="#355f3b" />
    <circle cx="${tree1 + 26}" cy="134" r="28" fill="#3f6f45" />
    <circle cx="${tree2}" cy="96" r="32" fill="#355f3b" />
    <circle cx="${tree2 + 24}" cy="120" r="26" fill="#497a4f" />
    <circle cx="${tree2 - 40}" cy="264" r="30" fill="#355f3b" />

    <rect x="20" y="20" width="206" height="54" rx="16" fill="rgba(11,24,38,0.74)" />
    <text x="40" y="44" fill="#ffffff" font-size="18" font-family="Inter, Arial, sans-serif" font-weight="700">Property preview</text>
    <text x="40" y="64" fill="#d8e7f6" font-size="12" font-family="Inter, Arial, sans-serif">Ballpark estimate concept</text>
  </svg>`;
}

function updateMapPreview(address) {
  mapPreview.innerHTML = generateMapSVG(address);
  mapAddress.textContent = address ? `Previewing: ${address}` : 'Enter an address to preview the property concept.';
}

function getSelectedServices() {
  return Array.from(document.querySelectorAll('input[name="service"]:checked')).map((input) => input.value);
}

function calculateEstimate() {
  const address = addressInput.value.trim();
  const propertyType = document.getElementById('propertyType').value;
  const homeSize = document.getElementById('homeSize').value;
  const buildup = document.getElementById('buildup').value;
  const windowsCount = Number(document.getElementById('windowsCount').value);
  const services = getSelectedServices();

  let low = 0;
  let high = 0;

  const sizeMultiplier = {
    small: 1,
    medium: 1.25,
    large: 1.65,
    estate: 2.2,
  }[homeSize];

  const buildupMultiplier = {
    light: 1,
    medium: 1.16,
    heavy: 1.34,
  }[buildup];

  const typeMultiplier = {
    single: 1,
    townhome: 0.9,
    commercial: 1.42,
  }[propertyType];

  const baseTable = {
    house: [185, 265],
    driveway: [110, 185],
    roof: [275, 500],
    windows: [85, 145],
    patio: [90, 165],
  };

  services.forEach((service) => {
    if (baseTable[service]) {
      low += baseTable[service][0];
      high += baseTable[service][1];
    }
  });

  if (!services.length) {
    low = 120;
    high = 200;
  }

  if (windowsCount > 0 && services.includes('windows')) {
    low += windowsCount * 3;
    high += windowsCount * 5;
  }

  const addressFactor = address ? 1 + ((seededNumber(address) % 9) / 100) : 1;
  low = Math.round(low * sizeMultiplier * buildupMultiplier * typeMultiplier * addressFactor);
  high = Math.round(high * sizeMultiplier * buildupMultiplier * typeMultiplier * addressFactor);

  low = clamp(95, low, 5000);
  high = clamp(low + 35, high, 7000);

  return { low, high, services, propertyType, homeSize, buildup };
}

function titleCase(value) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

function labelSize(value) {
  return {
    small: 'Under 1,500 sq ft',
    medium: '1,500–2,500 sq ft',
    large: '2,500–4,000 sq ft',
    estate: '4,000+ sq ft',
  }[value] || value;
}

function renderResult(data) {
  const serviceNames = {
    house: 'House wash',
    driveway: 'Driveway',
    roof: 'Roof wash',
    windows: 'Exterior windows',
    patio: 'Patio / deck',
  };

  const selectedText = data.services.length
    ? data.services.map((item) => serviceNames[item]).join(', ')
    : 'General exterior cleaning';

  resultCard.innerHTML = `
    <div class="eyebrow">Ballpark pricing</div>
    <h3>Estimated range</h3>
    <div class="result-range">$${data.low}–$${data.high}</div>
    <p>This is a ballpark range based on the details entered above. Final pricing may change after review.</p>
    <div class="result-summary">
      <div class="result-line"><span>Services</span><strong>${selectedText}</strong></div>
      <div class="result-line"><span>Property type</span><strong>${titleCase(data.propertyType.replace('-', ' '))}</strong></div>
      <div class="result-line"><span>Home size</span><strong>${labelSize(data.homeSize)}</strong></div>
      <div class="result-line"><span>Condition</span><strong>${titleCase(data.buildup)}</strong></div>
    </div>
  `;
}

function addChatMessage(text, type) {
  const message = document.createElement('div');
  message.className = `chat-msg ${type}`;
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function respondToQuestion(question) {
  addChatMessage(question, 'user');
  const normalized = question.trim().toLowerCase();
  const answer = chatAnswers[normalized] || chatAnswers.default;
  window.setTimeout(() => addChatMessage(answer, 'bot'), 180);
}

addressInput.addEventListener('input', (event) => {
  renderSuggestions(event.target.value);
  updateMapPreview(event.target.value.trim());
});

quoteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const estimate = calculateEstimate();
  renderResult(estimate);
  updateMapPreview(addressInput.value.trim());
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = chatInput.value.trim();
  if (!value) return;
  respondToQuestion(value);
  chatInput.value = '';
});

chatToggle.addEventListener('click', () => {
  const isHidden = chatWidget.hasAttribute('hidden');
  if (isHidden) {
    chatWidget.removeAttribute('hidden');
    chatToggle.setAttribute('aria-expanded', 'true');
  } else {
    chatWidget.setAttribute('hidden', '');
    chatToggle.setAttribute('aria-expanded', 'false');
  }
});

chatClose.addEventListener('click', () => {
  chatWidget.setAttribute('hidden', '');
  chatToggle.setAttribute('aria-expanded', 'false');
});

updateMapPreview('');
