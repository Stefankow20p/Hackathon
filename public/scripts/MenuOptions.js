import Phaser from 'phaser';

import {screenSize}  from './const.js';


class Menu extends Phaser.Scene{

    constructor(){
        super("menuOptions");
        this.backButton;
    }

    preload(){
        this.load.image("arrowButton", "/assets/menu/arrowButton.png");
        this.load.image("arrowButtonHover", "/assets/menu/arrowButtonHover.png");
        this.load.image("bg", "/assets/londonBG.png");


        this.load.audio("buttonHover", "public/audio/menu/menuHover.mp3");
        this.load.audio("buttonClick", "public/audio/menu/menuClick.mp3");

    }

    create(){
        this.add.image(0,0,"bg").setSize(screenSize.width, screenSize.height).setOrigin(0).setDepth(-1).setScale(2)

        this.backButton = this.add.image( 20, 20 , "arrowButton").setScale(2).setOrigin(0).setInteractive();
        this.backButton.on("pointerdown", ()=> {
            this.scene.start("menu");
            this.sound.add('buttonClick').play();
        }).on("pointerout", ()=> {
            this.backButton.setTexture("arrowButton");
        }).on("pointerover", ()=> {
            this.backButton.setTexture("arrowButtonHover");
            this.sound.add('buttonHover').play();
        })

        const screenMiddle =  screenSize.width / 2;

        this.add.text(screenMiddle, 20, "CONTROLS", {align: "left", color:"#000", fontFamily: "arcade", fontSize: 64}).setOrigin(0.5,0)

        this.add.text(screenMiddle, 200, "Move - arrow keys", {align: "left", color:"#000", fontFamily: "arcade", fontSize: 32}).setOrigin(0.5,0)
        this.add.text(screenMiddle, 260, "Jump - up arrow", {align: "left", color:"#000", fontFamily: "arcade", fontSize: 32}).setOrigin(0.5,0)
        this.add.text(screenMiddle, 320, "Shoot - c", {align: "left", color:"#000", fontFamily: "arcade", fontSize: 32}).setOrigin(0.5,0)
        this.add.text(screenMiddle, 380, "Fly - shift", {align: "left", color:"#000", fontFamily: "arcade", fontSize: 32}).setOrigin(0.5,0)
        this.add.text(screenMiddle, 440, "Skip text - space", {align: "left", color:"#000", fontFamily: "arcade", fontSize: 32}).setOrigin(0.5,0)
    }

    update(){

    }

}

export default Menu;