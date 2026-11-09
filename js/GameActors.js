// GameActors.js — вид персонажей (охотник-игрок на риге R6 из Blender, брейнроты, мимики-предметы),
// сачок и волна радара, конус фонаря охотника, кольцо под игроком, монеты и сферы-бонусы.
// Логика (позиции, скорости, решения) — в GameAI.js и Game.js; здесь только представление.

const HS_HIDER_CLIPS = 'assets/models/chars/hider_clips.glb';
const HS_COIN_MODEL = 'assets/models/fx/coin.glb';
const HS_ORB_DASH_MODEL = 'assets/models/fx/orb-dash.glb';
const HS_ORB_GHOST_MODEL = 'assets/models/fx/orb-ghost.glb';
const HS_CAGE_MODEL = 'assets/models/fx/cage.glb';
const HS_CHEST_MODEL = 'assets/models/fx/chest.glb';
const HS_CHEST_FALLBACK = 'assets/models/fx/chest.glb';

/** Однократные предупреждения о недостающих ассетах (чтобы консоль не забивалась). */
const hsWarned = { brainrot: false };

/** @param {any} root @param {number} a */
function hsSetAlpha(root, a) {
    if (!root) return;
    const list = root.getChildMeshes ? root.getChildMeshes(false) : [];
    for (const m of list) m.visibility = a;
    root.setEnabled(a > 0.01);
}

/** Блочный человечек из боксов — пока модель облика не загрузилась или её нет. */
function hsFallbackHider(scene, color) {
    const root = new BABYLON.Mesh('hider-fallback', scene);
    const mat = (hex) => {
        const m = new BABYLON.StandardMaterial('hf-' + hex, scene);
        m.diffuseColor = BABYLON.Color3.FromHexString(hex);
        m.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        return m;
    };
    const box = (name, w, h, d, x, y, z, m) => {
        const b = BABYLON.MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
        b.position.set(x, y, z); b.material = m; b.parent = root; return b;
    };
    const skin = mat('#f2c48d'), shirt = mat(color || '#3d7bff'), pants = mat('#2c3e66');
    box('torso', 30, 50, 46, 0, 85, 0, shirt);
    box('head', 36, 36, 36, 0, 130, 0, skin);
    const armL = box('armL', 18, 48, 18, 0, 85, 33, skin), armR = box('armR', 18, 48, 18, 0, 85, -33, skin);
    const legL = box('legL', 20, 60, 20, 0, 30, 12, pants), legR = box('legR', 20, 60, 20, 0, 30, -12, pants);
    for (const p of [armL, armR]) p.setPivotPoint(new BABYLON.Vector3(0, 22, 0));
    for (const p of [legL, legR]) p.setPivotPoint(new BABYLON.Vector3(0, 28, 0));
    let t = 0;
    return {
        root,
        animate(dt, speed) {
            t += dt * (4 + speed * 0.025);
            const a = Math.sin(t) * Math.min(1, speed / 250) * 0.9;
            armL.rotation.z = a; armR.rotation.z = -a; legL.rotation.z = -a; legR.rotation.z = a;
        },
    };
}

/**
 * Вид охотника (игрок): риг облика hunter-XX + библиотека клипов hider_clips.
 * Позиция и курс приходят из логики каждый кадр: setPose(x, y, h, heading).
 */
class HsHunterView {
    /** @param {any} view @param {string} hunterId @param {{ ghost?: boolean }} [opts] */
    constructor(view, hunterId, opts) {
        this.view = view;
        this.opts = opts || {};
        this.skinId = hunterId;
        /** @type {any} */ this.rig = null;
        /** @type {any} */ this.fallback = null;
        /** @type {any} */ this.tintFx = null;
        this.root = null;
        this.clip = '';
        this.alpha = 1;
        this.hatId = '';
        /** @type {any} */ this.hatMesh = null;
        /** @type {any} */ this.hatSpin = null;   // крутящаяся часть шапки (пропеллер)
        this.ready = this._build(hunterId);
    }

    /** Шапка на кость Head (id предмета магазина или ''). Головной убор облика (части Hat*) прячется. */
    async setHat(hatId) {
        await this.ready;
        if (this.disposed || !this.rig) return;
        if (this.hatId === hatId) return;
        this.hatId = hatId || '';
        if (this.hatMesh) { this.rig.detach(this.hatMesh, true); this.hatMesh = null; this.hatSpin = null; }
        const it = hatId ? hsItem(hatId) : null;
        if (!it || !it.model) { this.rig.setPartVisible('Hat', true); return; }
        try {
            const model = await Model3D.load(it.model);
            if (this.disposed || this.hatId !== hatId || !this.rig) return;
            const mesh = Model3D.build(model, this.view.scene, { name: 'hat-' + hatId });
            const fit = typeof HS_HAT_FIT !== 'undefined' && HS_HAT_FIT ? HS_HAT_FIT[this.skinId] : null;
            this.rig.attach('Head', mesh, fit ? { pos: fit.pos, scale: fit.scale } : {});
            this.rig.setPartVisible('Hat', false);
            this.hatMesh = mesh;
            this.hatSpin = mesh.getChildMeshes(false).find(m => m.metadata && m.metadata.part === 'Spin') || null;
            hsSetAlpha(this.root, this.alpha);
        } catch (e) {
            console.warn('HsHunterView: шапка не загрузилась:', it.model);
        }
    }

