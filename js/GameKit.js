// GameKit.js — коллизии набора стен (Nav.register) и классификация объектов карты.
// Точные фигуры из Blender лежат в docs/kit/<тема>.json; tools/kit/build-kit.mjs переносит их
// в HS_KIT_SHAPES ниже. Модель без точной фигуры получает фигуру по имени детали (размеры —
// docs/GAME-SPEC.md). Укрытия (-hide) и декор — без коллизий.


/** Точные фигуры из docs/kit (пишет tools/kit/build-kit.mjs). @type {Record<string, any[]>} */
const HS_KIT_SHAPES = {
    ['assets/' + 'models/kit/aqua-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/aqua-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/aqua-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/aqua-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/aqua-block.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 200}],
    ['assets/' + 'models/kit/aqua-prop1.glb']: [{t: 'box', x: 0, y: 0, w: 92, d: 84}],
    ['assets/' + 'models/kit/aqua-prop2.glb']: [{t: 'box', x: -5, y: 0, w: 170, d: 66}],
    ['assets/' + 'models/kit/aqua-prop3.glb']: [{t: 'circle', x: 0, y: 0, r: 50}],
    ['assets/' + 'models/kit/block-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/block-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/block-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/block-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/block-block.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 200}],
    ['assets/' + 'models/kit/block-prop1.glb']: [{t: 'box', x: 0, y: 0, w: 160, d: 46}],
    ['assets/' + 'models/kit/block-prop2.glb']: [{t: 'box', x: 0, y: 0, w: 90, d: 90}],
    ['assets/' + 'models/kit/block-prop3.glb']: [{t: 'circle', x: 0, y: 0, r: 16}],
    ['assets/' + 'models/kit/candy-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/candy-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/candy-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/candy-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/candy-block.glb']: [{t: 'circle', x: 0, y: 0, r: 100}],
    ['assets/' + 'models/kit/candy-prop1.glb']: [{t: 'box', x: 0, y: 0, w: 100, d: 100}],
    ['assets/' + 'models/kit/candy-prop2.glb']: [{t: 'circle', x: 0, y: 0, r: 25}],
    ['assets/' + 'models/kit/candy-prop3.glb']: [{t: 'circle', x: 0, y: 0, r: 34}],
    ['assets/' + 'models/kit/carnival-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/carnival-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/carnival-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/carnival-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/carnival-block.glb']: [{t: 'circle', x: 0, y: 0, r: 100}],
    ['assets/' + 'models/kit/carnival-prop1.glb']: [{t: 'circle', x: 0, y: 0, r: 45}],
    ['assets/' + 'models/kit/carnival-prop2.glb']: [{t: 'box', x: 0, y: 0, w: 74, d: 74}],
    ['assets/' + 'models/kit/carnival-prop3.glb']: [{t: 'circle', x: 0, y: 0, r: 38}],
    ['assets/' + 'models/kit/circus-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/circus-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/circus-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/circus-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/circus-block.glb']: [{t: 'circle', x: 0, y: 0, r: 100}],
    ['assets/' + 'models/kit/circus-prop1.glb']: [{t: 'circle', x: 0, y: 0, r: 48}],
    ['assets/' + 'models/kit/circus-prop2.glb']: [{t: 'box', x: -5, y: 0, w: 150, d: 100}],
    ['assets/' + 'models/kit/circus-prop3.glb']: [{t: 'box', x: 0, y: 0, w: 120, d: 70}],
    ['assets/' + 'models/kit/citrus-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/citrus-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/citrus-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/citrus-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/citrus-block.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 200}],
    ['assets/' + 'models/kit/citrus-prop1.glb']: [{t: 'box', x: 0, y: 0, w: 110, d: 76}],
    ['assets/' + 'models/kit/citrus-prop2.glb']: [{t: 'box', x: 72.9, y: 68.4, w: 57.2, d: 40, a: -99},{t: 'box', x: 56.5, y: 17.8, w: 57.2, d: 40, a: -117},{t: 'box', x: 25.2, y: -25.2, w: 57.2, d: 40, a: -135},{t: 'box', x: -17.8, y: -56.5, w: 57.2, d: 40, a: -153},{t: 'box', x: -68.4, y: -72.9, w: 57.2, d: 40, a: -171}],
    ['assets/' + 'models/kit/citrus-prop3.glb']: [{t: 'circle', x: 0, y: 0, r: 48}],
    ['assets/' + 'models/kit/greenhouse-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/greenhouse-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/greenhouse-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/greenhouse-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/greenhouse-block.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 200}],
    ['assets/' + 'models/kit/greenhouse-prop1.glb']: [{t: 'box', x: -15, y: 0, w: 160, d: 70}],
    ['assets/' + 'models/kit/greenhouse-prop2.glb']: [{t: 'circle', x: 0, y: 0, r: 37}],
    ['assets/' + 'models/kit/greenhouse-prop3.glb']: [{t: 'box', x: 0, y: 0, w: 140, d: 60}],
    ['assets/' + 'models/kit/ice-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/ice-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/ice-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/ice-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/ice-block.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 200}],
    ['assets/' + 'models/kit/ice-prop1.glb']: [{t: 'box', x: 8.6, y: 0.1, w: 142.9, d: 111.9}],
    ['assets/' + 'models/kit/ice-prop2.glb']: [{t: 'box', x: 0.5, y: -3.8, w: 165, d: 122.4}],
    ['assets/' + 'models/kit/ice-prop3.glb']: [{t: 'circle', x: 0, y: 0, r: 38}],
    ['assets/' + 'models/kit/kitchen-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/kitchen-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/kitchen-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/kitchen-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/kitchen-block.glb']: [{t: 'circle', x: 0, y: 0, r: 100}],
    ['assets/' + 'models/kit/kitchen-prop1.glb']: [{t: 'box', x: 0, y: 0, w: 130, d: 76}],
    ['assets/' + 'models/kit/kitchen-prop2.glb']: [{t: 'box', x: 0, y: 0, w: 130, d: 100}],
    ['assets/' + 'models/kit/kitchen-prop3.glb']: [{t: 'box', x: 0, y: 0, w: 76, d: 76}],
    ['assets/' + 'models/kit/library-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/library-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/library-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/library-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/library-block.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 160}],
    ['assets/' + 'models/kit/library-prop1.glb']: [{t: 'box', x: 0, y: 0, w: 150, d: 84}],
    ['assets/' + 'models/kit/library-prop2.glb']: [{t: 'box', x: 0, y: 0, w: 140, d: 56}],
    ['assets/' + 'models/kit/library-prop3.glb']: [{t: 'box', x: 0, y: 0, w: 62, d: 46}],
    ['assets/' + 'models/kit/market-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/market-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/market-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/market-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/market-block.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 200}],
    ['assets/' + 'models/kit/market-prop1.glb']: [{t: 'box', x: -9, y: 0, w: 141.4, d: 77.5}],
    ['assets/' + 'models/kit/market-prop2.glb']: [{t: 'box', x: 0, y: 0, w: 160, d: 96.3}],
    ['assets/' + 'models/kit/market-prop3.glb']: [{t: 'box', x: 0, y: 0, w: 105, d: 103}],
    ['assets/' + 'models/kit/mint-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/mint-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/mint-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/mint-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/mint-block.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 200}],
    ['assets/' + 'models/kit/mint-prop1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 22}],
    ['assets/' + 'models/kit/mint-prop2.glb']: [{t: 'box', x: 0, y: 0, w: 84, d: 84}],
    ['assets/' + 'models/kit/mint-prop3.glb']: [{t: 'circle', x: 0, y: 0, r: 32}],
    ['assets/' + 'models/kit/museum-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/museum-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/museum-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/museum-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/museum-block.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 200}],
    ['assets/' + 'models/kit/museum-prop1.glb']: [{t: 'box', x: 0, y: 0, w: 120, d: 72}],
    ['assets/' + 'models/kit/museum-prop2.glb']: [{t: 'box', x: 0, y: 0, w: 64, d: 64}],
    ['assets/' + 'models/kit/museum-prop3.glb']: [{t: 'box', x: 0, y: 0, w: 64, d: 72}],
    ['assets/' + 'models/kit/neon-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/neon-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/neon-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/neon-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/neon-block.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 200}],
    ['assets/' + 'models/kit/neon-prop1.glb']: [{t: 'box', x: 0, y: 0, w: 100, d: 80}],
    ['assets/' + 'models/kit/neon-prop2.glb']: [{t: 'box', x: 0, y: 0, w: 86, d: 86}],
    ['assets/' + 'models/kit/neon-prop3.glb']: [{t: 'box', x: 0, y: 0, w: 40, d: 120}],
    ['assets/' + 'models/kit/observatory-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/observatory-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/observatory-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/observatory-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/observatory-block.glb']: [{t: 'circle', x: 0, y: 0, r: 100}],
    ['assets/' + 'models/kit/observatory-prop1.glb']: [{t: 'circle', x: 0, y: 0, r: 50}],
    ['assets/' + 'models/kit/observatory-prop2.glb']: [{t: 'circle', x: 0, y: 0, r: 42}],
    ['assets/' + 'models/kit/observatory-prop3.glb']: [{t: 'circle', x: 0, y: 0, r: 40}],
    ['assets/' + 'models/kit/school-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/school-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/school-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/school-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/school-block.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 200}],
    ['assets/' + 'models/kit/school-prop1.glb']: [{t: 'box', x: -24.5, y: 0, w: 109, d: 132}],
    ['assets/' + 'models/kit/school-prop2.glb']: [{t: 'circle', x: 0, y: 0, r: 42}],
    ['assets/' + 'models/kit/school-prop3.glb']: [{t: 'box', x: -0.4, y: -6.5, w: 75.2, d: 99}],
    ['assets/' + 'models/kit/site-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/site-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/site-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/site-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/site-block.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 200}],
    ['assets/' + 'models/kit/site-prop1.glb']: [{t: 'box', x: -5.3, y: 2.2, w: 113.4, d: 94.1}],
    ['assets/' + 'models/kit/site-prop2.glb']: [{t: 'box', x: 0, y: 0, w: 120, d: 80}],
    ['assets/' + 'models/kit/site-prop3.glb']: [{t: 'box', x: 0, y: 0, w: 140, d: 62}],
    ['assets/' + 'models/kit/space-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/space-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/space-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/space-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/space-block.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 200}],
    ['assets/' + 'models/kit/space-prop1.glb']: [{t: 'box', x: 0, y: 0, w: 64, d: 110}],
    ['assets/' + 'models/kit/space-prop2.glb']: [{t: 'circle', x: 0, y: 0, r: 40}],
    ['assets/' + 'models/kit/space-prop3.glb']: [{t: 'box', x: 0, y: 0, w: 64, d: 64}],
    ['assets/' + 'models/kit/toy-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/toy-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/toy-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/toy-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/toy-block.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 200}],
    ['assets/' + 'models/kit/toy-prop1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 100}],
    ['assets/' + 'models/kit/toy-prop2.glb']: [{t: 'box', x: 6.3, y: -5.8, w: 137.9, d: 106.9}],
    ['assets/' + 'models/kit/toy-prop3.glb']: [{t: 'circle', x: 8, y: 0, r: 42}],
    ['assets/' + 'models/kit/tropic-wall1.glb']: [{t: 'box', x: 0, y: 0, w: 200, d: 40}],
    ['assets/' + 'models/kit/tropic-wall2.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 40}],
    ['assets/' + 'models/kit/tropic-post.glb']: [{t: 'box', x: 0, y: 0, w: 50, d: 50}],
    ['assets/' + 'models/kit/tropic-border.glb']: [{t: 'box', x: 0, y: 0, w: 400, d: 70}],
    ['assets/' + 'models/kit/tropic-block.glb']: [{t: 'circle', x: 0, y: 0, r: 96}],
    ['assets/' + 'models/kit/tropic-prop1.glb']: [{t: 'circle', x: 0, y: 0, r: 32}],
    ['assets/' + 'models/kit/tropic-prop2.glb']: [{t: 'box', x: 0, y: 0, w: 82, d: 82}],
    ['assets/' + 'models/kit/tropic-prop3.glb']: [{t: 'box', x: 0, y: 0, w: 92, d: 62}],
};

/** @satisfies {Record<string, any>} */
const GameKit = {
    PREFIX: 'assets/' + 'models/kit/',

    /** Фигура по имени детали, если точной нет. */
    defaultShapes(part) {
        if (part === 'wall1') return [{ t: 'box', x: 0, y: 0, w: 200, d: 40 }];
        if (part === 'wall2') return [{ t: 'box', x: 0, y: 0, w: 400, d: 40 }];
        if (part === 'post') return [{ t: 'box', x: 0, y: 0, w: 50, d: 50 }];
        if (part === 'border') return [{ t: 'box', x: 0, y: 0, w: 400, d: 70 }];
        if (part === 'block') return [{ t: 'box', x: 0, y: 0, w: 190, d: 190 }];
        if (/^prop\d$/.test(part)) return [{ t: 'box', x: 0, y: 0, w: 120, d: 120 }];
        return null;
    },

    /** Фигуры JSON-формата { box: {...} } | { circle: {...} } | { t: ... } → формат Nav. */
    normalize(list) {
        const out = [];
        for (const s of list || []) {
            if (s.t) { out.push(s); continue; }
            if (s.box) out.push(Object.assign({ t: 'box' }, s.box));
            else if (s.circle) out.push(Object.assign({ t: 'circle' }, s.circle));
        }
        return out;
    },

    /**
     * Регистрирует коллизии деталей набора: все модели kit/<тема>-<деталь>.glb, что встречаются в картах
     * (GAME_MAPS), плюс темы из HS_KIT_SHAPES. Темы не перечислены кодом: арт-агент вправе переименовать их.
     */
    register() {
        const reg = {};
        const paths = new Set(Object.keys(HS_KIT_SHAPES));
        const maps = typeof GAME_MAPS !== 'undefined' ? GAME_MAPS : [];
        for (const m of maps) for (const o of (m.objects || [])) if (o.model && o.model.startsWith(this.PREFIX)) paths.add(o.model);
        for (const path of paths) {
            const part = (path.slice(this.PREFIX.length).replace(/\.glb$/, '').split('-').pop()) || '';
            const exact = HS_KIT_SHAPES[path];
            const shapes = exact && exact.length ? this.normalize(exact) : this.defaultShapes(part);
            if (shapes) reg[path] = shapes;
        }
        Nav.register(reg);
    },

    /** Объект карты — предмет темы (prop1…3), который можно проверить? */
    isProp(def) { return !!(def && def.model && /-prop\d\.glb$/.test(def.model)); },

    isHide(def) { return !!(def && def.model && /-hide\.glb$/.test(def.model)); },
};
