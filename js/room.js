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

Room.prototype.addPlayerLayer = function (doorIndex) {
  var r = this,
    h = r.g.h;
    h.setPosition();
  // if (doorIndex == 0) {
  //     s.setPosition(
  //         r.t.objects.doors[doorIndex].x,
  //         r.t.objects.doors[doorIndex].y - 16,
  //         'right'
  //     );
  // } else {
  //     if (s.is('right')) {
  //         s.setPosition(
  //             r.d[doorIndex].d.x + 64 + 8,
  //             r.d[doorIndex].d.y + 64 - s.body.height,
  //             'right'
  //         );
  //     } else {
  //         s.setPosition(
  //             r.d[doorIndex].d.x - 8 - s.body.width,
  //             r.d[doorIndex].d.y + 64 - s.body.height,
  //             'left'
  //         );
  //     }
  // }
  return r;
};

Room.prototype.addTilesetImages = function () {
  var r = this;
  for (var i = r.t.tilesets.length - 1; i >= 0; i--) {
    r.t.addTilesetImage(r.t.tilesets[i].name);
  }
  return r;
};

// Room.prototype.addDoors = function () {
//     var r       = this,
//         doors   = r.t.objects.doors;
//     for (var i = doors.length - 1; i >= 0; i--) {
//         if (doors[i].type == 'door') {
//             r.d[doors[i].name] = new Door(r.g, doors[i]);
//             r.d[doors[i].name].create();
//         }
//     }
//     return r;
// };

// Room.prototype.bringDoorsToTop = function () {
//     var r       = this,
//         door;
//     for (door in r.d) {
//         if (r.d.hasOwnProperty(door)) {
//             r.d[door].sprite.bringToTop();
//         }
//     }
//     return r;
// };

// Room.prototype.detroyDoors = function () {
//     var r       = this,
//         door;
//     for (door in r.d) {
//         if (r.d.hasOwnProperty(door)) {
//             r.d[door].sprite.destroy();
//         }
//     }
//     return r;
// };

Room.prototype.create = function () {
  var r = this;
  r.tilemap = r.g.add.tilemap(r.name);
  r.t = r.tilemap;
  r.layers = {};
  r.l = r.layers;

  r.addTilesetImages()
    //.addDoors()
    .addBackgroundLayer()
    .addCollisionLayer()
    .addDecoLayer('bg')
    .addPlayerLayer()
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

Room.prototype.update = function () {
  var r = this;
  if (g.m.r === r) {
    r.setBackgroundPosition();
  }
  return r;
};

Room.prototype.destroy = function () {
  var r = this,
    layer;
  for (layer in r.l) {
    if (r.l.hasOwnProperty(layer)) {
      r.l[layer].destroy();
    }
  }
  //r.detroyDoors();
  return r;
};