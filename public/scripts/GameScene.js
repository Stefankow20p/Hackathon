import { playerVelocity, tiles, screenSize, gravityPower, distancesForBulletTravel, playerBulletSpeed } from './const.js';

// this.basket.setBounce(1, 1);
// this.player.setScale(.3);

// LOREM IPSUM

class GameScene extends Phaser.Scene {
    constructor () {
        super("scene-game");
        this.cursor;
        this.playerSpeed = playerVelocity;
        this.player;
        this.onLadder = false;
        this.playerFacing = 1; // determines the direction player will shoot 1 - right, -1 - left
        this.obstacles = []; // list of objects that collide with bullets used for later references
          this.checkpoint = {x: tiles.size*2, y: tiles.size*(tiles.y/2)}; // counted in tiles
        // this.checkpoint = {x: tiles.size*50, y: tiles.size*28};
        // this.checkpoint = {x: tiles.size*3, y: tiles.size*3};
        this.mobs = [];
    }
  
    preload () {
        // this.load.image("greyWall", "/assets/bloczekB.png");
        this.load.image("brickDefault", "/assets/bloczekA.png");
        this.load.image("pavement", "/assets/podloga.png");
        this.load.image("playerR", "/assets/playerR.png");
        this.load.image("playerL", "/assets/playerL.png");
        this.load.image("greyWall", "/assets/sciana.png");
        this.load.image("bullet","/assets/bullet.png");
        this.load.image("sewers_2", "/assets/sewersBG.png");
        this.load.image("sewers_1", "/assets/sewersBG2.png");
        this.load.image("london_1", "/assets/londonBG.png");
        this.load.image("london_2", "/assets/londonBG2.png");
        this.load.image("void", "assets/void.png");
        this.load.image("brick", "assets/brick.png");
        this.load.image("ratR","/assets/mouseR.png");
        this.load.image("ratL","/assets/mouseL.png");
        this.load.image("bat","/assets/bat.png");
        this.load.image("dialogue","/assets/dialogue.png");

        this.load.audio("shoot", "public/audio/shooting.mp3");
        this.load.audio("stageTheme", "public/audio/stageTheme.mp3");

    }

    _displayText(text){
        this.reading = true;

        this.dialogueText = this.add.text(screenSize.width/2, screenSize.height*2/5-20, text, {align: "center", color:"#000", fontFamily: "arcade", fontSize: 32, fixedWidth:600, maxLines: 5, wordWrap: { width: 600, useAdvancedWrap: true }}).setOrigin(0.5,0).setDepth(3);
        this.dialgueBox = this.add.image(screenSize.width/2, screenSize.height/2, "dialogue").setOrigin(0.5,0.5).setScale(3).setDepth(2);
        this.dialgueBox.visible = true;
        this.dialogueText.visible = true;

        this.input.keyboard.on("keydown-SPACE", () =>{
            if(this.reading){
                this.reading = false;
                this.dialgueBox.visible = false;
                this.dialogueText.visible = false;
            }
        })
    }
  
  
    _addObstacle (img, x = 0, y = 0) {
        const brick = this.physics.add.image(tiles.size*x, tiles.size*y, img).setOrigin(0, 0);
        brick.setImmovable(true);
        brick.body.allowGravity = false;
        this.physics.add.collider(this.player, brick); // YYY aktualnie tylko player
        brick.setDisplaySize(tiles.size, tiles.size);
        this.obstacles.push(brick);
    }
    _loadBG (img, x = 0, y = 0) {
        const bg = this.add.image(tiles.size*x, tiles.size*y, img).setOrigin(0, 0);
        bg.setDisplaySize(tiles.size*tiles.x, tiles.size*tiles.y);
    }
    // ========================================== MICHAŁ ============================
    _loadMap () {
        // 1st *******************************
        for (let i = 0; i < tiles.x; i++) {
            this._addObstacle("greyWall", i, 0);
            this._addObstacle("greyWall", i, 17);
            // random
            if (i < 10) this._addObstacle("greyWall", i, 14);
            if (i > 15) this._addObstacle("greyWall", i, 14);
        }
        for (let i = 0; i < tiles.y; i++) {
            this._addObstacle("greyWall", 0, i);
        }
        // stairs
        for (let i = 5; i < 15; i++) {
            this._addObstacle("greyWall", i, 16-i);
        }
    
        // 2nd *******************************
        const level2 = {x: 1, y: 0};
        for (let i = tiles.x*level2.x; i < tiles.x*2; i++) {
            // ceiling & floor
            this._addObstacle("brickDefault", i, 0);
            if (i < tiles.x*level2.x+13 || i > tiles.x*level2.x+15) {
                this._addObstacle("brickDefault", i, tiles.y-1); // floor
            }
        }
    
        // 3rd *******************************
        const level3 = {x: 2, y: 0};
        for (let i = tiles.x*level3.x; i < tiles.x+tiles.x*level3.x; i++) {
            this._addObstacle("pavement", i, 0);
            this._addObstacle("pavement", i, 17);
        }
        for (let i = 0; i < tiles.y; i++) {
            this._addObstacle("pavement", tiles.x*3-1, i);
        }
    
        // 4th (SEWERS) *******************************
        for (let i = tiles.y+7; i < tiles.y*2-3; i++) {
            this._addObstacle("brick", 0, i);
            this._addObstacle("brick", 0, i);
            this._addObstacle("brick", tiles.x*3-1, i);
        }
        for (let i = 0; i < tiles.x*3; i++) {
            this._addObstacle("pavement", i, tiles.y*2 - 3);
            this._addObstacle("greyWall", i, tiles.y*2 - 2);
            this._addObstacle("greyWall", i, tiles.y*2 - 1);

            if (i < tiles.x*level2.x+13 || i > tiles.x*level2.x+15) {
                this._addObstacle("brickDefault", i, tiles.y-1); // floor
                this._addObstacle("void", i, tiles.y+6);
            }
        }
        for (let i = 0; i < 6; i++) {
            this._addObstacle("void", tiles.x+12, tiles.y+i);
            this._addObstacle("void", tiles.x+16, tiles.y+i);
        }

        // 5th (SEWERS)
    }
    // ========================================== MICHAŁ / ============================


