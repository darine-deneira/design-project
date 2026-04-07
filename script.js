/*
 * Auto Invest (DCA Improvement) Prototype — JavaScript
 * Finance Platform Pillar
 */

// ===== Language =====
const urlParams = new URLSearchParams(window.location.search);
let currentLang = urlParams.get('lang') || 'id';

function toggleLang() {
  currentLang = currentLang === 'id' ? 'en' : 'id';
  const url = new URL(window.location);
  url.searchParams.set('lang', currentLang);
  window.history.replaceState({}, '', url);
  applyLang();
}

document.addEventListener('keydown', (e) => {
  if (e.shiftKey && (e.key === 'l' || e.key === 'L')) toggleLang();
});

function applyLang() {
  document.querySelectorAll('[data-en][data-id]').forEach(el => {
    el.textContent = el.getAttribute(`data-${currentLang}`);
  });
  document.querySelectorAll('[data-placeholder-en][data-placeholder-id]').forEach(el => {
    el.placeholder = el.getAttribute(`data-placeholder-${currentLang}`);
  });
  document.documentElement.lang = currentLang;
}

// ===== Screen Navigation =====
function showScreen(id, pushHistory = true) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById(id);
  if (screen) {
    screen.classList.add('active');
    window.scrollTo(0, 0);
  }
  if (pushHistory) {
    history.pushState({ screen: id }, '', '#' + id);
  }
  // Reset token selection when entering select token screen
  if (id === 'screen-select-token') {
    if (!_basketAddMode) {
      selectedTokenKeys = [];
      document.querySelectorAll('#screen-select-token .token-row').forEach(row => {
        row.classList.remove('selected');
        const cb = row.querySelector('.token-checkbox');
        if (cb) cb.classList.remove('checked');
      });
      const cta = document.getElementById('st-cta');
      if (cta) { cta.style.opacity = '0.4'; cta.style.pointerEvents = 'none'; cta.textContent = 'Lanjutkan'; }
    }
  }
}

// ===== State =====
const assets = {
  paxg:  { name: 'Pax Gold', ticker: 'PAXG', returnPct: 1.14, icon: 'paxg' },
  btc:   { name: 'Bitcoin',  ticker: 'BTC',  returnPct: 0.3908, icon: 'btc' },
  eth:   { name: 'Ethereum', ticker: 'ETH',  returnPct: 0.2890, icon: 'eth' },
  usdt:  { name: 'Tether',   ticker: 'USDT', returnPct: 0.05,   icon: 'usdt' },
  ren:   { name: 'REN',      ticker: 'REN',  returnPct: 0.15,   icon: 'ren' },
  bnb:   { name: 'Binance Coin', ticker: 'BNB', returnPct: 0.21, icon: 'bnb' },
  comp:  { name: 'Compound', ticker: 'COMP', returnPct: 0.08,   icon: 'comp' },
  link:  { name: 'Chainlink', ticker: 'LINK', returnPct: 0.12,  icon: 'link' },
  snx:   { name: 'Synthetix', ticker: 'SNX', returnPct: 0.10,   icon: 'snx' },
  aapl:  { name: 'Apple',   ticker: 'AAPLx', returnPct: 0.18,   icon: 'aapl' },
  nvda:  { name: 'NVIDIA',  ticker: 'NVDAx', returnPct: 0.45,   icon: 'nvda' },
  googl: { name: 'Alphabet', ticker: 'GOOGLx', returnPct: 0.22, icon: 'googl' },
  tsla:  { name: 'Tesla',   ticker: 'TSLAx', returnPct: 0.30,   icon: 'tsla' },
  hood:  { name: 'Robinhood', ticker: 'HOODx', returnPct: 0.28, icon: 'hood' },
  ma:    { name: 'Mastercard', ticker: 'MAon', returnPct: 0.14, icon: 'ma' },
  baba:  { name: 'Alibaba', ticker: 'BABAon', returnPct: 0.09,  icon: 'baba' },
  coin:  { name: 'Coinbase', ticker: 'COINx', returnPct: 0.35,  icon: 'coin' },
  xaut:  { name: 'Tether Gold', ticker: 'xAUT', returnPct: 0.80, icon: 'xaut' },
  slv:   { name: 'iShares Silver Trust', ticker: 'SLVon', returnPct: 0.0405, icon: 'slv' },
  tlt:   { name: 'iShares 20+ Year Treasury Bond ETF', ticker: 'TLTon', returnPct: 0.0405, icon: 'tlt' },
  agg:   { name: 'iShares Core US Aggregate Bond ETF', ticker: 'AGGon', returnPct: 0.0405, icon: 'agg' },
  iefa:  { name: 'iShares Core MSCI EAFE', ticker: 'IEFA', returnPct: 0.0405, icon: 'iefa' },
  // Additional crypto
  sol:   { name: 'Solana',       ticker: 'SOL',   returnPct: 0.52, icon: 'sol' },
  avax:  { name: 'Avalanche',    ticker: 'AVAX',  returnPct: 0.38, icon: 'avax' },
  matic: { name: 'Polygon',      ticker: 'MATIC', returnPct: 0.28, icon: 'matic' },
  dot:   { name: 'Polkadot',     ticker: 'DOT',   returnPct: 0.20, icon: 'dot' },
  ada:   { name: 'Cardano',      ticker: 'ADA',   returnPct: 0.18, icon: 'ada' },
  xrp:   { name: 'XRP',          ticker: 'XRP',   returnPct: 0.35, icon: 'xrp' },
  doge:  { name: 'Dogecoin',     ticker: 'DOGE',  returnPct: 0.60, icon: 'doge' },
  uni:   { name: 'Uniswap',      ticker: 'UNI',   returnPct: 0.15, icon: 'uni' },
  aave:  { name: 'Aave',         ticker: 'AAVE',  returnPct: 0.22, icon: 'aave' },
  atom:  { name: 'Cosmos',       ticker: 'ATOM',  returnPct: 0.16, icon: 'atom' },
  // Additional stocks
  meta:  { name: 'Meta Platforms', ticker: 'METAx', returnPct: 0.40, icon: 'meta' },
  amzn:  { name: 'Amazon',        ticker: 'AMZNx', returnPct: 0.32, icon: 'amzn' },
  msft:  { name: 'Microsoft',     ticker: 'MSFTx', returnPct: 0.28, icon: 'msft' },
  nflx:  { name: 'Netflix',       ticker: 'NFLXx', returnPct: 0.42, icon: 'nflx' },
  pypl:  { name: 'PayPal',        ticker: 'PYPLon', returnPct: 0.12, icon: 'pypl' },
  jpm:   { name: 'JPMorgan Chase',ticker: 'JPMon',  returnPct: 0.22, icon: 'jpm' },
  bluechip: { name: 'Blue Chip Crypto', ticker: 'BASKET', returnPct: 1.14, icon: 'bluechip' },
  metal:    { name: 'Tokenized Metal',  ticker: 'BASKET', returnPct: 0.3908, icon: 'metal' },
  usindex:  { name: 'Tokenized US Index', ticker: 'BASKET', returnPct: 0.0405, icon: 'usindex' },
};

let selectedAsset = 'paxg';
let selectedFreq = 'harian'; // perjam | harian | mingguan | bulanan
let inputAmount = 0;
let selectedTokenKeys = [];
let _currentPlan = null;
let _isPaused = false;
let _isEditMode = false;

const freqMultiplier = {
  perjam:   24 * 365,
  harian:   365,
  mingguan: 52,
  bulanan:  12,
};

const scheduleLabel = {
  perjam:   { id: 'Setiap jam', en: 'Every hour' },
  harian:   { id: 'Setiap hari', en: 'Every day' },
  mingguan: { id: 'Setiap Senin', en: 'Every Monday' },
  bulanan:  { id: 'Setiap Tanggal 31', en: 'Every 31st' },
};

// ===== Tab Switching (Landing) =====
function switchTab(tab) {
  ['best', 'etf', 'basket'].forEach(t => {
    document.getElementById(`tab-${t}`).classList.toggle('active', t === tab);
    document.getElementById(`content-${t}`).classList.toggle('active', t === tab);
  });
}

// ===== Asset Icons (40px SVG for setup screen) =====
const assetIcons = {
  paxg:     `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#E5A310"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="white">Au</text></svg>`,
  btc:      `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#F7931A"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="18" font-weight="700" fill="white">₿</text></svg>`,
  eth:      `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#627EEA"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="20" font-weight="700" fill="white">Ξ</text></svg>`,
  usdt:     `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#26A17B"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="white">USDT</text></svg>`,
  ren:      `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#0A5CFF"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="white">REN</text></svg>`,
  bnb:      `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#F3BA2F"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="white">BNB</text></svg>`,
  comp:     `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#00D395"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="white">COMP</text></svg>`,
  link:     `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#375BD2"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="white">LINK</text></svg>`,
  snx:      `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#1BACE5"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="white">SNX</text></svg>`,
  aapl:     `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#555"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="white">AAPL</text></svg>`,
  nvda:     `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#76B900"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="white">NVDA</text></svg>`,
  googl:    `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#4285F4"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="18" font-weight="700" fill="white">G</text></svg>`,
  tsla:     `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#CC0000"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="18" font-weight="700" fill="white">T</text></svg>`,
  hood:     `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#00C805"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="white">HOOD</text></svg>`,
  ma:       `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#252525"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="16" font-weight="700" fill="white">MA</text></svg>`,
  baba:     `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#FF6A00"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="white">BABA</text></svg>`,
  coin:     `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#1652F0"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="white">COIN</text></svg>`,
  xaut:     `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#D4AF37"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="white">xAUT</text></svg>`,
  slv:      `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#8B6C42"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="10" font-weight="700" fill="white">SLVon</text></svg>`,
  tlt:      `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#1A237E"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="white">TLT</text></svg>`,
  agg:      `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#1B5E20"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="white">AGG</text></svg>`,
  iefa:     `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#4A148C"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="white">IEFA</text></svg>`,
  bluechip: `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#F7931A"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="18" font-weight="700" fill="white">₿</text></svg>`,
  metal:    `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#E5A310"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="white">Au</text></svg>`,
  usindex:  `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#1A237E"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="white">TLT</text></svg>`,
  // Additional crypto icons
  sol:   `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#9945FF"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="white">SOL</text></svg>`,
  avax:  `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#E84142"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="10" font-weight="700" fill="white">AVAX</text></svg>`,
  matic: `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#8247E5"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="700" fill="white">MATIC</text></svg>`,
  dot:   `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#E6007A"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="white">DOT</text></svg>`,
  ada:   `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#0033AD"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="white">ADA</text></svg>`,
  xrp:   `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#00AAE4"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="white">XRP</text></svg>`,
  doge:  `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#C2A633"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="700" fill="white">DOGE</text></svg>`,
  uni:   `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#FF007A"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="white">UNI</text></svg>`,
  aave:  `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#B6509E"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="10" font-weight="700" fill="white">AAVE</text></svg>`,
  atom:  `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#2E3148"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="700" fill="white">ATOM</text></svg>`,
  // Additional stock icons
  meta:  `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#0082FB"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="700" fill="white">META</text></svg>`,
  amzn:  `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#FF9900"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="700" fill="white">AMZN</text></svg>`,
  msft:  `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#00A4EF"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="700" fill="white">MSFT</text></svg>`,
  nflx:  `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#E50914"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="700" fill="white">NFLX</text></svg>`,
  pypl:  `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#003087"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="700" fill="white">PYPL</text></svg>`,
  jpm:   `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#003E7E"/><text x="20" y="20" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="white">JPM</text></svg>`,
};

