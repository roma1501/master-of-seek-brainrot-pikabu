// GameData.js — данные игры «Master of Seek Brainrot»: карты-темы, усиления, редкость, награды. Брейнроты — GameBrainrots.js.
// Пути ассетов — литералами (сборщик берёт в архив только их). Числа правил — в Constants.js (блок HS_*).

/** @typedef {{ ru: string, en: string }} LocText */
/** @typedef {'common' | 'rare' | 'epic' | 'legendary' | 'mythic'} Rarity */

/**
 * Карты по порядку прохождения. id — карта в Maps.js; нет такой карты (арт-агент переименовал) — берётся
 * карта с тем же номером по порядку (Game.mapId). color — цвет темы (UI), sky — небо, night — ночное освещение.
 */
const HS_MAPS = [
    { id: 'market', name: { ru: 'Заброшенный супермаркет', en: 'Abandoned Supermarket' }, color: '#ff6b5b', sky: '#bfe6ff' },
    { id: 'museum', name: { ru: 'Музей ночью', en: 'Museum at Night' }, color: '#b497ff', sky: '#2a2060', night: true },
    { id: 'school', name: { ru: 'Школа после уроков', en: 'School After Hours' }, color: '#f2c14e', sky: '#a6e6ff' },
    { id: 'kitchen', name: { ru: 'Кухня великана', en: "Giant's Kitchen" }, color: '#ff8a3d', sky: '#ffe9c7' },
    { id: 'library', name: { ru: 'Старая библиотека', en: 'Old Library' }, color: '#d9a066', sky: '#ffd9a8' },
    { id: 'site', name: { ru: 'Стройка', en: 'Construction Site' }, color: '#ffb000', sky: '#a9dcff' },
    { id: 'aqua', name: { ru: 'Аквапарк', en: 'Water Park' }, color: '#2fc6ff', sky: '#8fe3ff' },
    { id: 'observatory', name: { ru: 'Обсерватория', en: 'Observatory' }, color: '#6f7bff', sky: '#141a44', night: true },
    { id: 'circus', name: { ru: 'Цирк-шапито', en: 'Big Top Circus' }, color: '#ff3d5a', sky: '#ffd2a0' },
    { id: 'greenhouse', name: { ru: 'Оранжерея', en: 'Greenhouse' }, color: '#6ddf7a', sky: '#b4f0c8' },
];

/**
 * Усиления (вкладка «Усиления» магазина): расходники в save.power, тратятся в начале раунда.
 * magnet — монеты летят к тебе, time — +10 с на поиск, battery — радар заряжен сразу и после первого броска.
 */
const HS_POWERUPS = [
    { id: 'magnet', icon: 'assets/ui/icons/power-magnet.webp', name: { ru: 'Магнит', en: 'Magnet' }, desc: { ru: 'Монеты летят к тебе весь раунд', en: 'Coins fly to you all round' }, rarity: 'rare', price: { coins: 250 }, pack: 1 },
    { id: 'time', icon: 'assets/ui/icon-timer.webp', name: { ru: 'Запас времени', en: 'Extra Time' }, desc: { ru: '+10 секунд на поиск', en: '+10 seconds to search' }, rarity: 'common', price: { coins: 150 }, pack: 2 },
    { id: 'battery', icon: 'assets/ui/icons/power-shield.webp', name: { ru: 'Батарея радара', en: 'Radar Battery' }, desc: { ru: 'Радар заряжен сразу и перезаряжается вдвое быстрее', en: 'Radar starts charged and recharges twice as fast' }, rarity: 'epic', price: { coins: 300 }, pack: 1 },
];

/**
 * Прокачка инструментов за монеты (уровни 1..max, значение на уровне L — элемент [L-1]).
 * radar: cooldown — перезарядка (с), duration — сколько показывает направление (с), jitter — погрешность стрелки (°);
 * net: range — дальность броска (px), cooldown — перезарядка (с), radius — размер обруча (px).
 * price[i] — цена перехода на уровень i+1 (первый уровень выдан сразу).
 */
