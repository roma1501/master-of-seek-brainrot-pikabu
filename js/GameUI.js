// GameUI.js — интерфейс «Master of Seek Brainrot» в образе «полевого журнала охотника»: бумага, скотч, штампы,
// фото-карточки с уголками, приколотые заметки. Меню-обложка, HUD раунда, баннеры-штампы, бирки над головами,
// отчёт о деле (результат), Брейндекс, Снаряжение, магазин, Daily Gift, колесо, настройки, оформление обучения.
// DOM поверх холста; стили вставляются отсюда (<style id="hs-ui-css">), шрифты (@font-face HsStamp / HsText) — в index.html.
// Контракт Game <-> GameUI — шапка docs/RESKIN.md и задание UI-агента; тексты — ключи «ui.*» (ru и en).
//
// Размеры. Меню, окна, результат и баннеры меряются в «u» — единице экрана (--u на #hs-ui, считает resize()); в CSS
// ниже запись «18u» превращается в calc(var(--u)*18). HUD раскладывает HudLayout: каждый блок — рамка data-hl, внутри
// .hs-fit проектного размера, масштаб --fit = размер блока / проектный размер. Анимации — transform и opacity;
// при prefers-reduced-motion тряска и бесконечные петли отключены. backdrop-filter не используется.

// ---------------------------------------------------------------------------------------------------------
// Тексты
// ---------------------------------------------------------------------------------------------------------

Object.assign(LANG_STRINGS.ru, {
    'ui.logo1': 'MASTER OF SEEK',
    'ui.logo2': 'BRAINROT',
    'ui.logoSub': 'полевой журнал охотника',
    'ui.play': 'ИГРАТЬ',
    'ui.case': 'ДЕЛО №{n}',
    'ui.caseFile': 'Папка дел',
    'ui.caseNow': 'Сейчас в работе',
    'ui.dex': 'БРЕЙНДЕКС',
    'ui.gear': 'СНАРЯЖЕНИЕ',
    'ui.shop': 'МАГАЗИН',
    'ui.gift': 'ПОДАРОК ДНЯ',
    'ui.wheel': 'КОЛЕСО',
    'ui.settings': 'НАСТРОЙКИ',
    'ui.howto': 'КАК ИГРАТЬ',
    'ui.sound': 'ЗВУК',
    'ui.close': 'Закрыть',
    'ui.back': 'НАЗАД',
    'ui.level': 'УР. {n}',
    'ui.levelLong': 'Ранг {n}',
    'ui.found': 'Найдено {a}/{b}',
    'ui.income': 'Доход Брейндекса: +{n} за раунд',
    'ui.incomeS': '+{n} за раунд',
    'ui.new': 'НОВОЕ',
    'ui.giftReady': 'ЖДЁТ!',
    'ui.have': 'Есть: {n}',
    'ui.pack': '×{n}',
    'ui.sfx': 'Эффекты',
    'ui.music': 'Музыка',
    'ui.quality': 'Графика',
    'ui.q.auto': 'АВТО',
    'ui.q.low': 'НИЗКАЯ',
    'ui.q.medium': 'СРЕДНЯЯ',
    'ui.q.high': 'ВЫСОКАЯ',
    'ui.on': 'ВКЛ',
    'ui.off': 'ВЫКЛ',
    // HUD
    'hud.left': 'ОСТАЛОСЬ',
    'hud.tutorial': 'ОБУЧЕНИЕ',
    'hud.radar': 'РАДАР',
    'hud.net': 'САЧОК',
    'hud.check': 'ПРОВЕРИТЬ',
    'hud.hot': 'ГОРЯЧО!',
    'hud.warm': 'ТЕПЛО',
    'hud.cold': 'ХОЛОДНО',
    'hud.boost': 'УСКОРЕНИЕ',
    'hud.round': 'за раунд',
    'hud.wait': 'Брейнроты прячутся…',
    'hud.fleeing': 'убегает!',
    'hud.caughtTag': 'ПОЙМАН',
    'hud.sec': 'с',
    // баннеры
    'bn.hide': 'БРЕЙНРОТЫ РАЗБЕГАЮТСЯ!',
    'bn.hunt': 'ИЩИ!',
    'bn.found': 'пойман!',
    'bn.newspecies': 'НОВЫЙ ВИД!',
    'bn.newspeciesSub': 'Записано в Брейндекс',
    'bn.mimic': 'МИМИК РАЗОБЛАЧЁН!',
    'bn.wrong': 'ПУСТО!',
    'bn.last10': '10 СЕКУНД!',
    // результат
    'res.win': 'ДЕЛО ЗАКРЫТО',
    'res.lose': 'ВРЕМЯ ВЫШЛО',
    'res.caughtN': 'Поймано {a} из {b}',
    'res.time': 'Время {t}',
    'res.species': 'ПОЙМАНО В ЭТОТ РАЗ',
    'res.noSpecies': 'Никого не удалось поймать',
    'res.newSp': 'NEW',
    'res.ledger': 'ВЕДОМОСТЬ НАГРАД',
    'res.rCatch': 'Поимки и находки',
    'res.rFirst': 'Первые поимки видов',
    'res.rDex': 'Доход Брейндекса',
    'res.rWin': 'Бонус за победу',
    'res.rTotal': 'ИТОГО',
    'res.gems': 'Кристаллы',
    'res.xp': 'Опыт',
    'res.lvlUp': 'НОВЫЙ РАНГ!',
    'res.unlocked': 'НОВОЕ ДЕЛО ОТКРЫТО',
    'res.mimics': 'Мимиков разоблачено: {n}',
    'res.wrong': 'Пустых проверок: {n}',
    'res.next': 'ДАЛЬШЕ',
    'res.retry': 'ЕЩЁ РАЗ',
    'res.menu': 'В МЕНЮ',
    'res.x2': 'x2 МОНЕТ ЗА РЕКЛАМУ',
    'res.x2done': 'УДВОЕНО!',
    'res.x2sub': 'ещё +{n}',
    // Брейндекс
    'dex.title': 'БРЕЙНДЕКС',
    'dex.sub': 'Каталог пойманных существ',
    'dex.unknown': '???',
    'dex.caught': 'поймано ×{n}',
    'dex.income': '+{n} за раунд',
    'dex.first': 'Первая поимка: +{n}',
    'dex.catch': 'Поимка: +{n}',
    'dex.habit': 'ПОВАДКИ',
    'dex.hint': 'Первая поимка вида даёт бонус монет. Открытые виды приносят монеты каждый раунд.',
    'dex.pick': 'Выбери карточку',
    'dex.locked': 'Не открыт. Поймай этот вид, чтобы узнать его повадки.',
    // Снаряжение
    'gear.title': 'СНАРЯЖЕНИЕ',
    'gear.sub': 'Чертежи улучшений',
    'gear.radar': 'РАДАР',
    'gear.net': 'САЧОК',
    'gear.radarD': 'Волна показывает, где ближайший брейнрот',
    'gear.netD': 'Бросок вперёд ловит убегающего',
    'gear.cooldown': 'Перезарядка',
    'gear.duration': 'Время показа',
    'gear.accuracy': 'Погрешность',
    'gear.range': 'Дальность',
    'gear.size': 'Размер обруча',
    'gear.lvl': 'Уровень {a}/{b}',
    'gear.up': 'УЛУЧШИТЬ',
    'gear.max': 'МАКСИМУМ',
    'gear.need': 'Не хватает монет: {n}',
    'gear.m': '{n} м',
    'gear.deg': '±{n}°',
    // магазин и реклама
    'ui.tab.power': 'УСИЛЕНИЯ',
    'ui.locked': 'ЗАКРЫТО',
    'ui.bought': 'КУПЛЕНО',
    'ui.wearing': 'НАДЕТО',
    'ui.buy': 'КУПИТЬ',
    'ui.wear': 'НАДЕТЬ',
    'ui.unequip': 'СНЯТЬ',
    'ui.exclusive': 'ПОДАРОК ДНЯ',
    'ui.adProg': 'За рекламу {a}/{b}',
    'ui.watchAd': 'ПОСМОТРЕТЬ РЕКЛАМУ',
    'ui.forAd': 'ЗА РЕКЛАМУ',
    'ui.adRunning': 'РЕКЛАМА…',
    'ui.adFail': 'Реклама не засчиталась. Прогресс сохранён, попробуй ещё раз.',
    'ui.adFailGift': 'Реклама не засчиталась. Подарок можно забрать и без неё.',
    'ui.adNone': 'Реклама сейчас недоступна. Попробуй позже.',
    'ui.needCoins': 'Не хватает монет: {n}',
    'ui.noBuy': 'Не получилось купить',
    'ui.coinsAd': '+{n} монет за рекламу',
    'ui.popCoins': 'монет',
    'ui.popGems': 'кристаллов',
    'ui.popSub': 'за просмотр рекламы',
    'ui.opened': 'ОТКРЫТО!',
    'ui.peek': 'На герое',
    'ui.empty': 'Здесь пока пусто',
    'ui.gotIt': 'ЗАБРАТЬ',
    'ui.got': 'ТЫ ПОЛУЧИЛ!',
    'ui.dup': 'Такой предмет уже есть, вместо него монеты',
    'ui.netStyle': 'Сачок',
    'ui.waveStyle': 'Волна радара',
    'st.ring': 'кольцо', 'st.double': 'двойное', 'st.bubble': 'пузырь', 'st.spiral': 'спираль', 'st.star': 'звезда',
    'wv.ring': 'кольцо', 'wv.pulse': 'пульс', 'wv.scan': 'скан',
    // подарок дня и колесо
    'ui.dg.title': 'ПОДАРОК ДНЯ',
    'ui.dg.claim': 'ЗАБРАТЬ',
    'ui.dg.x2': 'x2 ЗА РЕКЛАМУ',
    'ui.dg.done': 'ПОЛУЧЕНО',
    'ui.dg.next': 'Следующий подарок через {t}',
    'ui.dg.goalSub': 'Нигде больше не продаётся',
    'ui.dg.today': 'СЕГОДНЯ',
    'ui.dg.tomorrow': 'ЗАВТРА',
    'ui.dg.got': 'ПОЛУЧЕНО',
    'ui.dg.excl': 'ЭКСКЛЮЗИВ',
    'ui.dg.big': 'КРУПНАЯ НАГРАДА',
    'ui.dg.in': 'Через {n} дн.',
    'ui.wh.title': 'КОЛЕСО ФОРТУНЫ',
    'ui.wh.free': 'КРУТИТЬ БЕСПЛАТНО',
    'ui.wh.freeIn': 'Бесплатно через {t}',
    'ui.wh.ad': 'ЕЩЁ ВРАЩЕНИЕ ЗА РЕКЛАМУ',
    'ui.wh.left': 'Осталось {a} из {b}',
    'ui.wh.spinning': 'КРУТИТСЯ…',
    'ui.wh.win': 'ВЫИГРЫШ!',
    'ui.wh.ready': 'Бесплатное вращение готово!',
    'ui.wh.nextFree': 'Следующее бесплатное через',
    // оффер
    'offer.time.t': 'ВРЕМЯ ВЫШЛО!',
    'offer.time.s': '+20 секунд за рекламу',
    'offer.time.b': '+20 СЕКУНД',
    'offer.no': 'Нет, спасибо',
});
Object.assign(LANG_STRINGS.en, {
    'ui.logo1': 'MASTER OF SEEK',
    'ui.logo2': 'BRAINROT',
    'ui.logoSub': "the hunter's field journal",
    'ui.play': 'PLAY',
    'ui.case': 'CASE №{n}',
    'ui.caseFile': 'Case folder',
    'ui.caseNow': 'Open case',
    'ui.dex': 'BRAINDEX',
    'ui.gear': 'GEAR',
    'ui.shop': 'SHOP',
    'ui.gift': 'DAILY GIFT',
    'ui.wheel': 'WHEEL',
    'ui.settings': 'SETTINGS',
    'ui.howto': 'HOW TO PLAY',
    'ui.sound': 'SOUND',
    'ui.close': 'Close',
    'ui.back': 'BACK',
    'ui.level': 'LVL {n}',
    'ui.levelLong': 'Rank {n}',
    'ui.found': 'Found {a}/{b}',
    'ui.income': 'Braindex income: +{n} per round',
    'ui.incomeS': '+{n} per round',
    'ui.new': 'NEW',
    'ui.giftReady': 'READY!',
    'ui.have': 'Owned: {n}',
    'ui.pack': '×{n}',
    'ui.sfx': 'Effects',
    'ui.music': 'Music',
    'ui.quality': 'Graphics',
    'ui.q.auto': 'AUTO',
    'ui.q.low': 'LOW',
    'ui.q.medium': 'MEDIUM',
    'ui.q.high': 'HIGH',
    'ui.on': 'ON',
    'ui.off': 'OFF',
    'hud.left': 'LEFT',
    'hud.tutorial': 'TRAINING',
    'hud.radar': 'RADAR',
    'hud.net': 'NET',
    'hud.check': 'CHECK',
    'hud.hot': 'HOT!',
    'hud.warm': 'WARM',
    'hud.cold': 'COLD',
    'hud.boost': 'SPEED UP',
    'hud.round': 'this round',
    'hud.wait': 'The brainrots are hiding…',
    'hud.fleeing': 'on the run!',
    'hud.caughtTag': 'CAUGHT',
    'hud.sec': 's',
    'bn.hide': 'THE BRAINROTS ARE SCATTERING!',
    'bn.hunt': 'SEEK!',
    'bn.found': 'caught!',
    'bn.newspecies': 'NEW SPECIES!',
    'bn.newspeciesSub': 'Added to the Braindex',
    'bn.mimic': 'MIMIC EXPOSED!',
    'bn.wrong': 'EMPTY!',
    'bn.last10': '10 SECONDS!',
    'res.win': 'CASE CLOSED',
    'res.lose': "TIME'S UP",
    'res.caughtN': 'Caught {a} of {b}',
    'res.time': 'Time {t}',
    'res.species': 'CAUGHT THIS TIME',
    'res.noSpecies': 'Nothing was caught',
    'res.newSp': 'NEW',
    'res.ledger': 'REWARD LEDGER',
    'res.rCatch': 'Catches and finds',
    'res.rFirst': 'First catches of species',
    'res.rDex': 'Braindex income',
    'res.rWin': 'Victory bonus',
    'res.rTotal': 'TOTAL',
    'res.gems': 'Gems',
    'res.xp': 'XP',
    'res.lvlUp': 'RANK UP!',
    'res.unlocked': 'NEW CASE OPENED',
    'res.mimics': 'Mimics exposed: {n}',
    'res.wrong': 'Empty checks: {n}',
    'res.next': 'NEXT CASE',
    'res.retry': 'TRY AGAIN',
    'res.menu': 'MENU',
    'res.x2': 'x2 COINS: WATCH AD',
    'res.x2done': 'DOUBLED!',
    'res.x2sub': '+{n} more',
    'dex.title': 'BRAINDEX',
    'dex.sub': 'Catalog of caught creatures',
    'dex.unknown': '???',
    'dex.caught': 'caught ×{n}',
    'dex.income': '+{n} per round',
    'dex.first': 'First catch: +{n}',
    'dex.catch': 'Catch: +{n}',
    'dex.habit': 'HABITS',
    'dex.hint': 'The first catch of a species gives bonus coins. Found species pay coins every round.',
    'dex.pick': 'Pick a card',
    'dex.locked': 'Not found yet. Catch this species to learn its habits.',
    'gear.title': 'GEAR',
    'gear.sub': 'Upgrade blueprints',
    'gear.radar': 'RADAR',
    'gear.net': 'NET',
    'gear.radarD': 'The wave shows where the nearest brainrot is',
    'gear.netD': 'A throw ahead catches a runaway',
    'gear.cooldown': 'Cooldown',
    'gear.duration': 'Display time',
    'gear.accuracy': 'Error',
    'gear.range': 'Range',
    'gear.size': 'Hoop size',
    'gear.lvl': 'Level {a}/{b}',
    'gear.up': 'UPGRADE',
    'gear.max': 'MAX LEVEL',
    'gear.need': 'Not enough coins: {n}',
    'gear.m': '{n} m',
    'gear.deg': '±{n}°',
    'ui.tab.power': 'POWER-UPS',
    'ui.locked': 'LOCKED',
    'ui.bought': 'OWNED',
    'ui.wearing': 'EQUIPPED',
    'ui.buy': 'BUY',
    'ui.wear': 'EQUIP',
    'ui.unequip': 'TAKE OFF',
    'ui.exclusive': 'DAILY GIFT',
    'ui.adProg': 'Watch ads {a}/{b}',
    'ui.watchAd': 'WATCH AD',
    'ui.forAd': 'WATCH AD',
    'ui.adRunning': 'AD PLAYING…',
    'ui.adFail': 'The ad was not counted. Your progress is saved, try again.',
    'ui.adFailGift': 'The ad was not counted. You can still claim the gift.',
    'ui.adNone': 'No ad right now. Try again later.',
    'ui.needCoins': 'Not enough coins: {n}',
    'ui.noBuy': 'Could not buy it',
    'ui.coinsAd': '+{n} coins: watch an ad',
    'ui.popCoins': 'coins',
    'ui.popGems': 'gems',
    'ui.popSub': 'for watching an ad',
    'ui.opened': 'UNLOCKED!',
    'ui.peek': 'On the hunter',
    'ui.empty': 'Nothing here yet',
    'ui.gotIt': 'COLLECT',
    'ui.got': 'YOU GOT!',
    'ui.dup': 'You already have it, coins instead',
    'ui.netStyle': 'Net',
    'ui.waveStyle': 'Radar wave',
    'st.ring': 'ring', 'st.double': 'double', 'st.bubble': 'bubble', 'st.spiral': 'spiral', 'st.star': 'star',
    'wv.ring': 'ring', 'wv.pulse': 'pulse', 'wv.scan': 'scan',
    'ui.dg.title': 'DAILY GIFT',
    'ui.dg.claim': 'CLAIM',
    'ui.dg.x2': 'x2: WATCH AD',
    'ui.dg.done': 'CLAIMED',
    'ui.dg.next': 'Next gift in {t}',
    'ui.dg.goalSub': 'Not sold anywhere else',
    'ui.dg.today': 'TODAY',
    'ui.dg.tomorrow': 'TOMORROW',
    'ui.dg.got': 'CLAIMED',
    'ui.dg.excl': 'EXCLUSIVE',
    'ui.dg.big': 'BIG REWARD',
    'ui.dg.in': 'In {n} days',
    'ui.wh.title': 'WHEEL OF FORTUNE',
    'ui.wh.free': 'SPIN FOR FREE',
    'ui.wh.freeIn': 'Free in {t}',
    'ui.wh.ad': 'SPIN AGAIN: WATCH AD',
    'ui.wh.left': '{a} of {b} left',
    'ui.wh.spinning': 'SPINNING…',
    'ui.wh.win': 'YOU WON!',
    'ui.wh.ready': 'Your free spin is ready!',
    'ui.wh.nextFree': 'Next free spin in',
    'offer.time.t': "TIME'S UP!",
    'offer.time.s': '+20 seconds: watch an ad',
    'offer.time.b': '+20 SECONDS',
    'offer.no': 'No, thanks',
});

// ---------------------------------------------------------------------------------------------------------
// Пиктограммы
// ---------------------------------------------------------------------------------------------------------

/**
 * ВРЕМЕННЫЕ пиктограммы (inline SVG, currentColor): заменить ассетами из docs/CODEX-IMAGEGEN-PROMPT.md
 * (assets/ui/ico-*.webp — радар, сачок, лупа «Проверить», динамик, шестерёнка и т. д.).
 */
const HSUI_ICON = {
    radar: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"><circle cx="24" cy="24" r="19"/><circle cx="24" cy="24" r="11"/><path d="M24 24L37 11"/><circle cx="24" cy="24" r="2.6" fill="currentColor"/></svg>',
    net: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="19" cy="19" r="13"/><path d="M6 19h26M9 12h20M9 26h20M19 6v26M12 8c-3 7-3 15 0 22M26 8c3 7 3 15 0 22"/><path d="M29 29l14 14" stroke-width="4.4"/></svg>',
    check: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round"><circle cx="20" cy="20" r="13"/><path d="M30 30l13 13" stroke-width="5"/><path d="M14 20l4 4 8-8" stroke-width="3.2"/></svg>',
    speaker: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8l10-8v28l-10-8H6z" fill="currentColor" fill-opacity=".25"/><path d="M31 17c3 4 3 10 0 14M36 12c6 7 6 17 0 24"/></svg>',
    speakerOff: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8l10-8v28l-10-8H6z" fill="currentColor" fill-opacity=".25"/><path d="M32 18l12 12M44 18L32 30"/></svg>',
    note: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 36V10l22-4v26"/><circle cx="12" cy="36" r="6" fill="currentColor" fill-opacity=".3"/><circle cx="34" cy="32" r="6" fill="currentColor" fill-opacity=".3"/></svg>',
    gear: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="7"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4"/><circle cx="24" cy="24" r="14"/></svg>',
    cog: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="7"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4"/><circle cx="24" cy="24" r="14"/></svg>',
    lock: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="21" width="28" height="21" rx="4" fill="currentColor" fill-opacity=".25"/><path d="M16 21v-6a8 8 0 0116 0v6"/></svg>',
    tick: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 26l11 11L41 11"/></svg>',
    close: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"><path d="M10 10l28 28M38 10L10 38"/></svg>',
    play: '<svg viewBox="0 0 48 48" fill="currentColor"><path d="M14 8l28 16-28 16z"/></svg>',
    gift: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="19" width="36" height="22" rx="3" fill="currentColor" fill-opacity=".2"/><rect x="4" y="12" width="40" height="9" rx="3"/><path d="M24 12v29M24 12c-3-8-12-8-12-3s9 3 12 3zM24 12c3-8 12-8 12-3s-9 3-12 3z"/></svg>',
    giftQ: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="19" width="36" height="22" rx="3" fill="currentColor" fill-opacity=".2"/><rect x="4" y="12" width="40" height="9" rx="3"/><path d="M24 12v29"/></svg>',
    wheel: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"><circle cx="24" cy="24" r="19"/><path d="M24 5v38M5 24h38M11 11l26 26M37 11L11 37"/><circle cx="24" cy="24" r="4" fill="currentColor"/></svg>',
    question: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 17c0-6 4-9 9-9s9 3 9 8c0 7-9 7-9 14"/><circle cx="24" cy="40" r="1.6" fill="currentColor"/></svg>',
    cart: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h7l5 22h22l4-16H13"/><circle cx="19" cy="38" r="3"/><circle cx="35" cy="38" r="3"/></svg>',
    bag: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 15h32l-2 27H10z" fill="currentColor" fill-opacity=".2"/><path d="M16 15v-3a8 8 0 0116 0v3"/></svg>',
    cup: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M13 7h22v9c0 8-5 13-11 13S13 24 13 16z" fill="currentColor" fill-opacity=".2"/><path d="M13 10H6c0 6 3 10 8 10M35 10h7c0 6-3 10-8 10M24 29v6M16 42h16M19 35h10"/></svg>',
    book: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9c6-2 13-2 18 3 5-5 12-5 18-3v29c-6-2-13-2-18 3-5-5-12-5-18-3z" fill="currentColor" fill-opacity=".18"/><path d="M24 12v29"/></svg>',
    person: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="15" r="8" fill="currentColor" fill-opacity=".2"/><path d="M8 42c1-10 8-14 16-14s15 4 16 14z" fill="currentColor" fill-opacity=".2"/></svg>',
    hat: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 33c0-12 6-22 15-22s15 10 15 22z" fill="currentColor" fill-opacity=".2"/><path d="M4 35h40M9 28h30"/></svg>',
    trail: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 40c8 0 8-10 16-10s8-10 16-10M30 8l3 5 6 1-4 4 1 6-6-3-5 3 1-6-4-4 6-1z" fill="currentColor" fill-opacity=".2"/></svg>',
    aura: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="8"/><path d="M24 3v7M24 38v7M3 24h7M38 24h7M9 9l5 5M34 34l5 5M39 9l-5 5M14 34l-5 5"/></svg>',
    star: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M24 5l5.6 11.6 12.4 1.6-9 8.8 2.3 12.7L24 33.8 12.7 39.7 15 27 6 18.2l12.4-1.6z" fill="currentColor" fill-opacity=".25"/></svg>',
    bolt: '<svg viewBox="0 0 48 48" fill="currentColor"><path d="M27 3L9 27h13l-3 18 20-26H26z"/></svg>',
    arrow: '<svg viewBox="0 0 64 48"><path d="M4 18h34V6l24 18-24 18V30H4z" fill="currentColor" stroke="#2a2017" stroke-width="4" stroke-linejoin="round"/></svg>',
    chevL: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M30 8L14 24l16 16"/></svg>',
    chevR: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8l16 16-16 16"/></svg>',
    bang: '<svg viewBox="0 0 48 48" fill="currentColor"><path d="M20 4h8l-2 28h-4z"/><circle cx="24" cy="40" r="4.4"/></svg>',
};

/** Значок вкладки магазина и запасной значок предмета без файла иконки. */
const HSUI_TABIC = { skin: HSUI_ICON.person, net: HSUI_ICON.net, hat: HSUI_ICON.hat, trail: HSUI_ICON.trail, aura: HSUI_ICON.aura, emote: HSUI_ICON.star, power: HSUI_ICON.bolt };

// ---------------------------------------------------------------------------------------------------------
// Помощники
// ---------------------------------------------------------------------------------------------------------

/** Элемент: тег, класс, родитель, внутренний html. @returns {HTMLElement} */
function hsuiEl(tag, cls, parent, html) {
    const e = document.createElement(tag || 'div');
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
}
/** Кнопка (type=button). @returns {HTMLButtonElement} */
function hsuiBtn(cls, parent, html) {
    const b = /** @type {HTMLButtonElement} */ (hsuiEl('button', cls, parent, html));
    b.type = 'button';
    return b;
}
/** Картинка (не ломает вёрстку, если файла нет). @returns {HTMLImageElement} */
function hsuiImg(src, cls, parent) {
    const i = /** @type {HTMLImageElement} */ (hsuiEl('img', cls, parent));
    i.alt = ''; i.draggable = false;
    i.onerror = () => { i.style.visibility = 'hidden'; };
    i.src = src;
    return i;
}
/** Иконка предмета: файл или запасной значок вкладки цветом редкости. */
function hsuiIcon(src, parent, color, tab) {
    const box = hsuiEl('span', 'hs-ico', parent);
    box.style.color = color || '#8a7a64';
    const fb = hsuiEl('span', 'fb', box, HSUI_TABIC[tab] || HSUI_ICON.star);
    if (src) {
        const i = /** @type {HTMLImageElement} */ (hsuiEl('img', '', box));
        i.alt = ''; i.draggable = false;
        i.onload = () => { fb.style.display = 'none'; };
        i.onerror = () => { i.remove(); };
        i.src = src;
    }
    return box;
}
/** Портрет брейнрота: картинка либо «?» на цвете вида; locked — тёмный силуэт. */
function hsuiPortrait(src, color, parent, locked) {
    const box = hsuiEl('span', 'hs-pt' + (locked ? ' locked' : ''), parent);
    box.style.setProperty('--pc', color || '#8fb6d9');
    hsuiEl('span', 'q', box, '?');
    if (src) {
        const i = /** @type {HTMLImageElement} */ (hsuiEl('img', '', box));
        i.alt = ''; i.draggable = false;
        i.onload = () => box.classList.add('ok');
        i.onerror = () => i.remove();
        i.src = src;
    }
    return box;
}
/** «Название» из строки или { ru, en }. */
function hsuiName(v) { return v && typeof v === 'object' ? hsText(v) : String(v == null ? '' : v); }
function hsuiGame() { return typeof Game !== 'undefined' ? Game : null; }
/** Shop, если подключён и с каталогом. */
function hsuiShop() { try { return typeof Shop !== 'undefined' && Shop.items().length ? Shop : null; } catch (e) { return null; } }
function hsuiAds() { const G = /** @type {any} */ (hsuiGame()); return G && G.ads ? G.ads : null; }
/** Умеет ли площадка rewarded (иначе кнопки «за рекламу» прячутся). */
function hsuiAdsOn() {
    if (!hsuiAds()) return false;
    try { if (typeof Platform !== 'undefined' && typeof Platform.rewardedSupported === 'function' && !Platform.rewardedSupported()) return false; } catch (e) { /* площадка не ответила */ }
    return true;
}
/** «Через N с» во время общей паузы между rewarded, иначе ''. */
function hsuiAdWait() {
    const a = hsuiAds();
    if (!a || typeof a.label !== 'function') return '';
    try { return String(a.label() || ''); } catch (e) { return ''; }
}
function hsuiAdReady() {
    const a = hsuiAds();
    if (!a) return false;
    try { return typeof a.ready === 'function' ? !!a.ready() : true; } catch (e) { return false; }
}
function hsuiAdAmount(kind) {
    const a = /** @type {any} */ (hsuiAds());
    try { if (a && typeof a.amount === 'function') { const v = Number(a.amount(kind)); if (v > 0) return Math.floor(v); } } catch (e) { /* запасное ниже */ }
    const G = /** @type {any} */ (hsuiGame());
    return kind === 'gems' ? 8 : 120 + (G && G.save ? G.save.level | 0 : 1) * 20;
}
function hsuiCoins() {
    const S = hsuiShop();
    if (S) return S.coins | 0;
    const G = /** @type {any} */ (hsuiGame());
    return G && G.save ? G.save.coins | 0 : 0;
}
function hsuiGems() { const G = /** @type {any} */ (hsuiGame()); return G && G.save ? G.save.gems | 0 : 0; }
function hsuiSfx(name) { try { if (typeof GameFX !== 'undefined' && GameFX && typeof GameFX.sfx === 'function') GameFX.sfx(name); } catch (e) { /* звук не обязателен */ } }
function hsuiFmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
function hsuiPad2(n) { return (n < 10 ? '0' : '') + n; }
function hsuiTimer(sec) { const s = Math.max(0, Math.ceil(sec)); return Math.floor(s / 60) + ':' + hsuiPad2(s % 60); }
function hsuiClock(sec) { const s = Math.max(0, Math.round(sec)); return Math.floor(s / 60) + ':' + hsuiPad2(s % 60); }
function hsuiClamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function hsuiRgba(hex, a) {
    const h = String(hex).replace('#', '');
    const n = parseInt(h.length === 3 ? h.replace(/(.)/g, '$1$1') : h, 16) || 0;
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
}
function hsuiRar(id) { return HS_RARITY[id] || HS_RARITY.common; }
function hsuiRarName(id) { const r = hsuiRar(id); return Lang.code === 'en' ? r.en : r.ru; }
function hsuiReduced() { return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches; }
/** CSS: «18u» -> calc(var(--u)*18). */
function hsuiCss(src) { return src.replace(/(-?\d*\.?\d+)u(?![a-zA-Z0-9_-])/g, (m, n) => 'calc(var(--u)*' + n + ')'); }
/** Метры из px мира (100 px = 1 м). */
function hsuiMeters(px) { const m = px / 100; return (Math.round(m * 10) / 10).toString(); }