    async _build(hunterId) {
        const hunter = hsHunter(hunterId);
        try {
            const [model, lib] = await Promise.all([Rig.load(hunter.model), Rig.load(HS_HIDER_CLIPS)]);
            if (this.disposed) return;
            this.rig = Rig.create(model, this.view, { name: 'hunter-' + hunterId, clips: [lib], kind: 'actor' });
            this.root = this.rig.root;
            this.rig.play('idle', { fade: 0, at: Math.random() });
            if (hunter.tint && typeof GameCosmetics !== 'undefined') this.tintFx = GameCosmetics.tint(this.rig.root, hunter.tint);   // вариант: окраска и искры
        } catch (e) {
            console.warn('HsHunterView: облик не загрузился, блочная замена:', hunter.model, (e && e.message) || e);
            if (this.disposed) return;
            this.fallback = hsFallbackHider(this.view.scene, HS_RARITY[hunter.rarity] ? HS_RARITY[hunter.rarity].color : '#3d7bff');
            World3D.addObject(this.view, this.fallback.root, 'actor');
            this.root = this.fallback.root;
        }
        if (this.opts.ghost) this.setAlpha(0.55);
        if (this._pose) this.setPose(this._pose[0], this._pose[1], this._pose[2], this._pose[3]);
    }

    /** Клип по состоянию: idle | run | sneak | dash | caught | cheer | wave. */
    play(name, opts) {
        if (this.clip === name && !(opts && opts.restart)) return;
        this.clip = name;
        if (this.rig && this.rig.has && this.rig.has(name)) this.rig.play(name, Object.assign({ fade: 0.12 }, opts));
        else if (this.rig && name !== 'idle' && this.rig.has && this.rig.has('run') && (name === 'dash' || name === 'sneak')) this.rig.play('run', { fade: 0.1 });
    }

    setPose(x, y, h, heading, speed, dt) {
        this._pose = [x, y, h, heading];
        if (!this.root) return;
        this.root.position.set(x, h || 0, y);
        this.root.rotation.y = -heading;
        if (this.fallback) this.fallback.animate(dt || 0, speed || 0);
        if (this.hatSpin) this.hatSpin.rotation.y += (dt || 0) * (8 + (speed || 0) * 0.04);
    }

    setAlpha(a) {
        if (Math.abs(a - this.alpha) < 0.005 && this.root) return;
        this.alpha = a;
        hsSetAlpha(this.root, a);
    }

    dispose() {
        this.disposed = true;
        if (this.tintFx && this.tintFx.stop) this.tintFx.stop();
        if (this.rig) this.rig.dispose();
        else if (this.fallback) { World3D.removeObject(this.view, this.fallback.root); this.fallback.root.dispose(); }
        this.rig = null; this.root = null;
    }
}

/**
 * Запасной брейнрот из примитивов — пока модель вида не загрузилась или её нет: тело (форма и цвет по номеру
 * вида), глаза, ножки и «деталь» (уши, плавник, антенна…). Чтобы виды отличались и без арта.
 */
