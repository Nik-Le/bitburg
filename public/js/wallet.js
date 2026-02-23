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
        if (typeof isPremiumUser !== 'undefined' && isPremiumUser) {
            let pw = generatePassword();
            if (pw) document.getElementById("generated-password").value = pw;
        } else {
            if (elements.feedBackElement) elements.feedBackElement.textContent = "Premium wird für diese Funktion benötigt";
        }
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
    if (elements.passwordContainer) {
        elements.passwordContainer.addEventListener('click', async (event) => {

            // 1. Haben wir auf den Mülleimer geklickt?
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
                return; // Abbruch, damit die Karte nicht flippt
            }

            // 2. NEU: Haben wir auf den Copy-Button geklickt?
            const copyBtn = event.target.closest('.copy-button');
            if (copyBtn) {
                event.stopPropagation(); // Verhindert, dass der Klick an die Karte weitergegeben wird

                const textToCopy = copyBtn.getAttribute("data-copy");
                if (!textToCopy) return;

                try {
                    await navigator.clipboard.writeText(textToCopy);

                    // Visuelles Feedback
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = "✅ Kopiert!";
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                    }, 2000);
                } catch (err) {
                    alert("Kopieren fehlgeschlagen!");
                }

                return; // WICHTIG: Abbruch hier, damit der Code nicht zum Flip-Befehl weiterläuft!
            }

            // 3. Weder Mülleimer noch Copy geklickt? Dann wurde die Karte selbst geklickt -> Flippen!
            const clickedCard = event.target.closest('.password-card');
            if (!clickedCard) return; // Falls ins Leere geklickt wurde, nichts tun

            clickedCard.classList.toggle('is-flipped');
        });
    }

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

    function generatePassword() {
        let length = document.getElementById("pw-length").value;
        let selection = [];
        let password = "";


        if (length <= 7) {
            console.log("Passwort länge mind 8");
            document.getElementById("length-error").classList.remove("is-hidden");
            return null;
        } else {
            document.getElementById("length-error").classList.add("is-hidden");
        }

        elements.numbersInput.checked ? selection.push("number") : null;
        elements.upCaseInput.checked ? selection.push("upCase") : null;
        elements.lowCaseInput.checked ? selection.push("lowCase") : null;


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
        }
        return password;
    }

});


function toggleForm(form) {
    let element = document.getElementById(form);
    element.classList.toggle("is-hidden");
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
