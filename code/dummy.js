export class Dummy extends Phaser.Physics.Arcade.Sprite {
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
        this.move = false;
        this.hurt = false;
        this.attaque = false;


        //Controle

        console.log("test");

        //Parametre
        this.setOrigin(0.5, 0.5)
        this.setCollideWorldBounds(true);
    }

    update() {
       
    }
    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }
    
}