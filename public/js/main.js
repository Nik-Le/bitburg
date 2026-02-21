import { deriveAllKeys, generateSalt} from './crypto.js';
import {encryptEntry} from './encrypt.js';
import { decryptEntrys} from './decrypt.js';

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

                    const raw = await crypto.subtle.exportKey('raw', masterKey);
                    sessionStorage.setItem('masterKey', JSON.stringify(Array.from(new Uint8Array(raw))));
                    
                    data.authHash = authHash;
                    delete data.password;
                    break;
                }

                case 'frmPopup':
                    const raw = new Uint8Array(JSON.parse(sessionStorage.getItem('masterKey')));
                    const masterKey = await crypto.subtle.importKey(
                        'raw', raw,
                        { name: 'AES-GCM', length: 256 },
                        false,
                        ['encrypt', 'decrypt']
                    );

                    const { iv, cipher } = await encryptEntry(masterKey, data);

                    for (const key in data) {
                        delete data[key];
                    }

                    data.iv = iv;
                    data.entry = cipher;
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

    if (document.getElementById('password-container')) {
        loadAndRenderEntries();
    }
});



async function loadAndRenderEntries() {
    const entries = JSON.parse(document.getElementById('encrypted-data').textContent);
    
    const keyRaw = new Uint8Array(JSON.parse(sessionStorage.getItem('masterKey')));
    const masterKey = await crypto.subtle.importKey(
        'raw', keyRaw,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );

    const list = document.getElementById('password-container');
    list.innerHTML = ''; // Leert die Liste

    for (const entry of entries) {
        console.log(entry);
        const plain = await decryptEntrys(masterKey, entry.entry, entry.iv, );
        
        const li = document.createElement('li');
        li.className = 'password-card';
        li.innerHTML = `
        <div class="inner-card">
            <div class="card-front">
                <strong>${plain.siteName}</strong>
                <button class="setting-btn fa-solid fa-edit" type="button"></button>
                <div class="dropdown is-hidden">
                    <button class="delete-entry-btn" type="button" data-id="${entry._id}">Löschen</button>
                </div>
            </div>
            <div class="card-back">
                <div class="info-row">
                    <span><strong>Eintrags-name:</strong> ${plain.siteName}</span>
                </div>
                <div class="info-row">
                    <span><strong>Benutzername/E-Mail:</strong> ${plain.userName}</span>
                    <button class="copy-button" type="button" data-copy="${plain.userName}">
                        <i class="fa-solid fa-clone"></i>
                    </button>
                </div>
                <div class="info-row">
                    <span><strong>Passwort:</strong> ${plain.password}</span>
                    <button class="copy-button" type="button" data-copy="${plain.password}">
                        <i class="fa-solid fa-clone"></i>
                    </button>
                </div>
            </div>
        </div>`;

    list.appendChild(li);
}

if (entries.length === 0) {
    list.innerHTML = '<li class="password-card">Keine Einträge vorhanden!</li>';
} 
    
    
}