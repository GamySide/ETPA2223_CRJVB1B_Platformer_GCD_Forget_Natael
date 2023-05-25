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
        //fin partie perso

        const level1 = this.add.tilemap("map");
        const tileset = level1.addTilesetImage("placholder_sol", "tileset");
        this.fond1 = this.add.image(0, 2320, 'fond1');
        this.fond1.setScale(15);
        this.fond2 = this.add.image(19200, 2320, 'fond2');
        this.fond2.setScale(15);
        this.fond3 = this.add.image(38400, 2320, 'fond1');
        this.fond3.setScale(15);
        this.fond4 = this.add.image(57600, 2320, 'fond2');
        this.fond4.setScale(15)
        const platform = level1.createLayer("platform", tileset);
        platform.setCollisionByProperty({ estSolide: true });

        this.lever = this.physics.add.sprite(45*256, 14*256,'levier');
        this.lever.body.gravity.y = -1024;

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

        this.porte = this.physics.add.sprite(50*256, 12.75*256,'porte');
        this.porte.body.gravity.y = -1024;

        this.anims.create({
            key: 'open',
            frames: this.anims.generateFrameNumbers('porte', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: 0
        });

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
        this.physics.add.collider(this.player, this.porte)
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
            this.interlevier = true;
        });

        this.contacteur = new Contacteur(this, 40 * 256, 13.67 * 256, "contacteur");
        this.contacteur.setInteractive(); // Rendre l'objet interactif
        this.contacteur.setSize(450, 1024);
        this.contacteur.setOffset(30, 0);
        this.contacteur.setScale(1);
        this.contacteur.setInteractive(); // Permet d'activer les événements de survol

        this.contacteurOutlineRed = this.add.graphics();
        this.contacteurOutlineBlue = this.add.graphics();
        /* this.contacteur.on('pointerover', () => {
 
             this.contacteurOutlineRed.alpha = 1; // Rend le contour visible
 
         });
         this.contacteur.on('pointerout', () => {
             this.touchContactor = false
             this.contacteurOutlineRed.alpha = 0; // Rend le contour invisible
         });*/



        this.contacteurOutlineRed.lineStyle(20, 0xff0000, 1);
        this.contacteurOutlineRed.strokeRect(this.contacteur.x - 226, this.contacteur.y - 512, 450, 1024);
        this.contacteurOutlineRed.alpha = 0; // Le contour est invisible au début
        this.contacteurOutlineBlue.lineStyle(20, 0x0000ff, 1);
        this.contacteurOutlineBlue.strokeRect(this.contacteur.x - 226, this.contacteur.y - 512, 450, 1024);
        this.contacteurOutlineBlue.alpha = 0; // Le contour est invisible au début
        /*this.contacteur.on('pointerdown', () => {
            // Code à exécuter lors du clic sur l'objet contacteur
            this.touchContactor = true;
            this.contacteurOutlineBlue.alpha = 1;
            this.contacteurOutlineRed.alpha = 0;
            console.log(this.touchContactor);
            // Ajoutez ici votre code pour changer l'apparence du contacteur
        });
        this.contacteur.on('pointerup', () => {
            // Code à exécuter lors du clic sur l'objet contacteur
            this.touchContactor = false;
            this.contacteurOutlineBlue.alpha = 0;
            this.contacteurOutlineRed.alpha = 1;
            console.log(this.touchContactor);
            // Ajoutez ici votre code pour changer l'apparence du contacteur
        });*/
        // Créer le groupe d'affichage pour les outlines
        var outlinesGroup = this.add.group();

        // Créer les outlines en tant qu'objets graphiques
        var contacteurOutlineBlue = this.add.graphics();
        var contacteurOutlineRed = this.add.graphics();

        // Ajouter les outlines au groupe d'affichage
        outlinesGroup.add(contacteurOutlineBlue);
        outlinesGroup.add(contacteurOutlineRed);






        this.physics.add.collider(this.player, this.contacteur)
        this.physics.add.collider(this.contacteur, platform)






        this.box = new Box(this, 10 * 256, 13.67 * 256, "box");
        this.box.setInteractive(); // Rendre l'objet interactif
        this.box.setSize(256, 256);
        this.box.setOffset(0, 0);
        this.box.setScale(1);
        this.box.setInteractive(); // Permet d'activer les événements de survol

        this.boxOutlineRed = this.add.graphics();
        this.boxOutlineBlue = this.add.graphics();
        /* this.box.on('pointerover', () => {
 
             this.boxOutlineRed.alpha = 1; // Rend le contour visible
 
         });
         this.box.on('pointerout', () => {
             this.touchContactor = false
             this.boxOutlineRed.alpha = 0; // Rend le contour invisible
         });*/



        this.boxOutlineRed.lineStyle(20, 0xff0000, 1);
        this.boxOutlineRed.strokeRect(this.box.x + 256, this.box.y + 256, 256, 256);
        this.boxOutlineRed.alpha = 0; // Le contour est invisible au début
        this.boxOutlineBlue.lineStyle(20, 0x0000ff, 1);
        this.boxOutlineBlue.strokeRect(this.box.x + 256, this.box.y + 256, 256, 256);
        this.boxOutlineBlue.alpha = 0; // Le contour est invisible au début
        /*this.box.on('pointerdown', () => {
            // Code à exécuter lors du clic sur l'objet box
            this.touchContactor = true;
            this.boxOutlineBlue.alpha = 1;
            this.boxOutlineRed.alpha = 0;
            console.log(this.touchContactor);
            // Ajoutez ici votre code pour changer l'apparence du box
        });
        this.box.on('pointerup', () => {
            // Code à exécuter lors du clic sur l'objet box
            this.touchContactor = false;
            this.boxOutlineBlue.alpha = 0;
            this.boxOutlineRed.alpha = 1;
            console.log(this.touchContactor);
            // Ajoutez ici votre code pour changer l'apparence du box
        });*/
        // Créer le groupe d'affichage pour les outlines
        var outlinesGroupBox = this.add.group();

        // Créer les outlines en tant qu'objets graphiques
        var boxOutlineBlue = this.add.graphics();
        var boxOutlineRed = this.add.graphics();

        // Ajouter les outlines au groupe d'affichage
        outlinesGroupBox.add(boxOutlineBlue);
        outlinesGroupBox.add(boxOutlineRed);






        this.physics.add.collider(this.player, this.box)
        this.physics.add.collider(this.box, platform)
        this.clavier = this.input.keyboard.addKeys('Q,D,SPACE,SHIFT,A,Z,E,R,X,ALT,CTRL,F');
        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.world.setBounds(0 * 256, 0 * 256, 208 * 256, 20 * 256);


        //pour le perso, à mettre dans chaque scene!!!
        this.cameras.main.startFollow(this.player);
        //fin partie perso

        this.cameras.main.setBounds(0 * 256, 0 * 256, 208 * 256, 20 * 256);
        this.cameras.main.setZoom(0.25);
        console.log("test");
        this.input.setDefaultCursor('none');
        this.objetSuiveur = this.add.sprite(4 * 256, 14 * 256, 'cross');

    }


    update() {
        this.porte.setImmovable(true);
        


        this.contacteur.on('pointerdown', () => {
            // Code à exécuter lors du clic sur l'objet contacteur
            this.touchContactor = true;
            this.contacteurOutlineBlue.alpha = 1;
            this.contacteurOutlineRed.alpha = 0;
            console.log(this.touchContactor);
            // Ajoutez ici votre code pour changer l'apparence du contacteur
        });
        this.contacteur.on('pointerup', () => {
            // Code à exécuter lors du clic sur l'objet contacteur
            this.touchContactor = false;
            this.contacteurOutlineBlue.alpha = 0;
            this.contacteurOutlineRed.alpha = 1;
            console.log(this.touchContactor);
            // Ajoutez ici votre code pour changer l'apparence du contacteur
        });
        this.contacteur.on('pointerover', () => {

            this.contacteurOutlineRed.alpha = 1; // Rend le contour visible

        });
        this.contacteur.on('pointerout', () => {
            this.touchContactor = false
            this.contacteurOutlineRed.alpha = 0; // Rend le contour invisible
        });





        
        this.box.on('pointerdown', () => {
            // Code à exécuter lors du clic sur l'objet box
            this.touchBox = true;
            this.boxOutlineBlue.alpha = 1;
            this.boxOutlineRed.alpha = 0;
            console.log(this.touchBox);
            // Ajoutez ici votre code pour changer l'apparence du box
        });
        this.box.on('pointerup', () => {
            // Code à exécuter lors du clic sur l'objet box
            this.touchBox = false;
            this.boxOutlineBlue.alpha = 0;
            this.boxOutlineRed.alpha = 1;
            console.log(this.touchBox);
            // Ajoutez ici votre code pour changer l'apparence du box
        });
        this.box.on('pointerover', () => {

            this.boxOutlineRed.alpha = 1; // Rend le contour visible

        });
        this.box.on('pointerout', () => {
            this.touchBox = false
            this.boxOutlineRed.alpha = 0; // Rend le contour invisible
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
        if (this.input.activePointer.worldX - this.player.x >= distanceXpositif || this.input.activePointer.worldX - this.player.x <= distanceXnegatif) {
            //console.log(this.tooFar)
            this.cameras.main.stopFollow();
            this.tooFar = true;

        }
        if (this.input.activePointer.worldX - this.player.x <= distanceXpositif && this.input.activePointer.worldX - this.player.x >= distanceXnegatif) {
            this.tooFar = false;
            //console.log(this.tooFar)
        }




        if (this.reparionMode) {
            this.cameras.main.startFollow(this.player);
            this.cameras.main.setBounds(0 * 256, 9 * 256, 208 * 256, 10 * 256);
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
            this.cameras.main.stopFollow(); // Arrêter de suivre le joueur
            console.log(this.mode);
        }

        if (this.clavier.Z.isDown && this.mode === 1 && Date.now() - this.lastSwitchTime >= switchCooldown) {
            this.lastSwitchTime = Date.now();
            this.cameraMode = false;
            this.mode = 0;
            this.reparionMode = true;
            console.log(this.mode);
        }



        //pour le contacteur (à revoir plus tard)
        if (this.touchContactor == false) {
            //console.log("STOP")
            this.contacteurOutlineRed.clear();  // Effacer l'outline rouge
            this.contacteurOutlineRed.lineStyle(10, 0xFF0000);  // Définir le style de ligne rouge
            this.contacteurOutlineRed.strokeRect(this.contacteur.x - 226, this.contacteur.y - 512, 450, 1024);  // Dessiner l'outline rouge
        }
        if (this.touchContactor == true && this.cameraMode == true) {
            this.contacteurOutlineBlue.clear();  // Effacer l'outline bleu
            this.contacteurOutlineBlue.lineStyle(10, 0x0000FF);  // Définir le style de ligne bleue
            this.contacteurOutlineBlue.strokeRect(this.contacteur.x - 226, this.contacteur.y - 512, 450, 1024);  // Dessiner l'outline bleu
            //console.log("ooououououo very scary")
            this.contacteur.x = this.input.activePointer.worldX;
            this.contacteur.y = this.input.activePointer.worldY;
            this.contacteurOutlineBlue.x = this.contacteur.x;
            this.contacteurOutlineBlue.y = this.contacteur.y;
            this.contacteurOutlineRed.x = this.contacteur.x;
            this.contacteurOutlineRed.y = this.contacteur.y;
            // Redessiner les outlines aux nouvelles positions du contacteur

        }




        //pour le box (à revoir plus tard)
        if (this.touchBox == false) {
            //console.log("STOP")
            this.boxOutlineRed.clear();  // Effacer l'outline rouge
            this.boxOutlineRed.lineStyle(10, 0xFF0000);  // Définir le style de ligne rouge
            this.boxOutlineRed.strokeRect(this.box.x + 256, this.box.y + 256, 256, 256);
        }
        if (this.touchBox == true && this.cameraMode == true) {
            this.boxOutlineBlue.clear();  // Effacer l'outline bleu
            this.boxOutlineBlue.lineStyle(10, 0x0000FF);  // Définir le style de ligne bleue
            this.boxOutlineBlue.strokeRect(this.box.x + 256, this.box.y + 256, 256, 256);
            //console.log("ooououououo very scary")
            this.box.x = this.input.activePointer.worldX;
            this.box.y = this.input.activePointer.worldY;
            this.boxOutlineBlue.x = this.box.x;
            this.boxOutlineBlue.y = this.box.y;
            this.boxOutlineRed.x = this.box.x;
            this.boxOutlineRed.y = this.box.y;
            // Redessiner les outlines aux nouvelles positions du box

        }
         
        if(this.interlevier == true && this.clavier.R.isDown && this.state == 0){
            console.log('clic')
            this.lever.anims.play('on', true);
            this.porte.anims.play('open', true);
            this.porte.setOffset(0,-650)
            this.state = 1;
        }





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

