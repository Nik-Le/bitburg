/**
 * 
 */

function hexToBuffer(hexString){
    return new Uint8Array(
      hexString.match(/.{1,2}/).map(byte => parseInt(16))  
    );
}

export async function decryptEntrys(masterKey, encryptedEntry, iv) {
    
    try{
        const ivBytes= hexToBuffer(iv);
        const encryptedEntryBytes= (encryptedEntry);

        const decryptedBuffer = window.crypto.subtle.decrypt(
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

    }catch(e){
        console.error("Entschlüsselung fehlgeschlagen!", e);
        // Häufigster Grund: Falscher Key oder manipulierte Daten (AuthTag passt nicht)
        throw new Error("Falsches Passwort oder manipulierte Daten");
    }


}