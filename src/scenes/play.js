class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {
        // player assets
        this.load.image('head', 'assets/sprites/CircleToHit.png');
        this.load.image('hand', 'assets/sprites/ObsticleX.png');
        this.load.image('feet', 'assets/sprites/PlayerBlock.png');
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

        //debug
        this.createDebugKeybinds();
    }

    update(time, delta) {
        
        this.player.update();

        this.percentInHole = this.percentPlayerInHole();
        if (this.percentInHole == 1) {
            //console.log('player is in the hole!');
            if (!this.playerInHole) {
                this.playerInHole = true;
                this.sound.play('ding', { volume: 0.5 });
            }
        }
        else {
            if (this.playerInHole) {
                this.playerInHole = false;
                this.sound.play('ding', { volume: 0.5, detune: -1200 });
            }
        }

        let formatPercentText = (p) => parseFloat(p * 100).toFixed(0) + "%";
        this.percentInText.text = formatPercentText(this.percentInHole);
    }

    generateWall() {
        this.currentWall = this.matter.add.image(0, 0, 'wall1', null, {ignoreGravity: true, isSensor: true});
        this.currentWall.setDepth(-1);
        this.currentWall.displayWidth = Game.config.width;
        this.currentWall.displayHeight = Game.config.height;
        this.currentWall.x = this.currentWall.displayWidth / 2;
        this.currentWall.y = this.currentWall.displayHeight / 2;

        const wallDuration = 30000;
        this.tweens.add({
            targets: this.currentWall, 
            alpha: { from: 0.5, to: 1.0 },
            duration: wallDuration,
            ease: 'Linear',
            repeat: 0 
        });
        this.time.delayedCall(wallDuration, () => this.wallCheck())
    }

    wallCheck() {
        if (this.isPlayerInHole()) {
            console.log('you did it!');
        }
        else {
            console.log('you got owned by that there wall');
        }
    }

    isPlayerInHole() {
        let Wall = this.currentWall;

        for (let b of this.player.bodies) {
            // all play bodies must be in the transparent part of the texture
            if (this.matter.overlap(Wall, b)) {
                // Check center of the body against the texture
                let xCheck = ((b.x + b.body.centerOffset.x) - Wall.getTopLeft().x) / Wall.scaleX;
                let yCheck = ((b.y + b.body.centerOffset.y) - Wall.getTopLeft().y) / Wall.scaleY;
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
        let Wall = this.currentWall;

        let nInHole = 0;
        for (let b of this.player.bodies) {
            // all play bodies must be in the transparent part of the texture
            if (this.matter.overlap(Wall, b)) {
                // Check center of the body against the texture
                let xCheck = ((b.x + b.body.centerOffset.x) - Wall.getTopLeft().x) / Wall.scaleX;
                let yCheck = ((b.y + b.body.centerOffset.y) - Wall.getTopLeft().y) / Wall.scaleY;
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

    defineKeys() {
    }

    createDebugKeybinds() {
        this.input.keyboard.on('keydown-R', (event) => {
            console.log("yeahsss");
        });
    }
}



