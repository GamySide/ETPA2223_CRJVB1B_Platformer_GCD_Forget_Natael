export class BugliansNRJ extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.initEvents();
        this.init();
    }
    init() {
        //Variable 
        this.collecter = false;
        this.contactOccured = false;

        //Controle

        //Parametre
        this.setOrigin(0.5, 0.5)
        this.setCollideWorldBounds(true);

    }

    update() {
        if (this.collecter == false) {
            this.body.gravity.y = -1024;

            this.on('contact', (data) => {
                if (this.contactOccured == false) {
                    console.log(data.information);
                    this.collecter = true;
                    this.contactOccured = true;
                }
            });
            this.contactOccured = false;
        }

    }
    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

}