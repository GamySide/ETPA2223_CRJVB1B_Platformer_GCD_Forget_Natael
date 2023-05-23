const switchCooldown = 1000;

import { Player } from "./Reparion.js"
import { Dummy } from "./dummy.js"
import { BugliansNRJ } from "./bugliansNRJ.js"
import { Detritus } from "./detritus.js"

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


        this.load.spritesheet('dummy', '../asset_lvl1/dummy.png', { frameWidth: 256, frameHeight: 512 });
        this.load.spritesheet('bugliansNRJ', '../asset_lvl1/soulsCollect.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('detritus', '../asset_lvl1/ferraille.png', { frameWidth: 356, frameHeight: 800 });
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


        this.objetSuiveur = this.add.sprite(4 * 256, 14 * 256, 'cross');
        //pour le perso, à mettre dans chaque scene!!!
        this.player = new Player(this, 4 * 256, 14 * 256, "reparion");
        //fin partie perso


        this.littleOne = new BugliansNRJ(this, 10 * 256, 13 * 256, "bugliansNRJ");
        this.littleOne.setSize(20, 20)
        this.littleOne.setOffset(128, 128)
        this.littleOne.setScale(0.5)
        this.detritus = new Detritus(this, 20 * 256, 14.67 * 256, "detritus");
        this.detritus.setSize(800, 25)
        this.detritus.setOffset(0, 531)
        this.detritus.setScale(1)
        this.dummy = new Dummy(this, 30 * 256, 14.67 * 256, "dummy");
        this.dummy.setSize(256, 512)
        this.dummy.setOffset(0, 0)
        this.dummy.setScale(1)
        this.physics.add.collider(this.player, platform)
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
    }


    update() {


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
        if (this.cameraMode && this.faceLeft) {
            this.cameras.main.startFollow(this.objetSuiveur);
            this.cameras.main.setBounds(this.player.x - 2192*2, this.player.y - 2200, -this.player.x + 2192*2, this.player.y - 200);
        }
        if (this.cameraMode && this.faceRight) {
            this.cameras.main.startFollow(this.objetSuiveur);
            this.cameras.main.setBounds(this.player.x - 256, this.player.y - 2200, this.player.x + 256, this.player.y - 200);


        }

        if (this.reparionMode) {
            this.cameras.main.startFollow(this.player);
            this.cameras.main.setBounds(0 * 256, 0 * 256, 208 * 256, 20 * 256);
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
                    this.typeAtk = 1;
                    this.player.setSize(256, 512);
                    this.player.setOffset(0, 0);
                }, this);
            }
            if (this.clavier.A.isDown && !this.cant && this.faceLeft == true && this.reparionMode == true && this.cameraMode == false) {
                this.createAtkHammerLeft(this.typeAtk)
                this.time.delayedCall(1600, () => {
                    this.cant = true;
                    this.typeAtk = 1;
                    this.player.setSize(256, 512);
                    this.player.setOffset(0, 0);
                }, this);
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




        //fin partie perso



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
            this.player.setSize(1024, 512);
            this.player.setOffset(0, 0);
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
            this.player.setSize(1024, 512);
            this.player.setOffset(-768, 0);
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
        this.attacking = false;
    }
    //fin partie perso


}

