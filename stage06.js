
var MAP_DATA = "" +
"------------------------------------------------------" + "\n" +
"------------------------------------------------------" + "\n" +
"----------0F--------------2F--------------0F----------" + "\n" +
"----------1F------------------------------1F----------" + "\n" +
"------------------------------------------------------" + "\n" +
"--------------------------D4--------------------------" + "\n" +
"----------------------4040404040----------------------" + "\n" +
"43--2E------------------------------------------2C--43" + "\n" +
"53----------4040------0F--@0--0F------4040----------53" + "\n" +
"63--------------------1F--2B--1F--------------------63" + "\n" +
"73--D3--------------------**--------------------D3--73" + "\n" +
"4040404040----------------------------------4040404040" + "\n" +
"--------------------------E5--------------------------" + "\n" +
"----------4040--------4075767740--------4040----------" + "\n" +
"------------------------------------------------------" + "\n" +
"----------0F--4040--------2D--------4040--0F----------" + "\n" +
"----------1F------------------------------1F----------" + "\n" +
"------------------4040----------4040------------------" + "\n" +
"--------------------------D4--------------------------" + "\n" +
"----------------------4040404040----------------------" + "\n" +
"------------------------------------------------------" + "\n" +
"------------------------------------------------------" ;

/* event object of stage */
var EventStage = enchant.Class.create({
    initialize: function(_gameObj) {
      this._gameObj =_gameObj;
      this.doors = []; this.message = undefined;
      this.routes = undefined; this.route = 0;
      this.isClear = false; this.clearCounter = 0;
    },
    correctCheck: function(){
    },
    resetStage: function(){
      var frame = enchant.Game.instance.frame;
      this.route = 0;
      // this.routes = ["NESENN","ENWSSEE","WSESWS","SENESENW"][Math.floor(Math.random()*frame)%4];
      this.routes = ["NESENE","ENWSENW","WSESWS","SENESENW"][Math.floor(Math.random()*frame)%4];
      for(var i=0; i<this.doors.length; i++){
        var door = this.doors[i];
        if(!door.isOpen) door.open();
      }
    },
    showMessage: function(){
      var length = this.routes.length - 1;
      var message = "";
      if(this.route === 0){
        message = this.routes.substring(0, length).split("").join("-");
      }else if(this.route >= length){
        // message = "What comes in your mind?";
        message = "道は ひらかれた";
      }else{
        message = [
          // "Don't catch a cold!",
          "カゼ ひくなよ",
          // "Your teeth brushed?",
          "はみがき したか？",
          // "Take a bath!",
          "フロ 入れよ",
          // "Your homework finished?",
          "しゅくだい やったか？",
          // "Just a little.",
          "ちょっと だけよ",
          // "Be filially!",
          "おやこうこう しろよ！",
        ][this.route - 1];
      }
      this.message.setText(message);
    },
    goNext: function(door){
      if(door.direction != this.routes.substr(this.route, 1)){
        this.resetStage();
      } else {
        this.route += 1;
        if(this.route == this.routes.length){
          if(!door.isOpen) {
            door.setPair(door);
            door.open();
          }
          this.isClear = true; this.clearCounter = 0;
        }else{
          if(this.route == this.routes.length - 1){
            if(typeof(monaca) !== 'undefined'){
                monaca_sound_play(SOUND_CORRECT);
            }else{
                this._gameObj.assets[SOUND_CORRECT].clone().play();
            }
            for(var i=0; i<this.doors.length; i++){
              var _door = this.doors[i];
              if(_door.isOpen) _door.close();
            }
          }
        }
      }
      if(!this.isClear) door.into();
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
      var doors = _map.doors;
      //var collision = _map._collisionMap;
      var events = new EventStage(game);
      var message = new MutableText( 16, 16,368);
      events.message = message;
      var hero = new CharHero(game, map, _map.startX, _map.startY);

      var stage = new Group();

      var position = _map.monitors[0];
      var monitor = new SpriteMonitor(game, hero, events, position.mapX, position.mapY - 1);
      monitor.touchEvent = function(){ this._eventObj.resetStage(); };
      stage.addChild(monitor);//

      stage.addChild(map);//background

      var i;
      var doorpair = {};
      for(i=0; i<doors.length; i++){// door object
        var d = doors[i];
        var typed = SpriteObjDoors.indexes[d.type];
        var setting = SpriteObjDoors[typed];
        var objd = new SpriteDoor(game, map, hero, events, d.mapX, d.mapY, setting, d.isOpen);
        objd.direction = ["N", "W", "E", "S"][i];
        if ( doorpair[d.type] === undefined ) { doorpair[d.type] = objd; }
        else {
          var pair = doorpair[d.type];
          objd.setPair(pair);
          objd.eventTouch = function(){ this._eventObj.goNext(this); };
          pair.eventTouch = function(){ this._eventObj.goNext(this); };
        }
        events.doors.push(objd);
        stage.addChild(objd);
      }

      var objects = _map.objects;
      for(i=0; i<objects.length; i++){// event object
        var o = objects[i];
        var typee = SpriteObjTypes.indexes[o.type];
        var settinge = SpriteObjTypes[typee];
        var obje = new SpriteObj(game, map, hero, {}, o.mapX, o.mapY, settinge, o.default);
        obje._eventObj = events;
        switch(typee){
          case "messageBoard":
            obje.eventTouch = function(){ this._eventObj.showMessage(); };
            obje.eventLeave = function(){ this._eventObj.message.setText(''); };
          break;
        }
        stage.addChild(obje);
      }

      stage.addChild(hero);

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
  );
  // sound preload for monaca
  if(typeof(monaca) !== 'undefined'){
    monaca_sound_preload([SOUND_JUMP, SOUND_GAMEOVER, SOUND_CORRECT, SOUND_SWITCH_00, SOUND_SWITCH_01, SOUND_LAMP, SOUND_OPEN_00, SOUND_CLOSE_00, SOUND_OPEN_01, SOUND_CLOSE_01]);
  }

  game.start();

};//---

