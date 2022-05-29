class GameOver extends Phaser.Scene {
    constructor() {
        super("gameover");
    }

    preload() {
        this.load.image('gameOverScreen', 'assets/sprites/GameOver.png');
    }

    create() {
        this.background = this.matter.add.image(0, 0, 'gameOverScreen', null, {ignoreGravity: true, isSensor: true});
        this.background.displayWidth = Game.config.width;
        this.background.displayHeight = Game.config.height;
        this.background.x = this.background.displayWidth / 2;
        this.background.y = this.background.displayHeight / 2;
        this.background.alpha = 0;

        const delayTime = 500;
        const fadeTime = 1500;
        this.time.delayedCall(delayTime, () => {
            this.tweens.add({
                targets: this.background,
                alpha: { from: 0.0, to: 1.0 },
                duration: fadeTime,
            });
        });
    }

    update(time, delta) {
    }

    defineKeys() {
    }

}
