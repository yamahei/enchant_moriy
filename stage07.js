//var CHAR_BAT = 'monster_bat_darkgreen.png';
//var CHAR_GIANT = 'monster_giant_blue.png';
var CHAR_CHIKEN = './assets/image/char_chiken_white.png';
var CHAR_EAGLE = './assets/image/char_eagle_brown.png';
var SOUND_CHIKEN_00 = './assets/sound/CockM_at_11.mp3';
var SOUND_EAGLE_00 = './assets/sound/ClothD_at_16.mp3';
var MAP_DATA = "" +
"--------------------------------------------------------------------------------*U----------*L--------------------------------------*R------*D----" + "\n" +
"--------------------------------------------------------------------------------------------------------------------------------------------------" + "\n" +
"--------------------------------------------------------------------------------------------------------------------------------------------------" + "\n" +
"--------------------------------------------------------------------------------------------------------------------------------------------------" + "\n" +
"------------------------------------------------------------------------------------------------------------------------------------------------@E" + "\n" +
"------------------------------------------------------------------------------------------------------------------------------------------42------" + "\n" +
"------------------------------------------------------------------------------------------------------------------------------------------62------" + "\n" +
"------------------------------------------------------------------------------------------------------------------------------------------62------" + "\n" +
"--------------------------------------------------------------------------------------------------------------------------------**--------72------" + "\n" +
"----------------------------------03430343034303--034303430343034303430343034303--03430343034303--034343------------------------2B--------42------" + "\n" +
"----------------------------------13931393139313A4139313931393139313931393139313--13931393139313A4139313A4--------------------------------62------" + "\n" +
"----------------------------------23A323A323A323A323A323A323A323A323A323A323A323A423A323A323A323A323A323A3--------------------------------62------" + "\n" +
"----------------------------------23A323A323A323A323A323A323A323A323A323A323A323A323A323A323A323A323A323A3------------------@C@C@C@C@C----72--D4--" + "\n" +
"----------------------------------23A323A323A323A323A323A323A323A323A323A323A323A323A323A323A323A323A323A3----------------414141414141414141414141" + "\n" +
"----------------------------------23A323A323A323A323A323A323A323A323A323A323A323A323A323A323A323A323A323A3----------414141616161616161616161616161" + "\n" +
"------------@0------F5------------23A323A323A323A323A323A323A323A323A323A323A323A323A323A323A323A323A323A3----414141616161616161616161616161616161" + "\n" +
"40404040404040404040404040404040404073407340734073407340734073407340734073407340734073407340734073407340734040404040404040404040404040404040404040" ;


