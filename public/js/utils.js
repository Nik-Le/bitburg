/**
 * Monitors user activity and triggers a callback after a period of inactivity.
 * * @param {Function} onInactive - Callback executed when the timeout is reached.
 * @param {number} interval - Inactivity threshold in milliseconds.
 * @returns {Object} An object containing the `remainingTimeToLogout` method.
 */
export function detectActivity(onInactive, intervall){
    let activeTimer; 
    let lastActivity = Date.now();
    

    const markActive = () => {
        lastActivity = Date.now();
        clearTimeout(activeTimer);
        activeTimer = setTimeout(() => {
            onInactive();
        }, intervall);
    };

    const events = ["mousemove", "keydown", "scroll", "touchstart"];

    events.forEach(evt => {
        window.addEventListener(evt, markActive, {passive:true});
    })

    markActive();


    const remainingTimeToLogout = () =>{
        const timePassed = Date.now() - lastActivity;
        const remainingTime = Math.max(0, intervall - timePassed)
    
        const gesamtSek = Math.ceil(remainingTime / 1000);
        const restZeitsek =  gesamtSek % 60;
        const restZeitMin = Math.floor( gesamtSek / 60);

        return {
            minFormatted: String(restZeitMin).padStart(2, '0'),
            sekFormatted:  String(restZeitsek).padStart(2, '0')
        }
    }

    return{
        remainingTimeToLogout: remainingTimeToLogout
    };
}


/**
 * Toggles the visibility of an element (via the 'is-hidden' CSS class).
 * @param {string} formId - The ID of the HTML element.
 */
export function toggleForm(formId) {
    let element = document.getElementById(formId);
    if (element) element.classList.toggle("is-hidden");
}


/**
 * Copies text to the clipboard and shows temporary visual feedback.
 * @param {string} textToCopy - The text to be copied.
 * @param {HTMLElement} [buttonElement] - (Optional) The element whose text should change temporarily.
 */
export async function copyTextWithFeedback(textToCopy, buttonElement) {
    if (!textToCopy) return;

    try {
        await navigator.clipboard.writeText(textToCopy);
        
        if (buttonElement) {
            const originalText = buttonElement.innerHTML;
            buttonElement.innerHTML = "✅ Kopiert!";
            setTimeout(() => {
                buttonElement.innerHTML = originalText;
            }, 2000);
        }
    } catch (err) {
        alert("Kopieren fehlgeschlagen!");
    }
}