
import Titlescene from "./titlescene.js"
import Niveau1 from "./niveau_1.js"
import Victoryscreen from "./victoryScreen.js"
import Controle from "./controle.js"
const WIDTH = 1024;
const HEIGHT = 576;
const ZOOM_FACTOR = 3;

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  zoomFactor: ZOOM_FACTOR,
  leftTopCorner: {
    x: (WIDTH - (WIDTH / ZOOM_FACTOR)) / 2,
    y: (HEIGHT - (HEIGHT / ZOOM_FACTOR)) / 2
  }
}

const Scenes = [Titlescene,Controle,Niveau1,Victoryscreen];
const createScene = Scene => new Scene(SHARED_CONFIG) //A voir
const initScenes = () => Scenes.map(createScene)

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: 'arcade',
    arcade: {
      tileBias: 16,
      gravity: {y:600},
      debug: false
    },
  },
  scene: [Titlescene,Controle,Niveau1,Victoryscreen]
};

new Phaser.Game(config);





//var config = {
    //type: Phaser.AUTO,
    //width: 640, height: 360,
    //input: {
       // gamepad: true
    //},
    //physics: {
        //default: 'arcade',
        //arcade: {
            //gravity: { y: 300 },
            //debug: true
        //}
    //},
    //scene: [Niveau1],
    //pixelArt: true ,
    //input: { gamepad: true },
//};
//var game = new Phaser.Game(config);



//import TestRoom from './scenes/testroom.js';
//import Interface from './UI/interface.js';

