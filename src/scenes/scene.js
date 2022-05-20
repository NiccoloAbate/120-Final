// Victory scene
class GameScene extends Phaser.Scene {
    constructor() {
        super("gamescene");
    }

    preload() {
        this.load.image('gameScene1', 'assets/sprites/Scene1.png');
    }

    create() {
        this.background = this.matter.add.image(0, 0, 'gameScene1', null, {ignoreGravity: true, isSensor: true});
        this.background.displayWidth = Game.config.width;
        this.background.displayHeight = Game.config.height;
        this.background.x = this.background.displayWidth / 2;
        this.background.y = this.background.displayHeight / 2;


        this.input.once('pointerup', function () {
            
            Game.scene.resume('play');
            this.scene.remove();

        }, this);
    }

    update(time, delta) {
    }

    defineKeys() {
    }

}