function hsFallbackBrainrot(scene, def) {
    const root = new BABYLON.Mesh('brainrot-fallback', scene);
    const color = def ? def.color : '#f2a65a', n = def ? def.num : 1;
    const mat = (hex, emi) => {
        const m = new BABYLON.StandardMaterial('bf-' + hex, scene);
        m.diffuseColor = BABYLON.Color3.FromHexString(hex);
        m.specularColor = new BABYLON.Color3(0.15, 0.15, 0.15);
        if (emi) m.emissiveColor = BABYLON.Color3.FromHexString(hex).scale(emi);
        return m;
    };
    const main = mat(color), dark = mat('#1d1830'), white = mat('#ffffff', 0.4), accent = mat(HS_RARITY && def && HS_RARITY[def.rarity] ? HS_RARITY[def.rarity].color : '#ffcf3b', 0.2);
    const add = (mesh, x, y, z, m) => { mesh.position.set(x, y, z); mesh.material = m; mesh.parent = root; return mesh; };
    const shape = n % 3;
    const bodyH = 110 + (n % 4) * 8;
    const body = shape === 0
        ? BABYLON.MeshBuilder.CreateCapsule('b', { radius: 38, height: bodyH, tessellation: 14 }, scene)
        : shape === 1 ? BABYLON.MeshBuilder.CreateSphere('b', { diameter: 96, segments: 14 }, scene)
            : BABYLON.MeshBuilder.CreateBox('b', { width: 74, height: bodyH - 14, depth: 74 }, scene);
    add(body, 0, shape === 1 ? 62 : bodyH / 2 + 12, 0, main);
    const top = shape === 1 ? 110 : bodyH + 12;
    // глаза смотрят вперёд (+X)
    for (const side of [-1, 1]) {
        add(BABYLON.MeshBuilder.CreateSphere('eye', { diameter: 26, segments: 8 }, scene), 30, top - 28, side * 16, white);
        add(BABYLON.MeshBuilder.CreateSphere('pupil', { diameter: 12, segments: 6 }, scene), 40, top - 28, side * 16, dark);
    }
    const feet = [];
    for (const side of [-1, 1]) feet.push(add(BABYLON.MeshBuilder.CreateSphere('foot', { diameter: 28, segments: 6 }, scene), 4, 12, side * 20, accent));
    const kind = n % 5;
    if (kind === 0) for (const side of [-1, 1]) add(BABYLON.MeshBuilder.CreateCylinder('ear', { diameterTop: 0, diameterBottom: 22, height: 40, tessellation: 8 }, scene), -4, top + 14, side * 22, accent);
    else if (kind === 1) { const fin = add(BABYLON.MeshBuilder.CreateBox('fin', { width: 8, height: 46, depth: 36 }, scene), -8, top + 8, 0, accent); fin.rotation.x = 0.15; }
    else if (kind === 2) { add(BABYLON.MeshBuilder.CreateCylinder('ant', { diameter: 5, height: 40, tessellation: 5 }, scene), 0, top + 20, 0, dark); add(BABYLON.MeshBuilder.CreateSphere('antb', { diameter: 16, segments: 6 }, scene), 0, top + 44, 0, accent); }
    else if (kind === 3) add(BABYLON.MeshBuilder.CreateTorus('ring', { diameter: 58, thickness: 9, tessellation: 18 }, scene), 0, top + 6, 0, accent);
    else add(BABYLON.MeshBuilder.CreateCylinder('cone', { diameterTop: 0, diameterBottom: 40, height: 52, tessellation: 10 }, scene), 0, top + 22, 0, accent);
    return { root, body, feet };
}

/**
 * Вид брейнрота-прячущегося: риг модели вида (клипы idle, run, caught) + процедурная раскачка поверх.
 * Нет файла — запасной вид из примитивов (hsFallbackBrainrot). Поза приходит из логики: setPose(x, y, h, heading, speed, dt).
 */
class HsBrainrotView {
    /** @param {any} view @param {string} brainrotId */
    constructor(view, brainrotId) {
        this.view = view;
        this.brainrotId = brainrotId;
        this.def = hsBrainrot(brainrotId);
        /** @type {any} */ this.rig = null;
        /** @type {any} */ this.fallback = null;
        this.root = null;
        this.body = null;     // узел для раскачки (дети — модель)
        this.clip = '';
        this.hasClips = false;
        this.alpha = 1;
        this.t = Math.random() * 10;
        this.squash = 0;
        this.shiver = 0;
        this.ready = this._build(brainrotId);
    }

    async _build(id) {
        const def = this.def;
        this.root = new BABYLON.TransformNode('brainrot-' + id, this.view.scene);
        this.body = new BABYLON.TransformNode('brainrot-body-' + id, this.view.scene);
        this.body.parent = this.root;
        try {
            if (!def) throw new Error('нет вида ' + id);
            const model = await Rig.load(def.model);
            if (this.disposed) return;
            this.rig = Rig.create(model, this.view, { name: 'brainrot-' + id, kind: 'actor' });
            this.rig.root.parent = this.body;
            this.hasClips = !!(this.rig.clips && this.rig.clips().length > 0);
            if (this.hasClips) this.rig.play(this.rig.has('idle') ? 'idle' : this.rig.clips()[0], { fade: 0, at: Math.random() });
        } catch (e) {
            if (this.disposed) return;
            if (!hsWarned.brainrot) { hsWarned.brainrot = true; console.warn('HsBrainrotView: модель вида не загрузилась, запасной вид:', def && def.model, (e && e.message) || e); }
            this.fallback = hsFallbackBrainrot(this.view.scene, def);
            this.fallback.root.parent = this.body;
            World3D.addObject(this.view, this.fallback.root, 'actor');
        }
        hsSetAlpha(this.body, this.alpha);
        if (this._pose) { const q = this._pose; this.setPose(q[0], q[1], q[2], q[3], q[4], q[5]); }
    }

    /** idle | run | caught | cheer — нет клипа → ближайший по смыслу. */
    play(name, opts) {
        if (this.clip === name && !(opts && opts.restart)) return;
        this.clip = name;
        if (!this.rig || !this.hasClips) return;
        const alt = { run: ['run', 'walk', 'idle'], walk: ['walk', 'run', 'idle'], sneak: ['walk', 'run', 'idle'], dash: ['run', 'walk', 'idle'], caught: ['caught', 'idle'], cheer: ['cheer', 'idle'], idle: ['idle', 'walk'] }[name] || [name];
        const clip = alt.find(c => this.rig.has(c));
        if (clip) this.rig.play(clip, Object.assign({ fade: 0.12 }, opts));
    }

