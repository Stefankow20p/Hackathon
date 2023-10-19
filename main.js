import './style.css'
import Phaser from 'phaser';

import { screenSize, gravityPower } from './public/scripts/const';
import Menu from './public/scripts/Menu';


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
            gravity: { y: gravityPower },
            debugger: true
        }
    },
    scene: [Menu] 
};
const game = new Phaser.Game(config);