import Phaser from 'phaser';

class Menu extends Phaser.Scene{

    constructor(){
        super("menuOptions");
        this.backButton;
    }

    preload(){
        this.load.image("arrowButton", "/assets/menu/arrowButton.png");
        this.load.image("arrowButtonHover", "/assets/menu/arrowButtonHover.png");

        

    }

    create(){

        this.backButton = this.add.image( 20, 20 , "arrowButton").setScale(2).setOrigin(0).setInteractive();
        this.backButton.on("pointerdown", ()=> {
            this.scene.start("menu"); 
        }).on("pointerout", ()=> {
            this.backButton.setTexture("arrowButton");
        }).on("pointerover", ()=> {
            this.backButton.setTexture("arrowButtonHover");
        })

    }

    update(){

    }

}

export default Menu;