document.addEventListener("DOMContentLoaded", function() {
    const container = document.querySelector('.reviews-container');
    if (!container) return;

    // Intervall in Millisekunden (3000 = 3 Sekunden)
    const scrollInterval = 3000;
    let autoScroll = setInterval(scrollNext, scrollInterval);

    function scrollNext() {
        const card = container.querySelector('.review-card');

        // Wir berechnen die Scroll-Distanz: Breite einer Karte + Lücke (gap: 2rem = ca. 32px)
        // Wenn du den gap im CSS änderst, passe die 32 hier entsprechend an.
        const scrollStep = card.offsetWidth + 32;

        // Prüfen, ob wir am Ende des Containers angekommen sind.
        // Ein kleiner Puffer (-5 Pixel) verhindert, dass es am Ende hängen bleibt.
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
            // Wenn wir am Ende sind, scrolle sanft ganz nach links zurück
            container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            // Ansonsten scrolle um eine Karte nach rechts
            container.scrollBy({ left: scrollStep, behavior: 'smooth' });
        }
    }

    // Ein schönes Extra: Wir pausieren das Scrollen, wenn der Nutzer mit
    // der Maus über die Bewertungen fährt (oder am Handy tippt),
    // damit er in Ruhe lesen kann.
    container.addEventListener('mouseenter', () => clearInterval(autoScroll));
    container.addEventListener('touchstart', () => clearInterval(autoScroll));

    // Fährt er mit der Maus weg, geht es weiter
    container.addEventListener('mouseleave', () => autoScroll = setInterval(scrollNext, scrollInterval));
    container.addEventListener('touchend', () => autoScroll = setInterval(scrollNext, scrollInterval));
});