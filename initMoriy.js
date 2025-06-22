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
const ELEMENTID_FOR_TEXTMESSAGE = 'ELEMENTID_FOR_TEXTMESSAGE';
const CLASSNAME_FOR_TEXTMESSAGE = 'CLASSNAME_FOR_TEXTMESSAGE';
function showTextMessage(text){
    const $el = document.createElement("div");
    $el.setAttribute('id', ELEMENTID_FOR_TEXTMESSAGE);
    $el.setAttribute('class', CLASSNAME_FOR_TEXTMESSAGE);
    $el.innerText=text;
    document.body.appendChild($el);
}
function hideTextMessage(){
    const $el = document.getElementById(ELEMENTID_FOR_TEXTMESSAGE);
    if($el){ $el.remove(); }
}