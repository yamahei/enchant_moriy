enchant();

GAME_WIDTH = 400;
//GAME_HEIGHT = 192;
GAME_HEIGHT = Math.floor((400 / screen.width) * screen.height);

var SCREEN_TITILE = './index.html';
var SCREEN_SELECT = './select.html';
var SOUND_CORRECT =  './assets/sound/BellE_at_11.mp3';
var SOUND_SWITCH_00 = './assets/sound/SwitchF00_at_11.mp3';
var SOUND_SWITCH_01 = './assets/sound/SwitchC_at_11.mp3';
var SOUND_OPEN_00 = './assets/sound/DoorOpenD_at_16.mp3';
var SOUND_CLOSE_00 = './assets/sound/DoorCloseD_at_16.mp3';
var SOUND_OPEN_01 = './assets/sound/DoorOpenB_at_11.mp3';
var SOUND_CLOSE_01 = './assets/sound/DoorCloseB_at_11.mp3';
var SOUND_LAMP = './assets/sound/fire_on_wax_FireB_at_11.mp3';

var SOUND_GAMEOVER = './assets/sound/gameover.mp3';
var SOUND_JUMP = './assets/sound/jump.mp3';

var CHAR_HERO = './assets/image/hero_c1_dash.gif';
var CHAR_DOOR = './assets/image/doors.png';
var CHAR_EFFECT = './assets/image/effects.png';
var START_IMG = './assets/image/GameMsg_Start.png';//var START_IMG = '_start.png';
var CLEAR_IMG = './assets/image/GameMsg_Clear.png';//var CLEAR_IMG = '_clear.png';
var OVER_IMG = './assets/image/GameMsg_Oops.png';//var OVER_IMG = '_end.png';
var PAD_IMG_LRU = './assets/image/GamePadUR-L.png';//var PAD_IMG_LRU = '_myPad.png';
var DUMMY_IMG = './assets/image/dummy.gif';
var MAP_TILE = './assets/image/mapChipOriginal.gif';
var MAP_LIKE_OBJ = './assets/image/mapLikeObject.gif';

/* ************************** */
/* Extra functiuon for Monaca */

/* sound cache for Monaca */
var monaca_sounds = {};

/* sound preload for Monaca */
function monaca_sound_preload(soundfiles){
    if(typeof(monaca) === 'undefined') return;
    //try{
        var _path = location.pathname;
        var path = _path.substring(0, _path.lastIndexOf('/') + 1);
        //var successFunc = function(){ this.seekTo(0); };
        //var errorFunc = function(){ console.log("playAudio():Audio Error: " + err); };
        var func = function(){};
        monaca_sounds = {};
        for(var i=0; i<soundfiles.length; i++){
            var soundfile = soundfiles[i];
            var soundpath = path + soundfile;
            if(!monaca_sounds[soundfile]) monaca_sounds[soundfile] = new Media(soundpath, func, func);
        }
    //}catch(e){}
}

/* sound release for Monaca */
function monaca_sound_release(){
    if(typeof(monaca) === 'undefined') return;
    //try{
        for(var i=0; i<monaca_sounds.length; i++){
            var sound = monaca_sounds[i];
            try{
                sound.stop();
                sound.release();
            }catch(e){
                console.log(e.message);
            }
        }
    //}catch(e){}
}

/* sound play for Monaca */
function monaca_sound_play(soundfile){
    if(typeof(monaca) === 'undefined') return;
    //try{
        var sound = monaca_sounds[soundfile];
        sound.pause();
        sound.seekTo(0);
        sound.play();
    //}catch(e){}
}

/* Extra functiuon for Monaca */
/* ************************** */


