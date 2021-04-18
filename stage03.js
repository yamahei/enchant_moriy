
var MAP_DATA = "" + 
  "20404040404040404040404040404040404040404040404040404040404040404040404040404040404040404040404020" + "\n" + 
  "--------------------------------60------------------------------60------------------------------60" + "\n" + 
  "----@0--------------------------60------------------------D1----60------------------------------60" + "\n" + 
  "4040404040------4040404040------60------404040404040404040404040----------------4040404040------60" + "\n" + 
  "60--F1----------60------------------------------20----------------------------4060--------------60" + "\n" + 
  "60--------------60--D0--------------------------20------------------------------60--------------60" + "\n" + 
  "604040404040404060404040404040404040404040------604040404040404040--------------60------4040404060" + "\n" + 
  "60--------------------------E1--60--------------60--------------60--------------60--------------60" + "\n" + 
  "60------------------------------60--------------60--D2----------60--------------60----------E5--60" + "\n" + 
  "60------40404040404040404040404060------404040406040404040------60------40404040604040404040404060" + "\n" + 
  "60--------------60--------------60--------------60--------------60------------------------------60" + "\n" + 
  "60--------------60--D0----------60--------------60--------------60------------------------------60" + "\n" + 
  "6040404040------6040404040------6040404040------60------404040406040404040------404040404040404060" + "\n" + 
  "60------------------------------60--E1----------60------------------------------60--------------60" + "\n" + 
  "60------------------------------60--------------60------------------------------60--------------60" + "\n" + 
  "60------40404040404040404040404060404040404040406040404040------40404040404040406040404040------60" + "\n" + 
  "60--------------60------------------------------60--------------60--------------60--------------60" + "\n" + 
  "60----------D2--60------------------------------60--------------60--------------60--------------60" + "\n" + 
  "604040404040404060------404040404040404040------60------4040404060--------------60------4040404040" + "\n" + 
  "60------------------------------60--------------60----------------------------------------------20" + "\n" + 
  "60------------------------------60--------------60------------E5--------------------------------20" + "\n" + 
  "60404040404040404040404040------60------40404040604040404040404040--------------4040404040--------" + "\n" + 
  "60--E1--------------------------60------------------------------60--------------60----------------" + "\n" + 
  "60------------------------------60--------------------------D1--60--------------60--C3------------" + "\n" + 
  "604040404040404040404040404040406040404040404040404040404040404060--------------604040404040404040" ;



/* event object of stage 3 */
var EventStage = enchant.Class.create({
    initialize: function(_gameObj) {
      this._gameObj =_gameObj;
      this.isClear = false; this.clearCounter = 0;
    },
    dummy: function(){}
});

var initMoriy = function() {//---
//window.onload = function() {//---

  /* init game */
  var game = new Game(GAME_WIDTH, GAME_HEIGHT);

  game.onload = function() {
      var i;
      var _map = new MapDataPerser(this, MAP_DATA);
      var objects = _map.objects;
      var doors = _map.doors;
      var fore = _map.foreMap;
      var map = _map.backMap;
      var events = new EventStage(game);
      var message = new MutableText( 16, 16,368);
      events.message = message;
      var hero = new CharHero(game, map, _map.startX, _map.startY);
      //var effect = new CharEffect(game, map, hero, SpriteObjEffect.WarmBling);
      //effect.setPosition = function(){ this.x = this._charObj.x; this.y = this._charObj.y; }

      var stage = new Group();
      stage.addChild(map);//background

      var doorpair = {};
      for(i=0; i<doors.length; i++){// door object
        var d = _map.doors[i];
        var type = SpriteObjDoors.indexes[d.type];
        var setting = SpriteObjDoors[type];
        var obj = new SpriteDoor(game, map, hero, events, d.mapX, d.mapY, setting, d.isOpen);
        if ( doorpair[d.type] === undefined ) { doorpair[d.type] = obj; }
        else {
          var pair = doorpair[d.type];
          obj.setPair(pair);
          obj.eventTouch = function(){ if( this.isOpen ) this.into(); };
          pair.eventTouch = function(){ if( this.isOpen ) this.into(); };
        }
        stage.addChild(obj);
      }
      doorpair[3].eventTouch = function(){ if( this.isOpen ) this._eventObj.isClear = true; };
      
      var mymsg = [ 'Go the shortest way.', 'Probably fall.' ];
      var doorIndex = [3, 1, 0, 2];
      var firstSwitch = true;
      
      for(i=0; i<objects.length; i++){// event object
        var o = objects[i];
        var typeo = SpriteObjTypes.indexes[o.type];
        var settingo = SpriteObjTypes[typeo];
        var objo = new SpriteObj(game, map, hero, {}, o.mapX, o.mapY, settingo, o.default);
        switch(typeo){
          case "messageBoard": 
            objo.eventObj = events;
            objo._mymsg = mymsg.shift();
            objo.eventTouch = function(){ this._eventObj.message.setText( this._mymsg ); };
            objo.eventLeave = function(){ this._eventObj.message.setText(''); };
          break;
          case "switchUD":
            objo.eventObj = events;
            objo.doorObj = doorpair[doorIndex.shift()];
            objo.eventTouch = function(){ this.switchValue(); };
            if(firstSwitch){
              objo.eventOn  = function(){
                this.doorObj.open();
                if(typeof(monaca) !== 'undefined'){
                    monaca_sound_play(SOUND_CORRECT);
                }else{
                  this._gameObj.assets[SOUND_CORRECT].clone().play();
                }
              };
              firstSwitch = false;
            }else{
              objo.eventOn  = function(){ this.doorObj.open(); };
            }
            objo.eventOff = function(){ this.doorObj.close(); };
          break;
        }
        stage.addChild(objo);
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
    'jump.wav', 'gameover.wav', SOUND_CORRECT, SOUND_SWITCH_00, SOUND_SWITCH_01, SOUND_LAMP, SOUND_OPEN_00, SOUND_CLOSE_00, SOUND_OPEN_01, SOUND_CLOSE_01
  );
  // sound preload for monaca
  if(typeof(monaca) !== 'undefined'){
    monaca_sound_preload(['jump.wav', 'gameover.wav', SOUND_CORRECT, SOUND_SWITCH_00, SOUND_SWITCH_01, SOUND_LAMP, SOUND_OPEN_00, SOUND_CLOSE_00, SOUND_OPEN_01, SOUND_CLOSE_01]);
  }

  game.start();
    
};//---

