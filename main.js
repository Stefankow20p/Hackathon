import './style.css'
import Phaser from 'phaser';

import { tiles, screenSize } from './public/assets/const';
import Menu from './public/assets/Menu';


console.log(screenSize);

const config = {
    type: Phaser.WEBGL,
    width: screenSize.width,
    height: screenSize.height,
    canvas: gameCanvas,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debugger: true
        }
    },
    scene: [Menu] 
};
const game = new Phaser.Game(config);