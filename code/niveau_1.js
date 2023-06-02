const switchCooldown = 1000;

// Créez une variable pour stocker la position cible de la caméra


import { Player } from "./Reparion.js"
import { Dummy } from "./dummy.js"
import { Ennemy } from "./ennemy.js"
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
        this.load.spritesheet('reparion', '../asset_lvl1/reparion.png', { frameWidth: 16, frameHeight: 32 });
        //fin partie perso
        this.load.spritesheet('ennemy', '../asset_lvl1/oponnent.png', { frameWidth: 16, frameHeight: 32 });
        this.load.spritesheet('crazy', '../asset_lvl1/crazy.png', { frameWidth: 16, frameHeight: 32 });
        this.load.spritesheet('box', '../asset_lvl1/box.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('contacteur', '../asset_lvl1/contacteur.png', { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('dummy', '../asset_lvl1/dummy.png', { frameWidth: 16, frameHeight: 32 });
        this.load.spritesheet('bugliansNRJ', '../asset_lvl1/soulsCollect.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('detritus', '../asset_lvl1/ferraille.png', { frameWidth: 48, frameHeight: 33 });
        this.load.spritesheet('levier', '../asset_lvl1/lever.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('porte', '../asset_lvl1/piston.png', { frameWidth: 32, frameHeight: 192 });
        this.load.spritesheet('laser', '../asset_lvl1/laser.png', { frameWidth: 32, frameHeight: 192 });
        this.load.spritesheet('porteClose', '../asset_lvl1/pistonClose.png', { frameWidth: 32, frameHeight: 192 });
        this.load.spritesheet('button', '../asset_lvl1/red_button.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('pc', '../asset_lvl1/ordinateur.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("objectif", "../asset_lvl1/objectif_camera.png", { frameWidth: 1024, frameHeight: 576 });
        this.load.spritesheet("full", "../asset_lvl1/health5.png", { frameWidth: 176, frameHeight: 72 });
        this.load.spritesheet("4", "../asset_lvl1/health4.png", { frameWidth: 176, frameHeight: 72 });
        this.load.spritesheet("3", "../asset_lvl1/health3.png", { frameWidth: 176, frameHeight: 72 });
        this.load.spritesheet("2", "../asset_lvl1/health2.png", { frameWidth: 176, frameHeight: 72 });
        this.load.spritesheet("1", "../asset_lvl1/health1.png", { frameWidth: 176, frameHeight: 72 });
    }



    create() {


        //pour le perso, à mettre dans chaque scene!!!
        this.playerHealth = 5;
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
        this.salle = 0;
        this.canTP = false;
        //fin partie perso

        const level1 = this.add.tilemap("map");
        const tileset = level1.addTilesetImage("placholder_sol", "tileset");
        this.fond1 = this.add.image(0, 0, 'fond1');
        this.fond1.setScale(1.2);
        this.fond2 = this.add.image(1536, 0, 'fond2');
        this.fond2.setScale(1.2);


        const platform = level1.createLayer("platform", tileset);
        platform.setCollisionByProperty({ estSolide: true });

        this.lever = this.physics.add.sprite(0, 0, 'levier');
        this.lever.body.gravity.y = -600;
        this.lever.setScale(0);
        this.button = this.physics.add.sprite( 0, 0, 'button');
        this.button.body.gravity.y = -600;
        this.button.setScale(0);

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

        this.porteButton = this.physics.add.sprite(0, 0, 'laser');
        this.porteButton.body.gravity.y = -600;
        this.porteButton.setScale(0);

        this.porteLevier = this.physics.add.sprite(0, 0, 'porte');
        this.porteLevier.body.gravity.y = -600;
        this.porteLevier.setScale(0);

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
        this.anims.create({
            key: 'laserOn',
            frames: this.anims.generateFrameNumbers('laser', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'laserOff',
            frames: this.anims.generateFrameNumbers('laser', { start: 2, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        
        this.pc1 = this.physics.add.sprite(24 * 16, 12 * 16, 'pc');
        this.pc1.setSize(40, 44);
        this.pc1.setOffset(14, 0);
        this.pc1.setScale(1);

        //pour le perso, à mettre dans chaque scene!!!
        this.player = new Player(this, 2 * 16, 12 * 16, "reparion");
        //fin partie perso


        this.littleOne = new BugliansNRJ(this, -160, -160, "bugliansNRJ");
        this.littleOne.setSize(16, 16);
        this.littleOne.setOffset(0, 0);
        this.littleOne.setScale(0);
        this.littleTwo = new BugliansNRJ(this, -160, -160, "bugliansNRJ");
        this.littleTwo.setSize(16, 16);
        this.littleTwo.setOffset(0, 0);
        this.littleTwo.setScale(0);
        this.detritus = new Detritus(this, 20 * 16, 12 * 16, "detritus");
        this.detritus.setSize(48, 5);
        this.detritus.setOffset(0, 28);
        this.detritus.setScale(0);
        this.dummy = new Dummy(this, 10 * 16, 12 * 16, "dummy");
        this.dummy.setSize(16, 32);
        this.dummy.setOffset(0, 0);
        this.dummy.setScale(0);
        this.ennemy = new Ennemy(this, 10 * 16, 12 * 16, "ennemy");
        this.ennemy.setSize(16, 32);
        this.ennemy.setOffset(0, 0);
        this.ennemy.setScale(0);
        this.crazy = new Ennemy(this, 10 * 16, 12 * 16, "crazy");
        this.crazy.setSize(16, 32);
        this.crazy.setOffset(0, 0);
        this.crazy.setScale(0);
        this.physics.add.collider(this.player, platform)
        this.physics.add.collider(this.player, this.porteLevier)
        this.physics.add.collider(this.player, this.porteButton)
        this.physics.add.collider(this.dummy, platform)
        this.physics.add.overlap(this.player, this.dummy, () => {
            if (this.attacking == true) {
                this.dummy.setScale(0);
            }
            if (this.attacking == false) {
                this.player.emit('ouch', { information: 'aie' });
            }
        });
        this.physics.add.collider(this.crazy, platform)
        this.physics.add.overlap(this.player, this.crazy, () => {
            if (this.attacking == true) {
                this.crazy.setScale(0);
            }
            if (this.attacking == false) {
                this.player.emit('ouch', { information: 'aie' });
            }
        });
        this.physics.add.collider(this.ennemy, platform)
        this.physics.add.overlap(this.player, this.ennemy, () => {
            this.player.emit('ouch', { information: 'aie' });
        });
        this.physics.add.collider(this.detritus, platform)
        this.physics.add.overlap(this.player, this.detritus, () => {
            this.player.emit('ouch', { information: 'aie' });
        });
        this.physics.add.overlap(this.player, this.littleOne, () => {
            this.player.emit('absorbtion', { information: 'énergie absorbé' });
            this.littleOne.emit('contact', { information: 'Contact détecté' });
            this.littleOne.destroy();
        });
        this.physics.add.overlap(this.player, this.littleTwo, () => {
            this.player.emit('absorbtion', { information: 'énergie absorbé' });
            this.littleTwo.emit('contact', { information: 'Contact détecté' });
            this.littleTwo.destroy();
        });



        this.physics.add.overlap(this.player, this.lever, () => {
            if (this.clavier.R.isDown) {
                this.interlevier = true;
            }
        });

        this.contacteur = new Contacteur(this, 0, 0, "contacteur");
        this.contacteur.setInteractive(); // Rendre l'objet interactif
        this.contacteur.setSize(32, 64);
        this.contacteur.setOffset(0, 0);
        this.contacteur.setScale(0);
        








        this.physics.add.collider(this.player, this.contacteur)
        this.physics.add.collider(this.contacteur, platform)






        this.box = new Box(this, 0, 0, "box");
        this.box.setInteractive(); // Rendre l'objet interactif
        this.box.setSize(16, 16);
        this.box.setOffset(0, 0);
        this.box.setScale(0);







        this.physics.add.overlap(this.button, this.box, () => {
            this.buttonPress = true;
        });
        this.physics.add.overlap(this.player, this.pc1, () => {
            if (this.clavier.R.isDown)
                this.pc1enter = true;
        });
        this.physics.add.collider(this.player, this.box,() => {});
        this.physics.add.collider(platform, this.button)
        this.physics.add.collider(platform, this.pc1)
        this.physics.add.collider(this.box, platform)
        this.clavier = this.input.keyboard.addKeys('Q,D,SPACE,SHIFT,A,Z,E,R,X,ALT,CTRL,F');
        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.world.setBounds(0 * 16, 0 * 16, 25 * 16, 14 * 16);


        //pour le perso, à mettre dans chaque scene!!!
        this.cameras.main.startFollow(this.player);
        //fin partie perso

        this.cameras.main.setBounds(0 * 16, 0 * 16, 25 * 16, 14 * 16);
        this.cameras.main.setZoom(2.5);
        console.log("test");
        this.input.setDefaultCursor('none');
        this.objetSuiveur = this.add.sprite(4 * 16, 14 * 16, 'cross');
        this.pc1.setImmovable(true);
        this.objectif = this.add.sprite(205, 115, 'objectif');
        this.objectif.setScale(0.4);
        this.healthBar = this.add.sprite(40, 20, "full")//.setScrollFactor(0);

        this.healthBar.setScale(0.4);
        //this.healthBar

        this.anims.create({
            key: 'reparionMode',
            frames: this.anims.generateFrameNumbers('objectif', { start: 2, end: 2 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'cameraMode',
            frames: this.anims.generateFrameNumbers('objectif', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: 1
        });
        this.anims.create({
            key: 'criticalHealth',
            frames: this.anims.generateFrameNumbers('1', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: 1
        });
        this.anims.create({
            key: 'dummy',
            frames: this.anims.generateFrameNumbers('dummy', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: 1
        });
        this.anims.create({
            key: 'ennemyLeft',
            frames: this.anims.generateFrameNumbers('ennemy', { start: 0, end: 5 }),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'ennemyRight',
            frames: this.anims.generateFrameNumbers('ennemy', { start: 6, end: 11 }),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'crazyLeft',
            frames: this.anims.generateFrameNumbers('crazy', { start: 0, end: 5 }),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'crazyRight',
            frames: this.anims.generateFrameNumbers('crazy', { start: 6, end: 11 }),
            frameRate: 12,
            repeat: -1
        });


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
            this.objectif.anims.play('cameraMode', true);

            // Définissez une vitesse de suivi plus lente (vous pouvez ajuster cette valeur selon vos besoins)
            var speed = 0.05;

            // Déplacez la caméra progressivement vers la position cible en utilisant l'interpolation linéaire
            this.cameras.main.scrollX += dx * speed;
            this.cameras.main.scrollY += dy * speed;

        }




        if (this.reparionMode) {
            this.cameras.main.startFollow(this.player);
            this.objectif.anims.play('reparionMode', true);
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
                    this.player.setSize(16, 32);
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
                    this.player.setSize(16, 32);
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
            this.cameras.main.shake(100, 0.005);
            this.reparionMode = false;
            this.box.body.gravity.y = -600;
            console.log(this.mode);
        }

        if (this.clavier.Z.isDown && this.mode === 1 && Date.now() - this.lastSwitchTime >= switchCooldown) {
            this.lastSwitchTime = Date.now();
            this.cameraMode = false;
            this.mode = 0;
            this.cameras.main.shake(100, 0.005);
            this.reparionMode = true;
            this.box.body.gravity.y = 0;
            console.log(this.mode);
        }



        //pour le contacteur (à revoir plus tard)
        if (this.touchContactor == false) {
            console.log("STOP")
        }
        if (this.touchContactor == true && this.cameraMode == true) {
            console.log("ooououououo very scary")
            this.contacteur.x = this.input.activePointer.worldX;
            this.contacteur.y = this.input.activePointer.worldY;

        }




        //pour le box (à revoir plus tard)
        if (this.touchBox == false) {
            //console.log("STOP")
        }
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
            this.porteLevier.setOffset(0, -80.0)
            this.state = 1;
            this.time.delayedCall(1000, () => {
                this.leverporteIsClosed = false;
            }, this);
        }
        else if (this.interlevier == true && this.state == 1 && this.leverporteIsClosed == false) {
            console.log('clic')
            this.lever.anims.play('off', true);
            this.porteLevier.anims.play('close', true);
            this.porteLevier.setSize(0, 0)
            this.state = 0;
            this.time.delayedCall(1000, () => {
                this.leverporteIsClosed = true;
            }, this);
        }

        if (this.buttonPress == true && this.buttonporteIsClosed == true) {
            this.button.anims.play('push', true);
            this.porteButton.anims.play('laserOff', true);
            this.porteButton.setOffset(0, -192);
            this.time.delayedCall(1000, () => {
                this.buttonporteIsClosed = false;
                this.buttonstate = 1;
            }, this);

        }
        else if (this.buttonPress == false && this.buttonporteIsClosed == false) {
            this.button.anims.play('depush', true);
            this.porteButton.anims.play('laserOn', true);
            this.porteButton.setOffset(0, 0);
            this.time.delayedCall(1000, () => {
                this.buttonporteIsClosed = true;
                this.buttonstate = 0;
            }, this);
        }
        if (this.pc1enter == true) {
            this.canTP = true
            this.salle += 1;
            this.healthBar.x += 26 * 16
            console.log(this.salle)

        }
        this.player.on('5life', (data) => {
            this.playerHealth = 5;
            this.healthBar.setTexture('full');
        });
        this.player.on('4life', (data) => {
            this.playerHealth = 4;
            this.healthBar.setTexture('4');
        });
        this.player.on('3life', (data) => {
            this.playerHealth = 3;
            this.healthBar.setTexture('3');
        });
        this.player.on('2life', (data) => {
            this.playerHealth = 2;
            this.healthBar.setTexture('2');
        });
        this.player.on('1life', (data) => {
            this.playerHealth = 1;
            this.healthBar.anims.play('criticalHealth', true);
        });
        this.player.on('0life', (data) => {
            this.playerHealth = 0;

        });

        if (this.salle == 0) {
            this.cameras.main.setBounds(0 * 16, 0 * 16, 25 * 16, 14 * 16);
            this.physics.world.setBounds(0 * 16, 0 * 16, 25 * 16, 14 * 16);
            this.littleOne.x = 14 * 16
            this.littleOne.y = 12 * 16
            this.littleOne.setScale(0.5)

        }
        if (this.salle == 1) {
            this.cameras.main.setBounds(26 * 16, 0 * 16, 25 * 16, 14 * 16);
            this.physics.world.setBounds(26 * 16, 0 * 16, 25 * 16, 14 * 16);
            if (this.canTP == true) {
                this.littleTwo.x = 40 * 16
                this.littleTwo.y = 10 * 16
                this.littleTwo.setScale(0.5)
                this.littleOne.setScale(0)
                this.objectif.x = 205 + 26 * 16;
                this.objectif.y = 115;
                this.player.x = 28 * 16;
                this.player.y = 12 * 16;
                this.pc1.x = 50 * 16;
            }

        }
        if (this.salle == 2) {
            this.cameras.main.setBounds(52 * 16, 0 * 16, 25 * 16, 14 * 16);
            this.physics.world.setBounds(52 * 16, 0 * 16, 25 * 16, 14 * 16);
            if (this.canTP == true) {
                this.detritus.x = 66 * 16
                this.detritus.y = 12 * 16
                this.detritus.setScale(1)
                this.littleTwo.setScale(0)
                this.objectif.x = 205 + 52 * 16;
                this.objectif.y = 115;
                this.player.x = 54 * 16;
                this.player.y = 12 * 16;
                this.pc1.x = 76 * 16;

            }
            if (this.playerHealth == 0) {
                this.detritus.x = 66 * 16
                this.detritus.y = 12 * 16
                this.detritus.setScale(1)
                this.littleTwo.setScale(0)
                this.objectif.x = 205 + 52 * 16;
                this.objectif.y = 115;
                this.player.x = 54 * 16;
                this.player.y = 12 * 16;
                this.pc1.x = 76 * 16;
            }
        }
        if (this.salle == 3) {
            this.cameras.main.setBounds(78 * 16, 0 * 16, 25 * 16, 14 * 16);
            this.physics.world.setBounds(78 * 16, 0 * 16, 25 * 16, 14 * 16);
            this.dummy.anims.play('dummy', true);
            if (this.canTP == true) {
                this.dummy.x = 92 * 16;
                this.dummy.y = 12 * 16;
                this.dummy.setScale(1);
                this.detritus.setScale(0);
                this.objectif.x = 205 + 78 * 16;
                this.objectif.y = 115;
                this.player.x = 80 * 16;
                this.player.y = 12 * 16;
                this.pc1.x = 102 * 16;
            }
            if (this.playerHealth == 0) {
                this.dummy.x = 92 * 16;
                this.dummy.y = 12 * 16;
                this.dummy.setScale(1);
                this.detritus.setScale(0);
                this.objectif.x = 205 + 78 * 16;
                this.objectif.y = 115;
                this.player.x = 80 * 16;
                this.player.y = 12 * 16;
                this.pc1.x = 102 * 16;
            }
        }
        if (this.salle == 4) {
            this.cameras.main.setBounds(104 * 16, 0 * 16, 25 * 16, 14 * 16);
            this.physics.world.setBounds(104 * 16, 0 * 16, 25 * 16, 14 * 16);

            if (this.canTP == true) {
                this.crazy.x = 118 * 16;
                this.crazy.y = 12 * 16;
                this.crazy.setScale(1);
                this.crazy.setVelocityX(75);
                this.crazy.anims.play('crazyRight', true);
                this.dummy.setScale(0);
                this.objectif.x = 205 + 104 * 16;
                this.objectif.y = 115;
                this.player.x = 106 * 16;
                this.player.y = 12 * 16;
                this.pc1.x = 128 * 16;
            }
            if (this.crazy.x <= (110 * 16)) {
                this.crazy.setVelocityX(75);
                this.crazy.anims.play('crazyRight', true);
            }
            else if (this.crazy.x >= (125 * 16)) {
                this.crazy.setVelocityX(-75);
                this.crazy.anims.play('crazyLeft', true);
            }
            if (this.playerHealth == 0) {
                this.crazy.x = 118 * 16;
                this.crazy.y = 12 * 16;
                this.crazy.setScale(1);
                this.crazy.setVelocityX(75);
                this.crazy.anims.play('crazyRight', true);
                this.dummy.setScale(0);
                this.objectif.x = 205 + 104 * 16;
                this.objectif.y = 115;
                this.player.x = 106 * 16;
                this.player.y = 12 * 16;
                this.pc1.x = 128 * 16;
            }
        }
        if (this.salle == 5) {
            this.cameras.main.setBounds(130 * 16, 0 * 16, 25 * 16, 14 * 16);
            this.physics.world.setBounds(130 * 16, 0 * 16, 25 * 16, 14 * 16);

            if (this.canTP == true) {
                this.ennemy.x = 144 * 16;
                this.ennemy.y = 12 * 16;
                this.ennemy.setScale(1);
                this.ennemy.setVelocityX(-150);
                this.ennemy.anims.play('ennemyRight', true);
                this.crazy.setScale(0);
                this.objectif.x = 205 + 130 * 16;
                this.objectif.y = 115;
                this.player.x = 132 * 16;
                this.player.y = 12 * 16;
                this.pc1.x = 154 * 16;
            }
            if (this.ennemy.x <= this.player.x - 32) {
                this.ennemy.setVelocityX(150);
                this.ennemy.anims.play('ennemyRight', true);
            }
            else if (this.ennemy.x >= this.player.x + 32) {
                this.ennemy.setVelocityX(-150);
                this.ennemy.anims.play('ennemyLeft', true);
            }
            if (this.playerHealth == 0) {
                this.ennemy.x = 144 * 16;
                this.ennemy.y = 12 * 16;
                this.ennemy.setScale(1);
                this.ennemy.setVelocityX(-150);
                this.ennemy.anims.play('ennemyRight', true);
                this.crazy.setScale(0);
                this.objectif.x = 205 + 130 * 16;
                this.objectif.y = 115;
                this.player.x = 132 * 16;
                this.player.y = 12 * 16;
                this.pc1.x = 154 * 16;
            }

        }
        if (this.salle == 6) {
            this.cameras.main.setBounds(156 * 16, 0 * 16, 25 * 16, 14 * 16);
            this.physics.world.setBounds(156 * 16, 0 * 16, 25 * 16, 14 * 16);

            if (this.canTP == true) {
                this.contacteur.x = 170 * 16;
                this.contacteur.y = 9 * 16;
                this.contacteur.setScale(2);
                this.ennemy.setScale(0);
                this.objectif.x = 205 + 156 * 16;
                this.objectif.y = 115;
                this.player.x = 158 * 16;
                this.player.y = 12 * 16;
                this.pc1.x = 180 * 16;
            }
            
            if (this.playerHealth == 0) {
                this.contacteur.x = 170 * 16;
                this.contacteur.y = 9 * 16;
                this.contacteur.setScale(2);
                this.ennemy.setScale(0);
                this.objectif.x = 205 + 156 * 16;
                this.objectif.y = 115;
                this.player.x = 158 * 16;
                this.player.y = 12 * 16;
                this.pc1.x = 180 * 16;
            }

        }
        if (this.salle == 7) {
            this.cameras.main.setBounds(182 * 16, 0 * 16, 25 * 16, 14 * 16);
            this.physics.world.setBounds(182 * 16, 0 * 16, 25 * 16, 14 * 16);

            if (this.canTP == true) {
                this.porteLevier.x = 201 * 16;
                this.porteLevier.y = 7 * 16;
                this.lever.x = 191 * 16;
                this.lever.y = 12 * 16;
                this.porteLevier.setScale(1);
                this.lever.setScale(1);
                this.contacteur.setScale(0);
                this.objectif.x = 205 + 182 * 16;
                this.objectif.y = 115;
                this.player.x = 184 * 16;
                this.player.y = 12 * 16;
                this.pc1.x = 206 * 16;
            }
            
            if (this.playerHealth == 0) {
                this.porteLevier.x = 201 * 16;
                this.porteLevier.y = 8 * 16;
                this.lever.x = 191 * 16;
                this.lever.y = 8 * 16;
                this.porteLevier.setScale(2);
                this.lever.setScale(1);
                this.contacteur.setScale(0);
                this.objectif.x = 205 + 182 * 16;
                this.objectif.y = 115;
                this.player.x = 184 * 16;
                this.player.y = 12 * 16;
                this.pc1.x = 206 * 16;
            }

        }
        if (this.salle == 8) {
            this.cameras.main.setBounds(208 * 16, 0 * 16, 25 * 16, 14 * 16);
            this.physics.world.setBounds(208 * 16, 0 * 16, 25 * 16, 14 * 16);

            if (this.canTP == true) {
                this.porteButton.x = 222 * 16;
                this.porteButton.y = 7 * 16;
                this.porteButton.anims.play('laserOn', true);
                this.button.x = 217 * 16;
                this.button.y = 12.5 * 16;
                this.box.x = 227 * 16;
                this.box.y = 12 * 16;
                this.porteButton.setScale(1);
                this.button.setScale(1);
                this.box.setScale(1);
                this.lever.setScale(0);
                this.porteLevier.setScale(0);
                this.objectif.x = 205 + 208 * 16;
                this.objectif.y = 115;
                this.player.x = 210 * 16;
                this.player.y = 12 * 16;
                this.pc1.x = 232 * 16;
            }
            
            if (this.playerHealth == 0) {
                this.porteButton.x = 222 * 16;
                this.porteButton.y = 7 * 16;
                this.button.x = 217 * 16;
                this.button.y = 12.5 * 16;
                this.box.x = 227 * 16;
                this.box.y = 12 * 16;
                this.porteButton.setScale(1);
                this.button.setScale(1);
                this.box.setScale(1);
                this.lever.setScale(0);
                this.porteLevier.setScale(0);
                this.objectif.x = 205 + 208 * 16;
                this.objectif.y = 115;
                this.player.x = 210 * 16;
                this.player.y = 12 * 16;
                this.pc1.x = 232 * 16;
            }
            if (this.salle == 9) {
                this.scene.start('Niveau1');
            }

        }
       











        this.buttonPress = false;
        this.interlevier = false;
        this.paralaxSlowLeft = false;
        this.paralaxSlowRight = false;
        this.pc1enter = false;
        this.canTP = false;







        //fin partie perso



    }
    //à revoir plus tard
    /*refreshDisplayContactor() {
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
    }*/
    //à revoir plus tard
    /*refreshDisplayBox() {
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
    }*/

    //pour le perso, à mettre dans chaque scene!!!
    createAtkHammerRight(valeur) {
        if (valeur == 1 && this.reparionMode == true && this.cameraMode == false) {
            console.log(1);
            this.player.setSize(32.0, 38.4);
            this.player.setOffset(0, -8);
            this.typeAtk = 2;
            this.attacking = true;
        }
        if (valeur == 2 && this.reparionMode == true && this.cameraMode == false) {
            console.log(2);
            this.player.setSize(40, 20.0);
            this.player.setOffset(0, 11.2);
            this.typeAtk = 3;
            this.attacking = true;
        }
        if (valeur == 3 && this.reparionMode == true && this.cameraMode == false) {
            console.log(3);
            this.player.setSize(40, 32.0);
            this.player.setOffset(0, 0);
            this.attacking = true;
        }
    }
    //fin partie perso


    //pour le perso, à mettre dans chaque scene!!!
    createAtkHammerLeft(valeur) {
        if (valeur == 1 && this.reparionMode == true && this.cameraMode == false) {
            console.log(1);
            this.player.setSize(32, 38.4);
            this.player.setOffset(-16, -8);
            this.typeAtk = 2;
            this.attacking = true;
        }
        if (valeur == 2 && this.reparionMode == true && this.cameraMode == false) {
            console.log(2);
            this.player.setSize(40, 20);
            this.player.setOffset(-24, 11.2);
            this.typeAtk = 3;
            this.attacking = true;
        }
        if (valeur == 3 && this.reparionMode == true && this.cameraMode == false) {
            console.log(3);
            this.player.setSize(40, 32);
            this.player.setOffset(-24, 0);
            this.typeAtk = 1;
            this.attacking = true;
        }

    }
    //fin partie perso


}

