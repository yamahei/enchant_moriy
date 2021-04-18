
var MAP_DATA = "" + 
"61616161616161616161616161616161616161616161616161616161" + "\n" + 
"61616171717171----------717171----------71717171------71" + "\n" + 
"616161------------------------------------0F------------" + "\n" + 
"6161--------------------------------------1F------------" + "\n" + 
"6161------414141--0F--4141414141--0F--414141414141------" + "\n" + 
"61------41616161--1F--6161616161--1F--6161616161--------" + "\n" + 
"61--0F--616161------6161------------616161------------41" + "\n" + 
"61--1F--6161--------------------------0F----------@0--61" + "\n" + 
"61----416161----------C4--------------1F----------414161" + "\n" + 
"61----6161--0F--4141414141--0F--414141414141------616161" + "\n" + 
"61------61--1F--6161516161--1F--6161516161------41616161" + "\n" + 
"61------61----6161616161------6161616161--------61616161" + "\n" + 
"6141------------------------------0F----------4161616161" + "\n" + 
"6161--------------E5--------------1F--------416161616161" + "\n" + 
"61616161616161616161616161616161616161616161616161616161" ;


/* event object of stage 2 */
var EventStage = enchant.Class.create({
    initialize: function(_gameObj) {
      this._gameObj =_gameObj;
      this.isClear = false; this.clearCounter = 0;
      this.door = undefined;
      this.flags = [];
    },
    touchFlag: function(key){
      if ( this.flags.length <= 0 ){ this.flags.push(key); }
      else if ( this.flags[this.flags.length - 1] != key ) { this.flags.push(key); }
      while ( this.flags.length > 8 ) { this.flags.shift(); }
      var way = this.flags.join("").split("").sort().join("");
      if ( way == "ABCDEFGH" ) { if(!this.door.isOpen) this.door.open(); } 
      else { if( this.door.isOpen) this.door.close(); }
    },
    dummy: function(){}
});

var initMoriy = function() {//---
//window.onload = function() {//---

  /* init game */
  var game = new Game(GAME_WIDTH, GAME_HEIGHT);

  game.onload = function() {
     
      var _map = new MapDataPerser(this, MAP_DATA);
      //var objects = _map.objects;
      var fore = _map.foreMap;
      var map = _map.backMap;
      var chips = _map.mapChip;
      var events = new EventStage(game);
      var message = new MutableText( 16, 16,368);
      events.message = message;
      var hero = new CharHero(game, map, _map.startX, _map.startY);

      var stage = new Group();
      
      var keys="ABCDEFGH".split("");
      for(var j=0; j<chips.length; j++){// monitor object
        for(var i=0; i<chips[j].length; i++){
          if (chips[j][i] == "1F") {
            var obj = new SpriteMonitor(game, hero, events, i, j, keys.shift());
            obj.touchEvent = function(){ this._eventObj.touchFlag(this.key); };
            stage.addChild(obj);
          }
        }
      }
      stage.addChild(map);//background
      
      //message boad
      var o = _map.objects[0];
      var typem = SpriteObjTypes.indexes[o.type];
      var settingm = SpriteObjTypes[typem];
      var objm = new SpriteObj(game, map, hero, events, o.mapX, o.mapY, settingm, o.default);
      objm.eventTouch = function(){ this._eventObj.message.setText("Banners will lead you to the entrance."); };
      objm.eventLeave = function(){ this._eventObj.message.setText(''); };
      stage.addChild(objm);
      
      // door
      var d = _map.doors[0];
      var typed = SpriteObjDoors.indexes[d.type];
      var settingd = SpriteObjDoors[typed];
      var objd = new SpriteDoor(game, map, hero, events, d.mapX, d.mapY, settingd, d.isOpen);
      events.door = objd;
      objd.eventTouch = function(){ if( this.isOpen ) this._eventObj.isClear = true; };
      objd.eventOpen = function(){ 
        if(typeof(monaca) !== 'undefined'){
            monaca_sound_play(SOUND_CORRECT);
        }else{
            this._gameObj.assets[SOUND_CORRECT].clone().play();
        }
      };
      stage.addChild(objd);

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
        if(hero.y > map.height + (hero.height * 2)){ game.end(false); }
        if (events.isClear) {
          if (events.clearCounter === 0){
            hero.autoMode = true;
          }
          if ((events.clearCounter / game.fps) >= 0.5){ game.end(true); }
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

