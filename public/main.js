//navigation
const pathParts = window.location.pathname.split('/');
const isViewing = pathParts[1] === 'view';
const noteId = pathParts[2];


//handles whether the sendnote or viewnote div is showing
if (isViewing && noteId) {
  document.querySelector('.sendnote').classList.add('hidden');
  document.querySelector('.viewnote').classList.remove('hidden');

  fetch(`/api/viewnote/${noteId}`)
  .then(res => {
    if (!res.ok) {
        console.log("Error retrieving note");
        document.getElementById('noteError').classList.remove('hidden');
    }
    return res.json();
  })
  .then(data => {
    console.log("This is the note content:", data.text);
    if (data.text) {
        document.getElementById('noteInterface').classList.remove('hidden');
        document.getElementById('notecontent').textContent = data.text;
    } else {
        document.getElementById('noteError').classList.remove('hidden');
    }
  })
  .catch(err => {
    console.error('Fetch error:', err);
    document.getElementById('noteError').classList.remove('hidden');
  });

}
else {
    document.querySelector('.sendnote').classList.remove('hidden');
}





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



const audioicon = document.getElementById('audioicon');
const audiocontrol = document.querySelector('.audio-control');
const bgaudio = document.getElementById('bgaudio');
let isPlaying = false;

audiocontrol.onclick = () => {
  if (!isPlaying) {
    bgaudio.play();
    audioicon.src = '/assets/music.png';
    isPlaying = true;
  } else {
    bgaudio.pause();
    audioicon.src = '/assets/nomusic.png';
    isPlaying = false;
  }
};
