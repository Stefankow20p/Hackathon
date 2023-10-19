import Phaser from 'phaser';

class ShootingTest extends Phaser.Scene{

    constructor(){
        super("scene-game");
        this.player;
        this.playerFacing = 1;
    }

    preload(){

        this.load.image("player","/assets/playerTest2.png");
        this.load.image("bullet","/assets/bullet.png");
    }
    
    create(){
        this.player = this.physics.add.image(200,200,"player").setOrigin(0,0);
        this.player.setCollideWorldBounds(true);
        const shoot = () =>{
            console.log(this.player.x)
            console.log(this.player.y)
            let bullet = this.physics.add.image(this.player.x, this.player.y,"bullet").setOrigin(0,0);
            bullet.body.allowGravity = false;
            bullet.setVelocity(250 * this.playerFacing, 0);
        }
        this.input.keyboard.on('keyup-SPACE', shoot);
        this.input.keyboard.on('keyup-LEFT', () => {
            this.playerFacing = -1;
        });
        this.input.keyboard.on('keyup-RIGHT', () => {
            this.playerFacing = 1;
        });
    }

    update(){

    }


    
}

export default ShootingTest;

