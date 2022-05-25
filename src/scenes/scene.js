// Victory scene
class GameScene extends Phaser.Scene {
    constructor() {
        super("gamescene");
    }

    preload() {
        this.load.image('gameScene1', 'assets/sprites/Scene1.png');
    }

    create() {

        this.player = new Player(this);

        this.background = this.matter.add.image(0, 0, 'gameScene1', null, {ignoreGravity: true, isSensor: true});
        this.background.displayWidth = Game.config.width;
        this.background.displayHeight = Game.config.height;
        this.background.x = this.background.displayWidth / 2;
        this.background.y = this.background.displayHeight / 2;
        this.background.setDepth(-1);


        this.input.once('pointerup', function () {
            
            Game.scene.resume('play');
            this.scene.stop();

        }, this);

        holeStartID = Game.scene.getScene('play').holeID; // store checkpoint into the global var
    }

    update(time, delta) {
        this.player.update(time, delta);
    }

    defineKeys() {
    }

}
