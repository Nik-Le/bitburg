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
    list.innerHTML = ''; 

    if (entries.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.className = 'password-card';
        emptyLi.textContent = 'Keine Einträge vorhanden!';
        list.appendChild(emptyLi);
        return;
    }

    for (const entry of entries) {
        const plain = await decryptEntrys(masterKey, entry.entry, entry.iv);

        const li = document.createElement('li');
        li.className = 'password-card';

        const innerCard = document.createElement('div');
        innerCard.className = 'inner-card';

        // --- FRONT SIDE ---
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';

        const title = document.createElement('strong');
        title.textContent = plain.siteName;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-entry-btn';
        deleteBtn.type = 'button';
        deleteBtn.dataset.id = entry._id;

        const trashIcon = document.createElement('i');
        trashIcon.className = 'fa-solid fa-trash';
        deleteBtn.appendChild(trashIcon);

        cardFront.append(title, deleteBtn);

        // --- BACK SIDE ---
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';

        const createInfoRow = (label, value, withCopy = false) => {
            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = `${label}: `;
            p.appendChild(strong);
            p.append(document.createTextNode(value));

            if (withCopy) {
                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-button';
                copyBtn.type = 'button';
                copyBtn.dataset.copy = value;

                const icon = document.createElement('i');
                icon.className = 'fa-solid fa-clone';
                copyBtn.appendChild(icon);
                p.appendChild(copyBtn);
            }

            return p;
        };

        cardBack.appendChild(createInfoRow('Eintrags-name', plain.siteName));
        cardBack.appendChild(createInfoRow('Benutzername/E-Mail', plain.userName, true));
        cardBack.appendChild(createInfoRow('Passwort', plain.password, true));

        innerCard.append(cardFront, cardBack);
        li.appendChild(innerCard);
        list.appendChild(li);
    }
}