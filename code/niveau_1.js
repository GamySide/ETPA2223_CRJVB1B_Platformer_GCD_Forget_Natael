var move = false;

export default class Niveau1 extends Phaser.Scene {
    constructor() {
        super('Niveau1');
    }
    init(data) {
    }
    preload() {
        this.load.image("tileset", "../asset_lvl1/placholder_sol.png");
        this.load.image("fond1", "../asset_lvl1/fond_niveau_1.png");
        this.load.image("fond2", "../asset_lvl1/fond_niveau_1(2).png");
        this.load.tilemapTiledJSON("map", "../asset_lvl1/map_lvl1.json");
        this.load.spritesheet('reparion', '../asset_lvl1/reparion.png',{ frameWidth: 256, frameHeight: 512 });
    }


    create() {
        const level1 = this.add.tilemap("map");
        const tileset = level1.addTilesetImage("placholder_sol", "tileset");
        this.fond1 = this.add.image(0, 2320 ,'fond1');
        this.fond1.setScale(15);
        this.fond2 = this.add.image(19200, 2320,'fond2');
        this.fond2.setScale(15);
        this.fond3 = this.add.image(38400, 2320 ,'fond1');
        this.fond3.setScale(15);
        this.fond4 = this.add.image(47600, 2320,'fond2');
        this.fond4.setScale(15)
        const platform = level1.createLayer("platform", tileset);
        platform.setCollisionByProperty({estSolide:true});
        
        

        this.player = this.physics.add.sprite(2*256, 14*256, 'reparion');
        this.player.setSize(256,512);
        this.player.setOffset(0,0);
        this.physics.add.collider(this.player, platform)
        this.player.setCollideWorldBounds(true);

        this.clavier = this.input.keyboard.addKeys('Q,D,SPACE,SHIFT,A,Z,E,R,X,ALT,CTRL,F');
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
            start: false,
            select: false,
        }
        this.physics.world.setBounds(0*256, 0*256, 208*256, 20*256);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0*256, 0*256, 208*256, 20*256);
        console.log("test");
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
}