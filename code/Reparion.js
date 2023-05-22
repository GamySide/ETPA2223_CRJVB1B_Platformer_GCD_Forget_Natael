const dodgeCooldown = 1000;

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.initEvents();
        this.init();
    }

    init() {
        // Variables
        this.alive = true;
        this.nrj = 0;
        this.hp = 5;
        this.hpMax = 5;
        this.hplvl = 1;
        this.atklvl = 1;
        this.deflvl = 1;
        this.endurancelvl = 1;
        this.reslvl = 1;
        this.dodgelvl = 1;
        this.move = false;
        this.dodge = false;
        this.hurt = false;
        this.attaque = false;
        this.screwdriver = false;
        this.pointeau = false;
        this.cameraMode = false;
        this.grab = false;
        this.contactOccured = false;
        this.dodgeExecuted = false;
        this.lastDodgeTime = 0;
        this.isDodging = false;
        this.isHurt = false;

        // Contrôles
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
        };

        console.log("test");

        // Paramètres
        this.setOrigin(0.5, 0.5);
        this.setCollideWorldBounds(true);
    }
    preload() {
        this.load.image("hitbox", "../assets/Hitbox.png");
    }
    create(){
        this.hammerLowAtk1 = this.physics.add.sprite(6*256, 14*256, 'hitbox');
        this.hammerLowAtk1.setSize(20, 20);
        this.hammerLowAtk1.body.gravity.y = -1024;
    }
    update() {
        if (this.clavier.Q.isDown && this.body.onFloor() && !this.isDodging) {
            this.setVelocityX(-1024);
            this.move = true;
        } else if (this.clavier.D.isDown && this.body.onFloor() && !this.isDodging) {
            this.setVelocityX(1024);
            this.move = true;
        }

        if (this.clavier.SPACE.isDown && this.clavier.Q.isDown && this.body.onFloor() && !this.isDodging) {
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
        } else if (this.clavier.SPACE.isDown && this.clavier.D.isDown && this.body.onFloor() && !this.isDodging) {
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
        } else if (this.clavier.SPACE.isDown && this.body.onFloor() && !this.isDodging) {
            this.setAccelerationY(-4096);
            setTimeout(() => {
                this.body.gravity.y = -768;
                this.setAccelerationY(0);
                setTimeout(() => {
                    this.body.gravity.y = 512;
                }, 256);
            }, 256);
            this.body.setGravityY(0);
        } else if (this.body.onFloor() && !this.move && !this.isDodging) {
            this.setVelocityX(0);
        }

        const currentTime = Date.now();
        if (this.clavier.SHIFT.isDown && this.clavier.D.isDown && !this.isDodging && currentTime - this.lastDodgeTime >= dodgeCooldown) {
            this.setVelocityX(5000);
            this.setVelocityY(0);
            this.body.gravity.y = -1024;
            this.isDodging = true;
            this.lastDodgeTime = currentTime;
            setTimeout(() => {
                this.setVelocityX(0);
                this.setVelocityY(0);
                this.isDodging = false;
                this.body.gravity.y = 0;
            }, this.dodgelvl * 10 + 300);
        }

        if (this.clavier.SHIFT.isDown && this.clavier.Q.isDown && !this.isDodging && currentTime - this.lastDodgeTime >= dodgeCooldown) {
            this.setVelocityX(-5000);
            this.setVelocityY(0);
            this.body.gravity.y = -1024;
            this.isDodging = true;
            this.lastDodgeTime = currentTime;
            setTimeout(() => {
                this.setVelocityX(0);
                this.setVelocityY(0);
                this.isDodging = false;
                this.body.gravity.y = 0;
            }, this.dodgelvl * 10 + 300);
        }

        this.on('absorbtion', (data) => {
            if (!this.contactOccured) {
                console.log(data.information);
                this.collecter = true;
                this.nrj += 10;
                console.log(this.nrj);
                this.contactOccured = true;
            }
        });

        this.on('ouch', (data) => {
            if (!this.contactOccured && !this.hurt && !this.isDodging && !this.isHurt) {
                console.log(data.information);
                this.hp -= 1;
                console.log(this.hp);
                this.contactOccured = true;
                this.hurt = true;
                this.isHurt = true;
                setTimeout(() => {
                    this.hurt = false;
                    setTimeout(() => {
                        this.isHurt = false;
                    }, 1000);
                }, 1000);
            }
        });

        this.contactOccured = false;
        this.move = false;
    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }
}