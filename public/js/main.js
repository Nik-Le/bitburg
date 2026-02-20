import { deriveAllKeys, generateSalt} from './crypto.js';
import {encryptEntry} from './encrypt.js';
import { setMasterKey,getMasterKey, clearMasterKey} from './keyStore.js';

/**
 * Bindet einen Submit-Handler an ein Formular und sendet die Daten per fetch an den Server.
 * @param {string} formId       - HTML-ID des Formulars
 * @param {string} url          - Ziel-URL für den POST-Request
 * @param {string} redirectUrl  - URL für die Weiterleitung nach Erfolg
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
                    const salt      = generateSalt();
                    const { masterKey, authHash } = await deriveAllKeys(data.password, salt);

                    data.salt     = salt;
                    data.authHash = authHash;
                    delete data.password;
                    break;
                }

                case 'frmLogin': {
                    // Salt des Nutzers vom Server abrufen
                    const saltResponse = await fetch('/fetchSalt', {
                        method:  'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body:    JSON.stringify({ username: data.username }),
                    });

                    if (!saltResponse.ok) {
                        throw new Error('Salt konnte nicht abgerufen werden.');
                    }

                    const { salt } = await saltResponse.json();

                    // Master Key und Auth Hash aus Passwort + Salt ableiten
                    const { masterKey, authHash } = await deriveAllKeys(data.password, salt);

                    setMasterKey(masterKey);
                    

                    data.authHash = authHash;
                    delete data.password;
                    break;
                }

                case 'frmPopup':
                    getMasterKey();
                    console.log(getMasterKey());                        // Should log: CryptoKey {type: 'secret', ...}
                    console.log(getMasterKey() instanceof CryptoKey);
                    const{iv, cipher} =  await encryptEntry(getMasterKey(),data);
                    for (const key in data) {
                         delete data[key]; 
                    }

                    data.iv = iv;
                    data.cipherEntry = cipher;
                    

                    break;

                default:
                    break;
            }
            
            // Haupt-Request absenden
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
            showError(errorMsgDiv, 'Netzwerkfehler: Server nicht erreichbar.');
        }
    });
}

/**
 * Zeigt eine Fehlermeldung an – im Error-Div oder als Alert-Fallback.
 * @param {HTMLElement|null} div
 * @param {string} message
 */
function showError(div, message) {
    if (div) {
        div.innerText      = message;
        div.style.display  = 'block';
    } else {
        alert(message);
    }
}

// Formulare registrieren, sobald das DOM bereit ist
document.addEventListener('DOMContentLoaded', () => {
    setupFormSubmit('frmRegister', '/register', '/login');
    setupFormSubmit('frmLogin',    '/login',    '/wallet');
    setupFormSubmit('frmPopup',    '/wallet',   '/wallet');
});