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
    const request = indexedDB.open(dbName);
    request.addEventListener("error", function(event){
        console.log("Error occurred when opening database.")
        console.log(event);
    });
    request.addEventListener("success", function(event){
        currDb = this.result;
    });
}

window.addEventListener("load", init, false);