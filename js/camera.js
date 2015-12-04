var Camera = function (game) {
  var c = this,
    now = new Date();   
  c.g = game;
  c.x = 0;
};

Camera.prototype.preload = function () {
  var c = this;
  return c;
};

Camera.prototype.create = function (hero) {
  var c = this;
  c.h = hero;

  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.camera.roundPx = false;

  return c;
};

Camera.prototype.update = function () {
  var c = this;

  game.camera.y = Math.floor(c.h.sprite.y-(game.height/2));
  game.camera.x = Math.floor(c.h.sprite.x-(game.width/2));
  
  return c;
};