    setPose(x, y, h, heading, speed, dt) {
        this._pose = [x, y, h, heading, speed, dt];
        if (!this.root) return;
        dt = dt || 0;
        this.root.position.set(x, h || 0, y);
        this.root.rotation.y = -heading;
        const moving = Math.min(1, (speed || 0) / 200);
        this.t += dt * (3 + moving * 8);
        const procedural = !this.hasClips;
        const bob = Math.abs(Math.sin(this.t)) * (procedural ? 14 : 3) * moving;
        const tilt = Math.sin(this.t) * (procedural ? 0.14 : 0.02) * moving;
        this.squash = Math.max(0, this.squash - dt * 3);
        this.shiver = Math.max(0, this.shiver - dt * 2.2);
        const sq = 1 - Math.sin(this.squash * Math.PI) * 0.2 + Math.sin(this.t * 40) * 0.025 * this.shiver;
        if (this.body) {
            this.body.position.y = bob;
            this.body.rotation.x = tilt;
            this.body.scaling.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
        }
        if (this.fallback) {
            const a = Math.sin(this.t * 1.3) * moving * 0.8;
            this.fallback.feet[0].position.x = 4 + a * 14; this.fallback.feet[1].position.x = 4 - a * 14;
        }
    }

    setAlpha(a) {
        if (Math.abs(a - this.alpha) < 0.005 && this.root) return;
        this.alpha = a;
        if (this.body) hsSetAlpha(this.body, a);
    }

    /** Сплющивание (поймали, испугался). */
    bump() { this.squash = 1; }
    /** Дрожь (мимик выдаёт себя). */
    twitch() { this.shiver = 1; }

    dispose() {
        this.disposed = true;
        if (this.rig) this.rig.dispose();
        if (this.fallback) { World3D.removeObject(this.view, this.fallback.root); this.fallback.root.dispose(); }
        if (this.root) this.root.dispose();
        this.rig = null; this.root = null; this.fallback = null;
    }
}

/**
 * Предмет-мимик: модель предмета темы (prop/hide из набора карты). Неподвижен; редко дрожит (подсказка,
 * если игрок рядом). Нет модели — картонная коробка. Разоблачение — Game прячет вид и играет «пуф».
 */
class HsMimicView {
    /** @param {any} view @param {string} model @param {number} seed */
    constructor(view, model, seed) {
        this.view = view;
        this.model = model;
        this.seed = seed || 0;
        /** @type {any} */ this.root = null;
        this.shiver = 0;
        this.pop = 0;          // 0..1: появление «пуфом» (сжатый → норма)
        this.visible = false;  // до превращения брейнрота предмет спрятан
        this.x = 0; this.y = 0; this.heading = 0;
        this.h = 0;
        this.ready = this._build();
    }

    async _build() {
        try {
            const m = await Model3D.load(this.model);
            if (this.disposed) return;
            this.root = Model3D.build(m, this.view.scene, { name: 'mimic' });
            World3D.addObject(this.view, this.root, 'prop');
        } catch (e) {
            if (this.disposed) return;
            const scene = this.view.scene;
            const mat = new BABYLON.StandardMaterial('mimic-box', scene);
            mat.diffuseColor = BABYLON.Color3.FromHexString('#c89a63');
            mat.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
            const box = BABYLON.MeshBuilder.CreateBox('mimic-fallback', { width: 90, height: 80, depth: 90 }, scene);
            box.position.y = 40; box.material = mat;
            this.root = new BABYLON.Mesh('mimic-root', scene);
            box.parent = this.root;
            World3D.addObject(this.view, this.root, 'prop');
        }
        this.apply();
    }

    setPose(x, y, h, heading) {
        this.x = x; this.y = y; this.h = h || 0; this.heading = heading || 0;
        this.apply();
    }

    apply() {
        if (!this.root) return;
        this.root.setEnabled(this.visible);
        this.root.position.set(this.x, this.h || 0, this.y);
        this.root.rotation.y = -this.heading;
    }

    /** Показать предмет (брейнрот стал мимиком) или спрятать (разоблачён). */
    show(on) {
        if (on && !this.visible) this.pop = 0;
        this.visible = on;
        this.apply();
    }

    twitch() { this.shiver = 1; }

    update(dt) {
        if (!this.root) return;
        this.pop = Math.min(1, this.pop + dt * 5);
        this.shiver = Math.max(0, this.shiver - dt * 1.6);
        const k = this.pop < 1 ? 0.2 + 0.8 * (1 - Math.pow(1 - this.pop, 3)) : 1;
        const s = k * (1 + Math.sin(performance.now() / 18 + this.seed) * 0.03 * this.shiver);
        this.root.scaling.set(s, s * (1 + Math.sin(this.shiver * Math.PI) * 0.05), s);
        this.root.rotation.z = Math.sin(performance.now() / 24 + this.seed) * 0.05 * this.shiver;
    }

    dispose() {
        this.disposed = true;
        if (this.root) { World3D.removeObject(this.view, this.root); this.root.dispose(); }
        this.root = null;
    }
}