    // ========================================== MAREK (Laddery) ============================
    // _addLadder() {
    //   this.ladder = this.physics.add.image(tiles.size*20, tiles.size*12, "greyWall").setOrigin(0, 0);
    //   this.ladder.setImmovable(true);
    //   this.ladder.body.allowGravity = false;
    //   this.ladder.setDisplaySize(tiles.size, tiles.size);
      
    //     // this.physics.add.overlap(this.player, this.ladder);    
    //     // this.physics.world.on('overlap', (gameObject1, gameObject2, body1, body2) => {
        //     if (gameObject1 == this.player && gameObject2 == this.ladder) {
    //     //         this.onLadder = true;
    //     //         console.log("LADDER")
    //     //     } else this.onLadder = false;
    //     // });
    // }
  
    create () {
        // this.ladder = this.physics.add.group([
        //     { key: 'greyWall', frame: 0, repeat: 10, setXY: { x: tiles.size*3, y: tiles.size*2, stepY: tiles.size} },
        //     { key: 'greyWall', frame: 0, repeat: 10, setXY: { x: tiles.size*6, y: tiles.size*2, stepY: tiles.size} }
        // ]);
        // this.ladder.children.iterate((child) => {
        //     child.setImmovable(true);
        //     child.body.allowGravity = false;
        //     child.setDisplaySize(tiles.size, tiles.size).setOrigin(0, 0)
        // });

        // Music
        this.theme = this.sound.add('stageTheme');
        this.theme.loop = (true);
        this.theme.play();
        

        this._displayText("Czystka szczurów w trakcie Wielkiej Zarazy mającej miejsce w latach 1665 - 1666");
    
        this._loadBG("london_2", 0, -1);
        this._loadBG("london_2", tiles.x, -1);
        this._loadBG("london_2", tiles.x*2, -1);

        this._loadBG("sewers_2", tiles.x, tiles.y);
        this._loadBG("sewers_1", 0, tiles.y);
        this._loadBG("sewers_1", tiles.x*2, tiles.y);
        this.player = this.physics.add.image(this.checkpoint.x, this.checkpoint.y, "playerR").setOrigin(0, 0);
        
        this.player.body.onOverlap = true;
        this.physics.add.overlap(this.player, this.ladder);
        // this.physics.world.on('overlap', (gameObject1, gameObject2, body1, body2) => {
        //     if (gameObject1 == this.player && gameObject2 == this.ladder) {
        //         this.onLadder = true;
        //         console.log("LADDER")
        //     } else this.onLadder = false;
        // });

        // ========================================== MAREK (Laddery) / ============================

        this._loadMap();
        this.cursor = this.input.keyboard.createCursorKeys();

        // camera settings
        this.cameras.main.startFollow(this.player, false, 0.2, 0.2);
        this.cameras.main.setBounds(0, 0, screenSize.width*3, screenSize.height);


        //------------------shooting
        const shoot = () => {
            this.sound.add('shoot').play();
            let bullet = this.physics.add.image(this.player.x, this.player.y,"bullet").setOrigin(0,0);
            bullet.body.allowGravity = false;
            bullet.setVelocity(playerBulletSpeed * this.playerFacing, 0);

            //destroys bullet after it travels set distance
            let hitBorder = this.physics.add.image (
                this.player.x + tiles.size * this.playerFacing * distancesForBulletTravel.playerBullet,
                this.player.y
            ).setOrigin(0,0);
            hitBorder.body.allowGravity = false;
            hitBorder.visible = false;
            hitBorder.setImmovable(true);

            this.physics.add.collider(bullet, hitBorder, () => {
                hitBorder.destroy();
                bullet.destroy();
            });

            //destroys bullet if it hits a wall
            this.physics.add.collider(bullet, this.obstacles, () => {
                hitBorder.destroy();
                bullet.destroy();
            });

            //kill mobs
            this.physics.add.collider(bullet, this.mobs,  (bullet, mob) => {
                hitBorder.destroy();
                bullet.destroy();
                mob.destroy();
            });
        }
        this.input.keyboard.on('keydown-C', shoot);
    
    //------------------shooting


    //------------------mobs
        const createMob = (
            startX, startY,
            mobTextureR, mobTextureL, 
            mobVelocityX, mobVelocityY, 
            mobColider1Exists = {exists: true, x: -2, y:0}, 
            mobColider2Exists = {exists: true, x: 2, y:0}, 
            currentlyFacing = 1,
            mobGravity = true
            ) => {
          const mob = this.physics.add.image(startX * tiles.size, startY * tiles.size, mobTextureR).setOrigin(0,0);
          mob.setVelocity(mobVelocityX * currentlyFacing, mobVelocityY * currentlyFacing);
            mob.body.allowGravity = mobGravity
          this.physics.add.collider(mob, this.obstacles);
          let mobColider1;
          let mobColider2;


            mobColider1 = this.physics.add.image (
                mob.x + (tiles.size) * mobColider1Exists.x,
                mob.y + (tiles.size) * mobColider1Exists.y
            ).setOrigin(0,0);
            mobColider1.body.allowGravity = false;
            mobColider1.visible = false;
            mobColider1.setImmovable(true);


            mobColider2 = this.physics.add.image (
                mob.x + (tiles.size) * mobColider2Exists.x,
                mob.y + (tiles.size) * mobColider2Exists.y
            ).setOrigin(0,0);
            mobColider2.body.allowGravity = false;
            mobColider2.visible = false;
            mobColider2.setImmovable(true);

          // changes mob movement on collision
          this.physics.add.collider(mob, [mobColider1, mobColider2], () => {
              if(currentlyFacing == 1){
                mob.setTexture(mobTextureL);
                currentlyFacing = -1;
              }else{
                mob.setTexture(mobTextureR);
                currentlyFacing = 1;
              }
              mob.setVelocity(mobVelocityX * currentlyFacing, mobVelocityY * currentlyFacing);
          });

          //kill player on collision
          this.physics.add.collider(mob, this.player, () => {
            this.player.body.x = this.checkpoint.x;
            this.player.body.y = this.checkpoint.y;
          });

          this.mobs.push(mob);
        };

        createMob(
            18,13, "ratR", "ratL", 100, 0,
            {exists:true, x:-2,y:0},
            {exists:true, x:2,y:0}
        );
        createMob(
            23,13, "ratR", "ratL", 100, 0,
            {exists:true, x:-2,y:0},
            {exists:true, x:2,y:0}
        );
        createMob(
            28,13, "ratR", "ratL", 100, 0,
            {exists:true, x:-2,y:0},
            {exists:true, x:2,y:0}
        );

        createMob(
            50,32, "ratR", "ratL", 100, 0,
            {exists:true, x:-8,y:0},
            {exists:true, x:8,y:0}
        );

        createMob(
            40,27, "bat", "bat", 0, 100,
            {exists:true, x:0,y:-2},
            {exists:true, x:0,y:2}, 1, false
        );

    //------------------mobs
    }

    update () {
        const {left, right, up, shift} = this.cursor;

        if (left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
            this.player.setTexture("playerL");
            this.playerFacing = -1;
        } else if (right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
            this.player.setTexture("playerR");
            this.playerFacing = 1;
        } else {
            this.player.setVelocityX(0);
        }

        // temp: flying
        if (shift.isDown) this.onLadder = true;
        else this.onLadder = false;

        if (up.isDown) {
            if (this.onLadder) {
                this.player.setVelocityY(-this.playerSpeed)/6;
            } else if (this.player.body.touching.down) {
                this.player.setVelocityY(-gravityPower+gravityPower/1.7);
            }
        }
        
        //   change camera location
        if (this.player.y > screenSize.height) this.cameras.main.setBounds(0, screenSize.height, screenSize.width*3, screenSize.height);
        else this.cameras.main.setBounds(0, 0, screenSize.width*3, screenSize.height);
    }
}

export default GameScene;