/** Счётчик валюты — билетик с иконкой: число считается вверх/вниз и подпрыгивает при изменении. */
class HsCounter {
    /** @param {Element} parent @param {string} icon @param {string} [cls] @param {boolean} [plus] */
    constructor(parent, icon, cls, plus) {
        this.el = hsuiEl('div', 'hs-pill' + (cls ? ' ' + cls : ''), parent);
        this.icon = hsuiImg(icon, 'hs-pill-ic', this.el);
        this.num = hsuiEl('span', 'hs-pill-n', this.el, '0');
        /** @type {HTMLButtonElement | null} */
        this.plus = null;
        if (plus) {
            this.el.classList.add('hasplus');
            this.plus = hsuiBtn('hs-plus', this.el, '+');
            this.plus.hidden = true;
        }
        this.val = 0; this.shown = 0; this.from = 0; this.t0 = 0; this.dur = 0; this.raf = 0; this.fallback = 0;
    }
    /** @param {number} v @param {boolean} [anim] */
    set(v, anim) {
        v = Math.max(0, Math.round(Number(v) || 0));
        if (v === this.val) return;
        this.val = v;
        if (!anim) { this._stop(); this.shown = v; this.num.textContent = hsuiFmt(v); return; }
        this.bump();
        this.from = this.shown;
        this.t0 = performance.now();
        this.dur = Math.min(900, 280 + Math.abs(v - this.from) * 5);
        clearTimeout(this.fallback);
        this.fallback = window.setTimeout(() => { this._stop(); this.shown = this.val; this.num.textContent = hsuiFmt(this.val); }, this.dur + 150);
        if (!this.raf) this.raf = requestAnimationFrame(() => this._tick());
    }
    _stop() { if (this.raf) cancelAnimationFrame(this.raf); this.raf = 0; clearTimeout(this.fallback); }
    _tick() {
        this.raf = 0;
        const p = hsuiClamp((performance.now() - this.t0) / this.dur, 0, 1), e = 1 - Math.pow(1 - p, 3);
        this.shown = Math.round(this.from + (this.val - this.from) * e);
        this.num.textContent = hsuiFmt(this.shown);
        if (p < 1) this.raf = requestAnimationFrame(() => this._tick());
        else { this.shown = this.val; clearTimeout(this.fallback); }
    }
    bump() {
        this.el.classList.remove('bump');
        void this.el.offsetWidth;
        this.el.classList.add('bump');
    }
}

/** Баннеры: kind -> вид. big — штамп по центру; prio — кого не перебивают. */
const HSUI_BANNERS = {
    hide: { k: 'bn.hide', c: 'tape', ms: 2300, prio: 1 },
    hunt: { k: 'bn.hunt', c: 'green', ms: 1700, prio: 1, stamp: true },
    last10: { k: 'bn.last10', c: 'red', ms: 1700, prio: 2, stamp: true, shake: true },
    wrong: { k: 'bn.wrong', c: 'red', ms: 1900, prio: 2, stamp: true, shake: true, sub: true },
    mimic: { k: 'bn.mimic', c: 'blue', ms: 2200, prio: 2, stamp: true, sub: true },
    newspecies: { k: 'bn.newspecies', c: 'gold', ms: 3000, prio: 3, stamp: true, sub: true, fancy: true },
    found: { k: 'bn.found', c: 'note', ms: 1800, prio: 0, small: true },
};

// ---------------------------------------------------------------------------------------------------------
// Стили. «18u» = 18 единиц экрана (см. hsuiCss).
// ---------------------------------------------------------------------------------------------------------

