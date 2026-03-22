const addressInput = document.getElementById('address');
const suggestionsEl = document.getElementById('suggestions');
const mapPreview = document.getElementById('mapPreview');
const mapAddress = document.getElementById('mapAddress');
const quoteForm = document.getElementById('quoteForm');
const resultCard = document.getElementById('resultCard');
const chatWindow = document.getElementById('chatWindow');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

const sampleAddresses = [
  '101 Desoto Blvd, Hot Springs Village, AR',
  '110 Calella Rd, Hot Springs Village, AR',
  '14 Cortez Trace, Hot Springs Village, AR',
  '23 Salamanca Way, Hot Springs Village, AR',
  '870 DeSoto Blvd, Hot Springs Village, AR'
];

function clamp(min, value, max) {
  return Math.min(max, Math.max(min, value));
}

function seededNumber(seed, offset = 0) {
  let total = 0;
  const source = `${seed}${offset}`;
  for (let i = 0; i < source.length; i += 1) total += source.charCodeAt(i) * (i + 3);
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
  const houseX = 120 + (seed % 110);
  const houseY = 100 + (seed % 60);
  const houseW = 90 + (seed % 40);
  const houseH = 60 + (seed % 28);
  const lotShift = seed % 90;
  const tree1 = 60 + (seed % 70);
  const tree2 = 310 + (seed % 70);
  const pathCurve = 70 + (seed % 60);

  return `
  <svg viewBox="0 0 640 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Property preview demo image">
    <defs>
      <linearGradient id="grass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#7faa78" />
        <stop offset="100%" stop-color="#597e5d" />
      </linearGradient>
      <linearGradient id="road" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#555d66" />
        <stop offset="100%" stop-color="#3c434b" />
      </linearGradient>
      <pattern id="texture" width="24" height="24" patternUnits="userSpaceOnUse">
        <rect width="24" height="24" fill="url(#grass)" />
        <circle cx="5" cy="6" r="2" fill="#8db586" opacity="0.45" />
        <circle cx="16" cy="14" r="2.2" fill="#6f9c71" opacity="0.38" />
        <circle cx="20" cy="4" r="1.6" fill="#87ad82" opacity="0.35" />
      </pattern>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#163025" flood-opacity="0.18" />
      </filter>
    </defs>

    <rect width="640" height="420" fill="url(#texture)" />
    <path d="M -40 340 C 120 ${300 + pathCurve}, 220 ${370 + (seed % 25)}, 700 300" stroke="url(#road)" stroke-width="96" fill="none" />
    <path d="M -40 340 C 120 ${300 + pathCurve}, 220 ${370 + (seed % 25)}, 700 300" stroke="#f2d45e" stroke-width="4" stroke-dasharray="18 14" fill="none" opacity="0.8" />

    <polygon points="${110 + lotShift},75 ${390 + lotShift},62 ${500 + lotShift},228 ${440 + lotShift},338 ${158 + lotShift},350 ${70 + lotShift},210"
      fill="rgba(255,255,255,0.02)" stroke="#f5f7fa" stroke-width="4" stroke-dasharray="12 9" />

    <rect x="${houseX}" y="${houseY}" width="${houseW}" height="${houseH}" rx="7" fill="#d4d9dd" stroke="#f6f8fa" stroke-width="4" filter="url(#shadow)" />
    <rect x="${houseX + 18}" y="${houseY + 16}" width="${Math.max(24, houseW - 52)}" height="${Math.max(16, houseH - 30)}" rx="4" fill="#8f969d" opacity="0.55" />
    <path d="M ${houseX + houseW * 0.22} ${houseY + houseH} C ${houseX + houseW * 0.28} ${houseY + houseH + 26}, ${houseX + houseW * 0.44} ${houseY + houseH + 42}, ${houseX + houseW * 0.54} 314" stroke="#d9c8a6" stroke-width="22" stroke-linecap="round" fill="none" />

    <circle cx="${tree1}" cy="110" r="34" fill="#355f3b" />
    <circle cx="${tree1 + 24}" cy="132" r="28" fill="#3f6f45" />
    <circle cx="${tree2}" cy="92" r="32" fill="#355f3b" />
    <circle cx="${tree2 + 26}" cy="118" r="26" fill="#48794d" />
    <circle cx="${tree2 - 40}" cy="260" r="30" fill="#355f3b" />

    <rect x="20" y="20" width="210" height="54" rx="16" fill="rgba(13,27,42,0.72)" />
    <text x="40" y="44" fill="#ffffff" font-size="18" font-family="Inter, Arial, sans-serif" font-weight="700">Satellite-style preview</text>
    <text x="40" y="64" fill="#d8e7f6" font-size="12" font-family="Inter, Arial, sans-serif">Demo concept for address-based rough estimates</text>
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
    estate: 2.25,
  }[homeSize];

  const buildupMultiplier = {
    light: 1,
    medium: 1.18,
    heavy: 1.38,
  }[buildup];

  const typeMultiplier = {
    single: 1,
    townhome: 0.88,
    commercial: 1.45,
  }[propertyType];

  const baseTable = {
    house: [180, 260],
    driveway: [110, 180],
    roof: [260, 480],
    windows: [80, 140],
    patio: [85, 160],
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
    <div>
      <div class="eyebrow">Ballpark pricing</div>
      <h3>Instant rough estimate</h3>
      <div class="result-figure">
        <span class="result-range">$${data.low}–$${data.high}</span>
      </div>
      <p class="fine-print">This is a demo ballpark estimate based on your selections and a property-preview concept. Final pricing may vary after review.</p>

      <div class="result-summary">
        <div class="result-line"><span>Services</span><strong>${selectedText}</strong></div>
        <div class="result-line"><span>Property type</span><strong>${titleCase(data.propertyType.replace('-', ' '))}</strong></div>
        <div class="result-line"><span>Home size</span><strong>${labelSize(data.homeSize)}</strong></div>
        <div class="result-line"><span>Buildup</span><strong>${titleCase(data.buildup)}</strong></div>
      </div>
    </div>
  `;
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

const chatAnswers = {
  'what areas do you serve?': 'This demo positions Jeanius Power Washing as serving Hot Springs Village and nearby areas. On the live site, that answer can be updated exactly how Colton wants it.',
  'how do rough quotes work?': 'The customer enters an address, chooses services, answers a few questions, and gets a ballpark estimate range. Colton can then review the lead and confirm final pricing.',
  'do you clean exterior windows?': 'Yes. Exterior window cleaning is included as one of the core service options in this demo.',
  'can i still call instead?': 'Absolutely. The phone number stays visible because a lot of customers still prefer calling a real person.',
  'default': 'This demo assistant is built for simple FAQs, lead capture, and steering people toward a call or quote request. In a real build, answers could be customized further.'
};

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
  window.setTimeout(() => addChatMessage(answer, 'bot'), 220);
}

document.querySelectorAll('.chip').forEach((button) => {
  button.addEventListener('click', () => respondToQuestion(button.dataset.question));
});

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const question = chatInput.value.trim();
  if (!question) return;
  respondToQuestion(question);
  chatInput.value = '';
});

updateMapPreview('101 Desoto Blvd, Hot Springs Village, AR');
