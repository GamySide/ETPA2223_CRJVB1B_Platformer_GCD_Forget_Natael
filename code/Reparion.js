export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.initEvents();
    }
    init() {
        //Variable 
        this.alive = true;
        this.nrj = 0;
        this.hp = 5;
        this.hpMax = 5;
        this.hplvl = 1;
        this.atklvl = 1;
        this.deflvl = 1;
        this.dodgelvl = 1;
        this.endurancelvl = 1;
        this.reslvl = 1;
        this.dodge = false;
        this.hurt = false;
        this.attaque = false;
        this.screwdriver = false;
        this.pointeau = false;
        this.cameraMode = false;
        this.grab = false;


        //Controle
        this.cursors = this.scene.input.keyboard.createCursorKeys(); //Déplacement huit direction
        this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A); //Attaque CaC
        this.keyZ = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z); //Attaque Distance
        this.keyE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E); //Parry

        //Parametre
        this.setOrigin(0.5, 0.5)
        this.setCollideWorldBounds(true);
    }
}