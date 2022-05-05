class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    preload() {
        let width = config.width;
        let height = config.height;

        // load audio
        

        // load images/tile sprites

        // menu text config

        // show loading text
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
