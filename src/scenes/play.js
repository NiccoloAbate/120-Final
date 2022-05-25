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
        this.load.image('jointBlue', 'assets/sprites/Joints.png');
        this.load.image('jointOrange', 'assets/sprites/JointsOrange.png');
        this.load.image('jointRed', 'assets/sprites/JointsRed.png');
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
                // # 1 circle
                duration: 6000,
            },
            { 
                // # 2 triangle
                duration: 12000,
            },
            { 
                // # 3 slanted oval
                duration: 12000,
            },
            { 
                // # 4 star
                duration: 15000,
            },
            { 
                // # 5 horizontal line
                duration: 15000,
            },
            { 
                // # 6 vertical line
                duration: 20000,
            },
            { 
                // # 7 thin outline
                duration: 25000,
            },
            { 
                // # 8 L in bottom left corner
                duration: 20000,
            },
            { 
                // # 9 arrow pointing to top right
                duration: 28000,
            }
        ]
        this.holeID = holeStartID;

        // the hole # to start the scene
        this.sceneHole = 4;

        if (this.holeID > this.sceneHole) {
            this.setNextScene(); // if loading from checkpoint, start with the mid scene
        }

        // the last hole to win
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

        // music
        this.globalMusicVolume = 0.15;
        this.Track1 = Audio.addMulti(this, 'Track1');
        this.Track1.setGlobalConfig({loop: true, volume: this.globalMusicVolume});
        this.Track1.play();

        this.gameOver = false;

        //debug
        this.createDebugKeybinds();
    }

    update(time, delta) {
        
        this.player.update(time, delta); // update even if game is over

        if (this.gameOver) {
            return;
        }

        if (this.wallTimer < 0) {
            if (this.wallTimer == 10000000) {

            }
            else {
                if (this.wallCheck()) {
                    // check if the player reached the scene 
                    if (this.holeID == this.sceneHole) {
                        this.scene.pause();
                        this.playerInHole = false; // player is considered not inside the new hole
                        this.setNextScene();
                    }
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
                    this.wallTimer = 10000000;
                    this.playerInHole = false; // player is considered not inside the new hole
                }
            }
        }
        else {
            // update wall time and wall timer bar
            this.wallTimer -= delta;
            this.wallTimeBar.scaleX = this.wallTimer / this.wallDuration;
        }

        this.percentInHole = this.percentPlayerInHole(true);
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

        let FilteredVol = this.globalMusicVolume * clamp(this.wallTimer / this.currentHoleInfo.duration, 0, 1);
        let NormalVol = this.globalMusicVolume - FilteredVol;
        this.Track1.setConfig('Normal', {volume: NormalVol});
        this.Track1.setConfig('Filtered', {volume: FilteredVol});
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
            y: { from: this.currentWallImage.displayHeight - 210, to: this.currentWallImage.displayHeight / 2 },
            
            duration: this.wallDuration,
            ease: 'Expo.easeIn',
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
            this.spawnHitSprites();
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
                    b.insideHole = false;
                    return false;
                }
                else {
                    b.insideHole = true;
                }
            }
        }

        // if all are in the transparent part of the texture, then player is in the hole
        return true;
    }

    percentPlayerInHole(tintLimbs = false) {
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
                    // in hole
                    ++nInHole;
                    b.tint = 0xffffff; // tint doesn't work... but something like this!
                    b.insideHole = true;
                }
                else {
                    // not in hole
                    b.insideHole = false;
                    b.tint = 0x000000;
                    console.log('tint!'); // tint doesn't work... but something like this!
                }
            }
        }

        return nInHole / this.player.bodies.length;
    }

    setGameOver() {
        //this.scene.pause();
        Game.scene.start('gameover');
        this.gameOver = true;

        let width = Game.config.width;
        let height = Game.config.height;

        // test hitbox to start game
        this.quitButton = this.matter.add.image(width / 5, (height / 3) * 2, 'quitButton', null,
            { ignoreGravity: true, isSensor: true });
        this.quitButton.setOrigin(0.5, 0.5);
        this.quitButton.setScale(1,1);
        this.quitButton.setDepth(-1);

        this.player.dragOverlapTargets.push(this.quitButton);
        // hand animations, maybe should refactor into 'grabable' in player.js or something
        this.player.dragCallbacks.overlapEnter.push((l, t) => {
            if (t == this.quitButton && l.limbType == 'hand') {
                l.setTexture('handopen');
                l.setScale(l.scaleX * 1.3, l.scaleY * 1.3);
                this.sound.play('click', { volume: 3.0, detune: 600 });
            }
        });
        this.player.dragCallbacks.overlapExit.push((l, t) => {
            if (t == this.quitButton && l.limbType == 'hand') {
                l.setTexture('handclosed');
                l.setScale(l.scaleX / 1.3, l.scaleY / 1.3);
                this.sound.play('click', { volume: 3.0, detune: 600 });
            }
        });
        // start game when release limb over the quitButton
        this.player.dragCallbacks.dragEnd.push((l, overlapped) => {
            if (overlapped.includes(this.quitButton) && l.limbType == 'hand') {
                l.setTexture('handclosed');
                l.setScale(l.scaleX / 1.3, l.scaleY / 1.3);
                this.sound.play('click', { volume: 3.0, detune: 1200 });
                this.time.delayedCall(250, () => {
                    this.Track1.destroy();
                    Game.scene.start("menu");
                    Game.scene.stop("gameover");
                    this.scene.stop();
                });
            }
        });

        this.retryButton = this.matter.add.image((width / 5) * 4, (height / 3) * 2, 'retryButton', null,
            { ignoreGravity: true, isSensor: true });
        this.retryButton.setOrigin(0.5, 0.5);
        this.retryButton.setScale(1,1);
        this.retryButton.setDepth(-1);

        this.player.dragOverlapTargets.push(this.retryButton);
        // hand animations, maybe should refactor into 'grabable' in player.js or something
        this.player.dragCallbacks.overlapEnter.push((l, t) => {
            if (t == this.retryButton && l.limbType == 'hand') {
                l.setTexture('handopen');
                l.setScale(l.scaleX * 1.3, l.scaleY * 1.3);
                this.sound.play('click', { volume: 3.0, detune: 600 });
            }
        });
        this.player.dragCallbacks.overlapExit.push((l, t) => {
            if (t == this.retryButton && l.limbType == 'hand') {
                l.setTexture('handclosed');
                l.setScale(l.scaleX / 1.3, l.scaleY / 1.3);
                this.sound.play('click', { volume: 3.0, detune: 600 });
            }
        });
        // start game when release limb over the retryButton
        this.player.dragCallbacks.dragEnd.push((l, overlapped) => {
            if (overlapped.includes(this.retryButton) && l.limbType == 'hand') {
                l.setTexture('handclosed');
                l.setScale(l.scaleX / 1.3, l.scaleY / 1.3);
                this.sound.play('click', { volume: 3.0, detune: 1200 });
                this.time.delayedCall(250, () => {
                    this.Track1.destroy();
                    Game.scene.stop("gameover");
                    this.scene.restart();
                    console.log("still going?");
                });
            }
        });
    }

    setGameVictory() {
        //this.scene.pause();
        Game.scene.start('gamevictory');
        this.gameOver = true;
    }

    setNextScene() {
        Game.scene.start('gamescene');
        //this.gameOver = true;
    }
    
    defineKeys() {
    }

    playSuccessSound() {
        this.sound.play('ding', { volume: 0.2 });
    }
    playFailureSound() {
        this.sound.play('ding', { volume: 0.2, detune: -1200 });
    }

    spawnHitSprites() {
        for (let b of this.player.bodies) {
            if (!b.insideHole) {
                let tex = 'hit0';
                let hitSprite = this.matter.add.image(b.x, b.y, tex, null,
                    { isSensor: true, ignoreGravity: true });
                let scale = (b.width / hitSprite.displayWidth) * 1.15;
                hitSprite.setScale(scale, scale);
                hitSprite.setDepth(1);

                let fadeTime = 1000 + getRandomIntInclusive(-100, 100);
                this.tweens.add({
                    targets: hitSprite,
                    alpha: { from: 1.0, to: 0.0 },
                    scaleX: { from: scale, to: ZEROSCALE },
                    scaleY: { from: scale, to: ZEROSCALE },
                    duration: fadeTime,
                    ease: 'Linear',
                    repeat: 0 
                });
                this.time.delayedCall(fadeTime + 100, () => {
                    hitSprite.destroy();
                });
            }
        }
    }

    createDebugKeybinds() {
        this.input.keyboard.on('keydown-R', (event) => {
            console.log("yeahsss");
        });

        // causes an issue because of wall animation tweens
        this.input.keyboard.on('keydown-Q', (event) => {
            console.log("right");
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
        });
    }
}