/* common final action - at game end, clear or oops */
function GameFinalAction(clear_flg){//override to hack
    if(typeof(monaca) !== 'undefined') monaca_sound_release();
    const filename = "select.html";

    var nextpath;
    if(clear_flg){
      this.endScene.image = this.assets[CLEAR_IMG];
      const params = new URLSearchParams();
      params.append("triumphant", 1);
      nextpath = filename + '?' + params.toString();
    } else {
      this.endScene.image = this.assets[OVER_IMG];
      nextpath = filename;
    }

    const submit = function(){
      window.location = nextpath;
    };
    this.endScene.addEventListener('touchend', submit);
    this.pushScene(this.endScene);
    document.addEventListener('keydown', (e)=>{
      document.removeEventListener('keydown', arguments.callee);
      if(e.key === 'Enter'){ submit(); }
    });
    window.setTimeout(submit, 5000);
}

/* my pad - see enchant.ui.Pad */
MyPadLRU = enchant.Class.create(enchant.Group, {
    initialize: function() {
        enchant.Group.call(this);
        var padImage = this._getPadImageObject();
        var touchPanel = this._getTouchPanelObject(padImage);
        this.addChild(padImage);
        this.addChild(touchPanel);
    },
    _getTouchPanelObject: function(padImage){
        var game = enchant.Game.instance;
        var object = new enchant.Sprite(game.width, game.height);
        object.x = 0; object.y = 0; object.visible = true;

        object.input = { up: false, left: false, right: false };
        object.addEventListener('touchstart', function(e) {
            padImage._startPadFadeAction(e.x, e.y, 0.5);
            this._updateInput(this._detectInput(e.localX, e.localY));
        });
        object.addEventListener('touchend', function(e) {
            padImage._startPadFadeAction(e.x, e.y, 0.0);
            this._updateInput({ up: false, left: false, right: false });
        });
        object.addEventListener('touchmove', function(e) {
          this._updateInput(this._detectInput(e.localX, e.localY));
        });
        object._detectInput = function(x, y) {
            var width = this.width; var height = this.height;

            var cx = padImage.centerX; var cy = padImage.centerY;// center of pad
            var px = this.x + x; var py = this.y + y;// pointed point
            var vx = px - cx; var vy = py - cy;
            var degree = (Math.floor(Math.atan2(vy, vx) * 180 / Math.PI) + 360) % 360;// bottom:0,
            var dist = Math.sqrt( vx * vx + vy * vy);

            var area = Math.floor(degree / 30);
            if (dist <= 12) area = -1;
            switch(area){
                case 8: case 9:
                    return { up: true,  left: false, right: false };
                case 10:
                    return { up: true,  left: false, right: true };
                case 11: case 0: case 1:
                    return { up: false, left: false, right: true };
                case 4: case 5: case 6:
                    return { up: false, left: true,  right: false };
                case 7:
                    return { up: true,  left: true,  right: false };
                default:
                    return { up: false, left: false, right: false };
            }
        };
        object._updateInput = function(input) {
            var game = enchant.Game.instance;
            ['up', 'left', 'right'].forEach(function(type) {
                if (this.input[type] && !input[type] && game.input[type] !== 'undefined') {
                  // game.dispatchEvent(new Event(type + 'buttonup'));
                  game.input[type] = false;
                }
                if (!this.input[type] && input[type] && game.input[type] !== 'undefined') {
                  // game.dispatchEvent(new Event(type + 'buttondown'));
                  game.input[type] = true;
                }
            }, this);
            this.input = input;
        };
        return object;
    },
    _getPadImageObject: function(){
        var game = enchant.Game.instance;
        var image = game.assets[PAD_IMG_LRU];
        var object = new enchant.Sprite(image.width, image.height);
        object.scaleX = 1.0; object.scaleY = 1.0; object.opacity = 0.0; object.opacityDirection = 0.0;
        object.image = image; object.visible = false; object.x = game.width; object.centerX = -1; object.centerY = -1;
        object.addEventListener('enterframe', function(e) {
          if(this.visible){
              this.opacity += (this.opacityDirection - this.opacity) * 0.3;
              var _scale = 1.0 - this.opacity;
              this.scaleX = _scale; this.scaleY = _scale;
              this.x = this.centerX - (image.width / 2); //(image.width * _scale) / 2;
              this.y = this.centerY - (image.height / 2); //(image.height * _scale) / 2;
              if(Math.abs(this.opacity - this.opacityDirection) <= 0.02) this.opacity = this.opacityDirection;
              if(this.opacity === 0) this.visible = false;
          }
        });
        object._startPadFadeAction = function(_centerX, _centerY, opacityTo){
            if(!this.visible){ this.visible = true; this.centerX = _centerX; this.centerY = _centerY; }
            this.opacityDirection = opacityTo;
        };

        return object;
    },
    dummy: function(){}
});

