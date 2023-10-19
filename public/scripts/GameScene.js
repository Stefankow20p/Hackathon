import { playerVelocity, tiles, screenSize, gravityPower, distancesForBulletTravel } from './const.js';

class GameScene extends Phaser.Scene {
    constructor () {
      super("scene-game");
      this.cursor;
      this.playerSpeed = playerVelocity;
      this.player;
      this.onLadder = false;
      this.ladder;
      // determines the direction player will shoot 1 - right, -1 - left
      this.playerFacing = 1;
      //lsit of objects that collide with bullets used for later references
      this.objectsThatCollideBullets = [];
    }
  
    preload () {
      this.load.image("brickSnow", "/assets/bloczekB.png");
      this.load.image("brickDefault", "/assets/bloczekA.png");
      this.load.image("pavement", "/assets/podloga.png");
      this.load.image("playerR", "/assets/playerR.png");
      this.load.image("playerL", "/assets/playerL.png");
      this.load.image("brickWall", "/assets/brick.png");
      this.load.image("bullet","/assets/bullet.png");
    }
  
    // this.basket.setBounce(1, 1);
    // this.player.setScale(.3);
    _addObject (img, x=0, y=0) {
      let brick = this.physics.add.image(tiles.size*x, tiles.size*y, img).setOrigin(0, 0);
      brick.setImmovable(true);
      brick.body.allowGravity = false;
      this.physics.add.collider(this.player, brick); // YYY aktualnie tylko player
      brick.setDisplaySize(tiles.size, tiles.size);
      this.objectsThatCollideBullets.push(brick);
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
    _addLadder() {
      this.ladder = this.physics.add.image(tiles.size*20, tiles.size*12, "brickWall").setOrigin(0, 0);
      this.ladder.setImmovable(true);
      this.ladder.body.allowGravity = false;
      this.ladder.setDisplaySize(tiles.size, tiles.size);
      
        // this.physics.add.overlap(this.player, this.ladder);    
        // this.physics.world.on('overlap', (gameObject1, gameObject2, body1, body2) => {
        //     if (gameObject1 == this.player && gameObject2 == this.ladder) {
        //         this.onLadder = true;
        //         console.log("LADDER")
        //     } else this.onLadder = false;
        // });
    }
  
    create () {
      // this.player.setCollideWorldBounds(true);
    //   this.ladder = this.physics.add.image(tiles.size*20, tiles.size*12, "brickWall").setOrigin(0, 0);
    //   this.ladder.setImmovable(true);
    //   this.ladder.body.allowGravity = false;
    //   this.ladder.setDisplaySize(tiles.size, tiles.size);
    this._addLadder();
  
      this.player = this.physics.add.image(tiles.size, tiles.size*(tiles.y/2), "playerR").setOrigin(0, 0);

    //   --
    this.player.body.onOverlap = true;
    this.physics.add.overlap(this.player, this.ladder);    
    this.physics.world.on('overlap', (gameObject1, gameObject2, body1, body2) => {
        if (gameObject1 == this.player && gameObject2 == this.ladder) {
            this.onLadder = true;
            console.log("LADDER")
        } else this.onLadder = false;
    });
    // --

      this._genLevel();
      this.cursor = this.input.keyboard.createCursorKeys();
      this.cameras.main.startFollow(this.player, false, 0.2, 0.2);
      this.cameras.main.setBounds(0, 0, screenSize.width*3, screenSize.height);
      // this.cameras.main.scrollY = 100;

      //------------------shooting
      const shoot = () =>{
        let bullet = this.physics.add.image(this.player.x, this.player.y,"bullet").setOrigin(0,0);
        bullet.body.allowGravity = false;
        bullet.setVelocity(1000 * this.playerFacing, 0);

        //destroys bullet after it travels set distance
        let hitBorder = this.physics.add.image(
          this.player.x + tiles.size * this.playerFacing * distancesForBulletTravel.playerBullet,
          this.player.y
          ).setOrigin(0,0);
        hitBorder.body.allowGravity = false;
        hitBorder.visible = false;

        this.physics.add.collider(bullet, hitBorder, ()=>{
          hitBorder.destroy();
          bullet.destroy();
        });

        //destroys bullet if it hits a wall
        this.physics.add.collider(bullet, this.objectsThatCollideBullets, ()=>{
          hitBorder.destroy();
          bullet.destroy();
        });
        
      }
      this.input.keyboard.on('keyup-SPACE', shoot);
      this.input.keyboard.on('keydown-LEFT', () => {
        this.playerFacing = -1;
      });
      this.input.keyboard.on('keydown-RIGHT', () => {
        this.playerFacing = 1;
      });
      //------------------shooting
    }
  
    update () {
      const {left, right, up, space} = this.cursor;

    //   console.log(Phaser.Physics.Matter.MatterPhysics)
  
      if (left.isDown) {
        this.player.setVelocityX(-this.playerSpeed);
        this.player.setTexture("playerL");
      } else if (right.isDown) {
        this.player.setVelocityX(this.playerSpeed);
        this.player.setTexture("playerR");
      } else {
        this.player.setVelocityX(0);
      }

      // if (space.isDown) this.onLadder = true;
      // else this.onLadder = false;
  
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