// Victory scene
class GameVictory extends Phaser.Scene {
    constructor() {
        super("gamevictory");
    }

    preload() {
        this.load.image('gameVictoryScreen', 'assets/sprites/GameWinScreen.png');
    }

    create() {
        this.background = this.matter.add.image(0, 0, 'gameVictoryScreen', null, {ignoreGravity: true, isSensor: true});
        this.background.displayWidth = Game.config.width;
        this.background.displayHeight = Game.config.height;
        this.background.x = this.background.displayWidth / 2;
        this.background.y = this.background.displayHeight / 2;
    }

    update(time, delta) {
    }

    defineKeys() {
    }

}
