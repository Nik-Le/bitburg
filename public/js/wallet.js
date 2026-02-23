import { detectActivity } from './utils.js';


document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        addNewEntryBtn: document.getElementById("add-button"), //Opens up the Entryform
        submitEntryBtn: document.getElementById("submit-entry-button"), //Submits new Entry
        cancelEntryBtn: document.getElementById("cancel-button"),
        deleteEntryBtn: document.querySelectorAll(".delete-entry-btn"),

        openGeneratorBtn: document.getElementById("password-generator"),
        generatePasswordBtn: document.getElementById("generate-btn"),
        feedBackElement: document.getElementById("premium-feedback"),
        cancleGenerationBtn: document.getElementById("cancel-generation-btn"),
        applyGeneratedPwBtn: document.getElementById("apply-btn"),
        passwordContainer: document.getElementById('password-container'),

        cards: document.querySelectorAll('.password-card'),
        copyPassword: document.getElementById("copy-password"),
        copyButtons: document.querySelectorAll(".copy-button"),

        lengthInput: document.getElementById("pw-length"),
        numbersInput: document.getElementById("numbers"),
        upCaseInput: document.getElementById("up-case"),
        lowCaseInput: document.getElementById("low-case"),
        symbolsInput: document.getElementById("symbols"),

        logoutBtn: document.getElementById("logout-btn"),

        errorMessage: document.getElementById('error-message')
    };
    elements.addNewEntryBtn.addEventListener("click", () => toggleForm("frmPopup"));
    elements.cancelEntryBtn.addEventListener("click", () => toggleForm("frmPopup"));
    elements.openGeneratorBtn.addEventListener("click", () => toggleForm("generator"));
    elements.cancleGenerationBtn.addEventListener("click", () => toggleForm("generator"));
    elements.generatePasswordBtn.addEventListener("click", () => {
            let pw = generatePassword();
            if (pw) document.getElementById("generated-password").value = pw;
    });
    elements.applyGeneratedPwBtn.addEventListener("click", function () {
        let password = document.getElementById("generated-password").value;
        document.getElementById("password-input").value = password;
        toggleForm("generator");
    });
    elements.copyPassword.addEventListener("click", function () {
        let password = document.getElementById("generated-password");
        navigator.clipboard.writeText(password.value);
    });
    /*elements.cards.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("is-flipped");
        });
    });*/
    // Wir suchen uns den Container, der die Karten hält (der ist von Anfang an im HTML)

    if (elements.passwordContainer) {
        elements.passwordContainer.addEventListener('click', async (event) => {

            // 1. Haben wir auf einen Button geklickt (Mülleimer oder Kopieren)?
            // Wenn ja -> Abbruch, die Karte soll beim Kopieren nicht flippen!
            const delteBtn = event.target.closest('.delete-entry-btn');
            if (delteBtn) {
                event.stopPropagation();
                const btnId = delteBtn.getAttribute("data-id");

                try {
                    const response = await fetch(`/wallet/delete/${btnId}`, {
                        method: 'POST',
                    });
                    if (response.ok) {
                        window.location.reload();
                    } else {
                        console.error("Löschen fehlgeschlagen");
                    }

                } catch (error) {
                    console.error("Löschen fehlgeschlagen");
                }
                return;
                }

            const clickedCard = event.target.closest('.password-card');

            if (!clickedCard) return; //Falls die Karte nicht gefunden wird, soll nichts passieren

            clickedCard.classList.toggle('is-flipped');
        });
    }
    elements.deleteEntryBtn.forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const btnId = btn.getAttribute("data-id");

            try {
                const response = await fetch(`/wallet/delete/${btnId}`, {
                    method: 'POST',
                });
                if (response.ok) {
                    window.location.reload();
                } else {
                    console.error("Löschen fehlgeschlagen");
                }

            } catch (error) {
                console.log("ror")
            }
        });
    });
    elements.copyButtons.forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            // Den Text aus dem data-copy Attribut holen
            const textToCopy = btn.getAttribute("data-copy");

            if (!textToCopy) return;

            try {
                // Text in die Zwischenablage schreiben
                await navigator.clipboard.writeText(textToCopy);

                // Visuelles Feedback für den Nutzer (Optional, aber empfohlen)
                const originalText = btn.innerHTML;
                btn.innerHTML = "✅ Kopiert!";

                // Nach 2 Sekunden den Text wieder zurücksetzen
                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);

            } catch (err) {
                alert("Kopieren fehlgeschlagen!");
            }
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

    setInterval(() => {
        const restZeitMs = ActivityTracker.remainingTimeToLogout();
        const gesamtSek = Math.ceil(restZeitMs / 1000)
        const restZeitsek = gesamtSek % 60;
        const restZeitMin = Math.floor(gesamtSek / 60);

        const minFormatted = String(restZeitMin).padStart(2, '0');
        const sekFormatted = String(restZeitsek).padStart(2, '0');


        document.getElementById("logoutCountdown").innerText = `Auto-Logout in ${minFormatted}:${sekFormatted} s`
    }, 1000);
    function generatePassword () {
        let length = elements.lengthInput.value;
        let selection = [];
        let password = "";


    for (let i = 0; i < length; i++) {
        let index = Math.floor(Math.random() * selection.length);
        let rndm;
        if (selection.at(index) == "number") {
            rndm = randomNumber();
        } else if (selection.at(index) == "upCase") {
            rndm = randomUpCase();
        } else if (selection.at(index) == "lowCase") {
            rndm = randomLowCase();
        } else {
            console.log("Nothing selected");
        }
        if (rndm != null) {
            password = password + rndm;
        }
        return password;
    }
});


function toggleForm(form) {
        let element = document.getElementById(form);
        element.classList.toggle("is-hidden");
}


function showForm(form) {
    document.getElementById(form).style.visibility = "visible";
    formVisible = true;
}


function removeForm(form) {
    document.getElementById(form).style.visibility = "hidden";
    formVisible = false;
}


function getPremiumUserValue(){
    user._id = req.session.userId;
    const user = User.findOne({id: user._id});
    if (user && user.premiumuser) {
        return true;
    }
    else{
        alert("Requires premium version")
        return false;
    }
}
    function randomNumber() {
        return String.fromCharCode(Math.floor(Math.random() * 10 + 48));
    }
    function randomUpCase() {
        return String.fromCharCode(Math.floor(Math.random() * 26 + 65));
    }
    function randomLowCase() {
        return String.fromCharCode(Math.floor(Math.random() * 26 + 97));
    }
    return password;
}
function randomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10 + 48));
}
function randomUpCase() {
    return String.fromCharCode(Math.floor(Math.random() * 26 + 65));
}

function randomLowCase() {
    return String.fromCharCode(Math.floor(Math.random() * 26 + 97));
}


// Logout Btn Event Listener 
document.getElementById('logout').addEventListener('click', async (e) => {

    e.preventDefault();
    sessionStorage.clear();
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const result = await response.json();

        if (response.ok) {
            console.log("erfolgreich ausgellogt");
            window.location.href = "/";
        }

    } catch (error) {
        console.log("Fehler beim auslogen", error);
    }

});