// ===== Go to Setup =====
function goToSetup(assetKey) {
  selectedAsset = assetKey;
  const asset = assets[assetKey] || assets.paxg;

  // Update asset cell in setup screen
  document.getElementById('setup-asset-name').textContent = asset.name;
  document.getElementById('setup-asset-ticker').textContent = asset.ticker;

  // Update asset icon
  const iconEl = document.getElementById('setup-asset-icon');
  if (iconEl && assetIcons[assetKey]) {
    iconEl.innerHTML = assetIcons[assetKey];
  }

  // Reset amount
  inputAmount = 0;
  const input = document.getElementById('amount-input');
  if (input) { input.value = ''; }
  document.getElementById('amount-clear').style.display = 'none';

  // Reset freq to harian
  selectedFreq = 'harian';
  ['perjam','harian','mingguan','bulanan'].forEach(f => {
    document.getElementById(`freq-${f}`).classList.toggle('active', f === selectedFreq);
  });

  // Unlock asset cell + restore nav (in case coming from edit mode)
  const assetCell = document.querySelector('#screen-setup .asset-cell');
  if (assetCell) { assetCell.style.pointerEvents = ''; assetCell.style.opacity = ''; }

  showScreen('screen-setup');
  // Reset nav to create mode
  const titleEl = document.getElementById('setup-nav-title');
  const backBtn = document.getElementById('setup-back-btn');
  const chevron = document.getElementById('setup-asset-chevron');
  const ctaBtn  = document.getElementById('setup-cta-btn');
  if (titleEl)  titleEl.textContent = 'Buat Jadwal Auto Invest';
  if (backBtn)  backBtn.onclick = () => showScreen('screen-landing');
  if (chevron)  chevron.style.display = '';
  if (ctaBtn)   ctaBtn.textContent = 'Buat Jadwal';
  requestAnimationFrame(() => updateProjection());
}
function onAmountChange(raw) {
  // Strip non-digits
  const digits = raw.replace(/\D/g, '');
  inputAmount = parseInt(digits, 10) || 0;

  // Show/hide clear button
  document.getElementById('amount-clear').style.display = inputAmount > 0 ? 'flex' : 'none';

  // Format display value
  const input = document.getElementById('amount-input');
  if (inputAmount > 0) {
    input.value = formatThousands(inputAmount);
  } else {
    input.value = '';
  }

  updateProjection();
}

function clearAmount() {
  inputAmount = 0;
  document.getElementById('amount-input').value = '';
  document.getElementById('amount-clear').style.display = 'none';
  updateProjection();
}

// ===== Frequency Selection =====
function selectFreq(freq) {
  selectedFreq = freq;
  ['perjam','harian','mingguan','bulanan'].forEach(f => {
    document.getElementById(`freq-${f}`).classList.toggle('active', f === freq);
  });
  updateProjection();
}

// ===== Projection Calculation & Chart =====
function updateProjection() {
  const asset = assets[selectedAsset] || assets.paxg;
  const periods = freqMultiplier[selectedFreq] || 365;
  const totalCapital = inputAmount * periods;
  const projectedValue = totalCapital * (1 + asset.returnPct);

  const projValueEl = document.getElementById('proj-value');
  const projPctEl = document.getElementById('proj-pct');
  const projCapEl = document.getElementById('proj-capital');

  if (projValueEl) projValueEl.textContent = formatIDR(projectedValue);
  if (projCapEl) projCapEl.textContent = ' ' + formatIDR(totalCapital);

  if (projPctEl) {
    if (inputAmount > 0) {
      const gain = ((projectedValue - totalCapital) / totalCapital * 100);
      projPctEl.textContent = `(+${gain.toFixed(2).replace('.', ',')}%)`;
      projPctEl.style.display = 'inline';
    } else {
      projPctEl.style.display = 'none';
    }
  }

  drawProjectionChart(totalCapital, projectedValue);
}

