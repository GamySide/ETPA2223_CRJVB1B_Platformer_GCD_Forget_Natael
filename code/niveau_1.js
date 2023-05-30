const switchCooldown = 1000;

// Créez une variable pour stocker la position cible de la caméra


import { Player } from "./Reparion.js"
import { Dummy } from "./dummy.js"
import { BugliansNRJ } from "./bugliansNRJ.js"
import { Detritus } from "./detritus.js"
import { Contacteur } from "./contacteur.js"
import { Box } from "./box.js"


export default class Niveau1 extends Phaser.Scene {
    constructor() {
        super('Niveau1');
    }
    init(data) {
    }
    preload() {
        this.load.image("tileset", "../asset_lvl1/placholder_sol.png");
        this.load.image("cross", "../asset_lvl1/cross.png");
        this.load.image("fond1", "../asset_lvl1/fond_niveau_1.png");
        this.load.image("fond2", "../asset_lvl1/fond_niveau_1(2).png");
        this.load.tilemapTiledJSON("map", "../asset_lvl1/map_lvl1.json");


        //pour le perso, à mettre dans chaque scene!!!
        this.load.spritesheet('reparion', '../asset_lvl1/reparion.png', { frameWidth: 256, frameHeight: 512 });
        //fin partie perso

        this.load.spritesheet('box', '../asset_lvl1/box.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('contacteur', '../asset_lvl1/contacteur.png', { frameWidth: 512, frameHeight: 1024 });
        this.load.spritesheet('dummy', '../asset_lvl1/dummy.png', { frameWidth: 256, frameHeight: 512 });
        this.load.spritesheet('bugliansNRJ', '../asset_lvl1/soulsCollect.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('detritus', '../asset_lvl1/ferraille.png', { frameWidth: 356, frameHeight: 800 });
        this.load.spritesheet('levier', '../asset_lvl1/lever.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('porte', '../asset_lvl1/piston.png', { frameWidth: 256, frameHeight: 1536 });
        this.load.spritesheet('porteClose', '../asset_lvl1/pistonClose.png', { frameWidth: 256, frameHeight: 1536 });
        this.load.spritesheet('button', '../asset_lvl1/red_button.png', { frameWidth: 260, frameHeight: 280 });
        this.load.spritesheet('pc', '../asset_lvl1/ordinateur.png', { frameWidth: 260, frameHeight: 280 });
    }



    create() {


        //pour le perso, à mettre dans chaque scene!!!
        this.attacking = false;
        this.notAttacking = true;
        this.touchYa = false;
        this.typeAtk = 1;
        this.lastReadTime = 0
        this.cant = false;
        this.faceLeft = false;
        this.faceRight = true;
        this.cameraMode = false;
        this.reparionMode = true;
        this.lastSwitchTime = 0;
        this.mode = 0
        this.mouseX = 0;
        this.mouseY = 0;
        this.tooFar = false;
        this.touchContactor = false;
        this.touchBox = false;
        this.interlevier = false;
        this.state = 0;
        this.buttonPress = false;
        this.buttonporteIsClosed = true;
        this.leverporteIsClosed = true;
        this.buttonstate = 0;
        this.paralaxSlowLeft = false;
        this.paralaxSlowRight = false;
        //fin partie perso

        const level1 = this.add.tilemap("map");
        const tileset = level1.addTilesetImage("placholder_sol", "tileset");
        this.fond1 = this.physics.add.sprite(0, 2320, 'fond1');
        this.fond1.setScale(15);
        this.fond1.body.gravity.y = -1024;
        this.fond2 = this.physics.add.sprite(19200, 2320, 'fond2');
        this.fond2.setScale(15);
        this.fond2.body.gravity.y = -1024;
        this.fond3 = this.physics.add.sprite(38400, 2320, 'fond1');
        this.fond3.setScale(15);
        this.fond3.body.gravity.y = -1024;
        this.fond4 = this.physics.add.sprite(57600, 2320, 'fond2');
        this.fond4.setScale(15)
        this.fond4.body.gravity.y = -1024;
        this.fond5 = this.physics.add.sprite(76800, 2320, 'fond1');
        this.fond5.setScale(15)
        this.fond5.body.gravity.y = -1024;
        const platform = level1.createLayer("platform", tileset);
        platform.setCollisionByProperty({ estSolide: true });

        this.lever = this.physics.add.sprite(45 * 256, 14 * 256, 'levier');
        this.lever.body.gravity.y = -1024;
        this.button = this.physics.add.sprite(55 * 256, 14 * 256, 'button');
        this.button.setSize(128, 100);

        this.anims.create({
            key: 'push',
            frames: this.anims.generateFrameNumbers('button', { start: 0, end: 4 }),
            frameRate: 4,
            repeat: 0
        });
        this.anims.create({
            key: 'depush',
            frames: this.anims.generateFrameNumbers('button', { start: 0, end: 0 }),
            frameRate: 4,
            repeat: 0
        });

        this.anims.create({
            key: 'on',
            frames: this.anims.generateFrameNumbers('levier', { start: 1, end: 1 }),
            frameRate: 10,
            repeat: 1
        });
        this.anims.create({
            key: 'off',
            frames: this.anims.generateFrameNumbers('levier', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: 1
        });

        this.porteLevier = this.physics.add.sprite(50 * 256, 12.75 * 256, 'porte');
        this.porteLevier.body.gravity.y = -1024;

        this.anims.create({
            key: 'open',
            frames: this.anims.generateFrameNumbers('porte', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'close',
            frames: this.anims.generateFrameNumbers('porteClose', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: 0
        });

        this.porteButton = this.physics.add.sprite(60 * 256, 12.75 * 256, 'porte');
        this.porteButton.body.gravity.y = -1024;

        this.pc1 = this.physics.add.sprite(75 * 256, 12.75 * 256, 'pc');
        this.pc1.setSize(256, 200);
        this.pc1.setOffset(0, 0);
        this.pc1.setScale(10);

        //pour le perso, à mettre dans chaque scene!!!
        this.player = new Player(this, 4 * 256, 14 * 256, "reparion");
        //fin partie perso


        this.littleOne = new BugliansNRJ(this, 10 * 256, 13 * 256, "bugliansNRJ");
        this.littleOne.setSize(20, 20);
        this.littleOne.setOffset(128, 128);
        this.littleOne.setScale(0.5);
        this.detritus = new Detritus(this, 20 * 256, 14.67 * 256, "detritus");
        this.detritus.setSize(800, 25);
        this.detritus.setOffset(0, 531);
        this.detritus.setScale(1);
        this.dummy = new Dummy(this, 30 * 256, 14.67 * 256, "dummy");
        this.dummy.setSize(256, 512);
        this.dummy.setOffset(0, 0);
        this.dummy.setScale(1);
        this.physics.add.collider(this.player, platform)
        this.physics.add.collider(this.player, this.porteLevier)
        this.physics.add.collider(this.player, this.porteButton)
        this.physics.add.collider(this.dummy, platform)
        this.physics.add.overlap(this.player, this.dummy, () => {
            if (this.attacking == true) {
                this.dummy.emit('blup', { information: 'bloup bloup bloup' });
            }
            if (this.attacking == false) {
                this.player.emit('ouch', { information: 'aie' });
            }
        });
        this.physics.add.overlap(this.player, this.detritus, () => {
            this.player.emit('ouch', { information: 'aie' });
        });



        this.physics.add.overlap(this.player, this.lever, () => {
            if (this.clavier.R.isDown) {
                this.interlevier = true;
            }
        });

        this.contacteur = new Contacteur(this, 40 * 256, 13.67 * 256, "contacteur");
        this.contacteur.setInteractive(); // Rendre l'objet interactif
        this.contacteur.setSize(450, 1024);
        this.contacteur.setOffset(30, 0);
        this.contacteur.setScale(1);
        this.contacteur.setInteractive(); // Permet d'activer les événements de survol

       






        this.physics.add.collider(this.player, this.contacteur)
        this.physics.add.collider(this.contacteur, platform)






        this.box = new Box(this, 65 * 256, 13.67 * 256, "box");
        this.box.setInteractive(); // Rendre l'objet interactif
        this.box.setSize(256, 256);
        this.box.setOffset(0, 0);
        this.box.setScale(1);

        





        this.physics.add.collider(this.button, this.box, () => {
            this.buttonPress = true;
        });
        this.physics.add.overlap(this.player, this.pc1, () => {
            if (this.clavier.R.isDown)
                this.pc1enter = true;
        });
        this.physics.add.collider(this.player, this.box)
        this.physics.add.collider(platform, this.button)
        this.physics.add.collider(platform, this.pc1)
        this.physics.add.collider(this.box, platform)
        this.clavier = this.input.keyboard.addKeys('Q,D,SPACE,SHIFT,A,Z,E,R,X,ALT,CTRL,F');
        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.world.setBounds(0 * 256, 0 * 256, 180* 256, 20 * 256);


        //pour le perso, à mettre dans chaque scene!!!
        this.cameras.main.startFollow(this.player);
        //fin partie perso

        this.cameras.main.setBounds(0 * 256, 0 * 256, 180 * 256, 20 * 256);
        this.cameras.main.setZoom(1);
        console.log("test");
        this.input.setDefaultCursor('none');
        this.objetSuiveur = this.add.sprite(4 * 256, 14 * 256, 'cross');
        this.pc1.setImmovable(true);

    }


    update() {
        this.porteLevier.setImmovable(true);
        this.porteButton.setImmovable(true);



        this.contacteur.on('pointerdown', () => {
            // Code à exécuter lors du clic sur l'objet contacteur
            this.touchContactor = true;
            console.log(this.touchContactor);
            // Ajoutez ici votre code pour changer l'apparence du contacteur
        });
        this.contacteur.on('pointerup', () => {
            // Code à exécuter lors du clic sur l'objet contacteur
            this.touchContactor = false;
            console.log(this.touchContactor);
            // Ajoutez ici votre code pour changer l'apparence du contacteur
        });
        this.contacteur.on('pointerover', () => {


        });
        this.contacteur.on('pointerout', () => {
            this.touchContactor = false
        });






        this.box.on('pointerdown', () => {
            // Code à exécuter lors du clic sur l'objet box
            this.touchBox = true;
            console.log(this.touchBox);
            // Ajoutez ici votre code pour changer l'apparence du box
        });
        this.box.on('pointerup', () => {
            // Code à exécuter lors du clic sur l'objet box
            this.touchBox = false;
            console.log(this.touchBox);
            // Ajoutez ici votre code pour changer l'apparence du box
        });
        this.box.on('pointerover', () => {


        });
        this.box.on('pointerout', () => {
            this.touchBox = false;
        });





        //pour le perso, à mettre dans chaque scene!!!
        const currentTime = Date.now();
        this.objetSuiveur.x = this.input.activePointer.worldX;
        this.objetSuiveur.y = this.input.activePointer.worldY;


        //fin partie perso


        this.physics.add.overlap(this.player, this.littleOne, () => {
            this.player.emit('absorbtion', { information: 'énergie absorbé' });
            this.littleOne.emit('contact', { information: 'Contact détecté' });
            this.littleOne.destroy();
        });


        //pour le perso, à mettre dans chaque scene!!!

        // Contrôle du mode caméra pour suivre la souris
        /*if (this.cameraMode && this.faceLeft) {
            this.cameras.main.startFollow(this.objetSuiveur);
            this.cameras.main.setBounds(this.player.x - 2192*2, this.player.y - 2200, -this.player.x + 2192*2, this.player.y - 200);
        }*/
        const distanceXpositif = 1000;
        const distanceXnegatif = - 1000;
        if (this.cameraMode && this.tooFar == false) {
            var dx = this.objetSuiveur.x - this.cameras.main.scrollX;
            var dy = this.objetSuiveur.y - this.cameras.main.scrollY;

            // Définissez une vitesse de suivi plus lente (vous pouvez ajuster cette valeur selon vos besoins)
            var speed = 0.05;

            // Déplacez la caméra progressivement vers la position cible en utilisant l'interpolation linéaire
            this.cameras.main.scrollX += dx * speed;
            this.cameras.main.scrollY += dy * speed;

        }




        if (this.reparionMode) {
            this.cameras.main.startFollow(this.player);
            this.cameras.main.setBounds(0 * 256, 9 * 256, 180 * 256, 10 * 256);
        }

        if (this.clavier.Q.isDown) {
            this.faceLeft = true;
            this.faceRight = false;
        }
        if (this.clavier.D.isDown) {
            this.faceLeft = false;
            this.faceRight = true;
        }
        if (currentTime - this.lastReadTime >= 400 && this.reparionMode == true && this.cameraMode == false) {
            this.lastReadTime = currentTime;
            if (this.clavier.A.isDown && !this.cant && this.faceRight == true && this.reparionMode == true && this.cameraMode == false) {
                this.createAtkHammerRight(this.typeAtk)
                this.time.delayedCall(1600, () => {
                    this.cant = true;
                    this.attacking = false;
                    this.typeAtk = 1;
                    this.player.setSize(256, 512);
                    this.player.setOffset(0, 0);
                }, this);
                this.attacking = true;
            }
            if (this.clavier.A.isDown && !this.cant && this.faceLeft == true && this.reparionMode == true && this.cameraMode == false) {
                this.createAtkHammerLeft(this.typeAtk)
                this.time.delayedCall(1600, () => {
                    this.cant = true;
                    this.attacking = false;
                    this.typeAtk = 1;
                    this.player.setSize(256, 512);
                    this.player.setOffset(0, 0);
                }, this);
                this.attacking = true;
            }
            this.cant = false;


        }


        //definir le mode pour empecher mouvement pendant mode caméra
        if (this.clavier.Z.isDown && this.mode === 0 && Date.now() - this.lastSwitchTime >= switchCooldown) {
            this.lastSwitchTime = Date.now();
            this.cameraMode = true;
            this.mode = 1;
            this.reparionMode = false;
            this.box.body.gravity.y = -1024;
            console.log(this.mode);
        }

        if (this.clavier.Z.isDown && this.mode === 1 && Date.now() - this.lastSwitchTime >= switchCooldown) {
            this.lastSwitchTime = Date.now();
            this.cameraMode = false;
            this.mode = 0;
            this.reparionMode = true;
            this.box.body.gravity.y = 0;
            console.log(this.mode);
        }



        //pour le contacteur (à revoir plus tard)
        if (this.touchContactor == false) {
            //console.log("STOP")
        }
        if (this.touchContactor == true && this.cameraMode == true) {
            //console.log("ooououououo very scary")
            this.contacteur.x = this.input.activePointer.worldX;
            this.contacteur.y = this.input.activePointer.worldY;

        }




        /*//pour le box (à revoir plus tard)
        if (this.touchBox == false) {
            //console.log("STOP")
        }*/
        if (this.touchBox == true && this.cameraMode == true) {
            //console.log("ooououououo very scary")
            this.box.x = this.input.activePointer.worldX;
            this.box.y = this.input.activePointer.worldY;
            // Redessiner les outlines aux nouvelles positions du box

        }

        if (this.interlevier == true && this.state == 0 && this.leverporteIsClosed == true) {
            console.log('clic')
            this.lever.anims.play('on', true);
            this.porteLevier.anims.play('open', true);
            this.porteLevier.setOffset(0, -650)
            this.state = 1;
            this.time.delayedCall(1000, () => {
                this.leverporteIsClosed = false;
            }, this);
        }
        else if (this.interlevier == true && this.state == 1 && this.leverporteIsClosed == false) {
            console.log('clic')
            this.lever.anims.play('off', true);
            this.porteLevier.anims.play('close', true);
            this.porteLevier.setOffset(0, 0)
            this.state = 0;
            this.time.delayedCall(1000, () => {
                this.leverporteIsClosed = true;
            }, this);
        }

        if (this.buttonPress == true && this.buttonporteIsClosed == true) {
            this.button.anims.play('push', true);
            this.porteButton.anims.play('open', true);
            this.porteButton.setOffset(0, -650);
            this.time.delayedCall(1000, () => {
                this.buttonporteIsClosed = false;
                this.buttonstate = 1;
            }, this);

        }
        else if (this.buttonPress == false && this.buttonporteIsClosed == false) {
            this.button.anims.play('depush', true);
            this.porteButton.anims.play('close', true);
            this.porteButton.setOffset(0, 0);
            this.time.delayedCall(1000, () => {
                this.buttonporteIsClosed = true;
                this.buttonstate = 0;
            }, this);
        }
        if(this.pc1enter == true){
            location.reload();
        }
        this.player.on('right', (data) => {
                this.fond1.setVelocityX(-512);
                this.fond2.setVelocityX(-512);
                this.fond3.setVelocityX(-512);
                this.fond4.setVelocityX(-512);
                this.fond5.setVelocityX(-512);
        });
        this.player.on('left', (data) => {
                this.fond1.setVelocityX(+512);
                this.fond2.setVelocityX(+512);
                this.fond3.setVelocityX(+512);
                this.fond4.setVelocityX(+512);
                this.fond5.setVelocityX(+512);
        });
        this.player.on('stationnaire', (data) => {
            this.fond1.setVelocityX(0);
            this.fond2.setVelocityX(0);
            this.fond3.setVelocityX(0);
            this.fond4.setVelocityX(0);
            this.fond5.setVelocityX(0);
        });
        

        
        
        
            
        

        this.buttonPress = false;
        this.interlevier = false;
        this.paralaxSlowLeft = false;
        this.paralaxSlowRight = false;
        
        





        //fin partie perso



    }
    //à revoir plus tard
    refreshDisplayContactor() {
        // Mettre à jour les coordonnées du contacteur
        this.contacteur.x = this.objetSuiveur.x;
        this.contacteur.y = this.objetSuiveur.y;

        // Mettre à jour les positions des outlines en fonction du contacteur
        contacteurOutlineBlue.x = this.contacteur.x;
        contacteurOutlineBlue.y = this.contacteur.y;
        contacteurOutlineRed.x = this.contacteur.x;
        contacteurOutlineRed.y = this.contacteur.y;

        // Autres opérations de rafraîchissement de l'affichage
        // ...
    }
    //à revoir plus tard
    refreshDisplayBox() {
        // Mettre à jour les coordonnées du box
        this.box.x = this.objetSuiveur.x;
        this.box.y = this.objetSuiveur.y;

        // Mettre à jour les positions des outlines en fonction du box
        boxOutlineBlue.x = this.box.x;
        boxOutlineBlue.y = this.box.y;
        boxOutlineRed.x = this.box.x;
        boxOutlineRed.y = this.box.y;

        // Autres opérations de rafraîchissement de l'affichage
        // ...
    }

    //pour le perso, à mettre dans chaque scene!!!
    createAtkHammerRight(valeur) {
        if (valeur == 1 && this.reparionMode == true && this.cameraMode == false) {
            console.log(1);
            this.player.setSize(640, 768);
            this.player.setOffset(0, -256);
            this.typeAtk = 2;
            this.attacking = true;
        }
        if (valeur == 2 && this.reparionMode == true && this.cameraMode == false) {
            console.log(2);
            this.player.setSize(1024, 400);
            this.player.setOffset(0, 112);
            this.typeAtk = 3;
            this.attacking = true;
        }
        if (valeur == 3 && this.reparionMode == true && this.cameraMode == false) {
            console.log(3);
            this.player.setSize(827, 640);
            this.player.setOffset(0, -128);
            this.attacking = true;
        }
    }
    //fin partie perso


    //pour le perso, à mettre dans chaque scene!!!
    createAtkHammerLeft(valeur) {
        if (valeur == 1 && this.reparionMode == true && this.cameraMode == false) {
            console.log(1);
            this.player.setSize(640, 768);
            this.player.setOffset(-384, -256);
            this.typeAtk = 2;
            this.attacking = true;
        }
        if (valeur == 2 && this.reparionMode == true && this.cameraMode == false) {
            console.log(2);
            this.player.setSize(1024, 400);
            this.player.setOffset(-768, 112);
            this.typeAtk = 3;
            this.attacking = true;
        }
        if (valeur == 3 && this.reparionMode == true && this.cameraMode == false) {
            console.log(3);
            this.player.setSize(827, 640);
            this.player.setOffset(-571, -128);
            this.typeAtk = 1;
            this.attacking = true;
        }

    }
    //fin partie perso


}

