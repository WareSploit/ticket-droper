/* ============================================================
   ПАКИ
   ============================================================ */
const PACKS = [
  {
    id: 'october',
    name: 'October Pack',
    emoji: '🎃',
    cards: [
      { id: 'oct-1', name: 'Лужа баг', rarity: 'common', price: 590, img: 'https://imagepaste.org/i/ennx3zf6.webp', desc: 'Осенний глюк в системе: мокрая лужа, которая отражает небо и заставляет код падать с ошибкой 404. Идеальна для промозглых вечеров и багов в продакшене.' },
      { id: 'oct-2', name: 'Первый иней', rarity: 'common', price: 690, img: 'https://imagepaste.org/i/dcrkfj93.webp', desc: 'Первое дыхание зимы на октябрьских листьях. Тонкая корочка льда, которая хрустит под ногами и напоминает, что скоро придётся доставать шапку.' },
      { id: 'oct-3', name: 'Повелитель тыкв', rarity: 'rare', price: 4900, img: 'https://imagepaste.org/i/rn5tqrsf.webp', desc: 'Он не просто собирает тыквы — он ими правит. Редкая карточка октября: корона из листьев, армия из тыкв и взгляд, от которого даже Хэллоуин замирает в уважении.' },
      { id: 'oct-4', name: 'Оранжевый листопад', rarity: 'common', price: 550, img: 'https://imagepaste.org/i/fz4anjsd.webp', desc: 'Миллион оранжевых листьев, кружащихся в воздухе. Классика октября: шуршание под ногами, тёплый свет и ощущение, что мир ненадолго стал мягче.' },
      { id: 'oct-5', name: 'Костюм своими лапами', rarity: 'uncommon', price: 2200, img: 'https://imagepaste.org/i/b8m96pq6.webp', desc: 'Когда до Хэллоуина два дня, а магазин закрыт — включается режим «сделай сам». Немного ткани, нитки, терпение и вот ты уже выглядишь как настоящий монстр.' },
      { id: 'oct-6', name: 'Тыква с кодом', rarity: 'uncommon', price: 2600, img: 'https://imagepaste.org/i/scgs8z95.webp', desc: 'Тыква, внутри которой растёт не мякоть, а настоящий код. Каждый вырезанный символ — строка в главном скрипте Хэллоуина. Работает, если верить в магию компиляции.' },
      { id: 'oct-7', name: 'Первый урок', rarity: 'common', price: 750, img: 'https://imagepaste.org/i/fjj889g5.webp', desc: 'Первый учебный день осени. Волнение, тетради, запах новых книг и лёгкое ощущение, что впереди — целая жизнь. С этого всё начинается.' },
    ],
  },
  {
    id: 'week',
    name: 'Easy-Week Pack',
    emoji: '📅',
    cards: [
      { id: 'week-1', name: 'Утро понедельника', rarity: 'common', price: 490, img: 'https://imagepaste.org/i/ha6u4bkb.webp', desc: 'Самое сложное утро недели. Будильник орёт, одеяло держит, а кофе ещё не сварен. Но ты справишься — впереди целая неделя приключений.' },
      { id: 'week-2', name: 'Первый кофе', rarity: 'common', price: 590, img: 'https://imagepaste.org/i/hs944crw.webp', desc: 'Магический напиток, который превращает зомби в человека. Тёплый, бодрящий и абсолютно необходимый для старта продуктивной недели.' },
      { id: 'week-3', name: 'Попытка войти', rarity: 'common', price: 690, img: 'https://imagepaste.org/i/yr89xde8.webp', desc: 'Утро вторника, кружка кофе, ноутбук — и тут бац! «Забыли пароль?». Классика рабочей недели, знакомая каждому разработчику.' },
      { id: 'week-4', name: 'Баги повсюду', rarity: 'uncommon', price: 1900, img: 'https://imagepaste.org/i/rvzd2552.webp', desc: 'Среда — день, когда всё сломалось. Ты чинишь один баг, а появляется три. Но именно в таких битвах рождается настоящий разработчик.' },
      { id: 'week-5', name: 'Финальный рывок', rarity: 'rare', price: 4200, img: 'https://imagepaste.org/i/5rz5vfhr.webp', desc: 'Четверг. Последний шанс успеть до дедлайна. Кофе кончился, за окном темно, но ты в потоке. Редкая карточка для тех, кто доходит до конца.' },
      { id: 'week-6', name: 'Поиск решения', rarity: 'uncommon', price: 2100, img: 'https://imagepaste.org/i/fbd4v44j.webp', desc: 'Пятница, 17:58. Документация открыта, Stack Overflow в соседней вкладке, а ты уже в шаге от решения. Ещё чуть-чуть — и победишь.' },
      { id: 'week-7', name: 'Победа над кодом', rarity: 'epic', price: 7500, img: 'https://imagepaste.org/i/e9z4nytz.webp', desc: 'Оно закомпилировалось. Без ошибок. С первого раза. Легендарный момент, ради которого стоит жить. Эпическая карточка недели — достойная награда за терпение.' },
    ],
  },
];

