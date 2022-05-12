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

        // array that will hold all physics bodies of the player
        this.playerBodies = new Array();

        // torso and limbs
        this.torso = this.matter.add.image(width / 2, height / 2, 'torso', null,
            { ignoreGravity: true });
        this.torso.setOrigin(0.5, 0.5);
        this.torso.setScale(4, 4);
        this.torso.setFixedRotation();
        this.torso.setMass(20000);

        this.playerBodies.push(this.torso);

        // limb number and IDs
        this.nLimbs = 5;
        this.headID = 0;
        this.leftArmID = 1;
        this.leftFootID = 2;
        this.rightFootID = 3;
        this.rightArmID = 4;

        // limb spawn positions -- might be too far from torso right now?
        let limbPositions = [
            {x: width / 2, y: height / 4},
            {x: width / 4, y: height / 3},
            {x: width / 3, y: (height / 4) * 3},
            {x: (width / 3) * 2, y: (height / 4) * 3},
            {x: (width / 4) * 3, y: height / 3}
        ];
        // number of joints per limb
        let nLimbJoints = [2, 3, 4, 4, 3];
        
        // image for each limb
        let limbImage = ['head', 'hand', 'feet', 'feet', 'hand'];

        this.limbs = new Array(this.nLimbs);
        this.limbJoints = new Array(this.nLimbs);
        // create each limb and corresponding joints
        for (let n = 0; n < this.nLimbs; ++n) {
            let l = this.limbs[n];
            let lPos = limbPositions[n];
            // create limb
            l = this.matter.add.image(lPos.x, lPos.y, limbImage[n], null,
                { ignoreGravity: true });
            l.setOrigin(0.5, 0.5);
            l.setScale(4, 4);
            l.setFixedRotation();
            l.setMass(5000);

            this.playerBodies.push(l);

            // create and link joints
            let nJoints = nLimbJoints[n];
            let lj = this.limbJoints[n];
            lj = new Array(nJoints);
            let prev = this.torso;
            let posDiff = {x: l.x - this.torso.x, y: l.y - this.torso.y};
            for (let i = 0; i < lj.length; ++i) {
                let j = lj[i];
                let x = this.torso.x + ((i / nJoints) * posDiff.x);
                let y = this.torso.y + ((i / nJoints) * posDiff.y);
                
                j = this.matter.add.image(x, y, 'joint', null,
                    { shape: 'circle', mass: 5, ignoreGravity: true });
                j.setScale(2, 2);
                this.matter.add.joint(prev, j, (i === 0) ? 90 : 55, 0.7);

                this.playerBodies.push(j);

                prev = j;
            }
            this.matter.add.joint(prev, l, 90, 1);
        }

        // all mouse dragable bodies, could add more if desired
        this.mouseDragableBodies = [...this.playerBodies];
        // allows mouse to click and drag bodies
        this.mouseSpring = this.matter.add.mouseSpring();
        // callback to restrict drag to player bodies
        this.input.on('pointerdown', (pointer) => {
            for (let b of this.mouseDragableBodies) {
                if (this.mouseSpring.hitTestBody(b.body, pointer.position)) {
                    // if pointer is hitting with any player body let drag continue
                    return;
                }
            }
            // if pointer isn't hitting any player body stop drag
            this.mouseSpring.stopDrag();
        });



        ///////////////////////////////
        // delete once wall is done
        // test hitbox for holes
        //this.hitbox = this.matter.add.image(width / 2, height / 2, 'torso', null,
        //    { ignoreGravity: true, isSensor: true });
        //this.hitbox.setOrigin(0.5, 0.5);
        //this.hitbox.setScale(4,2);
        // delete once wall is done
        ///////////////////////////////


        
        this.generateWall();


        //debug
        this.createDebugKeybinds();
    }

    update(time, delta) {
        
        //if (this.matter.overlap(this.hitbox, this.playerBodies)) {
        //    console.log('player is overlapping hitbox');
        //}
        
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

        for (let b of this.playerBodies) {
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