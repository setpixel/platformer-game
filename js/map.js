var Map = function (game) {
  var m = this;
  m.g = game;
  m.d = m.data;
  m.rooms = {};
  m.r = 'mariotest';
  m.init();
};

Map.prototype.data = {
  rooms: [
    'mariotest'
  ],
  tilesets: [
    'collision',
    'debugtileset',
    'tilesetearth'
  ],
  backgrounds: [
    'cloudsbg',
    'cloudsdistant',
    'cloudssmall',
    'rain'
  ],
  sprites: [
  ]
};

Map.prototype.init = function () {
  var m   = this;
  for (var i = m.d.rooms.length - 1; i >= 0; i--) {
    m.rooms[m.d.rooms[i]] = new Room(m.g, m.d.rooms[i]);
    if (m.d.rooms[i] == m.r) {
      m.r = m.rooms[m.d.rooms[i]];
    }
  }
  return m;
};

Map.prototype.eachRoom = function (action) {
  var m   = this;
  for (room in m.rooms) {
    if (m.rooms.hasOwnProperty(room)) {
      m.rooms[room][action]();
    }
  }
  return m;
};

Map.prototype.loadAssets = function (type) {
  var m = this,
    asset;
  for (var i = m.d[type].length - 1; i >= 0; i--) {
    m.g.load.image(
      m.d[type][i],
      'assets/' + type + '/' + m.d[type][i] +'.png'
    );
  }
  return m;
};

Map.prototype.preload = function () {
  var m = this;
  m.eachRoom('preload')
    .loadAssets('tilesets')
    .loadAssets('backgrounds')
    .loadAssets('sprites');
  return m;
};

Map.prototype.create = function () {
  var m = this;
  m.r.create();
  return m;
};

Map.prototype.update = function () {
  var m = this;
  m.r.update();
  return m;
};