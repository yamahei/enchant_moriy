var MAP_DATA = "" +
"--------------------------E4--------------------------------------------------------" + "\n" +
"------------------------------------------------------------------------------------" + "\n" +
"------------------------------------------------------------------------------------" + "\n" +
"--------------------------EA--------------------------------------------------------" + "\n" +
"------------414141414141414141414141414141414141414141414101010101010101010101010101" + "\n" +
"*c----------616161616161616161616161616161616161616161616121212121212121212121212121" + "\n" +
"4141--------616161616161616161616161616161616161616161616121212121212121212121212121" + "\n" +
"------------717171717171717171717171717171717171717171717131313131313131313131313131" + "\n" +
"------------------*d----------------------------------------------------------------" + "\n" +
"----4141--------0F------------------------------------------------0F----------------" + "\n" +
"----------------1F------------------------------------------------1F----------------" + "\n" +
"----------*C----------------------------------------------------*D------------------" + "\n" +
"010141414141414141414141414141414141414141414141414141414141414141414141*c----------" + "\n" +
"212121212121212121212121212121212121212121212121212121212121212121212121------------" + "\n" +
"212121212121212121212121212121212121212121212121212121212121212121212121--------4141" + "\n" +
"717171717171717171717171717171717171717171717171717171717171717171717171------------" + "\n" +
"------------------*d----------------------------------------------------------------" + "\n" +
"----------------0F------------------------------------------------0F--------4141----" + "\n" +
"----------------1F------------------------------------------------1F----------------" + "\n" +
"----------------------------------------------------------------*D----------------*C" + "\n" +
"*c----------414141414141414141414141414141414141414141414141414141414141414141410101" + "\n" +
"------------212121212121212121212121212121212121212121212121212121212121212121212121" + "\n" +
"4141--------212121212121212121212121212121212121212121212121212121212121212121212121" + "\n" +
"------------717171717171717171717171717171717171717171717171717171717171717171717171" + "\n" +
"------------------*d----------------------------------------------------------------" + "\n" +
"----4141--------0F------------------------------------------------0F----------------" + "\n" +
"----------------1F------------------------------------------------1F----------------" + "\n" +
"----------*C----------------------------------------------------*D------------------" + "\n" +
"010141414141414141414141414141414141414141414141414141414141414141414141------------" + "\n" +
"212121212121212121212121212121212121212121212121212121212121212121212121------------" + "\n" +
"212121212121212121212121212121212121212121212121212121212121212121212121--------4141" + "\n" +
"717171717171717171717171717171717171717171717171717171717171717171717171------------" + "\n" +
"------------------*b----------------------------------------------------------------" + "\n" +
"----------------0F------------------------------------------------0F--------4141----" + "\n" +
"----------------1F------------------------------------------------1F--@0------------" + "\n" +
"----------------------------------------------------------------*B------------------" + "\n" +
"------------414141414141414141414141414141414141414141414141414141414141414141410101" + "\n" +
"------------212121212121212121212121212121212121212121212121212121212121212121212121" + "\n" +
"4141--------212121212121212121212121212121212121212121212121212121212121212121212121" + "\n" +
"------------717171717171717171717171717171717171717171717171717171717171717171717171" + "\n" +
"------------------*b----------------------------------------------------------------" + "\n" +
"----4141--------0F------------------------------------------------0F----------------" + "\n" +
"----------------1F------------------------------------------------1F----------------" + "\n" +
"----------------------------------------------------------------*B------------------" + "\n" +
"010141414141414141414141414141414141414141414141414141414141414141414141------------" + "\n" +
"212121212121212121212121212121212121212121212121212121212121212121212121------------" + "\n" +
"212121212121212121212121212121212121212121212121212121212121212121212121--------4141" + "\n" +
"717171713131317171717171717171717171717171717171717171717171717171717171------------" + "\n" +
"----------E1----------------------------------------------------------------E5------" + "\n" +
"----------------0F------------------------------------------------0F--------4141----" + "\n" +
"--------414141--1F------------------------------------------------1F----------------" + "\n" +
"------------------------------------------------------------------------------------" ;


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
  var game = new Game(GAME_WIDTH, GAME_HEIGHT);

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
      var dooTemp; var booTemp; var checkTemp;
      var i;
      for(i=0; i<monitors.length; i++){
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
      for(i=0; i<objects.length; i++){// event object
        var o = objects[i];
        var type = SpriteObjTypes.indexes[o.type];
        var setting = SpriteObjTypes[type];
        var obj = new SpriteObj(game, map, hero, {}, o.mapX, o.mapY, setting, o.default);
        obj._eventObj = events;
        switch(type){
          case "messageBoard":
            obj.eventTouch = function(){ events.message.setText('Up up up! '); };
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
        //if (this.y > 0) { this.y = 0; }
        if (this.y < game.height - map.height - 64) { this.y = game.height - map.height - 64; }
      };
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

