const DB_NAME = "WalletDB";
const STORE_NAME = "keys";

/**
 * Opens the IndexedDB database or creates it if it doesn't exist yet.
 * Also handles the setup (upgrade) and creates the required object store.
 *
 * @returns {Promise<IDBDatabase>} A Promise that resolves with the opened database instance.
 */
export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Securely saves the master key in the IndexedDB.
 * * @param {CryptoKey | Uint8Array} rawBytes - The key to be saved (ideally directly the CryptoKey object after the security upgrade).
 * @returns {Promise<void>} A Promise that resolves once the saving process is successfully completed.
 */
export async function saveMasterKey(rawBytes) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const request = store.put(rawBytes, "masterKey"); // Natively saves the CryptoKey object (or Uint8Array)
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

/**
 * Retrieves the stored master key from the IndexedDB.
 * * @returns {Promise<CryptoKey | Uint8Array | undefined>} A Promise that resolves with the retrieved master key. Returns `undefined` if no key was found (e.g., user is not logged in).
 */
export async function getMasterKey() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.get("masterKey");
        request.onsuccess = () => resolve(request.result); // Returns the stored object
        request.onerror = () => reject(request.error);
    });
}

/**
 * Deletes the stored master key from the IndexedDB.
 * This function is strictly required for logout to ensure the key does not remain permanently in the browser.
 * * @returns {Promise<void>} A Promise that resolves once the deletion process was successful.
 */
export async function clearMasterKey() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const request = store.delete("masterKey");
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}