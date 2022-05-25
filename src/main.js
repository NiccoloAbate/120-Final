// See README for team, game name, breakdown, notes, etc.

let config = {
    type: Phaser.CANVAS,
    physics: {
        default: 'matter',
            matter: {
                gravity: {
                y: 0
            },
            
            /*
            debug: {
                showBody: true,
                showStaticBody: true
            }
            */
            
        }
    },
    //Game Canvas scales with width and height of window
    //width: window.innerWidth * window.devicePixelRatio * 0.75,
    //height: window.innerHeight * window.devicePixelRatio,
    width: 1600,
    height: 900,
    scene: [Menu, Play, GameOver, GameVictory, GameScene]
}

let borderUISize = config.height / 15;
let borderPadding = borderUISize / 3;

let Game = new Phaser.Game(config);

let Audio = new AudioManager;
let Track1StemNames = ['Normal', 'Filtered'];
let Track1StemFileNames = ['assets/music/Track 01 - Normal.mp3', 'assets/music/Track 01 - Filtered.mp3'];

let playerMoveStartSounds = 5;
let playerMoveContSounds = 6;

// global variable to keep track of checkpoint outside of play scene
let holeStartID = 1;

// global const for 0 scale, because you can't actually have 0 scale
const ZEROSCALE = 0.000001;
