class Niveau1 extends Phaser.Scene {
    constructor() {
        super('Niveau1');
    }
    init(data) {
    }
    preload() {
        this.load.image("tileset", "../asset_lvl1/placholder_sol.png");
        this.load.image("fond1", "../asset_lvl1/fond niveau 1.png");
        this.load.image("fond2", "../asset_lvl1/fond niveau 1(2).png");
        this.load.tilemapTiledJSON("map", "../asset_lvl1/map_lvl1.json");
    }
    create() {
        this.physics.world.setBounds(0, 0, 1600, 1600);
        const level1 = this.add.tilemap("map");
        const tileset = level1.addTilesetImage("placholder_sol", "tileset");
        const platform = level1.createLayer("platform", tileset);
    }
    update() { }
}
export default Niveau1