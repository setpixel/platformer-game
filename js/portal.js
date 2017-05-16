var Portal = function (game, data) {
  var p = this;
  p.g = game;
  p.d = data;
};

Portal.prototype.create = function () {
  var p = this;
  p.to = {
    room: p.d.properties.room,
    door: p.d.properties.door
  };
  p.sprite = p.g.add.sprite(p.d.x, p.d.y);
  p.g.physics.enable(p.sprite, Phaser.Physics.ARCADE);
  p.body = p.sprite.body;
  p.body.immovable = true;
  p.body.setSize(p.d.width, p.d.height);
  return p;
};