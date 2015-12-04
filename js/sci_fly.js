var game = new Phaser.Game(688, 387, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render }, false, false);

function preload() {
  game.time.advancedTiming = true;
  game.load.tilemap('level3', 'assets/tilemaps/maps/cybernoid.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles', 'assets/tilemaps/tiles/cybernoid.png', 16, 16);
  game.load.image('phaser', 'assets/sprites/phaser-ship.png');
  game.load.image('chunk', 'assets/sprites/chunk.png');
  game.load.script('filter', 'js/Chromatical.js');
  game.load.script('filter2', 'js/Gray.js');
}

var map;
var layer;
var cursors;
var sprite;
var emitter;

function create() {
  map = game.add.tilemap('level3');
  map.addTilesetImage('CybernoidMap3BG_bank.png', 'tiles');
  layer = map.createLayer(0);
  map.setCollisionByExclusion([7, 32, 35, 36, 47]);

  layer.resizeWorld();

  cursors = game.input.keyboard.createCursorKeys();

  emitter = game.add.emitter(0, 0, 200);

  emitter.makeParticles('chunk');
  emitter.minRotation = 0;
  emitter.maxRotation = 0;
  emitter.gravity = 150;
  emitter.bounce.setTo(0.5, 0.5);

  sprite = game.add.sprite(300, 90, 'phaser');
  sprite.anchor.set(0.5);

  game.physics.enable(sprite);

  //  Because both our body and our tiles are so tiny,
  //  and the body is moving pretty fast, we need to add
  //  some tile padding to the body. WHat this does
  sprite.body.tilePadding.set(32, 32);

  game.camera.follow(sprite);
  // game.scale.minWidth = 640;
  // game.scale.minHeight = 480;
  // game.scale.maxWidth = 1280;
  // game.scale.maxHeight = 960;
  // game.scale.pageAlignHorizontally = true;
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.camera.roundPx = false;


  sprite.body.gravity.set(0, 1050);
  sprite.body.maxVelocity['y'] = 500;
  sprite.body.drag['x'] = 500;
//  sprite.body.mass = 100;

  filter = game.add.filter('Chromatical', 320, 240);
  filter2 = game.add.filter('Gray', 320, 240);
   //sprite.filters = [filter2];
   //game.stage.filters = [filter2];
   game.stage.filters = [filter, filter2];960

     //  game.input.onDown.add(gofull, this);

}

function particleBurst() {

    emitter.x = sprite.x;
    emitter.y = sprite.y;
    emitter.start(true, 2000, null, 1);

}

function update() {

    game.physics.arcade.collide(sprite, layer);
    game.physics.arcade.collide(emitter, layer);

    // sprite.body.velocity.x = 0;
    // sprite.body.velocity.y = 0;

    if (cursors.up.isDown)
    {
        sprite.body.velocity.y = -200;
        particleBurst();
    }
    else if (cursors.down.isDown)
    {
        sprite.body.velocity.y = 1200;
        particleBurst();
    }

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -200;
        sprite.scale.x = -1;
        particleBurst();
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 200;
        sprite.scale.x = 1;
        particleBurst();
    }

}

function gofull() {

    if (game.scale.isFullScreen)
    {
        game.scale.stopFullScreen();
    }
    else
    {
        game.scale.startFullScreen(false);
    }

}


function render() {
  game.debug.text(game.time.fps || '--', 2, 14, "#ffffff");   
  //filter.update();
  //filter2.update();

}
