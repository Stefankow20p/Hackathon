import './style.css'
import Phaser from 'phaser';

import { screenSize, gravityPower } from './public/scripts/const';
import Menu from './public/scripts/Menu';
import MenuCredits from './public/scripts/MenuCredits';
import MenuOptions from './public/scripts/MenuOptions';
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
    scene: [Menu, MenuCredits, MenuOptions, GameScene]  
};

const game = new Phaser.Game(config);