const HSUI_CSS = `
#hs-ui{position:fixed;inset:0;z-index:20;pointer-events:none;overflow:hidden;--u:1px;--fs:'HsStamp','HsText',system-ui,sans-serif;--ft:'HsText',system-ui,sans-serif;
--paper:#f6edd6;--paper2:#ebdcb8;--kraft:#d4b07a;--kraft2:#b78a52;--ink:#2a2017;--ink2:#6b5942;--red:#d6372c;--red2:#9c1f17;--hl:#ffd84a;--teal:#1d8a78;--blue:#2b5db0;--green:#2e9a50;--line:rgba(48,98,168,.3);
font-family:var(--ft);font-weight:700;color:var(--ink);-webkit-tap-highlight-color:transparent;text-rendering:optimizeLegibility}
#hs-ui *,#hs-ui *::before,#hs-ui *::after{box-sizing:border-box}
:where(#hs-ui) button{font:inherit;color:inherit;border:0;padding:0;margin:0;background:none;cursor:pointer;touch-action:manipulation;outline:none;-webkit-appearance:none;appearance:none}
:where(#hs-ui) img{display:block;pointer-events:none;-webkit-user-drag:none}
:where(#hs-ui) svg{display:block}
#hs-ui [hidden]{display:none!important}
#hs-ui button:focus-visible{outline:3u dashed var(--blue);outline-offset:3u}
#hs-ui .hs-scroll{overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;scrollbar-width:thin;scrollbar-color:var(--kraft2) transparent}

/* ---- материалы: бумага, скотч, штамп ---- */
.hs-paper{position:relative;background-color:var(--paper);background-image:radial-gradient(rgba(120,88,40,.075) 1px,transparent 1.6px),radial-gradient(rgba(255,255,255,.4) 1px,transparent 1.6px);background-size:7px 7px,11px 11px;background-position:0 0,3px 4px;border:2u solid rgba(42,32,23,.34);border-radius:3u;box-shadow:0 2u 0 rgba(42,32,23,.22),0 14u 24u -8u rgba(0,0,0,.55)}
.hs-ruled{background-image:repeating-linear-gradient(180deg,transparent 0,transparent 25u,var(--line) 25u,var(--line) 26u),radial-gradient(rgba(120,88,40,.07) 1px,transparent 1.6px);background-size:100% 26u,7px 7px;background-position:0 8u,0 0}
.hs-grid{background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:16u 16u}
.hs-kraft{background-color:var(--kraft);background-image:radial-gradient(rgba(90,58,20,.16) 1px,transparent 1.8px),radial-gradient(rgba(255,235,190,.22) 1px,transparent 1.8px);background-size:6px 6px,9px 9px;background-position:0 0,2px 3px;border-color:rgba(60,38,12,.5)}
.hs-tape{position:relative}
.hs-tape::before{content:'';position:absolute;left:50%;top:-11u;width:76u;height:22u;margin-left:-38u;transform:rotate(-3deg);background:rgba(255,222,110,.78);box-shadow:0 1u 2u rgba(0,0,0,.25);clip-path:polygon(0 0,3% 25%,0 50%,3% 75%,0 100%,100% 100%,97% 75%,100% 50%,97% 25%,100% 0);z-index:2;pointer-events:none}
.hs-tape.l::before{left:14%;transform:rotate(-8deg)}
.hs-tape.r::before{left:auto;right:6%;margin-left:0;transform:rotate(6deg)}
.hs-tape.b::before{background:rgba(190,215,255,.78)}
.hs-tape.p::before{background:rgba(255,190,205,.8)}
.hs-stamp{display:inline-block;font-family:var(--fs);font-weight:900;color:var(--red);border:4u solid currentColor;border-radius:8u;padding:3u 12u 2u;outline:2u solid currentColor;outline-offset:2u;text-transform:uppercase;letter-spacing:.04em;line-height:1.05;transform:rotate(-6deg);mix-blend-mode:multiply;opacity:.93}
.hs-stamp.green{color:#1f7c3d}.hs-stamp.blue{color:#2450a0}.hs-stamp.gold{color:#b07408}.hs-stamp.ink{color:var(--ink)}
.hs-hl{background:linear-gradient(transparent 52%,rgba(255,216,74,.85) 52%,rgba(255,216,74,.85) 92%,transparent 92%);padding:0 3u}
.hs-ring{border:3u solid var(--red);border-radius:52% 46% 55% 43%/46% 56% 44% 54%}
.hs-hint{min-height:1.2em;font-size:13u;font-weight:800;color:var(--red2);text-align:center;opacity:0;transition:opacity .2s}
.hs-hint.on{opacity:1}.hs-hint.good{color:#1c6d36}.hs-hint.neutral{color:var(--ink2)}
.hs-ico{position:relative;display:block;width:100%;height:100%}
.hs-ico img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
.hs-ico .fb{position:absolute;inset:18%;opacity:.8}.hs-ico .fb svg{width:100%;height:100%}
.hs-pt{position:relative;display:block;width:100%;height:100%;background:radial-gradient(circle at 50% 60%,color-mix(in srgb,var(--pc) 70%,#fff) 0,var(--pc) 70%,color-mix(in srgb,var(--pc) 70%,#000) 100%);overflow:hidden}
.hs-pt .q{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--fs);font-size:46u;color:rgba(255,255,255,.7);text-shadow:0 3u 0 rgba(0,0,0,.25)}
.hs-pt img{position:absolute;inset:6%;width:88%;height:88%;object-fit:contain;filter:drop-shadow(0 4u 3u rgba(0,0,0,.35))}
.hs-pt.ok .q{display:none}
.hs-pt.locked{background:radial-gradient(circle at 50% 60%,#8d826f 0,#5d5546 100%)}
.hs-pt.locked img{filter:brightness(0);opacity:.55}
.hs-pt.locked .q{color:rgba(0,0,0,.35);text-shadow:none}.hs-pt.locked.ok .q{display:flex;font-size:28u;align-items:flex-end;padding-bottom:6u}
.hs-photo{position:relative;background:#fffdf5;padding:6u 6u 0;border-radius:2u;box-shadow:0 2u 0 rgba(0,0,0,.18),0 10u 16u -6u rgba(0,0,0,.5)}
.hs-photo>.im{position:relative;display:block;aspect-ratio:1;border:2u solid rgba(42,32,23,.55);overflow:hidden}
.hs-photo::before,.hs-photo::after{content:'';position:absolute;top:2u;width:13u;height:13u;z-index:3;pointer-events:none;background:linear-gradient(135deg,var(--kraft2) 50%,transparent 50%)}
.hs-photo::before{left:2u}
.hs-photo::after{right:2u;transform:scaleX(-1)}

/* ---- кнопки ---- */
.hs-btn{pointer-events:auto;position:relative;display:inline-flex;align-items:center;justify-content:center;gap:8u;min-height:46u;padding:8u 18u;font-family:var(--fs);font-weight:900;font-size:18u;line-height:1.05;letter-spacing:.02em;text-transform:uppercase;text-align:center;color:#fff8e6;background:var(--red);border:3u solid var(--ink);border-radius:5u 10u 6u 11u;box-shadow:0 4u 0 var(--ink),inset 0 2u 0 rgba(255,255,255,.25);text-shadow:0 2u 0 rgba(0,0,0,.28);transition:transform .12s,box-shadow .12s,filter .15s}
.hs-btn svg{width:22u;height:22u;flex:none}
.hs-btn:hover{transform:translateY(-1u)}
.hs-btn:active{transform:translateY(3u);box-shadow:0 1u 0 var(--ink)}
.hs-btn.paper{background:var(--paper);color:var(--ink);text-shadow:none}
.hs-btn.hl{background:var(--hl);color:var(--ink);text-shadow:none}
.hs-btn.green{background:var(--green)}
.hs-btn.blue{background:var(--blue)}
.hs-btn.ink{background:var(--ink)}
.hs-btn.off{filter:grayscale(.9) brightness(.92);opacity:.72}
.hs-btn .sub{display:block;font-family:var(--ft);font-size:11u;font-weight:800;text-transform:none;letter-spacing:0;opacity:.85;margin-top:2u}
.hs-btn .col{display:flex;flex-direction:column;align-items:center}
.hs-x{pointer-events:auto;position:relative;flex:none;width:44u;height:44u;border-radius:50%;background:var(--paper);border:3u solid var(--ink);box-shadow:0 3u 0 var(--ink);color:var(--red);display:flex;align-items:center;justify-content:center;transition:transform .12s}
.hs-x svg{width:20u;height:20u}.hs-x:active{transform:translateY(3u);box-shadow:0 0 0 var(--ink)}
.hs-shake{animation:hs-shake .38s ease both}

/* ---- счётчики-билетики ---- */
.hs-pill{position:relative;display:flex;align-items:center;gap:6u;height:38u;padding:0 12u 0 34u;min-width:78u;font-family:var(--fs);font-weight:900;font-size:19u;color:var(--ink);background:var(--paper);border:3u solid var(--ink);border-radius:4u 12u 12u 4u;box-shadow:0 3u 0 var(--ink);pointer-events:auto}
.hs-pill-ic{position:absolute;left:-12u;top:50%;width:44u;height:44u;margin-top:-22u;object-fit:contain;filter:drop-shadow(0 2u 1u rgba(0,0,0,.4))}
.hs-pill-n{flex:1;text-align:right;font-variant-numeric:tabular-nums}
.hs-pill.gem{background:#dcf1ee}
.hs-pill.hasplus{padding-right:4u}
.hs-plus{pointer-events:auto;flex:none;width:28u;height:28u;margin-left:2u;border-radius:50%;background:var(--green);color:#fff;border:2.5u solid var(--ink);font-family:var(--fs);font-size:20u;line-height:1;display:flex;align-items:center;justify-content:center;padding-bottom:2u}
.hs-pill.bump{animation:hs-bump .4s ease}
.hs-pill.mini{height:32u;font-size:16u;padding-left:30u;min-width:0}.hs-pill.mini .hs-pill-ic{width:38u;height:38u;margin-top:-19u}

/* ---- общий каркас экранов ---- */
.hs-screen{position:absolute;inset:0;display:none;pointer-events:none}
.hs-screen.on{display:block}
.hs-win.on{display:flex;align-items:center;justify-content:center;pointer-events:auto;background:rgba(36,24,12,.62)}
.hs-win.in .hs-sheet{animation:hs-pageIn .38s cubic-bezier(.2,1.1,.4,1) both}
.hs-win.out{opacity:0;transition:opacity .22s}
.hs-sheet{position:relative;display:flex;flex-direction:column;width:min(1060u,calc(100% - 24u));height:min(640u,calc(100% - 22u));padding:16u 22u 18u 30u;min-height:0}
.hs-sheet::after{content:'';position:absolute;left:0;top:0;bottom:0;width:15u;background:repeating-linear-gradient(180deg,transparent 0 22u,rgba(42,32,23,.55) 22u 34u,transparent 34u 56u);-webkit-mask:radial-gradient(circle at 6u 28u,#000 5u,transparent 5.5u) 0 0/15u 56u repeat-y;mask:radial-gradient(circle at 6u 28u,#000 5u,transparent 5.5u) 0 0/15u 56u repeat-y;opacity:.55;pointer-events:none}
.sh-head{display:flex;align-items:center;gap:12u;flex:none;margin-bottom:10u}
.sh-title{font-family:var(--fs);font-size:34u;line-height:1;color:var(--ink);margin-right:auto;white-space:nowrap}
.sh-title small{display:block;font-family:var(--ft);font-size:12u;font-weight:800;color:var(--ink2);margin-top:4u;letter-spacing:0;white-space:normal}
.sh-wallet{display:flex;gap:16u;align-items:center;padding-left:12u}
.hs-body{flex:1;min-height:0;display:flex;gap:18u}

/* ---- МЕНЮ: обложка журнала ---- */
.hs-menu.on{display:block}
.m-l,.m-r{position:absolute;top:3.5%;bottom:3.5%;display:flex;flex-direction:column;pointer-events:none}
.m-l{left:2.6%;width:31%;max-width:520px;justify-content:space-between}
.m-r{right:2.6%;width:30%;max-width:500px;gap:14u}
.m-logo{position:relative;align-self:flex-start;transform:rotate(-3deg);padding:6u 0 0 4u}
.m-logo .l1{display:inline-block;font-family:var(--fs);font-size:19u;letter-spacing:.14em;color:var(--paper);background:var(--ink);padding:5u 12u 4u;transform:rotate(1.5deg);box-shadow:0 3u 0 rgba(0,0,0,.35)}
.m-logo .l2{display:block;font-family:var(--fs);font-size:68u;line-height:.92;color:var(--red);letter-spacing:.01em;margin:4u 0 0 -2u;text-shadow:3u 0 0 var(--ink),-3u 0 0 var(--ink),0 3u 0 var(--ink),0 -3u 0 var(--ink),3u 3u 0 var(--ink),-3u 3u 0 var(--ink),3u -3u 0 var(--ink),-3u -3u 0 var(--ink),0 8u 0 var(--ink),0 14u 14u rgba(0,0,0,.4)}
.m-logo .l3{display:inline-block;margin:10u 0 0 6u;padding:3u 10u;font-size:14u;font-style:italic;font-weight:800;color:var(--ink);background:var(--hl);transform:rotate(-1.5deg);box-shadow:0 2u 0 rgba(0,0,0,.3)}
.m-case{position:relative;pointer-events:auto;padding:14u 16u 16u;transform:rotate(-1.2deg);display:flex;flex-direction:column;gap:10u}
.cs-no{font-family:var(--fs);font-size:14u;color:var(--red);letter-spacing:.08em}
.cs-name{font-family:var(--fs);font-size:30u;line-height:1.02;color:var(--ink);word-break:break-word}
.cs-sub{font-size:12u;font-weight:800;color:var(--ink2);font-style:italic}
.cs-marks{display:grid;grid-template-columns:repeat(10,1fr);gap:4u}
.cs-marks .mk{position:relative;aspect-ratio:1;border-radius:50%;border:2.5u dashed rgba(42,32,23,.4);display:flex;align-items:center;justify-content:center;font-family:var(--fs);font-size:11u;color:rgba(42,32,23,.45)}
.cs-marks .mk.done{border:2.5u solid var(--red);color:var(--red);transform:rotate(-8deg)}
.cs-marks .mk.done::after{content:'';position:absolute;inset:-3u;border:2u solid var(--red);border-radius:48% 52% 46% 54%;opacity:.5;transform:rotate(14deg)}
.cs-marks .mk.cur{border:3u solid var(--ink);background:var(--hl);color:var(--ink);transform:scale(1.22);box-shadow:0 2u 0 var(--ink)}
.hs-play{position:relative;width:100%;min-height:82u;font-size:44u;gap:12u;padding:10u 20u;transform:rotate(1.2deg);animation:hs-playPulse 2.2s ease-in-out infinite}
.hs-play svg{width:34u;height:34u}
.hs-play:hover{transform:rotate(1.2deg) translateY(-2u)}
.m-rank{display:flex;align-items:center;gap:10u;align-self:flex-start;padding:7u 14u 8u 12u;transform:rotate(1deg);background:var(--paper2);border:2.5u solid var(--ink);border-radius:3u 10u 3u 10u;box-shadow:0 3u 0 var(--ink);pointer-events:none;min-width:200u}
.m-rank b{font-family:var(--fs);font-size:15u;letter-spacing:.04em;white-space:nowrap}
.hs-bar{position:relative;flex:1;height:12u;border:2.5u solid var(--ink);border-radius:8u;background:#fff9e8;overflow:hidden}
.hs-bar i{position:absolute;left:0;top:0;bottom:0;width:calc(var(--f,0)*100%);background:repeating-linear-gradient(135deg,var(--green) 0 6u,#41b765 6u 12u);transition:width .5s}
.m-wallet{display:flex;gap:18u;justify-content:flex-end;padding:6u 4u 0 14u;pointer-events:auto}
.m-dex{position:relative;pointer-events:auto;padding:12u 14u 12u;transform:rotate(1.2deg);display:flex;flex-direction:column;gap:7u;text-align:left}
.m-dex .dx-h{display:flex;align-items:center;gap:8u}
.m-dex .dx-t{font-family:var(--fs);font-size:23u;line-height:1}
.m-dex .dx-n{margin-left:auto;font-family:var(--fs);font-size:20u;color:var(--red)}
.dx-dots{display:grid;grid-template-columns:repeat(15,1fr);gap:3u}
.dx-dots i{aspect-ratio:1;border-radius:50%;border:2u solid var(--ink);background:transparent;opacity:.5}
.dx-dots i.f{background:var(--c,var(--red));opacity:1}
.m-dex .dx-inc{font-size:12u;font-weight:800;color:var(--ink2)}
.hs-badge{position:absolute;right:-8u;top:-12u;z-index:3;font-family:var(--fs);font-size:13u;color:#fff;background:var(--red);padding:3u 9u 2u;border:2.5u solid var(--ink);border-radius:8u;transform:rotate(8deg);box-shadow:0 2u 0 var(--ink);animation:hs-wob 1.4s ease-in-out infinite;pointer-events:none}
.m-tabs{display:flex;flex-wrap:wrap;gap:12u 12u;justify-content:space-between;pointer-events:none;padding:4u 2u 0}
.bm{position:relative;pointer-events:auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4u;font-family:var(--fs);font-size:14u;text-align:center;line-height:1.05;color:var(--ink);transition:transform .14s}
.bm svg{width:34u;height:34u}
.bm:hover{transform:translateY(-3u) rotate(0)!important}.bm:active{transform:translateY(2u)!important}
.bm.gear{flex:1 1 44%;min-height:82u;padding:8u 6u;background-color:#cfe3f5;color:#1c3f73;border:2.5u solid #1c3f73;border-radius:3u;box-shadow:0 4u 0 #1c3f73;transform:rotate(-2deg);background-image:linear-gradient(rgba(28,63,115,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(28,63,115,.22) 1px,transparent 1px);background-size:11u 11u}
.bm.shop{flex:1 1 48%;min-height:82u;padding:8u 12u 8u 22u;background:var(--kraft);border:2.5u solid #5c3b12;border-radius:4u 14u 14u 4u;box-shadow:0 4u 0 #5c3b12;transform:rotate(1.4deg);background-image:radial-gradient(rgba(90,58,20,.18) 1px,transparent 1.8px);background-size:6px 6px}
.bm.shop::before{content:'';position:absolute;left:8u;top:50%;width:9u;height:9u;margin-top:-4.5u;border-radius:50%;background:var(--paper);border:2u solid #5c3b12}
.bm.gift{flex:1 1 30%;min-height:78u;padding:8u 6u;background:#fff1a0;border:2.5u solid var(--ink);border-radius:2u;box-shadow:0 4u 0 var(--ink),0 0 0 0;transform:rotate(2.6deg)}
.bm.wheel{flex:0 0 76u;height:76u;margin:0 auto;border-radius:50%;background:conic-gradient(#ff7a6e 0 25%,#ffd84a 0 50%,#6bd3a0 0 75%,#7fb2ff 0);border:3u solid var(--ink);box-shadow:0 4u 0 var(--ink);color:var(--ink);transform:rotate(-8deg);font-size:12u;overflow:hidden}
.bm.wheel span{background:var(--paper);padding:2u 6u;border:2u solid var(--ink);border-radius:6u}
.bm.wheel svg{display:none}
.bm.attn::after{content:'';position:absolute;right:-4u;top:-4u;width:16u;height:16u;border-radius:50%;background:var(--red);border:2.5u solid var(--ink);animation:hs-wob 1.1s ease-in-out infinite}
.bm.gift.attn{animation:hs-giftWob 2.6s ease-in-out infinite}
.m-mini{display:flex;gap:10u;justify-content:flex-end;padding:2u 2u 0;pointer-events:none}
.pin{pointer-events:auto;position:relative;width:46u;height:46u;border-radius:50%;background:var(--paper);border:3u solid var(--ink);box-shadow:0 3u 0 var(--ink);color:var(--ink);display:flex;align-items:center;justify-content:center;transition:transform .12s}
.pin svg{width:24u;height:24u}.pin:active{transform:translateY(3u);box-shadow:0 0 0 var(--ink)}
.pin.off{color:#8c7b64;background:#e4d8bd}
.hs-menu.in .m-l>*{animation:hs-slideL .5s cubic-bezier(.2,1,.3,1) both}
.hs-menu.in .m-r>*{animation:hs-slideR .5s cubic-bezier(.2,1,.3,1) both}
.hs-menu.in .m-r>*:nth-child(2){animation-delay:.05s}.hs-menu.in .m-r>*:nth-child(3){animation-delay:.1s}.hs-menu.in .m-r>*:nth-child(4){animation-delay:.15s}
.hs-menu.in .m-l>*:nth-child(2){animation-delay:.08s}.hs-menu.in .m-l>*:nth-child(3){animation-delay:.16s}
.hs-menu.out{opacity:0;transition:opacity .22s}

/* портрет: герой сверху, листы журнала снизу */
.hs-p .hs-menu.on{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-rows:auto 1fr auto auto auto auto;padding:max(8u,env(safe-area-inset-top)) 10u max(8u,env(safe-area-inset-bottom));gap:7u}
.hs-p .m-l,.hs-p .m-r{display:contents}
.hs-p .m-logo{grid-area:1/1;transform:rotate(-2deg) scale(.82);transform-origin:left top;align-self:start}
.hs-p .m-wallet{grid-area:1/2;flex-direction:column;gap:12u;padding:6u 6u 0 16u;align-items:flex-end}
.hs-p .m-case{grid-area:3/1/4/3}
.hs-p .m-rank{display:none}
.hs-p .hs-menu.on>*,.hs-p .m-l>*,.hs-p .m-r>*{min-width:0}
.cs-top{display:flex;align-items:baseline;justify-content:space-between;gap:8u}
.cs-rk{display:none;font-family:var(--fs);font-size:12u;color:var(--ink2)}
.hs-p .cs-rk{display:block}
.hs-p .m-dex{grid-area:4/1/5/3;flex-direction:row;align-items:center;flex-wrap:wrap;padding:8u 12u}
.hs-p .m-dex .dx-h{flex:1 1 100%}.hs-p .m-dex .dx-dots{flex:1 1 55%}.hs-p .m-dex .dx-inc{flex:1 1 38%}
.hs-p .m-tabs{grid-area:5/1/6/3;flex-wrap:nowrap;gap:9u}
.hs-p .bm{flex:1 1 0!important;min-width:0;min-height:68u!important;height:68u;font-size:12u}.hs-p .bm svg{width:28u;height:28u}
.hs-p .bm.wheel{flex:0 0 68u!important;height:68u;width:68u;margin:0}
.hs-p .m-mini{grid-area:6/1/7/3;justify-content:center}
.hs-p .hs-play{min-height:66u;font-size:36u}
.hs-p .m-case{padding:10u 12u 12u;gap:7u}.hs-p .cs-name{font-size:25u}
/* низкий ландшафт */
.hs-low .m-logo .l2{font-size:48u}.hs-low .m-logo .l3{display:none}
.hs-low .m-case{gap:6u;padding:10u 12u 12u}.hs-low .cs-name{font-size:23u}.hs-low .hs-play{min-height:60u;font-size:32u}
.hs-low .bm.gear,.hs-low .bm.shop,.hs-low .bm.gift{min-height:62u}.hs-low .bm svg{width:26u;height:26u}.hs-low .m-r{gap:8u}.hs-low .m-rank{display:none}

/* ---- HUD ---- */
.hs-hud{position:absolute;inset:0;pointer-events:none;z-index:1}
.hs-tall .hs-ticket .t{font-size:34u}.hs-tall .hs-ticket .cap{font-size:9u;max-width:108u}
.hs-tall .hs-list{padding:4u 6u 4u 8u;gap:3u}.hs-tall .hs-list .lh{font-size:10u}.hs-tall .hs-list .lh b{font-size:20u}.hs-tall .hs-list .bx{gap:3u}.hs-tall .hs-list .bx i{width:12u;height:12u;border-width:2u}
.hs-tall .hs-lvlb{gap:5u;padding:0 6u}.hs-tall .hs-lvlb b{font-size:10u}
.hs-tall .hs-wal{gap:8u}.hs-tall .hs-wal .hs-pill{font-size:14u;height:30u;min-width:70u;padding-left:26u}.hs-tall .hs-wal .hs-pill-ic{width:34u;height:34u;margin-top:-17u}
.hs-p .hs-bn .st{font-size:30u;padding:5u 12u 4u}.hs-p .hs-bn.gold .st{font-size:36u}.hs-p .hs-bn .nm{font-size:14u}.hs-p .hs-bn.tape .tp{font-size:17u;padding:8u 14u}
.hs-hb{pointer-events:none}
.hs-fit{position:absolute;left:0;top:0;transform-origin:0 0;transform:scale(var(--fit,1))}
.hs-ticket{position:absolute;inset:0 0 14u 0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--paper);border:3u solid var(--ink);border-radius:5u;box-shadow:0 4u 0 var(--ink);-webkit-mask:radial-gradient(circle 7u at 0 50%,transparent 6u,#000 6.5u) left/51% 100% no-repeat,radial-gradient(circle 7u at 100% 50%,transparent 6u,#000 6.5u) right/51% 100% no-repeat;mask:radial-gradient(circle 7u at 0 50%,transparent 6u,#000 6.5u) left/51% 100% no-repeat,radial-gradient(circle 7u at 100% 50%,transparent 6u,#000 6.5u) right/51% 100% no-repeat}
.hs-tk{position:absolute;inset:0 0 14u 0;filter:drop-shadow(0 4u 0 rgba(42,32,23,.45))}
.hs-tk .hs-ticket{inset:0}
.hs-ticket .cap{font-family:var(--ft);font-weight:800;font-size:11u;letter-spacing:.06em;color:var(--ink2);text-transform:uppercase;max-width:140u;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:4u}
.hs-ticket .t{font-family:var(--fs);font-size:44u;line-height:1;color:var(--ink);font-variant-numeric:tabular-nums;letter-spacing:.02em}
.hs-tk.low .hs-ticket{background:#ffd9d3;border-color:var(--red2)}.hs-tk.low .t{color:var(--red);animation:hs-tick .5s ease-in-out infinite alternate}
.hs-tk.pen{animation:hs-shake .45s ease both}
.hs-boost{position:absolute;left:10u;right:10u;bottom:0;height:11u;border:2.5u solid var(--ink);border-radius:8u;background:#fff9e8;overflow:hidden;opacity:0;transition:opacity .2s}
.hs-boost.on{opacity:1}.hs-boost i{display:block;height:100%;width:calc(var(--b,0)*100%);background:repeating-linear-gradient(135deg,var(--hl) 0 6u,#ffb42e 6u 12u)}
.hs-list{position:absolute;inset:0;padding:6u 10u 6u 12u;display:flex;flex-direction:column;justify-content:center;gap:5u;background:var(--paper2);border:3u solid var(--ink);border-radius:3u 12u 3u 12u;box-shadow:0 4u 0 var(--ink);transform:rotate(-1.4deg)}
.hs-list .lh{display:flex;align-items:baseline;justify-content:space-between;font-family:var(--fs);font-size:12u;letter-spacing:.06em;color:var(--ink2)}
.hs-list .lh b{font-size:26u;color:var(--red);letter-spacing:0;line-height:1}
.hs-list .bx{display:flex;gap:4u;flex-wrap:wrap}
.hs-list .bx i{position:relative;width:15u;height:15u;border:2.5u solid var(--ink);border-radius:3u;background:#fff9e8;flex:none}
.hs-list .bx i.d::after{content:'';position:absolute;left:1u;top:-6u;width:14u;height:10u;border-left:3.5u solid var(--red);border-bottom:3.5u solid var(--red);transform:rotate(-45deg) scale(1.1);transform-origin:left bottom;animation:hs-tickIn .3s ease both}
.hs-lvlb{position:absolute;inset:0;display:flex;align-items:center;gap:8u;padding:0 10u 0 8u;background:var(--paper);border:2.5u solid var(--ink);border-radius:3u 10u 3u 10u;box-shadow:0 3u 0 var(--ink)}
.hs-lvlb b{font-family:var(--fs);font-size:13u;letter-spacing:.04em;white-space:nowrap}
.hs-lvlb .hs-bar{height:11u}
.hs-wal{position:absolute;inset:0;display:flex;flex-direction:column;align-items:flex-end;gap:12u;padding:2u 2u 0 18u}
.hs-wal .hs-pill{pointer-events:none;height:34u;font-size:17u;padding-left:30u;min-width:100u;transform:rotate(1deg)}
.hs-wal .hs-pill-ic{width:40u;height:40u;margin-top:-20u}
.hs-sound{pointer-events:auto;position:absolute;right:2u;top:2u;width:40u;height:40u}
.hs-sound.pin{width:40u;height:40u}.hs-sound svg{width:22u;height:22u}
.hs-tools{position:absolute;inset:0}
.tb{pointer-events:auto;position:absolute;display:flex;align-items:center;justify-content:center;border-radius:50%;background:var(--paper);border:4u solid var(--ink);box-shadow:0 5u 0 var(--ink),0 10u 14u rgba(0,0,0,.35);color:var(--ink);touch-action:none;transition:transform .1s,box-shadow .1s,filter .2s}
.tb:active{transform:translateY(4u);box-shadow:0 1u 0 var(--ink)}
.tb .ic{width:46%;height:46%;display:flex}.tb .ic svg{width:100%;height:100%}
.tb .cd{position:absolute;inset:0;border-radius:50%;background:conic-gradient(rgba(42,32,23,.62) calc(var(--cd,0)*1%),transparent 0);pointer-events:none}
.tb .rg{position:absolute;inset:-9u;border-radius:50%;border:3u dashed var(--hl);opacity:0;pointer-events:none}
.tb .lb{position:absolute;left:50%;bottom:-13u;transform:translateX(-50%) rotate(-2deg);font-family:var(--fs);font-size:11u;letter-spacing:.04em;background:var(--hl);color:var(--ink);padding:2u 8u 1u;border:2u solid var(--ink);border-radius:3u;white-space:nowrap;pointer-events:none}
.tb .key{position:absolute;right:-6u;top:-8u;min-width:24u;height:24u;padding:0 6u;border-radius:6u;background:var(--ink);color:var(--paper);font-family:var(--fs);font-size:11u;display:none;align-items:center;justify-content:center;pointer-events:none}
.hs-kb .tb .key{display:flex}
.tb .sec{position:absolute;inset:0;display:none;align-items:center;justify-content:center;font-family:var(--fs);font-size:22u;color:#fff;text-shadow:0 2u 0 #000;pointer-events:none}
.tb.cool .sec{display:flex}.tb.cool{filter:saturate(.7)}
.tb.net{right:0;bottom:16u;width:98u;height:98u;background:var(--red);color:#fff8e6}
.tb.radar{right:14u;bottom:134u;width:78u;height:78u;background:var(--hl)}
.tb.check{right:116u;bottom:16u;width:78u;height:78u;background:#c9efe3}
.tb.check:not(.near){filter:grayscale(.55) brightness(.94)}
.tb.check.near{animation:hs-nearPulse .9s ease-in-out infinite}
.tb.check.near .rg{opacity:1}
.tb.radar.on .rg{opacity:1;animation:hs-spin 3s linear infinite}
.tb.ready{animation:hs-ready .5s ease}
.hs-row .tb.net{right:0;bottom:12u;width:80u;height:80u}.hs-row .tb.radar{right:92u;bottom:12u;width:68u;height:68u}.hs-row .tb.check{right:172u;bottom:12u;width:68u;height:68u}
.hs-temp{position:absolute;right:98u;bottom:150u;font-family:var(--fs);font-size:17u;padding:4u 10u 3u;border:3.5u solid currentColor;outline:2u solid currentColor;outline-offset:2u;border-radius:6u;background:rgba(246,237,214,.92);transform:rotate(-6deg);opacity:0;transition:opacity .15s;white-space:nowrap;pointer-events:none}
.hs-temp.on{opacity:1}.hs-temp.hot{color:#d6372c}.hs-temp.warm{color:#d07a0c}.hs-temp.cold{color:#2b5db0}
.hs-row .hs-temp{right:174u;bottom:70u}
.hs-arrow{position:absolute;left:0;top:0;width:60u;height:46u;margin:-23u 0 0 -30u;pointer-events:none;opacity:0;will-change:transform,opacity;z-index:2;color:var(--hl);filter:drop-shadow(0 3u 0 rgba(42,32,23,.55))}
.hs-arrow.on{opacity:1}.hs-arrow svg{width:100%;height:100%;animation:hs-arrowpulse .5s ease-in-out infinite alternate}
.hs-arrow.hot{color:#ff5a43}.hs-arrow.cold{color:#7fb2ff}.hs-arrow.warm{color:#ffb42e}
.hs-pen{position:absolute;inset:0;pointer-events:none;opacity:0;background:radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(214,55,44,.5) 100%);z-index:1}
.hs-tags{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:1}
.hs-tag{position:absolute;left:0;top:0;will-change:transform}
.hs-tag-in{position:absolute;left:0;top:0;transform:translate(-50%,-100%) rotate(-2deg);display:flex;align-items:center;gap:5u;padding:3u 10u 4u;background:#fff7d6;border:2.5u solid var(--ink);border-bottom:5u solid var(--rc,#8fb6d9);border-radius:2u;box-shadow:0 3u 0 rgba(42,32,23,.4);font-size:13u;font-weight:900;line-height:1.1;white-space:nowrap;color:var(--ink);margin-top:-6u}
.hs-tag-in::before{content:'';position:absolute;left:50%;top:-9u;width:34u;height:13u;margin-left:-17u;background:rgba(255,222,110,.8);transform:rotate(-3deg);clip-path:polygon(0 0,5% 30%,0 60%,5% 100%,100% 100%,95% 60%,100% 30%,95% 0)}
.hs-tag .fl{display:none;font-size:11u;font-style:italic;color:var(--red2)}
.hs-tag.s-fleeing .fl{display:inline}
.hs-tag.s-fleeing .hs-tag-in{animation:hs-tagShake .4s ease-in-out infinite alternate}
.hs-tag .cg{display:none;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(-10deg);font-family:var(--fs);font-size:14u;color:var(--red);border:3u solid var(--red);outline:2u solid var(--red);outline-offset:1u;padding:2u 8u 1u;background:rgba(255,247,214,.88);border-radius:5u;mix-blend-mode:multiply}
.hs-tag.s-caught .cg{display:block}.hs-tag.s-caught .tx{opacity:.35}
.hs-floats{position:absolute;inset:0;pointer-events:none;z-index:3}
.hs-float{position:absolute;left:0;top:0;display:flex;align-items:center;gap:5u;font-family:var(--fs);font-size:24u;color:#fff8e6;white-space:nowrap;will-change:transform,opacity;text-shadow:0 3u 0 var(--ink),2u 0 0 var(--ink),-2u 0 0 var(--ink),0 -2u 0 var(--ink)}
.hs-float img{width:28u;height:28u}
.hs-float.gem{color:#bff3ee}.hs-float.xp{color:#c9f2a6}.hs-float.power{color:var(--hl)}.hs-float.penalty{color:#ff8b7c;font-size:30u}.hs-float.dex{color:#ffe066}
.hs-banner{position:absolute;left:0;right:0;top:var(--bt,22%);display:flex;flex-direction:column;align-items:center;gap:6u;pointer-events:none;z-index:4}
.hs-bn{position:relative;display:flex;flex-direction:column;align-items:center;max-width:calc(100% - 24u);animation:hs-bnIn .45s cubic-bezier(.2,1.4,.4,1) both,hs-bnOut .3s ease-in calc(var(--ms,2000)*1ms - 300ms) forwards}
.hs-bn .st{font-size:46u;padding:6u 20u 5u;text-align:center;background:rgba(246,237,214,.9)}
.hs-bn.shaking .st{animation:hs-shake .5s ease .1s both}
.hs-bn.green .st{color:#1f7c3d}.hs-bn.blue .st{color:#2450a0}.hs-bn.gold .st{color:#b07408;font-size:54u;background:#fff6c4}
.hs-bn .nm{margin-top:8u;font-size:17u;font-weight:900;background:var(--paper);border:2.5u solid var(--ink);padding:3u 12u;border-radius:3u;box-shadow:0 3u 0 var(--ink);transform:rotate(1.5deg);max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hs-bn.tape .tp{font-family:var(--fs);font-size:23u;padding:10u 24u 9u;background:var(--kraft);border:3u solid #5c3b12;box-shadow:0 5u 0 #5c3b12;transform:rotate(-1.5deg);color:var(--ink);text-align:center;text-transform:uppercase;line-height:1.1}
.hs-bn.note .sn{font-size:16u;font-weight:900;padding:7u 14u 8u;background:#fff1a0;border:2.5u solid var(--ink);box-shadow:0 4u 0 var(--ink);transform:rotate(-2deg);max-width:100%}
.hs-bn.note .sn b{font-family:var(--fs);color:var(--red2);font-weight:900}
.hs-bn.fancy .ph{width:96u;height:96u;margin:4u auto 0;transform:rotate(4deg)}
.hs-wait{position:absolute;left:50%;top:calc(var(--bt,22%) + 58u);transform:translateX(-50%);display:none;align-items:center;gap:12u;padding:8u 18u 8u 12u;background:var(--paper);border:3u solid var(--ink);border-radius:4u;box-shadow:0 5u 0 var(--ink);font-size:15u;font-weight:900;white-space:nowrap;z-index:3;pointer-events:none;rotate:-1.5deg}
.hs-wait.on{display:flex}
.hs-wait b{display:flex;align-items:center;justify-content:center;width:46u;height:46u;font-family:var(--fs);font-size:30u;color:var(--red);padding-bottom:2u}
.hs-wait b.pop{animation:hs-bump .35s ease}
.hs-fxl{position:absolute;inset:0;pointer-events:none;z-index:8}
.hs-fly,.hs-bst{position:absolute;left:0;top:0;width:24u;height:24u;margin:-12u 0 0 -12u;background:center/contain no-repeat;pointer-events:none;will-change:transform,opacity}
.hs-bst{width:14u;height:14u;margin:-7u 0 0 -7u;background:var(--c,#ffd84a);clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)}

/* ---- окна: общие карточки магазина, подарков ---- */
.hs-tabs{display:flex;gap:6u;flex:none;margin:2u 0 10u;overflow-x:auto;padding:0 2u 4u;scrollbar-width:none;flex-wrap:wrap}
.hs-tabs::-webkit-scrollbar{display:none}
.hs-tab{pointer-events:auto;flex:none;display:flex;align-items:center;gap:6u;padding:7u 12u 6u;min-height:40u;font-family:var(--fs);font-size:13u;letter-spacing:.03em;background:var(--paper2);border:2.5u solid var(--ink);border-radius:8u 8u 2u 2u;color:var(--ink2);box-shadow:0 3u 0 rgba(42,32,23,.45);transition:transform .12s}
.hs-tab svg{width:20u;height:20u}
.hs-tab.on{background:var(--hl);color:var(--ink);transform:translateY(-3u);box-shadow:0 5u 0 var(--ink)}
.hs-sh-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112u,1fr));gap:12u 10u;align-content:start;padding:10u 6u 12u 4u}
.ic{position:relative;pointer-events:auto;display:flex;flex-direction:column;align-items:stretch;text-align:center;font-weight:800;color:var(--ink);transition:transform .12s;transform:rotate(var(--r,0deg))}
.ic .hs-photo{padding-bottom:4u}
.ic .im{background:radial-gradient(circle at 50% 55%,var(--rca,rgba(143,182,217,.35)),transparent 72%),var(--paper2)}
.ic .hs-photo{outline:3u solid var(--rc,#8fb6d9);outline-offset:-1u}
.ic .im .hs-ico{padding:8%}
.ic:hover{transform:rotate(0) translateY(-2u)}
.ic.sel .hs-photo{outline-width:5u;box-shadow:0 0 0 3u var(--ink),0 12u 16u -6u rgba(0,0,0,.55)}
.ic .nm{font-size:11u;line-height:1.1;margin:5u 0 2u;min-height:2.2em;display:flex;align-items:center;justify-content:center}
.ic .pr{display:flex;align-items:center;justify-content:center;gap:4u;font-family:var(--fs);font-size:12u;min-height:18u;color:var(--ink)}
.ic .pr img{width:16u;height:16u}
.ic .pr.cant{color:var(--red2)}.ic .pr.ad{color:#8a4a00}
.ic .st-eq,.ic .st-own,.ic .st-lock{position:absolute;right:-4u;top:-8u;z-index:4;display:flex;align-items:center;justify-content:center;width:26u;height:26u;border-radius:50%;border:2.5u solid var(--ink);color:#fff}
.ic .st-eq{background:var(--green)}.ic .st-own{background:var(--blue)}.ic .st-lock{background:var(--ink2)}
.ic .st-eq svg,.ic .st-own svg,.ic .st-lock svg{width:14u;height:14u}
.ic .sw{position:absolute;left:8u;bottom:8u;display:flex;gap:3u;z-index:3}
.ic .sw i{width:12u;height:12u;border-radius:50%;border:2u solid var(--ink)}
.hs-prev{flex:0 0 36%;max-width:340u;display:flex;flex-direction:column;align-items:center;gap:9u;padding:14u 14u 12u;margin:6u 4u 4u 0;background:var(--kraft);border-radius:3u;transform:rotate(.8deg);overflow:hidden;--rc:#8fb6d9}
.hs-prev .stage{position:relative;width:100%;aspect-ratio:1.25;max-height:200u;display:flex;align-items:center;justify-content:center}
.hs-prev .stage .hs-photo{width:62%;max-width:190u;transform:rotate(-2.5deg);outline:4u solid var(--rc);outline-offset:-1u}
.hs-prev .stage .im{background:radial-gradient(circle at 50% 55%,var(--rca,transparent),transparent 72%),var(--paper2)}
.hs-prev .stage .im .hs-ico{padding:6%}
.hs-prev .stage .im .hs-ico.swap{animation:hs-pop .35s ease}
.hs-prev .pn{font-family:var(--fs);font-size:21u;line-height:1.05;text-align:center;color:var(--ink)}
.hs-prev .pm{display:flex;gap:8u;align-items:center;justify-content:center;flex-wrap:wrap}
.hs-prev .rr{font-family:var(--fs);font-size:12u;padding:3u 9u 2u;border:2.5u solid var(--rc);color:var(--rc);background:rgba(255,255,255,.8);border-radius:5u;filter:brightness(.82)}
.hs-prev .stt{font-family:var(--fs);font-size:11u;color:var(--ink);background:var(--paper);padding:3u 8u 2u;border:2u solid var(--ink);border-radius:5u;display:flex;gap:4u;align-items:center}
.hs-prev .stt svg{width:13u;height:13u}
.hs-prev .stt.eq{background:#bde7c5}.hs-prev .stt.own{background:#c9dcf7}
.hs-prev .prc{display:flex;align-items:center;justify-content:center;gap:6u;font-family:var(--fs);font-size:23u;color:var(--ink);min-height:30u;text-align:center}
.hs-prev .prc img{width:30u;height:30u}.hs-prev .prc.cant{color:var(--red2)}
.hs-prev .prc.ad{flex-direction:column;gap:5u;font-size:15u;width:100%}
.hs-prev .prc .bar{width:100%;height:12u;border:2.5u solid var(--ink);border-radius:8u;background:#fff9e8;overflow:hidden}
.hs-prev .prc .bar i{display:block;height:100%;width:calc(var(--p,0)*100%);background:repeating-linear-gradient(135deg,#ffb42e 0 6u,var(--hl) 6u 12u);transition:width .4s}
.hs-prev .prc.bump{animation:hs-bump .4s ease}
.hs-prev .acts{display:flex;flex-direction:column;gap:7u;width:100%;margin-top:auto}
.hs-prev .acts .hs-btn{width:100%}
.hs-prev .gs{display:flex;gap:7u;font-size:11u;font-weight:800;justify-content:center;flex-wrap:wrap;color:var(--ink2)}
.hs-prev .gs span{display:flex;align-items:center;gap:4u}.hs-prev .gs i{width:12u;height:12u;border-radius:50%;border:2u solid var(--ink)}
.hs-prev.flash{animation:hs-flash .6s ease}
.hs-peek{position:absolute;left:50%;bottom:max(10u,env(safe-area-inset-bottom));transform:translateX(-50%);width:min(560u,calc(100% - 20u));display:none;align-items:center;gap:10u;padding:10u 14u 12u;pointer-events:auto;z-index:4}
.hs-peek .pi{flex:1;min-width:0;text-align:center}
.hs-peek .pn{font-family:var(--fs);font-size:19u;line-height:1.05}
.hs-peek .pr2{font-size:12u;font-weight:800;color:var(--ink2)}
.hs-win.peek.on{background:transparent;pointer-events:none}
.hs-win.peek .hs-sheet{display:none}
.hs-win.peek .hs-peek{display:flex}
.hs-win:not(.peek) .hs-peek{display:none}
.hs-pcards{display:grid;grid-template-columns:repeat(auto-fit,minmax(200u,1fr));gap:18u;padding:14u 6u;align-content:start}
.hs-pcard{position:relative;display:flex;flex-direction:column;align-items:center;gap:7u;padding:14u 12u 12u;background:var(--paper2);border:3u solid var(--rc);border-radius:3u;box-shadow:0 4u 0 rgba(42,32,23,.45);transform:rotate(var(--r,0deg));text-align:center}
.hs-pcard h3{margin:0;font-family:var(--fs);font-size:18u;line-height:1.05}
.hs-pcard p{margin:0;font-size:12u;font-weight:700;color:var(--ink2);min-height:2.6em}
.hs-pcard .pi{width:74u;height:74u}
.hs-pcard .pk{font-family:var(--fs);font-size:13u;display:flex;gap:10u;align-items:center}
.hs-pcard .pk .have{font-family:var(--ft);font-weight:800;color:var(--ink2)}
.hs-pcard .pk .have.bump{animation:hs-bump .4s ease}
.hs-pcard .pr{display:flex;align-items:center;gap:6u;font-family:var(--fs);font-size:20u}.hs-pcard .pr img{width:26u;height:26u}.hs-pcard .pr.cant{color:var(--red2)}
.hs-pcard .hs-btn{width:100%}
.hs-pcard.flash{animation:hs-flash .6s ease}

/* ---- Брейндекс ---- */
.dex-main{flex:1;min-width:0;display:flex;flex-direction:column;min-height:0}
.dex-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:16u 12u;padding:10u 8u 14u 4u;align-content:start}
.dc{position:relative;pointer-events:auto;display:flex;flex-direction:column;text-align:center;transform:rotate(var(--r,0deg));transition:transform .14s;color:var(--ink)}
.dc:hover{transform:rotate(0) translateY(-3u)}
.dc .hs-photo{outline:3.5u solid var(--rc);outline-offset:-1u}
.dc.sel .hs-photo{outline-width:6u;box-shadow:0 0 0 3u var(--ink),0 12u 16u -6u rgba(0,0,0,.55)}
.dc .no{position:absolute;left:10u;top:10u;z-index:4;font-family:var(--fs);font-size:11u;color:var(--paper);background:var(--ink);padding:2u 6u 1u;border-radius:3u}
.dc .ca{padding:5u 2u 7u;min-height:44u}
.dc .nm{font-family:var(--fs);font-size:12u;line-height:1.08;color:var(--ink);word-break:break-word}
.dc .rw{display:block;margin-top:3u;font-size:10u;font-weight:900;color:var(--rc);filter:brightness(.78);text-transform:uppercase;letter-spacing:.04em}
.dc.un .nm{color:var(--ink2)}
.dc .cn{position:absolute;right:6u;bottom:48u;z-index:4;font-family:var(--fs);font-size:12u;color:#fff;background:var(--red);border:2u solid var(--ink);border-radius:8u;padding:1u 7u}
.dex-side{flex:0 0 31%;max-width:310u;display:flex;flex-direction:column;gap:9u;padding:14u 14u 12u;margin:6u 4u 4u 0;background:#fff3a8;border:2.5u solid var(--ink);box-shadow:0 5u 0 rgba(42,32,23,.4);transform:rotate(-.9deg);min-height:0;overflow:hidden}
.dex-side .big{width:62%;max-width:150u;align-self:center;transform:rotate(2deg)}
.dex-side .pn{font-family:var(--fs);font-size:21u;line-height:1.05}
.dex-side .rr{font-family:var(--fs);font-size:12u;align-self:flex-start;padding:3u 9u 2u;border:2.5u solid var(--rc);color:var(--rc);background:rgba(255,255,255,.7);border-radius:5u;filter:brightness(.8)}
.dex-side .ln{font-size:12.5u;font-weight:800;display:flex;gap:6u;align-items:baseline}
.dex-side .ln b{font-family:var(--fs);color:var(--red2);font-weight:900}
.dex-side .tr{font-size:13u;font-weight:700;font-style:italic;color:var(--ink2);padding-top:6u;border-top:2u dashed rgba(42,32,23,.35)}
.dex-foot{flex:none;font-size:12u;font-weight:800;color:var(--ink2);padding:6u 4u 0;font-style:italic}
.dex-sum{display:flex;gap:10u;align-items:center;flex-wrap:wrap}
.dex-sum .st{font-family:var(--fs);font-size:17u;padding:5u 12u 4u;transform:rotate(-2deg)}
.dex-sum .inc{font-size:12.5u;font-weight:900;background:var(--hl);padding:5u 11u;border:2.5u solid var(--ink);border-radius:3u;transform:rotate(1.2deg);box-shadow:0 3u 0 var(--ink)}

/* ---- Снаряжение: чертежи ---- */
.gear-row{flex:1;display:flex;gap:22u;min-height:0;padding:6u 4u 4u}
.bp{position:relative;flex:1;display:flex;flex-direction:column;gap:10u;padding:18u 18u 16u;color:#17386b;background-color:#d3e6f6;border:3u solid #17386b;border-radius:3u;box-shadow:0 5u 0 #17386b,0 16u 22u -8u rgba(0,0,0,.5);transform:rotate(var(--r,0deg));background-image:linear-gradient(rgba(23,56,107,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(23,56,107,.2) 1px,transparent 1px);background-size:14u 14u;min-width:0}
.bp .bh{display:flex;align-items:center;gap:14u}
.bp .bi{flex:none;width:76u;height:76u;display:flex;align-items:center;justify-content:center;border:3u dashed #17386b;border-radius:50%;background:rgba(255,255,255,.5)}
.bp .bi svg{width:46u;height:46u}
.bp .bn{font-family:var(--fs);font-size:30u;line-height:1}
.bp .bd{font-size:12.5u;font-weight:700;font-style:italic;margin-top:4u;color:#2c5189}
.bp .lv{display:flex;gap:7u;align-items:center}
.bp .lv i{width:22u;height:22u;border-radius:50%;border:3u solid #17386b;background:transparent;transition:background .3s}
.bp .lv i.f{background:var(--red);border-color:var(--red2)}
.bp .lv span{margin-left:auto;font-family:var(--fs);font-size:13u}
.bp .rows{display:flex;flex-direction:column;gap:5u;flex:1;min-height:0;justify-content:center}
.bp .rw{display:flex;align-items:center;gap:8u;padding:6u 10u;background:rgba(255,255,255,.6);border:2u solid rgba(23,56,107,.55);border-radius:3u;font-size:13u;font-weight:800}
.bp .rw .k{flex:1}.bp .rw .a{font-family:var(--fs);font-size:15u;color:#17386b}.bp .rw .ar{width:16u;height:16u;color:var(--red)}
.bp .rw .b{font-family:var(--fs);font-size:15u;color:var(--red2);min-width:56u;text-align:right}
.bp .rw .b.na{color:#6b83a8}
.bp .hs-btn{width:100%}
.bp.flash{animation:hs-flash .6s ease}

/* ---- подарок дня ---- */
.dg-body{flex:1;display:flex;gap:20u;min-height:0;padding:6u 4u}
.dg-days{flex:1.6;display:grid;grid-template-columns:repeat(3,1fr);gap:14u;align-content:center}
.dg-day{position:relative;display:flex;flex-direction:column;align-items:center;gap:6u;padding:20u 8u 10u;background:var(--paper);border:2.5u solid var(--ink);border-radius:3u;box-shadow:0 4u 0 rgba(42,32,23,.4);transform:rotate(var(--r,0deg));text-align:center}
.dg-day::before{content:'';position:absolute;left:0;right:0;top:0;height:14u;background:var(--red);border-bottom:2.5u solid var(--ink);border-radius:1u 1u 0 0}
.dg-day .dt{position:absolute;top:0;left:0;right:0;height:14u;z-index:1;display:flex;align-items:center;justify-content:center;font-family:var(--fs);font-size:9u;color:#fff8e6;letter-spacing:.08em}
.dg-day .dr{display:flex;flex-direction:column;gap:5u;align-items:center;margin-top:8u;min-height:60u;justify-content:center}
.dg-day .ds{font-family:var(--fs);font-size:10u;color:var(--ink2);min-height:1.2em}
.dg-day.today{outline:4u solid var(--hl);box-shadow:0 0 0 7u var(--ink),0 10u 20u rgba(0,0,0,.4);transform:rotate(0) scale(1.06);z-index:2;animation:hs-dayPulse 1.5s ease-in-out infinite}
.dg-day.claimed{opacity:.72;background:#dcd0b4}
.dg-day .ck{position:absolute;right:6u;bottom:6u;width:22u;height:22u;color:var(--green);display:none}.dg-day.claimed .ck{display:block}
.dg-day.claimed .dr{opacity:.45}
.rc{display:flex;align-items:center;gap:5u;font-family:var(--fs);font-size:15u}.rc img{width:24u;height:24u}.rc.item{width:36u;height:36u}.rc svg{width:26u;height:26u}
.dg-goal{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;gap:8u;padding:16u 14u 14u;background:var(--kraft);border:3u solid var(--rc,#ff3d6e);border-radius:3u;box-shadow:0 5u 0 rgba(42,32,23,.45);transform:rotate(1.2deg);text-align:center;min-width:0}
.dg-goal .gt{display:flex;flex-direction:column;gap:3u;font-family:var(--fs);font-size:13u}.dg-goal .gt b{color:var(--red2);font-size:16u}
.dg-goal .gs{width:62%;max-width:160u;transform:rotate(-2deg)}
.dg-goal .gn{font-family:var(--fs);font-size:19u;line-height:1.05}
.dg-goal .gh{font-size:12u;font-weight:800;font-style:italic;color:var(--ink2)}
.dg-goal .ds{font-family:var(--fs);font-size:12u;margin-top:auto;padding:3u 10u;background:var(--paper);border:2u solid var(--ink);border-radius:5u}
.dg-goal .big{display:flex;align-items:center;gap:8u;font-family:var(--fs);font-size:30u;padding:14u}.dg-goal .big img{width:46u;height:46u}
.dg-foot{display:flex;gap:12u;flex:none;justify-content:center;padding-top:8u;flex-wrap:wrap}
.dg-foot .hs-btn{min-width:210u}
.dg-next{flex:none;text-align:center;font-size:13u;font-weight:800;color:var(--ink2);margin-top:6u}

/* ---- колесо ---- */
.wh-area{flex:1;display:flex;gap:26u;align-items:center;min-height:0;padding:4u}
.wh-stage{position:relative;--ds:340px;flex:none;width:var(--ds);height:var(--ds);margin:0 auto}
.wh-rim{position:absolute;inset:-12u;border-radius:50%;background:var(--kraft2);border:4u solid var(--ink);box-shadow:0 8u 0 rgba(42,32,23,.5),0 18u 26u rgba(0,0,0,.4)}
.wh-rim::after{content:'';position:absolute;inset:6u;border-radius:50%;border:3u dotted var(--paper)}
.wh-disk{position:absolute;inset:0;border-radius:50%;border:4u solid var(--ink);overflow:hidden;will-change:transform}
.wh-disk svg{position:absolute;inset:0;width:100%;height:100%}
.wh-disk .wd{stroke:var(--ink);stroke-width:1.4;transition:filter .2s}.wh-disk .wd.win{filter:brightness(1.3) saturate(1.2)}
.wh-pz{position:absolute;inset:0;pointer-events:none}
.wh-pz .in{position:absolute;left:50%;top:7%;width:34%;margin-left:-17%;display:flex;flex-direction:column;align-items:center;gap:2px;font-family:var(--fs);font-size:calc(var(--ds)*.05);color:var(--ink)}
.wh-pz .in img{width:calc(var(--ds)*.1);height:calc(var(--ds)*.1);object-fit:contain}
.wh-pz .in .ring{width:calc(var(--ds)*.14);height:calc(var(--ds)*.14);border-radius:50%;background:rgba(255,255,255,.85);border:3px solid var(--rc,#8fb6d9);padding:3px}
.wh-hub{position:absolute;left:50%;top:50%;width:16%;height:16%;transform:translate(-50%,-50%);border-radius:50%;background:var(--paper);border:4u solid var(--ink);box-shadow:0 3u 0 var(--ink);z-index:2}
.wh-ptr{position:absolute;left:50%;top:-24u;width:44u;height:58u;margin-left:-22u;z-index:4;transform-origin:50% 20%;filter:drop-shadow(0 4u 0 rgba(42,32,23,.5))}
.wh-ptr.flick{animation:hs-flick .18s ease}
.wh-side{flex:1;display:flex;flex-direction:column;gap:12u;min-width:0;align-items:stretch}
.wh-info{padding:12u 14u;text-align:center;font-size:13u;font-weight:800;background:#fff3a8;border:2.5u solid var(--ink);box-shadow:0 4u 0 rgba(42,32,23,.4);transform:rotate(-1deg);display:flex;flex-direction:column;gap:3u}
.wh-info b{font-family:var(--fs);font-size:18u}

/* ---- настройки ---- */
.hs-set{width:min(520u,calc(100% - 24u));height:auto;max-height:calc(100% - 22u);padding:18u 22u 22u 30u}
.set-rows{display:flex;flex-direction:column;gap:8u;padding:6u 0 12u}
.set-row{display:flex;align-items:center;gap:12u;padding:8u 6u;border-bottom:2u dashed rgba(42,32,23,.3);font-family:var(--fs);font-size:17u}
.set-row svg{width:26u;height:26u;flex:none}
.set-row .lb{flex:1}
.hs-chk{pointer-events:auto;position:relative;width:46u;height:46u;border:3.5u solid var(--ink);border-radius:5u;background:#fffdf3;box-shadow:0 3u 0 var(--ink);flex:none}
.hs-chk::after{content:'';position:absolute;left:11u;top:3u;width:15u;height:28u;border-right:7u solid var(--red);border-bottom:7u solid var(--red);transform:rotate(40deg) scale(0);transition:transform .18s cubic-bezier(.3,1.8,.5,1);border-radius:2u}
.hs-chk.on::after{transform:rotate(40deg) scale(1)}
.set-q{display:flex;flex-direction:column;gap:8u;padding:6u 6u 4u}
.set-q .hd{display:flex;align-items:center;gap:10u;font-family:var(--fs);font-size:17u}
.set-q .hd svg{width:26u;height:26u}
.set-seg{display:grid;grid-template-columns:repeat(4,1fr);gap:7u}
.set-seg button{pointer-events:auto;min-height:44u;font-family:var(--fs);font-size:12u;background:var(--paper2);border:2.5u solid var(--ink);border-radius:4u;box-shadow:0 3u 0 rgba(42,32,23,.5);color:var(--ink2);padding:4u}
.set-seg button.on{background:var(--hl);color:var(--ink);box-shadow:0 3u 0 var(--ink);transform:translateY(-2u)}
.set-btns{display:flex;flex-direction:column;gap:10u;padding-top:8u}
.set-btns .hs-btn{width:100%}

/* ---- результат: страница отчёта ---- */
.hs-res.on{display:flex;align-items:center;justify-content:center;pointer-events:auto;background:rgba(36,24,12,.58)}
.rs-sheet{position:relative;display:flex;flex-direction:column;width:min(980u,calc(100% - 20u));height:min(630u,calc(100% - 18u));padding:20u 24u 14u 34u;filter:drop-shadow(0 16u 20u rgba(0,0,0,.5))}
.rs-paper{position:absolute;inset:0;background-color:var(--paper);background-image:repeating-linear-gradient(180deg,transparent 0,transparent 25u,var(--line) 25u,var(--line) 26u),radial-gradient(rgba(120,88,40,.07) 1px,transparent 1.6px);background-size:100% 26u,7px 7px;background-position:0 12u,0 0;border-radius:3u;clip-path:polygon(0 0,100% 0,100% calc(100% - 9u),97% 100%,94% calc(100% - 7u),91% 100%,88% calc(100% - 8u),85% 100%,82% calc(100% - 6u),79% 100%,76% calc(100% - 9u),73% 100%,70% calc(100% - 6u),67% 100%,64% calc(100% - 8u),61% 100%,58% calc(100% - 7u),55% 100%,52% calc(100% - 9u),49% 100%,46% calc(100% - 6u),43% 100%,40% calc(100% - 8u),37% 100%,34% calc(100% - 7u),31% 100%,28% calc(100% - 9u),25% 100%,22% calc(100% - 6u),19% 100%,16% calc(100% - 8u),13% 100%,10% calc(100% - 7u),7% 100%,4% calc(100% - 9u),0 100%)}
.rs-paper::before{content:'';position:absolute;left:24u;top:0;bottom:0;width:2.5u;background:rgba(214,55,44,.45)}
.rs-sheet>*{position:relative;z-index:1}
.rs-sheet>.rs-paper{position:absolute;z-index:0}
.rs-head{display:flex;align-items:center;gap:18u;flex:none;padding-bottom:6u}
.rs-head .st{font-size:46u;padding:7u 18u 6u;background:rgba(255,248,226,.7)}
.rs-head.win .st{color:#1f7c3d;animation:hs-stampIn .55s cubic-bezier(.2,1.6,.4,1) both}
.rs-head.lose .st{animation:hs-stampIn .55s cubic-bezier(.2,1.6,.4,1) both}
.rs-meta{display:flex;flex-direction:column;gap:5u;min-width:0}
.rs-meta .c1{font-family:var(--fs);font-size:15u;color:var(--ink)}
.rs-meta .c2{font-size:13u;font-weight:800;color:var(--ink2);font-style:italic}
.rs-stars{display:flex;gap:6u;margin-left:auto;padding:0 6u}
.rs-star{width:50u;height:50u;border-radius:50%;border:3u dashed rgba(42,32,23,.4);display:flex;align-items:center;justify-content:center;color:rgba(42,32,23,.3);transform:rotate(var(--r,0deg))}
.rs-star svg{width:28u;height:28u}
.rs-star.on{border:3.5u solid var(--red);color:var(--red);background:rgba(255,216,74,.6);mix-blend-mode:multiply;animation:hs-stampIn .45s cubic-bezier(.2,1.6,.4,1) both;animation-delay:var(--d,0s)}
.rs-body{flex:1;min-height:0;display:flex;gap:22u}
.rs-left{flex:0 0 44%;min-width:0;display:flex;flex-direction:column;gap:5u;min-height:0}
.rs-right{flex:1;min-width:0;display:flex;flex-direction:column;min-height:0}
.rs-h{font-family:var(--fs);font-size:12u;letter-spacing:.08em;color:var(--ink2);margin:2u 0 4u}
.rs-row{display:flex;align-items:baseline;gap:6u;font-size:14u;font-weight:800;min-height:26u;line-height:26u}
.rs-row .k{flex:none}.rs-row .dots{flex:1;border-bottom:3u dotted rgba(42,32,23,.4);transform:translateY(-4u);min-width:10u}
.rs-row b{font-family:var(--fs);font-size:17u;font-variant-numeric:tabular-nums;color:var(--ink)}
.rs-row.z b{color:rgba(42,32,23,.4)}.rs-row.z .k{opacity:.5}
.rs-row.tot{margin-top:4u;border-top:3u double var(--ink);padding-top:4u;min-height:38u;line-height:34u}
.rs-row.tot .k{font-family:var(--fs);font-size:15u}.rs-row.tot b{font-size:24u;color:var(--red2);display:flex;align-items:center;gap:6u}.rs-row.tot b img{width:28u;height:28u}
.rs-row .x2tag{font-family:var(--fs);font-size:11u;color:var(--green);border:2.5u solid var(--green);padding:1u 6u;border-radius:4u;transform:rotate(-5deg)}
.rs-lvl{display:flex;align-items:center;gap:10u;margin-top:8u;padding:6u 10u;background:var(--paper2);border:2.5u solid var(--ink);border-radius:3u 10u 3u 10u}
.rs-lvl b{font-family:var(--fs);font-size:14u;white-space:nowrap}
.rs-lvl .up{font-family:var(--fs);font-size:11u;color:#fff;background:var(--red);padding:2u 8u;border-radius:5u;border:2u solid var(--ink);transform:rotate(-4deg);animation:hs-wob 1.3s ease-in-out infinite;white-space:nowrap}
.rs-note{font-size:12u;font-weight:800;font-style:italic;color:var(--ink2);margin-top:6u}
.rs-note.hlz{display:inline-block;align-self:flex-start;background:var(--hl);color:var(--ink);padding:3u 10u;font-style:normal;font-weight:900;transform:rotate(-1deg);border:2u solid var(--ink)}
.rs-cards{flex:1;min-height:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(98u,1fr));gap:14u 10u;align-content:start;padding:8u 6u 8u 2u}
.rs-card{position:relative;transform:rotate(var(--r,0deg));text-align:center;animation:hs-cardIn .45s cubic-bezier(.2,1.3,.4,1) both;animation-delay:var(--d,0s)}
.rs-card .hs-photo{outline:3u solid var(--rc);outline-offset:-1u;padding-bottom:3u}
.rs-card .nm{font-size:10.5u;font-weight:900;line-height:1.1;padding:4u 1u 3u;min-height:2.3em;display:flex;align-items:center;justify-content:center}
.rs-card .newst{position:absolute;right:-8u;top:-10u;z-index:5;font-family:var(--fs);font-size:13u;color:var(--red);background:#fff6c4;border:3u solid var(--red);padding:1u 6u;border-radius:5u;transform:rotate(10deg);box-shadow:0 2u 0 rgba(0,0,0,.25)}
.rs-card .rw{display:block;font-size:9u;font-weight:900;text-transform:uppercase;letter-spacing:.05em;color:var(--rc);filter:brightness(.78)}
.rs-empty{padding:30u 10u;text-align:center;font-size:14u;font-style:italic;color:var(--ink2)}
.rs-foot{display:flex;gap:12u;flex:none;align-items:center;justify-content:flex-end;padding-top:10u;flex-wrap:wrap}
.rs-foot .hs-btn.main{min-width:210u;font-size:22u;min-height:56u}
.rs-foot .x2{margin-right:auto}
.rs-foot .x2.done{background:var(--green);color:#fff}
.hs-p .rs-sheet{padding:16u 14u 12u 26u;width:calc(100% - 12u);height:calc(100% - 14u)}
.hs-p .rs-paper::before{left:16u}
.hs-p .rs-head{flex-wrap:wrap;gap:8u 12u}.hs-p .rs-head .st{font-size:32u}
.hs-p .rs-stars{margin-left:0;flex:1 1 100%}.hs-p .rs-star{width:42u;height:42u}
.hs-p .rs-body{flex-direction:column;overflow-y:auto;overflow-x:hidden;gap:10u}
.hs-p .rs-left{flex:none}.hs-p .rs-right{flex:none}.hs-p .rs-cards{overflow:visible;flex:none}
.hs-p .rs-foot{flex-direction:column-reverse;align-items:stretch}.hs-p .rs-foot .hs-btn{width:100%}.hs-p .rs-foot .x2{margin-right:0}
.hs-low .rs-head .st{font-size:30u}.hs-low .rs-star{width:36u;height:36u}.hs-low .rs-row{min-height:21u;line-height:21u}.hs-low .rs-sheet{padding-top:12u}

/* ---- награда, всплывашка, оффер ---- */
.hs-prize{position:absolute;inset:0;z-index:12;display:flex;align-items:center;justify-content:center;pointer-events:auto;background:rgba(36,24,12,.66);animation:hs-fade .25s both}
.pz-card{position:relative;width:min(440u,calc(100% - 28u));display:flex;flex-direction:column;align-items:center;gap:14u;padding:26u 22u 20u;transform:rotate(-1deg);animation:hs-pageIn .42s cubic-bezier(.2,1.3,.4,1) both}
.pz-card .st{font-size:34u;text-align:center}
.pz-row{display:flex;flex-wrap:wrap;gap:16u;justify-content:center}
.pz-it{display:flex;flex-direction:column;align-items:center;gap:6u;animation:hs-cardIn .45s cubic-bezier(.2,1.5,.4,1) both;animation-delay:calc(var(--k,0)*.1s + .15s)}
.pz-it .big{width:92u;height:92u;display:flex;align-items:center;justify-content:center}
.pz-it .big img{width:92u;height:92u;object-fit:contain}
.pz-it .big .hs-ico{border:4u solid var(--rc);background:var(--paper2);padding:6u;border-radius:3u}
.pz-it b{font-family:var(--fs);font-size:26u}
.pz-it small{font-size:12u;font-weight:900;text-align:center;max-width:130u}.pz-it .rr{font-size:11u;color:var(--rc);font-weight:900;filter:brightness(.8)}
.pz-note{font-size:12.5u;font-weight:800;font-style:italic;text-align:center;color:var(--ink2)}
.hs-pop{position:absolute;z-index:11;width:min(300u,calc(100% - 16u));display:flex;flex-direction:column;gap:9u;padding:14u;pointer-events:auto;animation:hs-pop .22s ease both}
.hs-pop .row{display:flex;align-items:center;gap:12u}.hs-pop .pi{width:46u;height:46u}
.hs-pop .pt b{display:block;font-family:var(--fs);font-size:20u}.hs-pop .pt small{font-size:12u;font-weight:800;color:var(--ink2)}
.hs-offer{position:absolute;inset:0;z-index:12;display:flex;align-items:center;justify-content:center;pointer-events:auto;background:rgba(36,24,12,.55);animation:hs-fade .25s both}
.hs-offer.out{opacity:0;transition:opacity .2s}
.of-card{position:relative;width:min(400u,calc(100% - 28u));display:flex;flex-direction:column;align-items:center;gap:11u;padding:24u 20u 16u;transform:rotate(1deg);animation:hs-pageIn .42s cubic-bezier(.2,1.3,.4,1) both}
.of-card .st{font-size:30u;text-align:center}
.of-sub{font-size:15u;font-weight:900;text-align:center}
.of-ring{position:relative;width:84u;height:84u}
.of-ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.of-ring .bg{fill:var(--paper2);stroke:var(--ink);stroke-width:5}.of-ring .tr{fill:none;stroke:rgba(42,32,23,.2);stroke-width:8}
.of-ring .pg{fill:none;stroke:var(--red);stroke-width:8;stroke-linecap:round;stroke-dasharray:238.76}
.of-ring b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--fs);font-size:34u;padding-bottom:3u}
.of-ring.low b{color:var(--red);animation:hs-tick .4s ease-in-out infinite alternate}
.of-card .hs-btn.go{width:100%;min-height:64u;font-size:22u}
.of-card .hs-hint:not(.on){display:none}
.of-no{pointer-events:auto;font-size:14u;font-weight:800;text-decoration:underline;color:var(--ink2);padding:8u 14u;min-height:40u}

/* ---- конфетти ---- */
.hs-conf{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:13}
.hs-conf i{position:absolute;top:-20u;width:10u;height:16u;background:var(--c);animation:hs-confFall var(--t,2.4s) linear var(--d,0s) both}
.hs-lowfx .hs-conf{display:none}


/* ---- портрет и низкий ландшафт: окна ---- */
.dex-scroll{flex:1;min-height:0}
.hs-p .hs-sheet{width:calc(100% - 12u);height:calc(100% - 14u);padding:12u 12u 12u 22u}
.hs-p .hs-sheet::after{width:10u}
.hs-p .sh-title{font-size:23u}.hs-p .sh-title small{display:none}
.hs-p .sh-wallet{gap:12u;padding-left:6u;flex-direction:row}
.hs-p .sh-wallet .hs-pill{font-size:14u;height:30u;min-width:52u;padding-left:24u}.hs-p .sh-wallet .hs-pill-ic{width:32u;height:32u;margin-top:-16u;left:-10u}
.hs-p .hs-body{flex-direction:column;gap:8u}
.hs-p .hs-sh-grid{grid-template-columns:repeat(3,1fr)}
.hs-p .hs-prev{display:grid;grid-template-columns:96u 1fr;gap:4u 10u;padding:10u;margin:0 0 4u;max-width:none;flex:none;align-items:center;order:-1;transform:none}
.hs-p .hs-prev .stage{grid-row:1/4;width:96u;max-height:none;aspect-ratio:1}
.hs-p .hs-prev .stage .hs-photo{width:100%}
.hs-p .hs-prev .pn{text-align:left;font-size:16u}
.hs-p .hs-prev .pm{justify-content:flex-start}
.hs-p .hs-prev .gs{display:none}
.hs-p .hs-prev .prc{justify-content:flex-start;font-size:17u;min-height:0}
.hs-p .hs-prev .prc.ad{align-items:flex-start}
.hs-p .hs-prev .hs-hint{grid-column:1/3;min-height:0}
.hs-p .hs-prev .acts{grid-column:1/3;flex-direction:row;margin-top:0}
.hs-p .hs-prev .acts .hs-btn{flex:1;min-height:42u;font-size:13u;padding:6u 6u}
.hs-p .hs-prev .acts .hs-btn svg{display:none}
.hs-p .dex-grid{grid-template-columns:repeat(3,1fr)}
.hs-p .dex-side{display:grid;grid-template-columns:78u 1fr;gap:2u 10u;padding:8u 10u;max-width:none;flex:none;margin:0;transform:none;align-items:center;order:-1}
.hs-p .dex-side .big{grid-row:1/5;width:100%;align-self:start}
.hs-p .dex-side .tr{grid-column:1/3}
.hs-p .dex-side .pn{font-size:17u}
.hs-p .dex-side .ln{font-size:11u}
.hs-p .gear-row{flex-direction:column;overflow-y:auto;gap:22u;padding:10u 4u}.hs-p .bp{flex:none}
.hs-p .dg-body{flex-direction:column;overflow-y:auto;gap:16u}.hs-p .dg-days{flex:none}.hs-p .dg-goal{flex:none}
.hs-p .dg-foot .hs-btn{min-width:0;flex:1 1 100%}
.hs-p .wh-area{flex-direction:column;overflow-y:auto;gap:18u;justify-content:flex-start}.hs-p .wh-side{width:100%;flex:none}
.hs-p .hs-pcards{grid-template-columns:1fr}
.hs-low .hs-sheet{padding:10u 18u 10u 26u;height:calc(100% - 12u)}.hs-low .sh-title{font-size:26u}.hs-low .sh-title small{display:none}
.hs-low .hs-tab{min-height:34u;padding:4u 10u}
.hs-low .hs-prev .stage{max-height:120u}.hs-low .hs-prev{padding:10u;gap:5u}
.hs-low .dex-grid{grid-template-columns:repeat(5,1fr);gap:12u 8u}
.hs-low .bp{padding:12u}.hs-low .bp .bi{width:56u;height:56u}.hs-low .bp .rw{padding:3u 8u}
.hs-low .wh-pz .in{font-size:calc(var(--ds)*.045)}

@keyframes hs-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7u)}40%{transform:translateX(6u)}60%{transform:translateX(-4u)}80%{transform:translateX(3u)}}
@keyframes hs-bump{0%{transform:scale(1)}35%{transform:scale(1.18) rotate(-2deg)}100%{transform:scale(1)}}
@keyframes hs-pop{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
@keyframes hs-fade{from{opacity:0}to{opacity:1}}
@keyframes hs-pageIn{from{opacity:0;transform:translateY(40u) rotate(-3deg) scale(.94)}to{opacity:1;transform:none}}
@keyframes hs-slideL{from{opacity:0;transform:translateX(-60u) rotate(-6deg)}}
@keyframes hs-slideR{from{opacity:0;transform:translateX(60u) rotate(6deg)}}
@keyframes hs-playPulse{0%,100%{box-shadow:0 4u 0 var(--ink),inset 0 2u 0 rgba(255,255,255,.25),0 0 0 0 rgba(214,55,44,.5)}60%{box-shadow:0 4u 0 var(--ink),inset 0 2u 0 rgba(255,255,255,.25),0 0 0 14u rgba(214,55,44,0)}}
@keyframes hs-wob{0%,100%{transform:rotate(6deg) scale(1)}50%{transform:rotate(11deg) scale(1.1)}}
@keyframes hs-giftWob{0%,86%,100%{transform:rotate(2.6deg)}90%{transform:rotate(-3deg)}94%{transform:rotate(7deg)}}
@keyframes hs-tick{from{transform:scale(1)}to{transform:scale(1.12)}}
@keyframes hs-tickIn{from{transform:rotate(-45deg) scale(0)}to{transform:rotate(-45deg) scale(1.1)}}
@keyframes hs-nearPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes hs-ready{0%{transform:scale(1)}40%{transform:scale(1.2)}100%{transform:scale(1)}}
@keyframes hs-spin{to{transform:rotate(360deg)}}
@keyframes hs-arrowpulse{from{transform:scale(.86)}to{transform:scale(1.16)}}
@keyframes hs-tagShake{from{transform:translate(-50%,-100%) rotate(-4deg)}to{transform:translate(-50%,-100%) rotate(3deg)}}
@keyframes hs-bnIn{from{opacity:0;transform:scale(1.9) rotate(-12deg)}to{opacity:1;transform:scale(1) rotate(0)}}
@keyframes hs-bnOut{to{opacity:0;transform:translateY(-18u) scale(.95)}}
@keyframes hs-stampIn{from{opacity:0;transform:scale(2.2) rotate(-18deg)}60%{opacity:1;transform:scale(.94) rotate(-5deg)}to{opacity:.95;transform:rotate(-6deg)}}
@keyframes hs-cardIn{from{opacity:0;transform:translateY(24u) rotate(calc(var(--r,0deg) - 8deg)) scale(.85)}to{opacity:1;transform:rotate(var(--r,0deg))}}
@keyframes hs-flash{0%{filter:brightness(1.5)}100%{filter:none}}
@keyframes hs-dayPulse{0%,100%{box-shadow:0 0 0 7u var(--ink),0 10u 20u rgba(0,0,0,.4)}50%{box-shadow:0 0 0 10u var(--ink),0 10u 24u rgba(0,0,0,.4)}}
@keyframes hs-flick{50%{transform:rotate(-14deg)}}
@keyframes hs-confFall{from{transform:translateY(0) rotate(0)}to{transform:translateY(110vh) rotate(720deg)}}
@media (prefers-reduced-motion:reduce){
  .hs-play,.hs-badge,.bm.attn,.bm.gift.attn,.hs-tk.low .t,.hs-tag.s-fleeing .hs-tag-in,.tb.check.near,.tb.radar.on .rg,.dg-day.today,.of-ring.low b,.rs-lvl .up,.hs-arrow svg,.hs-bn.shaking .st{animation:none!important}
  .hs-menu.in .m-l>*,.hs-menu.in .m-r>*{animation:none!important}
  .hs-bn{animation-duration:.01s!important}
}
.hs-lowfx .hs-play{animation:none}
`;

