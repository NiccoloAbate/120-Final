// See README for team, game name, breakdown, notes, etc.

let config = {
    type: Phaser.CANVAS,
    physics: {
        default: 'matter'
    },
    //Game Canvas scales with width and height of window
    width: window.innerWidth * window.devicePixelRatio * 0.75,
    height: window.innerHeight * window.devicePixelRatio,
    scene: [Menu, Play, GameOver]
}

let borderUISize = config.height / 15;
let borderPadding = borderUISize / 3;

let Game = new Phaser.Game(config);

let Audio = new AudioManager;

// reserve keyboard vars
let keyLEFT, keyRIGHT, keyUP, keyDOWN;
let keyW, keyA, keyS, keyD;
let keyENTER;
