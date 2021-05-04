//var CHAR_BAT = 'monster_bat_darkgreen.png';
//var CHAR_GIANT = 'monster_giant_blue.png';
//var CHAR_CHIKEN = 'char_chiken_white.png';
//var CHAR_EAGLE = 'char_eagle_brown.png';
//var SOUND_CHIKEN_00 = 'CockM_at_11.mp3';
//var SOUND_EAGLE_00 = 'ClothD_at_16.mp3';
//var CHAR_SAILENE = 'god_of_sailene_statue.png';
//var SOUND_SAILENE_00 = 'MetalD_at_11.mp3';
//var CHAR_DARK = 'god_of_what_dark.png';
//var CHAR_BRIGHT = 'god_of_what_bright.png';

var MAP_DATA = "" +
"--------------------------------------------------------------------------@0----------------------------------------------------" + "\n" +
"30303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030" + "\n" +
//"--------------------------------------------------------------------------------------------------------------------------------" + "\n" +
//"--------------------------------------------------------------------------------------------------------------------------------" + "\n" +
//"--506060606060----60606060----5060606060------60606060----506060606060----60606060----506060606060--506060606060--5060606060----" + "\n" +
//"--6060--------------6060------6060----6060--6060------60------6060------6060------60--6060----------6060----------6060----6060--" + "\n" +
//"--6060--------------6060------6060----6060--60606060----------6060------60606060------6060606060----6060606060----6060----6060--" + "\n" +
//"--606060606060------6060------60606060------------606060------6060------------606060--6060----------6060----------6060----6060--" + "\n" +
//"--6060--------------6060------6060--6060----6060----6060------6060------6060----6060--6060----------6060----------6060--6060----" + "\n" +
//"--6060------------60606060----6060----6060----60606060--------6060--------60606060----606060606060--606060606060--60606060------" + "\n" +
//"--------------------------------------------------------------------------------------------------------------------------------" + "\n" +
//"--0F--------0F--506060606060--5060----6060----60606060----5060----6060----60606060----5060----6060--506060606060--0F--------0F--" + "\n" +
//"--1F--------1F--6060----------6060----6060--6060----6060--6060----6060--6060----6060--6060----6060------6060------1F--------1F--" + "\n" +
//"------0B0C------6060606060----606060--6060--6060----------6060----6060--6060----6060--606060--6060------6060----------0D0E------" + "\n" +
//"------1B1C------6060----------606060606060--6060----------606060606060--606060606060--606060606060------6060----------1D1E------" + "\n" +
//"----------------6060----------6060--606060--6060----6060--6060----6060--6060----6060--6060--606060------6060--------------------" + "\n" +
//"----------------606060606060--6060----6060----60606060----6060----6060--6060----6060--6060----6060------6060--------------------" + "\n" +
//"--------------------------------------------------------------------------------------------------------------------------------" + "\n" +
//"--------------------------------------------------------------------------------------------------------------------------------" + "\n" +
//"40404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040" + "\n" +
"--------------------------------------------------------------------------------------------------------------------------------" + "\n" +
"30303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030" + "\n" +
"01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101" + "\n" +
"21212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121" + "\n" +
"21212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121" + "\n" +
"21212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121" + "\n" +
"21212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121" + "\n" +
"21212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121" + "\n" +
"21212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121" + "\n" +
"21212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121" + "\n" +
"21212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121" + "\n" +
"21212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121" + "\n" +
"21212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121" + "\n" +
"21212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121" + "\n" +
"21212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121" + "\n" +
"21212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121" + "\n" +
"21212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121" + "\n" +
"21212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121" + "\n" +
"31313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131" + "\n" +
"40404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040" ;


/* event object of stage */
var EventStage = enchant.Class.create({
    initialize: function(_gameObj) {
      this._gameObj =_gameObj;
      this.isClear = false; this.clearCounter = 0;
      this.message = undefined;
      this.map = undefined; this.lamp = undefined;
      this.hero = undefined; this.booCounter = 0;
    },
    goDownStairs: function(){ this.hero.y += 16 * this.map.tileHeight; },
    dummy: function(){}
});