/** CSS карточки обучения (Tutorial): приколотая заметка-стикер в стиле журнала. */
const HSUI_TUT_CSS = `
.lory-tut{--tut-font:'HsText',system-ui,sans-serif;--tut-accent:#d6372c;--tut-bg:#2a2017;--tut-fg:#2a2017}
.lory-tut-card{background-color:#fff1a0;background-image:repeating-linear-gradient(180deg,transparent 0,transparent 25px,rgba(48,98,168,.25) 25px,rgba(48,98,168,.25) 26px);color:#2a2017;border:3px solid #2a2017;border-radius:3px;box-shadow:0 5px 0 #2a2017,0 14px 22px rgba(0,0,0,.4);transform:rotate(-1deg);padding:14px 16px 12px}
.lory-tut-card:not([data-hl]){transform:translateX(-50%) rotate(-1deg)}
.lory-tut-card::before{content:'';position:absolute;left:50%;top:-11px;width:70px;height:22px;margin-left:-35px;background:rgba(255,222,110,.85);transform:rotate(-3deg);clip-path:polygon(0 0,3% 25%,0 50%,3% 75%,0 100%,100% 100%,97% 75%,100% 50%,97% 25%,100% 0);box-shadow:0 1px 2px rgba(0,0,0,.3)}
.lory-tut-card.lory-tut-ok{border-color:#2e9a50;background-color:#d6f2c8}
.lory-tut-title{font-family:'HsStamp','HsText',sans-serif;font-weight:900;color:#d6372c;letter-spacing:.02em;text-transform:uppercase}
.lory-tut-hint{color:#2a2017;font-weight:700}
.lory-tut-key{background:#2a2017;color:#f6edd6;border-radius:5px;font-family:'HsStamp','HsText',sans-serif;box-shadow:0 2px 0 rgba(0,0,0,.45)}
.lory-tut-bar{background:rgba(42,32,23,.2);border-radius:8px;height:10px;border:2px solid #2a2017}
.lory-tut-bar i{background:repeating-linear-gradient(135deg,#2e9a50 0 6px,#41b765 6px 12px)}
.lory-tut-skip{border:3px solid #2a2017;background:#f6edd6;color:#2a2017;font-family:'HsStamp','HsText',sans-serif;font-weight:900;text-transform:uppercase;letter-spacing:.04em;box-shadow:0 3px 0 #2a2017;border-radius:6px}
.lory-tut-skip kbd{background:#2a2017;color:#f6edd6}
.lory-tut-dots i{background:rgba(42,32,23,.25)}.lory-tut-dots i.done{background:#2e9a50}.lory-tut-dots i.cur{background:#d6372c}
.lory-tut-pointer,.lory-tut-edge{color:#d6372c;filter:drop-shadow(0 2px 0 #2a2017) drop-shadow(0 0 3px #fff6c4)}
.lory-tut-hl{outline:5px dashed #ffd84a;outline-offset:5px}
.lory-tut-final{background:#d6f2c8;color:#2a2017;border:3px solid #2a2017;border-radius:4px;font-family:'HsStamp','HsText',sans-serif;box-shadow:0 4px 0 #2a2017}
`;

// ---------------------------------------------------------------------------------------------------------
// GameUI
// ---------------------------------------------------------------------------------------------------------

/** Размеры блоков HUD, «u»: [ширина, высота] — обычный, 'tall' (портрет), 'low' (низкий ландшафт). */
const HSUI_HUD_SIZES = {
    'hs-timer': { d: [176, 84], tall: [128, 64] },
    'hs-list': { d: [176, 70], tall: [122, 58] },
    'hs-level': { d: [176, 32], tall: [122, 26] },
    'hs-wallet': { d: [140, 84], tall: [108, 70] },
    'hs-sys': { d: [44, 44], tall: [40, 40] },
    'hs-tools': { d: [232, 196], tall: [232, 196], low: [252, 96] },
};

