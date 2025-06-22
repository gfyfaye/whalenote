//stars twinkling

var stars = document.querySelectorAll('.stars');

function twinkle(star) {
    // random opacity to twinkle
    star.style.opacity = Math.random() * 0.5 + 0.5;

    // random timeout btw opacity changes
    setTimeout(() => twinkle(star), Math.random() * 600 + 100);
}

function startTwinkling() {
    stars.forEach((star) => {
        twinkle(star); // Start individual twinkling
    });
}

startTwinkling();
