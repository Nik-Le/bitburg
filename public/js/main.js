/**
 * Forms Daten per fetch an Server
 * @param {string} formId - HTML ID des Forms
 * @param {string} url 
 * @param {string} redirectedUrl
 */

function setupFormSubmit(formId, url, redirectedUrl){

    const form = document.getElementById(formId); // Form über erhalten Id ziehen
    const errorMsgDiv = document.getElementById('error-message');
    if(errorMsgDiv){
        console.log("errorMsgDiv erstellt");
    }
    if (!form) return;

    form.addEventListener('submit', async(e) =>{
        
        e.preventDefault();                         // verhindert neuladen der Wesbite
        const data = Object.fromEntries(new FormData(form));
        const fromData = new FormData(form);
        console.log("1")
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
                if(errorMsgDiv){
                    errorMsgDiv.innerText = result.message || 'Ein Fehler ist aufgetreten';
                    errorMsgDiv.style.display = 'block';
                }else {
                    alert(result.message);
                }
            }

        } catch (error) {
            alert('Netzwerkfehler')
            if (errorMsgDiv) {
                errorMsgDiv.innerText = 'Netzwerkfehler: Server nicht erreichbar.';
                errorMsgDiv.style.display = 'block';
            }
        }
    });
}

// Aufruf sobald die Seite geladen hat 
document.addEventListener('DOMContentLoaded', () =>{

    setupFormSubmit('frmRegister', '/register', '/login');

    setupFormSubmit('frmLogin', '/login', '/wallet');

    setupFormSubmit('frmPopupForm', '/wallet', '/wallet');
});