/* map data parser */
var MapDataPerser = enchant.Class.create({
  initialize: function(_gameObj, mapdata){
    this.mapImage = _gameObj.assets[MAP_TILE];
    var maprows = mapdata.replace(/\r\n?/g, "\n").replace(/[ \r\t]/g, "").replace(/\n+/g, "\n").split("\n");
    var rows = maprows.length; var cols = 0;
    for(var i=0; i<rows; i++) cols = Math.max(cols, maprows[i].length / 2);
    var foreMap = []; var backMap = []; var collisionMap = []; this.mapChip = [];
    this.startX = -1; this.startY = -1;
    this.doors = []; this.objects = []; this.monitors = []; this.chars = [];

    var colsData; var foreCols; var backCols; var collisionCols; var rowChips;
    var f; var b; var c; var cu; var cl;
    for(var j=0; j<rows; j++){
      colsData = maprows[j].split("");
      foreCols = []; backCols = []; collisionCols = []; rowChips = [];

      for(var i=0; i<cols; i++){
        cu = colsData.shift(); cl = colsData.shift();
        f = -1; b = -1; c = 0;

        switch(cu){
          case undefined: case "-": case "@": case "*":
            if (cu == "@") {// @ is character
              if (cl == "0"){this.startX = i; this.startY = j; }// 0 is hero
              else { this.chars.push({"mapX": i, "mapY": j, "key": cl}); }
            }
            if (cu == "*") { this.monitors.push({"mapX": i, "mapY": j, "key": cl}); } // * is position monitor
            break;
          default:
            var chip = eval("0x" + cu + cl);
                 if( chip < 0x40){ b = chip; } // back
            else if( chip < 0x80 ){ b = chip; c = 1;}// collision
            else if( chip < 0xC0 ){ f = chip; } // fore
            else if( chip < 0xE0 ){  // door
              var type = (0x0F & chip); var flag = ((0xF0 & chip) == 0xC0);
              this.doors.push({"type": type, "isOpen": flag, "mapX": i, "mapY": j});
            } else {// object
              var type = (0x0F & chip); var flag = ((0xF0 & chip) == 0xF0);
              this.objects.push({"type": type, "default": flag, "mapX": i, "mapY": j});
            }
            break;
        }
        foreCols.push(f); backCols.push(b); collisionCols.push(c); rowChips.push(cu + "" + cl);
      }
      foreMap.push(foreCols); backMap.push(backCols); collisionMap.push(collisionCols);
      this.mapChip.push(rowChips);
    }
    this._foreMap = foreMap; this._backMap = backMap; this._collisionMap = collisionMap;
  },
  foreMap: { get: function(){ return this.makeMap(this._foreMap, this.mapImage, false);}},
  backMap: { get: function(){ return this.makeMap(this._backMap, this.mapImage, true);}},
  makeMap: function(matrix, image, collisionFlg){
    var m = new enchant.Map(16, 16);
    m.image = image; m.loadData(matrix);
    if (collisionFlg) m.collisionData = this._collisionMap;
    return m;
  }

});