/** @satisfies {Record<string, any>} */
const GameUI = {
    /** Строка для Tutorial.init({ css }). */
    tutorialCss: HSUI_TUT_CSS,
    app: null,
    root: null,
    W: 960, H: 540, u: 1, portrait: false,
    _inited: false,
    _menuWanted: false,
    _hudOn: false,
    _open: '',          // 'shop' | 'dex' | 'gear' | 'daily' | 'wheel' | 'settings' | ''
    _timers: new WeakMap(),
    _wins: /** @type {Record<string, any>} */ ({}),
    _hb: /** @type {Record<string, any>} */ ({}),
    _c: /** @type {Record<string, any>} */ ({}),
    _tags: new Map(),
    _flo: /** @type {HTMLElement[]} */ ([]),
    _counters: /** @type {HsCounter[]} */ ([]),
    _resultOn: false,
    _rt: /** @type {number[]} */ ([]),
    _bigBn: /** @type {any} */ (null),
    _tk: 0, _hold: false, _holdT: 0, _pop: null, _prz: null, _offerRec: null,

    // =====================================================================================
    // Запуск
    // =====================================================================================

    init(app) {
        if (this._inited || typeof document === 'undefined') return;
        this._inited = true;
        this.app = app;
        const st = document.createElement('style');
        st.id = 'hs-ui-css';
        st.textContent = hsuiCss(HSUI_CSS);
        document.head.appendChild(st);
        const root = hsuiEl('div');
        root.id = 'hs-ui';
        document.body.appendChild(root);
        this.root = root;
        this.hud_el = hsuiEl('div', 'hs-hud', root);
        this.hud_el.hidden = true;
        this.pen = hsuiEl('div', 'hs-pen', root);
        this.tagsEl = hsuiEl('div', 'hs-tags', root);
        this.arrow = hsuiEl('div', 'hs-arrow', root, HSUI_ICON.arrow);
        this.floats = hsuiEl('div', 'hs-floats', root);
        this.banner_el = hsuiEl('div', 'hs-banner', root);
        this.wait_el = hsuiEl('div', 'hs-wait hs-paper', root, '<b>0</b><span></span>');
        this.fxl = hsuiEl('div', 'hs-fxl', root);
        if (typeof HudLayout !== 'undefined' && !HudLayout._inited) HudLayout.init({ app });
        this._buildHud();
        this._buildMenu();
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('orientationchange', () => setTimeout(() => this.resize(), 250));
        window.addEventListener('lory-viewcap', () => this.resize());
        window.addEventListener('lory-input-device', () => this._syncKeys());
        this._syncKeys();
        window.addEventListener('hs-save', () => this.refresh());
        if (typeof HudLayout !== 'undefined') HudLayout.onChange(() => this._fitAll());
        if (typeof Quality !== 'undefined' && Quality.onChange) Quality.onChange(() => this._fxLevel());
        this._fxLevel();
        this._startTicker();
    },

    /** Единица экрана и классы раскладки. */
    resize() {
        if (!this.root) return;
        const r = this.root.getBoundingClientRect();
        const W = Math.max(200, r.width || window.innerWidth), H = Math.max(200, r.height || window.innerHeight);
        const portrait = H > W * 1.02;
        const u = portrait ? hsuiClamp(Math.min(W / 400, H / 780), 0.6, 1.4) : hsuiClamp(Math.min(W / 960, H / 540), 0.5, 1.4);
        this.W = W; this.H = H; this.u = u; this.portrait = portrait;
        this.root.style.setProperty('--u', u.toFixed(3) + 'px');
        this.root.style.setProperty('--hh', H.toFixed(0) + 'px');
        const cl = this.root.classList;
        cl.toggle('hs-p', portrait);
        cl.toggle('hs-l', !portrait);
        cl.toggle('hs-low', !portrait && H < 430);
        this._fitAll();
        if (this._open === 'wheel') this._wheelSize();
    },

    /** Подписи клавиш на кнопках HUD — пока устройство не сенсорное. */
    _syncKeys() {
        if (!this.root) return;
        const dev = typeof Input !== 'undefined' ? Input.device : 'keyboard';
        this.root.classList.toggle('hs-kb', dev !== 'touch');
    },

    _fxLevel() {
        if (!this.root) return;
        const lvl = typeof Quality !== 'undefined' ? Quality.level : 2;
        this.root.classList.toggle('hs-lowfx', lvl === 0 || hsuiReduced());
    },

    /** @param {HTMLElement} el @param {boolean} on */
    _show(el, on) {
        const prev = this._timers.get(el);
        if (prev) clearTimeout(prev);
        if (on) {
            el.classList.remove('out', 'in');
            el.classList.add('on');
            void el.offsetWidth;
            el.classList.add('in');
        } else {
            if (!el.classList.contains('on')) return;
            el.classList.add('out');
            this._timers.set(el, window.setTimeout(() => { el.classList.remove('on', 'out', 'in'); }, 240));
        }
    },

    /** Кнопка: звук клика и обработчик. */
    _bind(el, fn, sound) {
        el.addEventListener('click', e => {
            e.stopPropagation();
            if (sound !== false) hsuiSfx('click');
            fn(e);
        });
    },

    /** kind: 'coins' | 'gems' — у счётчика появляется «+» (реклама за валюту). */
    _counter(parent, icon, cls, kind) {
        const c = new HsCounter(parent, icon, cls, !!kind);
        this._counters.push(c);
        if (kind && c.plus) this._bind(c.plus, () => this._adPop(kind, c));
        return c;
    },

    // =====================================================================================
    // HUD
    // =====================================================================================

    _buildHud() {
        const hud = this.hud_el;
        const blk = (id, dock, extra) => {
            const el = hsuiEl('div', 'hs-hb', hud);
            const fit = hsuiEl('div', 'hs-fit', el);
            this._hb[id] = { el, fit, dw: 0, dh: 0, dock, extra, f: 0 };
            return fit;
        };
        // билет-таймер сверху по центру: карта мелким шрифтом, время крупно, полоска ускорения
        const fT = blk('hs-timer', 'tc');
        const tk = hsuiEl('div', 'hs-tk', fT);
        const tkp = hsuiEl('div', 'hs-ticket', tk);
        this.hCap = hsuiEl('div', 'cap', tkp, '');
        this.hTimeB = hsuiEl('div', 't', tkp, '0:00');
        tk.dataset.hs = 'timer';
        this.hTk = tk;
        this.hBoost = hsuiEl('div', 'hs-boost', fT, '<i></i>');
        // список целей слева: «ОСТАЛОСЬ 3/5» и клетки-галочки
        const fL = blk('hs-list', 'tl');
        const ls = hsuiEl('div', 'hs-list', fL);
        const lh = hsuiEl('div', 'lh', ls);
        hsuiEl('span', '', lh).textContent = Lang.t('hud.left');
        this.hLeft = hsuiEl('b', '', lh, '0/0');
        this.hBoxes = hsuiEl('div', 'bx', ls);
        this.hList = ls;
        // ранг
        const fV = blk('hs-level', 'tl', { order: 1 });
        const lv = hsuiEl('div', 'hs-lvlb', fV);
        this.hLvl = hsuiEl('b', '', lv, '');
        this.hBar = hsuiEl('i', '', hsuiEl('div', 'hs-bar', lv));
        // кошелёк справа
        const fW = blk('hs-wallet', 'tr');
        const wal = hsuiEl('div', 'hs-wal', fW);
        this.hCoin = this._counter(wal, 'assets/ui/icon-coin.webp', '');
        this.hCoin.el.dataset.hs = 'coins';
        this.hGem = this._counter(wal, 'assets/ui/icon-gem.webp', 'gem');
        // звук
        const fS = blk('hs-sys', 'tr', { order: 1 });
        this.hSound = hsuiBtn('pin hs-sound', fS, HSUI_ICON.speaker);
        this.hSound.setAttribute('aria-label', Lang.t('ui.sound'));
        this._bind(this.hSound, () => this._toggleSound());
        // кнопки инструментов
        const fB = blk('hs-tools', 'br');
        const tools = hsuiEl('div', 'hs-tools', fB);
        this.hTemp = hsuiEl('div', 'hs-temp', tools, '');
        this.tool = {};
        const mk = (k, icon, keys) => {
            const b = hsuiBtn('tb ' + k, tools);
            b.dataset.hs = k;
            b.setAttribute('aria-label', Lang.t('hud.' + k));
            hsuiEl('i', 'rg', b);
            hsuiEl('i', 'cd', b);
            hsuiEl('span', 'ic', b, icon);
            const sec = hsuiEl('span', 'sec', b);
            hsuiEl('span', 'lb', b).textContent = Lang.t('hud.' + k);
            hsuiEl('span', 'key', b).textContent = keys;
            this.tool[k] = { b, sec, cd: -1, secT: '', near: null, on: null };
            b.addEventListener('pointerdown', e => {
                e.preventDefault(); e.stopPropagation();
                this._useTool(k);
            });
            b.addEventListener('click', e => { e.stopPropagation(); if (e.detail === 0) this._useTool(k); });
        };
        mk('radar', HSUI_ICON.radar, 'R');
        mk('check', HSUI_ICON.check, 'E');
        mk('net', HSUI_ICON.net, 'F');
    },

    _useTool(k) {
        const G = /** @type {any} */ (hsuiGame());
        if (!G) return;
        if (k === 'radar') G.useRadar(); else if (k === 'net') G.useNet(); else G.useCheck();
    },

    _toggleSound() {
        const G = /** @type {any} */ (hsuiGame());
        if (G && G.toggleSound) G.toggleSound();
        this._soundIcons();
    },

    /** Иконка динамика (HUD, меню и настройки) по Game.soundOn(). */
    _soundIcons() {
        const G = /** @type {any} */ (hsuiGame());
        const on = G && G.soundOn ? G.soundOn() : true;
        for (const b of [this.hSound, this.mSound]) if (b) { b.innerHTML = on ? HSUI_ICON.speaker : HSUI_ICON.speakerOff; b.classList.toggle('off', !on); b.setAttribute('aria-pressed', String(!on)); }
        if (this._open === 'settings') this._setRefresh();
    },

    /** Размеры блоков HUD в «u»: по режиму раскладки (портрет — компактнее, низкий ландшафт — кнопки в ряд). */
    _hudSize(id, mode) {
        const T = HSUI_HUD_SIZES[id];
        return T[mode === 'tall' ? 'tall' : mode === 'low' ? 'low' : 'd'] || T.d;
    },

    /** Масштаб внутренних слоёв блока = размер, который дал HudLayout, к проектному. */
    _fitAll() {
        if (typeof HudLayout === 'undefined' || !this._hb['hs-tools']) return;
        const mode = HudLayout.mode || (this.portrait ? 'tall' : 'wide');
        const hu = hsuiClamp(this.u, 0.6, 1.2);
        this.hud_el.style.setProperty('--u', hu.toFixed(3) + 'px');
        this.hud_el.classList.toggle('hs-row', mode === 'low');
        this.hud_el.classList.toggle('hs-tall', mode === 'tall');
        for (const id of Object.keys(this._hb)) {
            const h = this._hb[id], sz = this._hudSize(id, mode);
            const w = Math.round(sz[0] * hu), hh = Math.round(sz[1] * hu);
            if (h.dw !== w || h.dh !== hh) {
                h.dw = w; h.dh = hh;
                h.fit.style.width = w + 'px'; h.fit.style.height = hh + 'px';
                HudLayout.block(id, Object.assign({ dock: h.dock, w, h: hh, el: h.el }, h.extra || {}));
            }
        }
        for (const id of Object.keys(this._hb)) {
            const h = this._hb[id], r = HudLayout.rect(id);
            if (!r) continue;
            const f = Math.min(r.w / h.dw, r.h / h.dh);
            if (!(f > 0) || Math.abs(f - (h.f || 0)) < 0.002) continue;
            h.f = f;
            h.fit.style.setProperty('--fit', f.toFixed(4));
        }
        // баннеры и «ждём»: под билетом-таймером
        const t = HudLayout.rect('hs-timer');
        if (this.root) this.root.style.setProperty('--bt', ((t ? t.y + t.h : 70) + 10 * this.u).toFixed(0) + 'px');
    },

    hud(show) {
        if (!this.root) return;
        show = !!show;
        if (show === this._hudOn) { if (show) this._hudReset(); return; }
        this._hudOn = show;
        this.hud_el.hidden = !show;
        if (show) {
            this._closeWindows(true);
            this._menuHide(true);
            this._resultHide(true);
            this._hudReset();
        } else {
            this.pen.style.opacity = '0';
            this.arrow.classList.remove('on');
            this._offerEnd(this._offerRec, 'silent');
            this._clearBanners();
            this.wait(0);
            this._clearTags();
        }
    },

    _hudReset() {
        this._c = { first: true };
        for (const k of Object.keys(this.tool)) { const t = this.tool[k]; t.cd = -1; t.secT = ''; t.near = null; t.on = null; }
        if (typeof HudLayout !== 'undefined') {
            HudLayout.block('input-action', { visible: false });   // контекстная кнопка Input не нужна: свои кнопки HUD
            HudLayout.block('input-stick', { w: 200, h: 200 });
            HudLayout.refresh();
        }
        this._fitAll();
        this._soundIcons();
    },

    /** Каждый кадр из Game.update. */
    hudUpdate(s) {
        if (!this._hudOn || !s) return;
        const c = this._c, first = !!c.first;
        // таймер, билет
        const tut = !!s.tutorial;
        const t = Math.max(0, Number(s.time) || 0), sec = Math.ceil(t);
        if (c.sec !== sec) { c.sec = sec; this.hTimeB.textContent = hsuiTimer(t); }
        const low = !tut && s.phase === 'seek' && sec <= 10 && sec > 0;
        if (c.low !== low) { c.low = low; this.hTk.classList.toggle('low', low); }
        const capKey = tut ? 'T' : s.mapIndex + '|' + s.mapName + '|' + Lang.code;
        if (c.capKey !== capKey) {
            c.capKey = capKey;
            this.hCap.textContent = tut ? Lang.t('hud.tutorial') : Lang.t('ui.case', { n: hsuiPad2((s.mapIndex | 0) + 1) }) + ' · ' + hsuiName(s.mapName);
        }
        const pf = hsuiClamp(Number(s.penaltyFlash) || 0, 0, 1);
        if (c.pf !== Math.round(pf * 20)) {
            if (pf > 0.9 && (c.pfv || 0) <= 0.9 && !hsuiReduced()) { this.hTk.classList.remove('pen'); void this.hTk.offsetWidth; this.hTk.classList.add('pen'); }
            c.pf = Math.round(pf * 20); c.pfv = pf;
            this.pen.style.opacity = pf.toFixed(2);
        }
        const bo = Math.round(hsuiClamp(Number(s.boost) || 0, 0, 1) * 50);
        if (c.bo !== bo) { c.bo = bo; this.hBoost.classList.toggle('on', bo > 0); this.hBoost.style.setProperty('--b', (bo / 50).toFixed(2)); }
        // цели
        const total = Math.max(0, s.total | 0), alive = Math.max(0, s.alive | 0);
        const caught = typeof s.caught === 'number' ? s.caught : total - alive;
        const lk = alive + '/' + total + '/' + caught;
        if (c.lk !== lk) {
            c.lk = lk;
            this.hLeft.textContent = alive + '/' + total;
            const bx = this.hBoxes;
            while (bx.children.length < total) hsuiEl('i', '', bx);
            while (bx.children.length > total) bx.lastElementChild.remove();
            for (let i = 0; i < total; i++) bx.children[i].classList.toggle('d', i < total - alive);
            if (!first) { this.hList.classList.remove('hs-shake'); void this.hList.offsetWidth; }
        }
        // ранг
        const lvKey = s.level + '|' + Math.round((s.xpFrac || 0) * 100);
        if (c.lvKey !== lvKey) {
            c.lvKey = lvKey;
            this.hLvl.textContent = Lang.t('ui.level', { n: s.level });
            this.hBar.parentElement.style.setProperty('--f', hsuiClamp(s.xpFrac || 0, 0, 1).toFixed(3));
        }
        this.hCoin.set(s.coins, !first);
        this.hGem.set(s.gems, !first);
        // инструменты
        this._toolUpd('radar', s.radar, first);
        this._toolUpd('net', s.net, first);
        const ck = this.tool.check, near = !!(s.check && s.check.show);
        if (ck.near !== near) { ck.near = near; ck.b.classList.toggle('near', near); }
        // «горячо / тепло / холодно» и стрелка направления
        const r = s.radar || {};
        const temp = r.on && r.temp ? r.temp : '';
        if (c.temp !== temp) {
            c.temp = temp;
            this.hTemp.className = 'hs-temp' + (temp ? ' on ' + temp : '');
            this.hTemp.textContent = temp ? Lang.t('hud.' + temp) : '';
        }
        this._arrow(r.on ? r.dir : null, temp, s.hunter);
        c.first = false;
    },

    _toolUpd(k, st, first) {
        const a = this.tool[k];
        st = st || { cd: 0, cdLeft: 0 };
        const pct = Math.round(hsuiClamp(st.cd || 0, 0, 1) * 100);
        if (a.cd !== pct) {
            if (a.cd > 0 && pct === 0 && !first) { a.b.classList.remove('ready'); void a.b.offsetWidth; a.b.classList.add('ready'); }
            a.cd = pct;
            a.b.style.setProperty('--cd', String(pct));
            a.b.classList.toggle('cool', pct > 0);
        }
        const secT = pct > 0 ? String(Math.ceil(st.cdLeft || 0)) : '';
        if (a.secT !== secT) { a.secT = secT; a.sec.textContent = secT; }
        if (k === 'radar') {
            const on = !!st.on;
            if (a.on !== on) { a.on = on; a.b.classList.toggle('on', on); }
        }
    },

    /** Стрелка радара вокруг героя: ang — радианы на экране (0 — вправо, + вниз). */
    _arrow(ang, temp, hunter) {
        const el = this.arrow;
        if (ang == null || !isFinite(ang)) { if (this._c.arr) { this._c.arr = false; el.classList.remove('on'); } return; }
        let cx = this.W / 2, cy = this.H * 0.55;
        try {
            const G = /** @type {any} */ (hsuiGame());
            if (hunter && G && G.app && G.app.location) {
                const p = G.app.location.view.projectToScreen(hunter.x, hunter.y, 90);
                if (p && p.visible && isFinite(p.x)) { cx = p.x; cy = p.y; }
            }
        } catch (e) { /* без проекции — центр экрана */ }
        const R = 104 * this.u;
        el.style.transform = 'translate(' + (cx + Math.cos(ang) * R).toFixed(1) + 'px,' + (cy + Math.sin(ang) * R).toFixed(1) + 'px) rotate(' + ang.toFixed(3) + 'rad)';
        if (this._c.arrT !== temp) { this._c.arrT = temp; el.className = 'hs-arrow on ' + (temp || ''); }
        if (!this._c.arr) { this._c.arr = true; el.classList.add('on'); }
    },

    // =====================================================================================
    // Баннеры, «ждём», бирки, всплывающий текст
    // =====================================================================================

    banner(kind, text) {
        if (!this.root) return;
        const cfg = HSUI_BANNERS[kind];
        if (!cfg) return;
        const now = performance.now();
        const name = hsuiName(text);
        if (cfg.small) {
            const smalls = Array.from(this.banner_el.querySelectorAll('.hs-bn.note'));
            while (smalls.length >= 2) { const o = smalls.shift(); if (o) o.remove(); }
        } else {
            const cur = this._bigBn;
            if (cur && cur.prio > cfg.prio && now - cur.t0 < cur.ms - 500) return;
            this._clearBanners(true);
        }
        const bn = hsuiEl('div', 'hs-bn ' + cfg.c + (cfg.shake && !hsuiReduced() ? ' shaking' : ''), this.banner_el);
        bn.style.setProperty('--ms', String(cfg.ms));
        const msg = Lang.t(cfg.k).toUpperCase();
        if (cfg.stamp) {
            hsuiEl('div', 'hs-stamp st ' + (cfg.c === 'gold' ? 'gold' : cfg.c), bn).textContent = msg;
            if (cfg.fancy) hsuiEl('div', 'nm', bn).textContent = (name ? name + ' · ' : '') + Lang.t('bn.newspeciesSub');
            else if (name) hsuiEl('div', 'nm', bn).textContent = name;
        } else if (cfg.small) {
            const sn = hsuiEl('div', 'sn', bn);
            sn.innerHTML = '<b></b> <span></span>';
            sn.firstElementChild.textContent = name;
            sn.lastElementChild.textContent = Lang.t(cfg.k);
        } else {
            hsuiEl('div', 'tp hs-tape', bn).textContent = msg;
        }
        if (!cfg.small) this._bigBn = { prio: cfg.prio, t0: now, ms: cfg.ms };
        window.setTimeout(() => bn.remove(), cfg.ms + 80);
    },

    _clearBanners(onlyBig) {
        if (!this.banner_el) return;
        for (const b of Array.from(this.banner_el.children)) if (!onlyBig || !b.classList.contains('note')) b.remove();
        if (!onlyBig) this._bigBn = null;
    },

    /** «Брейнроты прячутся… N» на старте раунда (n <= 0 — скрыть). */
    wait(n) {
        const el = this.wait_el;
        if (!el) return;
        n = n | 0;
        if (n <= 0) { if (el.classList.contains('on')) el.classList.remove('on'); this._c.wn = 0; return; }
        if (!el.classList.contains('on')) { el.classList.add('on'); el.lastElementChild.textContent = Lang.t('hud.wait'); }
        if (this._c.wn !== n) {
            this._c.wn = n;
            const b = /** @type {HTMLElement} */ (el.firstElementChild);
            b.textContent = String(n);
            b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
        }
    },

    /** Бирки над головами: каждый кадр, элементы переиспользуются. */
    tags(list) {
        if (!this.root) return;
        if (!this._hudOn || !list || !list.length) { if (this._tags.size) this._clearTags(); return; }
        const seen = new Set();
        for (const t of list) {
            seen.add(t.id);
            let rec = this._tags.get(t.id);
            if (!rec) {
                const el = hsuiEl('div', 'hs-tag', this.tagsEl);
                const inn = hsuiEl('div', 'hs-tag-in', el);
                const tx = hsuiEl('span', 'tx', inn);
                const fl = hsuiEl('span', 'fl', inn);
                const cg = hsuiEl('span', 'cg', inn);
                fl.textContent = Lang.t('hud.fleeing');
                cg.textContent = Lang.t('hud.caughtTag');
                rec = { el, inn, tx, text: null, rar: '', state: '', px: -1e9, py: -1e9 };
                this._tags.set(t.id, rec);
            }
            if (rec.text !== t.text) { rec.text = t.text; rec.tx.textContent = t.text || ''; }
            const state = t.state || 'normal', rar = t.rarity || 'common';
            if (rec.rar !== rar) { rec.rar = rar; rec.inn.style.setProperty('--rc', hsuiRar(rar).color); }
            if (rec.state !== state) { rec.state = state; rec.el.className = 'hs-tag s-' + state; }
            if (Math.abs(rec.px - t.x) > 0.3 || Math.abs(rec.py - t.y) > 0.3) {
                rec.px = t.x; rec.py = t.y;
                rec.el.style.transform = 'translate3d(' + t.x.toFixed(1) + 'px,' + t.y.toFixed(1) + 'px,0)';
            }
        }
        for (const [id, rec] of Array.from(this._tags)) if (!seen.has(id)) { rec.el.remove(); this._tags.delete(id); }
    },

    _clearTags() {
        for (const rec of this._tags.values()) rec.el.remove();
        this._tags.clear();
    },

    /** «+1» над точкой: поднимается и (монеты, кристаллы, опыт) улетает к своему счётчику. */
    floatText(x, y, text, kind) {
        if (!this.root || !this.floats || !isFinite(x) || !isFinite(y)) return;
        kind = kind || 'coin';
        while (this._flo.length > 14) { const o = this._flo.shift(); if (o) o.remove(); }
        const el = hsuiEl('div', 'hs-float ' + kind, this.floats);
        if (kind === 'coin') hsuiImg('assets/ui/icon-coin.webp', '', el);
        else if (kind === 'gem') hsuiImg('assets/ui/icon-gem.webp', '', el);
        hsuiEl('span', '', el).textContent = String(text);
        this._flo.push(el);
        let target = null, counter = null;
        if (this._hudOn) {
            if (kind === 'coin') { target = this.hCoin.el; counter = this.hCoin; }
            else if (kind === 'gem') { target = this.hGem.el; counter = this.hGem; }
            else if (kind === 'xp') target = this.hLvl;
            else if (kind === 'power') target = this.tool.radar.b;
        }
        const rr = this.root.getBoundingClientRect();
        let ex = x, ey = y - 70 * this.u;
        if (target) {
            const r = target.getBoundingClientRect();
            if (r.width > 0) { ex = r.left - rr.left + r.width * 0.3; ey = r.top - rr.top + r.height / 2; }
        }
        const done = () => { el.remove(); const i = this._flo.indexOf(el); if (i >= 0) this._flo.splice(i, 1); if (counter) counter.bump(); };
        if (typeof el.animate !== 'function') { window.setTimeout(done, 700); return; }
        const rise = 46 * this.u;
        const at = (px, py, sc) => 'translate(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px) translate(-50%,-50%) scale(' + sc + ')';
        const a = el.animate([
            { transform: at(x, y, 0.4), opacity: 0 },
            { transform: at(x, y - rise * 0.7, 1.25), opacity: 1, offset: 0.2 },
            { transform: at(x, y - rise, 1), opacity: 1, offset: 0.45 },
            target ? { transform: at(ex, ey, 0.45), opacity: 0.2 } : { transform: at(x, y - rise * 1.5, 1), opacity: 0 },
        ], { duration: target ? 1050 : 1000, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' });
        a.onfinish = done;
        a.oncancel = done;
    },

    // =====================================================================================
    // Главное меню — обложка журнала
    // =====================================================================================

    _wal: /** @type {{ coin: HsCounter[], gem: HsCounter[] }} */ ({ coin: [], gem: [] }),
    _walBy: /** @type {Record<string, any>} */ ({}),

    /** Пара счётчиков «монеты + кристаллы» с «+» (реклама). */
    _walletPair(parent, id, mini) {
        const coin = this._counter(parent, 'assets/ui/icon-coin.webp', mini ? 'mini' : '', 'coins');
        const gem = this._counter(parent, 'assets/ui/icon-gem.webp', 'gem' + (mini ? ' mini' : ''), 'gems');
        this._wal.coin.push(coin); this._wal.gem.push(gem);
        this._walBy[id] = { coin, gem };
        return this._walBy[id];
    },

    _buildMenu() {
        const m = hsuiEl('div', 'hs-screen hs-menu', this.root);
        this.menu_el = m;
        const L = hsuiEl('div', 'm-l', m), R = hsuiEl('div', 'm-r', m);
        // логотип-штамп
        const logo = hsuiEl('div', 'm-logo', L);
        hsuiEl('span', 'l1', logo).textContent = Lang.t('ui.logo1');
        hsuiEl('span', 'l2', logo).textContent = Lang.t('ui.logo2');
        hsuiEl('span', 'l3', logo).textContent = Lang.t('ui.logoSub');
        // лист дела: номер, название, отметки карт, «Играть», ранг
        const cs = hsuiEl('div', 'm-case hs-paper hs-ruled hs-tape l', L);
        const col = hsuiEl('div', '', cs);
        const top = hsuiEl('div', 'cs-top', col);
        this.mNo = hsuiEl('div', 'cs-no', top);
        this.mRk = hsuiEl('div', 'cs-rk', top);
        this.mName = hsuiEl('div', 'cs-name', col);
        this.mSub = hsuiEl('div', 'cs-sub', col);
        this.mMarks = hsuiEl('div', 'cs-marks', cs);
        const play = this.mPlay = hsuiBtn('hs-btn hs-play', cs, HSUI_ICON.play + '<span></span>');
        play.lastElementChild.textContent = Lang.t('ui.play');
        this._bind(play, () => this._play(), false);
        this.mRank = hsuiEl('div', 'm-rank', L);
        this.mLvl = hsuiEl('b', '', this.mRank);
        this.mBar = hsuiEl('i', '', hsuiEl('div', 'hs-bar', this.mRank));
        // кошелёк
        const wal = hsuiEl('div', 'm-wallet', R);
        this.mCoin = this._walletPair(wal, 'menu').coin;
        this.mGem = this._walBy.menu.gem;
        // Брейндекс — фотоальбом с отметками
        const dx = this.mDex = hsuiBtn('m-dex hs-paper hs-grid hs-tape r', R);
        const dh = hsuiEl('div', 'dx-h', dx, HSUI_ICON.book.replace('<svg', '<svg width="26" height="26"'));
        hsuiEl('span', 'dx-t', dh).textContent = Lang.t('ui.dex');
        this.mDexN = hsuiEl('span', 'dx-n', dh, '0/0');
        this.mDots = hsuiEl('div', 'dx-dots', dx);
        this.mDexInc = hsuiEl('div', 'dx-inc', dx);
        this.mDexBadge = hsuiEl('span', 'hs-badge', dx);
        this._bind(dx, () => this.dexOpen());
        // закладки: снаряжение, магазин, подарок, колесо
        const tabs = hsuiEl('div', 'm-tabs', R);
        const bm = (cls, icon, key, fn) => {
            const b = hsuiBtn('bm ' + cls, tabs, icon + '<span></span>');
            b.lastElementChild.textContent = Lang.t(key);
            this._bind(b, fn);
            return b;
        };
        this.btnGear = bm('gear', HSUI_ICON.radar, 'ui.gear', () => this.gearOpen());
        this.btnShop = bm('shop', HSUI_ICON.bag, 'ui.shop', () => this.openShop());
        this.btnGift = bm('gift', HSUI_ICON.gift, 'ui.gift', () => { if (!this.dailyOpen()) hsuiSfx('error'); });
        this.btnWheel = bm('wheel', HSUI_ICON.wheel, 'ui.wheel', () => { if (!this.wheelOpen()) hsuiSfx('error'); });
        // мелкие кнопки-кнопки: настройки, как играть, звук, рекорды
        const mini = hsuiEl('div', 'm-mini', R);
        const pin = (icon, label, fn) => { const b = hsuiBtn('pin', mini, icon); b.setAttribute('aria-label', label); b.title = label; this._bind(b, fn); return b; };
        pin(HSUI_ICON.cog, Lang.t('ui.settings'), () => this.openSettings());
        pin(HSUI_ICON.question, Lang.t('ui.howto'), () => this._howTo());
        this.mSound = pin(HSUI_ICON.speaker, Lang.t('ui.sound'), () => this._toggleSound());
        this.mSound.dataset.sound = '1';
        this.mRec = pin(HSUI_ICON.cup, Lang.t('rec.button'), () => { if (typeof GameRecords !== 'undefined') GameRecords.open(); });
        this.mRec.hidden = true;
        this._soundIcons();
        document.addEventListener('keydown', e => { if (e.key === 'Escape') this._escape(); });
    },

    _escape() {
        const o = this._open;
        if (this._prz) { this._prizeClose(false); return; }
        if (!o) return;
        if (o === 'shop') this.closeShop(); else if (o === 'dex') this.dexClose(); else if (o === 'gear') this.gearClose();
        else if (o === 'daily') this.closeDaily(); else if (o === 'wheel') this.closeWheel(); else if (o === 'settings') this.closeSettings();
    },

    _play() {
        const G = /** @type {any} */ (hsuiGame());
        hsuiSfx('go');
        this._popClose();
        if (G && G.play) G.play();
    },

    _howTo() {
        const G = /** @type {any} */ (hsuiGame());
        if (this._open === 'settings') this.closeSettings(true);
        if (G && G.howToPlay) { this._menuHide(false); G.howToPlay(); }
    },

    _levelInfo() {
        const G = /** @type {any} */ (hsuiGame());
        try { return G.levelInfo(); } catch (e) { return { level: 1, frac: 0 }; }
    },

    _dexSeenKey() { return (typeof GAME_ID !== 'undefined' ? GAME_ID : 'game') + '.dexSeen'; },
    _dexSeen() { try { return parseInt(Store.get(this._dexSeenKey()) || '0', 10) || 0; } catch (e) { return 0; } },
    _dexMarkSeen(n) { try { Store.set(this._dexSeenKey(), String(n)); } catch (e) { /* без хранилища */ } },

    _menuFill() {
        const G = /** @type {any} */ (hsuiGame());
        if (!G || !G.save) return;
        const mi = G.mapInfo(), lv = this._levelInfo();
        const col = mi.color || '#d6372c';
        this.menu_el.style.setProperty('--mc', col);
        this.mNo.textContent = Lang.t('ui.case', { n: hsuiPad2((mi.index | 0) + 1) });
        this.mName.textContent = hsuiName(mi.name);
        this.mSub.textContent = Lang.t('ui.caseNow') + ' · ' + ((G.save.mapIndex | 0) + 1) + '/' + HS_MAPS.length;
        const cur = G.save.mapIndex | 0;
        this.mMarks.innerHTML = '';
        for (let i = 0; i < HS_MAPS.length; i++) {
            const k = hsuiEl('div', 'mk ' + (i < cur ? 'done' : i === cur ? 'cur' : 'lock'), this.mMarks, i < cur ? '' : String(i + 1));
            if (i < cur) k.innerHTML = HSUI_ICON.tick.replace('<svg', '<svg width="60%" height="60%"');
        }
        this.mLvl.textContent = Lang.t('ui.levelLong', { n: lv.level });
        this.mRk.textContent = Lang.t('ui.levelLong', { n: lv.level });
        this.mBar.parentElement.style.setProperty('--f', hsuiClamp(lv.frac || 0, 0, 1).toFixed(3));
        this._dexCard();
        this.mRec.hidden = !(typeof GameRecords !== 'undefined' && GameRecords.supported);
        this._wallet(false);
        this._soundIcons();
    },

    /** Карточка Брейндекса в меню: «7/15», отметки видов, доход, бейдж NEW. */
    _dexCard() {
        const G = /** @type {any} */ (hsuiGame());
        if (!G || !G.dexList) return;
        const list = G.dexList(), st = G.dexStats();
        const key = list.map(d => d.found ? 1 : 0).join('') + '|' + st.income + '|' + Lang.code;
        if (this._dexKey !== key) {
            this._dexKey = key;
            this.mDexN.textContent = st.found + '/' + st.total;
            this.mDots.innerHTML = '';
            for (const d of list) { const i = hsuiEl('i', d.found ? 'f' : '', this.mDots); i.style.setProperty('--c', d.color); }
            this.mDexInc.textContent = st.found > 0 ? Lang.t('ui.incomeS', { n: st.income }) : Lang.t('dex.sub');
        }
        const nu = st.found > this._dexSeen();
        this.mDexBadge.hidden = !nu;
        this.mDexBadge.textContent = Lang.t('ui.new');
    },

    menu(show) {
        if (!this.root) return;
        this._menuWanted = !!show;
        if (show) {
            if (this._hudOn) this.hud(false);
            this._resultHide(true);
            // окно подарка или колеса, которое Game открыл раньше меню, остаётся: меню вернётся по закрытии
            if (this._open === 'daily' || this._open === 'wheel') { this._menuFill(); this._menuHide(true); return; }
            this._closeWindows(true);
            this._menuFill();
            this._show(this.menu_el, true);
            this._badges();
        } else this._menuHide(false);
    },

    _menuHide(fast) {
        if (!this.menu_el) return;
        if (fast) { clearTimeout(this._timers.get(this.menu_el)); this.menu_el.classList.remove('on', 'in', 'out'); }
        else this._show(this.menu_el, false);
    },

    /** Общее обновление после любой смены сохранения (событие hs-save). */
    refresh() {
        if (!this.root) return;
        this._wallet(true);
        if (this.menu_el.classList.contains('on')) {
            const lv = this._levelInfo();
            this.mLvl.textContent = Lang.t('ui.levelLong', { n: lv.level });
            this.mRk.textContent = Lang.t('ui.levelLong', { n: lv.level });
            this.mBar.parentElement.style.setProperty('--f', hsuiClamp(lv.frac || 0, 0, 1).toFixed(3));
            this._dexCard();
        }
        if (this._open === 'shop') this._shopRefresh();
        if (this._open === 'settings') this._setRefresh();
        if (this._open === 'gear') this._gearFill();
        if (this._open === 'dex') this._dexFill();
        if (this._open === 'daily' && !this._hold) this._dailyFill();
        this._badges();
    },

    _wallet(anim) {
        if (this._hold) return;
        const coins = hsuiCoins(), gems = hsuiGems(), on = hsuiAdsOn();
        for (const c of this._wal.coin) { c.set(coins, anim); if (c.plus) c.plus.hidden = !on; }
        for (const c of this._wal.gem) { c.set(gems, anim); if (c.plus) c.plus.hidden = !on; }
    },

    // ---- общий тик: «Через N с», таймеры, значки ----

    _startTicker() {
        if (this._tk) return;
        this._tk = window.setInterval(() => this._tick(), 500);
        try { if (typeof Platform !== 'undefined' && typeof Platform.onRewardedCooldown === 'function') Platform.onRewardedCooldown(() => this._tick()); } catch (e) { /* без платформы */ }
        document.addEventListener('pointerdown', e => {
            const p = this._pop;
            if (!p) return;
            const t = /** @type {Node} */ (e.target);
            if (!p.el.contains(t) && !(p.anchorBtn && p.anchorBtn.contains(t))) this._popClose();
        }, true);
    },

    _tick() {
        if (!this.root) return;
        try {
            const o = this._open;
            if (o === 'shop') this._shopRefresh();
            else if (o === 'daily') this._dailyFill();
            else if (o === 'wheel') this._wheelRefresh();
            this._popRefresh();
            this._offerRefresh();
            this._badges();
            this._x2Refresh();
        } catch (e) { console.error('GameUI: обновление окон:', e); }
    },

    /** Метки на «Подарок» и «Колесо», плюсы у кошелька — по готовности рекламы. */
    _badges() {
        const on = hsuiAdsOn();
        for (const c of this._counters) if (c.plus) c.plus.hidden = !on;
        if (!this.menu_el || !this.menu_el.classList.contains('on')) return;
        let g = 0, w = 0;
        try { if (typeof DailyGift !== 'undefined' && DailyGift._rewards && DailyGift._rewards.length && !DailyGift.tutorialActive()) g = DailyGift.badge(); } catch (e) { /* не готов */ }
        try { if (typeof Wheel !== 'undefined' && Wheel._sectors && Wheel._sectors.length > 1) w = Wheel.badge(); } catch (e) { /* не готов */ }
        this.btnGift.classList.toggle('attn', !!g);
        this.btnWheel.classList.toggle('attn', !!w);
        this._dexCard();
    },

    _holdWallet(on) {
        clearTimeout(this._holdT);
        this._hold = !!on;
        if (on) this._holdT = window.setTimeout(() => { this._hold = false; this._wallet(true); }, 15000);
    },

    _shake(el) {
        if (!el) return;
        el.classList.remove('hs-shake'); void el.offsetWidth; el.classList.add('hs-shake');
    },

    /** Красная (good — зелёная, neutral — серая) подсказка на 2.6 с. */
    _hintOn(el, text, kind) {
        if (!el) return;
        el.textContent = text;
        el.classList.toggle('good', kind === 'good');
        el.classList.toggle('neutral', kind === 'neutral');
        el.classList.add('on');
        const old = this._timers.get(el);
        if (old) clearTimeout(old);
        this._timers.set(el, window.setTimeout(() => { el.classList.remove('on'); this._timers.delete(el); }, 2600));
    },

    /** Счётчики окна, что сейчас на экране: куда летят монеты. */
    _curCounters() {
        const w = this._walBy[this._open || 'menu'] || this._walBy.menu;
        return { coin: w.coin, gem: w.gem };
    },

    /** Монеты или кристаллы вылетают из прямоугольника from и влетают в счётчик target. */
    _fly(icon, from, target, n, onLand) {
        const el = target && target.el ? target.el : target;
        const done = () => { if (onLand) onLand(); };
        if (!this.root || !el || typeof el.getBoundingClientRect !== 'function' || typeof Element.prototype.animate !== 'function') { done(); return; }
        const t = el.getBoundingClientRect();
        if (!(t.width > 0)) { done(); return; }
        const rr = this.root.getBoundingClientRect();
        const sx = from.left + from.width / 2 - rr.left, sy = from.top + from.height / 2 - rr.top;
        const ex = t.left + Math.min(t.width * 0.3, 30 * this.u) - rr.left, ey = t.top + t.height / 2 - rr.top;
        n = hsuiReduced() ? Math.min(3, n) : Math.max(1, Math.min(12, n));
        let landed = 0;
        for (let i = 0; i < n; i++) {
            const c = hsuiEl('i', 'hs-fly', this.fxl);
            c.style.backgroundImage = "url('" + icon + "')";
            const ang = Math.random() * Math.PI * 2, rad = (20 + Math.random() * 46) * this.u;
            const mx = sx + Math.cos(ang) * rad, my = sy + Math.sin(ang) * rad - 20 * this.u;
            const an = c.animate([
                { transform: 'translate(' + sx + 'px,' + sy + 'px) scale(.4)', opacity: 0 },
                { transform: 'translate(' + mx + 'px,' + my + 'px) scale(1.15)', opacity: 1, offset: 0.3 },
                { transform: 'translate(' + ex + 'px,' + ey + 'px) scale(.6)', opacity: 1, offset: 0.92 },
                { transform: 'translate(' + ex + 'px,' + ey + 'px) scale(.3)', opacity: 0 },
            ], { duration: 950, delay: i * 55, easing: 'cubic-bezier(.45,0,.55,1)', fill: 'both' });
            const fin = () => { c.remove(); if (++landed === n) done(); };
            an.onfinish = fin;
            an.oncancel = fin;
        }
    },

    /** Всплеск «чернильных» звёздочек из центра элемента. */
    _burst(el, n) {
        if (!this.root || !el || typeof Element.prototype.animate !== 'function') return;
        const rr = this.root.getBoundingClientRect(), r = el.getBoundingClientRect();
        const cx = r.left - rr.left + r.width / 2, cy = r.top - rr.top + r.height / 2;
        const cols = ['#ffd84a', '#d6372c', '#2e9a50', '#2b5db0', '#f6edd6'];
        n = hsuiReduced() ? 5 : (n || 18);
        for (let i = 0; i < n; i++) {
            const s = hsuiEl('i', 'hs-bst', this.fxl);
            s.style.setProperty('--c', cols[i % cols.length]);
            const a = Math.random() * Math.PI * 2, d = (46 + Math.random() * 90) * this.u;
            const x1 = cx + Math.cos(a) * d, y1 = cy + Math.sin(a) * d - 18 * this.u;
            const an = s.animate([
                { transform: 'translate(' + cx + 'px,' + cy + 'px) scale(.2) rotate(0deg)', opacity: 1 },
                { transform: 'translate(' + x1 + 'px,' + y1 + 'px) scale(1) rotate(160deg)', opacity: 1, offset: 0.55 },
                { transform: 'translate(' + x1 + 'px,' + (y1 + 46 * this.u) + 'px) scale(.2) rotate(320deg)', opacity: 0 },
            ], { duration: 750 + Math.random() * 400, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
            an.onfinish = () => s.remove();
            an.oncancel = () => s.remove();
        }
    },

    // ---- «+» у кошелька: что даёт, за что ----

    _adPop(kind, counter) {
        if (this._pop && this._pop.kind === kind && this._pop.anchor === counter.el) { this._popClose(); return; }
        this._popClose();
        const gems = kind === 'gems';
        const el = hsuiEl('div', 'hs-pop hs-paper hs-tape', this.root);
        const row = hsuiEl('div', 'row', el);
        hsuiImg(gems ? 'assets/ui/icon-gem.webp' : 'assets/ui/icon-coin.webp', 'pi', row);
        const pt = hsuiEl('div', 'pt', row);
        hsuiEl('b', '', pt).textContent = '+' + hsuiFmt(hsuiAdAmount(kind)) + ' ' + Lang.t(gems ? 'ui.popGems' : 'ui.popCoins');
        hsuiEl('small', '', pt).textContent = Lang.t('ui.popSub');
        const btn = hsuiBtn('hs-btn green', el, HSUI_ICON.play + '<span></span>');
        const hint = hsuiEl('div', 'hs-hint', el);
        this._bind(btn, () => this._popGo(), false);
        this._pop = { kind, el, btn, hint, anchor: counter.el, anchorBtn: counter.plus, busy: false, key: '' };
        const rr = this.root.getBoundingClientRect(), a = counter.el.getBoundingClientRect();
        const w = el.offsetWidth || 300 * this.u;
        el.style.left = hsuiClamp(a.right - rr.left - w + 10 * this.u, 8, Math.max(8, this.W - w - 8)).toFixed(0) + 'px';
        el.style.top = (a.bottom - rr.top + 14 * this.u).toFixed(0) + 'px';
        this._popRefresh();
    },

    _popClose() {
        const p = this._pop;
        if (!p) return;
        this._pop = null;
        p.el.remove();
    },

    _popRefresh() {
        const p = this._pop;
        if (!p) return;
        if (!p.anchor.getClientRects().length) { this._popClose(); return; }
        const wait = hsuiAdWait(), ready = hsuiAdReady() && !p.busy;
        const text = p.busy ? Lang.t('ui.adRunning') : wait ? wait.toUpperCase() : Lang.t('ui.watchAd');
        const key = text + '|' + ready;
        if (p.key === key) return;
        p.key = key;
        p.btn.lastElementChild.textContent = text;
        p.btn.classList.toggle('off', !ready);
        p.btn.querySelector('svg').style.display = wait ? 'none' : '';
    },

    async _popGo() {
        const p = this._pop, a = hsuiAds();
        if (!p || p.busy || !a) return;
        if (!hsuiAdReady()) { this._shake(p.btn); return; }
        p.busy = true;
        this._holdWallet(true);
        this._popRefresh();
        let r = null;
        try { r = await (p.kind === 'gems' ? a.gems() : a.coins()); } catch (e) { r = null; }
        p.busy = false;
        if (r && r.ok) {
            const n = r.amount | 0, from = p.el.getBoundingClientRect(), gems = p.kind === 'gems';
            hsuiSfx('buy');
            if (this._pop === p) this._popClose();
            this._flyReward(gems ? 'gems' : 'coins', n, from, gems ? this._curCounters().gem : this._curCounters().coin);
        } else {
            this._holdWallet(false);
            if (this._pop === p) {
                this._popRefresh();
                this._hintOn(p.hint, Lang.t(r && (r.reason === 'cooldown' || r.reason === 'busy') ? 'ui.adNone' : 'ui.adFail'));
            }
        }
    },

    /** Награда валютой: «+N» над местом, монеты летят в счётчик, число растёт по прилёту. */
    _flyReward(kind, n, from, counter) {
        const gems = kind === 'gems';
        const icon = gems ? 'assets/ui/icon-gem.webp' : 'assets/ui/icon-coin.webp';
        const rr = this.root.getBoundingClientRect();
        if (n > 0) this.floatText(from.left + from.width / 2 - rr.left, from.top + from.height / 2 - rr.top, '+' + hsuiFmt(n), gems ? 'gem' : 'coin');
        this._fly(icon, from, counter, Math.min(12, 4 + Math.floor(n / 40)), () => {
            this._holdWallet(false);
            this._wallet(true);
            if (counter && counter.bump) counter.bump();
        });
    },

    // ---- окно награды (подарок дня, колесо) ----

    /** @param {{ title?: string, items: Array<{ kind: 'coins'|'gems'|'item', amount?: number, id?: string, note?: string }>, note?: string, onClose?: () => void }} o */
    _prize(o) {
        this._prizeClose(true);
        const S = hsuiShop();
        const el = hsuiEl('div', 'hs-prize', this.root);
        const card = hsuiEl('div', 'pz-card hs-paper hs-tape', el);
        hsuiEl('div', 'hs-stamp st green', card).textContent = (o.title || Lang.t('ui.got')).toUpperCase();
        const row = hsuiEl('div', 'pz-row', card);
        let notes = '';
        o.items.forEach((it, k) => {
            const box = hsuiEl('div', 'pz-it', row);
            box.style.setProperty('--k', String(k));
            const big = hsuiEl('div', 'big', box);
            if (it.kind === 'item') {
                const item = S ? S.item(it.id) : null;
                const col = hsuiRar(item ? item.rarity : 'common').color;
                box.style.setProperty('--rc', col);
                big.style.setProperty('--rc', col);
                hsuiIcon(item ? item.icon : '', big, col, item ? item.tab : '');
                hsuiEl('small', '', box).textContent = S ? S.name(it.id) : String(it.id);
                if (item) hsuiEl('span', 'rr', box).textContent = hsuiRarName(item.rarity);
            } else {
                hsuiImg(it.kind === 'gems' ? 'assets/ui/icon-gem.webp' : 'assets/ui/icon-coin.webp', '', big);
                hsuiEl('b', '', box).textContent = '+' + hsuiFmt(it.amount || 0);
            }
            if (it.note) notes = it.note;
        });
        if (notes || o.note) hsuiEl('div', 'pz-note', card).textContent = o.note || notes;
        const btn = hsuiBtn('hs-btn green', card, '<span></span>');
        btn.lastElementChild.textContent = Lang.t('ui.gotIt');
        this._bind(btn, () => this._prizeClose(false), false);
        this._prz = { el, o, card };
        hsuiSfx('buy');
        window.setTimeout(() => { if (this._prz && this._prz.el === el) this._burst(card, 22); }, 160);
    },

    /** Закрыть окно награды; монеты и кристаллы летят в счётчик окна под ним. */
    _prizeClose(silent) {
        const p = this._prz;
        if (!p) return;
        this._prz = null;
        const from = p.card.getBoundingClientRect();
        p.el.remove();
        const cn = this._curCounters();
        if (silent) { this._holdWallet(false); this._wallet(true); return; }
        hsuiSfx('click');
        let coins = 0, gems = 0;
        for (const it of p.o.items) { if (it.kind === 'coins') coins += it.amount || 0; else if (it.kind === 'gems') gems += it.amount || 0; }
        let pend = (coins > 0 ? 1 : 0) + (gems > 0 ? 1 : 0);
        const land = () => { if (--pend <= 0) { this._holdWallet(false); this._wallet(true); } };
        if (coins > 0) this._fly('assets/ui/icon-coin.webp', from, cn.coin, Math.min(12, 4 + Math.floor(coins / 40)), () => { if (cn.coin) cn.coin.bump(); land(); });
        if (gems > 0) this._fly('assets/ui/icon-gem.webp', from, cn.gem, Math.min(8, 3 + Math.floor(gems / 4)), () => { if (cn.gem) cn.gem.bump(); land(); });
        if (pend <= 0) { this._holdWallet(false); this._wallet(true); }
        try { if (p.o.onClose) p.o.onClose(); } catch (e) { console.error(e); }
    },

    /** got из DailyGift.claim()/Wheel.finish() -> карточки награды (валюта суммируется). */
    _gotItems(got, extraGems) {
        let coins = 0, gems = extraGems | 0, conv = false;
        const items = [];
        for (const g of got || []) {
            if (!g) continue;
            if (g.type === 'coins') { coins += g.amount | 0; if (g.converted) conv = true; }
            else if (g.type === 'gems') gems += g.amount | 0;
            else if ((g.type === 'item' || g.type === 'exclusive') && g.id) items.push({ kind: /** @type {'item'} */ ('item'), id: g.id });
        }
        const out = [];
        if (coins > 0) out.push({ kind: /** @type {'coins'} */ ('coins'), amount: coins, note: conv ? Lang.t('ui.dup') : '' });
        if (gems > 0) out.push({ kind: /** @type {'gems'} */ ('gems'), amount: gems });
        return out.concat(items);
    },

    // =====================================================================================
    // Окна: общий каркас
    // =====================================================================================

    /**
     * Окно-разворот журнала: затемнение, лист с корешком, шапка (название, кошелёк, закрыть).
     * @param {string} id @param {{ title: string, sub?: string, wallet?: boolean, close: () => void, cls?: string, sheetCls?: string }} o
     */
    _mkWin(id, o) {
        const win = hsuiEl('div', 'hs-screen hs-win hs-w-' + id + (o.cls ? ' ' + o.cls : ''), this.root);
        const sheet = hsuiEl('div', 'hs-sheet hs-paper hs-tape ' + (o.sheetCls || ''), win);
        const head = hsuiEl('div', 'sh-head', sheet);
        const t = hsuiEl('div', 'sh-title', head);
        t.textContent = o.title;
        if (o.sub) hsuiEl('small', '', t).textContent = o.sub;
        let wal = null;
        if (o.wallet !== false) wal = this._walletPair(hsuiEl('div', 'sh-wallet', head), id);
        const close = hsuiBtn('hs-x', head, HSUI_ICON.close);
        close.setAttribute('aria-label', Lang.t('ui.close'));
        this._bind(close, o.close);
        win.addEventListener('click', e => { if (e.target === win) o.close(); });
        this._wins[id] = win;
        return { win, sheet, head, wal };
    },

    /** Открыть окно: меню прячется, кошелёк обновляется. */
    _winOpen(id, el) {
        this._popClose();
        this._open = id;
        this._menuHide(false);
        this._wallet(false);
        this._show(el, true);
        hsuiSfx('whoosh');
    },

    _winClose(id, el) {
        if (this._open !== id) return;
        this._open = '';
        this._show(el, false);
        this._back();
    },

    _back() {
        if (this._menuWanted && !this._hudOn) {
            this._menuFill();
            this._show(this.menu_el, true);
            this._badges();
        }
    },

    _closeWindows(fast) {
        this._popClose();
        this._prizeClose(true);
        const o = this._open;
        this._open = '';
        if (o === 'shop') this._shopClosed();
        for (const id of Object.keys(this._wins)) {
            const w = this._wins[id];
            if (fast) { clearTimeout(this._timers.get(w)); w.classList.remove('on', 'in', 'out', 'peek'); } else this._show(w, false);
        }
    },

    // =====================================================================================
    // Брейндекс: фотоальбом пойманных видов
    // =====================================================================================

    _dexSel: '',

    _buildDex() {
        const w = this._mkWin('dex', { title: Lang.t('dex.title'), sub: Lang.t('dex.sub'), wallet: false, close: () => this.dexClose() });
        const body = hsuiEl('div', 'hs-body', w.sheet);
        const main = hsuiEl('div', 'dex-main', body);
        const sum = hsuiEl('div', 'dex-sum', main);
        this.dxStamp = hsuiEl('span', 'hs-stamp st', sum);
        this.dxInc = hsuiEl('span', 'inc', sum);
        const sc = hsuiEl('div', 'dex-scroll hs-scroll', main);
        this.dxGrid = hsuiEl('div', 'dex-grid', sc);
        hsuiEl('div', 'dex-foot', main).textContent = Lang.t('dex.hint');
        this.dxSide = hsuiEl('div', 'dex-side hs-tape', body);
        this.dex_el = w.win;
    },

    dexOpen() {
        if (!this.root || this._hudOn) return;
        if (this._open === 'dex') return;
        if (this._open) this._closeWindows(true);
        if (!this.dex_el) this._buildDex();
        const G = /** @type {any} */ (hsuiGame());
        if (!this._dexSel && G && G.dexList) { const l = G.dexList(); const f = l.find(d => d.found) || l[0]; this._dexSel = f ? f.id : ''; }
        this._dexFill();
        this._winOpen('dex', this.dex_el);
    },

    dexClose() {
        if (this._open !== 'dex') return;
        const G = /** @type {any} */ (hsuiGame());
        if (G && G.dexStats) this._dexMarkSeen(G.dexStats().found);
        this._winClose('dex', this.dex_el);
    },

    _dexFill() {
        const G = /** @type {any} */ (hsuiGame());
        if (!G || !G.dexList || !this.dex_el) return;
        const list = G.dexList(), st = G.dexStats();
        this.dxStamp.textContent = Lang.t('ui.found', { a: st.found, b: st.total });
        this.dxInc.textContent = Lang.t('ui.income', { n: st.income });
        const g = this.dxGrid;
        g.innerHTML = '';
        list.forEach((d, i) => {
            const rc = hsuiRar(d.rarity).color;
            const el = hsuiBtn('dc' + (d.found ? '' : ' un') + (d.id === this._dexSel ? ' sel' : ''), g);
            el.style.setProperty('--rc', rc);
            el.style.setProperty('--r', ((i * 37) % 7 - 3) * 0.6 + 'deg');
            const ph = hsuiEl('span', 'hs-photo', el);
            hsuiEl('span', 'no', ph).textContent = '№' + hsuiPad2(d.num);
            const im = hsuiEl('span', 'im', ph);
            hsuiPortrait(d.portrait, d.color, im, !d.found);
            if (d.found && d.count > 1) hsuiEl('span', 'cn', el).textContent = '×' + d.count;
            const ca = hsuiEl('span', 'ca', el);
            hsuiEl('span', 'nm', ca).textContent = d.found ? hsuiName(d.name) : Lang.t('dex.unknown');
            if (d.found) hsuiEl('span', 'rw', ca).textContent = hsuiRarName(d.rarity);
            this._bind(el, () => { this._dexSel = d.id; this._dexFill(); }, true);
        });
        this._dexSide(list.find(d => d.id === this._dexSel) || list[0]);
    },

    _dexSide(d) {
        const s = this.dxSide;
        s.innerHTML = '';
        if (!d) { hsuiEl('div', 'pn', s).textContent = Lang.t('dex.pick'); return; }
        const rc = hsuiRar(d.rarity).color;
        s.style.setProperty('--rc', rc);
        const ph = hsuiEl('div', 'big hs-photo', s);
        const im = hsuiEl('span', 'im', ph);
        hsuiPortrait(d.portrait, d.color, im, !d.found);
        hsuiEl('div', 'pn', s).textContent = d.found ? hsuiName(d.name) : '№' + hsuiPad2(d.num) + ' · ' + Lang.t('dex.unknown');
        if (d.found) {
            hsuiEl('div', 'rr', s).textContent = hsuiRarName(d.rarity);
            hsuiEl('div', 'ln', s).textContent = Lang.t('dex.caught', { n: d.count });
            hsuiEl('div', 'ln', s).textContent = Lang.t('dex.income', { n: d.income });
            hsuiEl('div', 'ln', s).textContent = Lang.t('dex.first', { n: d.firstBonus });
            hsuiEl('div', 'ln', s).textContent = Lang.t('dex.catch', { n: d.catchCoins });
            const tr = hsuiEl('div', 'tr', s);
            tr.textContent = Lang.t('dex.habit') + ': ' + hsuiName(d.trait);
        } else {
            hsuiEl('div', 'rr', s).textContent = hsuiRarName(d.rarity);
            hsuiEl('div', 'tr', s).textContent = Lang.t('dex.locked');
            hsuiEl('div', 'ln', s).textContent = Lang.t('dex.first', { n: d.firstBonus });
        }
    },

    // =====================================================================================
    // Снаряжение: два чертежа с улучшениями
    // =====================================================================================

    _buildGear() {
        const w = this._mkWin('gear', { title: Lang.t('gear.title'), sub: Lang.t('gear.sub'), close: () => this.gearClose() });
        const row = hsuiEl('div', 'gear-row', w.sheet);
        this.gr = {};
        for (const [id, rot] of [['radar', -0.8], ['net', 0.9]]) {
            const bp = hsuiEl('div', 'bp hs-tape', row);
            bp.style.setProperty('--r', rot + 'deg');
            const bh = hsuiEl('div', 'bh', bp);
            hsuiEl('div', 'bi', bh, id === 'radar' ? HSUI_ICON.radar : HSUI_ICON.net);
            const nb = hsuiEl('div', '', bh);
            hsuiEl('div', 'bn', nb).textContent = Lang.t('gear.' + id);
            hsuiEl('div', 'bd', nb).textContent = Lang.t('gear.' + id + 'D');
            const lv = hsuiEl('div', 'lv', bp);
            const rows = hsuiEl('div', 'rows', bp);
            const hint = hsuiEl('div', 'hs-hint', bp);
            const btn = hsuiBtn('hs-btn', bp, '<span></span>');
            this._bind(btn, () => this._gearUp(id), false);
            this.gr[id] = { bp, lv, rows, btn, hint };
        }
        this.gear_el = w.win;
    },

    gearOpen() {
        if (!this.root || this._hudOn) return;
        if (this._open === 'gear') return;
        if (this._open) this._closeWindows(true);
        if (!this.gear_el) this._buildGear();
        this._gearFill();
        this._winOpen('gear', this.gear_el);
    },

    gearClose() { this._winClose('gear', this.gear_el); },

    _gearFill() {
        const G = /** @type {any} */ (hsuiGame());
        if (!G || !G.toolInfo || !this.gear_el) return;
        for (const id of ['radar', 'net']) {
            const i = G.toolInfo(id), c = this.gr[id];
            c.lv.innerHTML = '';
            for (let k = 1; k <= i.max; k++) hsuiEl('i', k <= i.level ? 'f' : '', c.lv);
            hsuiEl('span', '', c.lv).textContent = Lang.t('gear.lvl', { a: i.level, b: i.max });
            const sec = v => v + ' ' + Lang.t('hud.sec');
            const defs = id === 'radar'
                ? [{ key: 'cooldown', fmt: sec }, { key: 'duration', fmt: sec }, { key: 'jitter', fmt: v => Lang.t('gear.deg', { n: v }), lang: 'accuracy' }]
                : [{ key: 'range', fmt: v => Lang.t('gear.m', { n: hsuiMeters(v) }) }, { key: 'cooldown', fmt: sec }, { key: 'radius', fmt: v => Lang.t('gear.m', { n: hsuiMeters(v * 2) }), lang: 'size' }];
            c.rows.innerHTML = '';
            for (const d of defs) {
                const r = hsuiEl('div', 'rw', c.rows);
                hsuiEl('span', 'k', r).textContent = Lang.t('gear.' + (d.lang || d.key));
                hsuiEl('span', 'a', r).textContent = d.fmt(i.now[d.key]);
                if (i.next) {
                    hsuiEl('span', 'ar', r, HSUI_ICON.chevR);
                    hsuiEl('span', 'b', r).textContent = d.fmt(i.next[d.key]);
                } else hsuiEl('span', 'b na', r).textContent = '';
            }
            const b = c.btn;
            b.classList.toggle('off', i.maxed);
            b.classList.toggle('green', !i.maxed && i.canAfford);
            const lbl = /** @type {HTMLElement} */ (b.lastElementChild);
            if (i.maxed) lbl.textContent = Lang.t('gear.max');
            else lbl.innerHTML = Lang.t('gear.up') + ' <img src="assets/ui/icon-coin.webp" alt="" style="display:inline-block;width:1.3em;height:1.3em;vertical-align:-.3em"> ' + hsuiFmt(i.price);
        }
        this._wallet(true);
    },

    _gearUp(id) {
        const G = /** @type {any} */ (hsuiGame());
        if (!G) return;
        const i = G.toolInfo(id), c = this.gr[id];
        if (i.maxed) { this._shake(c.btn); return; }
        const r = G.upgradeTool(id);
        if (r && r.ok) {
            hsuiSfx('buy');
            c.bp.classList.remove('flash'); void c.bp.offsetWidth; c.bp.classList.add('flash');
            this._burst(c.bp, 18);
        } else {
            hsuiSfx('error');
            this._shake(c.btn);
            this._hintOn(c.hint, Lang.t('gear.need', { n: hsuiFmt(Math.max(1, (i.price || 0) - hsuiCoins())) }));
        }
        this._gearFill();
    },

    // =====================================================================================
    // Магазин: 6 вкладок каталога (HS_SHOP_TABS) и «Усиления»
    // =====================================================================================

    _shopState: { tab: 'skin', sel: {} },
    _shopBusy: false,
    _peekOn: false,
    _unShop: null,

    _tabList() {
        const tabs = (typeof HS_SHOP_TABS !== 'undefined' ? HS_SHOP_TABS : []).map(t => ({ id: t.id, name: hsText(t.name) }));
        tabs.push({ id: 'power', name: Lang.t('ui.tab.power') });
        return tabs;
    },

    _buildShop() {
        const w = this._mkWin('shop', { title: Lang.t('ui.shop'), close: () => this.closeShop() });
        this.shop_el = w.win;
        const pn = w.sheet;
        const tabs = hsuiEl('div', 'hs-tabs', pn);
        this.shTabs = {};
        for (const t of this._tabList()) {
            const b = hsuiBtn('hs-tab', tabs, (HSUI_TABIC[t.id] || HSUI_ICON.star) + '<span></span>');
            b.lastElementChild.textContent = t.name.toUpperCase();
            b.setAttribute('aria-label', t.name);
            this._bind(b, () => this._shopTab(t.id));
            this.shTabs[t.id] = b;
        }
        this.shBody = hsuiEl('div', 'hs-body', pn);
        // нижняя планка режима «на герое»
        const pk = hsuiEl('div', 'hs-peek hs-paper hs-tape', w.win);
        const back = hsuiBtn('hs-btn paper', pk, HSUI_ICON.chevL + '<span></span>');
        back.lastElementChild.textContent = Lang.t('ui.back');
        this._bind(back, () => this._peek(false));
        const nl = hsuiBtn('pin', pk, HSUI_ICON.chevL), nr = hsuiBtn('pin', pk, HSUI_ICON.chevR);
        this._bind(nl, () => this._step(-1)); this._bind(nr, () => this._step(1));
        const info = hsuiEl('div', 'pi', pk);
        const pnm = hsuiEl('div', 'pn', info), prr = hsuiEl('div', 'pr2', info);
        const hint = hsuiEl('div', 'hs-hint', info);
        const act = hsuiBtn('hs-btn', pk, '<span></span>');
        this._bind(act, () => this._shopAct(this._shopState.sel[this._shopState.tab]), false);
        pk.insertBefore(nl, info); pk.insertBefore(nr, info.nextSibling);
        this.peek = { el: pk, nm: pnm, rr: prr, hint, act, actKey: '' };
    },

    openShop(tab, from) {
        if (!this.root || this._hudOn) return;
        if (this._open && this._open !== 'shop') this._closeWindows(true);
        if (!this.shop_el) this._buildShop();
        this._shopSub();
        this._peek(false);
        this._shopTab(this.shTabs[tab] ? tab : (this._shopState.tab || 'skin'), true);
        this._winOpen('shop', this.shop_el);
        void from;
    },

    closeShop() {
        if (this._open !== 'shop') return;
        this._peek(false);
        this._shopClosed();
        this._winClose('shop', this.shop_el);
    },

    /** Окно магазина закрыто: на герое снова надетое. */
    _shopClosed() {
        this._peekOn = false;
        if (this.shop_el) this.shop_el.classList.remove('peek');
        this._gPreviewReset();
    },

    /** Shop.init сбрасывает слушателей, поэтому подписываемся при каждом открытии. */
    _shopSub() {
        try {
            if (this._unShop) this._unShop();
            this._unShop = typeof Shop !== 'undefined' ? Shop.on(() => { if (this._open === 'shop') this._shopRefresh(); }) : null;
        } catch (e) { this._unShop = null; }
    },

    /** Предпросмотр предмета на герое в 3D-сцене меню. */
    _gPreview(id) {
        const G = /** @type {any} */ (hsuiGame());
        try { if (G && typeof G.shopPreview === 'function') G.shopPreview(id); } catch (e) { /* предпросмотр не обязателен */ }
    },
    _gPreviewReset() { this._gPreview(null); },

    /** Режим «на герое»: лист прячется, виден 3D-герой, снизу — купить / надеть, стрелки и «Назад». */
    _peek(on) {
        const w = this.shop_el;
        if (!w) return;
        on = !!on && this._shopState.tab !== 'power';
        this._peekOn = on;
        w.classList.toggle('peek', on);
        if (on) this._peekFill(this._model());
    },

    _model(id) {
        const S = hsuiShop();
        if (!S) return null;
        const st = this._shopState;
        return S.card(id || st.sel[st.tab]);
    },

    _shopTab(tab, quiet) {
        const st = this._shopState;
        st.tab = tab;
        for (const id of Object.keys(this.shTabs)) this.shTabs[id].classList.toggle('on', id === tab);
        const S = hsuiShop();
        const body = this.shBody;
        body.innerHTML = '';
        this.cards = [];
        this.pcards = [];
        this.prev = null;
        if (tab === 'power') {
            const sc = hsuiEl('div', 'hs-scroll', body);
            sc.style.flex = '1';
            const grid = hsuiEl('div', 'hs-pcards', sc);
            HS_POWERUPS.forEach((it, i) => this._mkPower(grid, it, i));
            this._gPreviewReset();
        } else {
            const models = S ? S.cards(tab) : [];
            const sc = hsuiEl('div', 'hs-scroll', body);
            sc.style.flex = '1';
            const grid = hsuiEl('div', 'hs-sh-grid', sc);
            this.shGrid = grid;
            if (!models.length) {
                hsuiEl('div', 'rs-empty', grid).textContent = Lang.t('ui.empty');
                this._shopRefresh();
                return;
            }
            if (!st.sel[tab] || !models.some(m => m.id === st.sel[tab])) {
                const eq = models.find(m => m.equipped);
                st.sel[tab] = eq ? eq.id : models[0].id;
            }
            models.forEach((m, i) => this._mkCard(grid, tab, m, i));
            this._mkPrev(body);
            this._selectItem(st.sel[tab], !!quiet);
            const cur = this.cards.find(c => c.id === st.sel[tab]);
            if (cur) setTimeout(() => cur.el.scrollIntoView({ block: 'nearest' }), 60);
        }
        this._shopRefresh();
    },

    _mkCard(grid, tab, m, i) {
        const r = hsuiRar(m.rarity);
        const el = hsuiBtn('ic', grid);
        el.style.setProperty('--rc', r.color);
        el.style.setProperty('--rca', hsuiRgba(r.color, m.rarity === 'common' ? 0.25 : 0.55));
        el.style.setProperty('--r', ((i * 53) % 7 - 3) * 0.55 + 'deg');
        const ph = hsuiEl('span', 'hs-photo', el);
        const im = hsuiEl('span', 'im', ph);
        hsuiIcon(m.item.icon, im, r.color, tab);
        if (tab === 'net' && m.item.color) {
            const sw = hsuiEl('span', 'sw', im);
            hsuiEl('i', '', sw).style.background = m.item.color;
            if (m.item.wave) hsuiEl('i', '', sw).style.background = m.item.wave;
        }
        const st = hsuiEl('span', '', ph);
        hsuiEl('span', 'nm', el).textContent = m.name;
        const pr = hsuiEl('span', 'pr', el);
        const rec = { id: m.id, el, st, pr, tab, key: '' };
        this.cards.push(rec);
        this._bind(el, () => this._selectItem(m.id, false), true);
        el.addEventListener('dblclick', () => { const c = this._model(m.id); if (c && c.action === 'equip') this._shopAct(m.id); });
    },

    _cardFill(c, m) {
        c.el.classList.toggle('sel', c.id === this._shopState.sel[c.tab]);
        const key = [m.state, m.kind, m.progress, m.need, m.affordable ? 1 : 0].join('|');
        if (c.key === key) return;
        c.key = key;
        c.st.className = m.equipped ? 'st-eq' : m.owned ? 'st-own' : 'st-lock';
        c.st.innerHTML = m.owned ? HSUI_ICON.tick : HSUI_ICON.lock;
        const pr = c.pr;
        pr.className = 'pr';
        pr.innerHTML = '';
        if (m.equipped) pr.textContent = Lang.t('ui.wearing');
        else if (m.owned) pr.textContent = Lang.t('ui.bought');
        else if (m.kind === 'coins') {
            hsuiImg('assets/ui/icon-coin.webp', '', pr);
            hsuiEl('span', '', pr).textContent = hsuiFmt(m.price);
            pr.classList.toggle('cant', !m.affordable);
        } else if (m.kind === 'ads') { pr.classList.add('ad'); pr.textContent = Lang.t('ui.adProg', { a: m.progress, b: m.need }); }
        else if (m.kind === 'exclusive') { pr.innerHTML = HSUI_ICON.gift.replace('<svg', '<svg width="14" height="14"') + '<span></span>'; pr.lastElementChild.textContent = Lang.t('ui.exclusive'); }
    },

    _mkPrev(body) {
        const pv = hsuiEl('div', 'hs-prev hs-paper hs-kraft hs-tape', body);
        const stage = hsuiEl('div', 'stage', pv);
        const ph = hsuiEl('div', 'hs-photo', stage);
        const img = hsuiEl('div', 'im', ph);
        const nm = hsuiEl('div', 'pn', pv);
        const pm = hsuiEl('div', 'pm', pv);
        const rr = hsuiEl('span', 'rr', pm);
        const state = hsuiEl('span', 'stt', pm);
        const gs = hsuiEl('div', 'gs', pv);
        const price = hsuiEl('div', 'prc', pv);
        const hint = hsuiEl('div', 'hs-hint', pv);
        const acts = hsuiEl('div', 'acts', pv);
        const adc = hsuiBtn('hs-btn hl', acts);
        adc.hidden = true;
        this._bind(adc, () => this._prevAdCoins(adc, hint), false);
        const act = hsuiBtn('hs-btn', acts);
        this._bind(act, () => this._shopAct(this._shopState.sel[this._shopState.tab]), false);
        const peekB = hsuiBtn('hs-btn paper', acts, HSUI_ICON.person + '<span></span>');
        peekB.lastElementChild.textContent = Lang.t('ui.peek');
        this._bind(peekB, () => this._peek(true));
        this.prev = { el: pv, ph, img, nm, rr, state, gs, price, hint, act, adc, peekB, stage, imgId: '', priceKey: '', adcKey: '', stateKey: '' };
    },

    _step(d) {
        const list = this.cards;
        if (!list.length) return;
        const st = this._shopState;
        const i = list.findIndex(x => x.id === st.sel[st.tab]);
        const n = list[(i + d + list.length) % list.length];
        this._selectItem(n.id, false);
        n.el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    },

    _selectItem(id, quiet) {
        const st = this._shopState, tab = st.tab;
        st.sel[tab] = id;
        for (const c of this.cards) c.el.classList.toggle('sel', c.id === id);
        this._prevFill(!quiet);
        this._gPreview(id);
    },

    _prevFill(swap) {
        const p = this.prev, m = this._model();
        if (!p || !m) return;
        const r = hsuiRar(m.rarity);
        p.el.style.setProperty('--rc', r.color);
        p.el.style.setProperty('--rca', hsuiRgba(r.color, m.rarity === 'common' ? 0.3 : 0.6));
        p.nm.textContent = m.name;
        p.rr.textContent = hsuiRarName(m.rarity);
        if (p.imgId !== m.id) {
            p.imgId = m.id;
            p.priceKey = ''; p.adcKey = ''; p.actKey = ''; p.stateKey = '';
            p.img.innerHTML = '';
            const ic = hsuiIcon(m.item.icon, p.img, r.color, m.tab);
            if (swap) ic.classList.add('swap');
            p.hint.classList.remove('on');
            // сачок и радар: цвет, форма броска и волны (иконки пока перекрашенные)
            p.gs.innerHTML = '';
            if (m.tab === 'net' && m.item.color) {
                const a = hsuiEl('span', '', p.gs), ai = hsuiEl('i', '', a);
                ai.style.background = m.item.color;
                hsuiEl('b', '', a).textContent = Lang.t('ui.netStyle') + ': ' + Lang.t('st.' + (m.item.style || 'ring'));
                const b = hsuiEl('span', '', p.gs), bi = hsuiEl('i', '', b);
                bi.style.background = m.item.wave || m.item.color;
                hsuiEl('b', '', b).textContent = Lang.t('ui.waveStyle') + ': ' + Lang.t('wv.' + (m.item.waveStyle || 'ring'));
            }
        }
        this._prevState();
    },

    /** Состояние выбранного: плашка, цена или прогресс, подсказка, кнопки. Каждые полсекунды — без лишних перерисовок. */
    _prevState() {
        const p = this.prev, m = this._model();
        if (!p || !m) return;
        const sk = m.equipped ? 'eq' : m.owned ? 'own' : 'lock';
        if (p.stateKey !== sk) {
            p.stateKey = sk;
            p.state.className = 'stt ' + sk;
            p.state.innerHTML = (sk === 'lock' ? HSUI_ICON.lock : HSUI_ICON.tick) + '<span></span>';
            p.state.lastElementChild.textContent = Lang.t(sk === 'eq' ? 'ui.wearing' : sk === 'own' ? 'ui.bought' : 'ui.locked');
        }
        const pk = [m.id, m.state, m.kind, m.progress, m.need, m.affordable ? 1 : 0].join('|');
        if (p.priceKey !== pk) {
            const was = p.priceKey.split('|');
            p.priceKey = pk;
            p.price.innerHTML = '';
            p.price.className = 'prc';
            p.price.hidden = m.owned;
            if (m.owned) { /* цена не нужна */ }
            else if (m.kind === 'coins') {
                hsuiImg('assets/ui/icon-coin.webp', '', p.price);
                hsuiEl('span', '', p.price).textContent = hsuiFmt(m.price);
                p.price.classList.toggle('cant', !m.affordable);
            } else if (m.kind === 'ads') {
                p.price.classList.add('ad');
                p.price.style.setProperty('--p', (m.need ? m.progress / m.need : 0).toFixed(3));
                hsuiEl('span', '', p.price).textContent = Lang.t('ui.adProg', { a: m.progress, b: m.need });
                hsuiEl('div', 'bar', p.price, '<i></i>');
                if (was[0] === m.id && was[3] !== String(m.progress)) { void p.price.offsetWidth; p.price.classList.add('bump'); }
            } else if (m.kind === 'exclusive') {
                p.price.innerHTML = HSUI_ICON.gift.replace('<svg', '<svg width="26" height="26"') + '<span></span>';
                p.price.lastElementChild.textContent = Lang.t('ui.exclusive');
            }
        }
        // подсказка: нет денег, «Через N с», реклама недоступна (для эксклюзива это не ошибка)
        let hintText = m.kind === 'exclusive' ? '' : (m.hint || '');
        if (m.action === 'watch' && /\d/.test(m.actionLabel || '')) hintText = '';   // «Через N с» уже на кнопке
        if (!this._timers.get(p.hint)) {
            p.hint.textContent = hintText;
            p.hint.classList.toggle('on', !!hintText);
            p.hint.classList.remove('good', 'neutral');
        }
        // «+монеты за рекламу», когда не хватает на предмет
        const showAd = m.kind === 'coins' && !m.owned && !m.affordable && hsuiAdsOn();
        const wait = hsuiAdWait(), ready = hsuiAdReady();
        const ak = showAd + '|' + wait + '|' + ready;
        if (p.adcKey !== ak) {
            p.adcKey = ak;
            p.adc.hidden = !showAd;
            if (showAd) {
                p.adc.innerHTML = (wait ? '' : HSUI_ICON.play) + '<span></span>';
                p.adc.lastElementChild.textContent = wait ? wait.toUpperCase() : Lang.t('ui.coinsAd', { n: hsuiFmt(hsuiAdAmount('coins')) }).toUpperCase();
                p.adc.classList.toggle('off', !ready);
            }
        }
        this._actApply(p.act, m, p);
        this._peekFill(m);
    },

    /** Что показать на главной кнопке по модели карточки. */
    _actCfg(m) {
        if (this._shopBusy || m.busy) return { text: Lang.t('ui.adRunning'), cls: 'off', icon: '' };
        if (m.action === 'buy') return { text: Lang.t('ui.buy'), cls: m.enabled ? '' : 'off', icon: HSUI_ICON.cart };
        if (m.action === 'watch') {
            const wait = /\d/.test(m.actionLabel || '') ? m.actionLabel : '';
            return { text: wait ? wait.toUpperCase() : Lang.t('ui.watchAd'), cls: 'hl' + (m.enabled ? '' : ' off'), icon: m.enabled ? HSUI_ICON.play : '' };
        }
        if (m.action === 'equip') return { text: Lang.t('ui.wear'), cls: 'blue', icon: HSUI_ICON.tick };
        if (m.action === 'unequip') return { text: Lang.t('ui.unequip'), cls: 'paper', icon: '' };
        if (m.equipped) return { text: Lang.t('ui.wearing'), cls: 'green off', icon: HSUI_ICON.tick };
        if (m.kind === 'exclusive') return { text: Lang.t('ui.exclusive'), cls: 'hl', icon: HSUI_ICON.gift };
        return { text: '', cls: 'off', icon: '' };
    },

    _actApply(btn, m, holder) {
        const c = this._actCfg(m);
        const key = c.text + '|' + c.cls + '|' + (c.icon ? 1 : 0) + '|' + m.id;
        if (holder.actKey === key) return;
        holder.actKey = key;
        btn.className = 'hs-btn' + (c.cls ? ' ' + c.cls : '');
        btn.innerHTML = c.icon + '<span></span>';
        btn.lastElementChild.textContent = c.text;
        btn.setAttribute('aria-disabled', /off/.test(c.cls) ? 'true' : 'false');
    },

    _peekFill(m) {
        const pk = this.peek;
        if (!pk || !this._peekOn || !m) return;
        pk.el.style.setProperty('--rc', hsuiRar(m.rarity).color);
        pk.nm.textContent = m.name;
        pk.rr.textContent = hsuiRarName(m.rarity) + (m.kind === 'coins' && !m.owned ? ' · ' + hsuiFmt(m.price) : m.kind === 'ads' && !m.owned ? ' · ' + Lang.t('ui.adProg', { a: m.progress, b: m.need }) : '');
        this._actApply(pk.act, m, pk);
        if (!this._timers.get(pk.hint)) {
            pk.hint.textContent = m.kind === 'exclusive' ? '' : (m.hint || '');
            pk.hint.classList.toggle('on', !!pk.hint.textContent);
        }
    },

    _shopRefresh() {
        if (!this.shBody) return;
        this._wallet(true);
        if (this._shopState.tab === 'power') { for (const pc of this.pcards || []) this._powerFill(pc); return; }
        const S = hsuiShop();
        if (!S) return;
        for (const c of this.cards || []) { const m = S.card(c.id); if (m) this._cardFill(c, m); }
        this._prevState();
    },

    /** Нажатие главной кнопки: купить / открыть за рекламу / надеть / снять. */
    async _shopAct(id) {
        const S = hsuiShop();
        if (!S || !id || this._shopBusy) return;
        const m = S.card(id);
        if (!m) return;
        if (m.action === 'none') { if (m.kind === 'exclusive') { this._closeWindows(true); this._back(); this.dailyOpen(); } return; }
        if (!m.enabled) { this._shopDenied(m); return; }
        hsuiSfx('click');
        this._shopBusy = true;
        this._prevState();
        let r = null;
        try { r = await S.act(id); } catch (e) { console.error('Shop.act:', e); r = { ok: false, reason: 'error' }; }
        this._shopBusy = false;
        const p = this.prev;
        if (r && r.ok) {
            const stage = p ? p.stage : null;
            if (m.action === 'buy') { hsuiSfx('buy'); if (p) this._buyFx(p.el); this._burst(stage || this.shop_el, 14); }
            else if (m.action === 'watch') {
                if (r.unlocked) {
                    hsuiSfx('buy');
                    if (p) { p.el.classList.remove('flash'); void p.el.offsetWidth; p.el.classList.add('flash'); this._hintOn(p.hint, Lang.t('ui.opened'), 'good'); }
                    this._burst(stage || this.shop_el, 26);
                } else { hsuiSfx('equip'); if (p) { p.price.classList.remove('bump'); void p.price.offsetWidth; p.price.classList.add('bump'); } this._burst(stage || this.shop_el, 8); }
            } else { hsuiSfx('equip'); if (p) { p.el.classList.remove('flash'); void p.el.offsetWidth; p.el.classList.add('flash'); } }
        } else if (r) {
            const rs = r.reason;
            if (rs === 'noCoins') this._shopDenied(m);
            else if (rs === 'busy' || rs === 'owned' || rs === 'none') { /* состояние обновится */ }
            else if (rs === 'cooldown') { /* «Через N с» уже на кнопке */ }
            else if (p) this._hintOn(p.hint, rs === 'adUnavailable' ? Shop.t('shop.adUnavailable') : rs === 'adFailed' ? Lang.t('ui.adFail') : Lang.t('ui.noBuy'));
            if (this.peek && this._peekOn && rs === 'adFailed') this._hintOn(this.peek.hint, Lang.t('ui.adFail'));
        }
        if (this._open === 'shop') this._shopRefresh();
    },

    /** Нет денег / реклама недоступна: кнопка трясётся, красная подсказка. */
    _shopDenied(m) {
        const p = this.prev;
        hsuiSfx('error');
        const text = m.kind === 'coins' ? Lang.t('ui.needCoins', { n: hsuiFmt(Math.max(1, m.price - hsuiCoins())) }) : (m.hint || Lang.t('ui.adNone'));
        if (p) { this._shake(p.act); this._hintOn(p.hint, text); }
        if (this.peek && this._peekOn) { this._shake(this.peek.act); this._hintOn(this.peek.hint, text); }
        const sc = this._walBy.shop && this._walBy.shop.coin;
        if (m.kind === 'coins' && sc) sc.bump();
    },

    /** «+монеты за рекламу» под ценой, когда не хватает. */
    async _prevAdCoins(btn, hint) {
        const a = hsuiAds();
        if (!a || this._shopBusy) return;
        if (!hsuiAdReady()) { this._shake(btn); return; }
        this._shopBusy = true;
        btn.classList.add('off');
        this._holdWallet(true);
        let r = null;
        try { r = await a.coins(); } catch (e) { r = null; }
        this._shopBusy = false;
        if (r && r.ok) {
            hsuiSfx('buy');
            this._flyReward('coins', r.amount | 0, btn.getBoundingClientRect(), this._walBy.shop.coin);
        } else { this._holdWallet(false); this._hintOn(hint, Lang.t('ui.adFail')); }
        if (this._open === 'shop') { if (this.prev) this.prev.adcKey = ''; this._shopRefresh(); }
    },

    /** Покупка: вспышка и монеты, летящие из кошелька к товару. */
    _buyFx(target) {
        target.classList.remove('flash'); void target.offsetWidth; target.classList.add('flash');
        const sc = this._walBy.shop && this._walBy.shop.coin;
        if (!this.root || typeof target.animate !== 'function' || !sc) return;
        const rr = this.root.getBoundingClientRect(), a = sc.el.getBoundingClientRect(), b = target.getBoundingClientRect();
        const sx = a.left - rr.left + a.width * 0.2, sy = a.top - rr.top + a.height / 2;
        const ex = b.left - rr.left + b.width / 2, ey = b.top - rr.top + b.height * 0.4;
        const n = hsuiReduced() ? 4 : 9;
        for (let i = 0; i < n; i++) {
            const c = hsuiEl('i', 'hs-fly', this.fxl);
            c.style.backgroundImage = "url('assets/ui/icon-coin.webp')";
            const ang = (i / n) * Math.PI * 2, rad = (26 + (i % 3) * 14) * this.u;
            const mx = ex + Math.cos(ang) * rad, my = ey + Math.sin(ang) * rad;
            const an = c.animate([
                { transform: 'translate(' + sx + 'px,' + sy + 'px) scale(.5)', opacity: 0 },
                { transform: 'translate(' + (sx + (mx - sx) * 0.35) + 'px,' + (sy + (my - sy) * 0.35 - 30 * this.u) + 'px) scale(1.2)', opacity: 1, offset: 0.3 },
                { transform: 'translate(' + mx + 'px,' + my + 'px) scale(1)', opacity: 1, offset: 0.7 },
                { transform: 'translate(' + (mx + Math.cos(ang) * 40 * this.u) + 'px,' + (my - 80 * this.u) + 'px) scale(.3)', opacity: 0 },
            ], { duration: 900, delay: i * 40, easing: 'ease-out', fill: 'both' });
            an.onfinish = () => c.remove();
            an.oncancel = () => c.remove();
        }
    },

    // ---- усиления (расходники) ----

    _mkPower(grid, it, i) {
        const r = hsuiRar(it.rarity);
        const el = hsuiEl('div', 'hs-pcard', grid);
        el.style.setProperty('--rc', r.color);
        el.style.setProperty('--r', ((i * 3) % 3 - 1) * 0.9 + 'deg');
        hsuiEl('h3', '', el).textContent = hsText(it.name);
        hsuiEl('p', '', el).textContent = hsText(it.desc);
        hsuiIcon(it.icon, hsuiEl('div', 'pi', el), r.color, 'power');
        const pk = hsuiEl('div', 'pk', el);
        hsuiEl('span', '', pk).textContent = Lang.t('ui.pack', { n: it.pack || 1 });
        const have = hsuiEl('span', 'have', pk);
        const pr = hsuiEl('div', 'pr', el);
        const hint = hsuiEl('div', 'hs-hint', el);
        const buy = hsuiBtn('hs-btn', el, HSUI_ICON.cart + '<span></span>');
        buy.lastElementChild.textContent = Lang.t('ui.buy');
        const ad = hsuiBtn('hs-btn hl', el, HSUI_ICON.play + '<span></span>');
        const rec = { it, el, have, pr, hint, buy, ad, haveN: -1, key: '' };
        this.pcards.push(rec);
        this._bind(buy, () => this._buyPower(rec), false);
        this._bind(ad, () => this._adPower(rec), false);
    },

    _powerFill(pc) {
        const G = /** @type {any} */ (hsuiGame()), n = G && G.save && G.save.power ? G.save.power[pc.it.id] | 0 : 0;
        const price = pc.it.price && pc.it.price.coins ? pc.it.price.coins : 0;
        const can = hsuiCoins() >= price;
        const wait = hsuiAdWait(), ready = hsuiAdReady(), on = hsuiAdsOn();
        const key = [n, price, can, wait, ready, on].join('|');
        if (pc.key === key) return;
        const bump = pc.haveN >= 0 && n > pc.haveN;
        pc.key = key; pc.haveN = n;
        pc.have.textContent = Lang.t('ui.have', { n });
        if (bump) { pc.have.classList.remove('bump'); void pc.have.offsetWidth; pc.have.classList.add('bump'); }
        pc.pr.innerHTML = '';
        hsuiImg('assets/ui/icon-coin.webp', '', pc.pr);
        hsuiEl('span', '', pc.pr).textContent = hsuiFmt(price);
        pc.pr.classList.toggle('cant', !can);
        pc.buy.classList.toggle('off', !can);
        pc.ad.hidden = !on;
        pc.ad.classList.toggle('off', !ready);
        pc.ad.innerHTML = (wait ? '' : HSUI_ICON.play) + '<span></span>';
        pc.ad.lastElementChild.textContent = wait ? wait.toUpperCase() : Lang.t('ui.forAd') + ' ' + Lang.t('ui.pack', { n: pc.it.pack || 1 });
    },

    _buyPower(pc) {
        const G = /** @type {any} */ (hsuiGame());
        hsuiSfx('click');
        let r = null;
        try { r = G && G.shop && G.shop.buyPowerup ? G.shop.buyPowerup(pc.it.id) : null; } catch (e) { r = null; }
        if (r && r.ok) { hsuiSfx('buy'); this._buyFx(pc.el); this._burst(pc.el, 12); this._shopRefresh(); }
        else {
            hsuiSfx('error');
            this._shake(pc.buy);
            const price = pc.it.price && pc.it.price.coins ? pc.it.price.coins : 0;
            this._hintOn(pc.hint, hsuiCoins() < price ? Lang.t('ui.needCoins', { n: hsuiFmt(price - hsuiCoins()) }) : Lang.t('ui.noBuy'));
            if (this._walBy.shop) this._walBy.shop.coin.bump();
        }
    },

    async _adPower(pc) {
        const a = hsuiAds();
        if (!a || this._shopBusy) return;
        if (!hsuiAdReady()) { this._shake(pc.ad); return; }
        this._shopBusy = true;
        pc.ad.classList.add('off');
        let r = null;
        try { r = await a.powerup(pc.it.id); } catch (e) { r = null; }
        this._shopBusy = false;
        if (r && r.ok) { hsuiSfx('buy'); this._burst(pc.el, 14); pc.el.classList.remove('flash'); void pc.el.offsetWidth; pc.el.classList.add('flash'); }
        else this._hintOn(pc.hint, Lang.t(r && r.reason === 'cooldown' ? 'ui.adNone' : 'ui.adFail'));
        pc.key = '';
        if (this._open === 'shop') this._shopRefresh();
    },

    // =====================================================================================
    // Подарок дня (7 дней)
    // =====================================================================================

    _dgBusy: false,

    /** Награда дня (монеты, кристаллы, предмет, случайный предмет) — плашки с иконками. mult 2 — с удвоением. */
    _chipsInto(parent, rw, mult) {
        const S = hsuiShop(), m = mult || 1;
        if (rw.coins > 0) {
            const c = hsuiEl('div', 'rc coin', parent);
            hsuiImg('assets/ui/icon-coin.webp', '', c);
            hsuiEl('b', '', c).textContent = hsuiFmt(rw.coins * m);
        }
        if (rw.gems > 0) {
            const c = hsuiEl('div', 'rc gem', parent);
            hsuiImg('assets/ui/icon-gem.webp', '', c);
            hsuiEl('b', '', c).textContent = hsuiFmt(rw.gems * m);
        }
        if (rw.item) {
            const it = S ? S.item(rw.item) : null;
            const c = hsuiEl('div', 'rc item', parent);
            hsuiIcon(it ? it.icon : '', c, it ? hsuiRar(it.rarity).color : '#8fb6d9', it ? it.tab : '');
        }
        if (rw.randomItems > 0) {
            const n = rw.randomItems * m;
            const c = hsuiEl('div', 'rc', parent, HSUI_ICON.giftQ);
            if (n > 1) hsuiEl('b', '', c).textContent = '×' + n;
        }
    },

    _buildDaily() {
        const w = this._mkWin('daily', { title: Lang.t('ui.dg.title'), close: () => this.closeDaily() });
        this.daily_el = w.win;
        const body = hsuiEl('div', 'dg-body', w.sheet);
        const days = hsuiEl('div', 'dg-days', body);
        this.dgDays = [];
        for (let d = 1; d <= 6; d++) {
            const el = hsuiEl('div', 'dg-day', days);
            el.style.setProperty('--r', ((d * 5) % 5 - 2) * 0.7 + 'deg');
            const t = hsuiEl('div', 'dt', el);
            const r = hsuiEl('div', 'dr', el);
            const s = hsuiEl('div', 'ds', el);
            hsuiEl('div', 'ck', el, HSUI_ICON.tick);
            this.dgDays.push({ el, t, r, s, key: '' });
        }
        const g = hsuiEl('div', 'dg-goal hs-tape r', body);
        const gt = hsuiEl('div', 'gt', g);
        const gs = hsuiEl('div', 'gs hs-photo', g);
        const gi = hsuiEl('div', 'im', gs);
        const gn = hsuiEl('div', 'gn', g);
        const gh = hsuiEl('div', 'gh', g);
        const gds = hsuiEl('div', 'ds', g);
        this.dgGoal = { el: g, gt, gs, gi, gn, gh, ds: gds, key: '' };
        const foot = hsuiEl('div', 'dg-foot', w.sheet);
        this.dgClaim = hsuiBtn('hs-btn green', foot, '<span></span>');
        this.dgX2 = hsuiBtn('hs-btn hl', foot);
        this._bind(this.dgClaim, () => this._dailyClaim(), false);
        this._bind(this.dgX2, () => this._dailyX2(), false);
        this.dgNext = hsuiEl('div', 'dg-next', w.sheet);
        this.dgHint = hsuiEl('div', 'hs-hint', w.sheet);
        this.dgX2Key = '';
    },

    /** Открыть окно подарка дня. false — нельзя сейчас (туториал, идёт раунд, другое окно, модуль не готов). */
    dailyOpen() {
        if (!this.root) return false;
        const D = typeof DailyGift !== 'undefined' ? DailyGift : null;
        if (!D || !D._rewards || !D._rewards.length) return false;
        try { if (typeof Tutorial !== 'undefined' && Tutorial.active) return false; } catch (e) { /* без туториала */ }
        if (this._hudOn) return false;
        if (this._open === 'daily') return true;
        if (this._open && this._open !== 'dex' && this._open !== 'gear' && this._open !== 'shop' && this._open !== 'settings') return false;
        if (this._open) this._closeWindows(true);
        if (!this.daily_el) this._buildDaily();
        this._dgBusy = false;
        this.dgX2Key = '';
        this._dailyFill(true);
        this._winOpen('daily', this.daily_el);
        try { D.markOffered(); } catch (e) { /* не критично */ }
        return true;
    },

    closeDaily() {
        if (this._open !== 'daily' || this._dgBusy || this._prz) return;
        this._winClose('daily', this.daily_el);
    },

    _dailyFill(force) {
        const D = typeof DailyGift !== 'undefined' ? DailyGift : null;
        if (!D || !this.daily_el || this._open !== 'daily') return;
        let v = null;
        try { v = D.view(); } catch (e) { return; }
        const S = hsuiShop();
        const days = v.days;
        for (let i = 0; i < 6; i++) {
            const d = days[i], c = this.dgDays[i];
            if (!d || !c) continue;
            const key = d.state + '|' + JSON.stringify(d.reward) + '|' + Lang.code;
            if (!force && c.key === key) continue;
            c.key = key;
            c.el.className = 'dg-day ' + d.state;
            c.t.textContent = d.dayLabel.toUpperCase();
            c.r.innerHTML = '';
            this._chipsInto(c.r, d.reward, 1);
            const label = d.state === 'today' ? Lang.t('ui.dg.today') : d.state === 'tomorrow' ? Lang.t('ui.dg.tomorrow') : d.state === 'claimed' ? Lang.t('ui.dg.got') : '';
            c.s.textContent = label;
        }
        // 7-й день: эксклюзивный скин — цель
        const g7 = days[6], G = this.dgGoal;
        if (g7 && G) {
            const skinId = g7.skin || v.goal || '';
            const key = g7.state + '|' + skinId + '|' + (g7.reward.coins || 0) + '|' + v.nextDay + '|' + v.canClaim + '|' + Lang.code;
            if (force || G.key !== key) {
                G.key = key;
                const it = skinId && S ? S.item(skinId) : null;
                const col = hsuiRar(it ? it.rarity : 'mythic').color;
                G.el.style.setProperty('--rc', col);
                G.gt.innerHTML = '';
                hsuiEl('span', '', G.gt).textContent = g7.dayLabel.toUpperCase();
                hsuiEl('b', '', G.gt).textContent = Lang.t(it ? 'ui.dg.excl' : 'ui.dg.big');
                G.gi.innerHTML = '';
                if (it) {
                    hsuiIcon(it.icon, G.gi, col, it.tab);
                    G.gn.textContent = S.name(skinId);
                    G.gh.textContent = Lang.t('ui.dg.goalSub');
                } else {
                    const big = hsuiEl('div', 'big', G.gi);
                    hsuiImg('assets/ui/icon-coin.webp', '', big);
                    hsuiEl('span', '', big).textContent = hsuiFmt(g7.reward.coins || 0);
                    G.gn.textContent = Lang.t('ui.dg.big');
                    G.gh.textContent = '';
                }
                let left = 0;
                if (g7.state !== 'claimed') left = v.canClaim ? 7 - v.nextDay : 8 - v.nextDay;
                G.ds.textContent = g7.state === 'today' ? Lang.t('ui.dg.today') : g7.state === 'claimed' ? Lang.t('ui.dg.got') : g7.state === 'tomorrow' ? Lang.t('ui.dg.tomorrow') : Lang.t('ui.dg.in', { n: Math.max(1, left) });
            }
        }
        // кнопки
        const can = !!v.canClaim, busy = this._dgBusy;
        const ck = can + '|' + busy;
        if (force || this.dgClaimKey !== ck) {
            this.dgClaimKey = ck;
            this.dgClaim.classList.toggle('off', !can || busy);
            this.dgClaim.lastElementChild.textContent = can ? Lang.t('ui.dg.claim') : Lang.t('ui.dg.done');
        }
        const x2 = v.x2;
        const showX2 = can && x2.available;
        this.dgX2.hidden = !showX2;
        if (showX2) {
            const wait = x2.label !== D.t('daily.claimX2') ? x2.label : '';
            const today = days.find(d => d.state === 'today');
            const off = !x2.enabled || busy;
            const k = [wait, off, busy, JSON.stringify(today ? today.reward : 0)].join('|');
            if (force || this.dgX2Key !== k) {
                this.dgX2Key = k;
                this.dgX2.classList.toggle('off', off);
                this.dgX2.innerHTML = '';
                const colEl = hsuiEl('span', 'col', this.dgX2);
                const row = hsuiEl('span', '', colEl, (wait || busy ? '' : HSUI_ICON.play.replace('<svg', '<svg width="20" height="20" style="display:inline-block;vertical-align:-3px;margin-right:6px"')) + '<span></span>');
                row.lastElementChild.textContent = busy ? Lang.t('ui.adRunning') : wait ? wait.toUpperCase() : Lang.t('ui.dg.x2');
                if (!wait && today) {
                    const rw = today.reward, parts = [];
                    if (rw.coins > 0) parts.push(hsuiFmt(rw.coins * 2) + ' ' + Lang.t('ui.popCoins'));
                    if (rw.gems > 0) parts.push(hsuiFmt(rw.gems * 2) + ' ' + Lang.t('ui.popGems'));
                    if (rw.randomItems > 0) parts.push('×' + (rw.randomItems * 2));
                    hsuiEl('span', 'sub', colEl).textContent = parts.join(' · ');
                }
            }
        }
        this.dgNext.textContent = can ? '' : Lang.t('ui.dg.next', { t: D.formatTime(v.msToNext) });
        if (!this._timers.get(this.dgHint)) {
            const wait = x2.label !== D.t('daily.claimX2') ? x2.label : '';
            const ht = can ? (x2.hint && x2.hint !== wait ? x2.hint : '') : '';
            this.dgHint.textContent = ht;
            this.dgHint.classList.toggle('on', !!ht);
            this.dgHint.classList.add('neutral');
        }
    },

    _dailyClaim() {
        if (this._dgBusy) return;
        let can = false;
        try { can = DailyGift.canClaim(); } catch (e) { can = false; }
        if (!can) { this._shake(this.dgClaim); return; }
        this._dgBusy = true;
        this._holdWallet(true);
        let r = null;
        try { r = DailyGift.claim(); } catch (e) { console.error('DailyGift.claim:', e); r = null; }
        this._dgBusy = false;
        if (!r || !r.ok) { this._holdWallet(false); this._dailyFill(true); return; }
        this._dailyDone(r);
    },

    async _dailyX2() {
        if (this._dgBusy) return;
        let v = null;
        try { v = DailyGift.view(); } catch (e) { return; }
        if (!v.x2.enabled) { this._shake(this.dgX2); hsuiSfx('error'); return; }
        this._dgBusy = true;
        this._holdWallet(true);
        this._dailyFill(true);
        let r = null;
        try { r = await DailyGift.claimX2(); } catch (e) { console.error('DailyGift.claimX2:', e); r = null; }
        this._dgBusy = false;
        if (r && r.ok) { this._dailyDone(r); return; }
        this._holdWallet(false);
        this.dgX2Key = '';
        this._dailyFill(true);
        const rs = r ? r.reason : '';
        if (rs === 'claimed') return;
        this._hintOn(this.dgHint, rs === 'adFailed' ? Lang.t('ui.adFailGift') : Lang.t('ui.adNone'), 'neutral');
    },

    _dailyDone(r) {
        this.dgX2Key = '';
        this._dailyFill(true);
        hsuiSfx('equip');
        this._prize({ title: Lang.t('ui.got'), items: this._gotItems(r.got, r.reward && r.reward.gems ? r.reward.gems * (r.mult || 1) : 0), note: r.mult === 2 ? 'x2' : '' });
    },

    // =====================================================================================
    // Колесо фортуны
    // =====================================================================================

    _whBusy: false,
    _whAngle: 0,

    _buildWheel() {
        const w = this._mkWin('wheel', { title: Lang.t('ui.wh.title'), close: () => this.closeWheel() });
        this.wheel_el = w.win;
        const area = this.whArea = hsuiEl('div', 'wh-area', w.sheet);
        const stage = hsuiEl('div', 'wh-stage', area);
        this.whStage = stage;
        hsuiEl('div', 'wh-rim', stage);
        this.whDisk = hsuiEl('div', 'wh-disk', stage);
        hsuiEl('div', 'wh-hub', stage);
        this.whPtr = hsuiEl('div', 'wh-ptr', stage, '<svg viewBox="0 0 48 56"><path d="M24 54L5.6 21C-.6 9.6 7.6 1.6 24 1.6s24.6 8 18.4 19.4z" fill="#d6372c" stroke="#2a2017" stroke-width="4" stroke-linejoin="round"/><circle cx="24" cy="21" r="6" fill="#f6edd6" stroke="#2a2017" stroke-width="3"/></svg>');
        const side = hsuiEl('div', 'wh-side', area);
        this.whInfo = hsuiEl('div', 'wh-info', side);
        this.whFree = hsuiBtn('hs-btn green', side, '<span></span>');
        this.whAd = hsuiBtn('hs-btn hl', side);
        this.whHint = hsuiEl('div', 'hs-hint', side);
        this._bind(this.whFree, () => this._wheelSpin('free'), false);
        this._bind(this.whAd, () => this._wheelSpin('ad'), false);
        this.whKey = '';
    },

    wheelOpen() {
        if (!this.root) return false;
        const W = typeof Wheel !== 'undefined' ? Wheel : null;
        if (!W || !W._sectors || W._sectors.length < 2) return false;
        try { if (typeof Tutorial !== 'undefined' && Tutorial.active) return false; } catch (e) { /* без туториала */ }
        if (this._hudOn) return false;
        if (this._open === 'wheel') return true;
        if (this._open && this._open !== 'dex' && this._open !== 'gear' && this._open !== 'shop' && this._open !== 'settings') return false;
        if (this._open) this._closeWindows(true);
        if (!this.wheel_el) this._buildWheel();
        this._whBusy = false;
        this._wheelBuildDisk();
        this.whKey = '';
        this._wheelRefresh(true);
        this._winOpen('wheel', this.wheel_el);
        this._wheelSize();
        // вращение, чей приз ещё не выдан (вкладку закрыли): диск встаёт на сектор, приз выдаётся один раз
        try {
            const pend = W.pendingSpin();
            if (pend) {
                this._whAngle = W.angleFrom(0, pend) % 360;
                this._wheelSet(this._whAngle);
                this._wheelFinish();
            }
        } catch (e) { console.error('Wheel pending:', e); }
        return true;
    },

    closeWheel() {
        if (this._open !== 'wheel' || this._whBusy || this._prz) return;
        this._winClose('wheel', this.wheel_el);
    },

    /** Размер диска в px: по свободной области окна. */
    _wheelSize() {
        const a = this.whArea, st = this.whStage;
        if (!st || !a || !this.W) return;
        const aw = a.clientWidth, ah = a.clientHeight;
        let ds;
        if (this.portrait) ds = Math.min(aw - 40 * this.u, ah * 0.58);
        else ds = Math.min(aw * 0.56, ah - 30 * this.u);
        st.style.setProperty('--ds', hsuiClamp(ds, 120, 620).toFixed(0) + 'px');
    },

    _wheelSet(a) { this.whDisk.style.transform = 'rotate(' + a.toFixed(2) + 'deg)'; },

    /** Сектор круга: путь «клина» от угла a0 до a1 (градусы по часовой от верха), радиус r. */
    _wedge(r, a0, a1) {
        const p = (a) => { const t = a * Math.PI / 180; return (r * Math.sin(t)).toFixed(2) + ' ' + (-r * Math.cos(t)).toFixed(2); };
        return 'M0 0L' + p(a0) + 'A' + r + ' ' + r + ' 0 0 1 ' + p(a1) + 'Z';
    },

    /** Диск: секторы-«бумажки» с призами (монеты, кристаллы, предмет), собирается заново при каждом открытии. */
    _wheelBuildDisk() {
        const W = Wheel, S = hsuiShop();
        const secs = W.sectors(), n = secs.length, step = 360 / n;
        const pal = ['#ea8a73', '#f4d56f', '#93d0ac', '#8ab3ea', '#d9a0e2', '#f3b0a4', '#cddb78', '#85cbd8'];
        const disk = this.whDisk;
        disk.innerHTML = '';
        let svg = '<svg viewBox="-100 -100 200 200">';
        for (let i = 0; i < n; i++) {
            let col = pal[i % pal.length];
            if (i === n - 1 && n % pal.length === 1) col = pal[3];
            svg += '<path class="wd" data-i="' + i + '" d="' + this._wedge(100, (i - 0.5) * step, (i + 0.5) * step) + '" fill="' + col + '"/>';
        }
        svg += '</svg>';
        disk.insertAdjacentHTML('afterbegin', svg);
        secs.forEach((s, i) => {
            const kind = s.kind === 'item' ? 'item' : (s.prize && s.prize.type === 'gems') || (s.data && s.data.gems > 0 && !(s.coins > 0)) ? 'gems' : 'coins';
            const pz = hsuiEl('div', 'wh-pz', disk);
            pz.style.transform = 'rotate(' + (i * step).toFixed(2) + 'deg)';
            const inn = hsuiEl('div', 'in', pz);
            if (kind === 'item') {
                const it = S ? S.item(s.itemId) : null;
                const col = hsuiRar(it ? it.rarity : 'common').color;
                inn.style.setProperty('--rc', col);
                hsuiIcon(it ? it.icon : '', hsuiEl('div', 'ring', inn), col, it ? it.tab : '');
            } else {
                const amount = kind === 'gems' ? ((s.prize && s.prize.amount) || (s.data && s.data.gems) || 0) : (s.coins || (s.prize && s.prize.amount) || 0);
                hsuiImg(kind === 'gems' ? 'assets/ui/icon-gem.webp' : 'assets/ui/icon-coin.webp', '', inn);
                hsuiEl('b', '', inn).textContent = hsuiFmt(amount);
            }
        });
        this._wheelSet(this._whAngle);
    },

    _wheelRefresh(force) {
        const W = typeof Wheel !== 'undefined' ? Wheel : null;
        if (!W || !this.wheel_el || this._open !== 'wheel') return;
        let st = null;
        try { st = W.status(); } catch (e) { return; }
        const busy = this._whBusy;
        const wait = !st.canSpinAd ? (hsuiAdWait() || '') : '';
        const k = [st.canSpinFree, st.canSpinAd, st.nextFreeLabel, st.adLeft, st.banked, st.adLimit, wait, busy, st.hint, st.freeAvailable].join('|');
        if (!force && this.whKey === k) return;
        this.whKey = k;
        this.whInfo.innerHTML = '';
        if (st.freeAvailable) hsuiEl('b', '', this.whInfo).textContent = Lang.t('ui.wh.ready');
        else {
            hsuiEl('span', '', this.whInfo).textContent = Lang.t('ui.wh.nextFree');
            hsuiEl('b', '', this.whInfo).textContent = st.nextFreeLabel;
        }
        this.whFree.classList.toggle('off', !st.canSpinFree || busy);
        this.whFree.lastElementChild.textContent = busy ? Lang.t('ui.wh.spinning') : st.freeAvailable ? Lang.t('ui.wh.free') : Lang.t('ui.wh.freeIn', { t: st.nextFreeLabel });
        const left = st.adLeft + st.banked;
        this.whAd.classList.toggle('off', !st.canSpinAd || busy);
        this.whAd.innerHTML = '';
        const colEl = hsuiEl('span', 'col', this.whAd);
        hsuiEl('span', '', colEl).textContent = wait ? wait.toUpperCase() : busy ? Lang.t('ui.adRunning') : Lang.t('ui.wh.ad');
        hsuiEl('span', 'sub', colEl).textContent = Lang.t('ui.wh.left', { a: left, b: st.adLimit });
        if (!this._timers.get(this.whHint)) {
            const ht = busy ? '' : (st.hint && st.hint !== wait ? st.hint : '');
            this.whHint.textContent = ht;
            this.whHint.classList.toggle('on', !!ht);
            this.whHint.classList.add('neutral');
        }
    },

    async _wheelSpin(kind) {
        const W = Wheel;
        if (this._whBusy) return;
        let st = null;
        try { st = W.status(); } catch (e) { return; }
        if (kind === 'free' ? !st.canSpinFree : !st.canSpinAd) { this._shake(kind === 'free' ? this.whFree : this.whAd); hsuiSfx('error'); return; }
        this._whBusy = true;
        this._holdWallet(true);
        this._wheelRefresh(true);
        let r = null;
        try { r = kind === 'ad' ? await W.spinAd() : W.spinFree(); } catch (e) { console.error('Wheel spin:', e); r = { ok: false, reason: 'error' }; }
        if (!r || !r.ok) {
            this._whBusy = false;
            this._holdWallet(false);
            this._wheelRefresh(true);
            const rs = r ? r.reason : '';
            if (rs === 'adFailed') this._hintOn(this.whHint, Lang.t('ui.adFail').replace(/ Прогресс.*$| Your progress.*$/, ''), 'neutral');
            else if (rs && rs !== 'cooldown' && rs !== 'busy') this._hintOn(this.whHint, Lang.t('ui.adNone'), 'neutral');
            return;
        }
        this.whKey = '';
        this._wheelRefresh(true);
        hsuiSfx('go');
        await this._wheelAnimate(r);
        this._wheelFinish(r);
    },

    /** Диск крутится до r.angle за r.durationMs (замедление к концу), на каждом секторе под стрелкой — щелчок. */
    _wheelAnimate(r) {
        const W = Wheel;
        const from = this._whAngle, to = W.angleFrom(from, r);
        const dur = hsuiReduced() ? Math.min(1200, r.durationMs || 5500) : (r.durationMs || 5500);
        return new Promise(resolve => {
            let t0 = 0, last = W.sectorAt(from), lastTick = 0, finished = false;
            const end = () => {
                if (finished) return;
                finished = true;
                this._whAngle = to;
                this._wheelSet(to);
                resolve(undefined);
            };
            const frame = (now) => {
                if (finished) return;
                if (!t0) t0 = now;
                const p = hsuiClamp((now - t0) / dur, 0, 1);
                const e = 1 - Math.pow(1 - p, 4);
                const a = from + (to - from) * e;
                this._wheelSet(a);
                const idx = W.sectorAt(a);
                if (idx !== last) {
                    last = idx;
                    if (now - lastTick > 70) { lastTick = now; hsuiSfx('tick'); }
                    if (this.whPtr) { this.whPtr.classList.remove('flick'); void this.whPtr.offsetWidth; this.whPtr.classList.add('flick'); }
                }
                if (p < 1) requestAnimationFrame(frame); else end();
            };
            requestAnimationFrame(frame);
            window.setTimeout(end, dur + 1200);   // запасной выход, если вкладка была скрыта
        });
    },

    /** Анимация кончилась: Wheel.finish() начисляет приз один раз, окно приза и монеты в счётчик. */
    _wheelFinish(r) {
        let f = null;
        try { f = Wheel.finish(); } catch (e) { console.error('Wheel.finish:', e); }
        this._whBusy = false;
        if (!f || !f.ok) { this._holdWallet(false); this._wheelRefresh(true); return; }
        this._holdWallet(true);
        const sec = f.sector != null ? f.sector : (r ? r.sector : -1);
        const sd = Wheel._sectors[sec];   // кристаллы сектора выдаёт Game по событию prize, в got их нет
        const gemsWon = sd && sd.gems > 0 ? sd.gems | 0 : 0;
        const wd = this.whDisk.querySelector('.wd[data-i="' + sec + '"]');
        if (wd) wd.classList.add('win');
        hsuiSfx('equip');
        this._burst(this.whDisk, 20);
        window.setTimeout(() => {
            if (wd) wd.classList.remove('win');
            this._prize({ title: Lang.t('ui.wh.win'), items: this._gotItems(f.got, gemsWon), onClose: () => { this._wheelBuildDisk(); this.whKey = ''; this._wheelRefresh(true); } });
        }, 900);
        this.whKey = '';
        this._wheelRefresh(true);
    },

    // =====================================================================================
    // Предложение «время вышло: +20 секунд за рекламу»
    // =====================================================================================

    /**
     * @param {'time'} kind
     * @param {{ seconds?: number, onAccept?: () => Promise<boolean> | boolean, onDecline?: () => void }} o
     */
    offer(kind, o) {
        o = o || {};
        if (!this.root) { if (o.onDecline) o.onDecline(); return; }
        this._offerEnd(this._offerRec, 'silent');
        if (!hsuiAdsOn()) { if (o.onDecline) o.onDecline(); return; }
        kind = 'time';
        const total = Math.max(3, Number(o.seconds) || 7);
        const el = hsuiEl('div', 'hs-offer ' + kind, this.root);
        const card = hsuiEl('div', 'of-card hs-paper hs-tape', el);
        hsuiEl('div', 'hs-stamp st', card).textContent = Lang.t('offer.' + kind + '.t');
        const ring = hsuiEl('div', 'of-ring', card, '<svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="46"/><circle class="tr" cx="50" cy="50" r="38"/><circle class="pg" cx="50" cy="50" r="38" stroke-dashoffset="0"/></svg><b></b>');
        const num = /** @type {HTMLElement} */ (ring.querySelector('b'));
        const pg = /** @type {SVGElement} */ (ring.querySelector('.pg'));
        hsuiEl('div', 'of-sub', card).textContent = Lang.t('offer.' + kind + '.s');
        const go = hsuiBtn('hs-btn green go', card);
        const hint = hsuiEl('div', 'hs-hint', card);
        const no = hsuiBtn('of-no', card);
        no.textContent = Lang.t('offer.no');
        const rec = { kind, el, ring, num, pg, go, no, hint, total, left: total, last: performance.now(), busy: false, done: false, o, raf: 0, key: '' };
        this._offerRec = rec;
        this._bind(go, async () => {
            if (rec.done || rec.busy) return;
            if (!hsuiAdReady()) { this._shake(go); hsuiSfx('error'); return; }
            rec.busy = true;
            this._offerRefresh();
            try { if (o.onAccept) await o.onAccept(); } catch (e) { console.error('GameUI.offer onAccept:', e); }
            rec.busy = false;
            this._offerEnd(rec, 'accept');
        }, false);
        this._bind(no, () => { if (!rec.busy) this._offerEnd(rec, 'decline'); }, true);
        this._offerRefresh();
        const loop = () => {
            if (rec.done) return;
            const now = performance.now();
            if (!rec.busy) rec.left -= Math.min(0.25, (now - rec.last) / 1000);
            rec.last = now;
            const f = hsuiClamp(rec.left / rec.total, 0, 1);
            pg.setAttribute('stroke-dashoffset', (238.76 * (1 - f)).toFixed(1));
            const s = Math.max(0, Math.ceil(rec.left));
            if (rec.num.textContent !== String(s)) rec.num.textContent = String(s);
            ring.classList.toggle('low', rec.left <= 3 && !rec.busy);
            if (rec.left <= 0 && !rec.busy) { this._offerEnd(rec, 'decline'); return; }
            rec.raf = requestAnimationFrame(loop);
        };
        rec.raf = requestAnimationFrame(loop);
        hsuiSfx('alarm');
    },

    _offerRefresh() {
        const r = this._offerRec;
        if (!r || r.done) return;
        const wait = hsuiAdWait(), ready = hsuiAdReady() && !r.busy;
        const key = wait + '|' + ready + '|' + r.busy;
        if (r.key === key) return;
        r.key = key;
        r.go.classList.toggle('off', !ready);
        r.go.innerHTML = '';
        const colEl = hsuiEl('span', 'col', r.go);
        hsuiEl('span', '', colEl).textContent = r.busy ? Lang.t('ui.adRunning') : wait ? wait.toUpperCase() : Lang.t('offer.' + r.kind + '.b');
        if (!wait && !r.busy) hsuiEl('span', 'sub', colEl).textContent = Lang.t('ui.forAd');
    },

    /** why: 'accept' (Game сам всё сделал) | 'decline' (Нет / время вышло: onDecline) | 'silent' (раунд кончился). */
    _offerEnd(r, why) {
        if (!r || r.done) return;
        r.done = true;
        cancelAnimationFrame(r.raf);
        if (this._offerRec === r) this._offerRec = null;
        r.el.classList.add('out');
        window.setTimeout(() => r.el.remove(), 220);
        if (why === 'decline') { try { if (r.o.onDecline) r.o.onDecline(); } catch (e) { console.error('GameUI.offer onDecline:', e); } }
    },

    // =====================================================================================
    // Настройки
    // =====================================================================================

    _buildSettings() {
        const w = this._mkWin('settings', { title: Lang.t('ui.settings'), wallet: false, close: () => this.closeSettings(), sheetCls: 'hs-set' });
        this.set_el = w.win;
        const pn = w.sheet;
        const rows = hsuiEl('div', 'set-rows', pn);
        this.sw = {};
        for (const [id, icon] of [['sfx', HSUI_ICON.speaker], ['music', HSUI_ICON.note]]) {
            const row = hsuiEl('div', 'set-row', rows, icon);
            hsuiEl('span', 'lb', row).textContent = Lang.t('ui.' + id);
            const sw = hsuiBtn('hs-chk', row);
            sw.setAttribute('role', 'switch');
            this._bind(sw, () => this._toggleSetting(id));
            this.sw[id] = sw;
        }
        const q = hsuiEl('div', 'set-q', pn);
        hsuiEl('div', 'hd', q, HSUI_ICON.gear + '<span></span>').lastElementChild.textContent = Lang.t('ui.quality');
        const seg = hsuiEl('div', 'set-seg', q);
        this.qb = {};
        for (const id of ['auto', 'low', 'medium', 'high']) {
            const b = hsuiBtn('', seg);
            b.textContent = Lang.t('ui.q.' + id);
            this._bind(b, () => this._setQuality(id));
            this.qb[id] = b;
        }
        const btns = hsuiEl('div', 'set-btns', pn);
        const how = hsuiBtn('hs-btn hl', btns, HSUI_ICON.question + '<span></span>');
        how.lastElementChild.textContent = Lang.t('ui.howto');
        this._bind(how, () => this._howTo());
    },

    openSettings() {
        if (!this.root || this._hudOn) return;
        if (this._open === 'settings') return;
        if (this._open) this._closeWindows(true);
        if (!this.set_el) this._buildSettings();
        this._setRefresh();
        this._winOpen('settings', this.set_el);
    },

    closeSettings(silent) {
        if (this._open !== 'settings') return;
        if (silent) { this._open = ''; this._show(this.set_el, false); return; }
        this._winClose('settings', this.set_el);
    },

    _setRefresh() {
        if (!this.sw) return;
        const G = /** @type {any} */ (hsuiGame()), s = G && G.save && G.save.settings ? G.save.settings : { sfx: true, music: true };
        for (const id of ['sfx', 'music']) {
            const on = s[id] !== false;
            this.sw[id].classList.toggle('on', on);
            this.sw[id].setAttribute('aria-checked', String(on));
        }
        const cur = typeof Quality !== 'undefined' ? Quality.choice : 'auto';
        for (const id of Object.keys(this.qb)) this.qb[id].classList.toggle('on', id === cur);
    },

    _toggleSetting(id) {
        const G = /** @type {any} */ (hsuiGame());
        if (!G || !G.save) return;
        if (!G.save.settings) G.save.settings = { music: true, sfx: true };
        const s = G.save.settings;
        s[id] = s[id] === false;
        try { if (typeof G.persist === 'function') G.persist(); } catch (e) { /* сохранение не обязательно */ }
        try { if (typeof G.applySettings === 'function') G.applySettings(); } catch (e) { /* нет настроек звука */ }
        if (id === 'music' && typeof GameFX !== 'undefined' && typeof GameFX.music === 'function') {
            try { GameFX.music(s.music !== false ? (G.state === 'menu' ? 'menu' : null) : null); } catch (e) { /* музыка не обязательна */ }
        }
        this._setRefresh();
        this._soundIcons();
    },

    _setQuality(id) {
        if (typeof Quality !== 'undefined') Quality.set(id);
        this._setRefresh();
        this._fxLevel();
    },

    // =====================================================================================
    // Результат: страница отчёта о деле
    // =====================================================================================

    _r: /** @type {any} */ (null),
    _x2Busy: false,
    _resBusy: false,

    _buildResult() {
        const win = hsuiEl('div', 'hs-screen hs-res', this.root);
        this.result_el = win;
        const sh = hsuiEl('div', 'rs-sheet', win);
        hsuiEl('div', 'rs-paper', sh);
        const head = this.rHead = hsuiEl('div', 'rs-head', sh);
        this.rStamp = hsuiEl('div', 'hs-stamp st', head);
        const meta = hsuiEl('div', 'rs-meta', head);
        this.rC1 = hsuiEl('div', 'c1', meta);
        this.rC2 = hsuiEl('div', 'c2', meta);
        this.rStars = hsuiEl('div', 'rs-stars', head);
        for (let i = 0; i < 3; i++) {
            const s = hsuiEl('div', 'rs-star', this.rStars, HSUI_ICON.star);
            s.style.setProperty('--r', (i - 1) * 9 + 'deg');
            s.style.setProperty('--d', (0.7 + i * 0.28) + 's');
        }
        const body = this.rBody = hsuiEl('div', 'rs-body hs-scroll', sh);
        const left = hsuiEl('div', 'rs-left', body);
        hsuiEl('div', 'rs-h', left).textContent = Lang.t('res.ledger');
        this.rRows = {};
        for (const k of ['rCatch', 'rFirst', 'rDex', 'rWin']) {
            const row = hsuiEl('div', 'rs-row', left);
            hsuiEl('span', 'k', row).textContent = Lang.t('res.' + k);
            hsuiEl('span', 'dots', row);
            this.rRows[k] = { row, b: hsuiEl('b', '', row, '0') };
        }
        const tot = hsuiEl('div', 'rs-row tot', left);
        hsuiEl('span', 'k', tot).textContent = Lang.t('res.rTotal');
        hsuiEl('span', 'dots', tot);
        this.rTotTag = hsuiEl('span', 'x2tag', tot, 'x2');
        this.rTotTag.hidden = true;
        const tb = hsuiEl('b', '', tot);
        hsuiImg('assets/ui/icon-coin.webp', '', tb);
        this.rTot = hsuiEl('span', '', tb, '0');
        const mini = hsuiEl('div', 'rs-row', left);
        hsuiEl('span', 'k', mini).textContent = Lang.t('res.gems');
        hsuiEl('span', 'dots', mini);
        this.rGemsRow = mini;
        this.rGems = hsuiEl('b', '', mini, '+0');
        const xp = hsuiEl('div', 'rs-row', left);
        hsuiEl('span', 'k', xp).textContent = Lang.t('res.xp');
        hsuiEl('span', 'dots', xp);
        this.rXp = hsuiEl('b', '', xp, '+0');
        const lvl = this.rLvl = hsuiEl('div', 'rs-lvl', left);
        this.rLvlT = hsuiEl('b', '', lvl);
        this.rLvlBar = hsuiEl('i', '', hsuiEl('div', 'hs-bar', lvl));
        this.rLvlUp = hsuiEl('span', 'up', lvl);
        this.rLvlUp.textContent = Lang.t('res.lvlUp');
        this.rNotes = hsuiEl('div', '', left);
        const right = hsuiEl('div', 'rs-right', body);
        this.rSpH = hsuiEl('div', 'rs-h', right);
        this.rSpH.textContent = Lang.t('res.species');
        const sc = hsuiEl('div', 'hs-scroll', right);
        sc.style.flex = '1'; sc.style.minHeight = '0';
        this.rCards = hsuiEl('div', 'rs-cards', sc);
        const foot = hsuiEl('div', 'rs-foot', sh);
        this.rX2 = hsuiBtn('hs-btn hl x2', foot);
        this.rX2.hidden = true;
        this._bind(this.rX2, () => this._resX2(), false);
        this.rMenu = hsuiBtn('hs-btn paper', foot, '<span></span>');
        this.rMenu.lastElementChild.textContent = Lang.t('res.menu');
        this._bind(this.rMenu, () => this._resGo('menu'));
        this.rMain = hsuiBtn('hs-btn main', foot, '<span></span>');
        this._bind(this.rMain, () => this._resGo(this._r && this._r.win ? 'next' : 'retry'), false);
    },

    /** Кнопки перехода: один раз на результат (двойной клик не запускает рекламный переход дважды). */
    _resGo(kind) {
        const G = /** @type {any} */ (hsuiGame());
        if (!G || this._resBusy) return;
        this._resBusy = true;
        window.setTimeout(() => { this._resBusy = false; }, 4000);
        hsuiSfx(kind === 'menu' ? 'click' : 'go');
        if (kind === 'next') G.next(); else if (kind === 'retry') G.retry(); else G.toMenu();
    },

    result(r) {
        if (!this.root || !r) return;
        if (!this.result_el) this._buildResult();
        this._closeWindows(true);
        this._menuHide(true);
        this._offerEnd(this._offerRec, 'silent');
        this._clearRT();
        r = this._r = Object.assign({}, r, { x2done: false });
        this._resultOn = true;
        this._resBusy = false;
        this._x2Busy = false;
        const win = !!r.win;
        this.rHead.className = 'rs-head ' + (win ? 'win' : 'lose');
        this.rStamp.className = 'hs-stamp st' + (win ? ' green' : '');
        this.rStamp.textContent = Lang.t(win ? 'res.win' : 'res.lose');
        this.rC1.textContent = Lang.t('ui.case', { n: hsuiPad2((r.mapIndex | 0) + 1) }) + ' · ' + hsuiName(r.mapName);
        this.rC2.textContent = Lang.t('res.caughtN', { a: r.caught | 0, b: r.total | 0 }) + ' · ' + Lang.t('res.time', { t: hsuiClock(r.time) });
        Array.from(this.rStars.children).forEach((s, i) => {
            s.classList.remove('on'); void /** @type {HTMLElement} */ (s).offsetWidth;
            s.classList.toggle('on', i < (r.stars | 0));
        });
        // ведомость наград
        const first = r.firstBonus | 0, dex = r.dexIncome | 0, wb = r.winBonus | 0;
        const base = Math.max(0, (r.coins | 0) - first - dex - wb);
        const vals = { rCatch: base, rFirst: first, rDex: dex, rWin: wb };
        let delay = 450;
        for (const k of Object.keys(vals)) {
            const o = this.rRows[k];
            o.row.classList.toggle('z', !vals[k]);
            o.b.textContent = '+0';
            this._countTo(o.b, 0, vals[k], delay, 600, '+');
            delay += 180;
        }
        this.rTot.textContent = '0';
        this._countTo(this.rTot, 0, r.coins | 0, delay, 900, '');
        this.rTotTag.hidden = true;
        this.rGemsRow.hidden = !(r.gems > 0);
        this.rGems.textContent = '+' + (r.gems | 0);
        this.rXp.textContent = '+' + (r.xp | 0);
        this.rLvlT.textContent = Lang.t('ui.levelLong', { n: r.level | 0 });
        this.rLvlBar.parentElement.style.setProperty('--f', hsuiClamp(r.xpFrac || 0, 0, 1).toFixed(3));
        this.rLvlUp.hidden = !r.levelUp;
        // пометки
        this.rNotes.innerHTML = '';
        if (r.unlocked) hsuiEl('div', 'rs-note hlz', this.rNotes).textContent = Lang.t('res.unlocked');
        if (r.mimicsFound > 0) hsuiEl('div', 'rs-note', this.rNotes).textContent = Lang.t('res.mimics', { n: r.mimicsFound });
        if (r.wrongChecks > 0) hsuiEl('div', 'rs-note', this.rNotes).textContent = Lang.t('res.wrong', { n: r.wrongChecks });
        // фото-карточки пойманных видов (повторы складываются в ×N, новые — первыми)
        const byId = new Map();
        for (const sp of r.species || []) {
            const g = byId.get(sp.id);
            if (g) { g.n++; g.isNew = g.isNew || sp.isNew; } else byId.set(sp.id, Object.assign({ n: 1 }, sp));
        }
        const cards = Array.from(byId.values()).sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        this.rCards.innerHTML = '';
        if (!cards.length) hsuiEl('div', 'rs-empty', this.rCards).textContent = Lang.t('res.noSpecies');
        const G = /** @type {any} */ (hsuiGame());
        const dex15 = G && G.dexList ? G.dexList() : [];
        cards.forEach((sp, i) => {
            const rc = hsuiRar(sp.rarity).color;
            const el = hsuiEl('div', 'rs-card', this.rCards);
            el.style.setProperty('--rc', rc);
            el.style.setProperty('--r', ((i * 37) % 7 - 3) * 0.7 + 'deg');
            el.style.setProperty('--d', (0.35 + i * 0.09).toFixed(2) + 's');
            const ph = hsuiEl('div', 'hs-photo', el);
            const im = hsuiEl('span', 'im', ph);
            const def = dex15.find(d => d.id === sp.id);
            hsuiPortrait(sp.portrait, def ? def.color : rc, im, false);
            if (sp.isNew) hsuiEl('span', 'newst', el).textContent = Lang.t('res.newSp');
            hsuiEl('div', 'nm', el).textContent = hsuiName(sp.name) + (sp.n > 1 ? ' ×' + sp.n : '');
            hsuiEl('span', 'rw', el).textContent = hsuiRarName(sp.rarity);
        });
        this.rBody.scrollTop = 0;
        // кнопки
        this.rMain.className = 'hs-btn main' + (win ? ' green' : '');
        this.rMain.lastElementChild.textContent = Lang.t(win ? 'res.next' : 'res.retry');
        this.rX2.dataset.k = '';
        this._x2Refresh();
        this._show(this.result_el, true);
        this.result_el.classList.add('on');
        if (win) this._confetti();
        if (r.newSpecies > 0) hsuiSfx('equip');
    },

    _clearRT() { for (const t of this._rt) clearTimeout(t); this._rt.length = 0; },

    _resultHide(fast) {
        this._resultOn = false;
        this._clearRT();
        if (!this.result_el) return;
        const c = this.root.querySelector('.hs-conf');
        if (c) c.remove();
        if (fast) { clearTimeout(this._timers.get(this.result_el)); this.result_el.classList.remove('on', 'in', 'out'); }
        else this._show(this.result_el, false);
    },

    /** Число плавно растёт from -> to. */
    _countTo(el, from, to, delay, dur, prefix) {
        const run = () => {
            const t0 = performance.now();
            const tick = () => {
                if (!this._resultOn) return;
                const p = hsuiClamp((performance.now() - t0) / dur, 0, 1);
                el.textContent = (prefix || '') + hsuiFmt(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
                if (p < 1) requestAnimationFrame(tick); else el.textContent = (prefix || '') + hsuiFmt(to);
            };
            requestAnimationFrame(tick);
        };
        if (to === from) { el.textContent = (prefix || '') + hsuiFmt(to); return; }
        if (delay > 0) this._rt.push(window.setTimeout(run, delay)); else run();
    },

    _x2Refresh() {
        const b = this.rX2, r = this._r;
        if (!b || !this._resultOn || !r) return;
        const show = (r.coins | 0) > 0 && hsuiAdsOn() && typeof (/** @type {any} */ (hsuiAds())).doubleReward === 'function';
        b.hidden = !show;
        if (!show) return;
        const wait = hsuiAdWait(), ready = hsuiAdReady() && !this._x2Busy;
        const key = [r.x2done, wait, ready, this._x2Busy, r.coins].join('|');
        if (b.dataset.k === key) return;
        b.dataset.k = key;
        b.classList.toggle('done', !!r.x2done);
        b.classList.toggle('off', !r.x2done && !ready);
        b.innerHTML = '';
        const colEl = hsuiEl('span', 'col', b);
        hsuiEl('span', '', colEl).textContent = r.x2done ? Lang.t('res.x2done') : this._x2Busy ? Lang.t('ui.adRunning') : wait ? wait.toUpperCase() : Lang.t('res.x2');
        if (!r.x2done && !wait && !this._x2Busy) hsuiEl('span', 'sub', colEl).textContent = Lang.t('res.x2sub', { n: hsuiFmt(r.coins | 0) });
    },

    async _resX2() {
        const a = /** @type {any} */ (hsuiAds()), r = this._r;
        if (!a || !r || r.x2done || this._x2Busy || typeof a.doubleReward !== 'function') return;
        if (!hsuiAdReady()) { this._shake(this.rX2); hsuiSfx('error'); return; }
        this._x2Busy = true;
        this._x2Refresh();
        let res = null;
        try { res = await a.doubleReward(); } catch (e) { console.error('doubleReward:', e); res = null; }
        this._x2Busy = false;
        if (res && res.ok && this._r === r) {
            const old = r.coins | 0;
            const total = res.coins > old ? res.coins | 0 : old * 2;
            r.coins = total;
            r.x2done = true;
            hsuiSfx('buy');
            this._countTo(this.rTot, old, total, 0, 1100, '');
            this.rTotTag.hidden = false;
            this._burst(this.rTot, 18);
        } else if (this._r === r) {
            if (this.rX2) this.rX2.dataset.k = '';
        }
        this._x2Refresh();
    },

    /** Конфетти-обрывки бумаги при победе. */
    _confetti() {
        if (!this.root || hsuiReduced() || this.root.classList.contains('hs-lowfx')) return;
        const old = this.root.querySelector('.hs-conf');
        if (old) old.remove();
        const wrap = hsuiEl('div', 'hs-conf', this.root);
        const cols = ['#d6372c', '#ffd84a', '#2e9a50', '#2b5db0', '#f6edd6', '#d4b07a'];
        for (let i = 0; i < 36; i++) {
            const c = hsuiEl('i', '', wrap);
            c.style.left = (Math.random() * 100).toFixed(1) + '%';
            c.style.setProperty('--c', cols[i % cols.length]);
            c.style.setProperty('--d', (Math.random() * 0.8).toFixed(2) + 's');
            c.style.setProperty('--t', (2 + Math.random() * 1.6).toFixed(2) + 's');
        }
        this._rt.push(window.setTimeout(() => wrap.remove(), 4800));
    },
};

// Пикабу Игры: название только по-русски — логотип меню.
if (String(GAME_PLATFORM) === 'pikabu') for (const c of Object.keys(LANG_STRINGS)) Object.assign(/** @type {Record<string, Record<string, string>>} */ (LANG_STRINGS)[c], { 'ui.logo1': 'ПРЯТКИ С МОНСТРАМИ', 'ui.logo2': 'ИЩЕЙКА' });
