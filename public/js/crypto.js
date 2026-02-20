/**
 * Deriveriate the Master Key from the User Login-Password 
 */


/**
 * Config-Struct for security parameters
 */
const CONFIG = {
    name: "PBKDF2",
    hash: "SHA-256",
    iterations: 100000
};


/**
 * String to ArrayBuffer
 * cryptography works in Bytes
 */
function stringToBuffer(str){
    const encoder = new TextEncoder();
    return encoder.encode(str);
}

/**
 * Convertion from BufferArray to Hex for Database Storage
 */
function bufferToHex(buffer){
    return [...new Uint8Array(buffer)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("")
}


/** 
 * Derive MasterKey
 * 
 */

export async function deriveAllKeys(password, saltHex) {
    const passwordBuffer = stringToBuffer(password);
    
    const saltBuffer = new Uint8Array(
        saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
    );
    
    // Basismaterial aus dem Passwort erstellen
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        passwordBuffer,
        { name: "PBKDF2" },
        false,
        ["deriveKey", "deriveBits"]
    );

    // --- 1. DER MASTER-KEY (Verschlüsselung) ---
    // Wir setzen extractable auf FALSE. Er kann nicht ausgelesen werden.
    const masterKey = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: saltBuffer,
            iterations: CONFIG.iterations,
            hash: CONFIG.hash
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false, // <--- SICHERHEIT: Key ist nicht exportierbar
        ["encrypt", "decrypt"]
    );

    // --- 2. DER AUTH-HASH (Backend-Login) ---
    // Wir leiten rohe Bits ab, die wir in einen Hex-String wandeln können.
    // Wichtig: Wir nutzen eine leicht andere Ableitung oder einfach deriveBits,
    // um den "raw" Key-Export zu umgehen.
    const authBits = await window.crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: saltBuffer,
            iterations: CONFIG.iterations,
            hash: CONFIG.hash
        },
        keyMaterial,
        256 // Wir wollen 256 Bits (32 Bytes)
    );

    const authHash = bufferToHex(authBits);

    return { masterKey, authHash };
}

export function generateSalt(){
    const randomBuffer = window.crypto.getRandomValues(new Uint8Array(16));
    return bufferToHex(randomBuffer);
}
