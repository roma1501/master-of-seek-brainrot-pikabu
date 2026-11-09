// GameBrainrots.js — данные брейнротов «Master of Seek Brainrot»: 15 видов Брейндекса (brainrot-01 … brainrot-15).
// Модели и портреты — контракт с арт-агентом: assets/models/brainrots/<id>.glb (клипы idle, run, caught) и
// assets/ui/brainrots/<id>.webp. Нет файла — игра рисует запасной вид и силуэт-заглушку, не падает.
// Имена и редкость — по docs/RESKIN-ART.md (если арт-агент записал свои — править таблицу ниже).
// Пути ассетов — литералами (сборщик берёт в архив только их). Числа экономики — здесь же (данные игры).

/**
 * Редкость → экономика: catch — монеты за поимку, first — бонус за первую поимку вида, income — пассивный
 * доход Брейндекса за раунд с каждого открытого вида, weight — шанс вида попасть на карту.
 */
const HS_BRAINROT_RARITY = {
    common: { catch: 10, first: 30, income: 2, weight: 10 },
    rare: { catch: 16, first: 70, income: 4, weight: 6 },
    epic: { catch: 26, first: 140, income: 8, weight: 3 },
    legendary: { catch: 42, first: 280, income: 15, weight: 1.3 },
    mythic: { catch: 70, first: 600, income: 30, weight: 0.6 },
};

/**
 * Вид брейнрота. Поведение (множители к базе GameAI):
 *   speed — скорость бега, alert — с какого расстояния (px) замечает искателя и бежит, dash — частота рывков
 *   (0..1), hide — тяга к укрытиям (0..1), mimic — шанс стать предметом (0..1), twitch — как часто выдаёт себя
 *   дрожью, пока стоит мимиком (0..1), dodge — шанс увернуться от сачка рывком (0..1).
 * @typedef {{ id: string, num: number, model: string, portrait: string, name: { ru: string, en: string }, rarity: string, color: string,
 *   trait: { ru: string, en: string }, speed: number, alert: number, dash: number, hide: number, mimic: number, twitch: number, dodge?: number }} BrainrotDef
 */
