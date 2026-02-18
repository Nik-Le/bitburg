/**
 * Encrypt the password Entrys from the Wallet
 */

function bufferToHex(buffer){
    return [...new Uint8Array(buffer)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}


export async function encryptEntry(masterKey, unencryptedEntry){

    const iv = window.crypto.getRandomValues(new Uint8Array(12));


    const encoder = new TextEncoder();
    const dataString = JSON.stringify(unencryptedEntry);
    const dataBytes = encoder.encode(dataString);

    const cipher = window.crypto.subtle.encrypt(
        {name: "AES-GCM",
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