// keyStore.js
let _masterKey = null;

export function setMasterKey(key) {
    _masterKey = key;
    console.log(_masterKey, "Im Store");
}

export function getMasterKey() {
    if (!_masterKey) throw new Error('Kein Master Key verfügbar – bitte einloggen.');
    return _masterKey;
}

export function clearMasterKey() {
    _masterKey = null;
}