const stateButton = document.querySelector("#stateButton");
let currDbName = null;
let currDb = null;

function init(){
    currDbName = localStorage.getItem("currDbName");
    if(currDbName) openDatabase(currDbName);


    stateButton.addEventListener("click", function(){
        alert("hi");
    }, false);
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
        addEvent("START", new Date(), 0, "Finally started research.");
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