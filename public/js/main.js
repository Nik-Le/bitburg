import { deriveMasterKey, generateSalt, createAuthHash } from './crypto.js';

/**
 * Forms Daten per fetch an Server
 * @param {string} formId - HTML ID des Forms
 * @param {string} url 
 * @param {string} redirectedUrl
 */


function setupFormSubmit(formId, url, redirectedUrl){

    const form = document.getElementById(formId); // Form über erhalten Id ziehen

    if (!form) return;

    form.addEventListener('submit', async(e) =>{
        
        e.preventDefault();                         // verhindert neuladen der Wesbite

        const data = Object.fromEntries(new FormData(form));

        switch(formId){
            case 'frmRegister':
                const salt = generateSalt();
                const masterKey = await deriveMasterKey(data.password, salt);
                const authHash = await createAuthHash(masterKey)
                data.salt = salt;
                data.authHash = authHash;
                delete data.password;
                console.log(data);
                break;
            case 'frmLogin':
                const responseSalt = await fetch("/login/fetchSalt",{
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                });
                break;
            case 'frmPopupForm':
                pass;
                break;
            default:
        }



        try {          
            const response = await fetch(url, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json'},
               body: JSON.stringify(data) 
            });

            const result = await response.json();

            if (response.ok) {
                window.location.href = redirectedUrl;
            } else{
                console.error('Server Fehler' , result);
            }

        } catch (error) {
            console.error(error);
            alert('Netzwerkfehler')
        }
    });
}

// Aufruf sobald die Seite geladen hat 
document.addEventListener('DOMContentLoaded', () =>{

    setupFormSubmit('frmRegister', '/register', '/login');

    setupFormSubmit('frmLogin', '/login', '/wallet');

    setupFormSubmit('frmPopupForm', '/wallet', '/wallet');
    
});