var initMoriy = function() {//---
//window.onload = function() {//---

  /* init game */
  var game = Game(GAME_WIDTH, GAME_HEIGHT);//new Game(1600, 800);//

  game.onload = function() {

      var _map = new MapDataPerser(this, MAP_DATA);
      var fore = _map.foreMap;
      var map = _map.backMap;
      var events = new EventStage(game);
      events.map = map;
      events.message = new MutableText( 16, 16,368);
      var hero = new CharHero(game, map, _map.startX, _map.startY);
      events.hero = hero;

      var stage = new Group();


      var monitors = _map.monitors;
      var dooTemp = undefined; var booTemp = undefined; var checkTemp = undefined;
      for(var i=0; i<monitors.length; i++){
        var position = monitors[i];
        var monitor = new SpriteMonitor(game, hero, events, position.mapX, position.mapY);
        monitor.key = position.key;
        monitor.hitTest = function(char, hitLX, hitUY, hitRX, hitBY) {
          return ( (hitLX < char.hitRX) && (hitRX > char.hitLX)
           && (hitUY < char.hitBY) && (hitBY > char.hitUY)
          );
        };
        switch(position.key){
          case "d": dooTemp = monitor; break;
          case "D"://monitor
            monitor.pair = dooTemp;
            monitor.frameEvent = function(){
              this.prevHit = this.currentHit;
              this.currentHit = this.hitTest(hero, this.pair.hitLX, this.pair.hitUY, this.hitRX, this.hitBY);
              if(!this.prevHit && this.currentHit) events.goDownStairs();
            };
          break;
          case "b": booTemp = monitor; break;
          case "B"://monitor
            monitor.pair = booTemp;
            monitor.frameEvent = function(){
              this.prevHit = this.currentHit;
              this.currentHit = this.hitTest(hero, this.pair.hitLX, this.pair.hitUY, this.hitRX, this.hitBY);
              if(!this.prevHit && this.currentHit) events.booCounter++;
            };
          break;
          case "c": checkTemp = monitor; break;
          case "C"://monitor
            monitor.pair = checkTemp;
            monitor.frameEvent = function(){
              this.prevHit = this.currentHit;
              this.currentHit = this.hitTest(hero, this.pair.hitLX, this.pair.hitUY, this.hitRX, this.hitBY);
              if(!this.prevHit && this.currentHit){
                if(events.booCounter-- > 0) events.goDownStairs();
              }
            };
          break;
        }
        stage.addChild(monitor);
      }


      stage.addChild(map);//background

      var objects = _map.objects;
      for(var i=0; i<objects.length; i++){// event object
        var o = objects[i];
        var type = SpriteObjTypes.indexes[o.type];
        var setting = SpriteObjTypes[type];
        var obj = new SpriteObj(game, map, hero, {}, o.mapX, o.mapY, setting, o.default);
        obj._eventObj = events;
        switch(type){
          case "messageBoard":
            obj.eventTouch = function(){ events.message.setText('Up up up!'); };
            obj.eventLeave = function(){ events.message.setText(''); };
          break;
          case "lamp":
            events.lamp = obj;
            obj.eventOn  = function(){
              if(typeof(monaca) !== 'undefined'){
                  monaca_sound_play(SOUND_CORRECT);
              }else{
                  this._gameObj.assets[SOUND_CORRECT].clone().play();
              }
            };
          break;
          case "switchUD":
            obj.eventTouch = function(){ this.switchValue(); };
            obj.eventOn  = function(){ events.lamp.setValue(true); };
            obj.eventOff = function(){ events.lamp.setValue(false); };
          break;
          case "boxOche":
            obj.eventTouch = function(){ if(events.lamp.currentValue) this.setValue(true); };
            obj.eventOn  = function(){ events.isClear = true; };
          break;
        }
        stage.addChild(obj);
      }

      stage.addChild(hero);

      stage.addChild(fore);

      stage._scroll = function(){
        this.x = (game.width + hero.width) / 2 - hero.x;
        if (this.x > 0) { this.x = 0; }
        if (this.x < game.width - map.width) { this.x = game.width - map.width; }
        this.y = (game.height + hero.height) / 2 - hero.y;
        if (this.y < game.height - map.height - 64) { this.y = game.height - map.height - 64; }
      }
      stage.addEventListener('enterframe', function(e) {
        this._scroll();
        if(hero.y > map.height + (hero.height * 3)){ game.end(false); }
        if (events.isClear) {
          hero.autoMode = true;//
          if ((events.clearCounter / game.fps) >= 1.5){ game.end(true); }
          events.clearCounter++;
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
    SOUND_JUMP, SOUND_GAMEOVER, SOUND_CORRECT, SOUND_SWITCH_00, SOUND_SWITCH_01, SOUND_LAMP, SOUND_OPEN_00, SOUND_CLOSE_00, SOUND_OPEN_01, SOUND_CLOSE_01
  );
  // sound preload for monaca
  if(typeof(monaca) !== 'undefined'){
    monaca_sound_preload([SOUND_JUMP, SOUND_GAMEOVER, SOUND_CORRECT, SOUND_SWITCH_00, SOUND_SWITCH_01, SOUND_LAMP, SOUND_OPEN_00, SOUND_CLOSE_00, SOUND_OPEN_01, SOUND_CLOSE_01]);
  }

  game.start();

};//---

