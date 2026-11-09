// GameRecords.js — окно «Рекорды» (лидерборд площадки Score: Яндекс, Playgama) и межстраничная реклама
// на кнопках интерфейса в сборке YouTube Playables (просьба пользователя); во время раунда — нет.
// Таблица — Platform.leaderboard() (ник, аватар, очки); нет таблицы у площадки — кнопки нет.
// Неавторизованному — кнопка «Войдите в аккаунт» (Platform.canLogin / login).

Object.assign(LANG_STRINGS.ru, {
    'rec.title': 'РЕКОРДЫ',
    'rec.button': 'РЕКОРДЫ',
    'rec.empty': 'Пока нет лучших игроков',
    'rec.loading': 'Загрузка…',
    'rec.login': 'Войдите в аккаунт',
    'rec.loginHint': 'Чтобы попасть в таблицу со своим именем',
    'rec.you': 'Ты',
    'rec.points': 'очков',
    'rec.loginWait': 'Входим…',
    'rec.loginFail': 'Не удалось войти. Попробуйте ещё раз.',
});
Object.assign(LANG_STRINGS.en, {
    'rec.title': 'LEADERBOARD',
    'rec.button': 'RECORDS',
    'rec.empty': 'No top players yet',
    'rec.loading': 'Loading…',
    'rec.login': 'Sign in',
    'rec.loginHint': 'To appear on the leaderboard with your name',
    'rec.you': 'You',
    'rec.points': 'pts',
    'rec.loginWait': 'Signing in…',
    'rec.loginFail': 'Could not sign in. Please try again.',
});

const HS_REC_CSS = '.hs-rec{position:fixed;inset:0;z-index:40;display:none;align-items:center;justify-content:center;background:rgba(36,24,12,.62);font-family:HsText,system-ui,sans-serif;font-weight:700;color:#2a2017}'
    + '.hs-rec.on{display:flex}'
    + '.hs-rec-p{position:relative;width:min(460px,92%);max-height:88%;display:flex;flex-direction:column;padding:18px 16px 18px 24px;background-color:#f6edd6;background-image:repeating-linear-gradient(180deg,transparent 0,transparent 27px,rgba(48,98,168,.26) 27px,rgba(48,98,168,.26) 28px),radial-gradient(rgba(120,88,40,.08) 1px,transparent 1.6px);background-size:100% 28px,7px 7px;background-position:0 12px,0 0;border:2px solid rgba(42,32,23,.4);border-radius:3px;box-shadow:0 3px 0 rgba(42,32,23,.3),0 22px 36px -8px rgba(0,0,0,.6);animation:hs-rec-in .38s cubic-bezier(.2,1.2,.4,1)}'
    + '.hs-rec-p::before{content:"";position:absolute;left:50%;top:-11px;width:84px;height:22px;margin-left:-42px;background:rgba(255,222,110,.82);transform:rotate(-3deg);box-shadow:0 1px 2px rgba(0,0,0,.3);clip-path:polygon(0 0,3% 25%,0 50%,3% 75%,0 100%,100% 100%,97% 75%,100% 50%,97% 25%,100% 0)}'
    + '.hs-rec-p::after{content:"";position:absolute;left:14px;top:0;bottom:0;width:2px;background:rgba(214,55,44,.45)}'
    + '.hs-rec-h{font-family:HsStamp,HsText,sans-serif;font-weight:900;font-size:28px;line-height:1;text-align:center;letter-spacing:.03em;color:#d6372c;border:4px solid #d6372c;outline:2px solid #d6372c;outline-offset:2px;border-radius:8px;padding:6px 14px 4px;margin:4px auto 14px;transform:rotate(-2.5deg);mix-blend-mode:multiply}'
    + '.hs-rec-x{position:absolute;right:-12px;top:-12px;width:44px;height:44px;border:3px solid #2a2017;border-radius:50%;background:#f6edd6;box-shadow:0 3px 0 #2a2017;cursor:pointer;color:#d6372c}'
    + '.hs-rec-x::before,.hs-rec-x::after{content:"";position:absolute;left:11px;top:18px;width:16px;height:4px;border-radius:2px;background:currentColor;transform:rotate(45deg)}'
    + '.hs-rec-x::after{transform:rotate(-45deg)}'
    + '.hs-rec-l{overflow:auto;display:flex;flex-direction:column;gap:6px;min-height:80px;padding:2px 4px 6px 2px}'
    + '.hs-rec-r{display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:3px;background:rgba(255,253,243,.8);border:2px solid rgba(42,32,23,.5);font-size:15px}'
    + '.hs-rec-r.me{background:#fff1a0;border:3px solid #2a2017;box-shadow:0 3px 0 #2a2017}'
    + '.hs-rec-r b{min-width:30px;text-align:center;font-family:HsStamp,HsText,sans-serif;font-weight:900;font-size:17px;color:#d6372c}'
    + '.hs-rec-r img,.hs-rec-r i{width:34px;height:34px;border-radius:50%;flex:none;background:#d4b07a;border:2px solid #2a2017;object-fit:cover}'
    + '.hs-rec-r span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
    + '.hs-rec-r em{font-style:normal;font-family:HsStamp,HsText,sans-serif;font-weight:900;color:#2a2017}'
    + '.hs-rec-e{padding:24px 8px;text-align:center;font-weight:800;font-style:italic;color:#6b5942}'
    + '.hs-rec-in{margin-top:12px;display:flex;flex-direction:column;align-items:center;gap:6px;font-size:13px;color:#6b5942}'
    + '.hs-rec-in button:disabled{filter:grayscale(.8);opacity:.7}'
    + '.hs-rec-in button{border:3px solid #2a2017;border-radius:5px 10px 6px 11px;padding:11px 22px;font:900 17px HsStamp,HsText,system-ui,sans-serif;text-transform:uppercase;color:#fff8e6;background:#2e9a50;box-shadow:0 4px 0 #2a2017;cursor:pointer}'
    + '@keyframes hs-rec-in{from{transform:translateY(34px) rotate(-3deg) scale(.94);opacity:0}}'
    + '@media (prefers-reduced-motion:reduce){.hs-rec-p{animation:none}}';

