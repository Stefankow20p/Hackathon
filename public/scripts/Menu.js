import Phaser from 'phaser';

import {screenSize}  from './const.js';


class Menu extends Phaser.Scene{

    constructor(){
        super("menu");
        this.buttonLevels
        this.buttonOptions
        this.buttonCredits
        this.alpha = 0
        this.firstOpen = true
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
        this.load.audio("intro", "public/audio/menu/load.mp3");
    }

    create(){
        this.sound.pauseOnBlur = true;
        const buttonShiftY = 20;

        const screenMiddle =  screenSize.width / 2;
        this.buttonLevels = this.add.image( screenMiddle, (screenSize.height/4 + buttonShiftY) , "levelsButton").setScale(3).setInteractive();
        this.buttonLevels.on("pointerdown", ()=> {
            this.sound.add('buttonClick').play();
            this.scene.start("scene-game");
        }).on("pointerout", ()=> {
            this.buttonLevels.setTexture("levelsButton");
        }).on("pointerover", ()=> {
            this.buttonLevels.setTexture("levelsButtonHover");
            this.sound.add('buttonHover').play();
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

        this.title = this.add.text(screenMiddle, 20, "Through the History", {align: "left", color:"#f08000", fontFamily: "arcade", fontSize: 64}).setOrigin(0.5,0)

        if(this.firstOpen){
            this.title.setAlpha(0);
            this.buttonLevels.setAlpha(0);
            this.buttonOptions.setAlpha(0);
            this.buttonCredits.setAlpha(0);
            this.infoText = this.add.text(screenMiddle, screenSize.height/2, "Click anywhere\nto continue", {align: "center", color:"#f08000", fontFamily: "arcade", fontSize: 64}).setOrigin(0.5,0)
        }

        this.input.on("pointerdown", () =>{
            if(this.firstOpen){
                this.sound.add('intro').play();
                this.infoText.visible = false;
                this.timedEvent = this.time.delayedCall(100, this.fadeIn, [], this);
                this.firstOpen = false;
            }

        })

    }

    update(){

    }

    fadeIn(){
        this.alpha += 0.04;
        console.log(this.alpha);
        this.buttonLevels.setAlpha(this.alpha);
        this.buttonOptions.setAlpha(this.alpha);
        this.buttonCredits.setAlpha(this.alpha);
        console.log(this.alpha);

        if(this.alpha < 1){
            this.timedEvent = this.time.delayedCall(100, this.fadeIn, [], this);
        }else{
            this.title.setAlpha(1);
        }
    }

}

export default Menu;
