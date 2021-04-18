
var CHAR_DARK = 'god_of_what_dark.png';
var CHAR_BRIGHT = 'god_of_what_bright.png';

var MAP_DATA = "" + 
"404040404040404040404040404040----------4040--404040404040404040404040------40404040404040404040404040404040" + "\n" + 
"60*B------------------------------------------------@D--------------60------60----------------------------60" + "\n" + 
"60------------------------------------40----------------------------60------60----------------------------60" + "\n" + 
"60----------------E4------------------60----------------------------60------20----------F4--------2D------60" + "\n" + 
"60------------------------------------60----------------------------60------------------------------------60" + "\n" + 
"60----------------------------40------60----------------------------4040----------------------------------60" + "\n" + 
"60----------------------------60------60--------*0--------*1--------60----------------------------*T------60" + "\n" + 
"60404040404040404040404040404040----4040----------------------------60------40404040404040404040404040404040" + "\n" + 
"60----------------------------60------60----------------------------70------60----------------------------60" + "\n" + 
"60----------------------------60------60----------*C----------------20----4040----------------------------60" + "\n" + 
"70----------E4----------------4040----60--*2--------0B0C--------*3--20------20----------------F4----------60" + "\n" + 
"------------------------------60------60------------1B1C------------20------------------------------------60" + "\n" + 
"60----------------------------60----7070----------------------------4040----------------------------------60" + "\n" + 
"------------------------------60------20----------------------------60------------E0--E0--E0--E0------F5--60" + "\n" + 
"----60--404040404040404040404040------20--------*4--------*5--------60------40404040404040404040404040404040" + "\n" + 
"------------------------------60------20----------------------------70------60----------------------------60" + "\n" + 
"60----------------------------70----4040------------------------------------60----------------------------60" + "\n" + 
"------------------E4----------20------60----------------------------------4040----------F4----------------60" + "\n" + 
"60E1--------------------------20------60------------------------------------------------------------------60" + "\n" + 
"------------------------------4040----60--------------------------------------------------------------------" + "\n" + 
"------------------------------60------60----------------------------4040------------------------@0----F5----" + "\n" + 
"------56--4040404040404040404040------404040404040404040404040404040606040--40404040404040404040404040404040" ;

