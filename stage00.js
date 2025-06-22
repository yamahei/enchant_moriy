
var MAP_DATA = "" +
  "60--------------------------------------------------------------------------------------------------------------------------------------------------------60" + "\n" +
  "60--------------------------------------------------------------------------------------------------------------------------------------------------------60" + "\n" +
  "60--------------------------------------------------------------------------------------------------------------------------------------------------------60" + "\n" +
  "60--------------------------------------------------------------------------------------------------------------------------------------------------------60" + "\n" +
  "60--------------------------------------------------------------------------------------------------------------------------------------------------------60" + "\n" +
  "60--------------------------------------------------------------------------------------------------------------------------------------------------------60" + "\n" +
  "60--------------------------------------------------------------------------------------------------------------------------------------------------------60" + "\n" +
  "60--------------------------------------------------------------------------------------------------------------------------------------------------------60" + "\n" +
  "60------------------------------------------@0------------------------------------------------------------------------------------------------------------60" + "\n" +
  "60------------------------------------------------------------------------------------------------------------------------------E2------------------------60" + "\n" +
  "60------------------------------------------------------------------------------4040------------404040--------------4040404040404040404040404040404040404060" + "\n" +
  "60----------------------------------------------------------------------------------------------------------------------------------------------------------" + "\n" +
  "60------------------------E9----------------F5----------------------------------------------------------------------------------E4--------------------------" + "\n" +
  "60----------F5----------574055------------404040------------------4040------------------------------------------------F5------------------------------------" + "\n" +
  "604040404040404040404040406040404040404040606060404040404040404040606040404040404040404040404040404040404040404040404040404040757677404040404040404040404040" ;


/* event object of stage 0 */
var EventStage = enchant.Class.create({
    initialize: function(_gameObj) {
      this._gameObj =_gameObj;
      this._switch = undefined; this._lamp = undefined; this._boxRed = undefined;
      this.isClear = false; this.clearCounter = 0;
    },
    switch: {
      get: function()  { return this._switch; },
      set: function(v) { this._switch = v; },
    },
    lamp: {
      get: function()  { return this._lamp; },
      set: function(v) { this._lamp = v; },
    },
    bookRed: {
      get: function()  { return this._bookRed; },
      set: function(v) { this._bookRed = v; },
    },
    dummy: function(){}
});

var initMoriy = function() {//---
//window.onload = function() {//---

  /* init game */
  var game = new Game(GAME_WIDTH, GAME_HEIGHT);

  game.onload = function() {

      var _map = new MapDataPerser(this, MAP_DATA);
      var objects = _map.objects;
      var fore = _map.foreMap;
      var map = _map.backMap;
      var events = new EventStage(game);
      var message = new MutableText( 16, 16,368);
      events.message = message;
      var m = 0; var messages = [
        // 'To move, tap the screen and the game pad will appear.',
        'バーチャル ゲーム パッド か カーソル キー で いどう せよ',
        // 'To clear, solve something with some hints.',
        'ヒント を 元に ナゾ を 解け',
        // 'The end of the world, ahead.',
        'おちるな キケン この先 ちゅうい',
      ];
      var hero = new CharHero(game, map, _map.startX, _map.startY);

      var stage = new Group();

      stage.addChild(map);//background


      for(var i=0; i<objects.length; i++){// event object
        var o = objects[i];
        var type = SpriteObjTypes.indexes[o.type];
        var setting = SpriteObjTypes[type];
        var obj = new SpriteObj(game, map, hero, {}, o.mapX, o.mapY, setting, o.default);
        switch(type){
          case "messageBoard":
            obj.eventObj = events;
            obj._msgText = messages[m++];
            obj.eventTouch = function(){ this._eventObj.message.setText(this._msgText); };
            obj.eventLeave = function(){ this._eventObj.message.setText(''); };
          break;
          case "lamp":
            obj.eventObj = events;
            events.lamp = obj;
          break;
          case "switchLR":
            obj.eventObj = events;
            events.switch = obj;
            obj.eventTouch = function(){ this.switchValue(); };
            obj.eventOn  = function(){
              this._eventObj._lamp.setValue(true);
              if(typeof(monaca) !== 'undefined'){
                  monaca_sound_play(SOUND_CORRECT);
              }else{
                  this._gameObj.assets[SOUND_CORRECT].clone().play();
              }
            };
            obj.eventOff = function(){ this._eventObj._lamp.setValue(false); };
          break;
          case "boxRed":
            obj.eventObj = events;
            events.boxRed = obj;
            obj.eventTouch = function(){ if (this._eventObj._switch.currentValue) this.setValue(true); };
            obj.eventOn  = function(){ this._eventObj.isClear = true; };
          break;
        }
        stage.addChild(obj);
      }
      stage.addChild(hero);
      stage.addChild(fore);
      //stage.addChild(effect);

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
            //effect.visible = true;
          }
          if ((events.clearCounter / game.fps) >= 1){ game.end(true); }
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
    SOUND_JUMP, SOUND_GAMEOVER, SOUND_CORRECT, SOUND_SWITCH_00, SOUND_SWITCH_01, SOUND_LAMP, SOUND_OPEN_00, SOUND_CLOSE_00
  );
  // sound preload for monaca
  if(typeof(monaca) !== 'undefined'){
    monaca_sound_preload([SOUND_JUMP, SOUND_GAMEOVER, SOUND_CORRECT, SOUND_SWITCH_00, SOUND_SWITCH_01, SOUND_LAMP, SOUND_OPEN_00, SOUND_CLOSE_00]);
  }

  game.start();

};//---

