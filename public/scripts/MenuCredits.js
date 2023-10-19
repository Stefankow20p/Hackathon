import Phaser from 'phaser';

import {screenSize}  from './const.js';


class Menu extends Phaser.Scene{

    constructor(){
        super("menuCredits");
        this.backButton;
    }

    preload(){
        this.load.image("arrowButton", "/assets/menu/arrowButton.png");
        this.load.image("arrowButtonHover", "/assets/menu/arrowButtonHover.png");



    }

    create(){
        const screenMiddle =  screenSize.width / 2

        this.backButton = this.add.image( 20, 20 , "arrowButton").setScale(2).setOrigin(0).setInteractive();
        this.backButton.on("pointerdown", ()=> {
            this.scene.start("menu");      
        }).on("pointerout", ()=> {
            this.backButton.setTexture("arrowButton");
        }).on("pointerover", ()=> {
            this.backButton.setTexture("arrowButtonHover");
        })

        this.add.text(screenMiddle, 20, "CREDITS", {align: "left", color:"#f08000", fontFamily: "arcade", fontSize: 64}).setOrigin(0.5,0)

        this.add.text(screenMiddle, 100, "CODE:", {align: "left", color:"#f08000", fontFamily: "arcade", fontSize: 32}).setOrigin(0.5,0)
        this.add.text(screenMiddle, 140, "Stefan, Michał, Marek", {align: "left", color:"#f08000", fontFamily: "arcade", fontSize: 24}).setOrigin(0.5,0)

        this.add.text(screenMiddle, 250, "GRAPHICS:", {align: "left", color:"#f08000", fontFamily: "arcade", fontSize: 32}).setOrigin(0.5,0)
        this.add.text(screenMiddle, 290, "Błażej", {align: "left", color:"#f08000", fontFamily: "arcade", fontSize: 24}).setOrigin(0.5,0)

        
        this.add.text(screenMiddle, 400, "AUDIO:", {align: "left", color:"#f08000", fontFamily: "arcade", fontSize: 32}).setOrigin(0.5,0)
        this.add.text(screenMiddle, 440, "Michał, Marek", {align: "left", color:"#f08000", fontFamily: "arcade", fontSize: 24}).setOrigin(0.5,0)

        this.add.text(screenMiddle, screenSize.height - 25, "Copyright", {align: "left", color:"#f08000", fontFamily: "arcade", fontSize: 20}).setOrigin(0.5,0)

    }

    update(){

    }

}

export default Menu;