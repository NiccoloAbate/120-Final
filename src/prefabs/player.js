// Player prefab -- technically not a prefab because it isn't a gameobject, just holds game objects
class Player {

    constructor(scene) {
        this.scene = scene;

        this.create();
    }

    create() {
        let width = Game.config.width;
        let height = Game.config.height;

        // array that will hold all physics bodies of the player
        this.bodies = new Array();

        // torso and limbs
        this.torso = this.scene.matter.add.image(width / 2, height / 2, 'torso', null,
            { ignoreGravity: true });
        this.torso.setOrigin(0.5, 0.5);
        this.torso.setScale(4, 4);
        this.torso.setFixedRotation();
        this.torso.setMass(20000);

        this.bodies.push(this.torso);

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
            l = this.scene.matter.add.image(lPos.x, lPos.y, limbImage[n], null,
                { ignoreGravity: true });
            l.setOrigin(0.5, 0.5);
            l.setScale(4, 4);
            l.setFixedRotation();
            l.setMass(5000);

            this.bodies.push(l);

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
                
                j = this.scene.matter.add.image(x, y, 'joint', null,
                    { shape: 'circle', mass: 5, ignoreGravity: true });
                j.setScale(2, 2);
                this.scene.matter.add.joint(prev, j, (i === 0) ? 90 : 55, 0.7);

                this.bodies.push(j);

                prev = j;
            }
            this.scene.matter.add.joint(prev, l, 90, 1);
        }

        // allows mouse to click and drag bodies
        this.mouseSpring = this.scene.matter.add.mouseSpring();
        // callback to restrict drag to player bodies
        this.scene.input.on('pointerdown', (pointer) => {
            for (let b of this.bodies) {
                if (this.mouseSpring.hitTestBody(b.body, pointer.position)) {
                    // if pointer is hitting with any player body let drag continue
                    // also set up logic for dragging callbacks
                    this.mouseDragTarget = b;
                    // call drag start callbacks
                    this.dragCallbacks.dragStart.forEach(c => c(this.mouseDragTarget));
                    return;
                }
            }
            // if pointer isn't hitting any player body stop drag
            this.mouseSpring.stopDrag();
        });

        // state machine to handle some player stuff
        this.FSM = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
        }, [this.scene, this]);

        // movement sound, handled by state machine
        this.currentMoveSound = undefined;

        this.mouseDragTarget = undefined;
        // callbacks
        this.dragCallbacks = {
            // (limb) =>
            dragStart: [],
            // (limb, [body]) =>
            overlap: [],
            // (limb, [body]) =>
            overlapEnter: [],
            // (limb, [body]) =>
            overlapExit: [],
            // (limb, [currentOverlappedObjects]) =>
            dragEnd: []
        }
        this.dragOverlappedObjects = [];

        this.scene.input.on('pointerup', (pointer) => {
            // call drag end callbacks
            this.dragCallbacks.dragEnd.forEach(c => c(this.mouseDragTarget, this.dragOverlappedObjects));
            // empty the drag overlap objects
            this.dragOverlappedObjects = [];
            // reset mouse drag target
            this.mouseDragTarget = undefined;
        });
        
        // add targets into this if you want to check them for drag overlapping
        this.dragOverlapTargets = [];
    }

    update() {
        this.FSM.step();

        // check drag overlap callbacks
        if (this.mouseDragTarget != undefined) {
            for (let t of this.dragOverlapTargets) {
                if (this.scene.matter.overlap(this.mouseDragTarget, t)) {
                    // call overlap callbacks
                    this.dragCallbacks.overlap.forEach(c => c(this.mouseDragTarget, t));

                    // if first overlap
                    if (!this.dragOverlappedObjects.includes(t)) {
                        // call overlap enter callbacks and add to list of current overlaps
                        this.dragCallbacks.overlapEnter.forEach(c => c(this.mouseDragTarget, t));
                        this.dragOverlappedObjects.push(t);
                    }
                }
                else {
                    // if first non-overlap
                    if (this.dragOverlappedObjects.includes(t)) {
                        // call overlap exit callbacks and remove from list of current overlaps
                        this.dragCallbacks.overlapExit.forEach(c => c(this.mouseDragTarget, t));
                        this.dragOverlappedObjects.splice(this.dragOverlappedObjects.indexOf(t));
                    }
                }
            }
        }
    }

    movementValue() {
        let velocities = new Array();

        const maxV = 10;
        for (let b of this.bodies) {
            velocities.push(vecLenSqrd(b.body.velocity));
        }

        //console.log(getAvg(velocities));

        return Math.min(getAvg(velocities), maxV) / maxV;
    }
}


// player States, just for audio right now

const moveThresh = 0.005;
const moveVolumeMult = 1.5;
function moveValToVolume(v) {
    return Math.sqrt(v) * moveVolumeMult;
};

class IdleState extends State {
    enter(scene, player) {
        //console.log('enter idle');
        if (player.currentMoveSound != undefined) {
            player.currentMoveSound.destroy();
            player.currentMoveSound = undefined;
        }
    }

    execute(scene, player) {
        if (player.movementValue() > moveThresh) {
            this.stateMachine.transition('move');
        }
    }
}

class MoveState extends State {
    enter(scene, player) {
        //console.log('enter move');
        let moveValue = player.movementValue();

        if (player.currentMoveSound == undefined) {
            let startSoundName = 'playerStart' + getRandomIntInclusive(1, playerMoveStartSounds);
            player.currentMoveSound = scene.sound.add(startSoundName, { volume: moveValToVolume(moveValue) });
            player.currentMoveSound.play();
        }
    }

    execute(scene, player) {
        let moveValue = player.movementValue();

        if (moveValue <= moveThresh) {
            this.stateMachine.transition('idle');
            return;
        }

        if (!player.currentMoveSound.isPlaying) {
            player.currentMoveSound.destroy();
            let contSoundName = 'playerCont' + getRandomIntInclusive(1, playerMoveContSounds);
            player.currentMoveSound = scene.sound.add(contSoundName);
            player.currentMoveSound.play();
        }

        player.currentMoveSound.setVolume(moveValToVolume(moveValue));
    }
}

