// GameHatFit.js — поправки посадки шапок по обликам охотника (id облика -> { pos, scale }). Пусто: шапка садится на кость Head; собственные шапки облика (части Hat_*) при надетой шапке магазина прячутся (HsHunterView.setHat). Проверено на hunter-01, 04, 09.
/** @type {Record<string, { pos?: number[], scale?: number }>} */
const HS_HAT_FIT = {};
