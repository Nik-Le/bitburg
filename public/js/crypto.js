/**
 * crypto.js
 * Derives the Master Key and Auth Hash from the user's login password.
 */

/**
 * Configuration object for PBKDF2 security parameters.
 * @constant {Object}
 */
const CONFIG = {
    name: "PBKDF2",
    hash: "SHA-256",
    iterations: 100000
};

/**
 * Converts a string to a Uint8Array.
 * Cryptography operations in the Web Crypto API require byte arrays.
 * * @param {string} str - The string to encode.
 * @returns {Uint8Array} The encoded byte array.
 */
function stringToBuffer(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}

/**
 * Converts an ArrayBuffer to a hexadecimal string for database storage.
 * * @param {ArrayBuffer} buffer - The buffer to convert.
 * @returns {string} The resulting hexadecimal string.
 */
function bufferToHex(buffer) {
    return [...new Uint8Array(buffer)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

/** * Derives a secure master key (for local encryption) and an auth hash (for backend login)
 * from the user's plaintext password and a provided salt.
 * * @param {string} password - The user's plaintext password.
 * @param {string} saltHex - The hexadecimal salt string.
 * @returns {Promise<{masterKey: CryptoKey, authHash: string}>} An object containing the non-extractable master key and the auth hash.
 */
export async function deriveAllKeys(password, saltHex) {
    const passwordBuffer = stringToBuffer(password);
    
    const saltBuffer = new Uint8Array(
        saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
    );
    
    // Create base key material from the password
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        passwordBuffer,
        { name: "PBKDF2" },
        false,
        ["deriveKey", "deriveBits"]
    );

    // MASTER KEY
    // set extractable to FALSE. It cannot be exported or read out of memory! 
    const masterKey = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: saltBuffer,
            iterations: CONFIG.iterations,
            hash: CONFIG.hash
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );

    //THE AUTH HASH (used in Backend Login)
    const authBits = await window.crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: saltBuffer,
            iterations: CONFIG.iterations,
            hash: CONFIG.hash
        },
        keyMaterial,
        256 // We want 256 bits (32 bytes)
    );

    const authHash = bufferToHex(authBits);

    return { masterKey, authHash };
}

/**
 * Generates a cryptographically secure random 16-byte salt.
 * * @returns {string} The newly generated salt as a hexadecimal string.
 */
export function generateSalt() {
    const randomBuffer = window.crypto.getRandomValues(new Uint8Array(16));
    return bufferToHex(randomBuffer);
}