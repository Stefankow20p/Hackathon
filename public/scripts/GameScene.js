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
          this.checkpoint = {x: tiles.size*2, y: tiles.size*(tiles.y/2)}; // start
        // this.checkpoint = {x: tiles.size*50, y: tiles.size*28}; // sewers
        // this.checkpoint = {x: tiles.size*3, y: tiles.size*3};
        this.mobs = [];
    }
  
    preload () {
        // this.load.image("greyWall", "/assets/bloczekB.png");
        this.load.image("brickDefault", "/assets/bloczekA.png");
        this.load.image("pavement", "/assets/podloga.png");
        this.load.image("playerR", "/assets/protagR.png");
        this.load.image("playerL", "/assets/protagL.png");
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

        this.load.audio("shoot", "public/audio/shoot.mp3");
        this.load.audio("stageTheme", "public/audio/stageTheme.mp3");
        this.load.audio("playerDeath", "public/audio/playerDeath.mp3");

        this.load.image("muteButton", "/assets/menu/sound.png");
        this.load.image("muteButtonHover", "/assets/menu/soundHover.png");
        this.load.image("mutedButton", "/assets/menu/noSound.png");
        this.load.image("mutedButtonHover", "/assets/menu/noSoundHover.png");
    }

    _displayText(text){
        this.reading = true;

        this.dialogueText = this.add.text(screenSize.width/2, screenSize.height*2/5-20, text, {align: "center", color:"#000", fontFamily: "arcade", fontSize: 26, maxLines: 5, wordWrap: { width: 700, useAdvancedWrap: true }}).setOrigin(0.5,0).setDepth(3);
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
    
    _loadMap () {
        // FLOORS & CEILINGS
        for (let i = 0; i < tiles.x*3; i++) {    
            this._addObstacle("void", i, -1); // london ceiling
            this._addObstacle("pavement", i, tiles.y*2-3); // sewers floor
            this._addObstacle("greyWall", i, tiles.y*2-2);
            this._addObstacle("greyWall", i, tiles.y*2-1);
            if (i >= tiles.x+13 && i <= tiles.x+15) continue;
            this._addObstacle("pavement", i, tiles.y-1); // london floor
            this._addObstacle("void", i, tiles.y); // sewers ceiling top
            this._addObstacle("void", i, tiles.y+6); // sewers ceiling bottom
        }
        // WALLS
        for (let i = 0; i < tiles.y*2; i++) {    
            this._addObstacle("pavement", -1, i); // left world wall
            this._addObstacle("pavement", tiles.x*3, i); // right world wall
            if (i > tiles.y && i < tiles.y+6) {
                this._addObstacle("void", 44, i); // sewers ceiling left wall
                this._addObstacle("void", 48, i); // sewers ceiling right wall
            }
        }

        // London-1
        let L = 0;
        for (let i = 0+L*tiles.x; i < tiles.x*1+L*tiles.x; i++) {
            if (i>L*tiles.x+10 && i<L*tiles.x+20) this._addObstacle("brick", i, 14);
            if (i>L*tiles.x+20 && i<L*tiles.x+30) this._addObstacle("brick", i, 11);
            if (i>L*tiles.x+10 && i<L*tiles.x+20) this._addObstacle("brick", i, 8);
            if (i>L*tiles.x+0 && i<L*tiles.x+10) this._addObstacle("brick", i, 5);
        }
        // London-2
        L = 1;
        for (let i = 0+L*tiles.x; i < tiles.x*1+L*tiles.x; i++) {
            if (i>L*tiles.x+10 && i<L*tiles.x+20) this._addObstacle("brick", i, 14);
            if (i>L*tiles.x+20 && i<L*tiles.x+30) this._addObstacle("brick", i, 11);
            if (i>L*tiles.x+10 && i<L*tiles.x+20) this._addObstacle("brick", i, 8);
            if (i>L*tiles.x+0 && i<L*tiles.x+10) this._addObstacle("brick", i, 5);
        }
        // London-3
        L = 2;
        for (let i = 0+L*tiles.x; i < tiles.x*1+L*tiles.x; i++) {
            if (i>L*tiles.x+10 && i<L*tiles.x+20) this._addObstacle("brick", i, 14);
            if (i>L*tiles.x+20 && i<L*tiles.x+30) this._addObstacle("brick", i, 11);
            if (i>L*tiles.x+10 && i<L*tiles.x+20) this._addObstacle("brick", i, 8);
            if (i>L*tiles.x+0 && i<L*tiles.x+10) this._addObstacle("brick", i, 5);
        }
        // Sewers-1
        let S = 0;
        for (let i = 0+S*tiles.x; i < tiles.x*1+S*tiles.x; i++) {
            if (i>S*tiles.x-1 && i<S*tiles.x+4) this._addObstacle("pavement", i, 9+tiles.y);
            if (i>S*tiles.x+5 && i<S*tiles.x+13) this._addObstacle("pavement", i, 12+tiles.y);
            if (i>S*tiles.x+14 && i<S*tiles.x+18) this._addObstacle("pavement", i, 9+tiles.y);
            if (i>S*tiles.x+18 && i<S*tiles.x+21) this._addObstacle("pavement", i, 11+tiles.y);
            if (i>S*tiles.x+23 && i<S*tiles.x+25) this._addObstacle("pavement", i, 9+tiles.y);
            if (i>S*tiles.x+26 && i<S*tiles.x+30) this._addObstacle("pavement", i, 10+tiles.y);
        }
        for (let i = tiles.y+7; i < tiles.y+11; i++) {
            this._addObstacle("greyWall", tiles.x*S+30, i);
        }
        // Sewers-2
        S = 1;
        for (let i = 0+S*tiles.x; i < tiles.x*1+S*tiles.x; i++) {
            if (i>S*tiles.x-1 && i<S*tiles.x+4) this._addObstacle("pavement", i, 9+tiles.y);
            if (i>S*tiles.x+5 && i<S*tiles.x+13) this._addObstacle("pavement", i, 12+tiles.y);
            if (i>S*tiles.x+14 && i<S*tiles.x+18) this._addObstacle("pavement", i, 9+tiles.y);
            if (i>S*tiles.x+18 && i<S*tiles.x+21) this._addObstacle("pavement", i, 11+tiles.y);
            if (i>S*tiles.x+23 && i<S*tiles.x+25) this._addObstacle("pavement", i, 9+tiles.y);
            if (i>S*tiles.x+26 && i<S*tiles.x+30) this._addObstacle("pavement", i, 10+tiles.y);
        }
        for (let i = tiles.y+7; i < tiles.y+11; i++) {
            this._addObstacle("greyWall", tiles.x*S+30, i);
        }
        // Sewers-3
        S = 2;
        for (let i = 0+S*tiles.x; i < tiles.x*1+S*tiles.x; i++) {
            if (i>S*tiles.x-1 && i<S*tiles.x+4) this._addObstacle("pavement", i, 9+tiles.y);
            if (i>S*tiles.x+5 && i<S*tiles.x+13) this._addObstacle("pavement", i, 12+tiles.y);
            if (i>S*tiles.x+14 && i<S*tiles.x+18) this._addObstacle("pavement", i, 9+tiles.y);
            if (i>S*tiles.x+18 && i<S*tiles.x+21) this._addObstacle("pavement", i, 11+tiles.y);
            if (i>S*tiles.x+23 && i<S*tiles.x+25) this._addObstacle("pavement", i, 9+tiles.y);
            if (i>S*tiles.x+26 && i<S*tiles.x+30) this._addObstacle("pavement", i, 10+tiles.y);
        }
        for (let i = tiles.y+7; i < tiles.y+11; i++) {
            this._addObstacle("greyWall", tiles.x*S+30, i);
        }
    }


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

        this._displayText("Czystka szczurów w trakcie Wielkiej Zarazy mającej miejsce w latach 1665 - 1666 \n Press space to exit");
    
        this._loadBG("london_2", 0, -1);
        this._loadBG("london_2", tiles.x, -1);
        this._loadBG("london_2", tiles.x*2, -1);

        this._loadBG("sewers_2", tiles.x, tiles.y);
        this._loadBG("sewers_1", 0, tiles.y);
        this._loadBG("sewers_1", tiles.x*2, tiles.y);
        this.player = this.physics.add.image(this.checkpoint.x, this.checkpoint.y, "playerR").setOrigin(0, 0);
        this.player.setDisplaySize(tiles.size, tiles.size*1.55);
        
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
            let bullet = this.physics.add.image(this.player.x, this.player.y+tiles.size/2,"bullet").setOrigin(0,0);
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
          mob.setDisplaySize(tiles.size, tiles.size);
          mob.setVelocity(mobVelocityX * currentlyFacing, mobVelocityY * currentlyFacing);
            mob.body.allowGravity = mobGravity
          this.physics.add.collider(mob, this.obstacles);
          let mobColider1;
          let mobColider2;


            mobColider1 = this.physics.add.image (
                mob.x + (tiles.size) * mobColider1Exists.x,
                mob.y + (tiles.size) * mobColider1Exists.y
            ).setOrigin(0,0);
            mobColider1.setDisplaySize(tiles.size, tiles.size);
            mobColider1.body.allowGravity = false;
            mobColider1.visible = false;
            mobColider1.setImmovable(true);


            mobColider2 = this.physics.add.image (
                mob.x + (tiles.size) * mobColider2Exists.x,
                mob.y + (tiles.size) * mobColider2Exists.y
            ).setOrigin(0,0);
            mobColider2.setDisplaySize(tiles.size, tiles.size);
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
            this.sound.add('playerDeath').play();

          });

          this.mobs.push(mob);
        };

        //mobs in severs
        createMob(
            18,23, "bat", "bat", 100, 0,
            {exists:true, x:-5,y:0},
            {exists:true, x:10,y:0}
        );
        createMob(
            10,32, "ratR", "ratL", 100, 0,
            {exists:true, x:-4,y:0},
            {exists:true, x:4,y:0}
        );
        createMob(
            13,32, "ratR", "ratL", 100, 0,
            {exists:true, x:-4,y:0},
            {exists:true, x:4,y:0}
        );
        createMob(
            45,32, "ratR", "ratL", 100, 0,
            {exists:true, x:-4,y:0},
            {exists:true, x:4,y:0}
        );
        createMob(
            80,32, "ratR", "ratL", 100, 0,
            {exists:true, x:-4,y:0},
            {exists:true, x:6,y:0}
        );
        createMob(
            90,32, "ratR", "ratL", 100, 0,
            {exists:true, x:-4,y:0},
            {exists:true, x:4,y:0}
        );
        createMob(
            90,32, "ratR", "ratL", 100, 0,
            {exists:true, x:-30,y:0},
            {exists:true, x:4,y:0}
        );
        createMob(
            16,26, "ratR", "ratL", 100, 0,
            {exists:true, x:-2,y:0},
            {exists:true, x:2,y:0}
        );
        createMob(
            28,27, "ratR", "ratL", 100, 0,
            {exists:true, x:-2,y:0},
            {exists:true, x:1.9,y:0}
        );
        createMob(
            11,29, "ratR", "ratL", 100, 0,
            {exists:true, x:-6,y:0},
            {exists:true, x:2,y:0}
        );
        createMob(
            12,29, "ratR", "ratL", 100, 0,
            {exists:true, x:-3,y:0},
            {exists:true, x:1,y:0}
        );
        createMob(
            42,29, "ratR", "ratL", 100, 0,
            {exists:true, x:-4,y:0},
            {exists:true, x:3,y:0}
        );
        createMob(
            74,29, "ratR", "ratL", 100, 0,
            {exists:true, x:-5,y:0},
            {exists:true, x:3,y:0}
        );
        createMob(
            74,29, "ratR", "ratL", 100, 0,
            {exists:true, x:-1,y:0},
            {exists:true, x:2,y:0}
        );
        createMob(
            71,27, "bat", "bat", 200, 0,
            {exists:true, x:-3,y:0},
            {exists:true, x:4,y:0}, 
            1, false
        );
        createMob(
            40,27, "bat", "bat", 300, 0,
            {exists:true, x:-1,y:0},
            {exists:true, x:5,y:0}, 
            1, false
        );
        createMob(
            25,31, "bat", "bat", 200, 0,
            {exists:true, x:-1,y:0},
            {exists:true, x:5,y:0}, 
            1, false
        );
        createMob(
            40,27, "bat", "bat", 0, 200,
            {exists:true, x:0,y:-2.8},
            {exists:true, x:0,y:2.9}, 1, false
        );
        createMob(
            24,26, "bat", "bat", 0, 200,
            {exists:true, x:0,y:-1.8},
            {exists:true, x:0,y:0.9}, 1, false
        );
        createMob(
            63,27, "bat", "bat", 0, 300,
            {exists:true, x:0,y:-2.8},
            {exists:true, x:0,y:2.9}, 1, false
        );
        createMob(
            85,27, "bat", "bat", 0, 300,
            {exists:true, x:0,y:-2.8},
            {exists:true, x:0,y:4.9}, 1, false
        );
        //--------------mobs in sewers

        //--------------mobs on the surface

        createMob(
            5, 4, "ratR", "ratL", 100, 0,
            {exists:true, x:-4,y:0},
            {exists:true, x:4,y:0}
        );
        createMob(
            15, 7, "ratR", "ratL", 100, 0,
            {exists:true, x:-4,y:0},
            {exists:true, x:4,y:0}
        );
        createMob(
            15, 13, "ratR", "ratL", 100, 0,
            {exists:true, x:-4,y:0},
            {exists:true, x:4,y:0}
        );
        createMob(
            25, 10, "ratR", "ratL", 100, 0,
            {exists:true, x:-4,y:0},
            {exists:true, x:4,y:0}
        );
        createMob(
            35, 4, "ratR", "ratL", 100, 0,
            {exists:true, x:-4,y:0},
            {exists:false, x:4,y:0}
        );
        createMob(
            47, 7, "ratR", "ratL", 100, 0,
            {exists:true, x:-4,y:0},
            {exists:true, x:4,y:0}
        );
        createMob(
            47, 13, "ratR", "ratL", -150, 0,
            {exists:true, x:-4,y:0},
            {exists:true, x:4,y:0}
        );
        createMob(
            57, 10, "ratR", "ratL", 100, 0,
            {exists:true, x:-4,y:0},
            {exists:true, x:4,y:0}
        );
        createMob(
            69, 4, "ratR", "ratL", -200, 0,
            {exists:true, x:-4,y:0},
            {exists:false, x:4,y:0}
        );
        createMob(
            79, 7, "ratR", "ratL", 100, 0,
            {exists:true, x:-4,y:0},
            {exists:true, x:4,y:0}
        );
        createMob(
            79, 13, "ratR", "ratL", 100, 0,
            {exists:true, x:-4,y:0},
            {exists:true, x:4,y:0}
        );
        createMob(
            89, 10, "ratR", "ratL", -100, 0,
            {exists:true, x:-4,y:0},
            {exists:true, x:4,y:0}
        );
        createMob(
            89, 16, "ratR", "ratL", -100, 0,
            {exists:true, x:-10,y:0},
            {exists:true, x:4,y:0}
        );
        createMob(
            70, 16, "ratR", "ratL", 100, 0,
            {exists:true, x:-10,y:0},
            {exists:true, x:10,y:0}
        );
        createMob(
            20, 16, "ratR", "ratL", -100, 0,
            {exists:true, x:-1,y:0},
            {exists:true, x:6,y:0}
        );
        createMob(
            26, 16, "ratR", "ratL", 100, 0,
            {exists:true, x:-5,y:0},
            {exists:true, x:5,y:0}
        );
        createMob(
            20, 16, "ratR", "ratL", 500, 0,
            {exists:true, x:-2,y:0},
            {exists:true, x:2,y:0}
        );

        
        //--------------mobs on the surface
    //------------------mobs

    // 19:21
    this.muteButton = this.add.image( 20, 20, "muteButton").setScale(2).setOrigin(0).setInteractive();
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