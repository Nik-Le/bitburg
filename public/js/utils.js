/**
 * Timeout detection
 * This function chekcs for events on the page
 * if the user is inaktive for 5 min the session is automaticly destroyed
 */
export function detectActivity(onActive, onInactive, Intervall){
    let activeTimer; 
    let lastActivity = Date.now();
    

    const markActive = () => {
        lastActivity = Date.now();
        
        clearTimeout(activeTimer);
        activeTimer = setTimeout(() => {
            onInactive();
        }, Intervall);
    };

    const events = ["mousemove", "keydown", "scroll", "touchstart"];

    events.forEach(evt => {
        window.addEventListener(evt, markActive, {passive:true});
    })

    markActive();


    const remainingTimeToLogout = () =>{
        const timePassed = Date.now() - lastActivity;
        const remaining = Intervall - timePassed;
        return Math.max(0,remaining);
    }

    return{
        remainingTimeToLogout: remainingTimeToLogout
    };
}