/** Летящий сачок: обруч с сеткой, цвет и вид — из снаряжения (hsGear). */
class HsNetShot {
    /** @param {any} scene @param {any} gear */
    constructor(scene, gear) {
        this.scene = scene;
        this.gear = gear || {};
        const hex = this.gear.color || '#ffe9a8';
        const g = World3D.LAYER && World3D.LAYER.OVERLAY !== undefined ? World3D.LAYER.OVERLAY : 1;
        const mkMat = (a) => {
            const m = new BABYLON.StandardMaterial('net-mat', scene);
            m.disableLighting = true; m.emissiveColor = BABYLON.Color3.FromHexString(hex); m.alpha = a;
            m.backFaceCulling = false; m.metadata = { toon: false };
            return m;
        };
        this.root = new BABYLON.TransformNode('net-shot', scene);
        const style = this.gear.style || 'ring';
        const parts = [];
        const ring = BABYLON.MeshBuilder.CreateTorus('net-ring', { diameter: 90, thickness: 8, tessellation: 28 }, scene);
        ring.material = mkMat(0.95); parts.push(ring);
        const disc = BABYLON.MeshBuilder.CreateDisc('net-disc', { radius: 45, tessellation: 28 }, scene);
        disc.rotation.x = Math.PI / 2; disc.material = mkMat(0.28); parts.push(disc);
        if (style === 'double' || style === 'star') {
            const r2 = BABYLON.MeshBuilder.CreateTorus('net-ring2', { diameter: 56, thickness: 6, tessellation: 24 }, scene);
            r2.material = mkMat(0.9); parts.push(r2);
        }
        if (style === 'star' || style === 'spiral') {
            for (let i = 0; i < 6; i++) {
                const sp = BABYLON.MeshBuilder.CreateBox('net-spoke', { width: 88, height: 3, depth: 3 }, scene);
                sp.rotation.y = i * Math.PI / 3; sp.material = mkMat(0.8); parts.push(sp);
            }
        }
        if (style === 'bubble') {
            const b = BABYLON.MeshBuilder.CreateSphere('net-bubble', { diameter: 84, segments: 12 }, scene);
            b.material = mkMat(0.3); parts.push(b);
        }
        for (const p of parts) { p.parent = this.root; p.isPickable = false; p.renderingGroupId = g; }
        this.parts = parts;
        this.style = style;
        this.t = 0;
    }

    /** Поза в мире: ребро обруча смотрит по ходу броска. */
    update(x, y, h, dt, heading) {
        this.t += dt;
        this.root.position.set(x, (h || 0) + 60 + Math.sin(this.t * 12) * 4, y);
        this.root.rotation.y = -heading;
        for (const p of this.parts) if (p.name === 'net-ring2') p.rotation.y = this.t * 6;
        const spin = this.style === 'spiral' ? 14 : 6;
        this.parts[0].rotation.z = this.t * spin;
    }

    dispose() { for (const p of this.parts) p.dispose(false, true); this.root.dispose(); }
}

/** Волна радара: расходящееся кольцо по земле (цвет и стиль — из снаряжения). */
class HsRadarWave {
    /** @param {any} scene @param {any} gear @param {number} x @param {number} y @param {number} h */
    constructor(scene, gear, x, y, h) {
        const hex = (gear && gear.wave) || '#5ce1ff';
        const style = (gear && gear.waveStyle) || 'ring';
        const g = World3D.LAYER && World3D.LAYER.OVERLAY !== undefined ? World3D.LAYER.OVERLAY : 1;
        this.scene = scene;
        this.style = style;
        this.max = 1500;
        this.life = 1.3;
        this.t = 0;
        this.meshes = [];
        const mk = (mesh, a) => {
            const m = new BABYLON.StandardMaterial('radar-mat', scene);
            m.disableLighting = true; m.emissiveColor = BABYLON.Color3.FromHexString(hex); m.alpha = a;
            m.backFaceCulling = false; m.metadata = { toon: false };
            mesh.material = m; mesh.isPickable = false; mesh.renderingGroupId = g;
            mesh.position.set(x, (h || 0) + 6, y);
            this.meshes.push(mesh);
            return mesh;
        };
        this.ring = mk(BABYLON.MeshBuilder.CreateTorus('radar-ring', { diameter: 2, thickness: 0.035, tessellation: 64 }, scene), 0.9);
        this.ring.scaling.y = 0.4;
        this.disc = mk(BABYLON.MeshBuilder.CreateDisc('radar-disc', { radius: 1, tessellation: 48 }, scene), 0.18);
        this.disc.rotation.x = Math.PI / 2;
        this.ring2 = null; this.sweep = null;
        if (style === 'pulse') { this.ring2 = mk(BABYLON.MeshBuilder.CreateTorus('radar-ring2', { diameter: 2, thickness: 0.03, tessellation: 64 }, scene), 0.7); this.ring2.scaling.y = 0.4; }
        if (style === 'scan') {
            this.sweep = mk(BABYLON.MeshBuilder.CreateDisc('radar-sweep', { radius: 1, tessellation: 24, arc: 0.12 }, scene), 0.45);
            this.sweep.rotation.x = Math.PI / 2;
        }
    }