/* manage map-monitor object */
var SpriteMonitor = enchant.Class.create(enchant.Sprite, {
  initialize: function(_gameObj, _heroObj, _eventObj, mapX, mapY, key){
    this._gameObj = _gameObj; this._heroObj = _heroObj; this._eventObj = _eventObj; this.key = key;
    enchant.Sprite.call(this, 16, 16); this.frame = 0;
    this.image = _gameObj.assets[DUMMY_IMG];
    this.x = mapX * 16; this.y = mapY * 16; this.mapX = mapX; this.mapY = mapY;
    this.prevState = false;
    this.addEventListener('enterframe', function(e) {
      f = this.isTouch;
      if( f && !this.prevState) { this.touchEvent(); this.prevState = true;}
      if(!f &&  this.prevState) { this.leaveEvent(); this.prevState = false;}
      this.frameEvent();
    });
  },
  touchEvent: function(){ /* alert(touchEvent); */ },
  leaveEvent: function(){ /* alert(leaveEvent); */ },
  frameEvent: function(){ /* alert(frameEvent); */ },
  isTouch: { get: function(){
    //TODO: Under refurbishment, do test!
    //hx = this._heroObj.mapX; hy = this._heroObj.mapY;
    //return (this.mapX == hx && this.mapY == hy);
    if (!this.intersect(this._heroObj)) return false;
    return ( (this.hitLX < this._heroObj.hitRX) && (this.hitRX > this._heroObj.hitLX)
     && (this.hitUY < this._heroObj.hitBY) && (this.hitBY > this._heroObj.hitUY)
    );
  }},
  hitLX: { get: function() { return this.x; } }, // logical hit area left
  hitRX: { get: function() { return this.x + this.width; } }, // logical hit area right
  hitUY: { get: function() { return this.y; } }, // logical hit area upper
  hitBY: { get: function() { return this.y + this.height; } }, // logical hit area bottom
  dummy: function(){}
});

