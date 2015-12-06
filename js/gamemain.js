var monitorSize = [2560, 1440];

var viewport = {width: 853, height: 1440/3};

var game = new Phaser.Game(viewport.width, viewport.height, Phaser.AUTO, 'game-display', { preload: preload, create: create, update: update, render: render }, false, false);

var g = game

var hero = new Hero(game);
var map = new Map(game);
var camera = new Camera(game);

g.h = hero;
g.m = map;
g.c = camera;

function preload() {
  game.time.advancedTiming = true;
  game.load.script('filter', 'js/Chromatical.js');

  map.preload();
  hero.preload();
  camera.preload();
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = '#000000';

  camera.create(g.h);
  hero.create();
  map.create();
   filter = game.add.filter('Chromatical', 320, 240);
  game.stage.filters = [filter];

}

function update() {
  map.update();
  hero.update();
  camera.update();
}

function render () {
  hero.render();
  game.debug.text(game.time.fps || '--', 2, 14, "#ffffff");
  // game.debug.text(game.time.physicsElapsed, 32, 32);
  // game.debug.bodyInfo(player, 16, 24);

  game.debug.bodyInfo(g.h.sprite, 32, 32);
  game.debug.body(g.h.sprite);
}