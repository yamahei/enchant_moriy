var CHAR_BAT = './assets/image/monster_bat_darkgreen.png';
var CHAR_GIANT = './assets/image/monster_giant_blue.png';

var MAP_DATA = "" +
"707070707070707070707070707070707070707070707070707070707070" + "\n" +
"----------------------------------------------------------@B" + "\n" +
"----------------------------------*B--E4--*BE4--*BE4------@B" + "\n" +
"--------------------------------------------------------E1@B" + "\n" +
"------@0------E2----------------*B--*B--*B--*B--*B--*B----@B" + "\n" +
"404040404040404040404040----------40404040404040404040404040" + "\n" +
"6060606060606060607070----------4060606060606060606060606060" + "\n" +
"606060606060607070------------406060606060606070707060606060" + "\n" +
"60606060607070--------------406060606060606070------70606070" + "\n" +
"6060707070----------------406060606060606070----E1----7070--" + "\n" +
"6070--------------------406060606060607070------------------" + "\n" +
"60--------------------4060606060607070--*0----------------*1" + "\n" +
"60------------F5----40607070707070--------E4----E4----E4----" + "\n" +
"60------4040404040406060------------------------------------" + "\n" +
"60------989999999999999A------------------------------------" + "\n" +
"60------A8A9A9A9A9A9A9AA------------------------@G----------" + "\n" +
"6040----B8B9B9B9B9B9B9BA----------------404040404040404050--" + "\n" +
"707070707070707070707070------------40407070------706070----" + "\n" +
"--------------------------------40407070*2----E1----70----*3" + "\n" +
"----------------------------70707070------------------------" + "\n" +
"----------------------------------------E4----E4----E4------" + "\n" +
"------------------------*4--------------------------------*5" + "\n" +
"----4040----4040----4040------------------------------------" + "\n" +
"----989A----989A----989A----------------------@G------------" + "\n" +
"----989A----989A----989A*6--------------------D5----------*7" + "\n" +
"4040B8BA4040B8BA4040B8BA404040404040404040404040404040404040" ;

/* manage character of bat object */
var CharBat = enchant.Class.create( SpriteChar, {
  initialize: function(_gameObj, _mapObj, mapX, mapY){
    var offsetH = 6; var offsetU = 10; var offsetB = 14;
    var startX = (mapX * _mapObj.tileWidth) - offsetH;
    var startY = (mapY * _mapObj.tileHeight) + 8 - offsetB;
    SpriteChar.call( this,
      _gameObj, _mapObj, startX, startY, 24/* width */, 32/* height */,
      CHAR_BAT/* image */, offsetH, offsetU, offsetB
    );
    this.visible = false; this.wait = 0; this.counter = 0;
  },
  enterFrame: function(e){
    var myWidth = this.width - this.offsetH * 2;
    if(!this.visible){
      this.visible = (this.wait==1);
      this.wait -= ((this.wait > 0) ? 1 : 0);
      this.counter = 0;
    }
    if(this.visible) {
      var game = enchant.Game.instance;
      this.x -= (myWidth - 1);
      this.frame = 9 + (++this.counter % 3);
      if(this.x < 0){
        this.x = this._mapObj.width;
        this.wait = 0; this.visible = false;
      } else if(this._charObj){
        if (this.isTouch) this._charObj.speedX -= Math.floor(myWidth / 2);
      }
    }
  },
  isTouch: { get: function() {
    if(!this._charObj) return false;
    if (!this.intersect(this._charObj)) return false;
    return ( (this.hitLX < this._charObj.hitRX) && (this.hitRX > this._charObj.hitLX)
     && (this.hitUY < this._charObj.hitBY) && (this.hitBY > this._charObj.hitUY)
    );
  }},
  dummy: function(){}
});