/* manage map-like-object */
var SpriteObjTypes = {
  // frame, L, R, U, B, on, off
  switchCrystal:[ 0, 4, 4,20, 0, SOUND_SWITCH_00, SOUND_SWITCH_00],
  switchUD:     [ 1, 6, 6,16, 1, SOUND_SWITCH_01, SOUND_SWITCH_01],
  switchLR:     [ 2, 5, 5,20, 0, SOUND_SWITCH_01, SOUND_SWITCH_01],
  switchFB:     [ 3, 8, 8,18, 0, SOUND_SWITCH_01, SOUND_SWITCH_01],
  lamp:         [ 4, 8, 8,19, 3, '', ''],
  messageBoard: [ 5, 5, 5,16, 0, '', ''],
  bookBlue:     [ 6, 4, 5,26, 0, '', ''],
  bookRed:      [ 7, 4, 5,26, 0, '', ''],
  bookGreen:    [ 8, 4, 5,26, 0, '', ''],
  boxRed:       [ 9, 4, 4,18, 0, SOUND_OPEN_00, SOUND_CLOSE_00],
  boxOche:      [10, 4, 4,16, 0, SOUND_OPEN_00, SOUND_CLOSE_00],
  boxSquare:    [11, 4, 4,18, 0, SOUND_OPEN_00, SOUND_CLOSE_00],
  indexes: "switchCrystal switchUD switchLR switchFB lamp messageBoard bookBlue bookRed bookGreen boxRed boxOche boxSquare".split(/\s+/)
};
var SpriteObj = enchant.Class.create(enchant.Sprite, {
  initialize: function(_gameObj, _mapObj, _heroObj, _eventObj, mapX, mapY, type, value){
    this._gameObj = _gameObj; this._mapObj = _mapObj; this._heroObj = _heroObj; this._eventObj = _eventObj;
    this.mapX = mapX; this.mapY = mapY;
    enchant.Sprite.call(this, 24, 32); this.image = this._gameObj.assets[MAP_LIKE_OBJ];
    this.x = (this.mapX * this._mapObj.tileWidth) - 4;
    this.y = (this.mapY * this._mapObj.tileHeight) - 16;
    this.type = type[0]; this.soundON = type[5]; this.soundOFF = type[6];
    this.offsetL = type[1]; this.offsetR = type[2]; this.offsetU = type[3]; this.offsetB = type[4];
    this.value = value; this.prevValue = value;
    this.expect = (this.value ? 2 : 0); this.current = this.expect;
    this.touch = this.isTouch; this.prevTouch = this.touch;
    this.addEventListener('enterframe', function(e) { this.enterFrame(e); });
    this.setFrame();
  },
  isTouch: { get: function() {
    if (!this.intersect(this._heroObj)) return false;
    return ( (this.hitLX < this._heroObj.hitRX) && (this.hitRX > this._heroObj.hitLX)
     && (this.hitUY < this._heroObj.hitBY) && (this.hitBY > this._heroObj.hitUY)
    );
  }},
  currentValue: { get: function() { return this.value; } },
  setValue: function(value){ this.expect = (value ? 2 : 0); },
  switchValue: function(){ this.expect = 2- this.expect; /*this.setValue(!this.value);*/ },
  setFrame: function(){ this.frame = this.type * 3 + this.current; },
  enterFrame: function(e){
    // touch
    this.prevTouch = this.touch;
    this.touch = this.isTouch;
    if ( this.touch && !this.prevTouch) this.eventTouch();
    if (!this.touch &&  this.prevTouch) this.eventLeave();
    // changing
    this.prevValue = this.value;
    if ( this.current == this.expect) this.value = (this.current ? true : false);
    if ( this.current >  this.expect) this.current -= 1;
    if ( this.current <  this.expect) this.current += 1;
    if ( this.value !=  this.prevValue) this.eventChange();
    if ( this.value && !this.prevValue) {
      if(this.soundON) {
        if(typeof(monaca) !== 'undefined'){
            monaca_sound_play(this.soundON);
        }else{
            this._gameObj.assets[this.soundON].clone().play();
        }
      }
      this.eventOn();
    }
    if (!this.value &&  this.prevValue) {
      if(this.soundOFF) {
        if(typeof(monaca) !== 'undefined'){
            monaca_sound_play(this.soundOFF);
        }else{
            this._gameObj.assets[this.soundOFF].clone().play();
        }
      }
      this.eventOff();
    }
    // frame
    this.setFrame();
  },
  eventTouch: function(){ /*alert('eventTouch');*/ },
  eventLeave: function(){ /*alert('eventLeave');*/ },
  eventChange: function(){ /*alert('eventChange');*/ },
  eventOn: function(){ /*alert('eventOn');*/ },
  eventOff: function(){ /*alert('eventOff');*/ },
  eventObj: {
    get: function(){return this._eventObj; },
    set: function(v){this._eventObj = v; },
  },
  // logical coordinate
  mapLX: { get: function() { return this.x + 4; } }, // logical map area left
  mapRX: { get: function() { return this.x +20; } }, // logical map area right
  mapUY: { get: function() { return this.y +16; } }, // logical map area upper
  mapBY: { get: function() { return this.y +32; } }, // logical map area bottom
  hitLX: { get: function() { return this.x + this.offsetL; } }, // logical hit area left
  hitRX: { get: function() { return this.x + 24 - this.offsetR; } }, // logical hit area right
  hitUY: { get: function() { return this.y + this.offsetU; } }, // logical hit area upper
  hitBY: { get: function() { return this.y + 32 - this.offsetB; } }, // logical hit area bottom
  dummy: function(){}
});