/* manage character of chiken object */
var CharChiken = enchant.Class.create( SpriteChar, {
  initialize: function(_gameObj, _mapObj, _eventObj, _charObj, mapX, mapY){
    var offsetH = 6; var offsetU = 20; var offsetB = 1;
    var startX = (mapX * _mapObj.tileWidth) - 4;
    var startY = (mapY * _mapObj.tileHeight) - 16;
    SpriteChar.call( this,
      _gameObj, _mapObj, startX, startY, 24/* width */, 32/* height */,
      CHAR_CHIKEN/* image */, offsetH, offsetU, offsetB
    );
    this._eventObj = _eventObj; this._charObj = _charObj;
    this.speedX = 0; this.speedY = 0; this.stateCounter = 0;
    this.states = {stand: 0, walk: 1, run: 2, flap: 3}; this.state = this.states.stand;
    this.a = new Anime();
    this.a.setAction(this.a.stand); this.a.setDirection(this.a.fore);
    this.frame = this.a.getNumber();
  },
  stand: {
    get: function(){ return (this.state == this.states.stand); },
    set: function(v){ if(v) this.state = this.states.stand; }
  },
  walk: {
    get: function(){ return (this.state == this.states.walk); },
    set: function(v){ if(v) this.state = this.states.walk; this.stateCounter = 60; }
  },
  run: {
    get: function(){ return (this.state == this.states.run); },
    set: function(v){ if(v){
        this.state = this.states.run; this.stateCounter = 30;
        if(typeof(monaca) !== 'undefined'){
            monaca_sound_play(SOUND_CHIKEN_00);
        }else{
            this._gameObj.assets[SOUND_CHIKEN_00].clone().play();
        }
      }
    }
  },
  flap: {
    get: function(){ return (this.state == this.states.flap); },
    set: function(v){ if(v) this.state = this.states.flap; }
  },
  enterFrame: function(e){
    var game = enchant.Game.instance;
    var hero = this._charObj;
    var ms = 3; var height = 32 - (this.offsetU + this.offsetB);

    if(this.stand){
      if(this.speedX === 0 && this.grounding) {
        this.a.setAction(this.a.stand);
        var rangeL = this._eventObj.rangeL;
        var rangeR = this._eventObj.rangeR;
        this.walkX = rangeL + Math.floor(Math.random() * (rangeR - rangeL));
        this.walk = true;
      } else { this.speedX += (this.speedX < 0) ? 1 : -1; }
    }else if(this.walk){
      this.a.setAction(this.a.walk);
      if(this.walkX < this.x) this.speedX -= 1;
      if(this.walkX > this.x) this.speedX += 1;
      if(Math.abs(this.x - hero.x) < 60) {
        if(!this._eventObj.eagle.carry) this.run = true;
      }
      else if(Math.abs(this.x - this.walkX) < 8) this.stand = true;
      else if(--this.stateCounter <= 0) this.stand = true;
    }else if(this.run){
      ms = 5; this.speedX *= 2;
      this.a.setAction(this.a.walk);
      if(Math.abs(this.x - hero.x) > 90) this.stand = true;
      if(--this.stateCounter <= 0) this.stand = true;
    }else if(this.flap){
      this.a.setAction(this.a.walk);
      if(this.grounding && this.speedY >= 0) this.stand = true;
    }

    if(this.speedX < -ms){ this.speedX = -ms; }
    if(this.speedX > ms){ this.speedX = ms; }
    if(this.speedY > 8){ this.speedY = 8; }

    this.hitCorrect(hero);

    var protX = 0; var protY = 0;
    var tileW = this._mapObj.tileWidth; var tileH = this._mapObj.tileHeight;
    if (!this.grounding) this.speedY += (this.speedY < height) ? 1 : 0;
    protY = this.hitTestY(this.hitLX, this.hitRX, this.hitBY + this.speedY, tileW, tileH);
    if(this.speedX > 0){
      protX = this.hitTestX(this.hitRX + this.speedX, this.hitUY, this.hitBY, tileW, tileH);
      if((protX !== 0) && this.grounding) this.speedY = (Math.random()*10 <= 4) ? -4 : this.speedY;
    }

    this.grounding = (this.hitTestY(this.hitLX, this.hitRX, this.hitBY + 1, tileW, tileH) !== 0);
    if(this.speedX === 0){this.a.setDirection(this.a.fore);}
    else{this.a.setDirection((this.speedX < 0) ? this.a.left : this.a.right);}
    this.frame = this.a.getNumber();

    this.x += (this.speedX - protX); if(this.x < 0) this.x = 0;
    this.y += (this.speedY - protY);
  },
  doFlap: function(){
    if(!this.flap){ this.flap = true; this.speedX = 0; this.speedY = -8; }
  },
  hitTest: function(char) {
    if (!this.intersect(char)) return false;
    return ( (this.hitLX < char.hitRX) && (this.hitRX > char.hitLX)
     && (this.hitUY < char.hitBY) && (this.hitBY > char.hitUY)
    );
  },
  hitCorrect: function(char){
    if(!this.hitTest(char)) return false;
    var protX = 0; var protY = 0;
    if(this.hitLX < char.hitLX && char.hitLX < this.hitRX) protX += (this.hitRX - char.hitLX);
    if(this.hitLX < char.hitRX && char.hitRX < this.hitRX) protX -= (char.hitRX - this.hitLX);
    if(this.hitUY < char.hitUY && char.hitUY < this.hitBY) protY += (char.hitUY - this.hitBY);
    if(this.hitUY < char.hitBY && char.hitBY < this.hitBY) protY += (this.hitUY - char.hitBY);
    if(protX===0 && protY===0) return false;

    if(!this.grounding &&  this.flap) char.grounding = true;
    if( this.grounding && !this.flap) this.speedY -= 4;
    if(Math.random()*10 <= 1) this.speedX *= -1;

  },
  dummy: function(){}
});