/** @type {BrainrotDef[]} */
const HS_BRAINROTS = [
    { id: 'brainrot-01', num: 1, model: 'assets/models/brainrots/brainrot-01.glb', portrait: 'assets/ui/brainrots/brainrot-01.webp', name: { ru: 'Гранкио Тостарелло', en: 'Granchio Tostarello' }, rarity: 'common', color: '#f2a65a', trait: { ru: 'Робкий: прячется в укрытиях', en: 'Shy: hides in cover' }, speed: 0.92, alert: 300, dash: 0.1, hide: 0.9, mimic: 0.35, twitch: 0.6 },
    { id: 'brainrot-02', num: 2, model: 'assets/models/brainrots/brainrot-02.glb', portrait: 'assets/ui/brainrots/brainrot-02.webp', name: { ru: 'Тейерина Полпетта', en: 'Teierina Polpetta' }, rarity: 'common', color: '#7ccf8b', trait: { ru: 'Любит притворяться предметом', en: 'Loves to pose as an object' }, speed: 0.95, alert: 260, dash: 0.1, hide: 0.5, mimic: 0.8, twitch: 0.7 },
    { id: 'brainrot-03', num: 3, model: 'assets/models/brainrots/brainrot-03.glb', portrait: 'assets/ui/brainrots/brainrot-03.webp', name: { ru: 'Риччо Маффино', en: 'Riccio Muffino' }, rarity: 'common', color: '#6fb7e8', trait: { ru: 'Бегает кругами', en: 'Runs in circles' }, speed: 1.0, alert: 320, dash: 0.2, hide: 0.4, mimic: 0.3, twitch: 0.5 },
    { id: 'brainrot-04', num: 4, model: 'assets/models/brainrots/brainrot-04.glb', portrait: 'assets/ui/brainrots/brainrot-04.webp', name: { ru: 'Лумаконе Дискотто', en: 'Lumacone Discotto' }, rarity: 'common', color: '#e87b9c', trait: { ru: 'Медленный, но хитрый', en: 'Slow but sly' }, speed: 0.86, alert: 240, dash: 0.05, hide: 0.7, mimic: 0.6, twitch: 0.4 },
    { id: 'brainrot-05', num: 5, model: 'assets/models/brainrots/brainrot-05.glb', portrait: 'assets/ui/brainrots/brainrot-05.webp', name: { ru: 'Бассотто Идранте', en: 'Bassotto Idrante' }, rarity: 'common', color: '#c9b458', trait: { ru: 'Пугливый: бежит заранее', en: 'Jumpy: runs early' }, speed: 1.02, alert: 420, dash: 0.2, hide: 0.5, mimic: 0.2, twitch: 0.5 },
    { id: 'brainrot-06', num: 6, model: 'assets/models/brainrots/brainrot-06.glb', portrait: 'assets/ui/brainrots/brainrot-06.webp', name: { ru: 'Скарподрилло Коррентино', en: 'Scarpodrillo Correntino' }, rarity: 'rare', color: '#8f7be0', trait: { ru: 'Проворный бегун', en: 'Nimble runner' }, speed: 1.1, alert: 340, dash: 0.35, hide: 0.4, mimic: 0.3, twitch: 0.4 },
    { id: 'brainrot-07', num: 7, model: 'assets/models/brainrots/brainrot-07.glb', portrait: 'assets/ui/brainrots/brainrot-07.webp', name: { ru: 'Жираффина Лампадина', en: 'Giraffina Lampadina' }, rarity: 'rare', color: '#4fc1b0', trait: { ru: 'Мастер маскировки', en: 'Master of disguise' }, speed: 0.98, alert: 280, dash: 0.1, hide: 0.6, mimic: 0.9, twitch: 0.25 },
    { id: 'brainrot-08', num: 8, model: 'assets/models/brainrots/brainrot-08.glb', portrait: 'assets/ui/brainrots/brainrot-08.webp', name: { ru: 'Лаватриче Иппопотамо', en: 'Lavatrice Ippopotamo' }, rarity: 'rare', color: '#e8845a', trait: { ru: 'Делает рывки при погоне', en: 'Dashes when chased' }, speed: 1.05, alert: 360, dash: 0.6, hide: 0.3, mimic: 0.2, twitch: 0.4 },
    { id: 'brainrot-09', num: 9, model: 'assets/models/brainrots/brainrot-09.glb', portrait: 'assets/ui/brainrots/brainrot-09.webp', name: { ru: 'Гуфо Постино', en: 'Gufo Postino' }, rarity: 'rare', color: '#b8d45e', trait: { ru: 'Сидит тихо, не выдаёт себя', en: 'Sits quiet and never gives itself away' }, speed: 0.95, alert: 220, dash: 0.1, hide: 1.0, mimic: 0.5, twitch: 0.2 },
    { id: 'brainrot-10', num: 10, model: 'assets/models/brainrots/brainrot-10.glb', portrait: 'assets/ui/brainrots/brainrot-10.webp', name: { ru: 'Бруко Фисармоника', en: 'Bruco Fisarmonica' }, rarity: 'epic', color: '#d86bd0', trait: { ru: 'Быстрый и осторожный', en: 'Fast and careful' }, speed: 1.15, alert: 460, dash: 0.5, hide: 0.5, mimic: 0.4, twitch: 0.3 },
    { id: 'brainrot-11', num: 11, model: 'assets/models/brainrots/brainrot-11.glb', portrait: 'assets/ui/brainrots/brainrot-11.webp', name: { ru: 'Галло Свельоне', en: 'Gallo Sveglione' }, rarity: 'epic', color: '#59a5f5', trait: { ru: 'Почти не дрожит в маскировке', en: 'Barely twitches in disguise' }, speed: 1.0, alert: 300, dash: 0.2, hide: 0.6, mimic: 0.95, twitch: 0.1 },
    { id: 'brainrot-12', num: 12, model: 'assets/models/brainrots/brainrot-12.glb', portrait: 'assets/ui/brainrots/brainrot-12.webp', name: { ru: 'Омбреллоне Феникоттеро', en: 'Ombrellone Fenicottero' }, rarity: 'epic', color: '#f06a6a', trait: { ru: 'Удирает рывками', en: 'Bolts away in dashes' }, speed: 1.12, alert: 400, dash: 0.8, hide: 0.3, mimic: 0.2, twitch: 0.4 },
    { id: 'brainrot-13', num: 13, model: 'assets/models/brainrots/brainrot-13.glb', portrait: 'assets/ui/brainrots/brainrot-13.webp', name: { ru: 'Медуза Монгольфьера', en: 'Medusa Mongolfiera' }, rarity: 'legendary', color: '#ffc13d', trait: { ru: 'Чует сачок и уворачивается', en: 'Senses the net and dodges' }, speed: 1.2, alert: 520, dash: 0.7, hide: 0.4, mimic: 0.3, twitch: 0.2, dodge: 0.5 },
    { id: 'brainrot-14', num: 14, model: 'assets/models/brainrots/brainrot-14.glb', portrait: 'assets/ui/brainrots/brainrot-14.webp', name: { ru: 'Павоне Граммофоно', en: 'Pavone Grammofono' }, rarity: 'legendary', color: '#5de0e6', trait: { ru: 'Идеальный мимик', en: 'The perfect mimic' }, speed: 1.1, alert: 380, dash: 0.4, hide: 0.5, mimic: 1.0, twitch: 0.05 },
    { id: 'brainrot-15', num: 15, model: 'assets/models/brainrots/brainrot-15.glb', portrait: 'assets/ui/brainrots/brainrot-15.webp', name: { ru: 'Фениче Фрулляторе', en: 'Fenice Frullatore' }, rarity: 'mythic', color: '#ff5d8f', trait: { ru: 'Самый скользкий из всех', en: 'The slipperiest of all' }, speed: 1.28, alert: 560, dash: 0.9, hide: 0.5, mimic: 0.6, twitch: 0.1, dodge: 0.35 },
];

/** @param {string} id @returns {BrainrotDef | null} */
function hsBrainrot(id) { return HS_BRAINROTS.find(b => b.id === id) || null; }

/** Экономика редкости вида. @param {string} rarity */
function hsBrainrotEco(rarity) { return HS_BRAINROT_RARITY[rarity] || HS_BRAINROT_RARITY.common; }
