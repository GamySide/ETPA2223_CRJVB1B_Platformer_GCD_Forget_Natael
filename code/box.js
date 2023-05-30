export class Box extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.initEvents();
        this.init();
    }

    init() {
        // Variables
        // Paramètres
        this.setOrigin(0.5, 0.5);
        this.setCollideWorldBounds(true);

        // Contrôle
        console.log("test");
    }

    update() {
        this.setVelocityX(0);
        
        
    }
    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }
}