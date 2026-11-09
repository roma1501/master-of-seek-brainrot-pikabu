// GameAI.js — логика персонажей «Master of Seek Brainrot»: движение по Nav, восприятие фонаря охотника
// (конус + видимость + укрытия) и мозг брейнрота-прячущегося: бежит в укрытие или к месту маскировки,
// становится предметом (мимик), убегает от охотника, делает рывки, уворачивается от сачка.
// Чистая логика: Babylon не спрашивается (инвариант 4). Числа — HS_* в Constants.js, виды — GameBrainrots.js.

const HsCfg = {
    get hiderSpeed() { return typeof HS_HIDER_SPEED !== 'undefined' ? HS_HIDER_SPEED : 300; },
    get hunterSpeed() { return typeof HS_HUNTER_SPEED !== 'undefined' ? HS_HUNTER_SPEED : 370; },
    get visionRange() { return typeof HS_VISION_RANGE !== 'undefined' ? HS_VISION_RANGE : 620; },
    get visionHalfDeg() { return typeof HS_VISION_HALF_DEG !== 'undefined' ? HS_VISION_HALF_DEG : 34; },
    get senseRadius() { return typeof HS_SENSE_RADIUS !== 'undefined' ? HS_SENSE_RADIUS : 110; },
    get hideReveal() { return typeof HS_HIDE_REVEAL !== 'undefined' ? HS_HIDE_REVEAL : 55; },
    get spotTime() { return typeof HS_SPOT_TIME !== 'undefined' ? HS_SPOT_TIME : 0.45; },
    get catchDist() { return typeof HS_CATCH_DIST !== 'undefined' ? HS_CATCH_DIST : 70; },
    get dashSpeed() { return typeof HS_DASH_SPEED !== 'undefined' ? HS_DASH_SPEED : 980; },
    get dashTime() { return typeof HS_DASH_TIME !== 'undefined' ? HS_DASH_TIME : 0.28; },
    get dashCooldown() { return typeof HS_DASH_COOLDOWN !== 'undefined' ? HS_DASH_COOLDOWN : 6; },
};

const HS_RADIUS = 26;

/** Логическое тело персонажа: игрок-охотник или брейнрот. */
class HsAgent {
    /** @param {'hunter'|'brainrot'} role @param {string} id */
    constructor(role, id, x, y) {
        this.role = role;
        this.id = id;
        this.x = x; this.y = y; this.h = 0;
        this.heading = 0;        // курс модели (сглаженный)
        this.vx = 0; this.vy = 0;
        this.speed = 0;
        this.radius = HS_RADIUS;
        this.caught = false;
        this.hidden = false;     // стоит в укрытии
        this.mimic = false;      // стоит предметом (до «Проверить»)
        this.revealed = false;   // мимик разоблачён
        this.mimicModel = '';    // модель предмета-маскировки
        /** @type {any} */ this.hideRec = null;
        this.dashT = 0;          // осталось рывка, с
        this.dashCd = 0;         // перезарядка рывка, с
        this.dashDir = 0;
        /** @type {{x:number,y:number}[] | null} */ this.path = null;
        this.pathT = 0;
        this.stuck = 0;
        this.name = '';
        this.isPlayer = false;
        this.anim = 'idle';
        this.view = null;
        this.mimicView = null;
        /** @type {any} */ this.spec = null;   // вид брейнрота (GameBrainrots.js)
        this.seenBy = 0;         // 0..1: насколько охотник его замечает
        this.betrayed = false;   // охотник видел, как он залез в укрытие — укрытие его не спасёт
        this._wasHidden = false;
        this._stepAcc = 0;
        this._rustle = 0;
        this._twitchT = 5;       // с до следующей дрожи мимика
        /** @type {{x:number,y:number} | null} */ this._goal = null;
    }