/* manage character of door object */
var SpriteObjDoors = {
         // type open close
  Wood1: [ 0, SOUND_OPEN_01, SOUND_CLOSE_01 ],
  Wood2: [ 1, SOUND_OPEN_01, SOUND_CLOSE_01 ],
  Wood3: [ 2, SOUND_OPEN_01, SOUND_CLOSE_01 ],
  Wood4: [ 3, SOUND_OPEN_01, SOUND_CLOSE_01 ],
  Iron1: [ 4, SOUND_OPEN_01, SOUND_CLOSE_01 ],
  Iron2: [ 5, "", "" ],
  Iron3: [ 6, "", "" ],
  indexes: "Wood1 Wood2 Wood3 Wood4 Iron1 Iron2 Iron3".split(/\s+/)
}
var SpriteDoor = enchant.Class.create( enchant.Sprite, {
  initialize: function(_gameObj, _mapObj, _charObj, _eventObj, mapX, mapY, type, isOpen){
    this._gameObj = _gameObj; this._mapObj = _mapObj; this._charObj = _charObj; this._eventObj = _eventObj;
    enchant.Sprite.call(this, 24, 32); this.image = this._gameObj.assets[CHAR_DOOR];
    this.mapX = mapX; this.mapY = mapY;
    this.x = (this.mapX * this._mapObj.tileWidth) - 4;
    this.y = (this.mapY * this._mapObj.tileHeight) - 16;
    this.hitLX = this.x; this.hitRX = this.x + 23;
    this.hitUY = this.y; this.hitBY = this.y + 31;
    this.pair = undefined; this.type = type[0]; this.soundOpen = type[1]; this.soundClose = type[2];
    this.isOpen = isOpen; this.touch = this.isTouch; this.prevTouch = this.touch;
    this.addEventListener('enterframe', function(e) { this.enterFrame(e); });
    this.expect = (this.isOpen ? 0 : 3); this.current = this.expect;
    this.addEventListener('enterframe', function(e) { this.enterFrame(e); });
    this.setFrame();
  },
  setPair: function(door){
    if (!door) return;
    this.pair = door; door.pair = this;
    door.current = this.current;
    door.expect = this.expect;
    door.frame = this.frame;
    door.isOpen = this.isOpen;
  },
  into: function(){
    if(!this.pair) throw new Error('pair of door is not.');
    this.touch = false; this.pair.touch = true;
    this.prevTouch = false; this.pair.prevTouch = true;
    this._charObj.mapX = this.pair.mapX; this._charObj.mapY = this.pair.mapY;
    this._charObj.speedX = 0;
  },
  enterFrame: function(){

    //changing
    if(this.current >  this.expect) this.current--;
    if(this.current <  this.expect) this.current++;
    if(this.current == this.expect){
      if (this.current === 0 && !this.isOpen) {
        this.isOpen = true; this.eventChange(); this.eventOpen();
      }
      if (this.current == 3 &&  this.isOpen) {
        this.isOpen = false; this.eventChange(); this.eventClose();
      }
    }

    // touch
    this.prevTouch = this.touch;
    this.touch = this.isTouch;
    if ( this.touch && !this.prevTouch) this.eventTouch();
    if (!this.touch &&  this.prevTouch) this.eventLeave();

    this.setFrame();
  },
  open: function(){
    this.expect = 0; this.setPair(this.pair);
    if(this.soundOpen){
      if(typeof(monaca) !== 'undefined'){
          monaca_sound_play(this.soundOpen);
      }else{
          this._gameObj.assets[this.soundOpen].clone().play();
      }
    }
  },
  close: function(){
    this.expect = 3; this.setPair(this.pair);
    if(this.soundClose){
      if(typeof(monaca) !== 'undefined'){
          monaca_sound_play(this.soundClose);
      }else{
          this._gameObj.assets[this.soundClose].clone().play();
      }
    }
  },
  isTouch: { get: function() {
    if (!this.intersect(this._charObj)) return false;
    return ( (this.hitLX < this._charObj.hitRX) && (this.hitRX > this._charObj.hitLX)
     && (this.hitUY < this._charObj.hitBY) && (this.hitBY > this._charObj.hitUY)
    );
  }},
  setFrame: function(){ this.frame = this.type + (this.current * 8); },
  eventTouch: function(){ /*alert('eventTouch');*/ },
  eventLeave: function(){ /*alert('eventLeave');*/ },
  eventChange: function(){ /*alert('eventChange');*/ },
  eventOpen: function(){ /*alert('eventOn');*/ },
  eventClose: function(){ /*alert('eventOff');*/ },
  dummy: function(){}
});



/* animation frame manage for first-seed-material's character */
var Anime = enchant.Class.create({
    initialize: function() {
        this.counter = 0; this.unit = 4; this.direction = 0; this.state = 0;
        this._loop = [0, 3, 6, 9]; this.back = 0; this.right = 3; this.fore = 6; this.left = 9;
        this._walk = [1, 0, 1, 2]; this.stand = 1; this.jump =  0;
    },
    setAction: function(_action){ this.action = _action; },
    setDirection: function(_direction){ this.direction = _direction; },
    loop: { get: function(){ this.countUp(); return this._loop[this.counter]; } },
    walk: { get: function(){ this.countUp(); return this._walk[this.counter]; } },
    countUp: function(){ this.counter = ++this.counter % this.unit; },
    getNumber: function(){ return this.direction + this.action; },
    dummy: function(){}
});

