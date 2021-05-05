var CHAR_SAILENE = './assets/image/god_of_sailene_statue.png';
var SOUND_SAILENE_00 = './assets/sound/MetalD_at_11.mp3';

var MAP_DATA = "" +
"----------------------------------------------------------------------------------------------------------------------" + "\n" +
"--------------------------------------------------40404040--404040----------------------------------------------------" + "\n" +
"----------------------------------------------404040------*W------404040----------------------------------------------" + "\n" +
"--------------------------*Z----------------6060----------2B----------6060--------------------------------------------" + "\n" +
"--------------*Q----------------------------60--------------------------60----------------------------*E--------------" + "\n" +
"--43------0F--2B--0F------43--------------6060--------*X------*C--------60----------------43------0F--2B--0F------43--" + "\n" +
"--53------1F------1F------53--------------60----------@S------@S--------60----------------53------1F------1F------53--" + "\n" +
"--63----------------------63--------------------------02------02--------------------------63------------------E1--63--" + "\n" +
"--73--E5--------------C3--73------------60------------22------22--------60----------------73--D4------------------73--" + "\n" +
"--4040404040404040404040404040----------60------------32------32------------60----------0000404040404040404040404040--" + "\n" +
"----------------------------60----------60----------40404040404040----------60----------10----------------------------" + "\n" +
"------------*D*S*A----------60----------60--------------------------------4040404040404020----------*F*G*H------------" + "\n" +
"60------------2E------------4040404040404040----------------------------------------------------------2C------------60" + "\n" +
"60------------------------------------------------------------------------------------------------------------------60" + "\n" +
"60--C3----8586868687--------------------------------------@0--------------------------------------8586868687----D4--60" + "\n" +
"6040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404060" ;

/* manage character of status object */
var CharStatue = enchant.Class.create( SpriteChar, {
  initialize: function(_gameObj, _mapObj, mapX, mapY){
    var offsetH = 6; var offsetU = 4; var offsetB = 0;
    var startX = (mapX * _mapObj.tileWidth) - 4;
    var startY = (mapY * _mapObj.tileHeight) -16 + offsetB;
    SpriteChar.call( this,
      _gameObj, _mapObj, startX, startY, 24/* width */, 32/* height */,
      CHAR_SAILENE/* image */, offsetH, offsetU, offsetB
    );
    this.visible = true;
    this.direction = {back: 0, right: 1, fore: 2, left: 3};
    this.directions = [this.direction.back, this.direction.right, this.direction.fore, this.direction.left];
    this.currentDirection = this.direction.fore;
  },
  enterFrame: function(e){
    this.visible = true;
    this.frame = this.currentDirection * 3 + 1;
  },
  setDirection: function(d){ this.currentDirection = d;},
  back:  function(){return this.setDirection(this.direction.back); },
  right: function(){return this.setDirection(this.direction.right); },
  fore:  function(){return this.setDirection(this.direction.fore); },
  left:  function(){return this.setDirection(this.direction.left); },
  isBack:  function(){return (this.currentDirection == this.direction.back); },
  isRight: function(){return (this.currentDirection == this.direction.right); },
  isFore:  function(){return (this.currentDirection == this.direction.fore); },
  isLeft:  function(){return (this.currentDirection == this.direction.left); },
  turn: function(d){
    this.currentDirection = (this.currentDirection + d + this.directions.length) % this.directions.length;
  },
  dummy: function(){}
});



