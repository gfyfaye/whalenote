document.addEventListener("DOMContentLoaded", () => {
  const notearea = document.querySelector('.notearea');
  if (!notearea) return; 

  const charError = document.getElementById('charError');
  const maxLength = parseInt(notearea.getAttribute('maxlength'));

  // Initial check on load
  if (notearea.value.length >= maxLength) {
    charError.classList.remove('hidden');
  } else {
    charError.classList.add('hidden');
  }

  // Listen for typing
  notearea.addEventListener('input', () => {
    console.log("note length rn:", notearea.value.length);
    if (notearea.value.length >= maxLength) {
      charError.classList.remove('hidden');
    } else {
      charError.classList.add('hidden');
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
          charError.classList.add('hidden');
          notearea.classList.add('hidden');
          document.getElementById('sealsharebtn').classList.add('hidden');
          const resultMsg = document.getElementById('resultMessage');
          resultMsg.classList.remove('hidden');
          // show the word "link" but store the real URL in a data attribute so clicking copies the URL
          resultMsg.innerHTML = `Your note is sealed! Share this <span id="noteLink" class="copyable" data-url="${data.link}">link</span>`;
          document.querySelector('.thought').classList.remove('hidden');
      } else {
        alert(`Failed to send note: ${data.error}`);
      }
    } catch (err) {
      alert("Something went wrong.");
      console.error(err);
    }
  };

  const copiedMessage = document.querySelector('.copiedMessage');

  document.addEventListener('click', function (e) {
    if (e.target.id === 'noteLink') {
      // prefer the hidden URL stored in data-url; fall back to visible text
      const urlToCopy = e.target.getAttribute('data-url') || e.target.textContent;

      navigator.clipboard.writeText(urlToCopy)
        .then(() => {
          copiedMessage.classList.add('visible');

          setTimeout(() => {
            copiedMessage.classList.remove('visible');
          }, 1500);
        });
    }
  });
});