    /** Шаг со скольжением по стенам; направление (dx, dy) — единичный вектор или 0. */
    step(dx, dy, speed, dt) {
        let vx = dx * speed, vy = dy * speed;
        if (this.dashT > 0) {
            this.dashT -= dt;
            vx = Math.cos(this.dashDir) * HsCfg.dashSpeed; vy = Math.sin(this.dashDir) * HsCfg.dashSpeed;
        }
        const ox = this.x, oy = this.y;
        if (vx || vy) {
            const p = Nav.ready ? Nav.move(this.x, this.y, vx * dt, vy * dt, this.radius) : { x: this.x + vx * dt, y: this.y + vy * dt };
            this.x = p.x; this.y = p.y;
        }
        const mx = this.x - ox, my = this.y - oy;
        this.speed = dt > 0 ? Math.hypot(mx, my) / dt : 0;
        this.vx = dt > 0 ? mx / dt : 0; this.vy = dt > 0 ? my / dt : 0;
        if (this.speed > 20) {
            const want = Math.atan2(my, mx);
            let d = want - this.heading;
            d = Math.atan2(Math.sin(d), Math.cos(d));
            this.heading += d * Math.min(1, dt * 14);
        }
        this.h = Nav.ready ? Nav.height(this.x, this.y) : 0;
        if (this.dashCd > 0) this.dashCd = Math.max(0, this.dashCd - dt);
    }

    dash(dir) {
        this.dashT = HsCfg.dashTime;
        this.dashDir = dir;
    }

    /** Идти к точке по пути Nav (пересчёт пути по таймеру). Возвращает расстояние до цели. */
    goTo(tx, ty, speed, dt, repath) {
        this.pathT -= dt;
        if (!this.path || this.pathT <= 0 || this._goal == null || Math.hypot(this._goal.x - tx, this._goal.y - ty) > 60) {
            this.path = Nav.ready ? Nav.path(this.x, this.y, tx, ty, this.radius, { partial: true }) : [{ x: tx, y: ty }];
            this._goal = { x: tx, y: ty };
            this.pathT = repath || 0.6;
        }
        const d = Math.hypot(tx - this.x, ty - this.y);
        let wp = this.path && this.path[0];
        while (wp && Math.hypot(wp.x - this.x, wp.y - this.y) < 18 && this.path.length > 1) { this.path.shift(); wp = this.path[0]; }
        if (!wp) wp = { x: tx, y: ty };
        const dx = wp.x - this.x, dy = wp.y - this.y, l = Math.hypot(dx, dy);
        if (l < 6) { this.step(0, 0, 0, dt); return d; }
        const sp = Math.min(speed, l / Math.max(dt, 1e-3));
        const bx = this.x, by = this.y;
        this.step(dx / l, dy / l, sp, dt);
        // застряли — новый путь
        if (Math.hypot(this.x - bx, this.y - by) < sp * dt * 0.2) { this.stuck += dt; if (this.stuck > 0.5) { this.pathT = 0; this.stuck = 0; } } else this.stuck = 0;
        return d;
    }
}

/**
 * Места карты: укрытия (hide), реальные предметы (prop — их можно проверить зря), точки пряток, старты брейнротов.
 * Предметы и укрытия берутся из объектов карты по имени модели: *-prop1…3.glb и *-hide.glb.
 */
