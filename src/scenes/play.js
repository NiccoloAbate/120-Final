class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {
        // player assets
        this.load.image('head', 'assets/sprites/Head.png');
        this.load.image('handclosed', 'assets/sprites/Hand-ClosedFingers.png');
        this.load.image('handopen', 'assets/sprites/Hand-OpenFingers.png');
        this.load.image('feet', 'assets/sprites/Shoe.png');
        this.load.image('joint', 'assets/sprites/Joints.png');
        this.load.image('torso', 'assets/sprites/Torso.png');

        for (let i = 1; i <= playerMoveStartSounds; ++i) {
            this.load.audio('playerStart' + i, 'assets/sfx/player/Start 0' + i + '.wav');
        }
        for (let i = 1; i <= playerMoveContSounds; ++i) {
            this.load.audio('playerCont' + i, 'assets/sfx/player/Cont 0' + i + '.wav');
        }

        this.load.audio('ding', 'assets/sfx/Ding.wav');

        this.defineKeys();
    }

    create() {
        let width = config.width;
        let height = config.height;

        // create matter world
        this.matter.world.setBounds();
        var Bodies = Phaser.Physics.Matter.Matter.Bodies;

        // define key variables
        this.defineKeys();

        // init player settings
        Game.player = {
            score : 0
        };

        this.player = new Player(this);  
        this.playerInHole = false;

        
        // info about the holes
        this.holes = [
            { 
                duration: 10000,
            },
            { 
                duration: 12000,
            },
            { 
                duration: 12000,
            },
            { 
                duration: 15000,
            }
        ]
        this.holeID = 1;
        this.lastHole = this.holes.length;

        this.generateWall();



        // display score
        this.textConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.percentInText = this.add.text(Game.config.width - (borderUISize + borderPadding) - this.textConfig.fixedWidth,
            borderUISize, '0%', this.textConfig);
        
        this.wallTimeBar = this.add.rectangle(borderUISize, borderUISize, 250, 30, '0x0000ff');
        this.wallTimeBar.setOrigin(0, 0);

        // create background
        this.background = this.matter.add.image(0, 0, 'background', null, {ignoreGravity: true, isSensor: true});
        this.background.setDepth(-2);
        this.background.displayWidth = Game.config.width;
        this.background.displayHeight = Game.config.height;
        this.background.x = this.background.displayWidth / 2;
        this.background.y = this.background.displayHeight / 2;

        this.gameOver = false;

        //debug
        this.createDebugKeybinds();
    }

    update(time, delta) {
        
        if (this.gameOver) {
            return;
        }

        if (this.wallTimer < 0) {
            if (this.wallTimer == -100000) {

            }
            else {
                if (this.wallCheck()) {
                    // check if the player won
                    if (this.holeID >= this.lastHole) {
                        this.wallTimer = -100000;
                        this.playerInHole = false; // player is considered not inside the new hole
                        this.setGameVictory();
                        return;
                    }

                    // next hole
                    ++this.holeID;
                    this.playerInHole = false; // player is considered not inside the new hole

                    // fade
                    const fadeTime = 1000;
                    this.oldWallImage = this.currentWallImage;
                    this.oldWallOutline = this.currentWallOutline;
                    this.tweens.add({
                        targets: [this.oldWallImage, this.oldWallOutline],
                        alpha: { from: 1.0, to: 0.0},
                        duration: fadeTime,
                        ease: 'Linear',
                        repeat: 0 
                    });
                    this.time.delayedCall(fadeTime, () => {
                        this.oldWallImage.destroy();
                        this.oldWallOutline.destroy();
                    });
                    this.currentWallCollision.destroy();

                    // generate next wall
                    this.generateWall();
                }
                else {
                    // player lost
                    this.wallTimer = -100000;
                    this.playerInHole = false; // player is considered not inside the new hole
                }
            }
        }
        else {
            // update wall time and wall timer bar
            this.wallTimer -= delta;
            this.wallTimeBar.scaleX = this.wallTimer / this.wallDuration;
        }

        this.player.update();

        this.percentInHole = this.percentPlayerInHole();
        if (this.percentInHole == 1) {
            // player fully inside
            // if this remains true 3 seconds
            if (!this.playerInHole) {
                this.playerInHole = true;
                this.playSuccessSound();
            }
        }
        else {
            if (this.playerInHole) {
                this.playerInHole = false;
                this.playFailureSound();
            }
        }

        let formatPercentText = (p) => parseFloat(p * 100).toFixed(0) + "%";
        this.percentInText.text = formatPercentText(this.percentInHole);
    }

    generateWall() {
        this.currentHoleInfo = this.holes[this.holeID - 1];
        let holeText = 'hole' + this.holeID;
        let holeOutlineText = 'hole' + this.holeID + 'outline';

        this.currentWallCollision = this.matter.add.image(0, 0, holeText, null, {ignoreGravity: true, isSensor: true});
        this.currentWallCollision.setDepth(-1);
        this.currentWallCollision.displayWidth = Game.config.width;
        this.currentWallCollision.displayHeight = Game.config.height;
        this.currentWallCollision.x = this.currentWallCollision.displayWidth / 2;
        this.currentWallCollision.y = this.currentWallCollision.displayHeight / 2;
        this.currentWallCollision.setAlpha(0);

        this.currentWallImage = this.matter.add.image(0, 0, holeText, null, {ignoreGravity: true, isSensor: true});
        this.currentWallImage.setDepth(-1);
        this.currentWallImage.displayWidth = Game.config.width;
        this.currentWallImage.displayHeight = Game.config.height;
        this.currentWallImage.x = this.currentWallImage.displayWidth / 2;
        this.currentWallImage.y = this.currentWallImage.displayHeight;

        this.currentWallOutline = this.matter.add.image(0, 0, holeOutlineText, null, {ignoreGravity: true, isSensor: true});
        this.currentWallOutline.setDepth(-1);
        this.currentWallOutline.displayWidth = Game.config.width;
        this.currentWallOutline.displayHeight = Game.config.height;
        this.currentWallOutline.x = this.currentWallOutline.displayWidth / 2;
        this.currentWallOutline.y = this.currentWallOutline.displayHeight / 2;

        this.wallDuration = this.currentHoleInfo.duration;
        this.wallTimer = this.wallDuration;
        this.tweens.add({
            targets: this.currentWallImage,
            //displayWidth: { from: 0.0, to: this.currentWallImage.displayWidth },
            //displayHeight: { from: 0.0, to: this.currentWallImage.displayHeight },
            scaleX: { from: 0.00001, to: this.currentWallImage.scaleX},
            scaleY: { from: 0.00001, to: this.currentWallImage.scaleY},
            y: { from: this.currentWallImage.displayHeight - 100, to: this.currentWallImage.displayHeight / 2 },
            
            duration: this.wallDuration,
            ease: 'Quad.easeIn',
            repeat: 0 
        });
        this.currentWallImage.setScale(0.00001, 0.00001);
    }

    destroyWall() {
        this.currentWallCollision.destroy();
        this.currentWallImage.destroy();
        this.currentWallOutline.destroy();
    }

    wallCheck() {
        if (this.isPlayerInHole()) {
            console.log('you did it!');
            this.playSuccessSound();
            return true;
        }
        else {
            console.log('you got owned by that there wall');
            this.playFailureSound();
            this.setGameOver();
            return false;
        }
    }

    isPlayerInHole() {
        let Wall = this.currentWallCollision;

        for (let b of this.player.bodies) {
            // all play bodies must be in the transparent part of the texture
            if (this.matter.overlap(Wall, b)) {
                // Check center of the body against the texture
                let xCheck = (b.x + - Wall.getTopLeft().x) / Wall.scaleX;
                let yCheck = (b.y - Wall.getTopLeft().y) / Wall.scaleY;
                if ((this.textures.getPixelAlpha(
                      Math.floor(xCheck),
                      Math.floor(yCheck),
                      Wall.texture.key
                    ) === 255)) {
                    return false;
                }
            }
        }

        // if all are in the transparent part of the texture, then player is in the hole
        return true;
    }

    percentPlayerInHole() {
        let Wall = this.currentWallCollision;

        let nInHole = 0;
        for (let b of this.player.bodies) {
            // all play bodies must be in the transparent part of the texture
            if (this.matter.overlap(Wall, b)) {
                // Check center of the body against the texture
                let xCheck = (b.x - Wall.getTopLeft().x) / Wall.scaleX;
                let yCheck = (b.y - Wall.getTopLeft().y) / Wall.scaleY;
                if ((this.textures.getPixelAlpha(
                      Math.floor(xCheck),
                      Math.floor(yCheck),
                      Wall.texture.key
                    ) === 0)) {
                    ++nInHole;
                }
            }
        }

        return nInHole / this.player.bodies.length;
    }

    setGameOver() {
        //this.scene.pause();
        Game.scene.start('gameover');
        this.gameOver = true;
    }

    setGameVictory() {
        //this.scene.pause();
        Game.scene.start('gamevictory');
        this.gameOver = true;
    }
    
    defineKeys() {
    }

    playSuccessSound() {
        this.sound.play('ding', { volume: 0.2 });
    }
    playFailureSound() {
        this.sound.play('ding', { volume: 0.2, detune: -1200 });
    }

    createDebugKeybinds() {
        this.input.keyboard.on('keydown-R', (event) => {
            console.log("yeahsss");
        });
    }
}