/* manage character object */
var SpriteChar = enchant.Class.create(enchant.Sprite, {
  initialize: function(
    _gameObj, _mapObj, x, y, width, height, image, offsetH, offsetU, offsetB
  ){
    this._gameObj = _gameObj; this._mapObj = _mapObj;
    enchant.Sprite.call(this, width, height);
    this.image = this._gameObj.assets[image];
    this.frame = 0; this.x = x; this.y = y;
    this.offsetH = offsetH; this.offsetU = offsetU; this.offsetB = offsetB;
    this.addEventListener('enterframe', function(e) { this.enterFrame(e); });
  },
  hitLX: { get: function() { return this.x + this.offsetH; } }, // logical hit area left
  hitRX: { get: function() { return this.x + this.width - this.offsetH; } }, // logical hit area right
  hitUY: { get: function() { return this.y + this.offsetU; } }, // logical hit area upper
  hitBY: { get: function() { return this.y + this.height - this.offsetB; } }, // logical hit area bottom
  hitTestX: function(candiX, _candiMinY, _candiMaxY, tileW, tileH){
    var candiMinY = Math.floor((_candiMinY + 1) / tileH);
    var candiMaxY = Math.floor((_candiMaxY - 1) / tileH);
    for(var candiY = candiMinY; candiY < candiMaxY + 1; candiY++){
      if(this._mapObj.hitTest(candiX, candiY * tileH)) return candiX % tileW;
    }
    return 0;
  },
  hitTestY: function(_candiMinX, _candiMaxX, candiY, tileW, tileH){
    var candiMinX = Math.floor((_candiMinX + 1) / tileW);
    var candiMaxX = Math.floor((_candiMaxX - 1) / tileW);
    for(var candiX = candiMinX; candiX < candiMaxX + 1; candiX++){
      if(this._mapObj.hitTest(candiX * tileW, candiY)) return candiY % tileH;
    }
    return 0;
  },
  mapX: {
    get: function() { return Math.floor((this.x + (this.width / 2)) / this._mapObj.tileWidth); },
    set: function(v) { this.x = (v * this._mapObj.tileWidth) - this.offsetH; }
  },
  mapY: {
    get: function() {
      var h = (this.height - (this.offsetU + this.offsetB)) / 2;
      return Math.floor((this.y + this.offsetU + h)  / this._mapObj.tileHeight);
    },
    set: function(v) { this.y = (((v + 1) * this._mapObj.tileHeight) - 1) - this.height + this.offsetB; }
  },
  dummy: function(){}
});


/* manage character of effect object */
var SpriteObjEffect = {
  "ColdBling": 0, "ColdTwinkle": 1,
  "WarmTwinkle": 2, "WarmBling": 3,
  "Sleeping": 4,
  indexes: "ColdBling ColdTwinkle WarmTwinkle WarmBling Sleeping".split(/\s+/)
};
var CharEffect = enchant.Class.create( SpriteChar, {
  initialize: function(_gameObj, _mapObj, _charObj, type){
    SpriteChar.call( this,
      _gameObj, _mapObj, _charObj.x, _charObj.y, 24/* width */, 32/* height */,
      CHAR_EFFECT/* image */, 0/* offsetH */, 0/* offsetU */, 0 /* offsetB */
    );
    this._charObj = _charObj;
    this.type = type; this.counter = 0;
    this.setFrame(); this.visible = false;
  },
  enterFrame: function(e){
    this.setPosition();
    this.setFrame();
  },
  setPosition: function(){ /* alert('setPosition') */ },
  setFrame: function(){ this.frame = (this.type * 3) + (++this.counter % 3); },
  dummy: function(){}
});