function drawProjectionChart(capital, projected) {
  const canvas = document.getElementById('projectionChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.parentElement?.clientWidth || document.querySelector('.container')?.clientWidth || 398;
  const H = 140;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const months = 12;
  const capitalPoints = [];
  const portfolioPoints = [];

  for (let i = 0; i <= months; i++) {
    const t = i / months;
    capitalPoints.push({ x: t * W, y: H - t * capital / (projected || 1) * H * 0.85 });
  }

  // Portfolio (with sine-wave variation for realism)
  for (let i = 0; i <= months; i++) {
    const t = i / months;
    const base = t * projected;
    const noise = projected * 0.05 * Math.sin(i * 2.2);
    const y = H - (base + noise) / (projected || 1) * H * 0.85;
    portfolioPoints.push({ x: t * W, y: Math.max(2, Math.min(H - 2, y)) });
  }

  // Draw capital (grey filled area)
  ctx.beginPath();
  ctx.moveTo(capitalPoints[0].x, H);
  capitalPoints.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(capitalPoints[capitalPoints.length - 1].x, H);
  ctx.closePath();
  ctx.fillStyle = 'rgba(176,176,176,0.25)';
  ctx.fill();

  // Draw capital line
  ctx.beginPath();
  capitalPoints.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#B0B0B0';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Draw portfolio (blue filled area)
  ctx.beginPath();
  ctx.moveTo(portfolioPoints[0].x, H);
  portfolioPoints.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(portfolioPoints[portfolioPoints.length - 1].x, H);
  ctx.closePath();
  ctx.fillStyle = 'rgba(10, 104, 244, 0.12)';
  ctx.fill();

  // Draw portfolio line
  ctx.beginPath();
  portfolioPoints.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#0A68F4';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Endpoint dots
  const lastPort = portfolioPoints[portfolioPoints.length - 1];
  const lastCap = capitalPoints[capitalPoints.length - 1];

  ctx.beginPath();
  ctx.arc(lastPort.x, lastPort.y, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#0A68F4';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(lastCap.x, lastCap.y, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#B0B0B0';
  ctx.fill();
}

// ===== Populate Confirmation Screen =====
function populateConfirmation({ isBasket, amount, schedText, assetKey, assetName, basketName, basketAssetsList, scheduledTime }) {
  // Amount hero
  document.getElementById('conf-amount').textContent = formatIDR(amount);

  // Schedule
  const schedEl = document.getElementById('conf-schedule');
  const timeStr = scheduledTime || (() => { const n = new Date(); return String(n.getHours()).padStart(2,'0') + ':' + String(n.getMinutes()).padStart(2,'0'); })();
  if (schedEl) schedEl.textContent = schedText + ', jam ' + timeStr;

  // Back button target
  const backBtn = document.getElementById('conf-back-btn');
  if (backBtn) backBtn.setAttribute('onclick', isBasket ? "showScreen('screen-setup-basket')" : "showScreen('screen-setup')");

  // Toggle single vs basket rows
  const rowAsset  = document.getElementById('conf-row-asset');
  const rowName   = document.getElementById('conf-row-name');
  const singlePurchase = document.getElementById('conf-single-purchase');
  const basketRows     = document.getElementById('conf-basket-rows');
  const singleFees     = document.getElementById('conf-single-fees');
  const basketFees     = document.getElementById('conf-basket-fees');

  if (isBasket) {
    // Show basket name row, hide asset row
    rowAsset.style.display = 'none';
    rowName.style.display = '';
    document.getElementById('conf-basket-name').textContent = basketName;

    // Hide single purchase row, show basket breakdown
    singlePurchase.style.display = 'none';
    singleFees.style.display = 'none';
    basketFees.style.display = '';

    // Render per-asset rows
    basketRows.innerHTML = '<p class="text-caption text-secondary" style="padding:8px 0 4px;">Jumlah Pembelian</p>';
    basketAssetsList.forEach(({ key, alloc }) => {
      const a = assets[key];
      if (!a) return;
      const perAmt = Math.round(amount * alloc / 100);
      const icon20 = (assetIcons[key] || assetIcons.btc)
        .replace('width="40" height="40"', 'width="20" height="20"')
        .replace('viewBox="0 0 40 40"', 'viewBox="0 0 40 40"');
      const row = document.createElement('div');
      row.className = 'kv-row';
      row.innerHTML = `
        <span class="kv-label" style="display:flex; align-items:center; gap:6px;">
          <span style="flex-shrink:0; border-radius:50%; overflow:hidden; width:20px; height:20px; display:flex;">${icon20}</span>
          ${a.name}
        </span>
        <span class="kv-value" style="font-variant-numeric:tabular-nums;">${formatIDR(perAmt)}</span>
      `;
      basketRows.appendChild(row);
    });

    document.getElementById('conf-total').textContent = formatIDR(amount);

  } else {
    // Show asset row, hide basket name row
    rowAsset.style.display = '';
    rowName.style.display = 'none';
    singlePurchase.style.display = '';
    singleFees.style.display = '';
    basketRows.innerHTML = '';
    basketFees.style.display = 'none';

    // Asset cell: icon + name
    const icon20 = (assetIcons[assetKey] || assetIcons.btc)
      .replace('width="40" height="40"', 'width="20" height="20"')
      .replace('viewBox="0 0 40 40"', 'viewBox="0 0 40 40"');
    const assetCell = document.getElementById('conf-asset-cell');
    assetCell.innerHTML = `<span style="flex-shrink:0; border-radius:50%; overflow:hidden; width:20px; height:20px; display:flex;">${icon20}</span>${assetName}`;

    document.getElementById('conf-purchase').textContent = formatIDR(amount);
    document.getElementById('conf-total').textContent = formatIDR(amount);
  }

  showScreen('screen-confirmation');
}

// ===== Go to Confirmation (single asset) =====
function goToConfirmation() {
  if (inputAmount < 11000) {
    alert(currentLang === 'id' ? 'Minimum investasi Rp 11.000' : 'Minimum investment is Rp 11,000');
    return;
  }
  const asset = assets[selectedAsset] || assets.paxg;
  const sched = scheduleLabel[selectedFreq] || scheduleLabel.harian;
  // Capture current time for schedule display
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  populateConfirmation({
    isBasket: false,
    amount: inputAmount,
    schedText: sched[currentLang],
    assetKey: selectedAsset,
    assetName: asset.name,
    scheduledTime: `${hh}:${mm}`,
    scheduledDate: now,
  });
}

// ===== Last Plan State (populated on confirm) =====
let lastPlan = null;

// ===== Go to Success =====
function goToSuccess() {
  // Edit mode: skip success, go back to detail with snackbar
  if (_isEditMode) {
    _isEditMode = false;
    showScreen('screen-plan-detail');
    showSnackbar('Jadwal berhasil diubah');
    return;
  }

  const msgEl = document.getElementById('success-msg');
  if (msgEl) {
    // lastPlan is pre-set for basket flow; null for single asset flow
    const isBasket = lastPlan && lastPlan.type === 'multi';
    if (isBasket) {
      msgEl.setAttribute('data-id', 'Auto Invest Berhasil Dijadwalkan!');
      msgEl.setAttribute('data-en', 'Auto Invest Successfully Scheduled!');
    } else {
      const asset = assets[selectedAsset] || assets.paxg;
      msgEl.setAttribute('data-id', `Auto Invest ${asset.ticker} Berhasil Dijadwalkan!`);
      msgEl.setAttribute('data-en', `${asset.name} Auto Invest Successfully Scheduled!`);
    }
    msgEl.textContent = msgEl.getAttribute(`data-${currentLang}`);
  }
  // Store plan data for single asset (basket already stored in goToBasketConfirmation)
  if (!lastPlan) {
    const asset = assets[selectedAsset] || assets.paxg;
    const freqLabel = { perjam: 'Per Jam', harian: 'Harian', mingguan: 'Mingguan', bulanan: 'Bulanan' };
    lastPlan = {
      type: 'single',
      assetKey: selectedAsset,
      name: asset.name,
      ticker: asset.ticker,
      amount: inputAmount,
      freq: freqLabel[selectedFreq] || 'Harian',
      scheduledTime: (() => { const n = new Date(); return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`; })(),
      scheduledDate: new Date(),
    };
  }
  showScreen('screen-success');
}

// ===== Go to My Plans =====
function goToMyPlans() {
  if (lastPlan) {
    injectNewPlanCard(lastPlan);
    lastPlan = null;
  }
  if (_savedPlans.length > 0) {
    showScreen('screen-myplans');
    requestAnimationFrame(() => drawPlanSparklines());
  } else {
    showScreen('screen-myplans-empty');
  }
}

// ===== Plan Detail =====
function goToPlanDetail(plan) {
  _currentPlan = plan;
  _isPaused = false;
  const banner = document.getElementById('pd-paused-banner');
  if (banner) banner.style.display = 'none';

  // Nav title
  const navTitle = document.getElementById('pd-nav-title');
  if (navTitle) navTitle.textContent = plan.name;

  // Current value + PnL
  const cvEl = document.getElementById('pd-current-value');
  if (cvEl) cvEl.textContent = formatIDR(plan.currentValue || plan.amount);
  const pnlEl = document.getElementById('pd-pnl');
  if (pnlEl) {
    const pnlAmt = plan.pnlAmt || 0;
    const pnlPct = plan.pnlPct || 0;
    const sign = pnlAmt >= 0 ? '+' : '';
    const pnlPctStr = pnlPct.toFixed(2).replace('.', ',');
    pnlEl.textContent = `${sign}${formatIDR(pnlAmt)} (${pnlPctStr}%)`;
    pnlEl.style.color = pnlAmt >= 0 ? 'var(--green)' : 'var(--red)';
  }

  // Ringkasan summary
  const ringkasanCard = document.getElementById('pd-ringkasan-card');
  if (ringkasanCard) {
    const total = plan.totalInvested || plan.amount;
    if (plan.type === 'multi') {
      // Build basket asset display list from plan.basketAssets or fallback to BTC+ETH
      const planBasketAssets = (plan.basketAssets && plan.basketAssets.length > 0)
        ? plan.basketAssets.map(a => {
            const info = assets[a.key] || {};
            // Extract color+letter from assetIcons SVG or use fallback
            const iconSvg = assetIcons[a.key] || assetIcons.btc;
            const colorMatch = iconSvg.match(/fill="(#[0-9A-Fa-f]{6})"/);
            const color = colorMatch ? colorMatch[1] : '#888888';
            const textMatch = iconSvg.match(/<text[^>]*>([^<]+)<\/text>/);
            const letter = textMatch ? textMatch[1] : (info.ticker || a.key).slice(0, 2).toUpperCase();
            return { key: a.key, ticker: info.ticker || a.key.toUpperCase(), name: info.name || a.key, color, letter, fsize: 14 };
          })
        : [
            { key: 'btc', ticker: 'BTC', name: 'Bitcoin',  color: '#F7931A', letter: '₿', fsize: 16 },
            { key: 'eth', ticker: 'ETH', name: 'Ethereum', color: '#627EEA', letter: 'Ξ', fsize: 16 },
          ];
      const assetRows = planBasketAssets.map(a => `
        <div style="display:flex; align-items:center; gap:12px; padding:12px 16px; border-top:1px solid var(--outline);">
          <svg width="36" height="36" viewBox="0 0 36 36" style="flex-shrink:0;"><circle cx="18" cy="18" r="18" fill="${a.color}"/><text x="18" y="18" text-anchor="middle" dominant-baseline="central" font-size="${a.fsize}" font-weight="700" fill="white">${a.letter}</text></svg>
          <div style="flex:1; min-width:0;">
            <p class="text-body-bold">${a.name}</p>
            <p class="text-caption text-secondary">${a.ticker}</p>
          </div>
          <p class="text-body-bold" style="font-variant-numeric:tabular-nums; flex-shrink:0;">${a.ticker} ${a.qty || '0,00000'}</p>
        </div>
      `).join('');

      ringkasanCard.innerHTML = `
        <div class="kv-row" style="padding:14px 16px;">
          <span class="kv-label">Total Pembelian</span>
          <span class="kv-value text-body-bold" style="font-variant-numeric:tabular-nums;">${formatIDR(total)}</span>
        </div>
        <div>
          <button onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display==='none'?'block':'none'; this.querySelector('.pd-chevron').style.transform = this.nextElementSibling.style.display==='none'?'':'rotate(180deg)';"
            style="width:100%; display:flex; justify-content:space-between; align-items:center; padding:14px 16px; border-top:1px solid var(--outline); background:none; border-left:none; border-right:none; border-bottom:none; cursor:pointer;">
            <span class="kv-label" style="color:var(--ink-secondary);">Aset Terakumulasi</span>
            <svg class="pd-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" style="transition:transform 0.2s; transform:rotate(180deg);"><path d="M4 6l4 4 4-4" stroke="var(--ink-tertiary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div>${assetRows}</div>
        </div>
        <div>
          <button onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display==='none'?'block':'none'; this.querySelector('.pd-chevron2').style.transform = this.nextElementSibling.style.display==='none'?'rotate(180deg) rotate(180deg)':'';"
            style="width:100%; display:flex; justify-content:space-between; align-items:center; padding:14px 16px; border-top:1px solid var(--outline); background:none; border-left:none; border-right:none; border-bottom:none; cursor:pointer;">
            <span class="kv-label" style="color:var(--ink-secondary);">Harga Rata-rata Pembelian</span>
            <svg class="pd-chevron2" width="16" height="16" viewBox="0 0 16 16" fill="none" style="transition:transform 0.2s;"><path d="M4 6l4 4 4-4" stroke="var(--ink-tertiary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div style="display:none;">
            ${planBasketAssets.map(a => `
              <div style="display:flex; align-items:center; gap:12px; padding:12px 16px; border-top:1px solid var(--outline);">
                <svg width="32" height="32" viewBox="0 0 32 32" style="flex-shrink:0;"><circle cx="16" cy="16" r="16" fill="${a.color}"/><text x="16" y="16" text-anchor="middle" dominant-baseline="central" font-size="${a.fsize}" font-weight="700" fill="white">${a.letter}</text></svg>
                <div style="flex:1; min-width:0;">
                  <p class="text-body-bold">${a.name}</p>
                  <p class="text-caption text-secondary">${a.ticker}</p>
                </div>
                <span class="kv-value text-body-bold" style="font-variant-numeric:tabular-nums;">Rp ${a.ticker === 'BTC' ? '1.048.400.000' : '18.650.000'}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      // Single asset
      const mockUnitPrice = plan.assetKey === 'btc' ? 1500000000 : plan.assetKey === 'eth' ? 52000000 : 984600;
      const qty = (total / mockUnitPrice).toFixed(5).replace('.', ',');
      const ticker = plan.ticker || plan.name;
      ringkasanCard.innerHTML = `
        <div class="kv-row" style="padding:12px 16px;">
          <span class="kv-label">Total Modal</span>
          <span class="kv-value text-body-bold" style="font-variant-numeric:tabular-nums;">${formatIDR(total)}</span>
        </div>
        <div class="kv-row" style="padding:12px 16px; border-top:1px solid var(--outline);">
          <span class="kv-label">${ticker} Terbeli via Auto Invest</span>
          <span class="kv-value text-body-bold" style="font-variant-numeric:tabular-nums;">${ticker} ${qty}</span>
        </div>
        <div class="kv-row" style="padding:12px 16px; border-top:1px solid var(--outline);">
          <span class="kv-label">Harga Rata-rata Pembelian</span>
          <span class="kv-value text-body-bold" style="font-variant-numeric:tabular-nums;">${formatIDR(mockUnitPrice)}</span>
        </div>
      `;
    }
  }

  // Jadwal tab
  const jadwalCard = document.getElementById('pd-jadwal-card');
  if (jadwalCard) {
    // Build "Waktu" string based on freq and scheduled time
    const hariNames = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const now = plan.scheduledDate ? new Date(plan.scheduledDate) : new Date();
    const pukul = plan.scheduledTime || '19:00';
    const hariNama = hariNames[now.getDay()];
    const tanggal = now.getDate();
    let waktuStr;
    switch (plan.freq) {
      case 'Per Jam':  waktuStr = 'Setiap 1 jam'; break;
      case 'Harian':   waktuStr = `Setiap hari, pukul ${pukul}`; break;
      case 'Mingguan': waktuStr = `Setiap hari ${hariNama}, pukul ${pukul}`; break;
      case 'Bulanan':  waktuStr = `Setiap tanggal ${tanggal}, pukul ${pukul}`; break;
      default:         waktuStr = `Pukul ${pukul}`;
    }

    const commonRows = `
      <div class="kv-row" style="padding:14px 16px; border-top:1px solid var(--outline);">
        <span class="kv-label">Jadwal</span>
        <span class="kv-value text-body-bold">${plan.freq}</span>
      </div>
      <div class="kv-row" style="padding:14px 16px; border-top:1px solid var(--outline);">
        <span class="kv-label">Waktu</span>
        <span class="kv-value text-body-bold">${waktuStr}</span>
      </div>
      <div class="kv-row" style="padding:14px 16px; border-top:1px solid var(--outline);">
        <span class="kv-label">Durasi</span>
        <span class="kv-value text-body-bold">Hingga Dibatalkan</span>
      </div>
      <div class="kv-row" style="padding:14px 16px; border-top:1px solid var(--outline);">
        <span class="kv-label">Pembelian Selanjutnya</span>
        <span class="kv-value text-body-bold">12 Mar 2026, 19.00</span>
      </div>
    `;

    if (plan.type === 'multi') {
      // Build dynamic basket assets for jadwal tab from plan.basketAssets or fallback
      const jadwalBasketAssets = (plan.basketAssets && plan.basketAssets.length > 0)
        ? plan.basketAssets.map(a => {
            const info = assets[a.key] || {};
            const iconSvg = assetIcons[a.key] || assetIcons.btc;
            const colorMatch = iconSvg.match(/fill="(#[0-9A-Fa-f]{6})"/);
            const color = colorMatch ? colorMatch[1] : '#888888';
            const textMatch = iconSvg.match(/<text[^>]*>([^<]+)<\/text>/);
            const letter = textMatch ? textMatch[1] : (info.ticker || a.key).slice(0, 2).toUpperCase();
            return { key: a.key, ticker: info.ticker || a.key.toUpperCase(), name: info.name || a.key, color, letter, fsize: 14, alloc: a.alloc || 0 };
          })
        : [
            { ticker: 'BTC', name: 'Bitcoin', color: '#F7931A', letter: '₿', fsize: 16, alloc: 50 },
            { ticker: 'ETH', name: 'Ethereum', color: '#627EEA', letter: 'Ξ', fsize: 16, alloc: 50 },
          ];
      const totalAmt = plan.amount;
      const assetRows = jadwalBasketAssets.map(a => `
        <div style="display:flex; align-items:center; gap:12px; padding:12px 16px; border-top:1px solid var(--outline);">
          <svg width="36" height="36" viewBox="0 0 36 36" style="flex-shrink:0;"><circle cx="18" cy="18" r="18" fill="${a.color}"/><text x="18" y="18" text-anchor="middle" dominant-baseline="central" font-size="${a.fsize}" font-weight="700" fill="white">${a.letter}</text></svg>
          <div style="flex:1; min-width:0;">
            <p class="text-body-bold">${a.name}</p>
            <p class="text-caption text-secondary">${a.ticker}</p>
          </div>
          <p class="text-body-bold" style="font-variant-numeric:tabular-nums; flex-shrink:0;">${formatIDR(Math.round(totalAmt * a.alloc / 100))}</p>
        </div>
      `).join('');

      jadwalCard.innerHTML = `
        <div>
          <button onclick="var sub=this.nextElementSibling; sub.style.display=sub.style.display==='none'?'block':'none'; this.querySelector('.jc').style.transform=sub.style.display==='none'?'':'rotate(180deg)';"
            style="width:100%; display:flex; justify-content:space-between; align-items:center; padding:14px 16px; background:none; border:none; cursor:pointer;">
            <span class="kv-label">Jumlah Alokasi</span>
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="kv-value text-body-bold" style="font-variant-numeric:tabular-nums;">${formatIDR(totalAmt)}</span>
              <svg class="jc" width="16" height="16" viewBox="0 0 16 16" fill="none" style="transition:transform 0.2s; transform:rotate(180deg);"><path d="M4 6l4 4 4-4" stroke="var(--ink-tertiary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </button>
          <div>${assetRows}</div>
        </div>
        ${commonRows}
      `;
    } else {
      jadwalCard.innerHTML = `
        <div class="kv-row" style="padding:14px 16px;">
          <span class="kv-label">Jumlah Per Investasi</span>
          <span class="kv-value text-body-bold" style="font-variant-numeric:tabular-nums;">${formatIDR(plan.amount)}</span>
        </div>
        ${commonRows}
      `;
    }
  }

  // Transaction rows — use plan amount
  const txList = document.getElementById('pd-tx-list');
  if (txList) {
    const amt = formatIDR(plan.amount);
    const halfAmt = formatIDR(Math.round(plan.amount / 2));
    const ticker = plan.ticker || plan.name;
    const isMulti = plan.type === 'multi';
    const successTitle = 'Auto Invest Berhasil';
    const failTitle = 'Auto Invest Gagal';
    const row2Status = isMulti
      ? `<svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#627EEA"/></svg><p class="text-caption text-secondary">1/${(plan.basketAssets || []).length || 2} Aset Terbeli</p>`
      : `<svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#25A764"/></svg><p class="text-caption text-secondary">Berhasil</p>`;
    txList.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:14px var(--screen-padding);border-bottom:1px solid var(--outline);">
        <div><p class="text-body-bold">${successTitle}</p><p class="text-caption text-secondary">06-04-2026 09:00</p></div>
        <div style="text-align:right;flex-shrink:0;">
          <p class="text-body-bold" style="font-variant-numeric:tabular-nums;">${amt}</p>
          <div style="display:flex;align-items:center;gap:4px;justify-content:flex-end;margin-top:2px;">
            <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#25A764"/></svg>
            <p class="text-caption text-secondary">Berhasil</p>
          </div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:14px var(--screen-padding);border-bottom:1px solid var(--outline);">
        <div><p class="text-body-bold">${successTitle}</p><p class="text-caption text-secondary">05-04-2026 09:00</p></div>
        <div style="text-align:right;flex-shrink:0;">
          <p class="text-body-bold" style="font-variant-numeric:tabular-nums;">${halfAmt}</p>
          <div style="display:flex;align-items:center;gap:4px;justify-content:flex-end;margin-top:2px;">
            ${row2Status}
          </div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:14px var(--screen-padding);border-bottom:1px solid var(--outline);">
        <div><p class="text-body-bold" style="color:var(--ink-secondary);">${failTitle}</p><p class="text-caption text-secondary">04-04-2026 09:00</p></div>
        <div style="text-align:right;flex-shrink:0;">
          <p class="text-body-bold text-secondary" style="font-variant-numeric:tabular-nums;">${amt}</p>
          <div style="display:flex;align-items:center;gap:4px;justify-content:flex-end;margin-top:2px;">
            <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#E54040"/></svg>
            <p class="text-caption text-secondary">Saldo Tidak Mencukupi</p>
          </div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:14px var(--screen-padding);border-bottom:1px solid var(--outline);">
        <div><p class="text-body-bold" style="color:var(--ink-secondary);">${failTitle}</p><p class="text-caption text-secondary">03-04-2026 09:00</p></div>
        <div style="text-align:right;flex-shrink:0;">
          <p class="text-body-bold text-secondary" style="font-variant-numeric:tabular-nums;">${amt}</p>
          <div style="display:flex;align-items:center;gap:4px;justify-content:flex-end;margin-top:2px;">
            <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#E54040"/></svg>
            <p class="text-caption text-secondary">Aset Sedang Maintenance</p>
          </div>
        </div>
      </div>
    `;
  }

  // Draw chart
  showScreen('screen-plan-detail');
  requestAnimationFrame(() => drawPlanDetailChart(plan));

  // Reset to Transaksi tab
  switchPlanDetailTab('transaksi');
}

function switchPlanDetailTab(tab) {
  ['transaksi', 'rencana'].forEach(t => {
    document.getElementById(`pd-tab-${t}`).classList.toggle('active', t === tab);
    document.getElementById(`pd-content-${t}`).classList.toggle('active', t === tab);
  });
}

function drawPlanDetailChart(plan) {
  const canvas = document.getElementById('pd-chart');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.parentElement?.clientWidth || document.querySelector('.container')?.clientWidth || 398;
  const h = 120;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(dpr, dpr);

  // Derive executions count from freq
  const freqExec = { 'Per Jam': 24, 'Harian': 30, 'Mingguan': 12, 'Bulanan': 6 };
  const steps = freqExec[plan.freq] || 12;

  // Build capital data points: grows by plan.amount each step (step function)
  const totalInvested = plan.totalInvested || plan.amount;
  const currentValue  = plan.currentValue  || plan.amount;
  const returnRatio   = currentValue / totalInvested; // e.g. 1.12 for +12%

  // Normalise: map capital 0→totalInvested and portfolio 0→currentValue onto chart height
  const pad = 16;
  const chartH = h - pad * 2;

  const capitalData  = [];
  const portfolioData = [];

  // Seed random for consistent noise per plan
  let seed = plan.amount % 999 + steps;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    // Capital: step up evenly — each period adds one installment
    const capitalVal = totalInvested * progress;

    // Portfolio: capital × return ratio with realistic noise
    const noise = (rand() - 0.5) * 0.08 * returnRatio;
    const portfolioVal = capitalVal * (returnRatio + (progress < 0.05 ? 0 : noise));

    capitalData.push(capitalVal);
    portfolioData.push(portfolioVal);
  }

  // Scale values to pixel Y (higher value = lower Y)
  const maxVal = Math.max(...portfolioData, ...capitalData) * 1.05;
  const toY = v => pad + chartH - (v / maxVal) * chartH;

  const capitalPts  = capitalData.map((v, i)  => ({ x: (i / steps) * w, y: toY(v) }));
  const portfolioPts = portfolioData.map((v, i) => ({ x: (i / steps) * w, y: toY(v) }));

  // Capital fill
  ctx.beginPath();
  ctx.moveTo(capitalPts[0].x, h);
  capitalPts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(capitalPts[capitalPts.length - 1].x, h);
  ctx.closePath();
  ctx.fillStyle = 'rgba(140,140,140,0.08)';
  ctx.fill();

  // Capital line (gray dashed)
  ctx.beginPath();
  capitalPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#9E9E9E';
  ctx.lineWidth = 1.5;
  ctx.lineJoin = 'round';
  ctx.setLineDash([4, 3]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Portfolio fill (blue)
  ctx.beginPath();
  ctx.moveTo(portfolioPts[0].x, h);
  portfolioPts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(portfolioPts[portfolioPts.length - 1].x, h);
  ctx.closePath();
  ctx.fillStyle = 'rgba(10,104,244,0.10)';
  ctx.fill();

  // Portfolio line (blue)
  ctx.beginPath();
  portfolioPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#0A68F4';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // End dots
  const lastP = portfolioPts[portfolioPts.length - 1];
  const lastC = capitalPts[capitalPts.length - 1];
  ctx.beginPath(); ctx.arc(lastP.x, lastP.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#0A68F4'; ctx.fill();
  ctx.beginPath(); ctx.arc(lastC.x, lastC.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#9E9E9E'; ctx.fill();
}

// ===== Plan Persistence =====
let _savedPlans = []; // in-memory list of all created plans

function savePlansToStorage() {
  sessionStorage.setItem('dca_plans', JSON.stringify(_savedPlans));
}

function restorePlansFromStorage() {
  try {
    const stored = sessionStorage.getItem('dca_plans');
    if (!stored) return;
    const plans = JSON.parse(stored);
    _savedPlans = plans;
    plans.forEach(plan => {
      injectNewPlanCard(plan, false); // false = don't save again
    });
  } catch(e) {}
}


function injectNewPlanCard(plan, persist = true) {
  const main = document.querySelector('#screen-myplans main');
  if (!main) return;

  // Deduplicate by plan id
  if (plan.id && main.querySelector(`[data-plan-id="${plan.id}"]`)) return;

  // Hide all hardcoded static plan cards (only on first injection)
  if (!main.querySelector('.plan-card-new')) {
    main.querySelectorAll('.plan-card:not(.plan-card-new)').forEach(c => c.style.display = 'none');
  }

  let iconHtml, cardType;

  if (plan.type === 'single') {
    cardType = 'single';
    const icon40 = (assetIcons[plan.assetKey] || assetIcons.btc)
      .replace('width="40" height="40"', 'width="40" height="40"');
    iconHtml = icon40;
  } else {
    cardType = 'multi';
    const stackAssets = plan.basketAssets ? plan.basketAssets.slice(0, 2) : [];
    iconHtml = '<div class="asset-icon-stack">';
    stackAssets.forEach((a, i) => {
      const icon32 = (assetIcons[a.key] || assetIcons.btc)
        .replace('width="40" height="40"', 'width="32" height="32"');
      iconHtml += `<div style="${i > 0 ? 'margin-left:-10px; border:2px solid white; border-radius:50%;' : ''}">${icon32}</div>`;
    });
    iconHtml += '</div>';
  }

  const planData = JSON.stringify(plan).replace(/'/g, "\\'");

  const card = document.createElement('div');
  card.className = 'card plan-card plan-card-new';
  card.dataset.type = cardType;
  if (plan.id) card.dataset.planId = plan.id;
  card.innerHTML = `
    <div style="display:flex; align-items:flex-start; gap:10px; margin-bottom:6px;">
      ${iconHtml}
      <div style="flex:1; min-width:0;">
        <p class="text-body-bold" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${plan.name}</p>
        <p class="text-caption text-secondary">${plan.freq}</p>
      </div>
      <canvas class="plan-sparkline" data-pnl="0" data-seed="${Date.now() % 999}" style="display:block; flex-shrink:0;"></canvas>
    </div>
    <p class="text-caption text-secondary" style="margin-bottom:2px;">PnL</p>
    <p class="text-heading-lg text-green" style="font-variant-numeric:tabular-nums; margin-bottom:12px;">+Rp 0</p>
    <div class="plan-stats">
      <div class="plan-stat">
        <p class="text-micro text-tertiary">Per Investasi</p>
        <p class="text-caption-bold" style="font-variant-numeric:tabular-nums;">Rp ${formatThousands(plan.amount)}</p>
      </div>
      <div class="plan-stat" style="text-align:center; align-items:center;">
        <p class="text-micro text-tertiary">Total Pembelian</p>
        <p class="text-caption-bold" style="font-variant-numeric:tabular-nums;">Rp ${formatThousands(plan.amount)}</p>
      </div>
      <div class="plan-stat" style="text-align:right; align-items:flex-end;">
        <p class="text-micro text-tertiary">Nilai Saat Ini</p>
        <p class="text-caption-bold" style="font-variant-numeric:tabular-nums;">Rp ${formatThousands(plan.amount)}</p>
      </div>
    </div>
    <button class="btn btn-outlined" style="margin-top:12px; height:44px; font-size:14px; border-color:var(--outline); color:var(--ink-primary);" onclick='goToPlanDetail(${JSON.stringify({...plan, currentValue: plan.amount, totalInvested: plan.amount, pnlAmt: 0, pnlPct: 0, executions: 1})})'>Lihat Jadwal</button>
  `;

  // Insert before the filter pills
  const filterPills = main.querySelector('.filter-pills');
  if (filterPills) {
    filterPills.after(card);
  } else {
    main.prepend(card);
  }

  // Draw sparklines on the newly injected card
  requestAnimationFrame(() => drawPlanSparklines());

  // Persist to localStorage so cards survive page reloads
  if (persist) {
    _savedPlans.push(plan);
    savePlansToStorage();
  }
}

// ===== Filter Plans =====
function filterPlans(type) {
  ['all','single','multi'].forEach(t => {
    document.getElementById(`plan-filter-${t}`).classList.toggle('active', t === type);
  });

  // Only operate on user-created cards (never un-hide static hardcoded ones)
  const userCards = document.querySelectorAll('#screen-myplans .plan-card-new');
  let visibleCount = 0;

  userCards.forEach(card => {
    const show = type === 'all' || card.dataset.type === type;
    card.style.display = show ? '' : 'none';
    if (show) visibleCount++;
  });

  // Show/hide filter empty state
  const emptyEl = document.getElementById('plan-filter-empty');
  const titleEl = document.getElementById('plan-filter-empty-title');
  if (emptyEl) {
    if (visibleCount === 0 && type !== 'all') {
      const label = type === 'single' ? 'Single Aset' : 'Multi Aset';
      if (titleEl) titleEl.textContent = `Belum ada jadwal ${label}`;
      emptyEl.style.display = 'flex';
    } else {
      emptyEl.style.display = 'none';
    }
  }
}

// ===== Formatters =====
function formatIDR(amount) {
  if (!amount) return 'Rp 0';
  const rounded = Math.round(amount);
  const str = String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return 'Rp ' + str;
}

function formatThousands(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ===== Select Token Tab Switching =====
let activeTokenTab = 'crypto';

function switchTokenTab(tab) {
  activeTokenTab = tab;
  ['crypto', 'stocks', 'commodity', 'etf'].forEach(t => {
    document.getElementById(`st-tab-${t}`).classList.toggle('active', t === tab);
    document.getElementById(`st-content-${t}`).classList.toggle('active', t === tab);
  });
  // Re-run search filter for new tab
  const searchInput = document.getElementById('st-search');
  if (searchInput) filterTokens(searchInput.value);
}

// ===== Filter Tokens (search within active tab) =====
function filterTokens(query) {
  const q = query.trim().toLowerCase();
  const activeContent = document.getElementById(`st-content-${activeTokenTab}`);
  if (!activeContent) return;

  const rows = activeContent.querySelectorAll('.token-row');
  let visibleCount = 0;

  rows.forEach(row => {
    const name = (row.dataset.name || '').toLowerCase();
    const matches = !q || name.includes(q);
    row.style.display = matches ? '' : 'none';
    if (matches) visibleCount++;
  });

  const noResults = activeContent.querySelector('.token-no-results');
  if (noResults) noResults.style.display = visibleCount === 0 ? '' : 'none';
}

// ===== Select Token (multi-select) =====
function toggleTokenRow(el, assetKey) {
  const checkbox = el.querySelector('.token-checkbox');
  const isChecked = checkbox.classList.contains('checked');

  if (isChecked) {
    // Deselect
    el.classList.remove('selected');
    checkbox.classList.remove('checked');
    selectedTokenKeys = selectedTokenKeys.filter(k => k !== assetKey);
  } else {
    // Select
    el.classList.add('selected');
    checkbox.classList.add('checked');
    selectedTokenKeys.push(assetKey);
  }

  // Update CTA label based on count
  const cta = document.getElementById('st-cta');
  const count = selectedTokenKeys.length;
  if (cta) {
    if (count === 0) {
      cta.style.opacity = '0.4';
      cta.style.pointerEvents = 'none';
      cta.textContent = 'Lanjutkan';
    } else if (count === 1) {
      cta.style.opacity = '1';
      cta.style.pointerEvents = 'auto';
      cta.textContent = 'Lanjutkan';
    } else {
      cta.style.opacity = '1';
      cta.style.pointerEvents = 'auto';
      cta.textContent = `Buat Basket (${count} Aset)`;
    }
  }
}

let _basketAddMode = false;

function openSelectTokenForBasket() {
  _basketAddMode = true;
  // Pre-check already-selected assets
  const existingKeys = selectedBasketAssets.map(a => a.key);
  selectedTokenKeys = [...existingKeys];
  showScreen('screen-select-token');
  // Re-apply checked state for existing assets
  requestAnimationFrame(() => {
    document.querySelectorAll('#screen-select-token .token-row').forEach(row => {
      const onclick = row.getAttribute('onclick') || '';
      const match = onclick.match(/toggleTokenRow\(this,\s*'([^']+)'\)/);
      const key = match ? match[1] : null;
      if (key && existingKeys.includes(key)) {
        row.classList.add('selected');
        const cb = row.querySelector('.token-checkbox');
        if (cb) cb.classList.add('checked');
      }
    });
    const cta = document.getElementById('st-cta');
    if (cta && selectedTokenKeys.length > 0) {
      cta.style.opacity = '1';
      cta.style.pointerEvents = 'auto';
      cta.textContent = selectedTokenKeys.length === 1 ? 'Lanjutkan' : `Buat Basket (${selectedTokenKeys.length} Aset)`;
    }
  });
}

function confirmTokenSelection() {
  if (selectedTokenKeys.length === 0) return;

  if (_basketAddMode) {
    _basketAddMode = false;
    // Merge: add new keys not already in basket, remove deselected ones
    const newKeys = selectedTokenKeys.filter(k => !selectedBasketAssets.find(a => a.key === k));
    selectedBasketAssets = selectedBasketAssets.filter(a => selectedTokenKeys.includes(a.key));
    newKeys.forEach(k => selectedBasketAssets.push({ key: k, alloc: 0 }));
    // Redistribute allocations equally
    const alloc = Math.floor(100 / selectedBasketAssets.length);
    const remainder = 100 - alloc * selectedBasketAssets.length;
    selectedBasketAssets.forEach((a, i) => { a.alloc = alloc + (i === 0 ? remainder : 0); });
    renderBasketAssets();
    updateBasketProjection();
    showScreen('screen-setup-basket');
    return;
  }

  if (selectedTokenKeys.length === 1) {
    // Single asset → go to normal setup
    goToSetup(selectedTokenKeys[0]);
  } else {
    // Multiple assets → go to basket setup with custom selection
    goToCustomBasketSetup(selectedTokenKeys);
  }
}

function goToBasketConfirmation() {
  const minAmount = selectedBasketAssets.length * 11000;
  if (basketInputAmount < minAmount) {
    alert(currentLang === 'id' ? `Minimum investasi Rp ${formatThousands(minAmount)}` : `Minimum investment is Rp ${formatThousands(minAmount)}`);
    return;
  }
  const totalAlloc = selectedBasketAssets.reduce((s, a) => s + a.alloc, 0);
  if (totalAlloc !== 100) {
    alert(currentLang === 'id' ? `Total alokasi harus 100%. Saat ini ${totalAlloc}%.` : `Total allocation must be 100%. Currently ${totalAlloc}%.`);
    return;
  }
  const sched = scheduleLabel[selectedBasketFreq] || scheduleLabel.harian;
  const nameEl = document.getElementById('bskt-name');
  const basketName = nameEl ? nameEl.value : 'Custom Basket';

  // Store plan data for My Plans
  const freqLabel = { perjam: 'Per Jam', harian: 'Harian', mingguan: 'Mingguan', bulanan: 'Bulanan' };
  lastPlan = {
    type: 'multi',
    name: basketName,
    amount: basketInputAmount,
    freq: freqLabel[selectedBasketFreq] || 'Harian',
    basketAssets: selectedBasketAssets.slice(),
  };

  const now2 = new Date();
  const scheduledTime = String(now2.getHours()).padStart(2,'0') + ':' + String(now2.getMinutes()).padStart(2,'0');
  populateConfirmation({
    isBasket: true,
    amount: basketInputAmount,
    schedText: sched[currentLang],
    basketName,
    basketAssetsList: selectedBasketAssets,
    scheduledTime,
  });
}

// ===== Basket Data =====
const basketAssets = {
  bluechip: [
    { key: 'btc', alloc: 50 },
    { key: 'eth', alloc: 50 },
  ],
  metal: [
    { key: 'paxg', alloc: 60 },
    { key: 'slv',  alloc: 40 },
  ],
  usindex: [
    { key: 'tlt',  alloc: 50 },
    { key: 'agg',  alloc: 30 },
    { key: 'iefa', alloc: 20 },
  ],
};

let selectedBasketKey = null;
let selectedBasketAssets = []; // [{ key, alloc }]
let basketInputAmount = 0;
let selectedBasketFreq = 'harian';

function goToBasketSetup(basketKey) {
  selectedBasketKey = basketKey;
  const basket = assets[basketKey] || assets.bluechip;

  // Set name
  const nameEl = document.getElementById('bskt-name');
  if (nameEl) nameEl.value = basket.name;

  // Reset amount
  basketInputAmount = 0;
  const amtEl = document.getElementById('bskt-amount-input');
  if (amtEl) amtEl.value = '';
  const clearEl = document.getElementById('bskt-amount-clear');
  if (clearEl) clearEl.style.display = 'none';

  // Reset freq
  selectedBasketFreq = 'harian';
  ['perjam','harian','mingguan','bulanan'].forEach(f => {
    const btn = document.getElementById(`bskt-freq-${f}`);
    if (btn) btn.classList.toggle('active', f === selectedBasketFreq);
  });

  // Populate asset list
  selectedBasketAssets = (basketAssets[basketKey] || basketAssets.bluechip).map(a => ({ ...a }));
  renderBasketAssets();
  updateBasketProjection();

  // Reset nav and CTA to "create" state (in case previously set by edit mode)
  const navTitle = document.querySelector('#screen-setup-basket .nav-bar .text-body-bold');
  const backBtn  = document.querySelector('#screen-setup-basket .nav-bar .icon-btn');
  const ctaBtn   = document.getElementById('bskt-cta');
  if (navTitle) navTitle.textContent = 'Buat Jadwal Auto Invest';
  if (backBtn)  backBtn.onclick = () => showScreen('screen-landing');
  if (ctaBtn)   ctaBtn.textContent = 'Buat Jadwal Auto Invest';

  // Preset basket: lock the name input
  const nameInput = document.getElementById('bskt-name');
  const nameWrap = nameInput && nameInput.closest('.bskt-input-wrap');
  if (nameInput) {
    nameInput.disabled = true;
    nameInput.style.color = 'var(--ink-tertiary)';
  }
  if (nameWrap) nameWrap.style.background = 'var(--canvas-secondary)';

  showScreen('screen-setup-basket');
}

function goToCustomBasketSetup(keys) {
  selectedBasketKey = 'custom';
  // Equal allocation
  const alloc = Math.floor(100 / keys.length);
  const remainder = 100 - alloc * keys.length;
  selectedBasketAssets = keys.map((k, i) => ({ key: k, alloc: alloc + (i === 0 ? remainder : 0) }));

  const nameEl = document.getElementById('bskt-name');
  if (nameEl) nameEl.value = 'Custom Basket';

  basketInputAmount = 0;
  const amtEl = document.getElementById('bskt-amount-input');
  if (amtEl) amtEl.value = '';
  const clearEl = document.getElementById('bskt-amount-clear');
  if (clearEl) clearEl.style.display = 'none';

  selectedBasketFreq = 'harian';
  ['perjam','harian','mingguan','bulanan'].forEach(f => {
    const btn = document.getElementById(`bskt-freq-${f}`);
    if (btn) btn.classList.toggle('active', f === selectedBasketFreq);
  });

  renderBasketAssets();
  updateBasketProjection();

  // Custom basket: unlock the name input
  const nameInput = document.getElementById('bskt-name');
  const nameWrap = nameInput && nameInput.closest('.bskt-input-wrap');
  if (nameInput) {
    nameInput.disabled = false;
    nameInput.style.color = '';
  }
  if (nameWrap) nameWrap.style.background = '';

  // Reset nav/CTA
  const navTitle = document.querySelector('#screen-setup-basket .nav-bar .text-body-bold');
  const backBtn  = document.querySelector('#screen-setup-basket .nav-bar .icon-btn');
  const ctaBtn   = document.getElementById('bskt-cta');
  if (navTitle) navTitle.textContent = 'Buat Jadwal Auto Invest';
  if (backBtn)  backBtn.onclick = () => showScreen('screen-select-token');
  if (ctaBtn)   ctaBtn.textContent = 'Buat Jadwal Auto Invest';

  showScreen('screen-setup-basket');
}

function renderBasketAssets() {
  const list = document.getElementById('bskt-asset-list');
  if (!list) return;
  list.innerHTML = '';

  const minAmount = selectedBasketAssets.length * 11000;
  const minLabel = document.getElementById('bskt-min-label');
  if (minLabel) minLabel.innerHTML = `Minimum <strong>Rp ${formatThousands(minAmount)}</strong>`;

  const totalAlloc = selectedBasketAssets.reduce((s, a) => s + a.alloc, 0);
  const allocLabel = document.getElementById('bskt-alloc-label');
  const allocTotal = document.getElementById('bskt-alloc-total');
  if (allocTotal) allocTotal.textContent = totalAlloc;
  if (allocLabel) {
    allocLabel.style.display = totalAlloc === 100 ? 'none' : 'flex';
  }

  // Block/unblock CTA based on allocation validity
  const bsktCta = document.getElementById('bskt-cta');
  if (bsktCta) {
    const valid = totalAlloc === 100 && basketInputAmount > 0;
    bsktCta.style.opacity = valid ? '1' : '0.4';
    bsktCta.style.pointerEvents = valid ? 'auto' : 'none';
  }

  selectedBasketAssets.forEach(({ key, alloc }) => {
    const asset = assets[key];
    if (!asset) return;

    const perAmount = basketInputAmount > 0 ? Math.round(basketInputAmount * alloc / 100) : 0;
    const iconSvg = (assetIcons[key] || assetIcons.btc)
      .replace('width="40" height="40"', 'width="32" height="32"')
      .replace('viewBox="0 0 40 40"', 'viewBox="0 0 40 40"');

    const row = document.createElement('div');
    row.className = 'bskt-asset-row';
    row.innerHTML = `
      <button class="bskt-remove-btn" aria-label="Hapus ${asset.name}" onclick="removeBasketAsset('${key}')">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="var(--ink-tertiary)" stroke-width="1.5"/><path d="M6 10h8" stroke="var(--ink-tertiary)" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
      <div style="display:flex; flex:1; gap:8px; align-items:center; min-width:0;">
        <div style="flex-shrink:0; border-radius:50%; overflow:hidden; width:32px; height:32px;">${iconSvg}</div>
        <div style="flex:1; min-width:0;">
          <p class="text-body-bold truncate">${asset.name}</p>
          <p class="text-caption text-secondary">${asset.ticker}</p>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0;">
        <input
          type="text"
          inputmode="numeric"
          class="bskt-alloc-input"
          value="${alloc}%"
          style="width:64px; text-align:center; border:1px solid rgba(2,2,3,0.2); border-radius:8px; padding:8px 12px; font-size:14px; font-weight:400; color:var(--ink-primary); background:var(--canvas-primary); outline:none; font-variant-numeric:tabular-nums;"
          oninput="updateAssetAlloc('${key}', this.value)"
          onfocus="this.value=this.value.replace('%','')"
          onblur="if(!this.value||this.value==='0')this.value=this.getAttribute('data-alloc')+'%'; else if(!this.value.includes('%'))this.value=this.value+'%';"
          data-alloc="${alloc}"
        >
        <p class="text-caption text-secondary" style="font-variant-numeric:tabular-nums; text-align:right;">~${basketInputAmount > 0 ? formatThousands(perAmount) : 'Rp 0'}</p>
      </div>
    `;
    list.appendChild(row);
  });
}

function updateAssetAlloc(key, value) {
  const num = parseInt(value.replace(/[^0-9]/g, ''), 10);
  if (isNaN(num) || num <= 0 || num > 100) return;
  const idx = selectedBasketAssets.findIndex(a => a.key === key);
  if (idx === -1) return;

  selectedBasketAssets[idx].alloc = num;

  // Update just the label and CTA — don't re-render the whole list (avoids onblur cascade)
  const totalAlloc = selectedBasketAssets.reduce((s, a) => s + a.alloc, 0);
  const allocLabel = document.getElementById('bskt-alloc-label');
  const allocTotal = document.getElementById('bskt-alloc-total');
  if (allocTotal) allocTotal.textContent = totalAlloc;
  if (allocLabel) {
    allocLabel.style.display = totalAlloc === 100 ? 'none' : 'flex';
    allocLabel.style.color = 'var(--red)';
  }
  const bsktCta = document.getElementById('bskt-cta');
  if (bsktCta) {
    const valid = totalAlloc === 100 && basketInputAmount > 0;
    bsktCta.style.opacity = valid ? '1' : '0.4';
    bsktCta.style.pointerEvents = valid ? 'auto' : 'none';
  }

  // Update the IDR amount shown below this input
  const rows = document.querySelectorAll('#bskt-asset-list .bskt-asset-row');
  const inputs = document.querySelectorAll('#bskt-asset-list .bskt-alloc-input');
  inputs.forEach((inp, i) => {
    const a = selectedBasketAssets[i];
    if (!a) return;
    const perAmount = basketInputAmount > 0 ? Math.round(basketInputAmount * a.alloc / 100) : 0;
    const hint = rows[i] && rows[i].querySelector('.text-caption.text-secondary');
    if (hint) hint.textContent = `~${basketInputAmount > 0 ? formatThousands(perAmount) : 'Rp 0'}`;
  });

  updateBasketProjection();
}

function removeBasketAsset(key) {
  selectedBasketAssets = selectedBasketAssets.filter(a => a.key !== key);
  // Redistribute allocation evenly
  if (selectedBasketAssets.length > 0) {
    const base = Math.floor(100 / selectedBasketAssets.length);
    const remainder = 100 - base * selectedBasketAssets.length;
    selectedBasketAssets.forEach((a, i) => { a.alloc = base + (i === 0 ? remainder : 0); });
  }
  renderBasketAssets();
  updateBasketProjection();
}

function onBasketAmountChange(raw) {
  const digits = raw.replace(/\D/g, '');
  basketInputAmount = parseInt(digits, 10) || 0;

  const clearEl = document.getElementById('bskt-amount-clear');
  if (clearEl) clearEl.style.display = basketInputAmount > 0 ? 'flex' : 'none';

  const input = document.getElementById('bskt-amount-input');
  if (input) input.value = basketInputAmount > 0 ? formatThousands(basketInputAmount) : '';

  renderBasketAssets();
  updateBasketProjection();
}

function clearBasketAmount() {
  basketInputAmount = 0;
  const input = document.getElementById('bskt-amount-input');
  if (input) input.value = '';
  const clearEl = document.getElementById('bskt-amount-clear');
  if (clearEl) clearEl.style.display = 'none';
  renderBasketAssets();
  updateBasketProjection();
}

function selectBasketFreq(freq) {
  selectedBasketFreq = freq;
  ['perjam','harian','mingguan','bulanan'].forEach(f => {
    const btn = document.getElementById(`bskt-freq-${f}`);
    if (btn) btn.classList.toggle('active', f === freq);
  });
  updateBasketProjection();
}

function updateBasketProjection() {
  const periods = freqMultiplier[selectedBasketFreq] || 365;
  const totalCapital = basketInputAmount * periods;

  // Weighted avg return from basket assets
  let weightedReturn = 0;
  selectedBasketAssets.forEach(({ key, alloc }) => {
    const asset = assets[key];
    if (asset) weightedReturn += asset.returnPct * (alloc / 100);
  });
  if (selectedBasketAssets.length === 0) weightedReturn = 0.05;

  const projectedValue = totalCapital * (1 + weightedReturn);

  const projEl = document.getElementById('bskt-proj-value');
  const capEl = document.getElementById('bskt-proj-capital');

  if (projEl) projEl.textContent = formatIDR(projectedValue);
  if (capEl) capEl.textContent = formatIDR(totalCapital);
}

// ===== Plan Card Sparklines =====
function drawPlanSparklines() {
  document.querySelectorAll('.plan-sparkline').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = 100, H = 56;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    const pnl = parseFloat(canvas.dataset.pnl) || 10;
    let seed = parseInt(canvas.dataset.seed) || 1;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

    const pts = 14;
    const points = [];
    let val = 0;
    for (let i = 0; i <= pts; i++) {
      val += (pnl / pts) + (rand() - 0.35) * (pnl / pts) * 0.9;
      points.push(Math.max(0, val));
    }
    const maxV = Math.max(...points) || 1;
    const pad = 4;
    const chartH = H - pad * 2;

    const toX = i => (i / pts) * W;
    const toY = v => pad + chartH - (v / maxV) * chartH;

    // Green fill under line
    ctx.beginPath();
    ctx.moveTo(toX(0), H);
    points.forEach((v, i) => ctx.lineTo(toX(i), toY(v)));
    ctx.lineTo(toX(pts), H);
    ctx.closePath();
    ctx.fillStyle = 'rgba(37,167,100,0.15)';
    ctx.fill();

    // Gray baseline (invested cost) — flat line at bottom quarter
    const baseY = pad + chartH - (maxV * 0.3 / maxV) * chartH;
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    ctx.lineTo(W, baseY);
    ctx.strokeStyle = 'rgba(158,158,158,0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Green line
    ctx.beginPath();
    points.forEach((v, i) => i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v)));
    ctx.strokeStyle = '#25A764';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    // End dot
    const lastX = toX(pts), lastY = toY(points[pts]);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#25A764';
    ctx.fill();
  });
}

// ===== Init =====

// ===== Pause & Delete Sheet =====

function _openSheet(sheetId) {
  document.getElementById('sheet-overlay').style.display = '';
  document.getElementById(sheetId).style.display = '';
}

function openSheet(id) { _openSheet(id); }
function closeSheet(id) {
  document.getElementById('sheet-overlay').style.display = 'none';
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

// ===== Snackbar =====
let _snackbarTimer = null;
function showSnackbar(msg) {
  const el = document.getElementById('snackbar');
  const msgEl = document.getElementById('snackbar-msg');
  if (!el || !msgEl) return;
  msgEl.textContent = msg;
  el.style.opacity = '1';
  el.style.transform = 'translateX(-50%) translateY(0)';
  if (_snackbarTimer) clearTimeout(_snackbarTimer);
  _snackbarTimer = setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3000);
}

function closeAllSheets() {
  document.getElementById('sheet-overlay').style.display = 'none';
  ['pause-sheet','delete-sheet','alloc-info-sheet'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  // Reset states
  const p1 = document.getElementById('pause-state-1');
  const p2 = document.getElementById('pause-state-2');
  if (p1) p1.style.display = '';
  if (p2) p2.style.display = 'none';
  const d1 = document.getElementById('delete-state-1');
  const d2 = document.getElementById('delete-state-2');
  if (d1) d1.style.display = '';
  if (d2) d2.style.display = 'none';
}

function _populateSheetData(plan, valId, pctId, missId, streakId, chartId) {
  const currentVal = plan.currentValue || plan.amount;
  const totalInv   = plan.totalInvested || plan.amount;
  const pnlAmt     = plan.pnlAmt || 0;
  const pnlPct     = plan.pnlPct || 0;
  const missEst    = Math.round(totalInv * (plan.returnPct || 0.1) * 0.5);

  const valEl  = document.getElementById(valId);
  const pctEl  = document.getElementById(pctId);
  const missEl = document.getElementById(missId);
  const strEl  = document.getElementById(streakId);

  if (valEl)  valEl.textContent  = formatIDR(currentVal);
  if (pctEl)  pctEl.textContent  = `(+${pnlPct.toFixed(2).replace('.',',')}%)`;
  if (missEl) missEl.textContent = `~${formatIDR(missEst)}`;
  if (strEl)  strEl.textContent  = plan.executions || 25;

  // Draw chart — split at 60% past, 40% dashed future
  const canvas = document.getElementById(chartId);
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  // Sheet is fixed-position so parent clientWidth may be 0 — measure the sheet element itself
  const sheet = canvas.closest('[id$="-sheet"]');
  const sheetW = sheet ? sheet.getBoundingClientRect().width : (document.querySelector('.container')?.clientWidth || 390);
  const W = Math.round(sheetW - 32); // subtract 16px padding on each side
  const H = 140;
  canvas.width = W * dpr; canvas.height = H * dpr;
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const pts = 20;
  const splitAt = Math.floor(pts * 0.6);
  let seed = (plan.amount || 50000) % 999 + (plan.executions || 25);
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

  // Past: blue rising line with noise
  const pastPts = [];
  for (let i = 0; i <= splitAt; i++) {
    const t = i / pts;
    const base = t * currentVal;
    const noise = currentVal * 0.04 * (rand() - 0.5);
    pastPts.push({ x: (i / pts) * W, y: base + noise });
  }
  const maxPast = Math.max(...pastPts.map(p => p.y));

  // Future: gray dashed continuing upward
  const futurePts = [];
  const lastPastY = pastPts[pastPts.length - 1].y;
  for (let i = splitAt; i <= pts; i++) {
    const t = (i - splitAt) / (pts - splitAt);
    const proj = lastPastY + t * (currentVal * 0.2);
    const noise = currentVal * 0.03 * (rand() - 0.5);
    futurePts.push({ x: (i / pts) * W, y: proj + noise });
  }

  const maxAll = Math.max(maxPast, ...futurePts.map(p => p.y)) * 1.1;
  const pad = 16;
  const chartH = H - pad * 2;
  const toY = v => pad + chartH - (v / maxAll) * chartH;

  const pastScaled   = pastPts.map(p => ({ x: p.x, y: toY(p.y) }));
  const futureScaled = futurePts.map(p => ({ x: p.x, y: toY(p.y) }));

  // Blue fill (past)
  ctx.beginPath();
  ctx.moveTo(pastScaled[0].x, H);
  pastScaled.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pastScaled[pastScaled.length - 1].x, H);
  ctx.closePath();
  ctx.fillStyle = 'rgba(10,104,244,0.10)';
  ctx.fill();

  // Blue line (past)
  ctx.beginPath();
  pastScaled.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#0A68F4';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.setLineDash([]);
  ctx.stroke();

  // Gray fill (future)
  ctx.beginPath();
  ctx.moveTo(futureScaled[0].x, H);
  futureScaled.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(futureScaled[futureScaled.length - 1].x, H);
  ctx.closePath();
  ctx.fillStyle = 'rgba(158,158,158,0.10)';
  ctx.fill();

  // Gray dashed line (future)
  ctx.beginPath();
  futureScaled.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#9E9E9E';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Blue dot at split point
  const splitPt = pastScaled[pastScaled.length - 1];
  ctx.beginPath();
  ctx.arc(splitPt.x, splitPt.y, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#0A68F4';
  ctx.fill();

  // Gray dot at end of future
  const endPt = futureScaled[futureScaled.length - 1];
  ctx.beginPath();
  ctx.arc(endPt.x, endPt.y, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#9E9E9E';
  ctx.fill();
}

function goToEditSetup() {
  if (!_currentPlan) return;
  _isEditMode = true;
  closeAllSheets();
  const plan = _currentPlan;
  const freqKeyMap = { 'Per Jam': 'perjam', 'Harian': 'harian', 'Mingguan': 'mingguan', 'Bulanan': 'bulanan' };

  if (plan.type === 'multi') {
    // Multi-asset → go to basket setup pre-filled
    selectedBasketKey = null;
    basketInputAmount = plan.amount || 0;
    selectedBasketFreq = freqKeyMap[plan.freq] || 'harian';
    selectedBasketAssets = (plan.basketAssets && plan.basketAssets.length > 0)
      ? plan.basketAssets.map(a => ({ ...a }))
      : [];

    const nameEl = document.getElementById('bskt-name');
    if (nameEl) nameEl.value = plan.name || '';

    const amtEl = document.getElementById('bskt-amount-input');
    if (amtEl) amtEl.value = basketInputAmount > 0 ? formatThousands(basketInputAmount) : '';

    const clearEl = document.getElementById('bskt-amount-clear');
    if (clearEl) clearEl.style.display = basketInputAmount > 0 ? 'flex' : 'none';

    ['perjam','harian','mingguan','bulanan'].forEach(f => {
      document.getElementById(`bskt-freq-${f}`)?.classList.toggle('active', f === selectedBasketFreq);
    });

    renderBasketAssets();
    showScreen('screen-setup-basket');

    // Update basket screen nav for edit mode
    const titleEl = document.querySelector('#screen-setup-basket .nav-bar .text-body-bold');
    const backBtn = document.querySelector('#screen-setup-basket .nav-bar .icon-btn');
    const ctaBtn  = document.getElementById('bskt-cta');
    if (titleEl) titleEl.textContent = 'Ubah Jadwal Auto Invest';
    if (backBtn) backBtn.onclick = () => showScreen('screen-plan-detail');
    if (ctaBtn)  ctaBtn.textContent = 'Ubah Jadwal';

    // Lock name input in edit mode
    const nameInput = document.getElementById('bskt-name');
    const nameWrap = nameInput && nameInput.closest('.bskt-input-wrap');
    if (nameInput) { nameInput.disabled = true; nameInput.style.color = 'var(--ink-tertiary)'; }
    if (nameWrap)  nameWrap.style.background = 'var(--canvas-secondary)';

    requestAnimationFrame(() => updateBasketProjection());

  } else {
    // Single asset → go to single setup pre-filled
    selectedAsset = plan.assetKey || 'paxg';
    selectedFreq = freqKeyMap[plan.freq] || 'harian';
    inputAmount = plan.amount || 0;

    const asset = assets[selectedAsset] || assets.paxg;

    const assetCell = document.querySelector('#screen-setup .asset-cell');
    if (assetCell) {
      assetCell.style.pointerEvents = 'none';
      assetCell.style.opacity = '0.7';
      const nameEl = document.getElementById('setup-asset-name');
      const tickerEl = document.getElementById('setup-asset-ticker');
      const iconEl = document.getElementById('setup-asset-icon');
      if (nameEl) nameEl.textContent = asset.name;
      if (tickerEl) tickerEl.textContent = asset.ticker;
      if (iconEl && assetIcons[selectedAsset]) iconEl.innerHTML = assetIcons[selectedAsset];
    }

    const input = document.getElementById('amount-input');
    if (input) input.value = inputAmount > 0 ? formatThousands(inputAmount) : '';
    const clearBtn = document.getElementById('amount-clear');
    if (clearBtn) clearBtn.style.display = inputAmount > 0 ? 'flex' : 'none';

    ['perjam','harian','mingguan','bulanan'].forEach(f => {
      document.getElementById(`freq-${f}`)?.classList.toggle('active', f === selectedFreq);
    });

    showScreen('screen-setup');
    const titleEl = document.getElementById('setup-nav-title');
    const backBtn = document.getElementById('setup-back-btn');
    const chevron = document.getElementById('setup-asset-chevron');
    const ctaBtn  = document.getElementById('setup-cta-btn');
    if (titleEl)  titleEl.textContent = 'Ubah Jadwal Auto Invest';
    if (backBtn)  backBtn.onclick = () => showScreen('screen-plan-detail');
    if (chevron)  chevron.style.display = 'none';
    if (ctaBtn)   ctaBtn.textContent = 'Ubah Jadwal';
    requestAnimationFrame(() => updateProjection());
  }
}

function openPauseSheet() {
  closeAllSheets();
  _openSheet('pause-sheet');
  requestAnimationFrame(() => {
    _populateSheetData(_currentPlan || {amount:50000, currentValue:1254800, totalInvested:1115000, pnlAmt:139800, pnlPct:12.48, executions:25},
      'pause-current-val','pause-pnl-pct','pause-miss-val','pause-streak','pause-chart');
  });
}

function showPauseState2() {
  document.getElementById('pause-state-1').style.display = 'none';
  document.getElementById('pause-state-2').style.display = '';
}

function confirmPause() {
  _isPaused = true;
  const banner = document.getElementById('pd-paused-banner');
  if (banner) banner.style.display = '';
  closeAllSheets();
}

function openDeleteSheet() {
  closeAllSheets();
  _openSheet('delete-sheet');
  requestAnimationFrame(() => {
    _populateSheetData(_currentPlan || {amount:50000, currentValue:1254800, totalInvested:1115000, pnlAmt:139800, pnlPct:12.48, executions:25},
      'delete-current-val','delete-pnl-pct','delete-miss-val','delete-streak','delete-chart');
  });
}

function showDeleteState2() {
  document.getElementById('delete-state-1').style.display = 'none';
  document.getElementById('delete-state-2').style.display = '';
}

function confirmDelete() {
  closeAllSheets();
  showScreen('screen-myplans');
  requestAnimationFrame(() => drawPlanSparklines());
}

document.addEventListener('DOMContentLoaded', () => {
  applyLang();
  updateProjection();
  drawPlanSparklines();
  restorePlansFromStorage();

  // Initialize history so the first screen is tracked
  const activeScreen = document.querySelector('.screen.active');
  if (activeScreen) {
    history.replaceState({ screen: activeScreen.id }, '', '#' + activeScreen.id);
  }
});

// Handle browser back/forward button
window.addEventListener('popstate', (e) => {
  const screenId = e.state && e.state.screen;
  if (screenId && document.getElementById(screenId)) {
    showScreen(screenId, false);
  } else {
    // Fallback: go to landing
    showScreen('screen-landing', false);
  }
});
