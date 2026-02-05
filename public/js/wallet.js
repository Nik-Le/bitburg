let formVisible = false;
let generatorFormVisible = false;

// Funktion dient dazu, dass die Events erst gehoert werden wenn HTML DOM Fertig gebaut ist

document.addEventListener("DOMContentLoaded", function() {
    const addBtn = document.getElementById("add-button");
    const generatorBtn = document.getElementById("password-generator");
    const generatePasswordBtn = document.getElementById("generate-btn");

    addBtn.addEventListener("click", function() {
        formVisible ? removeForm("password-form") : showForm("password-form");
    });
    generatorBtn.addEventListener("click", function() {
        generatorFormVisible ? removeForm("generator") : showForm("generator");
    });
    generatePasswordBtn.addEventListener("click", function() {
        generatePassword();
    });
})

function showForm(form) {
    document.getElementById(form).style.visibility = "visible";
    form_visible = true;
}
function removeForm(form) {
    document.getElementById(form).style.visibility = "hidden";
    form_visible = false;
}

function generatePassword () {
    let length = document.getElementById("pw-length").value;
    let numbers = document.getElementById("numbers").checked;
    let upCase = document.getElementById("up-case").checked;
    let lowCase = document.getElementById("low-case").checked;
    let selection = []; 
    let password = "";


    if (length <= 7) {
        console.log("Passwort länge mind 8");
        document.getElementById("length-error").style.visibility = "visible";
        return null;
    }else {
        document.getElementById("length-error").style.visibility = "hidden";
    }

    numbers ? selection.push("number") : null;
    upCase ? selection.push("upCase") : null;
    lowCase ? selection.push("lowCase") : null;


    for (let i = 0; i < length; i++) {
        let  index = Math.floor(Math.random() * selection.length);
        let rndm;
        if (selection.at(index) == "number") {
           rndm = randomNumber(); 
        } else if(selection.at(index) == "upCase") {
           rndm = randomUpCase(); 
        }else if(selection.at(index) == "lowCase") {
           rndm = randomLowCase(); 
        }else {
            console.log("Nothing selected");
        }
        if(rndm != null) {
            password = password + rndm;
        }
    }
    document.getElementById("generated-password").value = password;
}
function randomNumber(){
    return String.fromCharCode(Math.floor(Math.random() * 10 + 48));
}
function randomUpCase(){
    return String.fromCharCode(Math.floor(Math.random() * 26 + 65));
}
function randomLowCase(){
    return String.fromCharCode(Math.floor(Math.random() * 26 + 97));
}