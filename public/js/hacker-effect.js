document.addEventListener("DOMContentLoaded", () => {
    
    const elements = document.querySelectorAll(".hacker-effect");
    
    // Zeichen, die während des "Verschlüsselns" angezeigt werden sollen
    const letters = "01"; 

    elements.forEach(element => {
        let iteration = 0;
        const originalText = element.dataset.value; // Holt den Text aus data-value
        let interval = null;

        clearInterval(interval);

        interval = setInterval(() => {
            element.innerText = originalText
                .split("")
                .map((letter, index) => {
                    // Wenn der Index kleiner als die Iteration ist, zeige den echten Buchstaben
                    if(index < iteration) {
                        return originalText[index];
                    }
                    
                    // Sonst zeige einen zufälligen "Hacker"-Buchstaben
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");

            // Wenn alle Buchstaben entschlüsselt sind, stoppe den Interval
            if(iteration >= originalText.length){ 
                clearInterval(interval);
            }

            // Geschwindigkeit der Entschlüsselung (je kleiner, desto langsamer)
            iteration += 1 / 3; 
        }, 30); // Geschwindigkeit der Animation (Frames per Millisecond)
    });
});