/* manage character of eagle object */
var CharEagle = enchant.Class.create( SpriteChar, {
  initialize: function(_gameObj, _mapObj, _eventObj, _charObj, mapX, mapY){
    var offsetH = 4; var offsetU = 5; var offsetB = 16;
    var startX = (mapX * _mapObj.tileWidth) - 4;
    this.startY = (mapY * _mapObj.tileHeight) - 16;
    SpriteChar.call( this,
      _gameObj, _mapObj, startX, this.startY, 24/* width */, 32/* height */,
      CHAR_EAGLE/* image */, offsetH, offsetU, offsetB
    );
    this._eventObj = _eventObj; this._charObj = _charObj;
    this.speedX = 0; this.speedY = 0; this.visible = false; this.carry = false;
    this.a = new Anime();
    this.a.setAction(this.a.walk); this.a.setDirection(this.a.right);
    this.frame = this.a.getNumber();
  },
  enterFrame: function(e){
    if(!this.visible) return;

    var game = enchant.Game.instance;
    var hero = this._charObj;
    var map = this._mapObj;

    this.a.setAction(this.a.walk); this.a.setDirection(this.a.right);
    this.frame = this.a.getNumber();
    if(this.x > this._eventObj.hoverX && this.y > 0){
      this.y -= 2; this.speedX = 4;
      this.a.setAction(this.a.stand);
      if(game.frame % 8 === 0){
        if(typeof(monaca) !== undefined){
            monaca_sound_play(SOUND_EAGLE_00);
        }else{
            this._gameObj.assets[SOUND_EAGLE_00].clone().play();
        }
      }
    }else{
      this.speedX = 6;
      this.a.setAction(this.a.walk);
    }
    this.x += this.speedX;
    if(this.x > map.width) this.visible = false;

    if(this.carry){
      hero._autoMode = true;
      hero.x = this.x;
      hero.y = this.y + 8;
      hero.speedX = this.speedX;
      hero.speedY = this.speedY;
      if(this.x > this._eventObj.dropX){
        hero._autoMode = false;
        this.carry = false;
      }
    }else{
      if(this.x < this._eventObj.dropX) this.hitCorrect(hero);
    }

  },
  ready: function(){
    this.x = 0 - this.width; this.y = this.startY;
    this.carry = false;
    this.visible = true;
  },
  hitTest: function(char) {
    if (!this.intersect(char)) return false;
    return ( (this.hitLX < char.hitRX) && (this.hitRX > char.hitLX)
     && (this.hitUY < char.hitBY) && (this.hitBY > char.hitUY)
    );
  },
  hitCorrect: function(char){
    if(!this.hitTest(char)) return false;
    var protX = 0; var protY = 0;
    if(this.hitLX < char.hitLX && char.hitLX < this.hitRX) protX += (this.hitRX - char.hitLX);
    if(this.hitLX < char.hitRX && char.hitRX < this.hitRX) protX -= (char.hitRX - this.hitLX);
    if(this.hitUY < char.hitUY && char.hitUY < this.hitBY) protY += (char.hitUY - this.hitBY);
    if(this.hitUY < char.hitBY && char.hitBY < this.hitBY) protY += (this.hitUY - char.hitBY);
    if(protX===0 && protY===0) return false;

    this.carry = true;
    return true;
  },
  dummy: function(){}
});

/* event object of stage */
var EventStage = enchant.Class.create({
    initialize: function(_gameObj) {
      this._gameObj =_gameObj;
      this.message = undefined;
      this.chikens = []; this.eagle = undefined;
      this.hoverX = undefined; this.dropX = undefined;
      this.rangeL = undefined; this.rangeR = undefined;
      this.isClear = false; this.clearCounter = 0;
    },
    flap: function(){
      for(var i=0; i<this.chikens.length; i++){ this.chikens[i].doFlap(); }
      if(!this.eagle.visible) this.eagle.ready();
    },
    dummy: function(){}
});