/* manage character of giant object */
var CharGiant = enchant.Class.create( SpriteChar, {
  initialize: function(_gameObj, _mapObj, _eventObj, mapX, mapY){
    var offsetH = 3; var offsetU = 4; var offsetB = 0;
    this.startX = (mapX * _mapObj.tileWidth) - 3 - offsetH; this.walkX = this.startX;
    var startY = (mapY * _mapObj.tileHeight) - 16 - offsetB;
    this.walkMinX = 0; this.walkMaxX = 0; this.chaseMinX = 0; this.chaseMaxX = 0;
    this.index = -1; this.speedX = 0; this.speedY = 0; this.maxspeed = 7; this.lastTargetInRange = false;
    SpriteChar.call( this,
      _gameObj, _mapObj, this.startX, startY, 24/* width */, 32/* height */,
      CHAR_GIANT/* image */, offsetH, offsetU, offsetB
    );
    this._eventObj = _eventObj;
    this.states = {sleep: 0, stand: 1, walk: 2, chase: 3}; this.state = this.states.sleep;
    this.wait = 0; this.sleep = true; this.effect = undefined;
    this.a = new Anime(); this.targets = []; this.currentTarget = 0;
    this.a.setAction(this.a.stand); this.a.setDirection(this.a.back);
    this.frame = this.a.getNumber();
  },
  sleep: {
    get: function(){ return (this.state == this.states.sleep); },
    set: function(v){ if(v) this.state = this.states.sleep; }
  },
  stand: {
    get: function(){ return (this.state == this.states.stand); },
    set: function(v){ if(v) this.state = this.states.stand; }
  },
  walk: {
    get: function(){ return (this.state == this.states.walk); },
    set: function(v){ if(v) this.state = this.states.walk; }
  },
  chase: {
    get: function(){ return (this.state == this.states.chase); },
    set: function(v){ if(v) this.state = this.states.chase; }
  },
  myLampOn: { get: function(){ return this._eventObj.lamps[this.lamps[0]].currentValue; } },
  enterFrame: function(e){
    var game = enchant.Game.instance;
    var target = this.targets[this.currentTarget];
    var input = {};
    var xGapL = Math.abs(this.x - this.hitLX); var xGapR = Math.abs(this.x - this.hitRX);
    var selfInRange = this._eventObj.inRange(this.index, this);
    var targetInRange = this._eventObj.inRange(this.index, target);

    if(this.sleep){
      this.a.setAction(this.a.stand);
      this.a.setDirection(this.a.back);
      if(this.myLampOn) this.stand = true;
    } else if(this.stand){
      this.a.setAction(this.a.stand);
      this.a.setDirection(this.a.fore);
      if(!selfInRange){ this.chase = true; }//my range ?
      else if(targetInRange){ this.chase = true; } //targets range?
      else {
        this.walk = true;
        var nextX = this.walkMinX + Math.floor(Math.random() * (this.walkMaxX - this.walkMinX - xGapR));
        if(!this.myLampOn){ this.walkX = this.startX; }
        else { this.walkX = nextX; }
      }
    } else if(this.walk){
      this.a.setAction(this.a.walk);
      if( this.walkX < this.x ) input.left = true;
      if( this.x < this.walkX ) input.right = true;
      if(targetInRange && this.lastTargetInRange){ this.stand = true; }
      else if(Math.abs(this.x - this.walkX) <= this.maxspeed * 2){//arrive
        if (Math.abs(this.x - this.startX) <= this.maxspeed / 2){//home
          if(!this.myLampOn){ this.sleep = true; }
          else{ this.stand = true; }
        } else { this.stand = true; }
      }
    } else if(this.chase){
      this.a.setAction(this.a.walk);
      if(selfInRange && !targetInRange){
        this.walk = true;
      } else {
        if( target.x < this.x ) input.left = true;
        if( this.x < target.x ) input.right = true;
      }
    }


    if (input.left) { this.speedX -= 1; this.a.setDirection(this.a.left); }
    if (input.right) { this.speedX += 1; this.a.setDirection(this.a.right); }
    if(!input.left && !input.right){
      if(this.speedX !== 0) { this.speedX -= this.speedX / Math.abs(this.speedX); }
    }
    if(this.walk){
      if(this.hitLX <= this.walkMinX){ this.x = this.walkMinX + xGapL + 1; this.speedX = 0; }
      if(this.walkMaxX <= this.hitRX){ this.x = this.walkMaxX - xGapR - 1; this.speedX = 0; }
    }
    if(this.chase){
      var minX = this.chaseMinX; var maxX = this.chaseMaxX;
      if(!selfInRange){ minX = 0; maxX = this._mapObj.width; }
      if(this.hitLX <= minX){ this.x = minX + xGapL + 1; this.speedX = 0; }
      if(maxX <= this.hitRX){ this.x = maxX - xGapR - 1; this.speedX = 0; }
    }

    var protY = 0; var tileW = this._mapObj.tileWidth; var tileH = this._mapObj.tileHeight;
    if (!this.grounding) this.speedY += (this.speedY < tileH) ? 1 : 0;
    protY = this.hitTestY(this.hitLX, this.hitRX, this.hitBY + this.speedY, tileW, tileH);

    this.x += this.speedX; this.y += (this.speedY - protY);
    var ms = this.chase ? this.maxspeed : Math.floor(this.maxspeed / 2);
    if(this.speedX <-ms){ this.speedX =-ms; }
    if(this.speedX > ms){ this.speedX = ms; }


    this.grounding = (this.hitTestY(this.hitLX, this.hitRX, this.hitBY + 1, tileW, tileH) !== 0);
    if (!this.grounding){ this.a.setAction(this.a.jump); }
    else { this.speedY = 0; }

    for(var i=0; i<this.targets.length; i++){
      if(this.hitCorrect(this.targets[i])){
        this.currentTarget = i;
        if(i === 0){ this._eventObj.isClear = false; this.targets[i].autoMode = false; }
      }
    }
    this.frame = this.a.getNumber();
    this.lastTargetInRange = targetInRange;
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
    if(protX === 0 && protY===0) return false;

    if(this.hitLX-6<char.hitLX && char.hitRX<this.hitRX+6){
      if(char.hitBY < this.hitUY + 12 ){
        this.speedY = 0;
        char.grounding = this.sleep;
        char.y += protY;
        char.speedY = (this.sleep ? 0 : -4);
        protX = 0;
      }else if(char.hitUY < this.hitBY - 8){
        char.speedY += protY;
        protX = 0;
      }
    }
    if(protX !== 0){ // horizontal
      this.speedX -= (this.sleep ? 0 : protX);
      char.speedX += (char.sleep ? 0 : protX);
    }

    return true;
  },
  dummy: function(){}
});

