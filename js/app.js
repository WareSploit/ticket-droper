/* ============================================================
   EASYSHOP — APP v3
   ============================================================ */

const saved = Storage.load();

const state = {
  tickets:        saved ? saved.tickets : CONFIG.START_TICKETS,
  em:             saved ? saved.em : 0,
  totalEarned:    saved ? saved.totalEarned : 0,
  clicks:         saved ? saved.clicks : 0,
  clicksToTicket: saved ? saved.clicksToTicket : 0,
  openedIds:      saved ? saved.openedIds : new Set(),
  completedTasks: saved ? saved.completedTasks : new Set(),
  boughtUpgrades: saved ? saved.boughtUpgrades : new Set(),
  history:        saved ? saved.history : [],
};

const persist = () => Storage.save(state);

/* ---------- Утилиты ---------- */
const fmt = n => n.toLocaleString('ru-RU');
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

/* ---------- Звуки ---------- */
const sfx = {
  click:       document.getElementById('sfxClick'),
  hit:         document.getElementById('sfxHit'),
  achievement: document.getElementById('sfxAchievement'),
  upgrade:     document.getElementById('sfxUpgrade'),
};

function playSfx(name) {
  const audio = sfx[name];
  if (!audio) return;
  audio.currentTime = 0;
  audio.volume = 0.4;
  audio.play().catch(() => {});
}

/* ---------- DOM ---------- */
const ticketsVal = document.getElementById('ticketsVal');
const emVal = document.getElementById('emVal');
const ticketsBox = document.getElementById('ticketsBox');
const emBox = document.getElementById('emBox');
const gridOctober = document.getElementById('grid-october');
const gridWeek = document.getElementById('grid-week');
const gridCollection = document.getElementById('grid-collection');
const tasksList = document.getElementById('tasksList');
const upgradesList = document.getElementById('upgradesList');
const collectionFilters = document.getElementById('collectionFilters');
const toastsEl = document.getElementById('toasts');

/* ============================================================
   БАЛАНС
   ============================================================ */
function updateBalanceUI() {
  ticketsVal.textContent = fmt(state.tickets);
  emVal.textContent = fmt(state.em);

  ticketsBox.classList.remove('bump');
  emBox.classList.remove('bump');
  void ticketsBox.offsetWidth;
  ticketsBox.classList.add('bump');
  emBox.classList.add('bump');
}

/* ============================================================
   ЧАСТИЦЫ
   ============================================================ */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function spawnParticles(x, y, count = 40) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 8;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      size: 2 + Math.random() * 4,
      color: ['#4f8cff', '#22d3ee', '#7c5cff', '#fbbf24'][Math.floor(Math.random() * 4)],
    });
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.life > 0);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.vx *= 0.98;
    p.life -= 0.02;

    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ============================================================
   ТОСТЫ
   ============================================================ */
