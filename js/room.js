var Room = function (game, name) {
  var r = this;
  r.g = game;
  r.name = name;
  r.backgroundList = [];
};

Room.prototype.preload = function () {
  var r = this;
  r.g.load.tilemap(
    r.name,
    'assets/maps/' + r.name + '.json',
    null,
    Phaser.Tilemap.TILED_JSON
  );
  return r;
};

Room.prototype.addStaticBackgroundLayer = function (imageUrl, properties) {
  var r = this;

  var key = imageUrl.split("/")
  key = key[key.length-1].split(".")[0]
  r.l.bg.push([ r.g.add.tileSprite(0, 0, r.t.widthInPixels, r.t.heightInPixels, key), properties, 0, 0]);

  return r;
};

Room.prototype.addBackgroundLayer = function () {
  var r = this;
  
  r.l.bg = [];

  for (var i = 0; i < r.t.images.length; i++) {
    if (r.t.images[i].properties.parallax <= 1) {
      r.addStaticBackgroundLayer(r.t.images[i].image, r.t.images[i].properties);
    }
  }

  return r;
};

Room.prototype.addForegroundLayer = function () {
  var r = this;
  
  for (var i = 0; i < r.t.images.length; i++) {
    if (r.t.images[i].properties.parallax > 1) {
      r.addStaticBackgroundLayer(r.t.images[i].image, r.t.images[i].properties);
    }
  }

  return r;
};


Room.prototype.addCollisionLayer = function () {
  var r = this;
  r.t.addTilesetImage('collision');
  r.l.collision = r.t.createLayer('collision');
  r.l.collision.layer.data.forEach(function(e){
    e.forEach(function(t){
      if (t.index < 0) {
        // none
      } else if (t.index === 1) {
        t.slope = 'FULL_SQUARE';
      } else if (t.index === 2) {
        t.slope = 'HALF_TRIANGLE_BOTTOM_RIGHT';
      } else if (t.index === 3) {
        t.slope = 'HALF_TRIANGLE_BOTTOM_LEFT';
      } else if (t.index === 4) {
        t.slope = 'LONG_TRIANGLE_BOTTOM_RIGHT_LOW';
      } else if (t.index === 5) {
        t.slope = 'LONG_TRIANGLE_BOTTOM_RIGHT_HIGH';
      } else if (t.index === 6) {
        t.slope = 'LONG_TRIANGLE_BOTTOM_LEFT_HIGH';
      } else if (t.index === 7) {
        t.slope = 'LONG_TRIANGLE_BOTTOM_LEFT_LOW';
      } else if (t.index === 8) {
        t.collideUp = true;
      } else {
        //console.log(t.index);
      }
    });
  });
  r.t.setCollision([1,2,3,4,5,6,7]);
  r.l.collision.resizeWorld();
  r.l.collision.visible = false;
  return r;
};

Room.prototype.addDecoLayer = function (layerName) {
  var r = this;
  r.l['tilemap-'+layerName] = r.t.createLayer('tilemap-'+layerName);
  return r;
};

Room.prototype.addPlayerLayer = function (portal) {
  var r = this,
  h = r.g.h;
  
  if (portal == undefined) {
    var spawn = r.t.objects.spawn;
    if (spawn) {
      h.setPosition(spawn.x-(20), spawn.y);
    } else {
      h.setPosition(1, 1);
    }
  } else {
    var portals = r.t.objects.portals;
    //console.log(portal)
    for (var i = 0; i < portals.length; i++) {
      if (portals[i].properties.room == portal.fromRoom) {
        console.log(r.g.h)

        if (portals[i].properties.direction == 'down') {
          h.setPosition(portals[i].x, portals[i].y - (r.g.h.body.height * 4) );
        } else if (portals[i].properties.direction == 'up') {
          h.setPosition(portals[i].x, portals[i].y + portals[i].height - (r.g.h.body.height * 2));
        } else if (portals[i].properties.direction == 'left') {
          console.log(portals[i].x + portals[i].width)
          h.setPosition(portals[i].x + portals[i].width - 25, portals[i].y + portals[i].height - portal.offset);
        } else if (portals[i].properties.direction == 'right') {
          h.setPosition(portals[i].x - 46, portals[i].y + portals[i].height - portal.offset);
        }

      }
    }
  }
  return r;
};