/** @satisfies {Record<string, any>} */
const GameRecords = {
    /** @type {HTMLElement | null} */ el: null,
    supported: false,

    async init() {
        try { this.supported = (await Platform.leaderboard()) !== null; } catch (e) { this.supported = false; }
        return this.supported;
    },

    _build() {
        if (this.el) return this.el;
        const st = document.createElement('style');
        st.textContent = HS_REC_CSS;
        document.head.appendChild(st);
        const el = this.el = document.createElement('div');
        el.className = 'hs-rec';
        el.innerHTML = '<div class="hs-rec-p"><button class="hs-rec-x" type="button"></button><div class="hs-rec-h"></div><div class="hs-rec-l"></div><div class="hs-rec-in" hidden><span></span><button type="button"></button></div></div>';
        document.body.appendChild(el);
        const close = () => this.close();
        /** @type {HTMLElement} */ (el.querySelector('.hs-rec-x')).addEventListener('click', close);
        el.addEventListener('click', e => { if (e.target === el) close(); });
        const loginBtn = /** @type {HTMLButtonElement} */ (el.querySelector('.hs-rec-in button'));
        loginBtn.addEventListener('click', async () => {
            if (loginBtn.disabled) return;
            const hint = /** @type {HTMLElement} */ (el.querySelector('.hs-rec-in span'));
            loginBtn.disabled = true;
            hint.textContent = Lang.t('rec.loginWait');
            let ok = false;
            try { ok = await Platform.login(); } catch (e) { ok = false; }
            loginBtn.disabled = false;
            if (ok) { try { await Platform.load(); } catch (e) { /* сохранение — по-старому */ } this.open(); }
            else hint.textContent = Lang.t('rec.loginFail');
        });
        return el;
    },

    async open() {
        const el = this._build();
        el.classList.add('on');
        /** @type {HTMLElement} */ (el.querySelector('.hs-rec-h')).textContent = Lang.t('rec.title');
        const list = /** @type {HTMLElement} */ (el.querySelector('.hs-rec-l'));
        list.innerHTML = '<div class="hs-rec-e"></div>';
        /** @type {HTMLElement} */ (list.firstElementChild).textContent = Lang.t('rec.loading');
        const login = /** @type {HTMLElement} */ (el.querySelector('.hs-rec-in'));
        const canLogin = !Platform.authorized() && Platform.canLogin();
        login.hidden = !canLogin;
        if (canLogin) {
            /** @type {HTMLElement} */ (login.querySelector('span')).textContent = Lang.t('rec.loginHint');
            /** @type {HTMLElement} */ (login.querySelector('button')).textContent = Lang.t('rec.login');
        }
        let rows = null;
        try { rows = await Platform.leaderboard({ avatarSize: 'medium' }); } catch (e) { rows = null; }
        list.innerHTML = '';
        if (!rows || !rows.length) {
            const e = document.createElement('div');
            e.className = 'hs-rec-e'; e.textContent = Lang.t('rec.empty');
            list.appendChild(e);
            return;
        }
        for (const r of rows) {
            const row = document.createElement('div');
            row.className = 'hs-rec-r' + (r.me ? ' me' : '');
            const rank = document.createElement('b'); rank.textContent = String(r.rank);
            let av;
            if (r.avatar) { av = document.createElement('img'); /** @type {HTMLImageElement} */ (av).src = r.avatar; /** @type {HTMLImageElement} */ (av).alt = ''; } else av = document.createElement('i');
            const name = document.createElement('span'); name.textContent = r.name || (r.me ? Lang.t('rec.you') : '—');
            const pts = document.createElement('em'); pts.textContent = String(r.score);
            row.append(rank, av, name, pts);
            list.appendChild(row);
        }
    },

    close() { if (this.el) this.el.classList.remove('on'); },

    /**
     * Playables: межстраничная реклама при нажатии кнопок интерфейса (не кнопок раунда «Рывок» / «Обманка»).
     * Запрос идёт ПОСЛЕ обработчика кнопки: если кнопка сама запустила рекламу за награду (Platform занят),
     * межстраничная не запрашивается — награда не срывается. Показ решает YouTube (SDK может ничего не показать).
     */
    uiAds: false,

    adsOnUiClicks() {
        if (this.uiAds) return;
        this.uiAds = true;
        document.addEventListener('click', e => {
            const t = /** @type {HTMLElement} */ (e.target);
            const btn = t && t.closest ? t.closest('button, [role="button"]') : null;
            if (!btn || btn.closest('.tb')) return;
            if (!(Platform.name === 'playables' || location.search.indexOf('uiads') >= 0)) return;   // только Playables (uiads — проверка локально)
            // во время игрового процесса (раунд, обучение, предложение «продолжить») — никогда
            if (typeof Game !== 'undefined' && ['hide', 'seek', 'tutorial', 'offer'].indexOf(Game.state) >= 0) return;
            setTimeout(() => {
                if (Platform.adActive || Platform._adBusy || Platform.ads.busy) return;
                Platform.interstitial();
            }, 0);
        }, true);
    },
};

if (typeof document !== 'undefined') GameRecords.adsOnUiClicks();