/* manage character of hero object */
var CharHero = enchant.Class.create( SpriteChar, {
  initialize: function(_gameObj, _mapObj, mapX, mapY){
    var offsetH = 3; var offsetB = 0;
    var startX = (mapX * _mapObj.tileWidth) - offsetH;
    var startY = (mapY * _mapObj.tileHeight) - 16 - offsetB;
    SpriteChar.call( this,
      _gameObj, _mapObj, startX, startY, 24/* width */, 32/* height */,
      CHAR_HERO/* image */, offsetH, 5/* offsetU */, offsetB
    );
    this.jump = 10; this.speedX = 0; this.speedY = 0; this.maxspeed = 8; this.accel = 1;
    this.heading = false; this.grounding = false; this.jumpCancelable = false;
    this._autoMode = false;
    this.a = new Anime();
    this.a.setAction(this.a.stand); this.a.setDirection(this.a.fore);
    this.frame = this.a.getNumber();
  },
  autoMode: { set: function(v){ this._autoMode = v; }},
  enterFrame: function(e){
    var gi = (this._autoMode ? {} : this._gameObj.input);
    // console.log(this._gameObj.input);
    var tileW = this._mapObj.tileWidth; var tileH = this._mapObj.tileHeight;
    var acc = this.accel; var ms = this.maxspeed;
    var _frame = this.frame;
    if (gi.left) {
      this.speedX -= acc;
      this.a.setAction(this.a.walk); this.a.setDirection(this.a.left);
    }
    if (gi.right){
      this.speedX += acc;
      this.a.setAction(this.a.walk); this.a.setDirection(this.a.right);
    }
    if(!gi.left && !gi.right){
      if(this.speedX !== 0) { this.speedX -= this.speedX / Math.abs(this.speedX); }
      this.a.setAction(this.a.stand);
    }
    if (this.grounding) {// on the ground
      this.jumpCancelable = false;
      if (gi.up) {
        this.speedY = -this.jump;
        if(typeof(monaca) !== 'undefined'){
            monaca_sound_play(SOUND_JUMP);
        }else{
            this._gameObj.assets[SOUND_JUMP].clone().play();
        }
        this.jumpCancelable = true;
      }
    } else {// free fall
      this.speedY += 1;
      if(this.jumpCancelable){
        if (!gi.up){
          this.speedY = 0;
          this.jumpCancelable = false;
        } else if(this.speedY > 0) {
          this.jumpCancelable = false;
        }
      }
      this.a.setAction(this.a.jump);
    }

    if(this.speedY <= -tileH){ this.speedY =-tileH + 1; }
    if(this.speedY >= tileH){ this.speedY = tileH - 1; }
    if(this.speedX <-ms){ this.speedX =-ms; }
    if(this.speedX > ms){ this.speedX = ms; }
    if(this.speedY <-tileH){ this.speedX =-tileH; }
    var _speedX = this.speedX; var _speedY = this.speedY;
    var protX = 0; var protY = 0;
    if(_speedX !== 0){
      if(_speedX > 0){// go right
        protX = this.hitTestX(this.hitRX + _speedX, this.hitUY, this.hitBY, tileW, tileH);
        if(protX !== 0) { this.speedX = 0; }
      }else{// go left
        protX = this.hitTestX(this.hitLX + _speedX, this.hitUY, this.hitBY, tileW, tileH);
        if(protX !== 0) { protX -= tileW; this.speedX = 0;}
      }
    }
    this.heading = false;
    if(_speedY !== 0){
      if(_speedY > 0){// go down
        protY = this.hitTestY(this.hitLX, this.hitRX, this.hitBY + _speedY, tileW, tileH);
      }else{// go up
        protY = this.hitTestY(this.hitLX, this.hitRX, this.hitUY + _speedY, tileW, tileH);
        if(protY !== 0) { protY -= tileH; this.heading = true; }
      }
    }

    this.x += (_speedX - protX); this.y += (_speedY - protY);
    if (this.speedY < 0) { this.grounding = false; }
    else {
      this.grounding = (this.hitTestY(this.hitLX, this.hitRX, this.hitBY + 1, tileW, tileH) !== 0);
    }
    if (this.heading || this.grounding) this.speedY = 0;
    this.frame = this.a.getNumber();

  },

  setEffect: function(effect){},//todo:
  dummy: function(){}
});


