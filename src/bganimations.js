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



//note area
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

//share button
document.getElementById('sealsharebtn').onclick = async () => {
  const noteText = notearea.value;

  //if note is empty
  if (!noteText.trim()) {
    alert("Please write a note before sealing!");
    return;
  }

  try {
    const response = await fetch('/api/note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: noteText })
    });

    const data = await response.json();

    if (response.ok) {
      alert(`Your note is sealed! Share this link: ${data.link}`);
    } else {
      alert(`Failed to send note: ${data.error}`);
    }
  } catch (err) {
    alert("Something went wrong.");
    console.error(err);
  }
};