const HS_TOOLS = {
    radar: { max: 5, price: [0, 200, 450, 900, 1600], cooldown: [16, 14, 12, 10.5, 9], duration: [4, 4.5, 5, 5.5, 6.5], jitter: [40, 28, 18, 8, 0], hot: 450, warm: 900 },
    net: { max: 5, price: [0, 180, 420, 850, 1500], range: [380, 440, 500, 560, 620], cooldown: [2.6, 2.3, 2.0, 1.7, 1.4], radius: [40, 46, 52, 58, 66] },
};

/** Цвета редкости: рамка карточки, свечение, след. */
const HS_RARITY = {
    common: { color: '#8fb6d9', ru: 'Обычный', en: 'Common' },
    rare: { color: '#3d9bff', ru: 'Редкий', en: 'Rare' },
    epic: { color: '#b24dff', ru: 'Эпик', en: 'Epic' },
    legendary: { color: '#ffb02e', ru: 'Легенда', en: 'Legendary' },
    mythic: { color: '#ff3d6e', ru: 'Миф', en: 'Mythic' },
};

/** @param {{ ru: string, en: string }} t */
function hsText(t) { return t ? (t[Lang.code === 'en' ? 'en' : 'ru'] || t.ru) : ''; }

/** @param {string} id */
function hsMap(id) { return HS_MAPS.find(m => m.id === id) || HS_MAPS[0]; }
/** Облик охотника: из каталога магазина (там и обычные, и эксклюзивы). @param {string} id */
function hsHunter(id) {
    const list = typeof HS_SHOP_ITEMS !== 'undefined' ? HS_SHOP_ITEMS.filter(i => i.tab === 'skin') : [];
    return /** @type {any} */ (list.find(i => i.id === id) || list.find(i => i.default) || list[0] || { id: 'hunter-01', model: 'assets/models/chars/hunter-01.glb', rarity: 'common', name: { ru: 'Охотник', en: 'Hunter' } });
}
/** Вид сачка и радара (вкладка «Снаряжение»): цвет и стиль. @param {string} id */
function hsGear(id) {
    const list = typeof HS_SHOP_ITEMS !== 'undefined' ? HS_SHOP_ITEMS.filter(i => i.tab === 'net') : [];
    return /** @type {any} */ (list.find(i => i.id === id) || list.find(i => i.default) || list[0] || { id: 'net_basic', color: '#ffe9a8', wave: '#5ce1ff', style: 'ring', rarity: 'common' });
}
/** Предмет магазина по id. @param {string} id */
function hsItem(id) { return typeof HS_SHOP_ITEMS !== 'undefined' ? HS_SHOP_ITEMS.find(i => i.id === id) || null : null; }

/** Daily Gift: дни 1–6 (по нарастающей), день 7 — эксклюзивный скин (очередь HS_DAILY_EXCLUSIVE). */
const HS_DAILY_REWARDS = [
    { coins: 100 }, { coins: 150, gems: 5 }, { coins: 200, randomItems: 1, maxRarity: 'rare' },
    { coins: 300, gems: 10 }, { coins: 400, randomItems: 1, maxRarity: 'epic' }, { coins: 600, gems: 20 },
];
const HS_DAILY_EXCLUSIVE = ['daily_golden', 'daily_phantom', 'daily_prism'];

/** Колесо фортуны: в основном валюта, реже кристаллы и предметы магазина. */
const HS_WHEEL_SECTORS = [
    { coins: 50, weight: 22 }, { coins: 10, gems: 5, weight: 12 }, { coins: 120, weight: 18 }, { randomItem: true, maxRarity: 'rare', weight: 9 },
    { coins: 250, weight: 12 }, { coins: 20, gems: 15, weight: 5 }, { coins: 500, weight: 5 }, { randomItem: true, maxRarity: 'legendary', weight: 3 },
];