const HsPlaces = {
    hides: /** @type {{x:number,y:number,rec:any}[]} */ ([]),
    /** Реальные предметы карты — кандидаты на «Проверить». @type {{x:number,y:number,model:string,kind:string,rec:any,checked:boolean}[]} */
    props: [],
    /** Модели предметов карты — из них выбирается маскировка мимика. @type {string[]} */
    propModels: [],
    spots: /** @type {{x:number,y:number}[]} */ ([]),
    patrol: /** @type {{x:number,y:number}[]} */ ([]),
    /** @type {{x:number,y:number}[]} */ starts: [],
    arena: { x0: 500, y0: 500, x1: 3300, y1: 2300 },

    build(location) {
        this.hides = [];
        this.props = [];
        const models = new Set();
        for (const def of location.map.objects) {
            if (!def.model) continue;
            if (GameKit.isHide(def)) { this.hides.push({ x: def.x, y: def.y, rec: def }); this.props.push({ x: def.x, y: def.y, model: def.model, kind: 'hide', rec: def, checked: false }); }
            else if (GameKit.isProp(def)) { this.props.push({ x: def.x, y: def.y, model: def.model, kind: 'prop', rec: def, checked: false }); models.add(def.model); }
        }
        this.propModels = Array.from(models);
        this.spots = location.markers('hide-spot').map(m => ({ x: m.x, y: m.y }));
        this.patrol = location.markers('patrol').map(m => ({ x: m.x, y: m.y }));
        if (!this.patrol.length) for (let i = 0; i < 10; i++) this.patrol.push(this.randomFree());
        // старты брейнротов: hider-1…8 (арт-агент), иначе старые bot-*, иначе случайные клетки
        let st = location.markers('hider');
        if (!st.length) st = location.markers('bot');
        this.starts = st.map(m => ({ x: m.x, y: m.y }));
        const size = location.map.width ? { w: location.map.width, h: location.map.height } : null;
        if (size && size.w && size.h) this.arena = { x0: 500, y0: 500, x1: size.w - 500, y1: size.h - 500 };
    },

    randomFree() {
        const a = this.arena;
        for (let k = 0; k < 40; k++) {
            const x = a.x0 + 100 + Math.random() * (a.x1 - a.x0 - 200), y = a.y0 + 100 + Math.random() * (a.y1 - a.y0 - 200);
            if (!Nav.ready || !Nav.blocked(x, y, HS_RADIUS + 6)) return { x, y };
        }
        return { x: (a.x0 + a.x1) / 2, y: (a.y0 + a.y1) / 2 };
    },

    /** Старт брейнрота номер i (0..): маркер hider-N, старый bot-N, иначе случайная свободная клетка. */
    start(i) {
        const m = this.starts[i % Math.max(1, this.starts.length)];
        if (m && i < this.starts.length) return { x: m.x, y: m.y };
        return this.randomFree();
    },

    /**
     * Место маскировки мимика: рядом с настоящим предметом карты (чтобы затеряться среди них), не вплотную к
     * стенам и подальше от охотника (avoid) и других мимиков (taken).
     * @param {{x:number,y:number} | null} avoid @param {{x:number,y:number}[]} taken
     */
    mimicSpot(avoid, taken) {
        for (let k = 0; k < 40; k++) {
            let x, y;
            if (this.props.length && Math.random() < 0.75) {
                const p = this.props[Math.floor(Math.random() * this.props.length)];
                const a = Math.random() * Math.PI * 2, r = 110 + Math.random() * 90;
                x = p.x + Math.cos(a) * r; y = p.y + Math.sin(a) * r;
            } else { const f = this.randomFree(); x = f.x; y = f.y; }
            if (Nav.ready && Nav.blocked(x, y, 60)) continue;
            if (avoid && Math.hypot(x - avoid.x, y - avoid.y) < 650) continue;
            if (taken && taken.some(t => Math.hypot(t.x - x, t.y - y) < 260)) continue;
            return { x, y };
        }
        return this.randomFree();
    },

    /** Укрытие, в котором стоит точка (или null). */
    hideAt(x, y) {
        for (const h of this.hides) if (Math.hypot(h.x - x, h.y - y) < 62) return h;
        return null;
    },
};

/** Видит ли охотник цель сейчас: 0 — нет, иначе сила (быстрее вблизи). Мимик-предмет не виден как цель. */
function hsSees(seeker, target, range, half) {
    if (target.caught || target.mimic) return 0;
    const dx = target.x - seeker.x, dy = target.y - seeker.y, d = Math.hypot(dx, dy);
    // в укрытии не видно — только вплотную; если охотник видел, как туда залезли, укрытие не спасает
    if (target.hidden && !target.betrayed) return d < HsCfg.hideReveal ? 3 : 0;
    if (d < HsCfg.senseRadius) return 3;
    if (d > range) return 0;
    let a = Math.atan2(dy, dx) - seeker.heading;
    a = Math.atan2(Math.sin(a), Math.cos(a));
    if (Math.abs(a) > half) return 0;
    if (Nav.ready && !Nav.los(seeker.x, seeker.y, target.x, target.y)) return 0;
    return 1 + (1 - d / range) * 2.5;
}

/** Восприятие охотника: копит «замеченность» каждого брейнрота фонарём (конус обзора игрока). */
class HsPerception {
    /** @param {HsAgent} body */
    constructor(body) {
        this.b = body;
        /** @type {Map<HsAgent, number>} */ this.aware = new Map();
    }

