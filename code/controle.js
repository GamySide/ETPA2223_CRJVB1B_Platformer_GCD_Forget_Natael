export default class Controle extends Phaser.Scene {
    constructor() {
        super('controle');
    }
    preload() {
        this.load.image("controle", "../asset_lvl1/control.png");
        this.load.image("start", "../asset_lvl1/start.png");
    }
    create() {
        this.add.image(512, 287, 'controle');
        
        this.clavier = this.input.keyboard.addKeys('A,Z,E,R,Q,S,D,ENTER,ESC');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.pad = {
            leftStick: { x: 0, y: 0 },
            rightStick: { x: 0, y: 0 },
            A: false,
            B: false,
            X: false,
            Y: false,
            L1: 0,
            L2: 0,
            R1: 0,
            R2: 0,
            right: false,
            left: false,
            up: false,
            down: false,
        }

    }
    update() {
        if(this.clavier.ENTER.isDown) {
            this.scene.start('Niveau1',{});
        }
        if (this.clavier.ESC.isDown) {
            location.reload();
        }
    }

}