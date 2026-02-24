/**
 * decrypt.js
 */

/**
 * Converts a hexadecimal string representation into a Uint8Array.
 * * @param {string} hexString - The hex string to convert.
 * @returns {Uint8Array} The resulting byte array.
 */
function hexToBuffer(hexString) {
    return new Uint8Array(
        hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
    );
}

/**
 * Decrypts an encrypted password entry using AES-GCM and parses the resulting JSON.
 * * @param {CryptoKey} masterKey - The master key used for decryption.
 * @param {string} encryptedEntry - The hex-encoded ciphertext to decrypt.
 * @param {string} iv - The hex-encoded initialization vector.
 * @returns {Promise<Object>} A Promise resolving to the decrypted plaintext object.
 * @throws {Error} If decryption fails (e.g., due to an incorrect key or corrupted data).
 */
export async function decryptEntrys(masterKey, encryptedEntry, iv) {
    
    try {
        const ivBytes = hexToBuffer(iv);
        const encryptedEntryBytes = hexToBuffer(encryptedEntry);

        const decryptedBuffer = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: ivBytes
            },
            masterKey,
            encryptedEntryBytes
        );

        const decoder = new TextDecoder();
        const decryptString = decoder.decode(decryptedBuffer);

        return JSON.parse(decryptString);

    } catch(e) {
        console.error("Decryption failed!", e);
        // Most common reason: Incorrect key or manipulated data (AuthTag mismatch)
        throw new Error("Incorrect password or manipulated data");
    }
}