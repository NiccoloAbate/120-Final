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
        this.load.image('wall', 'assets/sprites/WallBackground.png');


        this.load.image('background', 'assets/sprites/Background.png');

        this.load.image('hit0', 'assets/sprites/CurvedStyleSplat.png');
        this.load.image('hit1', 'assets/sprites/SpikeStyleSplat.png');


        // menu assets
        this.load.image('playButton', 'assets/sprites/PlayButton.png');
        this.load.image('menuButton', 'assets/sprites/MainMenuButton.png');
        this.load.image('retryButton', 'assets/sprites/RetryButton.png');
        this.load.image('menuBackground', 'assets/sprites/MenuBackground.png');

        this.load.image('menuBackground', 'assets/sprites/MenuBackground.png');
        this.load.image('grabMeBackground', 'assets/sprites/GrabMeBackground.png');
        this.load.image('clickAndDragMe', 'assets/sprites/ClickAndDragMe.png');
        this.load.image('allCredits', 'assets/sprites/AllCredits.png');

        this.load.image('cake', 'assets/sprites/cake.png');
        this.load.image('victoryBackground', 'assets/sprites/FinalScene.png');


        // player assets
        this.load.image('head', 'assets/sprites/Head.png');
        this.load.image('handclosed', 'assets/sprites/Hand-CartoonyGlove-Orange-Closed.png');
        this.load.image('handopen', 'assets/sprites/Hand-CartoonyGlove-Orange-Open.png');
        this.load.image('feet', 'assets/sprites/Shoe.png');
        this.load.image('jointBlue', 'assets/sprites/Joints.png');
        this.load.image('jointOrange', 'assets/sprites/JointsOrange.png');
        this.load.image('jointRed', 'assets/sprites/JointsRed.png');
        this.load.image('torso', 'assets/sprites/Torso.png');
        this.load.image('head-greyed', 'assets/sprites/Head.png');
        this.load.image('handclosed-greyed', 'assets/sprites/Hand-CartoonyGlove-Orange-Closed.png');
        this.load.image('handopen-greyed', 'assets/sprites/Hand-CartoonyGlove-Orange-Open.png');
        this.load.image('feet-greyed', 'assets/sprites/Shoe.png');
        this.load.image('jointBlue-greyed', 'assets/sprites/Joints.png');
        this.load.image('jointOrange-greyed', 'assets/sprites/JointsOrange.png');
        this.load.image('jointRed-greyed', 'assets/sprites/JointsRed.png');
        this.load.image('torso-greyed', 'assets/sprites/Torso.png');

        // particles
        this.load.image('confettiDarkBlue', 'assets/sprites/ConfettiDarkBlue.png');
        this.load.image('confettiGreen', 'assets/sprites/ConfettiGreen.png');
        this.load.image('confettiLightBlue', 'assets/sprites/ConfettiLightBlue.png');
        this.load.image('confettiPink', 'assets/sprites/ConfettiPink.png');
        this.load.image('confettiPurple', 'assets/sprites/ConfettiPurple.png');
        this.load.image('confettiYellow', 'assets/sprites/ConfettiYellow.png');

        for (let i = 1; i <= playerMoveStartSounds; ++i) {
            this.load.audio('playerStart' + i, 'assets/sfx/player/Start 0' + i + '.wav');
        }
        for (let i = 1; i <= playerMoveContSounds; ++i) {
            this.load.audio('playerCont' + i, 'assets/sfx/player/Cont 0' + i + '.wav');
        }

        // misc sfx
        this.load.audio('click', 'assets/sfx/Click 01.wav');
        this.load.audio('wallHit', 'assets/sfx/WallHit.wav');

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
        // left hand yoyo tween to grab attention
        this.tweens.add({
            targets: this.player.limbs[this.player.leftArmID],
            scale: 1.1,
            duration: 300,
            yoyo: true,
            repeat: -1
        });      

        // test hitbox to start game
        this.startGameHitBox = this.matter.add.image(width / 5, height / 5, 'playButton', null,
            { ignoreGravity: true, isSensor: true });
        this.startGameHitBox.setOrigin(0.5, 0.5);
        this.startGameHitBox.setScale(1,1);
        this.startGameHitBox.setDepth(-1);

        // line to show relation between hand and button
        this.grabMeLine = this.add.line(0, 0, this.startGameHitBox.x, this.startGameHitBox.y,
            this.player.limbs[this.player.leftArmID].x, this.player.limbs[this.player.leftArmID].y, 0xffffff);
        this.grabMeLine.h1 = this.startGameHitBox;
        this.grabMeLine.h2 = this.player.limbs[this.player.leftArmID];
        this.grabMeLine.lineWidth = 3;
        this.grabMeLine.setOrigin(0.0, 0.0);
        this.grabMeLine.setDepth(1.0);
        // yoyo tween for the line too
        this.tweens.add({
            targets: this.grabMeLine,
            alpha: { from: 1.0, to: 0.25 },
            duration: 300,
            yoyo: true,
            repeat: -1
        });

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
        this.background.setDepth(-5);
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
        this.grabMeBackground.setVisible(false);

        // create credits
        this.credits = this.matter.add.image(0, 0, 'allCredits', null, {ignoreGravity: true, isSensor: true});
        this.credits.setDepth(-5);
        this.credits.displayWidth = Game.config.width;
        this.credits.displayHeight = Game.config.height;
        this.credits.x = this.credits.displayWidth / 2;
        this.credits.y = this.credits.displayHeight / 2;

        // click and drag me message that follows hand
        this.clickAndDragMe = this.matter.add.image(0, 0, 'clickAndDragMe', null, {ignoreGravity: true, isSensor: true});
        this.clickAndDragMe.setDepth(1);
        this.clickAndDragMe.setVisible(false); // considering making this visible again...
        this.timeSinceGrabMe = 100 * UpdateTime.sRatio;
        this.timeBetweenGrabMeMessages = 10 * UpdateTime.sRatio;
        this.firstDrag = true;

        // drag me message callback
        this.player.dragCallbacks.dragStart.push((l, t) => {
            if (l == this.player.limbs[this.player.leftArmID]) {
                if (this.firstDrag) {
                    this.firstDrag = false;
                    // yoyo tween to grab attention
                    this.tweens.add({
                        targets: this.startGameHitBox,
                        scale: 1.1,
                        duration: 300,
                        yoyo: true,
                        repeat: -1
                    });
                }

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

        this.cake = this.matter.add.image(3 * (width / 4), height / 5, 'cake', null, {ignoreGravity: true, isSensor: true});
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
                this.player.dragOverlapTargets.splice(this.player.dragOverlapTargets.indexOf(this.cake, 1));
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

        let l = this.grabMeLine;
        let lH = this.computeConnectionLinePoints(l.h1, l.h2, 100, 65);
        l.setTo(lH.h1.x, lH.h1.y, lH.h2.x, lH.h2.y);
    }

    startGame() {
        this.scene.start('play');
    }

    defineKeys() {
    }

    computeConnectionLinePoints(h1, h2, h1EdgeDist = 0, h2EdgeDist = 0) {
        let diff = { x: (h2.x - h1.x), y: (h2.y - h1.y) };
        let distSqrd = (diff.x * diff.x) + (diff.y * diff.y);
        let dist = Math.sqrt(distSqrd);

        let h1DistRat = clamp(h1EdgeDist / dist, 0.0, 0.5);
        let h1EdgeDiff = { x: (diff.x * h1DistRat), y: (diff.y * h1DistRat) };
        let h2DistRat = clamp(h2EdgeDist / dist, 0.0, 0.5);
        let h2EdgeDiff = { x: (diff.x * h2DistRat), y: (diff.y * h2DistRat) };

        return {
            h1: {
                x: h1.x + h1EdgeDiff.x,
                y: h1.y + h1EdgeDiff.y
            },
            h2: {
                x: h2.x - h2EdgeDiff.x,
                y: h2.y - h2EdgeDiff.y
            }
        };
    }
}
