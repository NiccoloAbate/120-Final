class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    preload() {
        let width = config.width;
        let height = config.height;

        // load audio
        

        // load images/tile sprites
        this.load.image('wall1', 'assets/sprites/WallBackground-Hole1.png');
        this.load.json('wall1poly', 'assets/sprites/WallBackground-Hole2.json');

        // menu text config

        // show loading text

        this.defineKeys();
    }

    create() {
        let width = config.width;
        let height = config.height;

        this.startGame();
    }

    update(time, delta) {
        
    }

    startGame() {
        this.scene.start('play');
    }

    defineKeys() {
    }
}
