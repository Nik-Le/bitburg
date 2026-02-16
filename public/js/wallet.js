import { detectActivity } from './utils.js';

let formVisible = false;
let generatorFormVisible = false;

// Funktion dient dazu, dass die Events erst gehoert werden wenn HTML DOM Fertig gebaut ist

document.addEventListener("DOMContentLoaded", function() {
    const addBtn = document.getElementById("add-button");
    const generatorBtn = document.getElementById("password-generator");
    const generatePasswordBtn = document.getElementById("generate-btn");
    const cancelBtn = document.getElementById("cancel-button");
    const cancleGenerationBtn = document.getElementById("cancel-generation-btn");
    const applyGeneratedPwBtn = document.getElementById("apply-btn"); 
    const cards = document.querySelectorAll('.password-card');

    addBtn.addEventListener("click", function() {
        formVisible ? removeForm("frmPopupForm") : showForm("frmPopupForm");
    });
    generatorBtn.addEventListener("click", function() {
        generatorFormVisible ? removeForm("generator") : showForm("generator");
    });
    generatePasswordBtn.addEventListener("click", function() {
        generatePassword();
    });

    cancelBtn.addEventListener("click", function() {
        formVisible ? removeForm("frmPopupForm") : showForm("frmPopupForm");
    });
    cancleGenerationBtn.addEventListener("click", function() {
        generatorFormVisible = false;
        document.getElementById("generator").style.visibility = "hidden";
    });
    applyGeneratedPwBtn.addEventListener("click", function() {
        let password = document.getElementById("generated-password").value;
        document.getElementById("password-input").value =  password;
        generatorFormVisible = false;
        document.getElementById("generator").style.visibility = "hidden";
    });
    
    cards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('is-flipped');
    });
    });

    //console.log("Starte Activity Tracker für Wallet...");
    
    const ActivityTracker = detectActivity( 
        () => console.log("User ist aktiv"), 
        () => {
             console.log("User ist inaktiv -> Logout wird eingeleitet");
             // Hier den Logout-Prozess starten:
             fetch('/logout', { method: 'POST' })
                .then(() => window.location.href = '/login');
        }, 
        70000 // 5 Minuten (300.000 ms)
    );

    setInterval(() =>{
        const restZeitMs = ActivityTracker.remainingTimeToLogout();
        const restZeitsek = Math.ceil(restZeitMs /1000)%60;
        const restZeitMin = Math.floor(restZeitMs /60000);


        document.getElementById("logoutCountdown").innerText = `Auto-Logout in ${restZeitMin}:${restZeitsek} s`
    }, 1000);

});

function showForm(form) {
    document.getElementById(form).style.visibility = "visible";
    formVisible = true;
}
function removeForm(form) {
    document.getElementById(form).style.visibility = "hidden";
    formVisible = false;
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


// Logout Btn Event Listener 
document.getElementById('logout-img').addEventListener('click', async (e) => {

    e.preventDefault();

    try{
        const response = await fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
    });

    const result = await response.json();

    if(response.ok){
        console.log("erfolgreich ausgellogt");
        window.location.href = "/";
    }

    } catch(error){
        console.log("Fehler beim auslogen", error);
    }

});


