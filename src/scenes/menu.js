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

        // menu assets
        this.load.image('playButton', 'assets/sprites/PlayButton.png');
        this.load.image('menuBackground', 'assets/sprites/MenuBackground.png');


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
        this.startGameHitBox = this.matter.add.image(width / 4, height / 4, 'playButton', null,
            { ignoreGravity: true, isSensor: true });
        this.startGameHitBox.setOrigin(0.5, 0.5);
        this.startGameHitBox.setScale(1,1);
        this.startGameHitBox.setDepth(-1);

        // demo of callbacks
        this.player.dragCallbacks.dragStart.push(l => console.log('drag start'));
        this.player.dragCallbacks.dragEnd.push(l => console.log('drag end'));
        this.player.dragCallbacks.overlapEnter.push((l, t) => console.log('drag overlap enter'));
        this.player.dragCallbacks.overlapExit.push((l, t) => console.log('drag overlap exit'));

        this.player.dragOverlapTargets.push(this.startGameHitBox);
        this.player.dragCallbacks.overlapEnter.push((l, t) => {
            if (t == this.startGameHitBox && l.limbType == 'hand') {
                l.setTexture('handopen');
                l.setScale(l.scaleX * 1.3, l.scaleY * 1.3);
                this.sound.play('click', { volume: 3.0, detune: 600 });
            }
        });
        this.player.dragCallbacks.overlapExit.push((l, t) => {
            if (t == this.startGameHitBox && l.limbType == 'hand') {
                l.setTexture('handclosed');
                l.setScale(l.scaleX / 1.3, l.scaleY / 1.3);
                this.sound.play('click', { volume: 3.0, detune: 600 });
            }
        });
        // start game when release limb over the startGameHitBox
        this.player.dragCallbacks.dragEnd.push((l, overlapped) => {
            if (overlapped.includes(this.startGameHitBox) && l.limbType == 'hand') {
                l.setTexture('handclosed');
                l.setScale(l.scaleX / 1.3, l.scaleY / 1.3);
                this.sound.play('click', { volume: 3.0, detune: 1200 });
                this.time.delayedCall(250, () => this.startGame());
            }
        });

        // create background
        this.background = this.matter.add.image(0, 0, 'menuBackground', null, {ignoreGravity: true, isSensor: true});
        this.background.setDepth(-2);
        this.background.displayWidth = Game.config.width;
        this.background.displayHeight = Game.config.height;
        this.background.x = this.background.displayWidth / 2;
        this.background.y = this.background.displayHeight / 2;

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
