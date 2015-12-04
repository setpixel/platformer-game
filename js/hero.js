var Hero = function (game) {
  var h = this,
    now = new Date();   
  h.g = game;
};

Hero.prototype.preload = function () {
  var h = this;
  h.g.load.spritesheet('heroplayer', 'assets/sprites/phaser-ship.png');
  return h;
};

Hero.prototype.create = function () {
  var h = this;
  h.sprite = h.g.add.sprite(100, 100, 'heroplayer');
  h.g.physics.enable(h.sprite, Phaser.Physics.ARCADE);
  h.body = h.sprite.body;
  h.body.bounce.y             = 0;
  h.body.gravity.y            = 1500;
  //h.body.collideWorldBounds   = true; 
  h.body.sticky               = true;
  h.body.tilePadding.set(32, 32);
  h.sprite.anchor.set(0.5);
  h.body.maxVelocity['y'] = 500;
  //h.body.drag['x'] = 500;

  //h.body.setSize(14, 16, 1, 0);
  //h.g.camera.focusOn(h.sprite);
  h.cursors = h.g.input.keyboard.createCursorKeys();

  return h;
};

Hero.prototype.update = function () {
  var h = this;
  h.g.physics.arcade.collide(h.sprite, h.g.m.r.l.collision);
  h.updateMovement();

  return h;
};

Hero.prototype.setPosition = function() {
  var h = this;
  h.sprite.bringToTop();
  return h;
}

Hero.prototype.updateMovement = function () {
  var h = this;
  if (h.cursors.up.isDown) {
    h.body.velocity.y = -200;
  } else if (h.cursors.down.isDown) {
    h.body.velocity.y = 1200;
  }

  h.body.velocity.x = 0;

  if (h.cursors.left.isDown) {
    h.body.velocity.x = -200;
    h.sprite.scale.x = -1;
  } else if (h.cursors.right.isDown) {
    h.body.velocity.x = 200;
    h.sprite.scale.x = 1;
  }
  return h;
};

Hero.prototype.render = function () {
  var h = this;
  return h;
};