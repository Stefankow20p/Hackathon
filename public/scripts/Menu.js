import Phaser from 'phaser';

import {screenSize}  from './const.js';


class Menu extends Phaser.Scene{

    constructor(){
        super("menu");
        this.buttonLevels
        this.buttonOptions
        this.buttonCredits
    }

    preload(){
        this.load.image("levelsButton", "/assets/menu/levelsButton.png");
        this.load.image("levelsButtonHover", "/assets/menu/levelsButtonHover.png");
        this.load.image("optionsButton", "/assets/menu/optionsButton.png");
        this.load.image("optionsButtonHover", "/assets/menu/optionsButtonHover.png");
        this.load.image("creditsButton", "/assets/menu/creditsButton.png");
        this.load.image("creditsButtonHover", "/assets/menu/creditsButtonHover.png");

        this.load.audio("buttonHover", "public/audio/menu/menuHover.mp3");
        this.load.audio("buttonClick", "public/audio/menu/menuClick.mp3");

        this.load.image("ae", "/assets/podloga.png");

    }

    create(){
        this.sound.pauseOnBlur = true;
        const buttonShiftY = 20;

        const screenMiddle =  screenSize.width / 2;
        this.buttonLevels = this.add.image( screenMiddle, (screenSize.height/4 + buttonShiftY) , "levelsButton").setScale(3).setInteractive();
        this.buttonLevels.on("pointerdown", ()=> {
            this.sound.add('buttonClick').play();
            this.scene.start("menuStageSelect");
        }).on("pointerout", ()=> {
            this.buttonLevels.setTexture("levelsButton");
        }).on("pointerover", ()=> {
            this.buttonLevels.setTexture("levelsButtonHover");
            this.sound.add('scene-game').play();
        })

        this.buttonOptions = this.add.image(screenMiddle , (screenSize.height/2 + buttonShiftY) , "optionsButton").setScale(3).setInteractive();
        this.buttonOptions.on("pointerdown", ()=> {
            this.sound.add('buttonClick').play();
            this.scene.start("menuOptions");    
        }).on("pointerout", ()=> {
            this.buttonOptions.setTexture("optionsButton");
        }).on("pointerover", ()=> {
            this.buttonOptions.setTexture("optionsButtonHover");
            this.sound.add('buttonHover').play();

        })

        this.buttonCredits = this.add.image(screenMiddle , (screenSize.height*3/4 + buttonShiftY), "creditsButton").setScale(3).setInteractive();
        this.buttonCredits.on("pointerdown", ()=> {
            this.sound.add('buttonClick').play();
            this.scene.start("menuCredits");   
        }).on("pointerout", ()=> {
            this.buttonCredits.setTexture("creditsButton");
        }).on("pointerover", ()=> {
            this.buttonCredits.setTexture("creditsButtonHover");
            this.sound.add('buttonHover').play();

        })

        this.add.text(screenMiddle, 20, "Through the History", {align: "left", color:"#f08000", fontFamily: "Helvetica", fontSize: 64}).setOrigin(0.5,0)

        this.ladder = this.add.group([
            { key: 'ae', frame: 0, repeat: 10, setXY: { x: 32, y: 148, stepY: 32} },
            { key: 'ae', frame: 0, repeat: 10, setXY: { x: 64, y: 148, stepY: 32} }
        ]);


    }

    update(){

    }

}

export default Menu;
