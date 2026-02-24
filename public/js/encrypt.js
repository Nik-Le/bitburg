/**
 * Converts an ArrayBuffer to a hexadecimal string representation.
 * * @param {ArrayBuffer} buffer - The buffer to convert.
 * @returns {string} The resulting hexadecimal string.
 */
function bufferToHex(buffer) {
    return [...new Uint8Array(buffer)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

/**
 * Encrypts a plaintext password entry using AES-GCM and a securely generated IV.
 * * @param {CryptoKey} masterKey - The master key used for encryption.
 * @param {Object} unencryptedEntry - The plaintext data object to encrypt.
 * @returns {Promise<{iv: string, cipher: string}>} A Promise resolving to an object containing the hex-encoded IV and ciphertext.
 */
export async function encryptEntry(masterKey, unencryptedEntry) {
    // Generate a secure 12-byte initialization vector (IV)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encoder = new TextEncoder();
    const dataString = JSON.stringify(unencryptedEntry);
    const dataBytes = encoder.encode(dataString);

    const cipher = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
         masterKey, 
         dataBytes
    );

    return {
        iv: bufferToHex(iv),
        cipher: bufferToHex(cipher)
    };
}