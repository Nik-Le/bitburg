import { detectActivity, toggleForm, copyTextWithFeedback } from './utils.js';
import { generatePassword } from './passwordGenerator.js';
import { clearMasterKey } from './indexedDB.js'

/**
 * Initializes all event listeners and UI logic once the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        addNewEntryBtn: document.getElementById("add-button"), 
        submitEntryBtn: document.getElementById("submit-entry-button"), 
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

        lengthInput: document.getElementById("pw-length"),
        numbersInput: document.getElementById("numbers"),
        upCaseInput: document.getElementById("up-case"),
        lowCaseInput: document.getElementById("low-case"),
        symbolsInput: document.getElementById("symbols"),

        logoutBtn: document.getElementById("logout-btn"),

        errorMessage: document.getElementById('error-message')
    };

    // --- Form Toggles ---
    elements.addNewEntryBtn.addEventListener("click", () => toggleForm("frmPopup"));
    elements.cancelEntryBtn.addEventListener("click", () => toggleForm("frmPopup"));
    elements.openGeneratorBtn.addEventListener("click", () => toggleForm("generator"));
    elements.cancleGenerationBtn.addEventListener("click", () => toggleForm("generator"));

    /**
     * Handles the generation of a new password based on user settings.
     * Validates password length and checks for premium user status.
     */
    elements.generatePasswordBtn.addEventListener("click", () => {
        if (typeof isPremiumUser !== 'undefined' && isPremiumUser) {
            
            let length = parseInt(elements.lengthInput.value);
            
            // Length validation
            if (length <= 7) {
                console.log("Passwort länge mind 8");
                document.getElementById("length-error").classList.remove("is-hidden");
                return; 
            } else {
                document.getElementById("length-error").classList.add("is-hidden");
            }

            let pw = generatePassword(
                length, 
                elements.numbersInput.checked, 
                elements.upCaseInput.checked, 
                elements.lowCaseInput.checked,
                elements.symbolsInput.checked
            );

            if (pw) document.getElementById("generated-password").value = pw;

        } else {
            if (elements.feedBackElement) elements.feedBackElement.textContent = "Premium wird für diese Funktion benötigt";
        }
    });

    /**
     * Applies the generated password to the main input field and closes the generator.
     */
    elements.applyGeneratedPwBtn.addEventListener("click", function () {
        let password = document.getElementById("generated-password").value;
        document.getElementById("password-input").value = password;
        toggleForm("generator");
    });

    /**
     * Copies the newly generated password to the clipboard.
     */
    elements.copyPassword.addEventListener("click", function () {
        copyTextWithFeedback(document.getElementById("generated-password").value, elements.copyPassword);
    });

    /**
     * Event delegation for password cards.
     * Handles deleting entries, copying passwords, and flipping the card UI.
     * @param {Event} event - The triggered click event.
     */
    if (elements.passwordContainer) {
        elements.passwordContainer.addEventListener('click', async (event) => {

            // 1. Delete button clicked?
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

            // 2. Copy button clicked?
            const copyBtn = event.target.closest('.copy-button');
            if (copyBtn) {
                event.stopPropagation(); 
                copyTextWithFeedback(copyBtn.getAttribute("data-copy"), copyBtn);
                return; 
            }

            // 3. Card clicked (flip)?
            const clickedCard = event.target.closest('.password-card');
            if (!clickedCard) return; 

            clickedCard.classList.toggle('is-flipped');
        });
    }

    /**
     * Initializes the activity tracker to auto-logout the user after 5 minutes of inactivity.
     * Updates the UI countdown timer every second.
     */
    const ActivityTracker = detectActivity(
        () => {
            fetch('/logout', { method: 'POST' })
                .then(() => window.location.href = '/login');
            clearMasterKey();
        },
        300000 // 5 minutes
    );

    setInterval(() => {
        const{minFormatted, sekFormatted} = ActivityTracker.remainingTimeToLogout();
        document.getElementById("logoutCountdown").innerText = `Auto-Logout in ${minFormatted}:${sekFormatted} s`
    }, 1000);

});

/**
 * Handles the manual logout process.
 * Clears session storage and sends a logout request to the server.
 * @param {Event} e - The triggered click event.
 */
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
            clearMasterKey(); 
            console.log("erfolgreich ausgellogt");
            window.location.href = "/";
        }

    } catch (error) {
        console.log("Fehler beim auslogen", error);
    }
});