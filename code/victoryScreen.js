export default class Victoryscreen extends Phaser.Scene {
    constructor() {
        super('victoryscreen');
    }
    preload() {
        this.load.image("victoryScreen", "../asset_lvl1/victoryScreen.png");
        this.load.image("start", "../asset_lvl1/start.png");
    }
    create() {
        this.add.image(512, 287, 'victoryScreen');
        
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
            location.reload();
        }
        if (this.clavier.ESC.isDown) {
            window.close();
        }
    }

}