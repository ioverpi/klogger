let stateButton = null;

function init(){
    stateButton = document.getElementById("stateButton");
    stateButton.addEventListener("click", function(){
        alert("hi");
    }, false);
}


window.addEventListener("load", init, false);