    /** @param {HsAgent[]} targets @param {number} dt */
    perceive(targets, dt) {
        const range = HsCfg.visionRange, half = HsCfg.visionHalfDeg * Math.PI / 180;
        for (const t of targets) {
            if (t.caught) { this.aware.delete(t); continue; }
            if (t.hidden && !t._wasHidden) t.betrayed = (this.aware.get(t) || 0) > 0.5;
            if (!t.hidden) t.betrayed = false;
            t._wasHidden = t.hidden;
            const s = hsSees(this.b, t, range, half);
            let a = this.aware.get(t) || 0;
            a = s > 0 ? a + dt * s / HsCfg.spotTime : Math.max(0, a - dt * 0.6);
            this.aware.set(t, a);
            t.seenBy = Math.min(1, a);
        }
    }
}

/**
 * Мозг брейнрота-прячущегося. Свойства вида (agent.spec): speed, alert, dash, hide, mimic, twitch, dodge.
 * Состояния: go (идёт к укрытию / месту маскировки), mimic (стоит предметом), flee (убегает от охотника).
 * Маскировку включает сам, придя на место, если мозгу назначена роль мимика (mimicRole).
 */
class HsBrainrotBrain {
    /** @param {HsAgent} body @param {{ taken: Set<any>, mimicRole?: boolean, takenMimic?: {x:number,y:number}[] }} opts */
    constructor(body, opts) {
        this.b = body;
        this.spec = body.spec || { speed: 1, alert: 300, dash: 0.2, hide: 0.6, mimic: 0, twitch: 0.4 };
        this.taken = opts.taken;
        this.takenMimic = opts.takenMimic || [];
        this.mimicRole = !!opts.mimicRole;
        this.state = 'go';
        this.goal = null;
        this.fleeGoal = null;
        this.fleeT = 0;
        this.calm = 0;
        this.idleT = Math.random() * 3;
        this.twitchT = 4 + Math.random() * 5;
        /** @type {(() => void) | null} */ this.onDash = null;
        /** @type {(() => void) | null} */ this.onMimic = null;
    }

    /** Выбрать укрытие подальше от охотника и не занятое; мимику — место маскировки. */
    pickHide(hunter) {
        const b = this.b;
        if (this.mimicRole) {
            const m = HsPlaces.mimicSpot(hunter, this.takenMimic);
            this.takenMimic.push(m);
            this.goal = { x: m.x, y: m.y, key: m, mimic: true };
            return;
        }
        let best = null, bestS = -1e9;
        const hideW = this.spec.hide;
        const cand = HsPlaces.hides.map(h => ({ x: h.x, y: h.y, hide: h })).concat(HsPlaces.spots.map(s => ({ x: s.x, y: s.y, hide: null })));
        for (const c of cand) {
            if (this.taken.has(c.hide || c)) continue;
            const ds = hunter ? Math.hypot(c.x - hunter.x, c.y - hunter.y) : 800;
            const dm = Math.hypot(c.x - b.x, c.y - b.y);
            const s = Math.min(ds, 1600) * 0.8 - dm * 0.35 + (c.hide ? 120 + 380 * hideW : 0) + Math.random() * 500;
            if (s > bestS) { bestS = s; best = c; }
        }
        if (this.goal && this.goal.key) this.taken.delete(this.goal.key);
        if (!best) best = Object.assign(HsPlaces.randomFree(), { hide: null });
        const key = best.hide || best;
        this.taken.add(key);
        this.goal = { x: best.x, y: best.y, key };
    }

    pickFlee(hunter) {
        const b = this.b;
        let best = null, bestS = -1e9;
        const cand = HsPlaces.patrol.concat(HsPlaces.spots, HsPlaces.hides);
        for (const c of cand) {
            const ds = Math.hypot(c.x - hunter.x, c.y - hunter.y), dm = Math.hypot(c.x - b.x, c.y - b.y);
            if (dm < 120) continue;
            // точка за спиной у охотника — плохо: проверяем, что идём «от» него
            const away = ((c.x - b.x) * (b.x - hunter.x) + (c.y - b.y) * (b.y - hunter.y)) / Math.max(1, dm * Math.hypot(b.x - hunter.x, b.y - hunter.y));
            const s = ds - dm * 0.25 + away * 500 + Math.random() * 120;
            if (s > bestS) { bestS = s; best = c; }
        }
        this.fleeGoal = best ? { x: best.x, y: best.y } : HsPlaces.randomFree();
        this.fleeT = 0.7;
    }