/* manage character of dark object */
var CharDark = enchant.Class.create( SpriteChar, {
  initialize: function(_gameObj, _mapObj, mapX, mapY){
    this.offsetH = 1; var offsetU = 4; this.offsetB = 0;
    var startX = (mapX * _mapObj.tileWidth) - 4;
    var startY = (mapY * _mapObj.tileHeight) -16 + this.offsetB;
    SpriteChar.call( this, 
      _gameObj, _mapObj, startX, startY, 24/* width */, 32/* height */,
      CHAR_DARK/* image */, this.offsetH, offsetU, this.offsetB
    );
    this.event = undefined; this.hero = undefined; this.bright = undefined;
    this.states = { fall: 1, lift: 2, walk: 3, flash: 4 };
    this.state = this.states.fall;
    this.speedY = 0; this.grounding = false;
    this.targetPoint = 0;
    this.a = new Anime();
    this.a.setAction(this.a.jump); this.a.setDirection(this.a.back);
  },
  fall: {
    get: function(){ return (this.state == this.states.fall); },
    set: function(v){ if(v) this.state = this.states.fall; }
  },
  lift: {
    get: function(){ return (this.state == this.states.lift); },
    set: function(v){ if(v) this.state = this.states.lift; }
  },
  walk: {
    get: function(){ return (this.state == this.states.walk); },
    set: function(v){ if(v) this.state = this.states.walk; }
  },
  flash: {
    get: function(){ return (this.state == this.states.flash); },
    set: function(v){ if(v) this.state = this.states.flash; }
  },
  enterFrame: function(e){
    var game = enchant.Game.instance; 
    var tileW = this._mapObj.tileWidth; var tileH = this._mapObj.tileHeight;
    var targetIndex = this.event.darkTriangles[this.targetPoint];
    var pairIndex = this.event.getTargetsPair(targetIndex);
    var targetAnchor = this.event.triangles[targetIndex];
    var targetLamp = this.event.lamps[targetIndex];
    var pairLamp = this.event.lamps[pairIndex];
    var targetX = (targetAnchor.mapX * tileW) - 4;
    var targetY = (targetAnchor.mapY * tileH) -16;
    var maxSpeed = 12; this.speedX = 0;
    this.event.darkFlashing = (this.flash);
    
    if(this.fall){
      var protY = 0; 
      if (!this.grounding) this.speedY += (this.speedY < tileH) ? 1 : 0;
      protY = this.hitTestY(this.hitLX, this.hitRX, this.hitBY + this.speedY, tileW, tileH);
      this.y += (this.speedY - protY);
      this.grounding = (this.hitTestY(this.hitLX, this.hitRX, this.hitBY + 1, tileW, tileH) !== 0);
      if (this.grounding){
        this.speedY = 0;
        this.targetPoint = this.event.getNextTargetPoint(this.targetPoint);
        this.walk = true;
      }
      this.a.setAction(this.a.jump);
      this.a.setDirection(this.a.back);
    } else if(this.walk){
      this.a.setAction(this.a.walk);
      if(this.x == targetX){
        this.a.setDirection(this.a.fore);
        if(!targetLamp.currentValue){ this.lift = true; }
        else{ this.targetPoint = this.event.getNextTargetPoint(this.targetPoint); }
      }
      else if(this.x < targetX){ this.speedX = 1; this.a.setDirection(this.a.right); }
      else if(this.x > targetX){ this.speedX =-1; this.a.setDirection(this.a.left); }
      this.x += this.speedX;
    } else if(this.lift){
      this.speedY -= (this.speedY > -tileH) ? 1 : 0;
      if(this.y + this.speedY <= targetY && targetY <= this.y){
        this.y = targetY; this.speedY = 0;
        if(pairLamp.currentValue) { this.flash = true; }
        else { this.fall = true; }
      }
      else{ this.y += this.speedY; }
      this.a.setAction(this.a.jump);
      this.a.setDirection(this.a.fore);
    } else if(this.flash){
      this.x = targetX; this.y = targetY;
      if(this.event.isHitCore) {
        var pairAnchor = this.event.triangles[pairIndex];
        this.bright.x = (pairAnchor.mapX * tileW) - 4 - this.offsetH;
        this.bright.y = (pairAnchor.mapY * tileH) -16 + this.offsetB;
        this.bright.visible = true;
      }else{
        this.bright.visible = false;
      }
      if(!targetLamp.currentValue && pairLamp.currentValue){
        this.targetPoint = this.event.getNextTargetPoint(this.targetPoint);
      }else{
        this.fall = true;
      }
      this.a.setAction(this.a.stand);
      this.a.setDirection(this.a.fore);
    }
    this.frame = this.a.getNumber();
    this.bright.frame = this.frame;
    
    var forceBy = [this]; if(this.event.isHitCore) forceBy.push(this.bright);
    var forceVol = [this.event.countLampIsOff()]; if(this.event.isHitCore) forceVol.push(6 - forceVol[0]);
    while(forceBy.length > 0){
      var god = forceBy.shift(); var power = forceVol.shift() * 0.8;
      var distH = Math.pow(god.x - this.hero.x, 2);
      var distV = Math.pow(god.y - this.hero.y, 2);
      var dist = Math.sqrt(distH + distV);
      var effect = Math.sqrt(Math.pow(power * tileW, 2) + Math.pow(power * tileH, 2));
      if(effect - dist > 0){
        this.hero.speedX += Math.round((this.hero.x - god.x)/tileW) + god.speedX;
        this.hero.speedY += Math.round((this.hero.y - god.y)/tileH) + god.speedY;
        this.hero.jumpCancelable = false;
      }
    }
    
  },
  dummy: function(){}
});
/* event object of stage */
var EventStage = enchant.Class.create({
    initialize: function(_gameObj) {
      this._gameObj =_gameObj;
      this.isClear = false; this.clearCounter = 0;
      this.message = undefined;
      this.triangles = []; this.darkTriangles = [1,2,5]; this.darkFlashing = false;
      this.lamps = []; this.isHitCore = false;
      this.switchCrystals = []; this.bbsHintLamp1 = undefined;
      this.answerLamp1 = this.makeAnswerLamp1(); 
      this.recordLamp1 = [];
    },
    checkCollect: function(playSound){
      var state = [true,false,false,true,true,false];
      for(var i=0; i< this.lamps.length; i++){ if(this.lamps[i].currentValue != state[i]) return false; }
      if(playSound) {
        if(typeof(monaca) !== 'undefined'){
            monaca_sound_play(SOUND_CORRECT);
        }else{
            this._gameObj.assets[SOUND_CORRECT].clone().play();
        }
      }
      return true;
    },
    getNextTargetPoint: function(currentTargetPosition){
      return (currentTargetPosition + 1) % this.darkTriangles.length;
    },
    getTargetsPair: function(currentTargetPosition){
      return {1: 4, 2: 3, 5: 0}[currentTargetPosition];
    },
    checkLamp1: function(cristal){
      this.recordLamp1.push(cristal.currentValue ? cristal.lowHint : cristal.capHint);
      while(this.recordLamp1.length > this.answerLamp1.length){ this.recordLamp1.shift(); }
      this.lamps[3].setValue((this.recordLamp1.join("") == this.answerLamp1));
    },
    countLampIsOff: function(){
      var count = this.lamps.length;
      for(var i=0; i<this.lamps.length; i++){ if(this.lamps[i].currentValue) count--; }
      return count;
    },
    hintLamp1: function(){ return "Lighting key: " + this.answerLamp1.split("").join("-"); },
    makeAnswerLamp1: function(){
      // make answer of lamp1
      var game = enchant.Game.instance; var temp = [];
      var translate= {}; var dictionary = "LlAaMmPp".split("");
      var r = dictionary.length + ((new Date()).getMilliseconds() % 7);
      while(dictionary.length > 0){
        var caps = dictionary.shift(); var lower = dictionary.shift();
        translate[caps] = lower; translate[lower] = caps;
      }
      var _answer = "lamp".split("");
      for(var i=0; i<r; i++){
        for(var j=0; j<_answer.length; j++){
          var h = _answer.shift();
          switch(Math.floor(Math.random() * 32) % 4){
            case 0: temp.push(translate[h]); break;
            case 1: _answer.push(h); break;
            case 2: temp.unshift(translate[h]);break;
            case 3: _answer.push(translate[h]); break;
          }
        }
        while(temp.length > 0){ _answer.push(temp.shift()); }
      }
      var answer = _answer.join("");
      return (answer=="lamp") ? this.makeAnswerLamp1() : answer;
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
      //var enemies = _map.chars;
      var events = new EventStage(game);
      events.message = new MutableText( 16, 16,368);
      var hero = new CharHero(game, map, _map.startX, _map.startY);
      var coreCenter = {x: 0, y: 0};

      var stage = new Group();
      
      var i;
      var monitors = _map.monitors;
      for(i=0; i<monitors.length; i++){
        var position = monitors[i];
        var monitor = new SpriteMonitor(game, hero, events, position.mapX, position.mapY);
        monitor.key = position.key;
        switch(position.key){
          case "0": case "3": case "4"://to on
          case "1": case "2": case "5"://to off
            events.triangles.push(monitor);
          break;
          case "B"://behind
            monitor.frameEvent = function(){
              var isTouch = (this.mapX == hero.mapX && /* this.mapY */ -1 == hero.mapY);
              if(this._prevState != isTouch){
                this._prevState = !this._prevState;
                if(isTouch) events.lamps[0].switchValue();
              }
            };
          break;
          case "T"://timer
            monitor.touchEvent = function(){
              var game = enchant.Game.instance;
              this._startFrame = game.frame;
            };
            monitor.leaveEvent = function(){ this._startFrame = undefined; };
            monitor.frameEvent = function(){
              var game = enchant.Game.instance;
              if(this._startFrame && (game.frame - this._startFrame > (6 * game.fps))){
                events.lamps[1].switchValue();
                this._startFrame = undefined;
              }
            };
          break;
          case "C": //core
            monitor.frameEvent = function(){
              var tileW = map.tileWidth; var tileH = map.tileHeight;
              var lx = this.x + tileW; var uy = this.y + tileH;
              var rx = lx - 1 + tileW * 2; var by = uy - 1 + tileH * 2;
              coreCenter.x = Math.floor((lx + rx) / 2) - 12;
              coreCenter.y = Math.floor((uy + by) / 2) - 16;
              if((lx < hero.hitRX) && (rx > hero.hitLX)  && (uy < hero.hitBY) && (by > hero.hitUY)){
                events.isHitCore = true;
                events.isClear = (events.checkCollect(false) && events.darkFlashing);
              } else {
                events.isHitCore = false;
                events.isClear = false;
                events.clearCounter = 0;
              }
            };
          break;
        }
        stage.addChild(monitor);
      }

      
      stage.addChild(map);//background

      var objects = _map.objects;
      var lampHints = "LlAaMmPp".split("");
      for(i=0; i<objects.length; i++){// event object
        var o = objects[i];
        var type = SpriteObjTypes.indexes[o.type];
        var setting = SpriteObjTypes[type];
        var obj = new SpriteObj(game, map, hero, {}, o.mapX, o.mapY, setting, o.default);
        obj._eventObj = events;
        switch(type){
          case "messageBoard": 
            if(!events.bbsHintLamp1){
              events.bbsHintLamp1 = obj;
              obj.eventTouch = function(){ events.message.setText(events.hintLamp1()); };
            }else{
              obj.eventTouch = function(){
                events.message.setText('Two triangle will make the world stabilized.');
              };
            }
            obj.eventLeave = function(){ events.message.setText(''); };
          break;
          case "switchUD":
            events.switchUD = obj;
            obj.eventTouch = function(){ this.switchValue(); };
            obj.eventOn = function(){ events.lamps[4].setValue(true); };
            obj.eventOff = function(){ events.lamps[4].setValue(false); };
          break;
          case "lamp":
            obj.eventObj = events;
            events.lamps.push(obj);
            obj.eventOn  = function() { events.checkCollect(true); };
            obj.eventOff = function() { events.checkCollect(true); };
          break;
          case "switchCrystal":
            obj.eventObj = events;
            obj.capHint = lampHints.shift();
            obj.lowHint = lampHints.shift();
            events.switchCrystals.push(obj);
            obj.eventTouch = function(){this.switchValue(); };
            obj.eventOn  = function(){ events.checkLamp1(this); };
            obj.eventOff = function(){ events.checkLamp1(this); };
          break;
        }
        stage.addChild(obj);
      }
      events.lamps[5].eventTouch = function(){this.switchValue(); };

      
      var bright = new Sprite(24, 32);
      bright.image = game.assets[CHAR_BRIGHT];
      bright.frame = 7; bright.visible = false;
      bright.speedX = 0; bright.speedY = 0;
      var enemies = _map.chars;
      for(i=0; i<enemies.length; i++){
        enemy = enemies[i];
        dark = new CharDark(game, map, enemy.mapX, enemy.mapY);
        dark.event = events;
        dark.hero = hero;
        dark.bright = bright;
        stage.addChild(dark);
        stage.addChild(bright);
      }
      

      stage.addChild(hero);
      var effect = new CharEffect(game, map, hero, SpriteObjEffect.ColdBling);
      events.effect = effect; effect.visibleCounter = 0;
      effect.setPosition = function(){
        this.x = this._charObj.x; this.y = this._charObj.y;
        this.visible = (this.visibleCounter > 0);
        this.visibleCounter -= (this.visible ? 1 : 0);
      };
      effect.visible = false;
      stage.addChild(effect);

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
          hero.autoMode = true;//
          if ((events.clearCounter / game.fps) >= 5){ game.end(true); }
          events.clearCounter++;
          if(coreCenter.x > hero.x) hero.speedX += 1;
          if(coreCenter.x < hero.x) hero.speedX -= 1;
          if(coreCenter.y > hero.y) hero.speedY += 1;
          if(coreCenter.y < hero.y) hero.speedY -= 3;
        } else { hero.autoMode = false; }
      });
      stage.x = game.width; stage.y = game.height;

      game.rootScene.addChild(stage);
      game.rootScene.addChild(events.message);

      game.rootScene.addChild(new MyPadLRU(0, game.height - 84));

      game.rootScene.backgroundColor = 'rgb( 2, 8,16)';
      
  };

  game.end = GameFinalAction;//override to hack
  game.fps = 12;
  game.preload(
    PAD_IMG_LRU, /*PAD_IMG_LR, PAD_IMG_UP,*/ CHAR_DOOR,
    START_IMG, CLEAR_IMG, OVER_IMG, DUMMY_IMG, CHAR_HERO, MAP_LIKE_OBJ, MAP_TILE, CHAR_EFFECT,
    'jump.wav', 'gameover.wav', SOUND_CORRECT, SOUND_SWITCH_00, SOUND_SWITCH_01, SOUND_LAMP, SOUND_OPEN_00, SOUND_CLOSE_00, SOUND_OPEN_01, SOUND_CLOSE_01
    /* this stage only ? */
    , CHAR_DARK, CHAR_BRIGHT /*, CHAR_SAILENE, SOUND_SAILENE_00 , CHAR_CHIKEN, SOUND_CHIKEN_00, CHAR_EAGLE, SOUND_EAGLE_00,CHAR_BAT,CHAR_GIANT */
  );
  // sound preload for monaca
  if(typeof(monaca) !== 'undefined'){
    monaca_sound_preload(['jump.wav', 'gameover.wav', SOUND_CORRECT, SOUND_SWITCH_00, SOUND_SWITCH_01, SOUND_LAMP, SOUND_OPEN_00, SOUND_CLOSE_00, SOUND_OPEN_01, SOUND_CLOSE_01]);
  }

  game.start();
    
};//---

