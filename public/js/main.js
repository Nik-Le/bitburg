import { deriveAllKeys, generateSalt } from './crypto.js';
import { encryptEntry } from './encrypt.js';
import { loadAndRenderEntries } from './renderEntrys.js';
import { saveMasterKey, getMasterKey } from './indexedDB.js';

/**
 * Binds a submit event listener to a form, handles cryptographic operations 
 * based on the form ID, and sends the payload to the server via POST.
 * * @param {string} formId - The HTML ID of the form.
 * @param {string} url - The target endpoint for the POST request.
 * @param {string} redirectUrl - The URL to redirect to upon successful submission.
 */
async function setupFormSubmit(formId, url, redirectUrl) {
    const form = document.getElementById(formId);
    const errorMsgDiv = document.getElementById('error-message');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form));

        try {
            switch (formId) {
                case 'frmRegister': {
                    const salt = generateSalt();
                    const { masterKey, authHash } = await deriveAllKeys(data.password, salt);

                    data.salt = salt;
                    data.authHash = authHash;
                    delete data.password;
                    break;
                }

                case 'frmLogin': {
                    // Fetch user's salt from the server
                    const saltResponse = await fetch('/fetchSalt', {
                        method:  'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body:    JSON.stringify({ username: data.username }),
                    });

                    if (!saltResponse.ok) {
                        showError(errorMsgDiv, 'Benutzername existiert nicht.');
                        return;
                    }

                    const { salt } = await saltResponse.json();

                    // Derive master key and auth hash from password + salt
                    const { masterKey, authHash } = await deriveAllKeys(data.password, salt);

                    // Save the raw CryptoKey directly to IndexedDB
                    await saveMasterKey(masterKey);
                    
                    data.authHash = authHash;
                    delete data.password;
                    break;
                }

                case 'frmPopup': {
                    // Retrieve key from IndexedDB
                    const masterKey = await getMasterKey();
                    if (!masterKey) {
                        throw new Error("Master-Key fehlt! Bitte neu einloggen.");
                    }

                    const { iv, cipher } = await encryptEntry(masterKey, data);

                    for (const key in data) {
                        delete data[key];
                    }

                    data.iv = iv;
                    data.entry = cipher;
                    break;
                }

                default:
                    break;
            }
            
            // Send main request
            const response = await fetch(url, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                window.location.href = redirectUrl;
            } else {
                showError(errorMsgDiv, result.message || 'Ein Fehler ist aufgetreten.');
            }

        } catch (error) {
            console.error(error);
            showError(errorMsgDiv, error.message || 'Netzwerkfehler: Server nicht erreichbar.');
        }
    });
}

/**
 * Displays an error message either in a specified HTML container or via a browser alert.
 * * @param {HTMLElement | null} div - The DOM element to display the error in.
 * @param {string} message - The error message to display.
 */
function showError(div, message) {
    if (div) {
        div.innerText      = message;
        div.style.display  = 'block';
    } else {
        alert(message);
    }
}

// Initialize forms and render entries once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    setupFormSubmit('frmRegister', '/register', '/login');
    setupFormSubmit('frmLogin',    '/login',    '/wallet');
    setupFormSubmit('frmPopup',    '/wallet',   '/wallet');

    if (document.getElementById('password-container')) {
        loadAndRenderEntries();
    }
});