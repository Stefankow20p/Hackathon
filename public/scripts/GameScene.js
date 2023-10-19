import { playerVelocity, tiles, screenSize, gravityPower } from './const.js';

class GameScene extends Phaser.Scene {
    constructor () {
      super("scene-game");
      this.cursor;
      this.playerSpeed = playerVelocity;
      this.player;
      this.brick;
      this.onLadder = false;
      this.ladder;
    }
  
    preload () {
      this.load.image("brickSnow", "/assets/bloczekB.png");
      this.load.image("brickDefault", "/assets/bloczekA.png");
      this.load.image("pavement", "/assets/podloga.png");
      this.load.image("playerR", "/assets/playerR.png");
      this.load.image("playerL", "/assets/playerL.png");
      this.load.image("brickWall", "/assets/brick.png");
    }
  
    // this.basket.setBounce(1, 1);
    // this.player.setScale(.3);
    _addObject (img, x=0, y=0) {
      this.brick = this.physics.add.image(tiles.size*x, tiles.size*y, img).setOrigin(0, 0);
      this.brick.setImmovable(true);
      this.brick.body.allowGravity = false;
      this.physics.add.collider(this.player, this.brick); // YYY aktualnie tylko player
      this.brick.setDisplaySize(tiles.size, tiles.size);
    }
    _genLevel () {
      // 1st *******************************
      for (let i = 0; i < tiles.x; i++) {
        this._addObject("brickSnow", i, 0);
        this._addObject("brickSnow", i, 17);
        // random
        if (i < 10) this._addObject("brickSnow", i, 14);
        if (i > 15) this._addObject("brickSnow", i, 14);
      }
      for (let i = 0; i < tiles.y; i++) {
        this._addObject("brickSnow", 0, i);
      }
      // stairs
      for (let i = 5; i < 15; i++) {
        this._addObject("brickSnow", i, 16-i);
      }
  
      // 2nd *******************************
      const level2 = {x: 1, y: 0};
      for (let i = tiles.x*level2.x; i < tiles.x*2; i++) {
        // ceiling & floor
        this._addObject("brickDefault", i, 0);
        if (i < tiles.x*level2.x+10 || i > tiles.x*level2.x+15) {
          this._addObject("brickDefault", i, tiles.y-1);
          this._addObject("brickWall", i, tiles.y);
        }
      }
  
      // 3rd *******************************
      const level3 = {x: 2, y: 0};
      for (let i = tiles.x*level3.x; i < tiles.x+tiles.x*level3.x; i++) {
        this._addObject("pavement", i, 0);
        this._addObject("pavement", i, 17);
      }
      for (let i = 0; i < tiles.y; i++) {
        this._addObject("pavement", tiles.x*3-1, i);
      }
  
      // 4th *******************************
      const level4 = {x: 1, y: 1};
      // for (let i = tiles.x*level3.x; i < tiles.x+tiles.x*level3.x; i++) {
      //   this._addObject("pavement", i, tiles.y);
      //   this._addObject("pavement", i, tiles.y*2 - 1);
      // }
      for (let i = 32; i < 64; i++) {
        this._addObject("pavement", i, tiles.y*2 - 1);
      }
      for (let i = tiles.y; i < tiles.y*2; i++) {
        this._addObject("brickWall", tiles.x, i);
        this._addObject("brickWall", tiles.x*2-1, i);
      }
    }
    // _addLadder()
  
    create () {
      // this.player.setCollideWorldBounds(true);
      this.ladder = this.add.image(tiles.size*20, tiles.size*12, "brickWall").setOrigin(0, 0);
  
      this.player = this.physics.add.image(tiles.size, tiles.size*(tiles.y/2), "playerR").setOrigin(0, 0);
      this._genLevel();
      this.cursor = this.input.keyboard.createCursorKeys();
      this.cameras.main.startFollow(this.player, false, 0.2, 0.2);
      this.cameras.main.setBounds(0, 0, screenSize.width*3, screenSize.height);
      // this.cameras.main.scrollY = 100;
    }
  
    update () {
      const {left, right, up, space} = this.cursor;

    //   console.log(Phaser.Physics.Matter.MatterPhysics)
  
      if (left.isDown) {
        this.player.setVelocityX(-this.playerSpeed);
        this.player.setTexture("playerL", 1);
      } else if (right.isDown) {
        this.player.setVelocityX(this.playerSpeed);
        this.player.setTexture("playerR", 1);
      } else {
        this.player.setVelocityX(0);
      }

      if (space.isDown) this.onLadder = true;
      else this.onLadder = false;
  
      if (up.isDown) {
        if (this.onLadder) {
            this.player.setVelocityY(-this.playerSpeed)/6;
        } else if (this.player.body.touching.down) {
            this.player.setVelocityY(-gravityPower+gravityPower/1.7);
        }
      }
  
      if (this.player.y > screenSize.height) this.cameras.main.setBounds(0, screenSize.height, screenSize.width*3, screenSize.height);
    }
  }

export default GameScene;