class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {
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

        ///////////////////////////////
        // delete once wall is done
        // test hitbox for holes
        this.hitbox = this.matter.add.image(width / 4, height / 4, 'torso', null,
            { ignoreGravity: true, isSensor: true });
        this.hitbox.setOrigin(0.5, 0.5);
        this.hitbox.setScale(4,2);

        this.player.dragOverlapTargets.push(this.hitbox);
        this.player.dragCallbacks.dragStart.push(l => console.log('drag start'));
        this.player.dragCallbacks.dragEnd.push(l => console.log('drag end'));
        this.player.dragCallbacks.overlapEnter.push((l, t) => console.log('drag overlap enter'));
        this.player.dragCallbacks.overlapExit.push((l, t) => console.log('drag overlap exit'));
        // delete once wall is done
        ///////////////////////////////


        
        this.generateWall();


        //debug
        this.createDebugKeybinds();
    }

    update(time, delta) {
        
        this.player.update();

        if (this.isPlayerInHole()) {
            console.log('player is in the hole!');
        }
    }

    generateWall() {
        this.currentWall = this.matter.add.image(0, 0, 'wall1', null, {ignoreGravity: true, isSensor: true});
        this.currentWall.setDepth(-1);
        this.currentWall.displayWidth = Game.config.width;
        this.currentWall.displayHeight = Game.config.height;
        this.currentWall.x = this.currentWall.displayWidth / 2;
        this.currentWall.y = this.currentWall.displayHeight / 2;
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

    defineKeys() {
    }

    createDebugKeybinds() {
        this.input.keyboard.on('keydown-R', (event) => {
            console.log("yeahsss");
        });
    }
}



