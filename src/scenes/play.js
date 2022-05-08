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

        // torso and limbs
        this.torso = this.matter.add.image(width / 2, height / 2, 'torso', null,
            { ignoreGravity: true });
        this.torso.setOrigin(0.5, 0.5);
        this.torso.setScale(4, 4);
        this.torso.setFixedRotation();
        this.torso.setMass(20000);
        

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
                
                j = this.matter.add.image(400, y, 'joint', null,
                    { shape: 'circle', mass: 5, ignoreGravity: true });
                j.setScale(2, 2);
                this.matter.add.joint(prev, j, (i === 0) ? 90 : 55, 0.7);

                prev = j;
            }
            this.matter.add.joint(prev, l, 90, 1);
        }

        // allows mouse to click and drag bodies
        this.matter.add.mouseSpring();



        ///////////////////////////////
        // delete once wall is done
        // test hitbox for holes
        this.hitbox = this.add.image(width / 2, height / 2, 'torso', null,
            { ignoreGravity: true });
        this.hitbox.setOrigin(0.5, 0.5);
        this.hitbox.setScale(4,2);
        // delete once wall is done
        ///////////////////////////////


        



        //debug
        this.createDebugKeybinds();
    }

    update(time, delta) {
        

        
    }


    checkCollision(sprite1, sprite2) {
        let bounds1 = sprite1.getBounds();
        let bounds2 = sprite2.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(bounds1, bounds2);
    }


    defineKeys() {
    }

    createDebugKeybinds() {
        this.input.keyboard.on('keydown-R', (event) => {
            console.log("yeahsss");
        });
    }
}