/* event object of stage */
var EventStage = enchant.Class.create({
    initialize: function(_gameObj) {
      this._gameObj =_gameObj;
      this.isClear = false; this.clearCounter = 0;
      this.door = undefined; this.switches = []; this.lamps = [];
      this.bats = []; this.giants = [];
      this.batFlg = false; this.range = [[0,0,0,0], [0,0,0,0]];
    },
    setLamps: function(lampIndexes, value){
      for(var i=0; i<lampIndexes.length; i++){
        this.lamps[lampIndexes[i]].setValue(value);
      }
    },
    correctCheck: function(){
      if(this.switches[0].currentValue && this.switches[2].currentValue){
        if(typeof(monaca) !== 'undefined'){
            monaca_sound_play(SOUND_CORRECT);
        }else{
            this._gameObj.assets[SOUND_CORRECT].clone().play();
        }
        this.door.open();
      } else{ this.door.close(); }
    },
    inRange: function(index, char){
      var r = this.range[index];
      return r[0].inRange(char) & r[1].inRange(char) & r[2].inRange(char) & r[3].inRange(char);
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
      //var collision = _map._collisionMap;
      var events = new EventStage(game);
      var message = new MutableText( 16, 16,368);
      events.message = message;
      var hero = new CharHero(game, map, _map.startX, _map.startY);

      var stage = new Group();

      var i;
      var effects = [];
      var giantLamps = [[3, 4, 5], [6, 7, 8]];
      var enemies = _map.chars;
      for(i=0; i<enemies.length; i++){
        enemy = enemies[i];
        if(enemy.key=="B"){
          for(var j=0; j<3; j++){
            var bat = new CharBat(game, map, enemy.mapX, enemy.mapY);
            bat._charObj = hero;
            events.bats.push(bat);
          }
        }
        if(enemy.key=="G"){
          var giant = new CharGiant(game, map, events, enemy.mapX, enemy.mapY);
          var effect = new CharEffect(game, map, giant, SpriteObjEffect.Sleeping);
          effect.visible = true;
          effect.setPosition = function(){
            this.x = this._charObj.x; this.y = this._charObj.y - 16;
          };
          effect.setFrame = function(){
            this.counter = (++this.counter % 12);
            this.frame = (this.type * 3) + Math.floor(this.counter / 3);
            if(this._charObj.sleep) {
              if(this.counter === 0) this.visible = !this.visible;
            } else { this.visible = false; }
          },
          giant.lamps = giantLamps.shift();
          giant.targets.push(hero);
          giant.index = events.giants.length;
          events.giants.push(giant); effects.push(effect);
        }
      }
      events.giants[0].targets.push(events.giants[1]);
      events.giants[1].targets.push(events.giants[0]);

      var monitors = _map.monitors;
      for(i=0; i<monitors.length; i++){
        var position = monitors[i];
        var monitor = new SpriteMonitor(game, hero, events, position.mapX, position.mapY);
        if(position.key == "B"){
          monitor.touchEvent = function(){
            if(!this._eventObj.switches[3].currentValue) this._eventObj.batFlg = true;
          };
        }else{
          var key = position.key * 1;
          var no = (3 & key); var index = (4 & key) / 4;
          var x = (1 & key); var y = (2 & key) / 2;
          events.range[index][no] = monitor;
          monitor.rangeX = x; monitor.rangeY = y;
          monitor.inRange = function(char){
            var flgX = (this.rangeX===0) ? (this.hitLX <= char.hitRX) : (char.hitLX <= this.hitRX);
            var flgY = (this.rangeY===0) ? (this.hitUY <= char.hitBY) : (char.hitUY <= this.hitBY);
            return flgX & flgY;
          };
        }
        stage.addChild(monitor);//
      }

      stage.addChild(map);//background

      for(i=0; i<events.range.length; i++){
          rangeMinX = events.range[i][0]; rangeMaxX = events.range[i][1];
          events.giants[i].walkMinX = rangeMinX.hitLX;
          events.giants[i].walkMaxX = rangeMaxX.hitRX;
          events.giants[i].chaseMinX = rangeMinX.hitLX;
          events.giants[i].chaseMaxX = rangeMaxX.hitRX + (i===0 ? 80 : 0);
      }

      var doors = _map.doors;
      var _door = _map.doors[0];
      var type = SpriteObjDoors.indexes[_door.type];
      var setting = SpriteObjDoors[type];
      events.door = new SpriteDoor(game, map, hero, events, _door.mapX, _door.mapY, setting, _door.isOpen);
      events.door.eventTouch = function(){
        if( this.isOpen && !this._eventObj.isClear){
          this._eventObj.isClear = true;
          this._eventObj.clearCounter = 0;
          hero.autoMode = true;
        }
      };
      stage.addChild(events.door);

      var objects = _map.objects;
      for(i=0; i<objects.length; i++){// event object
        var o = objects[i];
        var typee = SpriteObjTypes.indexes[o.type];
        var settinge = SpriteObjTypes[typee];
        var obj = new SpriteObj(game, map, hero, {}, o.mapX, o.mapY, settinge, o.default);
        obj._eventObj = events;
        switch(typee){
          case "messageBoard":
            obj.eventTouch = function(){ this._eventObj.message.setText('Find correct steps.'); };
            obj.eventLeave = function(){ this._eventObj.message.setText(''); };
          break;
          case "switchUD": case "switchLR":
            events.switchUD = obj;
            obj.eventTouch = function(){ this.switchValue(); };
            events.switches.push(obj);
          break;
          case "lamp":
            obj.eventObj = events;
            events.lamps.push(obj);
          break;
        }
        stage.addChild(obj);
      }
      events.switches[0].eventOn  = function(){ this._eventObj.correctCheck(); };
      events.switches[0].eventOff = function(){ this._eventObj.correctCheck(); };
      events.switches[1].eventOn  = function(){ this._eventObj.setLamps([3, 4, 5], true); };
      events.switches[1].eventOff = function(){ this._eventObj.setLamps([3, 4, 5], false); };
      events.switches[2].eventOn  = function(){
        this._eventObj.correctCheck();
        this._eventObj.setLamps([6, 7, 8], true);
      };
      events.switches[2].eventOff = function(){
        this._eventObj.correctCheck();
        this._eventObj.setLamps([6, 7, 8], false);
      };
      events.switches[3].eventOn  = function(){ this._eventObj.setLamps([0, 1, 2], true); };
      events.switches[3].eventOff = function(){ this._eventObj.setLamps([0, 1, 2], false); };

      stage.addChild(hero);
      for(i=0; i<events.giants.length; i++) stage.addChild(events.giants[i]);
      for(i=0; i<events.bats.length; i++) stage.addChild(events.bats[i]);
      for(i=0; i<effects.length; i++){ stage.addChild(effects[i]);}

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

        if(events.batFlg) {
          for(var i=0; i<events.bats.length; i++){
            var bat = events.bats[i];
            if(!bat.visible && bat.wait === 0) bat.wait = Math.floor(Math.random()*24);
          }
          events.batFlg = false;
        }

        this._scroll();
        if(hero.y > map.height + (hero.height * 1)){ game.end(false); }
        if (events.isClear) {
          if ((events.clearCounter / game.fps) >= 3){ game.end(true); }
          events.clearCounter++;
        }
      });
      stage.x = game.width; stage.y = game.height;
      //stage._scroll();

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
    ,CHAR_BAT,CHAR_GIANT
  );
  // sound preload for monaca
  if(typeof(monaca) !== 'undefined'){
    monaca_sound_preload([SOUND_JUMP, SOUND_GAMEOVER, SOUND_CORRECT, SOUND_SWITCH_00, SOUND_SWITCH_01, SOUND_LAMP, SOUND_OPEN_00, SOUND_CLOSE_00, SOUND_OPEN_01, SOUND_CLOSE_01]);
  }

  game.start();

};//---

