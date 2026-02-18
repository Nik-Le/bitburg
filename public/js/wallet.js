document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        addNewEntryBtn: document.getElementById("add-button"), //Opens up the Entryform
        submitEntryBtn: document.getElementById("submit-entry-button"), //Submits new Entry
        cancelEntryBtn: document.getElementById("cancel-button"),
        editEntryBtn: document.querySelectorAll(".setting-btn"),
        deleteEntryBtn: document.querySelectorAll(".delete-entry-btn"),

        openGeneratorBtn: document.getElementById("password-generator"),
        generatePasswordBtn: document.getElementById("generate-btn"),
        cancleGenerationBtn: document.getElementById("cancel-generation-btn"),
        applyGeneratedPwBtn: document.getElementById("apply-btn"),

        cards: document.querySelectorAll('.password-card'),
        copyPassword: document.getElementById("copy-password"),

        lengthInput: document.getElementById("pw-length"),
        numbersInput: document.getElementById("numbers"),
        upCaseInput: document.getElementById("up-case"),
        lowCaseInput: document.getElementById("low-case"),
        symbolsInput: document.getElementById("symbols"),

        logoutBtn: document.getElementById("logout-btn"),
    };
    elements.addNewEntryBtn.addEventListener("click", () => toggleForm("frmPopup"));
    elements.cancelEntryBtn.addEventListener("click", () => toggleForm("frmPopup"));
    elements.openGeneratorBtn.addEventListener("click", () => toggleForm("generator"));
    elements.cancleGenerationBtn.addEventListener("click", () => toggleForm("generator"));
    elements.generatePasswordBtn.addEventListener("click", () => (
        document.getElementById("generated-password").value = generatePassword()));
    elements.applyGeneratedPwBtn.addEventListener("click", function () {
        let password = document.getElementById("generated-password").value;
        document.getElementById("password-input").value = password;
        toggleForm("generator");
    });
    elements.copyPassword.addEventListener("click", function () {
        let password = document.getElementById("generated-password");
        navigator.clipboard.writeText(password.value);
    });
    elements.cards.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("is-flipped");
        });
    generatePasswordBtn.addEventListener("click", function() {
        console.log("Hallo1")

        if (feedBackElement) feedBackElement.textContent = "";
        if(isPremiumUser){
        generatePassword();
        }
        else{
            console.log("Hallo")
            feedBackElement.textContent = "Premium wird benötigt";
        }
    });

    elements.editEntryBtn.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); //Prevents card flip
            const dropDown = btn.nextElementSibling;
            dropDown.classList.toggle("is-hidden");
        });
    });


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

            } catch(error) {
                console.log("ror")
            }
        });
    });

    function toggleForm(form) {
        let element = document.getElementById(form);
        element.classList.toggle("is-hidden");
    }
    function generatePassword() {
        let selection = [];
        let password = "";
        let length = elements.lengthInput.value

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
    function randomNumber() {
        return String.fromCharCode(Math.floor(Math.random() * 10 + 48));
    }
    function randomUpCase() {
        return String.fromCharCode(Math.floor(Math.random() * 26 + 65));
    }
    function randomLowCase() {
        return String.fromCharCode(Math.floor(Math.random() * 26 + 97));
    }

});
// Logout Btn Event Listener 

document.getElementById('logout-btn').addEventListener('click', async (e) => {

    event.preventDefault();

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