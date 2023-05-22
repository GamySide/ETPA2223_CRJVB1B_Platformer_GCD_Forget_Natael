export class Dummy extends Phaser.Physics.Arcade.Sprite {
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
        this.move = false;
        this.hurt = false;
        this.attaque = false;
        this.contactOccured = false;
        this.hurt = false;
        this.isHurt = false;
        this.bloup = false; // Ajout de la variable bloup

        // Paramètres
        this.setOrigin(0.5, 0.5);
        this.setCollideWorldBounds(true);

        // Contrôle
        console.log("test");
    }

    update() {
        // Réinitialiser le contactOccured à chaque mise à jour
        this.contactOccured = false;
    
        this.on('blup', (data) => {
            if (!this.contactOccured && !this.hurt && !this.isHurt) {
                console.log(data.information);
                this.contactOccured = true;
                this.hurt = true;
                this.isHurt = true;
                setTimeout(() => {
                    this.hurt = false;
                    setTimeout(() => {
                        this.isHurt = false;
                    }, 401);
                }, 401);
            }
        });
    }
    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }
}