const ALL_CARDS = PACKS.flatMap(p => p.cards);

/* ============================================================
   ЗАДАНИЯ
   ============================================================ */
const TASKS = [
  { id: 'task-clicks-10',  name: 'Разминка',           desc: 'Сделай 10 кликов по монете',      type: 'clicks',      target: 10,   reward: 1 },
  { id: 'task-clicks-50',  name: 'Кликер',             desc: 'Сделай 50 кликов',                type: 'clicks',      target: 50,   reward: 2 },
  { id: 'task-clicks-200', name: 'Мастер клика',       desc: 'Сделай 200 кликов',               type: 'clicks',      target: 200,  reward: 5 },
  { id: 'task-em-500',     name: 'Первая тысяча',      desc: 'Заработай 500 EM',                type: 'totalEarned', target: 500,  reward: 2 },
  { id: 'task-em-2000',    name: 'Богач',              desc: 'Заработай 2000 EM',               type: 'totalEarned', target: 2000, reward: 4 },
  { id: 'task-open-1',     name: 'Первый бокс',        desc: 'Открой 1 бокс',                   type: 'openBoxes',   target: 1,    reward: 2 },
  { id: 'task-open-3',     name: 'Разогрев',           desc: 'Открой 3 бокса',                  type: 'openBoxes',   target: 3,    reward: 3 },
  { id: 'task-open-7',     name: 'Коллекционер',       desc: 'Открой 7 боксов',                 type: 'openBoxes',   target: 7,    reward: 5 },
  { id: 'task-collect-5',  name: 'Пять карточек',      desc: 'Собери 5 карточек',               type: 'collected',   target: 5,    reward: 3 },
  { id: 'task-collect-10', name: 'Десятка',            desc: 'Собери 10 карточек',              type: 'collected',   target: 10,   reward: 6 },
];

/* ============================================================
   АПГРЕЙДЫ
   ============================================================ */
const UPGRADES = [
  { id: 'upg-click',   name: 'Усиленный клик',   desc: '+1 EM за каждый клик по монете',       price: 300,  effect: 'clickBonus' },
  { id: 'upg-ticket',  name: 'Бонус билетов',    desc: '+1 билет к каждой награде за задание', price: 600,  effect: 'ticketBonus' },
  { id: 'upg-rare',    name: 'Шанс редкой',      desc: '+5% к шансу выпадения rare и epic',    price: 1200, effect: 'rareBoost' },
  { id: 'upg-click-2', name: 'Усиленный клик II', desc: 'Ещё +2 EM за каждый клик',            price: 1500, effect: 'clickBonus' },
  { id: 'upg-rare-2',  name: 'Шанс редкой II',   desc: 'Ещё +5% к шансу rare и epic',          price: 2500, effect: 'rareBoost' },
];