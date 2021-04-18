// This is a JavaScript file
function init(){
    //window.onbeforeunload = function(e){ monaca_sound_release(); };
    GAME_WIDTH = 400;
    GAME_HEIGHT = Math.floor((400 / window.outerWidth) * window.outerHeight);
    initMoriy();
}
function onBackButtonDown(){
    //if(confirm('exit episode?')){
        monaca_sound_release();
        try{
            monaca.popPage(); 
        }catch(e){
            console.log(e.message);
        }
    //}
}