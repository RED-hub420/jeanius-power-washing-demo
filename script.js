
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobileNav');
if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function clamp(min, value, max) { return Math.max(min, Math.min(value, max)); }
function titleCase(str) { return str.split(' ').map(word => word ? word[0].toUpperCase() + word.slice(1) : '').join(' '); }
function labelSize(size) { return ({ small:'Under 1,500 sq ft', medium:'1,500–2,500 sq ft', large:'2,500–4,000 sq ft', estate:'4,000+ sq ft' })[size] || size; }

const quoteForm = document.getElementById('quoteForm');
const resultCard = document.getElementById('resultCard');
const summaryCard = document.getElementById('summaryCard');
const requestSummary = document.getElementById('requestSummary');
const textEstimateLink = document.getElementById('textEstimateLink');
const copyEstimateBtn = document.getElementById('copyEstimateBtn');

function getSelectedServices() {
  return Array.from(document.querySelectorAll('input[name="service"]:checked')).map((input) => input.value);
}

function calculateEstimate() {
  const address = document.getElementById('address').value.trim();
  const propertyType = document.getElementById('propertyType').value;
  const homeSize = document.getElementById('homeSize').value;
  const buildup = document.getElementById('buildup').value;
  const windowsCount = Number(document.getElementById('windowsCount').value);
  const services = getSelectedServices();

  let low = 0;
  let high = 0;
  const sizeMultiplier = { small: 1, medium: 1.25, large: 1.65, estate: 2.15 }[homeSize];
  const buildupMultiplier = { light: 1, medium: 1.16, heavy: 1.34 }[buildup];
  const typeMultiplier = { single: 1, townhome: 0.9, commercial: 1.42 }[propertyType];
  const baseTable = { house:[185,265], driveway:[110,185], roof:[275,500], windows:[85,145], patio:[90,165] };

  services.forEach((service) => {
    if (baseTable[service]) { low += baseTable[service][0]; high += baseTable[service][1]; }
  });
  if (!services.length) { low = 120; high = 200; }
  if (windowsCount > 0 && services.includes('windows')) { low += windowsCount * 3; high += windowsCount * 5; }
  const addressFactor = address ? 1 + ((address.length % 9) / 100) : 1;
  low = Math.round(low * sizeMultiplier * buildupMultiplier * typeMultiplier * addressFactor);
  high = Math.round(high * sizeMultiplier * buildupMultiplier * typeMultiplier * addressFactor);
  low = clamp(95, low, 5000);
  high = clamp(low + 35, high, 7000);
  return { low, high, services, propertyType, homeSize, buildup };
}

function renderEstimateResult(data) {
  const serviceNames = { house:'House wash', driveway:'Driveway', roof:'Roof wash', windows:'Exterior windows', patio:'Patio / deck' };
  const selectedText = data.services.length ? data.services.map((item) => serviceNames[item]).join(', ') : 'General exterior cleaning';
  resultCard.innerHTML = `
    <div class="eyebrow">Preliminary range</div>
    <h3>Estimated starting range</h3>
    <div class="result-range">$${data.low}–$${data.high}</div>
    <p>This is a preliminary range based on the details entered. Final pricing may change after the property is reviewed.</p>
    <div class="result-summary">
      <div class="result-line"><span>Services</span><strong>${selectedText}</strong></div>
      <div class="result-line"><span>Property type</span><strong>${titleCase(data.propertyType.replace('-', ' '))}</strong></div>
      <div class="result-line"><span>Home size</span><strong>${labelSize(data.homeSize)}</strong></div>
      <div class="result-line"><span>Condition</span><strong>${titleCase(data.buildup)}</strong></div>
    </div>`;
}

function buildEstimateSummary(data) {
  const name = document.getElementById('customerName').value.trim() || 'Not provided';
  const phone = document.getElementById('customerPhone').value.trim() || 'Not provided';
  const callback = document.getElementById('preferredTime').value;
  const address = document.getElementById('address').value.trim() || 'Not provided';
  const notes = document.getElementById('notes').value.trim() || 'None';
  const serviceNames = { house:'House wash', driveway:'Driveway', roof:'Roof wash', windows:'Exterior windows', patio:'Patio / deck' };
  const selectedText = data.services.length ? data.services.map((item) => serviceNames[item]).join(', ') : 'General exterior cleaning';
  return `Estimate request
Name: ${name}
Phone: ${phone}
Preferred callback: ${callback}
Address: ${address}
Services: ${selectedText}
Property type: ${titleCase(data.propertyType.replace('-', ' '))}
Home size: ${labelSize(data.homeSize)}
Condition: ${titleCase(data.buildup)}
Preliminary range: $${data.low}–$${data.high}
Notes: ${notes}`;
}

if (quoteForm) {
  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const estimate = calculateEstimate();
    renderEstimateResult(estimate);
    const summary = buildEstimateSummary(estimate);
    requestSummary.textContent = summary;
    summaryCard.classList.remove('hidden');
    textEstimateLink.href = `sms:+15012095630?&body=${encodeURIComponent(summary)}`;
    summaryCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

if (copyEstimateBtn) {
  copyEstimateBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(requestSummary.textContent.trim());
      copyEstimateBtn.textContent = 'Copied';
      setTimeout(() => copyEstimateBtn.textContent = 'Copy details', 1600);
    } catch {
      copyEstimateBtn.textContent = 'Copy failed';
      setTimeout(() => copyEstimateBtn.textContent = 'Copy details', 1600);
    }
  });
}

const callbackForm = document.getElementById('callbackForm');
const callbackSummaryCard = document.getElementById('callbackSummaryCard');
const callbackSummary = document.getElementById('callbackSummary');
const textCallbackLink = document.getElementById('textCallbackLink');
const copyCallbackBtn = document.getElementById('copyCallbackBtn');

if (callbackForm) {
  callbackForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('cbName').value.trim() || 'Not provided';
    const phone = document.getElementById('cbPhone').value.trim() || 'Not provided';
    const callback = document.getElementById('cbTime').value;
    const address = document.getElementById('cbAddress').value.trim() || 'Not provided';
    const service = document.getElementById('cbService').value;
    const notes = document.getElementById('cbNotes').value.trim() || 'None';
    const summary = `Callback request
Name: ${name}
Phone: ${phone}
Preferred callback: ${callback}
Address: ${address}
Main service: ${service}
Notes: ${notes}`;
    callbackSummary.textContent = summary;
    callbackSummaryCard.classList.remove('hidden');
    textCallbackLink.href = `sms:+15012095630?&body=${encodeURIComponent(summary)}`;
    callbackSummaryCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

if (copyCallbackBtn) {
  copyCallbackBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(callbackSummary.textContent.trim());
      copyCallbackBtn.textContent = 'Copied';
      setTimeout(() => copyCallbackBtn.textContent = 'Copy details', 1600);
    } catch {
      copyCallbackBtn.textContent = 'Copy failed';
      setTimeout(() => copyCallbackBtn.textContent = 'Copy details', 1600);
    }
  });
}
