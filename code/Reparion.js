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
        this.move = false;
        this.dodge = false;
        this.hurt = false;
        this.attaque = false;
        this.screwdriver = false;
        this.pointeau = false;
        this.cameraMode = false;
        this.grab = false;


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
    update(){
        
        
        if (this.clavier.Q.isDown && this.player.body.onFloor()) { 
            this.player.setVelocityX(-1024);
            move = true; 
        }
        else if (this.clavier.D.isDown && this.player.body.onFloor()) { 
            this.player.setVelocityX(1024);   
            move = true         
        }

        if (this.clavier.SPACE.isDown && this.clavier.Q.isDown && this.player.body.onFloor()) {
            this.player.setVelocityX(-1024);
            this.player.setAccelerationY(-4096);
            setTimeout(() => {
                this.player.body.gravity.y = -768;
                this.player.setAccelerationY(0);
                setTimeout(() => {
                    this.player.body.gravity.y = 512;
                }, 256);
            }, 256);
            this.player.body.gravity.y = 0;
        }
        else if (this.clavier.SPACE.isDown && this.clavier.D.isDown && this.player.body.onFloor()) {
            this.player.setVelocityX(1024);
            this.player.setAccelerationY(-4096);
            setTimeout(() => {
                this.player.body.gravity.y = -768;
                this.player.setAccelerationY(0);
                setTimeout(() => {
                    this.player.body.gravity.y = 512;
                }, 256);
            }, 256);
            this.player.body.gravity.y = 0;
        }
        else if(this.clavier.SPACE.isDown && this.player.body.onFloor()){
            this.player.setAccelerationY(-4096);
            setTimeout(() => {
                this.player.body.gravity.y = -768;
                this.player.setAccelerationY(0);
                setTimeout(() => {
                    this.player.body.gravity.y = 512;
                }, 256);
            }, 256);
            this.player.body.gravity.y = 0;
            
        }
        else if(this.player.body.onFloor() && move == false){
            this.player.setVelocityX(0);
        }
        move = false;
        console.log(this.player.x);
        console.log(this.player.y);
        console.log(this.player.body.velocity.y);
    }
    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }
}