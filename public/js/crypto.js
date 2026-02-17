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

export async function deriveMasterKey(password, saltHex) {

    // Übergebense password(String) in Bytes wandeln
    const passwordBuffer = stringToBuffer(password);


    // Salt von Hex in Bytes
    // 2 Hex Ziffern ergeben 1 Byte welches zur basis 16 gewandelt wird
    const saltBuffer = new Uint8Array(
        saltHex.match(/.{1,2}/g).map(byte => parseInt(byte,16))
    );
    
    // Erstellung eienss krypto Key Objekt welches benötigt wird für die Ableitung
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        passwordBuffer,
        {name: CONFIG.name},
        false,
        ["deriveKey"]
    );

    const deriveKey = await window.crypto.subtle.deriveKey(
        {
            name: CONFIG.name,
            salt: saltBuffer,
            iterations: CONFIG.iterations,
            hash: CONFIG.hash
        },
        keyMaterial,
        { name: "AES-GCM", lenght:256},
        true,
        ["encrypt", "decrypt"]
    );

    return deriveKey;

}

export function generateSalt(){
    const randomBuffer = window.crypto.getRandomValues(new Uint8Array(16));
    return bufferToHex(randomBuffer);
}