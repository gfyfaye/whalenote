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
          resultMsg.innerHTML = `Your note is sealed! Share this link:<span id="noteLink" class="copyable">${data.link}</span>`;
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
      const originalText = e.target.textContent;

      navigator.clipboard.writeText(originalText)
        .then(() => {
          copiedMessage.classList.add('visible');

          setTimeout(() => {
            copiedMessage.classList.remove('visible');
          }, 1500);
        });
    }
  });
});