    /** @returns {boolean} жива ли ещё */
    update(dt) {
        this.t += dt;
        const k = Math.min(1, this.t / this.life), e = 1 - Math.pow(1 - k, 2.2), r = Math.max(1, this.max * e);
        const fade = 1 - k;
        this.ring.scaling.set(r, 0.4 * r, r);
        this.disc.scaling.set(r, r, 1);
        this.disc.material.alpha = 0.18 * fade; this.ring.material.alpha = 0.9 * fade;
        if (this.ring2) { const r2 = r * 0.6; this.ring2.scaling.set(r2, 0.4, r2); this.ring2.material.alpha = 0.7 * fade; }
        if (this.sweep) { this.sweep.scaling.set(r, r, 1); this.sweep.rotation.y = this.t * 7; this.sweep.material.alpha = 0.45 * fade; }
        return k < 1;
    }

    dispose() { for (const m of this.meshes) m.dispose(false, true); this.meshes = []; }
}

/** Конус фонаря охотника на земле: веер, обрезанный стенами (Nav). */
class HsVisionCone {
    constructor(scene, color) {
        this.scene = scene;
        this.rays = IS_MOBILE ? 20 : 30;
        const n = this.rays;
        // веер: центр (u = 0) и дуга (u = 1); прозрачность — градиент текстуры по u
        const pos = new Float32Array((n + 2) * 3), uv = new Float32Array((n + 2) * 2), idx = [];
        for (let i = 0; i < n; i++) idx.push(0, i + 1, i + 2);
        for (let i = 1; i < n + 2; i++) { uv[i * 2] = 1; uv[i * 2 + 1] = 0.5; }
        uv[1] = 0.5;
        this.mesh = new BABYLON.Mesh('vision-cone', scene);
        const vd = new BABYLON.VertexData();
        vd.positions = pos; vd.uvs = uv; vd.indices = idx;
        vd.applyToMesh(this.mesh, true);
        const tex = new BABYLON.DynamicTexture('vision-cone-grad', { width: 128, height: 4 }, scene, false);
        const ctx = /** @type {CanvasRenderingContext2D} */ (/** @type {unknown} */ (tex.getContext()));
        const g = ctx.createLinearGradient(0, 0, 128, 0);
        g.addColorStop(0, 'rgba(255,255,255,0.78)');
        g.addColorStop(0.72, 'rgba(255,255,255,0.46)');
        g.addColorStop(0.93, 'rgba(255,255,255,0.62)');
        g.addColorStop(1, 'rgba(255,255,255,0.9)');
        ctx.clearRect(0, 0, 128, 4); ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 4);
        tex.hasAlpha = true;
        tex.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE; tex.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
        tex.update(false);
        const mat = new BABYLON.StandardMaterial('vision-cone-mat', scene);
        mat.disableLighting = true;
        mat.opacityTexture = tex;
        mat.backFaceCulling = false;
        mat.metadata = { toon: false };
        this.mesh.material = mat;
        this.mat = mat;
        this.mesh.isPickable = false;
        this.mesh.renderingGroupId = World3D.LAYER && World3D.LAYER.OVERLAY !== undefined ? World3D.LAYER.OVERLAY : 1;
        this.pos = pos;
        this.setColor(color || '#ff3b3b', 1);
        this.dist = new Float32Array(n + 1);
    }

    setColor(hex, alpha) {
        this.mat.emissiveColor = BABYLON.Color3.FromHexString(hex);
        this.mat.alpha = alpha == null ? 1 : alpha;
    }

    /** Луч до стены: шаги по Nav.blocked, затем уточнение. */
    static reach(x, y, ang, range) {
        const dx = Math.cos(ang), dy = Math.sin(ang);
        const step = 24;
        let d = 30;
        for (; d <= range; d += step) {
            if (Nav.ready && Nav.blocked(x + dx * d, y + dy * d, 2)) {
                let lo = d - step, hi = d;
                for (let k = 0; k < 4; k++) { const m = (lo + hi) / 2; if (Nav.blocked(x + dx * m, y + dy * m, 2)) hi = m; else lo = m; }
                return lo;
            }
        }
        return range;
    }

    update(x, y, heading, range, half, h) {
        const n = this.rays, p = this.pos, y0 = (h || 0) + 4;
        p[0] = x; p[1] = y0; p[2] = y;
        for (let i = 0; i <= n; i++) {
            const a = heading - half + (2 * half) * (i / n);
            const d = HsVisionCone.reach(x, y, a, range);
            this.dist[i] = d;
            p[(i + 1) * 3] = x + Math.cos(a) * d; p[(i + 1) * 3 + 1] = y0; p[(i + 1) * 3 + 2] = y + Math.sin(a) * d;
        }
        this.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, p);
        this.mesh.refreshBoundingInfo();
    }

    setVisible(on) { this.mesh.setEnabled(on); }
    dispose() { this.mesh.dispose(false, true); }
}