    /** Разоблачение мимика («Проверить»): предмет оживает и бросается наутёк рывком. */
    reveal(hunter) {
        const b = this.b;
        b.mimic = false; b.revealed = true; b.hidden = false;
        this.mimicRole = false;
        this.state = 'flee';
        this.calm = 0;
        this.pickFlee(hunter);
        b.dash(Math.atan2(b.y - hunter.y, b.x - hunter.x));
        b.dashCd = HsCfg.dashCooldown * 0.7;
    }

    /** Охотник бросил сачок в сторону брейнрота: проворный виды уворачиваются рывком вбок. */
    dodge(dirX, dirY) {
        const b = this.b, p = this.spec.dodge || 0;
        if (!p || b.caught || b.mimic || b.dashCd > 0 || Math.random() > p) return false;
        const side = Math.random() < 0.5 ? 1 : -1;
        b.dash(Math.atan2(dirY, dirX) + side * Math.PI / 2);
        b.dashCd = HsCfg.dashCooldown * 0.8;
        if (this.onDash) this.onDash();
        return true;
    }

    /** @param {HsAgent} hunter @param {boolean} threatened @param {boolean} seekPhase @param {number} dt */
    update(hunter, threatened, seekPhase, dt) {
        const b = this.b;
        if (b.caught) { b.step(0, 0, 0, dt); b.anim = 'caught'; return; }
        if (b.mimic) {
            // стоит предметом; выдаёт себя дрожью реже у «идеальных» мимиков (spec.twitch) — Game показывает её рядом с игроком
            b.step(0, 0, 0, dt); b.anim = 'idle';
            this.twitchT -= dt;
            return;
        }
        const speed = HsCfg.hiderSpeed * this.spec.speed;
        if (threatened) {
            if (this.state !== 'flee') { this.state = 'flee'; this.pickFlee(hunter); b.hidden = false; }
            this.calm = 0;
        } else if (this.state === 'flee') {
            this.calm += dt;
            if (this.calm > 1.6 && Math.hypot(hunter.x - b.x, hunter.y - b.y) > 420) { this.state = 'go'; this.pickHide(hunter); }
        }
        if (this.state === 'flee') {
            this.fleeT -= dt;
            if (this.fleeT <= 0 || !this.fleeGoal || Math.hypot(this.fleeGoal.x - b.x, this.fleeGoal.y - b.y) < 60) this.pickFlee(hunter);
            const dS = Math.hypot(hunter.x - b.x, hunter.y - b.y);
            if (dS < 230 && b.dashCd <= 0 && Math.random() < dt * (0.4 + this.spec.dash * 4)) {
                b.dash(Math.atan2(b.y - hunter.y, b.x - hunter.x) * 0.5 + Math.atan2(this.fleeGoal.y - b.y, this.fleeGoal.x - b.x) * 0.5);
                b.dashCd = HsCfg.dashCooldown * (1.6 - this.spec.dash * 0.7);
                if (this.onDash) this.onDash();
            }
            b.goTo(this.fleeGoal.x, this.fleeGoal.y, speed, dt, 0.35);
            b.anim = b.dashT > 0 ? 'dash' : 'run';
            b.hidden = false;
            return;
        }
        if (!this.goal) this.pickHide(hunter);
        const d = b.goTo(this.goal.x, this.goal.y, seekPhase ? speed * 0.55 : speed, dt, 0.7);
        if (d < 22) {
            b.step(0, 0, 0, dt);
            if (this.goal.mimic) {
                // пришёл на место маскировки — становится предметом
                b.mimic = true; b.hidden = false; b.hideRec = null;
                if (this.onMimic) this.onMimic();
                return;
            }
            const h = HsPlaces.hideAt(b.x, b.y);
            b.hidden = !!h; b.hideRec = h;
            b.anim = b.hidden ? 'sneak' : 'idle';
            // во время поиска иногда перепрятаться, пока охотник далеко (на открытом месте — чаще)
            this.idleT -= dt;
            if (seekPhase && this.idleT <= 0) {
                this.idleT = b.hidden ? 18 + Math.random() * 12 : 8 + Math.random() * 8;
                if (Math.hypot(hunter.x - b.x, hunter.y - b.y) > (b.hidden ? 950 : 700)) this.pickHide(hunter);
            }
        } else {
            b.hidden = !!HsPlaces.hideAt(b.x, b.y);
            b.anim = seekPhase ? 'sneak' : 'run';
        }
    }
}
