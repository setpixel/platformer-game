var Hero = function (game) {
  var h = this;
  var now = new Date();   
  h.g = game;
  h.b = {
    up:     {},
    down:   {},
    left:   {},
    right:  {},
    a:      {},
    b:      {},
  };
  h.state = {
    onGround: {
      is: false,
      since: now
    },
    falling: {
      is: false,
      since: now
    },
    left: {
      is: false,
      since: now
    },
    right: {
      is: false,
      since: now
    },
    jump: {
      is: false,
      since: now
    },
    jumpPossible: {
      is: true,
      since: now
    }
  };
  h.animations = [
    {
      name: 'standLeft',
      fps: 15,
      loop: false,
      frames: [4]
    },
    {
      name: 'standRight',
      fps: 15,
      loop: false,
      frames: [5]
    },
    {
      name: 'walkLeft',
      fps: 10,
      loop: true,
      frames: [3,4]
    },
    {
      name: 'walkRight',
      fps: 10,
      loop: true,
      frames: [6,5]
    },
    {
      name: 'skidLeft',
      fps: 10,
      loop: true,
      frames: [22]
    },
    {
      name: 'skidRight',
      fps: 10,
      loop: true,
      frames: [21]
    },
    {
      name: 'jumpLeft',
      fps: 10,
      loop: true,
      frames: [1]
    },
    {
      name: 'jumpRight',
      fps: 10,
      loop: true,
      frames: [7]
    },

  ];


};

Hero.prototype.defineButtons = function () {
  var h = this;
  h.b.up = h.g.input.keyboard.addKey(
    Phaser.Keyboard.UP);

  h.b.down = h.g.input.keyboard.addKey(
    Phaser.Keyboard.DOWN);

  h.b.left = h.g.input.keyboard.addKey(
    Phaser.Keyboard.LEFT);

  h.b.right = h.g.input.keyboard.addKey(
    Phaser.Keyboard.RIGHT);

  h.b.a = h.g.input.keyboard.addKey(
    Phaser.Keyboard.S);

  h.b.b = h.g.input.keyboard.addKey(
    Phaser.Keyboard.A);

  return h;
};

Hero.prototype.preload = function () {
  var h = this;
  h.g.load.spritesheet('heroplayer', 'assets/sprites/hero.png', 72, 72);
  return h;
};

Hero.prototype.addAnimations = function () {
  var h = this;
  for (var i = h.animations.length - 1; i >= 0; i--) {
    h.sprite.animations.add(
      h.animations[i].name,
      h.animations[i].frames,
      h.animations[i].fps,
      h.animations[i].loop
    );
  }
  return h;
};

Hero.prototype.create = function () {
  var h = this;
  h.sprite = h.g.add.sprite(6700, 100, 'heroplayer');
  h.g.physics.arcade.TILE_BIAS = 16;
  h.g.physics.enable(h.sprite, Phaser.Physics.ARCADE);
  h.body = h.sprite.body;
  h.body.bounce.y             = 0;
  h.body.gravity.y            = 1500;
  h.body.collideWorldBounds   = false; 
  h.body.sticky               = true;
  h.body.setSize(20, 26, 26, 44);
  h.body.tilePadding.x = 50;
  h.body.tilePadding.y = 50;
  //h.sprite.anchor.set(0.5);
  //h.g.camera.focusOn(h.sprite);
  //h.cursors = h.g.input.keyboard.createCursorKeys();
  h.addAnimations();
  h.defineButtons();
  h.set('right', true)
  h.sprite.animations.play('standRight');
  return h;
};

Hero.prototype.get = function (state, expected, since) {
  var h = this,
    now;
  if (typeof since == 'undefined') {
    return h.state[state].is == expected;
  } else {
    now = new Date();
    return ( h.state[state].is == expected && now - h.state[state].since >= since );
  }
};

Hero.prototype.is = function (state, since) {
  var h = this;
  return h.get(state, true, since);
};

Hero.prototype.isnt = function (state, since) {
  var h = this;
  return h.get(state, false, since);
};

Hero.prototype.set = function (state, value) {
  var h = this,
    now = new Date();
  h.state[state].is = value;
  h.state[state].since = now;
  return h;
};

Hero.prototype.isExclusiveDirection = function () {
  var h = this;
  return (
    (h.b.left.isDown && !h.b.right.isDown)
    ||
    (h.b.right.isDown && !h.b.left.isDown)
  );
};

Hero.prototype.update = function () {
  var h = this;
  h.g.physics.arcade.collide(h.sprite, h.g.m.r.l.collision);
  h.updateMovement();
  return h;
};

Hero.prototype.setPosition = function(x, y) {
  var h = this;
  h.sprite.position.setTo(x,y);
  h.sprite.bringToTop();
  return h;
}

Hero.prototype.isAnim = function (name) {
  var h = this;
  return h.sprite.animations.currentAnim.name == name;
};

Hero.prototype.isntAnim = function (name) {
  var h = this;
  return !h.isAnim(name);
};

Hero.prototype.isOnGround = function () {
  var h = this;
  return !(h.isnt('onGround', 4) || (!h.body.onFloor() && h.body.velocity.y < 0));
};

Hero.prototype.isntOnGround = function () {
  var h = this;
  return !h.isOnGround();
};

