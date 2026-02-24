// passwordGenerator.js

export function generatePassword(length, useNumbers, useUpCase, useLowCase) {
    let selection = [];
    let password = "";

    if (useNumbers) selection.push("number");
    if (useUpCase) selection.push("upCase");
    if (useLowCase) selection.push("lowCase");

    // Falls gar nichts ausgewählt wurde, brechen wir ab
    if (selection.length === 0) return null; 

    for (let i = 0; i < length; i++) {
        let index = Math.floor(Math.random() * selection.length);
        let type = selection.at(index);
        
        if (type === "number") {
            password += randomNumber();
        } else if (type === "upCase") {
            password += randomUpCase();
        } else if (type === "lowCase") {
            password += randomLowCase();
        }
    }
    return password;
}

// Diese Hilfsfunktionen müssen nicht exportiert werden, 
// da sie nur intern in dieser Datei von generatePassword() genutzt werden.
function randomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10 + 48));
}

function randomUpCase() {
    return String.fromCharCode(Math.floor(Math.random() * 26 + 65));
}

function randomLowCase() {
    return String.fromCharCode(Math.floor(Math.random() * 26 + 97));
}