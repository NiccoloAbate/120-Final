class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    preload() {
        let width = config.width;
        let height = config.height;

        // load audio
        

        // load images/tile sprites
        //this.load.image('hole6', 'assets/sprites/WallBackground-Hole1.png');
        this.load.image('hole1', 'assets/sprites/WallBackground-Hole2.png');
        this.load.image('hole1outline', 'assets/sprites/WallBackground-Hole2Outline.png');
        this.load.image('hole2', 'assets/sprites/WallBackground-Hole3.png');
        this.load.image('hole2outline', 'assets/sprites/WallBackground-Hole3Outline.png');
        this.load.image('hole3', 'assets/sprites/WallBackground-Hole4.png');
        this.load.image('hole3outline', 'assets/sprites/WallBackground-Hole4Outline.png');
        this.load.image('hole4', 'assets/sprites/WallBackground-Hole5.png');
        this.load.image('hole4outline', 'assets/sprites/WallBackground-Hole5Outline.png');
        this.load.image('hole5', 'assets/sprites/WallBackground-Hole6.png');
        this.load.image('hole5outline', 'assets/sprites/WallBackground-Hole6Outline.png');
        this.load.image('hole6', 'assets/sprites/WallBackground-Hole7.png');
        this.load.image('hole6outline', 'assets/sprites/WallBackground-Hole7Outline.png');
        this.load.image('hole7', 'assets/sprites/WallBackground-Hole8.png');
        this.load.image('hole7outline', 'assets/sprites/WallBackground-Hole8Outline.png');
        this.load.image('hole8', 'assets/sprites/WallBackground-Hole9.png');
        this.load.image('hole8outline', 'assets/sprites/WallBackground-Hole9Outline.png');
        this.load.image('hole9', 'assets/sprites/WallBackground-Hole10.png');
        this.load.image('hole9outline', 'assets/sprites/WallBackground-Hole10Outline.png');


        this.load.image('background', 'assets/sprites/Background.png');

        this.load.image('hit0', 'assets/sprites/CurvedStyleSplat.png');
        this.load.image('hit1', 'assets/sprites/SpikeStyleSplat.png');


        // menu assets
        this.load.image('playButton', 'assets/sprites/PlayButton.png');
        this.load.image('quitButton', 'assets/sprites/QuitButton.png');
        this.load.image('retryButton', 'assets/sprites/RetryButton.png');
        this.load.image('menuBackground', 'assets/sprites/MenuBackground.png');

        this.load.image('menuBackground', 'assets/sprites/MenuBackground.png');
        this.load.image('grabMeBackground', 'assets/sprites/GrabMeBackground.png');
        this.load.image('clickAndDragMe', 'assets/sprites/ClickAndDragMe.png');

        this.load.image('cake', 'assets/sprites/cake.png');


        // player assets
        this.load.image('head', 'assets/sprites/Head.png');
        this.load.image('handclosed', 'assets/sprites/Hand-CartoonyGlove-Orange-Closed.png');
        this.load.image('handopen', 'assets/sprites/Hand-CartoonyGlove-Orange-Open.png');
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

        // misc sfx
        this.load.audio('click', 'assets/sfx/Click 01.wav');

        // music
        Audio.preloadMulti(this, 'Track1', Track1StemFileNames, Track1StemNames);

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
        this.startGameHitBox = this.matter.add.image(width / 5, height / 3, 'playButton', null,
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
        // hand animations, maybe should refactor into 'grabable' in player.js or something
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

                this.tweens.add({
                    targets: this.grabMeBackground,
                    alpha: { from: 1.0, to: 0.0},
                    duration: 250,
                    ease: 'Linear',
                    repeat: 0 
                });
            }
        });

        // create background
        this.background = this.matter.add.image(0, 0, 'menuBackground', null, {ignoreGravity: true, isSensor: true});
        this.background.setDepth(-2);
        this.background.displayWidth = Game.config.width;
        this.background.displayHeight = Game.config.height;
        this.background.x = this.background.displayWidth / 2;
        this.background.y = this.background.displayHeight / 2;

        // create background
        this.grabMeBackground = this.matter.add.image(0, 0, 'grabMeBackground', null, {ignoreGravity: true, isSensor: true});
        this.grabMeBackground.setDepth(-2);
        this.grabMeBackground.displayWidth = Game.config.width;
        this.grabMeBackground.displayHeight = Game.config.height;
        this.grabMeBackground.x = this.grabMeBackground.displayWidth / 2;
        this.grabMeBackground.y = this.grabMeBackground.displayHeight / 2;

        // click and drag me message that follows hand
        this.clickAndDragMe = this.matter.add.image(0, 0, 'clickAndDragMe', null, {ignoreGravity: true, isSensor: true});
        this.clickAndDragMe.setDepth(1);
        this.timeSinceGrabMe = 100 * UpdateTime.sRatio;
        this.timeBetweenGrabMeMessages = 10 * UpdateTime.sRatio;

        // drag me message callback
        this.player.dragCallbacks.dragStart.push((l, t) => {
            if (l == this.player.limbs[this.player.leftArmID]) {
                if (this.timeSinceGrabMe < this.timeBetweenGrabMeMessages) {
                    return;
                }
                else {
                    this.timeSinceGrabMe = 0;
                }

                this.tweens.add({
                    targets: this.clickAndDragMe,
                    alpha: { from: 1.0, to: 0.0},
                    duration: 1000,
                    ease: 'Linear',
                    repeat: 0 
                });
            }
        });

        this.cake = this.matter.add.image(3 * (width / 4), height / 3, 'cake', null, {ignoreGravity: true, isSensor: true});
        this.cake.setDepth(-1);
        this.player.dragOverlapTargets.push(this.cake);
        // hand animations, maybe should refactor into 'grabable' in player.js or something
        this.player.dragCallbacks.overlapEnter.push((l, t) => {
            if (t == this.cake && l.limbType == 'hand') {
                l.setTexture('handopen');
                l.setScale(l.scaleX * 1.3, l.scaleY * 1.3);
                this.sound.play('click', { volume: 3.0, detune: 600 });
            }
        });
        this.player.dragCallbacks.overlapExit.push((l, t) => {
            if (t == this.cake && l.limbType == 'hand') {
                l.setTexture('handclosed');
                l.setScale(l.scaleX / 1.3, l.scaleY / 1.3);
                this.sound.play('click', { volume: 3.0, detune: 600 });
            }
        });
        // do something when you grab the cake!
        this.player.dragCallbacks.dragEnd.push((l, overlapped) => {
            if (overlapped.includes(this.cake) && l.limbType == 'hand') {
                l.setTexture('handclosed');
                l.setScale(l.scaleX / 1.3, l.scaleY / 1.3);
                this.sound.play('click', { volume: 3.0, detune: 1200 });
                this.player.dragOverlapTargets.splice(this.player.dragOverlapTargets.indexOf(this.cake));
                this.cake.destroy(); // placeholder for something more exciting happening
            }
        });


        holeStartID = 1; // reset checkpoint
    }

    update(time, delta) {
        this.player.update();

        this.clickAndDragMe.x = this.player.limbs[this.player.leftArmID].x;
        this.clickAndDragMe.y = this.player.limbs[this.player.leftArmID].y - (this.clickAndDragMe.displayHeight - 80);

        // possibly add a clause to reset time to zero is dragging
        this.timeSinceGrabMe += delta;
        if (this.timeSinceGrabMe > this.timeBetweenGrabMeMessages && this.clickAndDragMe.alpha == 0) {
            // message reappears after a little while
            this.tweens.add({
                targets: this.clickAndDragMe,
                alpha: { from: 0.0000001, to: 1.0},
                duration: 500,
                ease: 'Linear',
                repeat: 0 
            });
        }
    }

    startGame() {
        this.scene.start('play');
    }

    defineKeys() {
    }
}
