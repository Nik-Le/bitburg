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

    setupFormSubmit('frmPopup', '/wallet', '/wallet');
});