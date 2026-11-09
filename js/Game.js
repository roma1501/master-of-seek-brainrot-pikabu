// Game.js — «Master of Seek Brainrot»: меню на живой сцене, раунд поиска (игрок — мастер-искатель),
// брейнроты-прячущиеся и мимики, инструменты (радар, сачок, «Проверить»), Брейндекс, монеты, награды, уровни,
// магазин, сохранение. Интерфейс — GameUI.js, эффекты и звук — GameFX.js, персонажи — GameActors.js, ИИ — GameAI.js.
// Контракт модулей — docs/GAME-SPEC.md (раздел «Master of Seek Brainrot»).

Object.assign(LANG_STRINGS.ru, {
    'title': 'Master of Seek Brainrot',
    'tut.check.t': 'Проверь подозрительное',
    'tut.check.hk': 'Подойди к предмету и нажми {keys}: мимик оживёт, а пустой предмет отнимет время',
    'tut.check.ht': 'Подойди к предмету и нажми «Проверить»: мимик оживёт, а пустой предмет отнимет время',
    'tut.radar.t': 'Радар',
    'tut.radar.hk': 'Нажми {keys}: стрелка покажет, где ближайший брейнрот',
    'tut.radar.ht': 'Нажми «Радар»: стрелка покажет, где ближайший брейнрот',
    'tut.net.t': 'Сачок',
    'tut.net.hk': 'Нажми {keys}, чтобы бросить сачок вперёд и поймать убегающего',
    'tut.net.ht': 'Нажми «Сачок», чтобы бросить его вперёд и поймать убегающего',
    'tut.light.t': 'Ты — мастер-искатель',
    'tut.light.h': 'Брейнроты прячутся и притворяются предметами. Лови всех до конца таймера — каждый новый вид попадёт в Брейндекс',
    'hs.you': 'ТЫ',
    'hs.chest': 'Сундук!',
    'hs.newSpecies': 'Новый вид!',
    'hs.mimic': 'Мимик!',
    'hs.empty': 'Пусто!',
    'hs.penalty': '−{n} с',
});
Object.assign(LANG_STRINGS.en, {
    'title': 'Master of Seek Brainrot',
    'tut.check.t': 'Check the suspicious',
    'tut.check.hk': 'Walk up to an object and press {keys}: a mimic comes alive, an empty object costs time',
    'tut.check.ht': 'Walk up to an object and tap Check: a mimic comes alive, an empty object costs time',
    'tut.radar.t': 'Radar',
    'tut.radar.hk': 'Press {keys}: the arrow points to the nearest brainrot',
    'tut.radar.ht': 'Tap Radar: the arrow points to the nearest brainrot',
    'tut.net.t': 'Net',
    'tut.net.hk': 'Press {keys} to throw the net ahead and catch a runaway',
    'tut.net.ht': 'Tap Net to throw it ahead and catch a runaway',
    'tut.light.t': 'You are the master hunter',
    'tut.light.h': 'Brainrots hide and pose as objects. Catch them all before the timer ends — every new species goes into the Braindex',
    'hs.you': 'YOU',
    'hs.chest': 'Treasure!',
    'hs.newSpecies': 'New species!',
    'hs.mimic': 'Mimic!',
    'hs.empty': 'Nothing!',
    'hs.penalty': '−{n} s',
});

