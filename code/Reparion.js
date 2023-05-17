export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.initEvents();
        this.init();
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
        this.move = false;
        this.dodge = false;
        this.hurt = false;
        this.attaque = false;
        this.screwdriver = false;
        this.pointeau = false;
        this.cameraMode = false;
        this.grab = false;
        this.contactOccured = false;

        //Controle
        this.clavier = this.scene.input.keyboard.addKeys('Q,D,SPACE,SHIFT,A,Z,E,R,X,ALT,CTRL,F');

        this.cursors = this.scene.input.keyboard.createCursorKeys();
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
            start: false,
            select: false,
        }

        console.log("test");

        //Parametre
        this.setOrigin(0.5, 0.5)
        this.setCollideWorldBounds(true);
    }

    update() {
        if (this.clavier.Q.isDown && this.body.onFloor()) {
            this.setVelocityX(-1024);
            this.move = true;
        } else if (this.clavier.D.isDown && this.body.onFloor()) {
            this.setVelocityX(1024);
            this.move = true;
        }

        if (this.clavier.SPACE.isDown && this.clavier.Q.isDown && this.body.onFloor()) {
            this.setVelocityX(-1024);
            this.setAccelerationY(-4096);
            setTimeout(() => {
                this.body.gravity.y = -768;
                this.setAccelerationY(0);
                setTimeout(() => {
                    this.body.gravity.y = 512;
                }, 256);
            }, 256);
            this.body.setGravityY(0);
        } else if (this.clavier.SPACE.isDown && this.clavier.D.isDown && this.body.onFloor()) {
            this.setVelocityX(1024);
            this.setAccelerationY(-4096);
            setTimeout(() => {
                this.body.gravity.y = -768;
                this.setAccelerationY(0);
                setTimeout(() => {
                    this.body.gravity.y = 512;
                }, 256);
            }, 256);
            this.body.setGravityY(0);
        } else if (this.clavier.SPACE.isDown && this.body.onFloor()) {
            this.setAccelerationY(-4096);
            setTimeout(() => {
                this.body.gravity.y = -768;
                this.setAccelerationY(0);
                setTimeout(() => {
                    this.body.gravity.y = 512;
                }, 256);
            }, 256);
            this.body.setGravityY(0);
        }
        else if (this.body.onFloor() && !this.move) {
            this.setVelocityX(0);
        }

        this.on('absorbtion', (data) => {
            if (this.contactOccured == false) {
            console.log(data.information);
            this.collecter = true;
            this.nrj += 10;
            console.log(this.nrj);
            this.contactOccured = true;
            }
        });
        this.contactOccured = false;

        this.move = false;
    }
    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

}