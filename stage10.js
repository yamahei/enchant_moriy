
var CHAR_DARK = './assets/image/god_of_what_dark.png';
var CHAR_BRIGHT = './assets/image/god_of_what_bright.png';

var MAP_DATA = "" +
"--------------------404040404040404040404040404040402020204040404040404040404040404040757677414141414141414141414141414141414141--------------------------------------------------------------7070706060606060606060606060606060606060606060606060606060606060" + "\n" +
"----------------------------------60606020202020202020202060202020202020706070----------------*G----------------------------------------------------------------------------------------------------7070606060606060606060606060606060606060606060606060606060" + "\n" +
"--------------------------------70606020202020202020202060202020202020--60------------------------------------------------------------------------------------------------------------------------------707060606060606060606060606060606060606060606060606060" + "\n" +
"4040------------------------------202020202020206060606020202020706030--70----------------------------------------------------------------------------------------------------------------------------------70606060606060606060606060606060606060606060606060" + "\n" +
"----------------------------------202020202020202060602020202060--60------------------------------------------------------------------------------------------------------------------------------------------606060606060606060606060606060606060606060606060" + "\n" +
"----------------------------------202020602020202020202020206060--70------------------------------------------------------------------------------------------------------------------------------------------706060606060606060606060606060606060606060606060" + "\n" +
"------4040----------40----------40606060606060202020202020606070------------------------------------------------------------------------------------------------------------------------------------------------7060606060606060606060606060606060606060606070" + "\n" +
"----------------------40----------6060606060606060606060606070----------------------------------------------------------------------------------------------------------------------------------------------------606060606060606060606060606060606060606060--" + "\n" +
"----------------------60----------70606060606060606060707070------------------------------------------------------------------------------------------------------------------------------------------------------707060606070706060606060606060606060606070--" + "\n" +
"----------------------60------60----706060606060607070----------------------------------------------------------------------------------------------------------------------------------------------------------------706070----60606060606060606060606060----" + "\n" +
"------------4040--------40------------707060607070----------------------------------------------------------------------------------------------------------------------------------------------------------------------60------70607060606060606060606060----" + "\n" +
"------------------------60----------------7070--------------------------------------------------------------------------------------------------------------------------------------------------------------------------70--------70--70707060606060606070----" + "\n" +
"--------------------------40----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------706060607070------" + "\n" +
"----------------------------40----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------707070----@0----" + "\n" +
"------------------------------4040----------------4040404040------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------82------------" + "\n" +
"----------------------------------4040--------4040------------------4040------------------------------------------------------------------------------------------------------------------------------------------------------------------------A2------------" + "\n" +
"--------------------------------------40404040----------------4040------------------------------------------------------------------------------------------------------------------------------------------------------------------------------B2------F5----" + "\n" +
"--------------------------------------------------------------------------40404040--------404040----------------------------------------------------------------------------------------------------------------5040--404040----40--40407576774040404040404040" + "\n" +
"--------------------------------------------------------------------------------404040404040------------------------------------------------------------------------------------------------------------------40--------------------------------*S------------" + "\n" +
"------------------------------------------------------------------4040----------60--------60------------------------------------------------------------------------------------------------------------------60----------------------------------------------" + "\n" +
"--------------------------------------------------------------------------------60--------60------404040--4040--------------------------40----------------------------------------------------------------4040------------------------------------------------" + "\n" +
"--------------------------------------------------------------------------------60------------------------60----------------------40----------40--------------------------------------------------------40----------------------------------------------------" + "\n" +
"--------------------------------------------------------------------------------60------------------------60----------------------------------------40------------------------------------------------40------------------------------------------------------" + "\n" +
"--------------------------------------------------------------------------------6060--60--60--4040--------4040404040404040------40------40--------------40--------------------------------------------60------------------------------------------------------" + "\n" +
"------------------------------------------------------------------------------------------------------------------------------------------------40------------4040----------------------------------40--------------------------------------------------------" + "\n" +
"----------------------------------------------------------------------------------------------------------------------------------40------40--------------------------------------------------------60--------------------------------------------------------" + "\n" +
"----------------------------------------------------------------------------------------------------------------------------------------------------40--------40----------------4040----------------60--------------------------------------------------------" + "\n" +
"--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------40----------------------------------------------------------" + "\n" +
"----------------------------------------------------------------------------------------------------------------------------------------------------------------------4040------------------------60----------------------------------------------------------" + "\n" +
"------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------40------------------------------------------------------------" + "\n" +
"--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------40----------------------------------------------------------------" + "\n" +
"----------------------------------------------------------------------------------------------------------------------------------------------------------------------------4040----------40------------------------------------------------------------------" + "\n" +
"*M------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------4040--------------------------------------------------------------------" ;

