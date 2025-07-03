
var MAP_DATA = "" +
  "------404040404040404040404040------404040404040404040404040----------**" + "\n" +
  "--E1--20--------------------------------------------------60------------" + "\n" +
  "------20--------------------------------------------------60F3----------" + "\n" +
  "40404040------------------------E4------------------------60404040------" + "\n" +
  "60--------------------------------------------------------------20------" + "\n" +
  "60--------------------------E4------E4--------------------------20------" + "\n" +
  "60--------------------------------------------------------------4040----" + "\n" +
  "60----------------------E4------E4------E4----------------------60------" + "\n" +
  "60------404040--------------------------------------404040------60------" + "\n" +
  "60--------------------------E4------E4--------------------------60------" + "\n" +
  "60--E5------------------------------------------------------E5--60------" + "\n" +
  "604040--------------------------E4--------------------------404060------" + "\n" +
  "60----------40E0--40E0--40E0----------E040--E040--E040------------------" + "\n" +
  "60----------606060606060606060------606060606060606060------------@0----" + "\n" +
  "60404040--------------------------------------------------404040404040--" + "\n" +
  "60606060------------------------D3------------------------60606060606040" + "\n" +
  "606060604040404040404040404040404040404040404040404040404060606060606060" ;



/* event object of stage 3 */
var EventStage = enchant.Class.create({
    initialize: function(_gameObj) {
      this._gameObj =_gameObj;
      this.door = undefined; this.switchUD = undefined; this.switchFB = undefined;
      this.lamps = []; this.answer = []; this.checkFlg = false;
      this.isClear = false; this.clearCounter = 0;
    },
    redyAnswer: function(){
      if(!this.switchUD.currentValue) return;
      this.allLampSet(false);
      this.answer = []; var t=0; var f=0; var i;  var seed = this._gameObj.frame+10;
      for(i=0; i<9; i++){
        var a = Math.floor(Math.random() * seed) % 2;
        if(a==1){ t++; }else{ f++; }
        this.answer.push(a);
      }
      if( t===0 || f===0) this.redyAnswer();
      for(i=0; i<9; i++){ this.lamps[i].setValue(this.answer[i]); }
      var lampLines = this.lampLines();
      var shuffle = []; for(i=0; i<6; i++){ shuffle.push((i + seed) % 6); }
      while(shuffle.length > 1){
        var index = shuffle.shift();
        var line = lampLines[index];
        for(var j=0; j<line.length; j++){ this.lamps[line[j]].switchValue(); }
        if((Math.floor(Math.random() * seed) % 2) === 0) shuffle.push(index);
      }
      if(this.isCorrecting) this.redyAnswer();
      this.isClear = false; this.clearCounter = 0;
    },
    allLampSet: function(v){
      for(var i=0; i<this.lamps.length; i++){ this.lamps[i].setValue(v); }
    },
    isCorrect: { get: function(){
      console.log({name: "isCorrect", hint: this.getHint(), aiming: this.getAiming(), current: this.getCurrent()});
      return (this.getHint()===this.getCurrent() ? true : false);
    }},
    isCorrecting: { get: function(){
      return (this.getHint()===this.getAiming() ? true : false);
    }},
    correctCheck: function(){
      this.checkFlg = false;
      this.checkWait = 0;
      if(this.isCorrect){
        if(typeof(monaca) !== 'undefined'){
            monaca_sound_play(SOUND_CORRECT);
        }else{
          this._gameObj.assets[SOUND_CORRECT].clone().play();
        }
        if (!this.door.isOpen ) this.door.open();
      } else {
        if ( this.door.isOpen ) this.door.close();
      }
      this.checkFlg = false;
    },
    getHint: function(){
      var c = this.answer;
      // return ["N: "+this.lampCount("N", c)+", E: "+this.lampCount("E", c)
      //      +", S: "+this.lampCount("S", c)+", W: "+this.lampCount("W", c)].join("");
      return ["N"+this.lampCount("N", c), "E"+this.lampCount("E", c),
              "S"+this.lampCount("S", c), "W"+this.lampCount("W", c)].join(" ");
    },
    getCurrent: function(){
      var c = [];
      for(var i=0; i<9; i++){ c.push(this.lamps[i].currentValue ? 1 : 0); }
      // return ["N: "+this.lampCount("N", c)+", E: "+this.lampCount("E", c)
      //      +", S: "+this.lampCount("S", c)+", W: "+this.lampCount("W", c)].join("");
      return ["N"+this.lampCount("N", c),"E"+this.lampCount("E", c),
              "S"+this.lampCount("S", c),"W"+this.lampCount("W", c)].join(" ");
    },
    getAiming: function(){
      var c = [];
      for(var i=0; i<9; i++){ c.push(this.lamps[i].expect ? 1 : 0); }
      // return ["N: "+this.lampCount("N", c)+", E: "+this.lampCount("E", c)
      //      +", S: "+this.lampCount("S", c)+", W: "+this.lampCount("W", c)].join("");
      return ["N"+this.lampCount("N", c),"E"+this.lampCount("E", c),
              "S"+this.lampCount("S", c),"W"+this.lampCount("W", c)].join(" ");
    },
    lampCount: function(direction, states){
      var count = 0; var lampBox =  this.lampBoxes()[direction];
      for(var i=0; i<lampBox.length; i++){
        count += ((states[lampBox[i]] === (this.switchFB.currentValue ? 1 : 0)) ? 1 : 0);
      }
      return count;
    },
    lampBoxes: function(){ return {"N": [0, 1, 2, 4], "E": [2, 4, 5, 7], "S": [4, 6, 7, 8], "W": [1, 3, 4, 6]}; },
    lampLines: function(){ return [ [0, 1, 3], [2, 4, 6], [5, 7, 8], [3, 6, 8], [1, 4, 7], [0, 2, 5] ]; },
    dummy: function(){}
});

