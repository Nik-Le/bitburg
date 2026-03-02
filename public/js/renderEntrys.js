import { decryptEntrys } from './decrypt.js';
import { getMasterKey } from './indexedDB.js';

/**
 * Retrieves the master key from IndexedDB, decrypts the user's password entries,
 * and dynamically renders them as interactive HTML cards in the DOM.
 * * @throws {Error} If the master key is missing from IndexedDB.
 * @returns {Promise<void>}
 */
export async function loadAndRenderEntries() {
    const list = document.getElementById('password-container');
    
    // Retrieve key from IndexedDB
    const masterKey = await getMasterKey();

    if (!masterKey) {
        // Handle error if the user is not logged in
        throw new Error("Master-Key fehlt! Bitte neu einloggen."); 
    }

    const entriesData = document.getElementById('encrypted-data').textContent;
    const entries = entriesData ? JSON.parse(entriesData) : [];

    list.innerHTML = ''; 

    if (entries.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.className = 'password-card';
        emptyLi.textContent = 'Keine Einträge vorhanden!';
        list.appendChild(emptyLi);
        return;
    }

    for (const entry of entries) {
        try {
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
                p.className = 'info-row'; 
                const strong = document.createElement('strong');
                strong.textContent = `${label}: `;
                p.appendChild(strong);
                const textSpan = document.createElement('span');
                textSpan.appendChild(document.createTextNode(value));
                p.appendChild(textSpan);

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

            cardBack.appendChild(createInfoRow('Eintragsname', plain.siteName));
            cardBack.appendChild(createInfoRow('Benutzername/E-Mail', plain.userName, true));
            cardBack.appendChild(createInfoRow('Passwort', plain.password, true));

            innerCard.append(cardFront, cardBack);
            li.appendChild(innerCard);
            list.appendChild(li);
        } catch (e) {
            console.error("Fehler beim Entschlüsseln eines Eintrags", e);
            // Skip corrupted entries or render them as broken
        }
    }
}