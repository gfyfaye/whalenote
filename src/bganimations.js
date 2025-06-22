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


const notearea = document.querySelector('.notearea');
const charError = document.getElementById('charError');
const maxLength = parseInt(notearea.getAttribute('maxlength'));


notearea.addEventListener('input', () => {
  if (notearea.value.length === maxLength) {
    charError.classList.add('visible');
  } else {
    charError.classList.remove('visible');
  }
});