Hero.prototype.stand = function() {
  var h = this;
  var directionString;
  var direction;
  if (h.is('left')) {
    directionString = 'Left';
    direction = -1;
  } else {
    directionString = 'Right';
    direction = 1;
  }

  if ((h.body.velocity.x * direction) > 7) {
    h.body.velocity.x -= (7 * direction);
  } else {
    h.body.velocity.x = 0;
  }

  h.sprite.animations.currentAnim.speed = Math.min(Math.abs(h.body.velocity.x/10), 8);

  if (Math.abs(h.body.velocity.x) < 5) {
    //h.sprite.animations.stop();
    h.sprite.animations.play('stand' + directionString);
  } else {
    if (h.isntAnim('walk' + directionString)) {
      h.sprite.animations.play('walk' + directionString);
    }
  }
  return h;
};

Hero.prototype.walk = function(direction) {
  var h = this;
  var directionString;
  if (direction > 0) {
    directionString = 'Right';
    h.set('left', false);
    h.set('right', true);
  } else {
    directionString = 'Left';
    h.set('left', true);
    h.set('right', false);
  }

  if ((h.body.velocity.x * direction) < 0) {
    h.sprite.animations.play('skid' + directionString, 8);
  } else {
    if (h.isntAnim('walk' + directionString)) {
      h.sprite.animations.play('walk' + directionString, 8);
    }
    h.sprite.animations.currentAnim.speed = 8;
  }
  if (h.b.b.isDown) {
    h.sprite.animations.currentAnim.speed = 15;
    if ((h.body.velocity.x * direction) < 300) {
      h.body.velocity.x += (16 * direction);
    }
    if ((h.body.velocity.x * direction) > 300) {
      h.body.velocity.x -= (5 * direction);
    }
  } else {
    if ((h.body.velocity.x * direction) < 150) {
      h.body.velocity.x += (16 * direction);
    }
    if ((h.body.velocity.x * direction) > 150) {
      h.body.velocity.x -= (5 * direction);
    }
  }


  //h.sprite.animations.currentAnim.speed = 10;

  return h;
};



Hero.prototype.jump = function() {
  var h = this;
  h.set('jumpPossible', false);
  h.set('jump', true);
  h.body.gravity.y = 1600;
  if (Math.abs(h.body.velocity.x) <= 100) {
    h.body.velocity.y = -460;
  } 
  if (Math.abs(h.body.velocity.x) > 100) {
    h.body.velocity.y = -477;
  }
  if (Math.abs(h.body.velocity.x) > 230) {
    h.body.velocity.y = -493;
  }
  if (Math.abs(h.body.velocity.x) > 330) {
    h.body.velocity.y = -510;
  }

  
  h.body.sticky = false;

  var directionString;
  if (h.is('left')) {
    directionString = 'Left';
  } else {
    directionString = 'Right';
  }
  h.sprite.animations.play('jump' + directionString);



  return h;
}

Hero.prototype.airWalk = function(direction) {
  var h = this;

  var directionString;
  if (h.b.left.isDown) {
    directionString = 'Left';
    h.set('left', true);
    h.set('right', false);
  } else if (h.b.right.isDown) {
    directionString = 'Right';
    h.set('left', false);
    h.set('right', true);
  }

  h.sprite.animations.play('jump' + directionString);

  var motionDirection;  
  if (h.body.velocity.x > 0) {
    motionDirection = 1;
  } else if (h.body.velocity.x < 0) {
    motionDirection = -1;
  } else {
    motionDirection = 0;
  }

  if (h.b.left.isDown) {
    if (motionDirection < 0 || motionDirection == 0) {
      h.body.velocity.x -= 10;
    } else {
      h.body.velocity.x += 4;
    }
  }
  if (h.b.right.isDown) {
    if (motionDirection > 0 || motionDirection == 0) {
      h.body.velocity.x += 10;
    } else {
      h.body.velocity.x -= 4;
    }
  }


  return h;
};


Hero.prototype.updateMovement = function () {
  var h = this;

  if (h.body.onFloor() && h.isnt('onGround')) {
      h.set('onGround', true);
  } else if (!h.body.onFloor() && h.is('onGround')) {
      h.set('onGround', false);
  }

  if (h.b.a.isDown && h.isOnGround() && h.is('jumpPossible')) {
    h.jump();
  } else if ( h.isExclusiveDirection() && h.isOnGround() ) {
    if (h.b.left.isDown) {
      h.walk(-1);
    } else {
      h.walk(1);
    }
  } else if (h.isOnGround()) {
    h.stand();
  } else if (h.isntOnGround()) {
    if (h.is('left')) {
      h.airWalk(-1);
    } else {
      h.airWalk(1);
    }
  }

  if (h.b.a.isUp && h.isOnGround()) {
    h.set('jumpPossible', true);
  }



  if (h.is('jump') && h.body.velocity.y < 0) {
    if (h.b.a.isDown && h.body.velocity.y < -200) {
      h.body.gravity.y = 640;
    } else {
      h.body.gravity.y = 1600;
    }

    console.log("jumping up!")
  }

  h.body.velocity.y = Math.min(h.body.velocity.y, 450)
  // if h.isOnGround()



  // if (h.cursors.up.isDown) {
  //   h.body.velocity.y = -200;
  // } else if (h.cursors.down.isDown) {
  //   h.body.velocity.y = 1200;
  // }

  // h.body.velocity.x = 0;

  // if (h.cursors.left.isDown) {
  //   h.body.velocity.x = -200;
  //   h.sprite.scale.x = -1;
  // } else if (h.cursors.right.isDown) {
  //   h.body.velocity.x = 200;
  //   h.sprite.scale.x = 1;
  // }
  return h;
};

Hero.prototype.render = function () {
  var h = this;
  return h;
};