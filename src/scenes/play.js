class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {
        this.load.image('limb', 'assets/sprites/CircleToHit.png');
        this.load.image('joint', 'assets/sprites/CircleToHit.png');

        this.defineKeys();
    }

    create() {
        let width = config.width;
        let height = config.height;

        // define key variables
        this.defineKeys();

        // init player settings
        Game.player = {
            score : 0
        };

        this.torso = this.matter.add.image(width / 2, height / 2, 'limb', null,
            { ignoreGravity: true });
        this.torso.setOrigin(0.5, 0.5);
        this.torso.setScale(4, 4);
        this.torso.setFixedRotation();
        this.torso.setMass(5000);

        this.nLimbs = 5;
        this.headID = 0;
        this.leftArmID = 1;
        this.leftFootID = 2;
        this.rightFootID = 3;
        this.rightArmID = 4;

        let limbPositions = [
            {x: width / 2, y: height / 4},
            {x: width / 4, y: height / 3},
            {x: width / 3, y: (height / 4) * 3},
            {x: (width / 3) * 2, y: (height / 4) * 3},
            {x: (width / 4) * 3, y: height / 3}
        ];
        let nLimbJoints = [2, 3, 4, 4, 3];

        this.limbs = new Array(this.nLimbs);
        this.limbJoints = new Array(this.nLimbs);
        for (let n = 0; n < this.nLimbs; ++n) {
            let l = this.limbs[n];
            let lPos = limbPositions[n];
            l = this.matter.add.image(lPos.x, lPos.y, 'limb', null,
                { ignoreGravity: true });
            l.setOrigin(0.5, 0.5);
            l.setScale(4, 4);
            l.setFixedRotation();
            l.setMass(500);

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
                    { shape: 'circle', mass: 1, ignoreGravity: true });
                j.setScale(2, 2);
                this.matter.add.joint(prev, j, (i === 0) ? 90 : 55, 0.7);

                prev = j;
            }
            this.matter.add.joint(prev, l, 90, 1);
        }

        this.matter.add.mouseSpring();
    }

    update(time, delta) {
        
    }

    defineKeys() {
    }

    createDebugKeybinds() {
    }
}