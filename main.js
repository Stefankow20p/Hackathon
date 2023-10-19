import './style.css'
import Phaser from 'phaser';

import { screenSize, gravityPower } from './public/scripts/const';
import Menu from './public/scripts/Menu';
import GameScene from './public/scripts/GameScene.js';

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
            debug: true
        }
    },
    scene: [GameScene] 
};
const game = new Phaser.Game(config);