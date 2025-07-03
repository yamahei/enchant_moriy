
const storageKey = "Moriy";

function loadData(){
    const rawjson = localStorage.getItem(storageKey);
    if(!rawjson){
        return null;
    }else{
        return JSON.parse(rawjson);
    }
}

function saveData({unlock, last}){
    const data = loadData() ?? {};
    if(unlock !== undefined){
        data.unlock = unlock;
    }else if(data.unlock === undefined){
        data.unlock = -1; // default to -1 if not provided
    }
    if(last !== undefined){
        data.last = last;
    }else if(data.last === undefined){
        data.last = -1; // default to -1 if not provided
    }
    const rawjson = JSON.stringify(data);
    localStorage.setItem(storageKey, rawjson);
}