/* event object of stage */
var EventStage = enchant.Class.create({
    initialize: function(_gameObj) {
      this._gameObj =_gameObj;
      this.isClear = false; this.clearCounter = 0;
      this.message = undefined; this.collision = undefined;
      this.doors = []; this.statues = []; this.effect = undefined;
      this.blockX = {Z: 0, X: 0, C: 0};
      this.blockY = {Z: 0, X: 0, C: 0};
      this.evented = {}; this.footPrints = [];
    },
    getTouch: function(key){
      if(this.evented[key]) return;
      var d0; var d1;
      switch(key){
        case "Q": d0 = "left";  d1 = "left";  break;
        case "W": d0 = "right"; d1 = "left";  break;
        case "E": d0 = "right"; d1 = "right"; break;
        default: return;
      }
      var f0 = (this.statues[0].currentDirection == this.statues[0].direction[d0]);
      var f1 = (this.statues[1].currentDirection == this.statues[1].direction[d1]);
      if(f0 && f1){
        this.evented[key] = true;
        switch(key){
          case "Q":
            this.breakWall("Z", false, 4);
          break;
          case "W":
            this.isClear = true;
          break;
          case "E":
            this.breakWall("X", true, 3);
            this.breakWall("C", true, 3);
          break;
        }
        this.effect.visibleCounter = Math.floor(this._gameObj.fps * 1.5);
      }
    },
    breakWall: function(key, isWall, length){
      var x = this.blockX[key]; var y = this.blockY[key];
      for(var i=0; i<length; i++){ this.collision[y + i][x] = (isWall ? 1 : 0); }
    },
    getOver: function(key){
      if(this.footPrints.length > 0){
        if(this.footPrints[this.footPrints.length - 1] == key) this.footPrints.pop();
      }
      this.footPrints.push(key);
      while(this.footPrints.length > 3) { this.footPrints.shift(); }
      switch(this.footPrints.join("")){
        case "ASD":
          if(typeof(monaca) !== 'undefined'){
              monaca_sound_play(SOUND_SAILENE_00);
          }else{
              this._gameObj.assets[SOUND_SAILENE_00].clone().play();
          }
          this.statues[0].turn(-1); this.statues[1].turn(-2);
          this.footPrints.push(" ");
        break;
        case "FGH":
          if(typeof(monaca) !== 'undefined'){
              monaca_sound_play(SOUND_SAILENE_00);
          }else{
              this._gameObj.assets[SOUND_SAILENE_00].clone().play();
          }
          this.statues[0].turn( 2); this.statues[1].turn( 1);
          this.footPrints.push(" ");
        break;
      }
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
      //var enemies = _map.chars;
      var events = new EventStage(game);
      events.collision = _map._collisionMap;
      var message = new MutableText( 16, 16,368);
      events.message = message;
      var hero = new CharHero(game, map, _map.startX, _map.startY);

      var stage = new Group();

      var i;
      var monitors = _map.monitors;
      for(i=0; i<monitors.length; i++){
        var position = monitors[i];
        var monitor; var x = 0; var y = 0;
        switch(position.key){
          case "Q": case "W": case "E":
            monitor = new SpriteMonitor(game, hero, events, position.mapX, position.mapY + 1);
            monitor.key = position.key;
            monitor.touchEvent = function(){ this._eventObj.getTouch(this.key); };
          break;
          case "Z": case "X": case "C":
            events.blockX[position.key] = position.mapX;
            events.blockY[position.key] = position.mapY + 2;
          break;
          case "A": case "S": case "D": case "F": case "G": case "H":
            monitor = new SpriteMonitor(game, hero, events, position.mapX, position.mapY);
            monitor.key = position.key;
            monitor.touchEvent = function(){ this._eventObj.getOver(this.key); };
          break;
        }
        if(monitor) stage.addChild(monitor);//
      }


      stage.addChild(map);//background

      var objects = _map.objects;
      for(i=0; i<objects.length; i++){// event object
        var o = objects[i];
        var type = SpriteObjTypes.indexes[o.type];
        var settinge = SpriteObjTypes[type];
        var obje = new SpriteObj(game, map, hero, {}, o.mapX, o.mapY, settinge, o.default);
        obje._eventObj = events;
        switch(type){
          case "messageBoard":
            obje.eventTouch = function(){ this._eventObj.message.setText('Holy eyes take you to the over the dimension.'); };
            obje.eventLeave = function(){ this._eventObj.message.setText(''); };
          break;
          case "switchUD":
            events.switchUD = obje;
            obje.eventTouch = function(){ this.switchValue(); };
            obje.eventOn = function(){ if(!events.doors[1].isOpen) events.doors[1].open(); };
            obje.eventOff = function(){ if(events.doors[1].isOpen) events.doors[1].close(); };
          break;
        }
        stage.addChild(obje);
      }


      var doorpair = {};
      var doors = _map.doors;
      for(i=0; i<doors.length; i++){// door object
        var d = doors[i];
        var typed = SpriteObjDoors.indexes[d.type];
        var settingd = SpriteObjDoors[typed];
        var objd = new SpriteDoor(game, map, hero, events, d.mapX, d.mapY, settingd, d.isOpen);
        if ( doorpair[d.type] === undefined ) { doorpair[d.type] = objd; }
        else {
          var pair = doorpair[d.type];
          objd.setPair(pair);
          objd.eventTouch = function(){ if(this.isOpen) this.into(); };
          pair.eventTouch = function(){ if(this.isOpen) this.into(); };
        }
        events.doors.push(objd);
        stage.addChild(objd);
      }

      var enemies = _map.chars;
      for(i=0; i<enemies.length; i++){
        enemy = enemies[i];
        statue = new CharStatue(game, map, enemy.mapX, enemy.mapY);
        events.statues.push(statue);
        stage.addChild(statue);
      }
      events.statues[0].right();
      events.statues[1].left();

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
    , CHAR_SAILENE, SOUND_SAILENE_00 /*, CHAR_CHIKEN, SOUND_CHIKEN_00, CHAR_EAGLE, SOUND_EAGLE_00,CHAR_BAT,CHAR_GIANT */
  );
  // sound preload for monaca
  if(typeof(monaca) !== 'undefined'){
    monaca_sound_preload([SOUND_JUMP, SOUND_GAMEOVER, SOUND_CORRECT, SOUND_SWITCH_00, SOUND_SWITCH_01, SOUND_LAMP, SOUND_OPEN_00, SOUND_CLOSE_00, SOUND_OPEN_01, SOUND_CLOSE_01, SOUND_SAILENE_00]);
  }

  game.start();

};//---

