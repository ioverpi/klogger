const stateButton = document.querySelector("#stateButton");
const categorySelector = document.querySelector("#category");
const messageField = document.querySelector("#message");
let currDbName = null;
let currDb = null;
let nextState = null;
const START = "START";
const END = "END";

function init(){
    currDbName = localStorage.getItem("currDbName");
    if(currDbName) openDatabase(currDbName);


    stateButton.addEventListener("click", handleStateChange);
}

function handleStateChange(){
    const objectStore = currDb.transaction("events").objectStore("events");
    const cursorOpen = objectStore.openCursor(null, "prev");
    cursorOpen.addEventListener("error", function(){
        console.log("Error occured in getting the last entry.");
    });
    cursorOpen.addEventListener("success", function(){
        const cursor = this.result;
        if(cursor){
            if(cursor.value.type == START) nextState = END;
            else nextState = START;
        }else{
            nextState = START;
        }
        addEvent(nextState, new Date(), parseInt(categorySelector.value), messageField.value);
    });
}

function openDatabase(dbName){
    if(currDb) currDb.close();
    const request = indexedDB.open(dbName);
    request.addEventListener("error", function(event){
        console.log("Error occurred when opening database.")
        console.log(event);
    });

    request.addEventListener("upgradeneeded", function(event){
        const db = this.result;
        const objectStore = db.createObjectStore("events", {autoIncrement: true});
        objectStore.createIndex("type", "type", {unique: false});
        objectStore.createIndex("date", "date", {unique: true});
        objectStore.createIndex("category", "category", {unique: false});
        objectStore.createIndex("message", "message", {unique: false});
    });



    request.addEventListener("success", function(event){
        currDb = this.result;
        console.log("Loaded up database.");
        //addEvent("START", new Date(), 0, "Finally started research.");
    });
}

function addEvent(type, date, category, message){
    let obj = {type: type, date: date, category: category, message: message};
    const transaction = currDb.transaction(["events"], "readwrite");
    transaction.addEventListener("complete", function(event){
        console.log("Added event!");
    });
    transaction.addEventListener("error", function(event){
        console.log("Error in adding event.");
    });
    const objectStore = transaction.objectStore("events");
    const request = objectStore.add(obj);
}

let results = null;
function getEvents(){
    const objectStore = currDb.transaction("events").objectStore("events");
    objectStore.getAll().addEventListener("success", function(event){
        results =  this.result;
    });
}

window.addEventListener("load", init, false);