/** Светящееся кольцо под персонажем (игрок — голубое, как в референсе). */
class HsGroundRing {
    constructor(scene, hex, radius) {
        this.mesh = BABYLON.MeshBuilder.CreateTorus('ground-ring', { diameter: radius * 2, thickness: 7, tessellation: 40 }, scene);
        const mat = new BABYLON.StandardMaterial('ground-ring-mat', scene);
        mat.disableLighting = true;
        mat.emissiveColor = BABYLON.Color3.FromHexString(hex);
        mat.alpha = 0.85;
        mat.metadata = { toon: false };
        this.mesh.material = mat;
        this.mesh.isPickable = false;
        this.mesh.scaling.y = 0.25;
        this.disc = BABYLON.MeshBuilder.CreateDisc('ground-disc', { radius: radius, tessellation: 40 }, scene);
        const dm = new BABYLON.StandardMaterial('ground-disc-mat', scene);
        dm.disableLighting = true; dm.emissiveColor = BABYLON.Color3.FromHexString(hex); dm.alpha = 0.22; dm.metadata = { toon: false };
        this.disc.material = dm; this.disc.rotation.x = Math.PI / 2; this.disc.isPickable = false;
        const g = World3D.LAYER && World3D.LAYER.OVERLAY !== undefined ? World3D.LAYER.OVERLAY : 1;
        this.mesh.renderingGroupId = g; this.disc.renderingGroupId = g;
        this.t = 0;
    }
    update(x, y, h, dt) {
        this.t += dt;
        const s = 1 + Math.sin(this.t * 4) * 0.06;
        this.mesh.position.set(x, (h || 0) + 3, y); this.mesh.scaling.x = s; this.mesh.scaling.z = s;
        this.disc.position.set(x, (h || 0) + 2, y);
    }
    setVisible(on) { this.mesh.setEnabled(on); this.disc.setEnabled(on); }
    dispose() { this.mesh.dispose(false, true); this.disc.dispose(false, true); }
}

/**
 * Предметы на карте: монеты и сферы. Модель строится один раз, дальше — инстансы частей.
 * items: [{ kind: 'coin'|'dash'|'ghost', x, y, alive, node }]
 */
class HsPickups {
    constructor(view) {
        this.view = view;
        this.items = [];
        /** @type {Record<string, any>} */ this.protos = {};
        this.t = 0;
    }

    async _proto(kind) {
        if (this.protos[kind] !== undefined) return this.protos[kind];
        const url = kind === 'coin' ? HS_COIN_MODEL : kind === 'dash' ? HS_ORB_DASH_MODEL : HS_ORB_GHOST_MODEL;
        let root = null;
        try {
            const model = await Model3D.load(url);
            root = Model3D.build(model, this.view.scene, { name: 'proto-' + kind });
        } catch (e) {
            console.warn('HsPickups: нет модели, простая форма:', url);
            const scene = this.view.scene;
            const mat = new BABYLON.StandardMaterial('pick-' + kind, scene);
            mat.diffuseColor = BABYLON.Color3.FromHexString(kind === 'coin' ? '#ffcc22' : kind === 'dash' ? '#3db8ff' : '#b45cff');
            mat.emissiveColor = mat.diffuseColor.scale(0.35);
            root = new BABYLON.Mesh('proto-' + kind, scene);
            const m = kind === 'coin'
                ? BABYLON.MeshBuilder.CreateCylinder('c', { diameter: 40, height: 8, tessellation: 20 }, scene)
                : BABYLON.MeshBuilder.CreateSphere('s', { diameter: 50, segments: 12 }, scene);
            if (kind === 'coin') { m.rotation.x = Math.PI / 2; m.position.y = 20; } else m.position.y = 25;
            m.material = mat; m.parent = root;
        }
        root.setEnabled(false);
        this.protos[kind] = root;
        return root;
    }

    async spawn(kind, x, y) {
        const proto = await this._proto(kind);
        const node = new BABYLON.TransformNode('pick-' + kind, this.view.scene);
        for (const part of proto.getChildMeshes(false)) {
            if (!part.getTotalVertices || !part.getTotalVertices()) continue;
            const inst = part.createInstance(part.name + '-i');
            inst.parent = node;
            inst.position.copyFrom(part.position); inst.rotation.copyFrom(part.rotation); inst.scaling.copyFrom(part.scaling);
            if (part.rotationQuaternion) inst.rotationQuaternion = part.rotationQuaternion.clone();
        }
        node.position.set(x, kind === 'coin' ? 22 : 36, y);
        /** @type {any} */
        const item = { kind, x, y, alive: true, node, phase: Math.random() * 6, magnet: false, fly: null };
        this.items.push(item);
        return item;
    }

    update(dt) {
        this.t += dt;
        for (const it of this.items) {
            if (!it.alive) continue;
            if (it.fly) {
                // вылет из сундука: дуга от точки к месту приземления
                const f = it.fly;
                f.t += dt;
                const k = Math.min(1, f.t / f.dur);
                it.x = f.x0 + (f.x1 - f.x0) * k; it.y = f.y0 + (f.y1 - f.y0) * k;
                it.node.position.set(it.x, 22 + f.h0 * (1 - k) + Math.sin(k * Math.PI) * f.arc, it.y);
                it.node.rotation.y += dt * 14;
                if (k >= 1) it.fly = null;
                continue;
            }
            it.node.rotation.y = this.t * (it.kind === 'coin' ? 2.6 : 1.2) + it.phase;
            const base = it.kind === 'coin' ? 22 : 36;
            it.node.position.x = it.x; it.node.position.z = it.y;
            it.node.position.y = base + Math.sin(this.t * 3 + it.phase) * (it.kind === 'coin' ? 5 : 9);
        }
    }