var initMoriy = function() {//---
//window.onload = function() {//---

  /* init game */
  var game = new Game(GAME_WIDTH, GAME_HEIGHT);

  game.onload = function() {

      var _map = new MapDataPerser(this, MAP_DATA);
      var fore = _map.foreMap;
      var map = _map.backMap;
      var positions = _map.monitors;
      var enemies = _map.chars;
      var doors = _map.doors;
      var events = new EventStage(game);
      var message = new MutableText( 16, 16,368);
      events.message = message;
      var hero = new CharHero(game, map, _map.startX, _map.startY);

      var stage = new Group();
      stage.addChild(map);//background

      var i;
      var tileWidth = map.tileWidth;
      for(i=0; i<positions.length; i++){
        var position = positions[i];
        switch(position.key){
          case "*":
            var monitor = new SpriteMonitor(game, hero, events, position.mapX, position.mapY + 1);
            monitor.touchEvent = function(){ this._eventObj.flap(); };
            stage.addChild(monitor);
          break;
          case "U": events.hoverX = position.mapX * tileWidth; break;
          case "D": events.dropX  = position.mapX * tileWidth; break;
          case "L": events.rangeL = position.mapX * tileWidth; break;
          case "R": events.rangeR = position.mapX * tileWidth; break;
        }
      }

      for(i=0; i<doors.length; i++){// door object
        var d = doors[i];
        var typed = SpriteObjDoors.indexes[d.type];
        var settingd = SpriteObjDoors[typed];
        var objd = new SpriteDoor(game, map, hero, events, d.mapX, d.mapY, settingd, d.isOpen);
        objd.eventTouch = function(){ this.open(); };
        objd.eventOpen = function(){
          this._eventObj.isClear = true;
          this._eventObj.clearCounter = 0;
        };
        //events.doors.push(objd);
        stage.addChild(objd);
      }

      stage.addChild(hero);


      var objects = _map.objects;
      for(i=0; i<objects.length; i++){// event object
        var o = objects[i];
        var typee = SpriteObjTypes.indexes[o.type];
        var settinge = SpriteObjTypes[typee];
        var obje = new SpriteObj(game, map, hero, {}, o.mapX, o.mapY, settinge, o.default);
        obje._eventObj = events;
        switch(typee){
          case "messageBoard":
            obje.eventTouch = function(){ this._eventObj.message.setText('ATTENTION: Due to a known bug, do not quit the application in sound reproduction.'); };
            obje.eventLeave = function(){ this._eventObj.message.setText(''); };
          break;
        }
        stage.addChild(obje);
      }

      for(i=0; i<enemies.length; i++){
        enemy = enemies[i];
        var char;
        if(enemy.key=="C"){
          char = new CharChiken(game, map, events, hero, enemy.mapX, enemy.mapY);
          events.chikens.push(char);
        }
        else if(enemy.key=="E"){
          char = new CharEagle(game, map, events, hero, enemy.mapX, enemy.mapY);
          events.eagle = char;
        }
        if(char) stage.addChild(char);
      }


      stage.addChild(fore);

      stage._scroll = function(){
        this.x = (game.width + hero.width) / 2 - hero.x;
        if (this.x > 0) { this.x = 0 }
        if (this.x < game.width - map.width) { this.x = game.width - map.width; }
        this.y = (game.height + hero.height) / 2 - hero.y;
        if (this.y > 0) { this.y = 0 }
        if (this.y < game.height - map.height) { this.y = game.height - map.height; }
      };
      stage.addEventListener('enterframe', function(e) {
        this._scroll();
        if(hero.y > map.height + (hero.height * 1)){ game.end(false); }
        if (events.isClear) {
          hero._autoMode = true;//
          if ((events.clearCounter / game.fps) >= 1.5){ game.end(true); }
          events.clearCounter++;
        }
      });
      stage.x = game.width; stage.y = game.height;

      game.rootScene.addChild(stage);
      game.rootScene.addChild(message);

      game.rootScene.addChild(new MyPadLRU(0, game.height - 84));

      game.rootScene.backgroundColor = 'rgb( 2, 8,16)';

  };

  game.end = GameFinalAction;//override to hack
  game.fps = 12;
  game.preload(
    PAD_IMG_LRU, /*PAD_IMG_LR, PAD_IMG_UP,*/ CHAR_DOOR,
    START_IMG, CLEAR_IMG, OVER_IMG, DUMMY_IMG, CHAR_HERO, MAP_LIKE_OBJ, MAP_TILE, CHAR_EFFECT,
    SOUND_JUMP, SOUND_GAMEOVER, SOUND_CORRECT, SOUND_SWITCH_00, SOUND_SWITCH_01, SOUND_LAMP, SOUND_OPEN_00, SOUND_CLOSE_00, SOUND_OPEN_01, SOUND_CLOSE_01
    /* this stage only ? */
    , CHAR_CHIKEN, SOUND_CHIKEN_00, CHAR_EAGLE, SOUND_EAGLE_00 /*,CHAR_BAT,CHAR_GIANT */
  );
  // sound preload for monaca
  if(typeof(monaca) !== 'undefined'){
    monaca_sound_preload([SOUND_JUMP, SOUND_GAMEOVER, SOUND_CORRECT, SOUND_SWITCH_00, SOUND_SWITCH_01, SOUND_LAMP, SOUND_OPEN_00, SOUND_CLOSE_00, SOUND_OPEN_01, SOUND_CLOSE_01, SOUND_CHIKEN_00, SOUND_EAGLE_00]);
  }

  game.start();

};//---

