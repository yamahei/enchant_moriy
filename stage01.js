
var MAP_DATA = "" +
  "606060606060606060606060------------------------------------60" + "\n" +
  "606060606060606060606060------------------------------------60" + "\n" +
  "606060606060606060606070--------------------F4--------------60" + "\n" +
  "6060606060606060606070--------------------------------------60" + "\n" +
  "70707070707070707070----------------F4--------------F4------60" + "\n" +
  "------------------------------6060606060----**--------------60" + "\n" +
  "----------------------------------------0F------0F----------60" + "\n" +
  "40404040404040--F5----------------------1F------1F----------60" + "\n" +
  "606060606060604040404040--------F4----------------------F4--60" + "\n" +
  "60606060606060606060606040----------------------------------60" + "\n" +
  "6060606060606060606070----------------------42--------------60" + "\n" +
  "60606060606060606070------------------------62--------------60" + "\n" +
  "607070707070707070----------6060----F4------72------F4------60" + "\n" +
  "60----------------------------------------404040------------60" + "\n" +
  "60------------------------------------------F4--------------60" + "\n" +
  "60----@0--E0----------------------4040----------------------60" + "\n" +
  "60404040404040404040404040404040406060404040404040404040404060" + "\n" +
  "60606060606060606060606060606060606060606060606060606060606060" ;



/* event object of stage 1 */
var EventStage = enchant.Class.create({
    initialize: function(_gameObj) {
      this._gameObj =_gameObj;
      this._switch = undefined; this._lamps = [];
      this.isClear = false; this.clearCounter = 0;
    },
    switch: {
      get: function()  { return this._switch; },
      set: function(v) { this._switch = v; },
    },
    lamps: { get: function(object) { return this._lamps; }},
    eventLampTouch: function(lamp){
      if (lamp.currentValue){ this.switch.setValue(false); }
      else { if(this.switch.currentValue) lamp.setValue(true); }
    },
    isLampAllON: { get: function(){
      for(var i=0; i<this._lamps.length; i++){ if(!this._lamps[i].currentValue) return false; }
      return true;
    }},
    allLampOFF: function(){
      for(var i=0; i<this._lamps.length; i++){ this._lamps[i].setValue(false); }
    },
    arrive: function(){ if(this.isLampAllON) this.isClear = true; },
    dummy: function(){}
});

var initMoriy = function() {//---
//window.onload = function() {//---

  /* init game */
  var game = new Game(GAME_WIDTH, GAME_HEIGHT);

  game.onload = function() {

      var _map = new MapDataPerser(this, MAP_DATA);
      var objects = _map.objects;
      var position = _map.monitors[0];
      var fore = _map.foreMap;
      var map = _map.backMap;
      var events = new EventStage(game);
      var message = new MutableText( 16, 16,368);
      events.message = message;
      var hero = new CharHero(game, map, _map.startX, _map.startY);
      var monitor = new SpriteMonitor(game, hero, events, position.mapX, position.mapY);
      monitor.touchEvent = function(){ this._eventObj.arrive(); };
      var effect = new CharEffect(game, map, hero, SpriteObjEffect.WarmBling);
      effect.setPosition = function(){ this.x = this._charObj.x; this.y = this._charObj.y; };

      var stage = new Group();
      stage.addChild(monitor);//clear monitor
      stage.addChild(map);//background

      for(var i=0; i<objects.length; i++){// event object
        var o = objects[i];
        var type = SpriteObjTypes.indexes[o.type];
        var setting = SpriteObjTypes[type];
        var obj = new SpriteObj(game, map, hero, {}, o.mapX, o.mapY, setting, o.default);
        switch(type){
          case "messageBoard":
            obj.eventObj = events;
            obj.eventTouch = function(){ this._eventObj.message.setText('Bright you up.'); };
            obj.eventLeave = function(){ this._eventObj.message.setText(''); };
          break;
          case "lamp":
            obj.eventObj = events;
            events.lamps.push(obj);
            obj.eventTouch = function(){ this._eventObj.eventLampTouch(this); };
            obj.eventOn = function() {
              if(this._eventObj.isLampAllON) {
                if(typeof(monaca) !== 'undefined'){
                    monaca_sound_play(SOUND_CORRECT);
                }else{
                    this._gameObj.assets[SOUND_CORRECT].clone().play();
                }
              }
            };
          break;
          case "switchCrystal":
            obj.eventObj = events;
            events.switch = obj;
            obj.eventTouch = function(){ this.setValue(true); };
            obj.eventOn  = function(){ this._eventObj.allLampOFF(); };
            obj.eventOff = function(){ this._eventObj.allLampOFF(); };
          break;
        }
        stage.addChild(obj);
      }
      stage.addChild(hero);
      stage.addChild(fore);
      stage.addChild(effect);

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
        if(hero.y > map.height + (hero.height * 2)){ game.end(false); }
        if (events.isClear) {
          if (events.clearCounter === 0){
            hero.autoMode = true;
            effect.visible = true;
          }
          if ((events.clearCounter / game.fps) >= 2){ game.end(true); }
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
    SOUND_JUMP, SOUND_GAMEOVER, SOUND_CORRECT, SOUND_SWITCH_00, SOUND_SWITCH_01, SOUND_LAMP
  );
  // sound preload for monaca
  if(typeof(monaca) !== 'undefined'){
    monaca_sound_preload([SOUND_JUMP, SOUND_GAMEOVER, SOUND_CORRECT, SOUND_SWITCH_00, SOUND_SWITCH_01, SOUND_LAMP]);
  }

  game.start();

};//---