function showToast(icon, title, desc) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast__icon">${icon}</div>
    <div>
      <div class="toast__title">${title}</div>
      <div class="toast__desc">${desc}</div>
    </div>
  `;
  toastsEl.appendChild(toast);

  playSfx('achievement');

  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ============================================================
   РЕНДЕР СЕТКИ ПАКА
   ============================================================ */
function renderPackGrid(packId, container) {
  const pack = PACKS.find(p => p.id === packId);
  container.innerHTML = '';

  pack.cards.forEach(card => {
    const isOpened = state.openedIds.has(card.id);

    const el = document.createElement('div');
    el.className = 'card' + (isOpened ? ' opened' : '');
    el.dataset.rarity = card.rarity;

    const rarityLabel = { common: 'Обычная', uncommon: 'Необычная', rare: 'Редкая', epic: 'Эпическая' }[card.rarity];

    el.innerHTML = `
      <div class="card__media">
        <img class="card__img" src="${card.img}" alt="${card.name}" loading="lazy">
        <div class="card__placeholder">
          <div class="card__qmark">?</div>
          <div class="card__status">${isOpened ? 'Открыта' : 'Закрыта'}</div>
        </div>
      </div>
      <div class="card__rarity-badge card__rarity-badge--${card.rarity}">${rarityLabel}</div>
      <div class="card__info">
        <div class="card__name">${isOpened ? card.name : '???'}</div>
        <div class="card__price">${isOpened ? fmt(card.price) + ' EM' : '??? EM'}</div>
      </div>
    `;

    el.addEventListener('click', () => {
      if (state.openedIds.has(card.id)) {
        openCardModal(card);
      } else {
        showToast('🔒', 'Карточка закрыта', 'Открой бокс, чтобы её получить');
      }
    });

    container.appendChild(el);
  });
}

/* ============================================================
   КОЛЛЕКЦИЯ
   ============================================================ */
let collectionFilter = 'all';

function renderCollectionFilters() {
  collectionFilters.innerHTML = '';
  const filters = [
    { id: 'all', label: 'Все' },
    ...PACKS.map(p => ({ id: p.id, label: `${p.emoji} ${p.name}` })),
  ];

  filters.forEach(f => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (collectionFilter === f.id ? ' active' : '');
    btn.textContent = f.label;
    btn.addEventListener('click', () => {
      collectionFilter = f.id;
      renderCollectionFilters();
      renderCollection();
    });
    collectionFilters.appendChild(btn);
  });
}

function renderCollection() {
  gridCollection.innerHTML = '';

  let cards = ALL_CARDS;
  if (collectionFilter !== 'all') {
    const pack = PACKS.find(p => p.id === collectionFilter);
    cards = pack ? pack.cards : [];
  }

  cards.forEach(card => {
    const isOpened = state.openedIds.has(card.id);

    const el = document.createElement('div');
    el.className = 'card' + (isOpened ? ' opened' : '');
    el.dataset.rarity = card.rarity;

    const rarityLabel = { common: 'Обычная', uncommon: 'Необычная', rare: 'Редкая', epic: 'Эпическая' }[card.rarity];

    el.innerHTML = `
      <div class="card__media">
        <img class="card__img" src="${card.img}" alt="${card.name}" loading="lazy">
        <div class="card__placeholder">
          <div class="card__qmark">?</div>
          <div class="card__status">${isOpened ? 'Открыта' : 'Закрыта'}</div>
        </div>
      </div>
      <div class="card__rarity-badge card__rarity-badge--${card.rarity}">${rarityLabel}</div>
      <div class="card__info">
        <div class="card__name">${isOpened ? card.name : '???'}</div>
        <div class="card__price">${isOpened ? fmt(card.price) + ' EM' : '??? EM'}</div>
      </div>
    `;

    el.addEventListener('click', () => {
      if (state.openedIds.has(card.id)) {
        openCardModal(card);
      } else {
        showToast('🔒', 'Карточка закрыта', 'Открой бокс, чтобы её получить');
      }
    });

    gridCollection.appendChild(el);
  });
}

/* ============================================================
   ОТКРЫТИЕ БОКСА
   ============================================================ */
function tryOpenBox(packId) {
  if (state.tickets < CONFIG.BOX_COST_TICKETS) {
    showToast('🎟️', 'Мало билетов', `Нужно ${CONFIG.BOX_COST_TICKETS} билета. Покликай монету или выполни задания!`);
    return;
  }

  const pack = PACKS.find(p => p.id === packId);
  const available = pack.cards.filter(c => !state.openedIds.has(c.id));

  if (available.length === 0) {
    showToast('📦', 'Всё собрано!', 'В этом паке больше нет карточек');
    return;
  }

  state.tickets -= CONFIG.BOX_COST_TICKETS;

  // Шансы
  const rareBoost = (state.boughtUpgrades.has('upg-rare') ? CONFIG.RARE_BOOST_PER_LEVEL : 0)
                  + (state.boughtUpgrades.has('upg-rare-2') ? CONFIG.RARE_BOOST_PER_LEVEL : 0);

  const chances = { ...CONFIG.DROP_CHANCES };
  if (rareBoost > 0) {
    chances.common = Math.max(5, chances.common - rareBoost);
    chances.rare += rareBoost / 2;
    chances.epic += rareBoost / 2;
  }

  const totalWeight = Object.values(chances).reduce((a, b) => a + b, 0);
  let roll = Math.random() * totalWeight;
  let chosenRarity = 'common';

  for (const [rarity, weight] of Object.entries(chances)) {
    roll -= weight;
    if (roll <= 0) { chosenRarity = rarity; break; }
  }

  let pool = available.filter(c => c.rarity === chosenRarity);
  if (pool.length === 0) pool = available;

  const card = pool[Math.floor(Math.random() * pool.length)];

  state.openedIds.add(card.id);

  const emReward = CONFIG.EM_REWARD[card.rarity] || 50;
  state.em += emReward;
  state.totalEarned += emReward;
  state.history.unshift({ name: 'Открыто: ' + card.name, amount: emReward, time: Date.now() });
  state.history = state.history.slice(0, 50);

  updateBalanceUI();
  persist();

  // Анимация + звук + частицы
  playSfx('hit');
  const btn = packId === 'october' ? document.getElementById('openOctober') : document.getElementById('openWeek');
  const rect = btn.getBoundingClientRect();
  spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);

  renderPackGrid('october', gridOctober);
  renderPackGrid('week', gridWeek);
  renderCollection();
  renderTasks();
  updateClickerUI();

  showDropModal(card);
}

/* ============================================================
   МОДАЛКА ВЫПАВШЕЙ КАРТОЧКИ
   ============================================================ */
const dropModal = document.getElementById('dropModal');
const dImg = document.getElementById('dImg');
const dName = document.getElementById('dName');
const dRarity = document.getElementById('dRarity');

function showDropModal(card) {
  dImg.src = card.img;
  dImg.alt = card.name;
  dName.textContent = card.name;

  const rarityLabels = { common: 'Обычная', uncommon: 'Необычная', rare: 'Редкая', epic: 'Эпическая' };
  const rarityColors = { common: '#b8c4dd', uncommon: '#7dffab', rare: '#8db6ff', epic: '#c4b1ff' };
  dRarity.textContent = rarityLabels[card.rarity];
  dRarity.style.color = rarityColors[card.rarity];

  dropModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDropModal() {
  dropModal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ============================================================
   МОДАЛКА КАРТОЧКИ
   ============================================================ */
const modal = document.getElementById('modal');
const mImg = document.getElementById('mImg');
const mTag = document.getElementById('mTag');
const mTitle = document.getElementById('mTitle');
const mDesc = document.getElementById('mDesc');
const mPrice = document.getElementById('mPrice');

function openCardModal(card) {
  mImg.src = card.img;
  mImg.alt = card.name;
  mTag.textContent = card.rarity.toUpperCase();
  mTitle.textContent = card.name;
  mDesc.textContent = card.desc;
  mPrice.textContent = fmt(card.price) + ' EM';

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCardModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  if (e.target.hasAttribute('data-close')) {
    closeCardModal();
    closeDropModal();
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeCardModal(); closeDropModal(); }
});

/* ============================================================
   ЗАДАНИЯ
   ============================================================ */
function getTaskProgress(task) {
  switch (task.type) {
    case 'openBoxes':   return state.openedIds.size;
    case 'clicks':      return state.clicks;
    case 'collected':   return state.openedIds.size;
    case 'totalEarned': return state.totalEarned;
    default:            return 0;
  }
}

function renderTasks() {
  tasksList.innerHTML = '';

  TASKS.forEach(task => {
    const isCompleted = state.completedTasks.has(task.id);
    const progress = Math.min(getTaskProgress(task), task.target);
    const canComplete = progress >= task.target && !isCompleted;

    const el = document.createElement('div');
    el.className = 'task' + (isCompleted ? ' done' : '');
    el.innerHTML = `
      <div class="task__info">
        <div class="task__name">${task.name}</div>
        <div class="task__desc">${task.desc}</div>
        <div class="task__progress">${progress} / ${task.target}</div>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <div class="task__reward">+${task.reward} 🎟️</div>
        <button class="task__btn" ${isCompleted || !canComplete ? 'disabled' : ''}>
          ${isCompleted ? '✓ Готово' : canComplete ? 'Забрать' : 'В процессе'}
        </button>
      </div>
    `;

    const btn = el.querySelector('.task__btn');
    if (!isCompleted && canComplete) {
      btn.addEventListener('click', () => {
        state.completedTasks.add(task.id);
        const bonus = state.boughtUpgrades.has('upg-ticket') ? 1 : 0;
        state.tickets += task.reward + bonus;
        updateBalanceUI();
        updateClickerUI();
        playSfx('upgrade');
        showToast('🎟️', 'Задание выполнено!', `+${task.reward + bonus} билетов`);
        renderTasks();
        persist();
      });
    }

    tasksList.appendChild(el);
  });
}

/* ============================================================
   АПГРЕЙДЫ
   ============================================================ */
function renderUpgrades() {
  upgradesList.innerHTML = '';

  UPGRADES.forEach(upg => {
    const isBought = state.boughtUpgrades.has(upg.id);
    const canBuy = state.em >= upg.price && !isBought;

    const el = document.createElement('div');
    el.className = 'upgrade' + (isBought ? ' bought' : '');
    el.innerHTML = `
      <div class="upgrade__info">
        <div class="upgrade__name">${upg.name}</div>
        <div class="upgrade__desc">${upg.desc}</div>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <div class="upgrade__price">${fmt(upg.price)} EM</div>
        <button class="upgrade__btn" ${!canBuy ? 'disabled' : ''}>
          ${isBought ? '✓ Куплено' : 'Купить'}
        </button>
      </div>
    `;

    const btn = el.querySelector('.upgrade__btn');
    if (canBuy) {
      btn.addEventListener('click', () => {
        state.em -= upg.price;
        state.boughtUpgrades.add(upg.id);
        state.history.unshift({ name: 'Апгрейд: ' + upg.name, amount: -upg.price, time: Date.now() });
        updateBalanceUI();
        playSfx('upgrade');
        showToast('⚡', 'Апгрейд куплен!', upg.name);
        renderUpgrades();
        updateClickerUI();
        persist();
      });
    }

    upgradesList.appendChild(el);
  });
}

/* ============================================================
   КЛИКЕР
   ============================================================ */
const coin = document.getElementById('coin');
const clicker = document.querySelector('.clicker');
const clicksVal = document.getElementById('clicksVal');
const toTicketVal = document.getElementById('toTicketVal');
const earnedVal = document.getElementById('earnedVal');
const moneyVal = document.getElementById('moneyVal');
const ticketsVal2 = document.getElementById('ticketsVal2');

function updateClickerUI() {
  clicksVal.textContent = fmt(state.clicks);
  earnedVal.textContent = fmt(state.totalEarned) + ' EM';
  moneyVal.textContent = fmt(state.em);
  ticketsVal2.textContent = fmt(state.tickets);

  const left = CONFIG.CLICKER.clicksPerTicket - state.clicksToTicket;
  toTicketVal.textContent = left;
}

let clicksSinceSave = 0;

coin.addEventListener('click', () => {
  let earn = CONFIG.CLICKER.emPerClick;
  if (state.boughtUpgrades.has('upg-click')) earn += 1;
  if (state.boughtUpgrades.has('upg-click-2')) earn += 2;

  state.em += earn;
  state.totalEarned += earn;
  state.clicks += 1;
  state.clicksToTicket += 1;
  clicksSinceSave += 1;

  let gotTicket = false;
  if (state.clicksToTicket >= CONFIG.CLICKER.clicksPerTicket) {
    state.tickets += 1;
    state.clicksToTicket = 0;
    gotTicket = true;
  }

  updateBalanceUI();
  updateClickerUI();

  coin.classList.remove('clicked');
  void coin.offsetWidth;
  coin.classList.add('clicked');

  const pop = document.createElement('div');
  pop.className = 'coin-pop';
  pop.textContent = `+${earn} EM`;
  const rect = coin.getBoundingClientRect();
  const parentRect = clicker.getBoundingClientRect();
  pop.style.left = (rect.left - parentRect.left + rect.width / 2) + 'px';
  pop.style.top  = (rect.top  - parentRect.top  + rect.height * 0.3) + 'px';
  clicker.appendChild(pop);
  setTimeout(() => pop.remove(), 900);

  playSfx('click');

  if (gotTicket) {
    playSfx('achievement');
    showToast('🎟️', 'Билет получен!', `Всего: ${state.tickets} билетов`);
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
  }

  if (clicksSinceSave >= 10) {
    state.history.unshift({ name: 'Кликер', amount: earn, time: Date.now() });
    state.history = state.history.slice(0, 50);
    renderHistory();
    persist();
    clicksSinceSave = 0;
  }
});

/* ============================================================
   ИСТОРИЯ
   ============================================================ */
const historyEl = document.getElementById('history');

function renderHistory() {
  if (state.history.length === 0) {
    historyEl.innerHTML = `<div class="empty" style="padding:32px;text-align:center;color:var(--muted);font-size:13px;background:rgba(11,16,32,0.5);border:1px dashed var(--border);border-radius:12px;">Пусто. Покликай монету или открой бокс 🪙</div>`;
    return;
  }

  historyEl.innerHTML = state.history.slice(0, 40).map(h => `
    <div class="history-item">
      <div>
        <span class="history-item__name">${h.name}</span>
        <span class="history-item__time">${new Date(h.time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="history-item__amount ${h.amount < 0 ? 'neg' : ''}">
        ${h.amount > 0 ? '+' : ''}${h.amount} EM
      </div>
    </div>
  `).join('');
}

/* ============================================================
   НАВИГАЦИЯ
   ============================================================ */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + tab.dataset.view).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tab.dataset.view === 'collection') renderCollection();
    if (tab.dataset.view === 'tasks') renderTasks();
    if (tab.dataset.view === 'upgrades') renderUpgrades();
  });
});

/* ============================================================
   КНОПКИ ОТКРЫТИЯ
   ============================================================ */
document.getElementById('openOctober').addEventListener('click', () => tryOpenBox('october'));
document.getElementById('openWeek').addEventListener('click', () => tryOpenBox('week'));

/* ============================================================
   INIT
   ============================================================ */
updateBalanceUI();
updateClickerUI();
renderPackGrid('october', gridOctober);
renderPackGrid('week', gridWeek);
renderCollectionFilters();
renderCollection();
renderTasks();
renderUpgrades();
renderHistory();

if (!saved) {
  setTimeout(() => {
    showToast('🎁', 'Добро пожаловать!', `Тебе выдано ${CONFIG.START_TICKETS} билета — открой первый бокс!`);
  }, 700);
}

console.log('🎃 EasyShop v3 ready');