var initMoriy = function() {//---
//window.onload = function() {//---

  /* init game */
  var game = new Game(GAME_WIDTH, GAME_HEIGHT);

  game.onload = function() {

      var _map = new MapDataPerser(this, MAP_DATA);
      var objects = _map.objects;
      var doors = _map.doors;
      var position = _map.monitors[0];
      var fore = _map.foreMap;
      var map = _map.backMap;
      var events = new EventStage(game);
      var message = new MutableText( 16, 16,368);
      events.message = message;
      var hero = new CharHero(game, map, _map.startX, _map.startY);

      var stage = new Group();

      var monitor = new SpriteMonitor(game, hero, events, position.mapX, position.mapY);
      monitor.touchEvent = function(){
        if(this._eventObj.switchUD.currentValue){
          this._eventObj.checkFlg = true;
          var f = this._eventObj.switchFB.currentValue;
          for(var i=0; i<this._eventObj.lamps.length; i++){
            this._eventObj.lamps[i].setValue(((this._eventObj.answer[i]==1) ? f : !f));
          }
        }
      };
      stage.addChild(monitor);//
      stage.addChild(map);//background

      var _door = _map.doors[0];
      var typed = SpriteObjDoors.indexes[_door.type];
      var setting = SpriteObjDoors[typed];
      events.door = new SpriteDoor(game, map, hero, events, _door.mapX, _door.mapY, setting, _door.isOpen);
      events.door.eventTouch = function(){ if( this.isOpen ) this._eventObj.isClear = true; };
      stage.addChild(events.door);

      var bbscount = 0;
      var lampLines = events.lampLines();

      for(var i=0; i<objects.length; i++){// event object
        var o = objects[i];
        var typee = SpriteObjTypes.indexes[o.type];
        var settinge = SpriteObjTypes[typee];
        var obj = new SpriteObj(game, map, hero, {}, o.mapX, o.mapY, settinge, o.default);
        obj.eventObj = events;
        switch(typee){
          case "messageBoard":
            obj.eventLeave = function(){ this._eventObj.message.setText(''); };
            if(bbscount++ === 0){
              obj.eventTouch = function(){
                // this._eventObj.message.setText( 'Near side is negative, far side is positive.' );
                this._eventObj.message.setText( 'てまえ は アン おく は メイ' );
              };
            }else{
              obj.eventTouch = function(){
                if(this._eventObj.switchUD.currentValue){
                  this._eventObj.message.setText( this._eventObj.getHint() + " : " + this._eventObj.getCurrent() );
                } else {
                  // this._eventObj.message.setText( 'Turn on the main power, first.' );
                  this._eventObj.message.setText( 'まずは キドウ せよ' );
                }
              };
            }
          break;
          case "switchUD":
            events.switchUD = obj;
            obj.eventTouch = function(){ this.switchValue(); };
            obj.eventOn = function(){ this._eventObj.redyAnswer(); };
            obj.eventOff = function(){ this._eventObj.allLampSet(false); };
          break;
          case "switchFB":
            events.switchFB = obj;
            obj.eventTouch = function(){ this._eventObj.redyAnswer(); this.switchValue(); };
            obj.eventChange = function(){ this._eventObj.checkFlg = true; };
          break;
          case "switchCrystal":
            obj.lampLines = lampLines.shift();
            obj.eventTouch = function(){ if(this._eventObj.switchUD.currentValue) this.setValue(true); };
            obj.eventLeave = function(){ if(this._eventObj.switchUD.currentValue) this.setValue(false); };
            obj.eventOn = function(){
              for(var j=0; j<this.lampLines.length; j++){
                this._eventObj.lamps[this.lampLines[j]].switchValue();
              }
            };
          break;
          case "lamp":
            obj.eventObj = events;
            events.lamps.push(obj);
            obj.eventOn = function(){ this._eventObj.checkFlg = true; };
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
        if(events.checkFlg && events.switchUD.currentValue) events.correctCheck();
        this._scroll();
        if(hero.y > map.height + (hero.height * 1)){ game.end(false); }
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
    SOUND_JUMP, SOUND_GAMEOVER, SOUND_CORRECT, SOUND_SWITCH_00, SOUND_SWITCH_01, SOUND_LAMP, SOUND_OPEN_00, SOUND_CLOSE_00, SOUND_OPEN_01, SOUND_CLOSE_01
  );
  // sound preload for monaca
  if(typeof(monaca) !== 'undefined'){
    monaca_sound_preload([SOUND_JUMP, SOUND_GAMEOVER, SOUND_CORRECT, SOUND_SWITCH_00, SOUND_SWITCH_01, SOUND_LAMP, SOUND_OPEN_00, SOUND_CLOSE_00, SOUND_OPEN_01, SOUND_CLOSE_01]);
  }

  game.start();

};//---

