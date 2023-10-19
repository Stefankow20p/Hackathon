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
        this.switchableScene = false
    }

    preload(){
        this.load.image("levelsButton", "/assets/menu/playButton.png");
        this.load.image("levelsButtonHover", "/assets/menu/playButtonHover.png");
        this.load.image("optionsButton", "/assets/menu/ctrlsButton.png");
        this.load.image("optionsButtonHover", "/assets/menu/ctrlsButtonHover.png");
        this.load.image("creditsButton", "/assets/menu/creditsButton.png");
        this.load.image("creditsButtonHover", "/assets/menu/creditsButtonHover.png");
        this.load.image("muteButton", "/assets/menu/sound.png");
        this.load.image("muteButtonHover", "/assets/menu/soundHover.png");
        this.load.image("mutedButton", "/assets/menu/noSound.png");
        this.load.image("mutedButtonHover", "/assets/menu/noSoundHover.png");
        this.load.image("bg", "/assets/londonBG.png");
        

        this.load.audio("buttonHover", "public/audio/menu/menuHover.mp3");
        this.load.audio("buttonClick", "public/audio/menu/menuClick.mp3");
        this.load.audio("intro", "public/audio/menu/load.mp3");
        this.load.audio("menuTheme", "public/audio/menu/menuTheme.mp3");
    }

    create(){
        const buttonShiftY = 20;
        const screenMiddle =  screenSize.width / 2;

        this.title = this.add.text(screenMiddle, 20, "A rubber room", {align: "left", color:"#000", fontFamily: "arcade", fontSize: 64}).setOrigin(0.5,0)

        this.buttonLevels = this.add.image( screenMiddle, (screenSize.height/4 + buttonShiftY) , "levelsButton").setScale(3).setInteractive();
        this.buttonLevels.on("pointerdown", ()=> {
            if(this.switchableScene){
                this.sound.add('buttonClick').play();
                this.scene.start("scene-game");
                this.theme.stop();
            }
        }).on("pointerout", ()=> {
            this.buttonLevels.setTexture("levelsButton");
        }).on("pointerover", ()=> {
            this.buttonLevels.setTexture("levelsButtonHover");
            this.sound.add('buttonHover').play();
        })

        this.buttonOptions = this.add.image(screenMiddle , (screenSize.height/2 + buttonShiftY) , "optionsButton").setScale(3).setInteractive();
        this.buttonOptions.on("pointerdown", ()=> {
            if(this.switchableScene){
                this.sound.add('buttonClick').play();
                this.scene.start("menuOptions");
            }           
        }).on("pointerout", ()=> {
            this.buttonOptions.setTexture("optionsButton");
        }).on("pointerover", ()=> {
            this.buttonOptions.setTexture("optionsButtonHover");
            this.sound.add('buttonHover').play();
        })

        this.buttonCredits = this.add.image(screenMiddle , (screenSize.height*3/4 + buttonShiftY), "creditsButton").setScale(3).setInteractive();
        this.buttonCredits.on("pointerdown", ()=> {
            if(this.switchableScene){
                this.sound.add('buttonClick').play();
                this.scene.start("menuCredits");
            }
        }).on("pointerout", ()=> {
            this.buttonCredits.setTexture("creditsButton");
        }).on("pointerover", ()=> {
            this.buttonCredits.setTexture("creditsButtonHover");
            this.sound.add('buttonHover').play();
        })

        this.muteButton = this.add.image( 20, 20 , "muteButton").setScale(2).setOrigin(0).setInteractive();
        this.muteButton.on("pointerdown", ()=> {
            this.sound.mute = !this.sound.mute
            this.sound.add('buttonClick').play();
            if(this.sound.mute){
                this.muteButton.setTexture("mutedButton");
            }else{
                this.muteButton.setTexture("muteButton");
            }
        }).on("pointerout", ()=> {
            if(this.sound.mute){
                this.muteButton.setTexture("mutedButton");
            }else{
                this.muteButton.setTexture("muteButton");
            }
        }).on("pointerover", ()=> {
            this.sound.add('buttonHover').play();
            if(this.sound.mute){
                this.muteButton.setTexture("mutedButtonHover");
            }else{
                this.muteButton.setTexture("muteButtonHover");
            }
        })



        if(this.firstOpen){
            this.title.setAlpha(0);
            this.buttonLevels.setAlpha(0);
            this.buttonOptions.setAlpha(0);
            this.buttonCredits.setAlpha(0);
            this.infoText = this.add.text(screenMiddle, screenSize.height/2, "Click anywhere\nto continue", {align: "center", color:"#f08000", fontFamily: "arcade", fontSize: 64}).setOrigin(0.5,0)
        }else{
            this.add.image(0,0,"bg").setSize(screenSize.width, screenSize.height).setOrigin(0).setDepth(-1).setScale(2)
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
        this.buttonLevels.setAlpha(this.alpha);
        this.buttonOptions.setAlpha(this.alpha);
        this.buttonCredits.setAlpha(this.alpha);

        if(this.alpha < 1){
            this.timedEvent = this.time.delayedCall(100, this.fadeIn, [], this);
        }else{
            this.title.setAlpha(1);
            this.add.image(0,0,"bg").setSize(screenSize.width, screenSize.height).setOrigin(0).setDepth(-1).setScale(2)
            this.timedEvent = this.time.delayedCall(1000, ()=>{
                this.theme = this.sound.add('menuTheme');
                this.theme.loop = (true);
                this.theme.play();
            }, [], this);
            this.switchableScene = true;
        }
    }

}

export default Menu;
