class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    preload() {
        let width = config.width;
        let height = config.height;

        // load audio
        

        // load images/tile sprites
        this.load.image('hole1', 'assets/sprites/WallBackground-Hole1.png');
        this.load.image('hole2', 'assets/sprites/WallBackground-Hole2.png');
        this.load.image('hole2outline', 'assets/sprites/WallBackground-Hole2Outline.png');

        this.load.image('background', 'assets/sprites/Background.png');


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

        // misc sfx
        this.load.audio('click', 'assets/sfx/Click 01.wav');

        // menu text config

        // show loading text

        this.defineKeys();
    }

    create() {
        let width = config.width;
        let height = config.height;

        // create matter world
        this.matter.world.setBounds();
        var Bodies = Phaser.Physics.Matter.Matter.Bodies;

        this.player = new Player(this);        

        // test hitbox to start game
        this.startGameHitBox = this.matter.add.image(width / 4, height / 4, 'torso', null,
            { ignoreGravity: true, isSensor: true });
        this.startGameHitBox.setOrigin(0.5, 0.5);
        this.startGameHitBox.setScale(4,2);

        // demo of callbacks
        this.player.dragCallbacks.dragStart.push(l => console.log('drag start'));
        this.player.dragCallbacks.dragEnd.push(l => console.log('drag end'));
        this.player.dragCallbacks.overlapEnter.push((l, t) => console.log('drag overlap enter'));
        this.player.dragCallbacks.overlapExit.push((l, t) => console.log('drag overlap exit'));

        this.player.dragOverlapTargets.push(this.startGameHitBox);
        this.player.dragCallbacks.overlapEnter.push((l, t) => {
            if (t == this.startGameHitBox) {
                this.sound.play('click', { volume: 3.0, detune: 600 });
            }
        });
        // start game when release limb over the startGameHitBox
        this.player.dragCallbacks.dragEnd.push((l, overlapped) => {
            if (overlapped.includes(this.startGameHitBox)) {
                this.sound.play('click', { volume: 3.0, detune: 1200 });
                this.time.delayedCall(250, () => this.startGame());
            }
        });
    }

    update(time, delta) {
        this.player.update();
    }

    startGame() {
        this.scene.start('play');
    }

    defineKeys() {
    }
}