    take(it) {
        it.alive = false;
        it.node.dispose();
    }

    clear() {
        for (const it of this.items) if (it.alive) it.node.dispose();
        this.items = [];
    }

    dispose() {
        this.clear();
        for (const k of Object.keys(this.protos)) if (this.protos[k]) this.protos[k].dispose();
        this.protos = {};
    }
}

/** Клетка пойманного (модель или решётка из цилиндров). */
async function hsSpawnCage(view, x, y) {
    let root = null;
    try {
        const model = await Model3D.load(HS_CAGE_MODEL);
        root = Model3D.build(model, view.scene, { name: 'cage' });
        World3D.addObject(view, root, 'prop');
    } catch (e) {
        root = new BABYLON.Mesh('cage', view.scene);
        const mat = new BABYLON.StandardMaterial('cage-mat', view.scene);
        mat.diffuseColor = BABYLON.Color3.FromHexString('#aab4c8');
        for (let i = 0; i < 10; i++) {
            const a = i / 10 * Math.PI * 2;
            const bar = BABYLON.MeshBuilder.CreateCylinder('bar', { diameter: 7, height: 170, tessellation: 6 }, view.scene);
            bar.position.set(Math.cos(a) * 58, 85, Math.sin(a) * 58); bar.material = mat; bar.parent = root;
        }
        const top = BABYLON.MeshBuilder.CreateCylinder('top', { diameter: 130, height: 12, tessellation: 20 }, view.scene);
        top.position.y = 172; top.material = mat; top.parent = root;
        World3D.addObject(view, root, 'prop');
    }
    root.position.set(x, 260, y);
    return root;
}

/**
 * Сундук с монетами: стоит в случайном месте карты, светится; игрок подходит — крышка открывается,
 * из сундука вылетают монеты. Модель с ригом (Base, Lid; клипы idle/open) или запасная без анимации.
 */
class HsChest {
    constructor(view, x, y, heading) {
        this.view = view;
        this.x = x; this.y = y; this.heading = heading || 0;
        this.opened = false;
        /** @type {any} */ this.rig = null;
        /** @type {any} */ this.root = null;
        this.t = 0;
        this.pop = -1;
        this.vanish = -1;     // > 0 — исчезает (с), после открытия
        this.gone = false;
        this.openT = 0;       // с после открытия (считает Game)
        this.ready = this._build();
    }

    async _build() {
        try {
            const model = await Rig.load(HS_CHEST_MODEL);
            if (this.disposed) return;
            this.rig = Rig.create(model, this.view, { name: 'chest', kind: 'prop' });
            this.root = this.rig.root;
            if (this.rig.has('idle')) this.rig.play('idle', { fade: 0 });
        } catch (e) {
            try {
                const model = await Model3D.load(HS_CHEST_FALLBACK);
                if (this.disposed) return;
                this.root = Model3D.build(model, this.view.scene, { name: 'chest' });
                World3D.addObject(this.view, this.root, 'prop');
            } catch (e2) { return; }
        }
        this.root.position.set(this.x, 0, this.y);
        this.root.rotation.y = -this.heading;
    }

    open() {
        if (this.opened) return;
        this.opened = true;
        this.pop = 0;
        if (this.rig && this.rig.has('open')) this.rig.play('open', { loop: false, holdLast: true, fade: 0.05 });
    }

    update(dt) {
        if (!this.root) return;
        this.t += dt;
        if (this.vanish >= 0) {
            // сжимается и проваливается в пол, потом исчезает
            this.vanish += dt;
            const k = Math.min(1, this.vanish / 0.45);
            const sc = Math.max(0.01, (1 - k) * (1 + Math.sin(k * Math.PI) * 0.25));
            this.root.scaling.set(sc, sc, sc);
            this.root.rotation.y = -this.heading + k * 4;
            this.root.position.y = -k * 20;
            if (k >= 1) this.gone = true;
            return;
        }
        if (this.pop >= 0) {
            // подпрыгнул при открытии (у запасной модели — вся анимация)
            this.pop += dt;
            const k = Math.min(1, this.pop / 0.45);
            const jump = Math.sin(k * Math.PI) * 26;
            const sq = 1 + Math.sin(k * Math.PI * 2) * 0.12 * (1 - k);
            this.root.position.y = jump;
            this.root.scaling.set(1 / sq, sq, 1 / sq);
        } else if (!this.rig) {
            this.root.position.y = Math.abs(Math.sin(this.t * 2.4)) * 5;   // запасная модель: зовущее подпрыгивание
        }
    }

    dispose() {
        this.disposed = true;
        if (this.rig) this.rig.dispose();
        else if (this.root) { World3D.removeObject(this.view, this.root); this.root.dispose(); }
        this.rig = null; this.root = null;
    }
}