Room.prototype.addTilesetImages = function () {
  var r = this;
  for (var i = r.t.tilesets.length - 1; i >= 0; i--) {
    r.t.addTilesetImage(r.t.tilesets[i].name);
  }
  return r;
};

Room.prototype.addSpawn = function() {
  var r = this;
  var objects = r.t.objects.objects;
  for (var i = 0; i < objects.length; i++) {
    if (objects[i].type == 'spawn') {
      r.t.objects.spawn = objects[i];
    }
  }
  return r;
};


Room.prototype.addPortals = function () {
  var r = this,
  portals = r.t.objects.portals;
  if (portals) {
    for (var i = portals.length - 1; i >= 0; i--) {
      r.p[portals[i].name] = new Portal(r.g, portals[i]);
      r.p[portals[i].name].create();
    }  
  }
  return r;
};

Room.prototype.destroyPortals = function() {
  var r = this;
  var portal;
  for (portal in r.p) {
    if (r.p.hasOwnProperty(portal)) {
      r.p[portal].sprite.destroy();
    }
  }
  return r;
};

Room.prototype.create = function(portal) {
  var r = this;
  r.tilemap = r.g.add.tilemap(r.name);
  r.t = r.tilemap;
  r.layers = {};
  r.l = r.layers;
  r.portals = {};
  r.p = r.portals;
  
  r.addTilesetImages()
    .addPortals()
    .addSpawn()
    .addBackgroundLayer()
    .addCollisionLayer()
    .addDecoLayer('bg')
    .addPlayerLayer(portal)
    .addDecoLayer('fg')
    .addForegroundLayer();
  return r;
};

Room.prototype.setBackgroundPosition = function () {
  var r = this;

  for (var i = 0; i < r.l.bg.length; i++) {
    var bg = r.l.bg[i];

    if (bg[1].vectorX) {
      bg[2] += Number(bg[1].vectorX) % 512;
      bg[3] += Number(bg[1].vectorY) % 512;
    }

    
    if (bg[1].parallax > 1) {
      bg[0].tilePosition = new Phaser.Point(Math.round((-game.camera.position.x + bg[2]) * bg[1].parallax), Math.round((-game.camera.position.y + bg[3]) * bg[1].parallax))
    } else {
      bg[0].tilePosition = new Phaser.Point(Math.round((game.camera.position.x + bg[2]) * bg[1].parallax), Math.round((game.camera.position.y + bg[3]) * bg[1].parallax))
    }


    // if (bg[1].parallax > 1) {
    //   bg[0].tilePosition = new Phaser.Point(-Math.round(game.camera.position.x * bg[1].parallax), -Math.round(game.camera.position.y * bg[1].parallax))
    // } else {
    //   bg[0].tilePosition = new Phaser.Point(Math.round(game.camera.position.x * bg[1].parallax), Math.round(game.camera.position.y * bg[1].parallax))
    // }
  }
  
  return r;
};

Room.prototype.checkDoorCollision = function () {
  var r = this;
  var portal;
  for (portal in r.p) {
    if (r.p.hasOwnProperty(portal)) {
      if (Phaser.Rectangle.intersects(
        g.h.body,
        r.p[portal].body
      )) {
        var direction = r.p[portal].d.properties.direction;
        var offset;

        if (direction == 'left' || direction == 'right') {
          
          offset = ((r.p[portal].d.y + r.p[portal].d.height)-Math.round(r.g.h.sprite.y));

        } else {

        }

        r.g.m.usePortalTo({
          room: r.p[portal].to.room,
          offset: offset  
        })
      }
    }
  }
  return r;
};

Room.prototype.update = function () {
  var r = this;
  if (g.m.r === r) {
    r.setBackgroundPosition()
      .checkDoorCollision();
  }
  return r;
};

Room.prototype.destroy = function () {
  var r = this,
    layer;
  for (layer in r.l) {
    if (r.l.hasOwnProperty(layer)) {
      if (layer == 'bg') {
        for (var i = 0; i < r.l[layer].length; i++) {
          r.l[layer][i][0].destroy();
        }
      } else {
        r.l[layer].destroy();
      }
    }
  }
  r.destroyPortals();
  return r;
};