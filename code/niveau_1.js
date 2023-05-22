
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
        this.load.image("fond1", "../asset_lvl1/fond_niveau_1.png");
        this.load.image("fond2", "../asset_lvl1/fond_niveau_1(2).png");
        this.load.tilemapTiledJSON("map", "../asset_lvl1/map_lvl1.json");
        this.load.spritesheet('reparion', '../asset_lvl1/reparion.png',{ frameWidth: 256, frameHeight: 512 });
        this.load.spritesheet('dummy', '../asset_lvl1/dummy.png',{ frameWidth: 256, frameHeight: 512 });
        this.load.spritesheet('bugliansNRJ', '../asset_lvl1/soulsCollect.png',{ frameWidth: 256, frameHeight: 256});
        this.load.spritesheet('detritus', '../asset_lvl1/ferraille.png',{ frameWidth: 356, frameHeight: 800});
        
        
        //pour le perso, à mettre dans chaque scene!!!
        this.load.image("hitbox", "../assets/Hitbox.png");
        //fin partie perso


    }


    create() {


        //pour le perso, à mettre dans chaque scene!!!
        this.hammerLowAtk1 = this.physics.add.sprite(4*256, 14.67*256, 'hitbox');
        this.hammerLowAtk1.setSize(512, 20);
        this.hammerLowAtk1.setOffset(5000, 5000);
        this.hammerLowAtk1.body.gravity.y = -1024;
        //fin partie perso


        const level1 = this.add.tilemap("map");
        const tileset = level1.addTilesetImage("placholder_sol", "tileset");
        this.fond1 = this.add.image(0, 2320 ,'fond1');
        this.fond1.setScale(15);
        this.fond2 = this.add.image(19200, 2320,'fond2');
        this.fond2.setScale(15);
        this.fond3 = this.add.image(38400, 2320 ,'fond1');
        this.fond3.setScale(15);
        this.fond4 = this.add.image(57600, 2320,'fond2');
        this.fond4.setScale(15)
        const platform = level1.createLayer("platform", tileset);
        platform.setCollisionByProperty({estSolide:true});
        

        //pour le perso, à mettre dans chaque scene!!!
        this.player = new Player(this, 4*256, 14*256,"reparion");
        //fin partie perso


        this.littleOne = new BugliansNRJ(this,10*256,13*256,"bugliansNRJ");
        this.littleOne.setSize(20, 20)
        this.littleOne.setOffset(128, 128)
        this.littleOne.setScale(0.5)
        this.detritus = new Detritus(this, 20*256, 14.67*256,"detritus");
        this.detritus.setSize(800, 25)
        this.detritus.setOffset(0, 531)
        this.detritus.setScale(1)
        this.dummy = new Dummy(this, 30*256, 14.67*256,"dummy");
        this.dummy.setSize(256, 512)
        this.dummy.setOffset(0, 0)
        this.dummy.setScale(1)
        this.physics.add.collider(this.player, platform)
        this.physics.add.collider(this.dummy, platform)
        this.physics.add.overlap(this.player, this.littleOne, () => {
            this.player.emit('absorbtion', { information: 'énergie absorbé' });
            this.littleOne.emit('contact', { information: 'Contact détecté' });
            this.littleOne.destroy();
        });
        this.physics.add.overlap(this.player, this.detritus, () => {
            this.player.emit('ouch', { information: 'aie' });
        });
        this.Hitbox = this.physics.add.sprite(this.player.posX + 100, this.player.posY + 10, 'Hitbox');

        this.physics.world.setBounds(0*256, 0*256, 208*256, 20*256);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0*256, 0*256, 208*256, 20*256);
        this.cameras.main.setZoom(0.25);
        console.log("test");
    }


    update(){
    }
}