/** @satisfies {Record<string, any>} */
const Game = {
    /** @type {LoryApp | null} */
    app: null,
    /** @type {any} */
    save: null,
    state: 'menu',            // menu | tutorial | hide | seek | offer | result
    role: 'seeker',           // игрок всегда охотник
    mapIndex: 0,
    time: 0,
    timeMax: 100,
    /** @type {HsAgent | null} */ player: null,
    /** @type {HsAgent[]} */ brainrots: [],
    /** @type {HsBrainrotBrain[]} */ brains: [],
    /** @type {HsPerception | null} */ perception: null,
    /** @type {HsVisionCone | null} */ cone: null,
    /** @type {HsGroundRing | null} */ ring: null,
    /** @type {HsPickups | null} */ pickups: null,
    /** @type {any[]} */ cages: [],
    /** @type {any[]} */ nets: [],
    /** @type {any[]} */ waves: [],
    round: { coins: 0, caught: 0, mimicsFound: 0, wrong: 0, checks: 0, species: [], newSpecies: [], firstBonus: 0, magnet: false, bonusTime: 0, battery: false, startedAt: 0, timeAdded: false },
    radar: { cd: 0, cdMax: 16, active: 0, dur: 4, dir: null, temp: null, dist: 0, jitter: 0 },
    netCd: 0,
    netCdMax: 2.6,
    checkCd: 0,
    boost: 0,
    penaltyFlash: 0,
    menuT: 0,
    /** @type {any} */ aura: null,
    /** @type {HsChest | null} */ chest: null,
    /** @type {any} */ chestGlow: null,
    /** @type {any} */ trailFx: null,
    /** @type {any} */ auraFx: null,
    auraId: '',
    trailId: '',
    previewRun: false,
    gearPreviewT: 0,
    emotePreviewT: 0,
    /** @type {any} */ lastReward: null,
    busy: false,
    oneShot: 0,               // с: разовый клип героя (бросок, проверка) доигрывается, потом снова бег или покой
    _chaseMusic: false,
    /** @type {any} */ _gearPreviewId: null,

    // ------------------------------------------------------------------ сохранение

    defaults() {
        return {
            coins: typeof HS_START_COINS !== 'undefined' ? HS_START_COINS : 150, gems: 10, xp: 0, level: 1, mapIndex: 0,
            skin: 'hunter-01', owned: { skins: ['hunter-01'] },
            power: { magnet: 0, time: 0, battery: 0 }, settings: { music: true, sfx: true },
            tutorialDone: false, best: 0, wins: 0, rounds: 0,
            dex: {}, tools: { radar: 1, net: 1 },
        };
    },

    normalize(s) {
        const d = this.defaults();
        s = s && typeof s === 'object' ? s : {};
        const out = Object.assign({}, d, s);
        out.owned = Object.assign({}, d.owned, s.owned || {});
        out.power = Object.assign({}, d.power, s.power || {});
        out.settings = Object.assign({}, d.settings, s.settings || {});
        out.dex = s.dex && typeof s.dex === 'object' ? s.dex : {};
        out.tools = Object.assign({}, d.tools, s.tools || {});
        for (const k of ['radar', 'net']) out.tools[k] = Math.max(1, Math.min(HS_TOOLS[k].max, out.tools[k] | 0));
        if (!Array.isArray(out.owned.skins)) out.owned.skins = d.owned.skins.slice();
        out.mapIndex = Math.max(0, Math.min(HS_MAPS.length - 1, out.mapIndex | 0));
        return out;
    },

    persist() {
        try { Platform.save(this.save); } catch (e) { console.warn('save', e); }
        window.dispatchEvent(new CustomEvent('hs-save'));
    },

    /** Номер карты → id карты в Maps.js (нет карты с id из HS_MAPS — берётся карта с тем же номером по порядку). @param {number} i */
    mapIdAt(i) {
        const list = typeof GAME_MAPS !== 'undefined' ? GAME_MAPS : [];
        const want = HS_MAPS[i] && HS_MAPS[i].id;
        if (list.some(m => m.id === want)) return want;
        return (list[i] || list[list.length - 1] || { id: want }).id;
    },

    async firstMap() {
        this.save = this.normalize(await Platform.load());
        this.mapIndex = this.save.mapIndex;
        return this.mapIdAt(this.mapIndex);
    },

    // ------------------------------------------------------------------ запуск

    async init(app) {
        this.app = app;
        if (!this.save) this.save = this.normalize(await Platform.load());
        this.mapIndex = Math.max(0, HS_MAPS.findIndex((m, i) => this.mapIdAt(i) === app.map.id));
        GameKit.register();
        this.initEconomy();
        await GameRecords.init();
        HudLayout.init({ app });
        Input.init({
            app, mouse: 'none', camera: true,
            // джойстик везде: палец на телефоне, мышь на ПК (ЛКМ слева — стик); клавиатура тоже работает
            mouseTouch: true, stickIdle: true,
            actions: {
                forward: { keys: ['KeyW', 'ArrowUp'], pad: [12] },
                back: { keys: ['KeyS', 'ArrowDown'], pad: [13] },
                left: { keys: ['KeyA', 'ArrowLeft'], pad: [14] },
                right: { keys: ['KeyD', 'ArrowRight'], pad: [15] },
                net: { keys: ['Space', 'KeyF'], pad: [0] },
                radar: { keys: ['KeyR', 'KeyQ'], pad: [2] },
                check: { keys: ['KeyE', 'Enter'], pad: [1] },
                pause: { keys: ['KeyP'], pad: [9], rebind: false },
            },
        });
        Input.configure({ controls: false });
        // камера только следует за героем: ни средняя кнопка (панорама), ни колесо, ни щипок её не двигают
        app.camera.ignorePointer = () => true;
        const canvas = document.getElementById('world3d');
        window.addEventListener('wheel', e => { if (e.target === canvas) { e.stopPropagation(); e.preventDefault(); } }, { capture: true, passive: false });
        window.addEventListener('mousedown', e => { if (e.button === 1) e.preventDefault(); }, { capture: true });   // без автопрокрутки браузера
        GameFX.init(app);
        GameUI.init(app);
        this.applySettings();
        this.initTutorial();
        app.onUpdate(dt => Rig.updateAll(dt));
        await this.prepareMap(app);
    },

    async ready() {
        this.enterMenu();
        this.preloadSpecies();
    },

    /** Фоном прогреть кэш моделей брейнротов, чтобы раунд стартовал без паузы. */
    preloadSpecies() {
        let i = 0;
        const next = () => {
            if (i >= HS_BRAINROTS.length) return;
            const b = HS_BRAINROTS[i++];
            Rig.load(b.model).catch(() => { /* нет модели — будет запасной вид */ }).then(() => setTimeout(next, 60));
        };
        setTimeout(next, 1500);
    },

    applySettings() {
        const s = this.save.settings;
        if (typeof Sound.setMuted === 'function') Sound.setMuted(!s.sfx && !s.music);
    },

    /** Включён ли звук (музыка или эффекты). */
    soundOn() { const s = this.save.settings; return !!(s.music || s.sfx); },

    /** Кнопка звука: выключает и включает всё сразу. */
    toggleSound() {
        const s = this.save.settings, on = !this.soundOn();
        s.music = on; s.sfx = on;
        this.applySettings();
        this.persist();
        if (on) GameFX.sfx('click');
        return on;
    },

    initTutorial() {
        const nearCandidate = () => {
            const t = this.checkCandidates()[0];
            return t ? { x: t.x, y: t.y, h: 120 } : null;
        };
        Tutorial.init({
            app: this.app,
            css: GameUI.tutorialCss || '',
            steps: [
                Tutorial.preset('move'),
                { id: 'check', title: 'tut.check.t', hint: { keyboard: 'tut.check.hk', touch: 'tut.check.ht', mouse: 'tut.check.ht', pad: 'tut.check.hk' }, keys: { keyboard: ['check'], pad: ['check'] }, event: 'check', target: () => document.querySelector('[data-hs="check"]'), world: nearCandidate },
                { id: 'radar', title: 'tut.radar.t', hint: { keyboard: 'tut.radar.hk', touch: 'tut.radar.ht', mouse: 'tut.radar.ht', pad: 'tut.radar.hk' }, keys: { keyboard: ['radar'], pad: ['radar'] }, event: 'radar', target: () => document.querySelector('[data-hs="radar"]') },
                { id: 'net', title: 'tut.net.t', hint: { keyboard: 'tut.net.hk', touch: 'tut.net.ht', mouse: 'tut.net.ht', pad: 'tut.net.hk' }, keys: { keyboard: ['net'], pad: ['net'] }, event: 'net', target: () => document.querySelector('[data-hs="net"]') },
            ],
            state: () => this.save, field: 'tutorialDone',
            persist: () => this.persist(),
            onFinish: () => { if (this.state === 'tutorial') this.beginHide(Math.min(5, this.hideTime())); },
        });
    },

    howToPlay() {
        this.save.tutorialDone = false;
        this.persist();
        this.play();
    },

    // ------------------------------------------------------------------ карта и персонажи

    hideTime() { return typeof HS_HIDE_TIME !== 'undefined' ? HS_HIDE_TIME : 6; },

    /** Сколько брейнротов на текущей карте: от HS_BRAINROTS_MIN на первой до HS_BRAINROTS_MAX на последней. */
    brainrotCount() {
        const lo = typeof HS_BRAINROTS_MIN !== 'undefined' ? HS_BRAINROTS_MIN : 5, hi = typeof HS_BRAINROTS_MAX !== 'undefined' ? HS_BRAINROTS_MAX : 8;
        return Math.max(1, Math.round(lo + (hi - lo) * this.mapIndex / Math.max(1, HS_MAPS.length - 1)));
    },

    searchTime(n) {
        const base = typeof HS_SEARCH_TIME !== 'undefined' ? HS_SEARCH_TIME : 100, extra = typeof HS_SEARCH_EXTRA !== 'undefined' ? HS_SEARCH_EXTRA : 8;
        const lo = typeof HS_BRAINROTS_MIN !== 'undefined' ? HS_BRAINROTS_MIN : 5;
        return base + Math.max(0, n - lo) * extra;
    },

    /** Подготовка карты под экраном загрузки (повторяемая). */
    async prepareMap(app) {
        this.disposeActors();
        const loc = app.location;
        Nav.build(loc);
        HsPlaces.build(loc);
        this.pickups = new HsPickups(loc.view);
        this.cone = new HsVisionCone(loc.view.scene, '#ffe08a');
        this.ring = new HsGroundRing(loc.view.scene, '#38d6ff', 46);
        this.auraFx = null; this.auraId = ''; this.trailFx = null; this.trailId = '';
        this.applyMapLight();
        const sp = loc.marker('spawn') || loc.marker('seeker') || { x: loc.width / 2, y: loc.height / 2 };
        this.player = new HsAgent('hunter', 'me', sp.x, sp.y);
        this.player.isPlayer = true;
        this.player.name = Lang.t('hs.you');
        this.perception = new HsPerception(this.player);
        this.brainrots = []; this.brains = [];
        await this.buildPlayerView();
        this.spawnPickups();
        this.aimMenuCamera();
        app.camera.follow(this.camTarget);
        app.camera.snap();
    },

    /** Объект, за которым следит камера (меню — на герое). */
    camTarget: {
        x: 0, y: 0, h: 0, frameHeight: 1250, frameWidth: 1050,
    },

    async buildPlayerView() {
        const view = this.app.location.view;
        const look = this.look();
        this.player.view = new HsHunterView(view, look.skin);
        await this.player.view.ready;
        if (look.hat) await this.player.view.setHat(look.hat);
        this.syncAura();
        this.syncAuraFx(look.aura);
        this.syncTrail(look.trail);
        this.placeAll(0);
    },

    /** Аура редкого облика под ногами (рамка вида). */
    syncAura() {
        if (this.aura) { this.aura.stop(); this.aura = null; }
        if (!this.player || !this.player.view) return;
        const skin = hsHunter(this.look().skin || this.save.skin);
        if (skin.rarity !== 'common') {
            const p = this.player;
            this.aura = GameFX.skinAura(() => new BABYLON.Vector3(p.x, p.h + 60, p.y), skin.rarity);
        }
    },

    // ------------------------------------------------------------------ экономика: магазин, подарок дня, колесо

    initEconomy() {
        const s = this.save;
        const persist = () => this.persist();
        Shop.init({
            tabs: HS_SHOP_TABS, items: HS_SHOP_ITEMS, state: s.shop, persist,
            adsAvailable: () => Platform.rewardedSupported(),
        });
        s.shop = Shop.state;
        if (!s.econ) {
            if (s.coins > 0) Shop.addCoins(s.coins, { reason: 'start', save: false });
            for (const id of (s.owned.skins || [])) if (hsItem(id) && !Shop.owns(id)) Shop.grant(id, { reason: 'start', save: false });
            if (Shop.owns(s.skin)) Shop.equip(s.skin);
            s.econ = 1;
        }
        s.coins = Shop.coins;
        Shop.on(e => {
            s.coins = Shop.coins;
            if (e.type === 'equip' || e.type === 'unequip') s.skin = Shop.look().skin || 'hunter-01';
            if (e.type === 'equip' || e.type === 'unequip' || e.type === 'preview' || e.type === 'grant') this.applyLook();
            window.dispatchEvent(new CustomEvent('hs-save'));
        });
        DailyGift.init({ rewards: HS_DAILY_REWARDS, exclusive: HS_DAILY_EXCLUSIVE, rewardsSink: Shop, state: s.daily, persist });
        s.daily = DailyGift.state;
        DailyGift.on(e => {
            if (e.type === 'claim' && e.reward && e.reward.gems) { s.gems += e.reward.gems * (e.mult || 1); persist(); }
        });
        Wheel.init({ sectors: HS_WHEEL_SECTORS, rewardsSink: Shop, state: s.wheel, persist });
        s.wheel = Wheel.state;
        Wheel.on(e => {
            if (e.type !== 'prize') return;
            const sec = typeof e.sector === 'number' ? HS_WHEEL_SECTORS[e.sector] : e.sector;
            if (sec && sec.gems) { s.gems += sec.gems; persist(); }
        });
    },

    /** Что надето (с примеркой магазина): { skin, hat, trail, aura, emote, net }. */
    look() {
        const l = typeof Shop !== 'undefined' && Shop.look ? Shop.look() : {};
        return { skin: l.skin || this.save.skin || 'hunter-01', hat: l.hat || '', trail: l.trail || '', aura: l.aura || 'aura_basic', emote: l.emote || 'win_confetti', net: l.net || 'net_basic' };
    },

    /** Применить надетое к сцене: облик, шапка, аура, след (меню и раунд). */
    async applyLook() {
        if (!this.app || !this.player) return;
        const look = this.look();
        const view = this.app.location.view;
        if (!this.player.view || this.player.view.skinId !== look.skin) {
            const old = this.player.view;
            const nv = new HsHunterView(view, look.skin);
            this.player.view = nv;
            await nv.ready;
            if (this.player.view !== nv) { nv.dispose(); return; }
            if (old) old.dispose();
            nv.play(this.state === 'menu' ? 'wave' : 'idle');
            this.placeAll(0);
            this.syncAura();
        }
        if (this.player.view.setHat) this.player.view.setHat(look.hat);
        this.syncAuraFx(look.aura);
        this.syncTrail(look.trail);
    },

    syncAuraFx(id) {
        if (this.auraId === id && this.auraFx) return;
        if (this.auraFx) { this.auraFx.stop(); this.auraFx = null; }
        this.auraId = id;
        const P = this.player;
        if (id) this.auraFx = GameCosmetics.aura(id, this.app.location.view, () => ({ x: P.x, y: P.y, h: P.h }));
        if (this.auraFx && this.auraFx.stub) this.auraFx = null;
    },

    syncTrail(id) {
        if (this.trailId === id && (this.trailFx || !id)) return;
        if (this.trailFx) { this.trailFx.stop(); this.trailFx = null; }
        this.trailId = id;
        const P = this.player;
        if (id) this.trailFx = GameCosmetics.trail(id, () => ({ x: P.x, y: P.y, h: P.h, speed: this.state === 'menu' && this.previewRun ? 320 : P.speed }));
    },

    /** Магазин: примерка предмета на сцене меню (null — вернуть надетое). */
    shopPreview(id) {
        const it = id ? hsItem(id) : null;
        Shop.clearPreview();
        this.previewRun = false;
        this.emotePreviewT = 0;
        this._gearPreviewId = null;
        if (it) {
            Shop.preview(id);
            if (it.tab === 'trail') this.previewRun = true;
            if (it.tab === 'emote') { this.emotePreviewT = 0.01; this._emoteId = id; }
            if (it.tab === 'net') { this._gearPreviewId = id; this.gearPreviewT = 0.2; }
        }
        this.applyLook();
    },

    // ------------------------------------------------------------------ реклама за награду

    ads: {
        busy: false,
        ready() { return !Game.ads.busy && (typeof Platform.rewardedReady !== 'function' || Platform.rewardedReady()); },
        label() { return typeof Platform.rewardedCooldownLeft === 'function' && Platform.rewardedCooldownLeft() > 0 ? Platform.rewardedCooldownLabel() : ''; },
        /** Один rewarded: награда только по true, повторные нажатия во время показа игнорируются. */
        async run(id, give) {
            if (!this.ready()) return { ok: false, reason: this.busy ? 'busy' : 'cooldown' };
            this.busy = true;
            try {
                const ok = await Platform.rewarded(id);
                if (!ok) return { ok: false, reason: 'ad' };
                const extra = give() || {};
                Game.persist();
                return Object.assign({ ok: true }, extra);
            } catch (e) {
                return { ok: false, reason: 'error' };
            } finally { this.busy = false; }
        },
        /** Сколько даёт «+» у кошелька: 'coins' | 'gems'. */
        amount(kind) { return kind === 'gems' ? 8 : 120 + Game.save.level * 20; },
        coins() {
            return this.run('bonus-coins', () => {
                const n = this.amount('coins');
                Shop.addCoins(n, { reason: 'ad' });
                GameFX.sfx('buy');
                return { amount: n };
            });
        },
        gems() {
            return this.run('bonus-gems', () => { const n = this.amount('gems'); Game.save.gems += n; GameFX.sfx('buy'); return { amount: n }; });
        },
        doubleReward() {
            const r = Game.lastReward;
            if (!r || r.doubled || !(r.coins > 0)) return Promise.resolve({ ok: false, reason: 'none' });
            return this.run('round-x2', () => {
                r.doubled = true;
                Shop.addCoins(r.coins, { reason: 'x2' });
                GameFX.sfx('buy');
                return { coins: r.coins * 2 };
            });
        },
        powerup(id) {
            const p = HS_POWERUPS.find(i => i.id === id);
            if (!p) return Promise.resolve({ ok: false, reason: 'unknown' });
            return this.run('powerup', () => { Game.save.power[id] = (Game.save.power[id] || 0) + (p.pack || 1); GameFX.sfx('buy'); });
        },
    },

    /** Предложение посреди раунда (время вышло — «+20 секунд за рекламу»). Без UI или рекламы — сразу отказ. */
    offer(kind, accept, decline) {
        const ui = /** @type {any} */ (GameUI);
        if (typeof ui.offer !== 'function' || !Platform.rewardedSupported()) { decline(); return; }
        this.state = 'offer';
        ui.offer(kind, {
            seconds: 7,
            onAccept: async () => {
                const r = await this.ads.run('extra-time', accept);
                if (!r.ok) decline();
                return r.ok;
            },
            onDecline: () => decline(),
        });
    },

    spawnPickups() {
        const loc = this.app.location;
        this.pickups.clear();
        for (const m of loc.markers('coin')) this.pickups.spawn('coin', m.x, m.y);
        for (const m of loc.markers('orb-dash')) this.pickups.spawn('dash', m.x, m.y);
        for (const m of loc.markers('orb-ghost')) this.pickups.spawn('ghost', m.x, m.y);
    },

    /** Убрать брейнротов раунда: виды, мимики, клетки, сачки, волны. */
    disposeBrainrots() {
        for (const a of this.brainrots) {
            if (a.view) a.view.dispose();
            if (a.mimicView) a.mimicView.dispose();
            a.view = null; a.mimicView = null;
        }
        this.brainrots = []; this.brains = [];
        for (const c of this.cages) if (c.node) c.node.dispose();
        this.cages = [];
        for (const n of this.nets) if (n.view) n.view.dispose();
        this.nets = [];
        for (const w of this.waves) w.dispose();
        this.waves = [];
    },

    disposeActors() {
        if (this.player && this.player.view) this.player.view.dispose();
        this.disposeBrainrots();
        this.removeChest();
        if (this.cone) this.cone.dispose();
        if (this.ring) this.ring.dispose();
        if (this.pickups) this.pickups.dispose();
        if (this.aura) { this.aura.stop(); this.aura = null; }
        if (this.auraFx) { this.auraFx.stop(); this.auraFx = null; }
        if (this.trailFx) { this.trailFx.stop(); this.trailFx = null; }
        this.auraId = ''; this.trailId = '';
        this.cone = null; this.ring = null; this.pickups = null;
    },

    /** Небо, туман и свет темы карты (ночные темы темнее и холоднее). */
    applyMapLight() {
        const m = HS_MAPS[this.mapIndex] || HS_MAPS[0];
        const night = !!m.night;
        World3D.setLighting({
            WORLD3D_SKY_COLOR: parseInt(m.sky.slice(1), 16),
            WORLD3D_FOG_DENSITY: 0.00012,
            WORLD3D_SUN_INTENSITY: night ? 0.62 : 0.82,
            WORLD3D_SKYLIGHT_INTENSITY: night ? 0.55 : 0.46,
            WORLD3D_SKYLIGHT_COLOR: night ? 0xb9a8ff : 0xc4e4ff,
            WORLD3D_SUN_COLOR: night ? 0xffd6f2 : 0xfff1d6,
        }, this.app.location.view);
    },

    /** @param {string} id */
    hasMap(id) { return this.app.maps.some(m => m.id === id); },

    mapInfo() {
        const m = HS_MAPS[this.mapIndex] || HS_MAPS[0];
        return { index: this.mapIndex, total: HS_MAPS.length, id: this.mapIdAt(this.mapIndex), name: hsText(m.name), color: m.color, sky: m.sky };
    },

    levelInfo() {
        const s = this.save;
        const need = 100 + (s.level - 1) * 60;
        return { level: s.level, xp: s.xp, need, frac: Math.max(0, Math.min(1, s.xp / need)) };
    },

    // ------------------------------------------------------------------ Брейндекс и инструменты

    /** Брейндекс: все виды с состоянием «открыт» (для карточек). */
    dexList() {
        const dex = this.save.dex || {};
        return HS_BRAINROTS.map(b => {
            const eco = hsBrainrotEco(b.rarity), rec = dex[b.id];
            return { id: b.id, num: b.num, name: b.name, rarity: b.rarity, portrait: b.portrait, color: b.color, trait: b.trait, found: !!rec, count: rec ? rec.n | 0 : 0, income: eco.income, firstBonus: eco.first, catchCoins: eco.catch };
        });
    },

    /** Итог Брейндекса: открыто, всего, пассивный доход монет за раунд. */
    dexStats() {
        const list = this.dexList();
        const found = list.filter(i => i.found);
        return { found: found.length, total: list.length, income: found.reduce((a, i) => a + i.income, 0) };
    },

    /** Сведения об инструменте для экрана прокачки: уровень, цена следующего, характеристики сейчас и после. @param {'radar'|'net'} id */
    toolInfo(id) {
        const t = HS_TOOLS[id], lvl = this.save.tools[id], max = lvl >= t.max;
        const at = (L) => id === 'radar'
            ? { cooldown: t.cooldown[L - 1], duration: t.duration[L - 1], jitter: t.jitter[L - 1] }
            : { range: t.range[L - 1], cooldown: t.cooldown[L - 1], radius: t.radius[L - 1] };
        const price = max ? null : t.price[lvl];
        return { id, level: lvl, max: t.max, maxed: max, price, canAfford: !max && Shop.coins >= price, now: at(lvl), next: max ? null : at(lvl + 1) };
    },

    /** Прокачать инструмент за монеты. @param {'radar'|'net'} id */
    upgradeTool(id) {
        const i = this.toolInfo(id);
        if (i.maxed) return { ok: false, reason: 'max' };
        if (!i.canAfford) { GameFX.sfx('error'); return { ok: false, reason: 'money' }; }
        Shop.spend(i.price, { reason: 'tool', save: false });
        this.save.coins = Shop.coins;
        this.save.tools[id]++;
        this.persist();
        GameFX.sfx('buy');
        return { ok: true, level: this.save.tools[id] };
    },

    netStats() { const t = HS_TOOLS.net, L = this.save.tools.net - 1; return { range: t.range[L], cooldown: t.cooldown[L], radius: t.radius[L] }; },
    radarStats() { const t = HS_TOOLS.radar, L = this.save.tools.radar - 1; return { cooldown: t.cooldown[L], duration: t.duration[L], jitter: t.jitter[L] }; },

    // ------------------------------------------------------------------ меню

    /** Цель камеры меню — на герое сразу (даже если игра на автопаузе и кадров update нет). */
    aimMenuCamera() {
        const P = this.player, ct = this.camTarget;
        if (!P) return;
        ct.x = P.x; ct.y = P.y + 40; ct.h = 0;
        ct.frameHeight = 720; ct.frameWidth = 640;
    },

    enterMenu() {
        this.state = 'menu';
        Platform.gameplay(false);
        Input.configure({ controls: false });
        this.disposeBrainrots();
        this.resetPlayer();
        if (this.cone) this.cone.setVisible(false);
        GameUI.hud(false);
        GameUI.tags([]);
        GameUI.wait(0);
        this.removeChest();
        GameUI.menu(true);
        GameFX.music('menu');
        this.menuT = 0;
        this.aimMenuCamera();
        this.app.camera.snap();
        if (this.player.view) this.player.view.play('wave');
        this.applyLook();
        // подарок дня — в меню, не во время обучения
        Tutorial.whenIdle(() => {
            const ui = /** @type {any} */ (GameUI);
            if (this.state === 'menu' && DailyGift.shouldOffer() && typeof ui.dailyOpen === 'function') { ui.dailyOpen(); DailyGift.markOffered(); }
        });
    },

    resetPlayer() {
        const loc = this.app.location;
        const sp = loc.marker('spawn') || loc.marker('seeker') || { x: loc.width / 2, y: loc.height / 2 };
        const P = this.player;
        P.x = sp.x; P.y = sp.y; P.caught = false; P.dashT = 0; P.dashCd = 0; P.heading = Math.PI / 2;
        this.radar.cd = 0; this.radar.active = 0; this.radar.dir = null; this.radar.temp = null;
        this.netCd = 0; this.checkCd = 0; this.boost = 0;
        this.placeAll(0);
    },

    // ------------------------------------------------------------------ раунд

    async play() {
        if (this.busy) return;
        this.busy = true;
        try {
            const want = this.save.mapIndex;
            const needMap = this.mapIdAt(want) !== this.app.map.id && this.hasMap(this.mapIdAt(want));
            GameUI.menu(false);
            if (needMap) {
                this.mapIndex = want;
                await this.app.loadMap(this.mapIdAt(want), { prepare: app => this.prepareMap(app), label: this.mapInfo().name });
            } else if (this.mapIndex !== want) { this.mapIndex = want; this.applyMapLight(); }
            await this.spawnBrainrots();
            this.startRound();
        } finally { this.busy = false; }
    },

    /** Выбрать виды раунда: чем дальше карта, тем чаще редкие; ещё не пойманные виды выпадают охотнее. @param {number} n */
    pickSpecies(n) {
        const dex = this.save.dex || {}, mi = this.mapIndex;
        const pool = HS_BRAINROTS.map(b => {
            let w = hsBrainrotEco(b.rarity).weight;
            if (b.rarity !== 'common') w *= 0.5 + mi * 0.12;
            if (!dex[b.id]) w *= 1.8;
            return { b, w };
        });
        const out = [];
        while (out.length < n && pool.length) {
            let sum = 0; for (const p of pool) sum += p.w;
            let r = Math.random() * sum, k = 0;
            for (; k < pool.length - 1; k++) { r -= pool[k].w; if (r <= 0) break; }
            out.push(pool[k].b); pool.splice(k, 1);
        }
        return out;
    },

    /** Создать брейнротов раунда (виды, мимики, мозги) и дождаться загрузки их видов. */
    async spawnBrainrots() {
        this.disposeBrainrots();
        const view = this.app.location.view;
        const n = this.brainrotCount();
        const species = this.pickSpecies(n);
        const lo = typeof HS_MIMIC_BASE !== 'undefined' ? HS_MIMIC_BASE : 0.3, per = typeof HS_MIMIC_PER_MAP !== 'undefined' ? HS_MIMIC_PER_MAP : 0.04;
        const mimicCount = Math.max(1, Math.min(n - 1, Math.round(n * (lo + per * this.mapIndex))));
        // мимиками становятся виды с высоким спросом на маскировку
        const order = species.map((b, i) => ({ i, k: Math.random() * (0.25 + b.mimic) })).sort((a, b) => b.k - a.k);
        const mimicIdx = new Set(order.slice(0, mimicCount).map(o => o.i));
        const taken = new Set(), takenMimic = [];
        const tasks = [];
        const models = HsPlaces.propModels;
        species.forEach((spec, i) => {
            const st = HsPlaces.start(i);
            const a = new HsAgent('brainrot', 'br' + i, st.x, st.y);
            a.spec = spec; a.name = hsText(spec.name);
            a.view = new HsBrainrotView(view, spec.id);
            tasks.push(a.view.ready);
            const isMimic = mimicIdx.has(i);
            if (isMimic) {
                a.mimicModel = models.length ? models[Math.floor(Math.random() * models.length)] : '';
                a.mimicView = new HsMimicView(view, a.mimicModel, i * 7.3);
                tasks.push(a.mimicView.ready);
            }
            const br = new HsBrainrotBrain(a, { taken, mimicRole: isMimic, takenMimic });
            br.onDash = () => GameFX.dash(a);
            br.onMimic = () => this.onMimicStart(a);
            this.brainrots.push(a); this.brains.push(br);
        });
        await Promise.all(tasks);
        this.placeAll(0);
    },

    startRound() {
        const s = this.save;
        this.pickups.clear();
        this.spawnPickups();
        this.spawnChest();
        this.resetPlayer();
        const n = this.brainrots.length;
        this.timeMax = this.searchTime(n);
        this.round = { coins: 0, caught: 0, mimicsFound: 0, wrong: 0, checks: 0, species: [], newSpecies: [], firstBonus: 0, magnet: false, bonusTime: 0, battery: false, startedAt: performance.now(), timeAdded: false };
        for (const a of this.brainrots) { a.caught = false; a.hidden = false; a.revealed = false; }
        // усиления из запаса тратятся в начале раунда
        if (s.power.magnet > 0) { s.power.magnet--; this.round.magnet = true; }
        if (s.power.time > 0) { s.power.time--; this.round.bonusTime = 10; }
        if (s.power.battery > 0) { s.power.battery--; this.round.battery = true; }
        this.radar.cdMax = this.radarStats().cooldown * (this.round.battery ? 0.5 : 1);
        this.radar.cd = 0; this.radar.active = 0;
        this.netCdMax = this.netStats().cooldown;
        this.persist();
        this.perception.aware.clear();
        this.cone.setVisible(true);
        this.cone.setColor('#ffe08a', 0.9);
        GameUI.hud(true);
        Input.configure({ controls: true });
        Platform.gameplay(true);
        GameFX.sfx('go');
        GameFX.music('game');
        if (!s.tutorialDone && !Tutorial.active) {
            this.state = 'tutorial';
            this.time = this.timeMax + this.round.bonusTime;
            Tutorial.autoStart();
            if (!Tutorial.active) this.beginHide(this.hideTime());
        } else {
            this.beginHide(this.hideTime());
        }
        this.hudTick();   // HUD заполнен сразу, даже если игра стоит на автопаузе
    },

    beginHide(t) {
        this.state = 'hide';
        this.time = t;
        GameUI.banner('hide');
    },

    beginSeek() {
        this.state = 'seek';
        this.time = this.timeMax + this.round.bonusTime;
        GameUI.banner('hunt');
        GameFX.sfx('alarm');
        if (this.player.view) { this.player.view.play('cheer', { restart: true, loop: false }); this.oneShot = 0.8; }
    },

    // ------------------------------------------------------------------ мимики и «Проверить»

    /** Брейнрот пришёл на место и стал предметом: вид прячется, предмет появляется «пуфом». @param {HsAgent} a */
    onMimicStart(a) {
        if (a.mimicView) {
            a.mimicView.setPose(a.x, a.y, a.h, Math.random() * Math.PI * 2);
            a.mimicView.show(true);
        }
        GameFX.footDust({ x: a.x, y: a.y, h: 30 });
        a._twitchT = 4 + Math.random() * 5;
    },

    /**
     * Что можно проверить рядом с игроком (ближайшее первым): мимики и спрятавшиеся брейнроты (попадание),
     * затем настоящие предметы и укрытия (пустышка — штраф времени). Подсказку, что именно, игроку не даём.
     */
    checkCandidates() {
        const P = this.player, range = typeof HS_CHECK_RANGE !== 'undefined' ? HS_CHECK_RANGE : 150;
        if (!P) return [];
        const list = [];
        for (const a of this.brainrots) {
            if (a.caught) continue;
            const d = Math.hypot(a.x - P.x, a.y - P.y);
            if (d > range) continue;
            if (a.mimic) list.push({ kind: 'mimic', agent: a, x: a.x, y: a.y, d });
            else if (a.hidden) list.push({ kind: 'hidden', agent: a, x: a.x, y: a.y, d });
        }
        list.sort((p, q) => p.d - q.d);
        const props = [];
        for (const p of HsPlaces.props) {
            if (p.checked) continue;
            const d = Math.hypot(p.x - P.x, p.y - P.y);
            if (d <= range) props.push({ kind: 'prop', prop: p, x: p.x, y: p.y, d });
        }
        props.sort((p, q) => p.d - q.d);
        return list.concat(props);
    },

    /** «Проверить»: мимик оживает и бежит, пустой предмет отнимает время. */
    useCheck() {
        if (!this.player || (this.state !== 'seek' && this.state !== 'tutorial')) return false;
        if (this.checkCd > 0) return false;
        const t = this.checkCandidates()[0];
        if (!t) { GameFX.sfx('error'); return false; }
        this.checkCd = typeof HS_CHECK_COOLDOWN !== 'undefined' ? HS_CHECK_COOLDOWN : 0.6;
        this.round.checks++;
        const P = this.player;
        P.heading = Math.atan2(t.y - P.y, t.x - P.x);
        if (P.view) { P.view.play('wave', { restart: true, loop: false }); this.oneShot = 0.8; }
        const sp = this.app.location.view.projectToScreen(t.x, t.y, 160);
        if (t.kind === 'mimic' || t.kind === 'hidden') {
            const a = t.agent, br = this.brains[this.brainrots.indexOf(a)];
            if (t.kind === 'mimic') {
                a.mimic = false;
                if (a.mimicView) a.mimicView.show(false);
                this.round.mimicsFound++;
                GameUI.banner('mimic', a.name);
                if (sp.visible) GameUI.floatText(sp.x, sp.y, Lang.t('hs.mimic'), 'power');
            } else {
                a.hidden = false;
                if (sp.visible) GameUI.floatText(sp.x, sp.y, '!', 'power');
            }
            GameFX.reveal({ x: a.x, y: a.y, h: a.h });
            if (br) {
                if (t.kind === 'mimic') br.reveal(P);
                else { br.state = 'flee'; br.calm = 0; br.pickFlee(P); a.dash(Math.atan2(a.y - P.y, a.x - P.x)); a.dashCd = HsCfg.dashCooldown * 0.7; }
            }
            if (a.view) a.view.bump();
            if (this.state === 'tutorial') Tutorial.complete('check');
        } else {
            t.prop.checked = true;
            this.round.wrong++;
            const pen = typeof HS_CHECK_PENALTY !== 'undefined' ? HS_CHECK_PENALTY : 5;
            if (this.state === 'seek') { this.time = Math.max(1, this.time - pen); this.penaltyFlash = 1; }
            GameFX.wrong({ x: t.x, y: 0, h: 60 });
            GameUI.banner('wrong', Lang.t('hs.penalty', { n: pen }));
            if (sp.visible) GameUI.floatText(sp.x, sp.y, this.state === 'seek' ? Lang.t('hs.penalty', { n: pen }) : Lang.t('hs.empty'), 'penalty');
            if (this.state === 'tutorial') Tutorial.complete('check');
        }
        return true;
    },

    // ------------------------------------------------------------------ радар

    /** Ближайший не пойманный брейнрот (мимики тоже — радар чует всех). */
    nearestTarget() {
        const P = this.player;
        let best = null, bd = 1e9;
        for (const a of this.brainrots) {
            if (a.caught) continue;
            const d = Math.hypot(a.x - P.x, a.y - P.y);
            if (d < bd) { bd = d; best = a; }
        }
        return best ? { a: best, d: bd } : null;
    },

    useRadar() {
        const P = this.player;
        if (!P || (this.state !== 'seek' && this.state !== 'tutorial')) return false;
        const R = this.radar;
        if (R.cd > 0 || R.active > 0) { GameFX.sfx('error'); return false; }
        const st = this.radarStats();
        R.cdMax = st.cooldown * (this.round.battery ? 0.5 : 1);
        R.cd = R.cdMax; R.dur = st.duration; R.active = st.duration;
        R.jitter = (Math.random() * 2 - 1) * st.jitter * Math.PI / 180;
        const gear = hsGear(this.look().net);
        this.waves.push(new HsRadarWave(this.app.location.view.scene, gear, P.x, P.y, P.h));
        GameFX.radar({ x: P.x, y: P.y, h: P.h }, gear.wave);
        if (P.view) { P.view.play('cheer', { restart: true, loop: false }); this.oneShot = 0.8; }
        this.updateRadar(0);
        if (this.state === 'tutorial') Tutorial.complete('radar');
        return true;
    },

    /** Обновить стрелку и «горячо/холодно» по ближайшему брейнроту, пока радар показывает. */
    updateRadar(dt) {
        const R = this.radar;
        if (R.cd > 0) R.cd = Math.max(0, R.cd - dt * (this.state === 'seek' || this.state === 'tutorial' ? 1 : 0));
        if (R.active <= 0) { R.dir = null; R.temp = null; return; }
        R.active = Math.max(0, R.active - dt);
        const t = this.nearestTarget();
        if (!t) { R.dir = null; R.temp = null; return; }
        const view = this.app.location.view, P = this.player;
        const a = view.projectToScreen(t.a.x, t.a.y, 60), b = view.projectToScreen(P.x, P.y, 60);
        R.dir = Math.atan2(a.y - b.y, a.x - b.x) + R.jitter;
        R.dist = t.d;
        R.temp = t.d < HS_TOOLS.radar.hot ? 'hot' : t.d < HS_TOOLS.radar.warm ? 'warm' : 'cold';
        if (R.active <= 0) { R.dir = null; R.temp = null; }
    },

    // ------------------------------------------------------------------ сачок

    useNet() {
        const P = this.player;
        if (!P || (this.state !== 'seek' && this.state !== 'tutorial')) return false;
        if (this.netCd > 0) { GameFX.sfx('error'); return false; }
        const st = this.netStats();
        this.netCdMax = st.cooldown; this.netCd = st.cooldown;
        // мягкая помощь прицела: брейнрот близко к курсу — бросок точно в него
        let ang = P.heading, best = 0.4;
        for (const a of this.brainrots) {
            if (a.caught || a.mimic) continue;
            const dx = a.x - P.x, dy = a.y - P.y, d = Math.hypot(dx, dy);
            if (d > st.range * 1.1 || d < 40) continue;
            let da = Math.atan2(dy, dx) - P.heading; da = Math.atan2(Math.sin(da), Math.cos(da));
            if (Math.abs(da) < best && (!Nav.ready || Nav.los(P.x, P.y, a.x, a.y))) { best = Math.abs(da); ang = Math.atan2(dy, dx); }
        }
        P.heading = ang;
        const gear = hsGear(this.look().net);
        const view = new HsNetShot(this.app.location.view.scene, gear);
        const speed = typeof HS_NET_SPEED !== 'undefined' ? HS_NET_SPEED : 1100;
        this.nets.push({ x: P.x + Math.cos(ang) * 40, y: P.y + Math.sin(ang) * 40, dx: Math.cos(ang), dy: Math.sin(ang), speed, dist: 0, range: st.range, radius: st.radius, view, ang });
        if (P.view) { P.view.play('wave', { restart: true, loop: false }); this.oneShot = 0.8; }
        GameFX.sfx('whoosh');
        // проворные виды видят бросок и могут увернуться
        for (const [i, a] of this.brainrots.entries()) if (!a.caught && !a.mimic && Math.hypot(a.x - P.x, a.y - P.y) < st.range) this.brains[i].dodge(Math.cos(ang), Math.sin(ang));
        if (this.state === 'tutorial') Tutorial.complete('net');
        return true;
    },

    updateNets(dt) {
        for (const n of this.nets.slice()) {
            const step = n.speed * dt;
            n.x += n.dx * step; n.y += n.dy * step; n.dist += step;
            let hit = null;
            for (const a of this.brainrots) {
                if (a.caught || a.mimic) continue;
                if (Math.hypot(a.x - n.x, a.y - n.y) < n.radius + 28) { hit = a; break; }
            }
            const blocked = Nav.ready && Nav.blocked(n.x, n.y, 4);
            const h = Nav.ready ? Nav.height(n.x, n.y) : 0;
            n.view.update(n.x, n.y, h, dt, n.ang);
            if (hit) {
                this.removeNet(n);
                GameFX.swing({ x: hit.x, y: hit.y, h: 0 });
                this.catchAgent(hit);
            } else if (blocked || n.dist >= n.range) {
                this.removeNet(n);
                GameFX.footDust({ x: n.x, y: n.y, h: 40 });
            }
        }
    },

    removeNet(n) {
        const i = this.nets.indexOf(n);
        if (i >= 0) this.nets.splice(i, 1);
        n.view.dispose();
    },

    // ------------------------------------------------------------------ поимка

    /** Поймали брейнрота (сачок или касание): клетка, награда, запись в Брейндекс. @param {HsAgent} t */
    catchAgent(t) {
        if (t.caught) return;
        t.caught = true; t.hidden = false; t.mimic = false;
        if (t.mimicView) t.mimicView.show(false);
        if (t.view) { t.view.setAlpha(1); t.view.play('caught', { loop: false, holdLast: true }); t.view.bump(); }
        GameFX.caught({ x: t.x, y: t.y, h: t.h + 60 });
        const cage = { node: null, x: t.x, y: t.y, t: 0, agent: t };
        this.cages.push(cage);
        hsSpawnCage(this.app.location.view, t.x, t.y).then(n => { if (this.cages.indexOf(cage) >= 0) cage.node = n; else n.dispose(); });
        const spec = t.spec, eco = hsBrainrotEco(spec.rarity);
        const r = this.round, dex = this.save.dex;
        r.caught++;
        r.coins += eco.catch;
        const isNew = !dex[spec.id];
        dex[spec.id] = dex[spec.id] || { n: 0, first: Date.now() };
        dex[spec.id].n++;
        r.species.push({ id: spec.id, name: spec.name, rarity: spec.rarity, portrait: spec.portrait, isNew });
        const sp = this.app.location.view.projectToScreen(t.x, t.y, t.h + 190);
        if (isNew) {
            r.newSpecies.push(spec.id);
            r.firstBonus += eco.first; r.coins += eco.first;
            GameFX.discovery({ x: t.x, y: t.y, h: t.h });
            GameUI.banner('newspecies', t.name);
            if (sp.visible) GameUI.floatText(sp.x, sp.y - 30, '+' + eco.first, 'dex');
        } else GameUI.banner('found', t.name);
        if (sp.visible) GameUI.floatText(sp.x, sp.y, '+' + eco.catch, 'coin');
        this.persist();
        if (this.brainrots.every(b => b.caught)) setTimeout(() => { if (this.state === 'seek' || this.state === 'tutorial' || this.state === 'hide') this.endRound(true); }, 1200);
    },

    // ------------------------------------------------------------------ кадр

    update(dt) {
        if (!this.player || !this.app) return;
        if (this.pickups) this.pickups.update(dt);
        this.updateCages(dt);
        if (this.state === 'menu' || this.state === 'result') this.updateMenu(dt);
        else this.updateRound(dt);
        this.updateWaves(dt);
        this.placeAll(dt);
        this.updateTags();
    },

    updateWaves(dt) {
        for (const w of this.waves.slice()) if (!w.update(dt)) { w.dispose(); this.waves.splice(this.waves.indexOf(w), 1); }
    },

    updateMenu(dt) {
        this.menuT += dt;
        const P = this.player;
        P.step(0, 0, 0, dt);
        const ct = this.camTarget;
        ct.x = P.x; ct.y = P.y + 40; ct.h = 0;
        ct.frameHeight = 720; ct.frameWidth = 640;
        // медленное покачивание камеры в меню
        this.app.camera.azimuth = -Math.PI / 2 + Math.sin(this.menuT * 0.25) * 0.35;
        if (P.view && this.state === 'menu') P.view.play(this.previewRun ? 'run' : (Math.sin(this.menuT * 0.4) > 0.6 ? 'wave' : 'idle'));
        if (this.emotePreviewT > 0) {
            this.emotePreviewT -= dt;
            if (this.emotePreviewT <= 0) { GameCosmetics.emote(this._emoteId, { x: P.x, y: P.y, h: P.h }); this.emotePreviewT = 3; }
        }
        // примерка снаряжения: сачок летит вперёд, радар пускает волну
        if (this._gearPreviewId && this.state === 'menu') {
            this.gearPreviewT -= dt;
            if (this.gearPreviewT <= 0) {
                this.gearPreviewT = 2.6;
                const gear = hsGear(this._gearPreviewId);
                this.waves.push(new HsRadarWave(this.app.location.view.scene, gear, P.x, P.y, P.h));
                const view = new HsNetShot(this.app.location.view.scene, gear);
                this.nets.push({ x: P.x, y: P.y, dx: Math.cos(P.heading), dy: Math.sin(P.heading), speed: 520, dist: 0, range: 360, radius: 30, view, ang: P.heading, preview: true });
            }
        }
        for (const n of this.nets.slice()) {
            if (!n.preview) continue;
            n.x += n.dx * n.speed * dt; n.y += n.dy * n.speed * dt; n.dist += n.speed * dt;
            n.view.update(n.x, n.y, 0, dt, n.ang);
            if (n.dist >= n.range) this.removeNet(n);
        }
    },

    updateRound(dt) {
        const P = this.player, cam = this.app.camera;
        // камера: строго сверху-сзади, ориентация «север вверх»
        cam.azimuth += (-Math.PI / 2 - cam.azimuth) * Math.min(1, dt * 4);
        const ct = this.camTarget;
        ct.x = P.x; ct.y = P.y - 70; ct.h = 0;   // герой чуть ниже центра: сверху таймер и плашки HUD
        ct.frameHeight += (1250 - ct.frameHeight) * Math.min(1, dt * 3);
        ct.frameWidth += (1050 - ct.frameWidth) * Math.min(1, dt * 3);

        const running = this.state === 'hide' || this.state === 'seek' || this.state === 'tutorial';
        if (this.boost > 0) this.boost = Math.max(0, this.boost - dt);
        if (this.checkCd > 0) this.checkCd -= dt;
        if (this.netCd > 0) this.netCd = Math.max(0, this.netCd - dt);
        if (this.penaltyFlash > 0) this.penaltyFlash = Math.max(0, this.penaltyFlash - dt * 1.4);
        if (running && this.state !== 'tutorial') {
            this.time -= dt;
            if (this.state === 'seek' && this.time <= 10 && Math.ceil(this.time) !== Math.ceil(this.time + dt)) {
                GameFX.sfx('tick');
                if (Math.ceil(this.time) === 10) GameUI.banner('last10');
            }
            if (this.time <= 0) {
                if (this.state === 'hide') this.beginSeek();
                else if (this.state === 'seek') {
                    if (!this.round.timeAdded && this.brainrots.some(b => !b.caught)) {
                        this.time = 0;
                        this.offer('time', () => { this.time = 20; this.round.timeAdded = true; this.state = 'seek'; GameFX.sfx('go'); }, () => this.endRound(false));
                    } else this.endRound(false);
                    return;
                }
            }
        }

        GameUI.wait(this.state === 'hide' ? Math.ceil(this.time) : 0);

        // игрок: на старте ждёт, пока брейнроты разбегутся
        if (!P.caught) {
            const m = this.moveDir();
            const speed = this.state === 'hide' ? 0 : HsCfg.hunterSpeed * (this.boost > 0 ? (typeof HS_BOOST_MUL !== 'undefined' ? HS_BOOST_MUL : 1.35) : 1);
            P.step(m.x, m.y, speed * m.len, dt);
            P.anim = P.speed > 30 ? 'run' : 'idle';
        }

        // клавиши и кнопки геймпада (экранные кнопки зовут те же методы)
        if (this.state !== 'hide') {
            if (Input.pressed('net')) this.useNet();
            if (Input.pressed('radar')) this.useRadar();
            if (Input.pressed('check')) this.useCheck();
        }

        this.collect(dt);
        this.updateChest(dt);
        this.updateRadar(dt);
        this.updateNets(dt);

        // брейнроты: фонарь пугает, касание ловит
        const seekPhase = this.state === 'seek';
        if (seekPhase) this.perception.perceive(this.brainrots, dt);
        for (let i = 0; i < this.brains.length; i++) {
            const br = this.brains[i], b = br.b;
            if (b.caught) { br.update(P, false, seekPhase, dt); continue; }
            const aware = this.perception.aware.get(b) || 0;
            const dist = Math.hypot(P.x - b.x, P.y - b.y);
            const alert = b.spec ? b.spec.alert : 300;
            const threatened = seekPhase && !b.mimic && (aware > 0.6 || (!b.hidden && dist < alert && Nav.los(P.x, P.y, b.x, b.y)));
            br.update(P, threatened, seekPhase, dt);
            this.mimicHint(b, br, dist, dt);
            if (seekPhase && !b.mimic && dist < HsCfg.catchDist + 10 && !P.caught) {
                if (P.view) { P.view.play('cheer', { restart: true, loop: false }); this.oneShot = 0.8; }
                GameFX.swing({ x: b.x, y: b.y, h: 0 });
                this.catchAgent(b);
            }
        }

        // конус фонаря
        const half = HsCfg.visionHalfDeg * Math.PI / 180;
        if (this.cone) this.cone.update(P.x, P.y, P.heading, HsCfg.visionRange, half, P.h);

        // музыка: напряжённая, пока кто-то бежит от охотника рядом
        const chasing = seekPhase && this.brains.some(br => br.state === 'flee' && !br.b.caught && Math.hypot(br.b.x - P.x, br.b.y - P.y) < 700);
        if (chasing && !this._chaseMusic) { this._chaseMusic = true; GameFX.music('chase'); }
        else if (!chasing && this._chaseMusic) { this._chaseMusic = false; GameFX.music('game'); }

        this.stepFx(P, dt);
        this.hudTick();
    },

    /** Мимик иногда дрожит, когда охотник рядом — подсказка внимательному игроку; идеальные мимики — почти не дрожат. */
    mimicHint(b, br, dist, dt) {
        if (b.mimic) {
            b._twitchT = (b._twitchT == null ? 5 : b._twitchT) - dt;
            if (b._twitchT <= 0 && dist < 420) {
                b._twitchT = (3.5 + Math.random() * 5) / Math.max(0.12, b.spec ? b.spec.twitch : 0.4);
                if (b.mimicView) b.mimicView.twitch();
                GameFX.footDust({ x: b.x, y: b.y, h: 50 });
            }
        } else if (b.hidden && this.state === 'seek') {
            b._rustle = (b._rustle || 2 + Math.random() * 4) - dt;
            if (b._rustle <= 0) { b._rustle = 3 + Math.random() * 4; GameFX.footDust({ x: b.x, y: b.y, h: 70 }); }
        }
    },

    stepFx(a, dt) {
        if (!a || a.speed < 120) return;
        a._stepAcc = (a._stepAcc || 0) + a.speed * dt;
        if (a._stepAcc > 130) { a._stepAcc = 0; GameFX.footDust({ x: a.x, y: a.y, h: 0 }); }
    },

    moveDir() {
        const m = Input.move();
        const az = this.app.camera.azimuth;
        // вперёд на экране = (cos az, sin az), вправо = (−sin az, cos az)
        const fx = Math.cos(az), fy = Math.sin(az), rx = -Math.sin(az), ry = Math.cos(az);
        const x = rx * m.x + fx * m.y, y = ry * m.x + fy * m.y;
        const len = Math.min(1, Math.hypot(x, y));
        return { x: len > 0 ? x / Math.hypot(x, y) * len : 0, y: len > 0 ? y / Math.hypot(x, y) * len : 0, len };
    },

    collect(dt) {
        const P = this.player;
        if (!this.pickups || P.caught) return;
        const reach = 52;
        for (const it of this.pickups.items) {
            if (!it.alive || it.fly) continue;
            const d = Math.hypot(it.x - P.x, it.y - P.y);
            if (this.round.magnet && it.kind === 'coin' && d < 300) {
                const k = Math.min(1, dt * 7);
                it.x += (P.x - it.x) * k; it.y += (P.y - it.y) * k;
            }
            if (d < reach) {
                this.pickups.take(it);
                const pos = { x: it.x, y: it.y, h: 30 };
                const sp = this.app.location.view.projectToScreen(it.x, it.y, 60);
                if (it.kind === 'coin') {
                    this.round.coins++;
                    GameFX.coin(pos);
                    GameUI.floatText(sp.x, sp.y, '+1', 'coin');
                } else if (it.kind === 'dash') {
                    // голубая сфера: охотник быстрее несколько секунд
                    this.boost = typeof HS_BOOST_TIME !== 'undefined' ? HS_BOOST_TIME : 3.5;
                    GameFX.orb(pos, 'dash');
                    GameUI.floatText(sp.x, sp.y, '>>', 'power');
                } else {
                    // фиолетовая сфера: радар заряжен мгновенно
                    this.radar.cd = 0;
                    GameFX.orb(pos, 'ghost');
                    GameUI.floatText(sp.x, sp.y, '◎', 'power');
                }
            }
        }
    },

    updateCages(dt) {
        for (const c of this.cages) {
            c.t += dt;
            if (!c.node) continue;
            const k = Math.min(1, c.t / 0.35);
            const bounce = k < 1 ? 260 * (1 - k * k) : Math.max(0, Math.sin((c.t - 0.35) * 18) * 14 * Math.exp(-(c.t - 0.35) * 6));
            c.node.position.set(c.x, bounce, c.y);
        }
    },

    /** Сундук с монетами: одно случайное место на раунд (маркеры монет, укромные места, точки обхода). */
    spawnChest() {
        this.removeChest();
        const loc = this.app.location;
        const sp = loc.marker('spawn') || { x: 0, y: 0 };
        const cand = loc.markers('hide-spot').concat(loc.markers('coin'), loc.markers('patrol'))
            .filter(m => Math.hypot(m.x - sp.x, m.y - sp.y) > 500 && !HsPlaces.hideAt(m.x, m.y));
        if (!cand.length) return;
        const m = cand[Math.floor(Math.random() * cand.length)];
        // монету под сундуком убрать, чтобы не мешала
        if (this.pickups) for (const it of this.pickups.items) if (it.alive && Math.hypot(it.x - m.x, it.y - m.y) < 40) this.pickups.take(it);
        this.chest = new HsChest(loc.view, m.x, m.y, Math.random() * Math.PI * 2);
        const c = this.chest;
        this.chestGlow = GameFX.skinAura(() => new BABYLON.Vector3(c.x, 50, c.y), 'legendary');
    },

    removeChest() {
        if (this.chestGlow) { this.chestGlow.stop(); this.chestGlow = null; }
        if (this.chest) { this.chest.dispose(); this.chest = null; }
    },

    updateChest(dt) {
        const c = this.chest;
        if (!c) return;
        c.update(dt);
        if (c.opened) {
            // открытый сундук через 1.8 с исчезает с облачком
            c.openT = (c.openT || 0) + dt;
            if (c.openT > 1.8 && c.vanish < 0) { c.vanish = 0; GameFX.decoy({ x: c.x, y: c.y, h: 40 }); }
            if (c.gone) this.removeChest();
            return;
        }
        const P = this.player;
        if (c.opened || P.caught || this.state === 'hide') return;
        if (Math.hypot(P.x - c.x, P.y - c.y) > 95) return;
        c.open();
        if (this.chestGlow) { this.chestGlow.stop(); this.chestGlow = null; }
        GameFX.orb({ x: c.x, y: c.y, h: 60 }, 'dash');
        GameFX.coin({ x: c.x, y: c.y, h: 70 });
        GameFX.sfx('buy');
        // монеты высыпаются вокруг и ложатся на пол — их можно собрать
        const n = 8 + Math.floor(Math.random() * 5);
        for (let i = 0; i < n; i++) {
            const a = (i / n) * Math.PI * 2 + Math.random() * 0.5, r = 70 + Math.random() * 110;
            let tx = c.x + Math.cos(a) * r, ty = c.y + Math.sin(a) * r;
            if (Nav.ready && Nav.blocked(tx, ty, 14)) { tx = c.x + Math.cos(a) * 45; ty = c.y + Math.sin(a) * 45; }
            setTimeout(() => {
                if (!this.pickups || this.state === 'menu') return;
                this.pickups.spawn('coin', c.x, c.y).then(it => { it.fly = { t: 0, dur: 0.55 + Math.random() * 0.2, x0: c.x, y0: c.y, x1: tx, y1: ty, h0: 40, arc: 120 + Math.random() * 60 }; });
            }, 120 + i * 45);
        }
        const sp = this.app.location.view.projectToScreen(c.x, c.y, 160);
        if (sp.visible) GameUI.floatText(sp.x, sp.y, Lang.t('hs.chest'), 'coin');
    },

    /** Позы видов по логике. */
    placeAll(dt) {
        const P = this.player;
        if (P && P.view) {
            P.view.setPose(P.x, P.y, P.h, P.heading, P.speed, dt);
            if (P.view.play && this.state !== 'menu' && this.state !== 'result') {
                // разовые клипы (бросок, проверка) доигрываются сами; бег и покой — по скорости
                if (this.oneShot > 0) this.oneShot -= dt;
                if (this.oneShot <= 0 || P.speed > 60) P.view.play(P.anim || 'idle');
            }
        }
        for (const a of this.brainrots) {
            const v = a.view;
            if (!v) continue;
            v.setPose(a.x, a.y, a.h, a.heading, a.speed, dt);
            if (v.play) v.play(a.anim || 'idle');
            let alpha = 1;
            if (a.mimic && !a.caught) alpha = 0;
            else if (a.hidden && !a.caught) alpha = (this.perception && (this.perception.aware.get(a) || 0) > 0.5) ? 0.6 : 0;
            v.setAlpha(alpha);
            if (a.mimicView) {
                a.mimicView.update(dt);
                if (a.mimic && !a.mimicView.visible) a.mimicView.show(true);
            }
        }
        if (this.ring && P) {
            this.ring.update(P.x, P.y, P.h, dt);
            this.ring.setVisible(!this.auraFx && !P.caught);
            if (this.auraFx && this.auraFx.update) this.auraFx.update(dt);
        }
    },

    updateTags() {
        if (this.state === 'menu' || !this.app) return;
        const view = this.app.location.view;
        const list = [];
        for (const b of this.brainrots) {
            if (b.mimic && !b.caught) continue;
            const aware = this.perception ? (this.perception.aware.get(b) || 0) : 0;
            if (b.hidden && !b.caught && aware < 0.5) continue;
            const p = view.projectToScreen(b.x, b.y, b.h + 185);
            if (!p.visible) continue;
            const br = this.brains[this.brainrots.indexOf(b)];
            list.push({ id: b.id, x: p.x, y: p.y, text: b.name, kind: 'brainrot', rarity: b.spec ? b.spec.rarity : 'common', state: b.caught ? 'caught' : (br && br.state === 'flee') || aware > 0.6 ? 'fleeing' : 'normal' });
        }
        GameUI.tags(list);
    },

    hudTick() {
        const P = this.player, R = this.radar;
        const lvl = this.levelInfo();
        const near = this.state === 'seek' || this.state === 'tutorial' ? this.checkCandidates().length > 0 : false;
        const left = this.brainrots.filter(a => !a.caught).length;
        GameUI.hudUpdate({
            phase: this.state === 'seek' ? 'seek' : 'hide',
            time: Math.max(0, this.time),
            timeMax: this.timeMax,
            coins: Shop.coins + this.round.coins,
            gems: this.save.gems,
            alive: left,
            total: this.brainrots.length,
            caught: this.round.caught,
            level: lvl.level, xpFrac: lvl.frac,
            mapIndex: this.mapIndex, mapName: this.mapInfo().name,
            radar: { cd: R.cdMax > 0 ? R.cd / R.cdMax : 0, cdLeft: R.cd, on: R.active > 0, t: R.dur > 0 ? R.active / R.dur : 0, dir: R.dir, temp: R.temp, dist: R.dist },
            net: { cd: this.netCdMax > 0 ? this.netCd / this.netCdMax : 0, cdLeft: this.netCd },
            check: { show: near, cd: Math.max(0, this.checkCd) },
            boost: this.boost > 0 ? this.boost / (typeof HS_BOOST_TIME !== 'undefined' ? HS_BOOST_TIME : 3.5) : 0,
            penaltyFlash: this.penaltyFlash,
            adLabel: this.ads.label(),
            tutorial: this.state === 'tutorial',
            hunter: { x: P.x, y: P.y },
        });
    },

    // ------------------------------------------------------------------ итоги

    endRound(win) {
        if (this.state === 'result') return;
        this.state = 'result';
        const s = this.save, r = this.round;
        Platform.gameplay(false);
        if (typeof Tutorial !== 'undefined' && Tutorial.active) Tutorial.finish('abort');
        Input.configure({ controls: false });
        if (this.cone) this.cone.setVisible(false);
        GameUI.tags([]);
        GameUI.wait(0);
        this._chaseMusic = false;
        for (const n of this.nets.slice()) this.removeNet(n);
        const winBonus = win ? (typeof HS_WIN_COINS !== 'undefined' ? HS_WIN_COINS : 60) + this.mapIndex * 10 : 0;
        const dexIncome = this.dexStats().income;
        const coins = r.coins + winBonus + dexIncome;
        const gems = win ? 3 : 0;
        const xp = (win ? 45 + this.mapIndex * 5 : 15) + r.caught * 4;
        Shop.addCoins(coins, { reason: 'round', save: false });
        s.coins = Shop.coins;
        s.gems += gems; s.xp += xp;
        this.lastReward = { coins, doubled: false };
        s.rounds = (s.rounds || 0) + 1;
        // очки рекордов: всё заработанное за раунды, в таблицу — после каждого раунда
        s.score = (s.score || 0) + coins + (win ? 50 : 0) + r.caught * 15;
        Platform.submitScore(s.score);
        let levelUp = false;
        for (let need = 100 + (s.level - 1) * 60; s.xp >= need; need = 100 + (s.level - 1) * 60) { s.xp -= need; s.level++; levelUp = true; s.gems += 5; }
        let unlocked = false;
        if (win) {
            s.wins = (s.wins || 0) + 1;
            if (s.mapIndex === this.mapIndex && s.mapIndex < HS_MAPS.length - 1) { s.mapIndex++; unlocked = true; }
        }
        this.persist();
        Platform.ads.roundEnded(win);
        if (win) { GameFX.win(); GameCosmetics.emote(this.look().emote, { x: this.player.x, y: this.player.y, h: this.player.h }); } else GameFX.lose();
        GameFX.music(null);
        const P = this.player;
        if (P.view) P.view.play(win ? 'cheer' : 'idle');
        const frac = Math.max(0, this.time) / Math.max(1, this.timeMax + r.bonusTime);
        const stars = win ? (frac >= 0.5 ? 3 : frac >= 0.2 ? 2 : 1) : 0;
        const total = this.brainrots.length;
        setTimeout(() => {
            GameUI.hud(false);
            GameUI.result({
                win, coins, gems, xp, levelUp, stars,
                caught: r.caught, total, botsCaught: r.caught,
                mapName: this.mapInfo().name, mapIndex: this.mapIndex,
                time: (performance.now() - r.startedAt) / 1000,
                unlocked, nextAvailable: true,
                level: s.level, xpFrac: this.levelInfo().frac,
                species: r.species, newSpecies: r.newSpecies.length, firstBonus: r.firstBonus, dexIncome, winBonus,
                mimicsFound: r.mimicsFound, wrongChecks: r.wrong, dex: this.dexStats(),
            });
        }, win ? 600 : 900);
    },

    next() { Platform.ads.next(() => this.play()); },

    retry() { Platform.ads.next(() => this.play()); },

    toMenu() {
        Platform.ads.next(async () => {
            const want = this.save.mapIndex;
            if (this.mapIndex !== want && !this.busy && this.hasMap(this.mapIdAt(want))) {
                this.busy = true;
                try {
                    this.mapIndex = want;
                    await this.app.loadMap(this.mapIdAt(want), { prepare: app => this.prepareMap(app), label: this.mapInfo().name });
                } finally { this.busy = false; }
            }
            this.enterMenu();
        });
    },

    // ------------------------------------------------------------------ магазин

    shop: {
        /** @param {string} kind @param {string} id */
        owns(kind, id) { return Shop.owns(id); },
        /** @param {string} kind */
        equipped(kind) { return Game.look()[kind]; },
        canAfford(price) {
            if (!price) return true;
            if (price.gems) return Game.save.gems >= price.gems;
            return Shop.coins >= (price.coins || 0);
        },
        pay(price) {
            if (price.gems) Game.save.gems -= price.gems; else Shop.spend(price.coins || 0, { reason: 'powerup', save: false });
        },
        /** @param {string} kind @param {string} id */
        buy(kind, id) { const r = Shop.buy(id); GameFX.sfx(r.ok ? 'buy' : 'error'); return r; },
        /** @param {string} kind @param {string} id */
        equip(kind, id) { const r = Shop.equip(id); if (r.ok) GameFX.sfx('equip'); return r; },
        buyPowerup(id) {
            const p = HS_POWERUPS.find(i => i.id === id);
            if (!p) return { ok: false, reason: 'unknown' };
            if (!this.canAfford(p.price)) { GameFX.sfx('error'); return { ok: false, reason: 'money' }; }
            this.pay(p.price);
            Game.save.power[id] = (Game.save.power[id] || 0) + (p.pack || 1);
            Game.persist();
            GameFX.sfx('buy');
            return { ok: true };
        },
    },

    // ------------------------------------------------------------------ отладка (скриншоты, проверка)

    debug: {
        /** Мимики раунда (для проверки). */
        mimics() { return Game.brainrots.filter(a => a.mimic).map(a => ({ id: a.id, x: Math.round(a.x), y: Math.round(a.y), species: a.spec && a.spec.id })); },
        /** Телепорт игрока на расстояние d от брейнрота i. */
        near(i, d) { const a = Game.brainrots[i], P = Game.player; if (!a) return false; P.x = a.x - (d == null ? 90 : d); P.y = a.y; return true; },
        /** Пропустить обучение и дождаться поиска. */
        skipTutorial() { if (Tutorial.active) Tutorial.skip(); },
        /** Сводка раунда. */
        info() { return { state: Game.state, time: Math.round(Game.time), left: Game.brainrots.filter(a => !a.caught).length, total: Game.brainrots.length, mimics: Game.brainrots.filter(a => a.mimic).length, map: Game.mapInfo().name }; },
        /** Поймать всех сразу. */
        catchAll() { for (const a of Game.brainrots.slice()) Game.catchAgent(a); },
        /** Телепорт на точку. */
        tp(x, y) { Game.player.x = x; Game.player.y = y; },
    },
};

// Название площадки (GAME_TITLES в Constants.js) важнее строки 'title' игры: Lang.js ставит его раньше этого файла.
(() => {
    const t = typeof GAME_TITLES !== 'undefined' && GAME_TITLES ? /** @type {Record<string, any>} */ (GAME_TITLES)[String(GAME_PLATFORM)] : null;
    if (typeof t === 'string' && t) for (const c of Object.keys(LANG_STRINGS)) /** @type {Record<string, Record<string, string>>} */ (LANG_STRINGS)[c].title = t;
})();