/* manage character of dark-bright object */
var CharDarkBright = enchant.Class.create( SpriteChar, {
  initialize: function(_gameObj, _mapObj, mapX, mapY, image){
    this.offsetH = 1; var offsetU = 4; this.offsetB = 0;
    var startX = (mapX * _mapObj.tileWidth) - 4;
    var startY = (mapY * _mapObj.tileHeight) -16 + this.offsetB;
    SpriteChar.call( this,
      _gameObj, _mapObj, startX, startY, 24/* width */, 32/* height */,
      image, this.offsetH, offsetU, this.offsetB
    );
    this.event = undefined; this.hero = undefined;
    this.a = new Anime();
    this.a.setAction(this.a.jump); this.a.setDirection(this.a.back);
  },
  enterFrame: function(e){
    var game = enchant.Game.instance;
    if(this.visible){
      if(this.event.resetCounter <= 0){ if(this.hitTest(this.hero)) this.event.catchHero(); }
      this.a.setAction(this.a.loop);
      this.frame = this.a.getNumber();
    }else{ this.y = -this.height; }
  },
  hitTest: function(char) {
    if (!this.intersect(char)) return false;
    return ( (this.hitLX < char.hitRX) && (this.hitRX > char.hitLX)
     && (this.hitUY < char.hitBY) && (this.hitBY > char.hitUY)
    );
  },
  dummy: function(){}
});
/* event object of stage */
var EventStage = enchant.Class.create({
    initialize: function(_gameObj) {
      this._gameObj =_gameObj;
      this.isClear = false; this.clearCounter = 0;
      this.message = undefined; this.map = undefined;
      this.hero = undefined; this.darkBrights = [];
      this.resetMonitoring();
    },
    monitorHero: function(){
      this.isHeroSeeRight = (this.hero.a.direction == this.hero.a.right);
      if(this.monitoringFlag){
        this.heroMonitoring.push(
          {x: this.hero.x, y: this.hero.y, g: this.hero.grounding}
        );
        if(this.isHeroSeeRight) this.chasing = true;
        while(this.heroMonitoring.length > 512){ this.heroMonitoring.shift(); }
      }
    },
    resetMonitoring: function(){
      this.chasing = false; this.resetCounter = 0; this.isHeroSeeRight = false;
      this.monitoringFlag = false; this.heroMonitoring = [];
      for(var i=0; i<this.darkBrights.length; i++){ this.darkBrights[i].visible = false; }
    },
    catchHero: function(){
      var game = enchant.Game.instance;
      this.resetCounter = game.fps;
      this.hero.autoMode = true;
    },
    restartHero: function(){
      this.hero.autoMode = false;
      this.hero.speedX = 0; this.hero.speedY = 0;
      this.hero.mapX = this.map.startX; this.hero.mapY = this.map.startY;
      this.resetMonitoring();
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
      var events = new EventStage(game);
      events.map = _map;
      events.message = new MutableText( 16, 16,368);
      var hero = new CharHero(game, map, _map.startX, _map.startY);
      events.hero = hero;
      var coreCenter = {x: 0, y: 0};

      var stage = new Group();

      var i;
      var monitors = _map.monitors;
      for(i=0; i<monitors.length; i++){
        var position = monitors[i];
        var monitor = new SpriteMonitor(game, hero, events, position.mapX, position.mapY);
        monitor.key = position.key;
        switch(position.key){
          case "S"://start
            monitor.frameEvent = function(){
              if(events.monitoringFlag) return;
              this.prevPosition = this.currentPosition;
              this.currentPosition = (hero.hitLX < this.x) ? "left" : "right";
              if(this.prevPosition=="right" && this.currentPosition=="left" ){ events.monitoringFlag=true; }
            };
          break;
          case "G"://goal
            monitor.frameEvent = function(){
              if(events.isClear) return;
              this.prevY = this.currentY;
              this.currentY = (hero.y < 0);
              if(hero.y < 0){
                if(this.prevY != this.currentY){
                  if(typeof(monaca) !== 'undefined'){
                      monaca_sound_play(SOUND_CORRECT);
                  }else{
                      this._gameObj.assets[SOUND_CORRECT].clone().play();
                  }
                }
                if(this.x < hero.x) events.isClear = true;
              }
            };
          break;
          case "M"://monitor
            monitor.frameEvent = function(){
              events.monitorHero();
              if(events.chasing && !events.isHeroSeeRight){// && events.resetCounter <= 0
                var darkBrights = events.darkBrights;
                var length = darkBrights.length;
                var speed = game.fps - (game.frame % game.fps);
                for(var i=0; i<length; i++){
                  var darkBright = darkBrights[i];
                  if(events.heroMonitoring.length > 0 && i <= speed){
                    var monitor = events.heroMonitoring.shift();
                    darkBright.x = monitor.x; darkBright.y = monitor.y;
                    darkBright.visible = true;
                  } else { darkBright.visible = false; }
                }
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
            // obj.eventTouch = function(){ events.message.setText('Go without looking back.'); };
            obj.eventTouch = function(){ events.message.setText('ふりむいて は ならぬ'); };
            obj.eventLeave = function(){ events.message.setText(''); };
          break;
        }
        stage.addChild(obj);
      }

      stage.addChild(hero);

      for(i=0; i<game.fps; i++){
        darkBright = new CharDarkBright(game, map, 0, 0, ((i%2===0) ? CHAR_DARK : CHAR_BRIGHT));
        darkBright.event = events; darkBright.hero = hero;
        darkBright.visible = false;
        stage.addChild(darkBright);
        events.darkBrights.push(darkBright);
      }


      stage.addChild(fore);

      stage._scroll = function(){
        if(events.resetCounter-- > 0){
          this.x += Math.floor(Math.random() * 9) - 5;
          this.y += Math.floor(Math.random() * 9) - 5;
          if(events.resetCounter <= 0) events.restartHero();
        } else {
          this.x = (game.width + hero.width) / 2 - hero.x;
          if (this.x > 0) { this.x = 0; }
          if (this.x < game.width - map.width) { this.x = game.width - map.width; }
          this.y = (game.height + hero.height) / 2 - hero.y;
          if (this.y > 0) { this.y = 0; }
          if (this.y < game.height - map.height) { this.y = game.height - map.height; }
        }
      };
      stage.addEventListener('enterframe', function(e) {
        this._scroll();
        if(hero.y > map.height + (hero.height * 1)){ game.end(false); }
        if (events.isClear) {
          hero.autoMode = true;//
          if ((events.clearCounter / game.fps) >= 0){ game.end(true); }
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
    /* this stage only ? */
    , CHAR_DARK, CHAR_BRIGHT
  );
  // sound preload for monaca
  if(typeof(monaca) !== 'undefined'){
    monaca_sound_preload([SOUND_JUMP, SOUND_GAMEOVER, SOUND_CORRECT, SOUND_SWITCH_00, SOUND_SWITCH_01, SOUND_LAMP, SOUND_OPEN_00, SOUND_CLOSE_00, SOUND_OPEN_01, SOUND_CLOSE_01]);
  }

  game.start();

};//---

