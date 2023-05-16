export default class Reparion extends Phaser.Character{
    constructor() {
        super('Reparion');
    }
    init(data) {
    }
    preload() {
        this.load.spritesheet('reparion', '../asset_lvl1/reparion.png',{ frameWidth: 256, frameHeight: 512 });
    }
    create() {
        this.player = this.physics.add.sprite(4*256, 14*256, 'reparion');
        this.player.setSize(256,512);
        this.player.setOffset(0,0);
        this.physics.add.collider(this.player, platform)
        this.player.setCollideWorldBounds(true);

        this.clavier = this.input.keyboard.addKeys('A,Z,E,R,Q,S,D,ENTER,ESC,SPACE');
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
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0*256, 0*256, 208*256, 20*256);
        console.log("test");
    }
    update(){
        if (this.clavier.Q.isDown && this.player.body.onFloor()) { 
            this.player.setVelocityX(-768);
            move = true; 
        }
        else if (this.clavier.D.isDown && this.player.body.onFloor()) { 
            this.player.setVelocityX(768);   
            move = true         
        }

        if (this.clavier.SPACE.isDown && this.clavier.Q.isDown && this.player.body.onFloor()) {
            this.player.setVelocityX(-512);
            this.player.setVelocityY(-1024);
        }
        else if (this.clavier.SPACE.isDown && this.clavier.D.isDown && this.player.body.onFloor()) {
            this.player.setVelocityX(512);
            this.player.setVelocityY(-1024);
        }
        else if(this.clavier.SPACE.isDown && this.player.body.onFloor()){
            this.player.setVelocityY(-1024);
        }
        else if(this.player.body.onFloor() && move == false){
            this.player.setVelocityX(0);
        }
        move = false;
    }
}