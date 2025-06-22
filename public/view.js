let progress = 0;
const increment = 6;
const maxFrame = 75;
let currFrame = 35;
const maxProgress = 100;
let heartsAnimation;


//setup of heart animation
function setupHeartsAnimation() {
  heartsAnimation = lottie.loadAnimation({
    container: document.getElementById('hearts'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: '/assets/hearts.json'
  });
}

function playHeartsAnimation(x, y) {
  const hearts = document.getElementById('hearts');
  hearts.style.left = `${x}px`; // center it (150 / 2)
  hearts.style.top = `${y}px`;

  if (heartsAnimation) {
    heartsAnimation.goToAndPlay(142, true);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const progressBar = document.getElementById('progressBar');
  const animationcontainer = document.getElementById('animation');

  //if container not loaded
  if (!animationcontainer) {
    console.error('Error finding animation container');
    return;
  }

  setupHeartsAnimation();

  const animation = lottie.loadAnimation({
    container: animationcontainer,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: '/assets/envelope.json'
  });

  //start at frame 35
  animation.addEventListener('DOMLoaded', () => {
    const total = animation.totalFrames; //THERE ARE 105 frames total
    const startframe = 35;
    animation.goToAndStop(startframe, true); 
  });

  //as you click on animation container, progress increments
  animationcontainer.addEventListener('click', (e) => {
    if (currFrame >= maxFrame) {
      // Hide progress UI
      progressContainer.classList.add('hidden');
      document.getElementById('clickPrompt').classList.add('hidden');
      animationcontainer.classList.add('hidden');
      hearts.classList.add('hidden');

      // Show note content
      const noteSheet = document.getElementById('noteSheet');
      noteSheet.classList.remove('hidden');
      requestAnimationFrame(() => {
        noteSheet.classList.add('show');
      });

      return;
    }
    
    let gotoFrame = Math.min(currFrame + increment, maxFrame);
    progress = ((gotoFrame - 35) / (maxFrame - 35)) * 100;
    progressBar.style.width = `${progress}%`;

    // Play frames smoothly one by one
    const playSegment = () => {
      if (currFrame < gotoFrame) {
        currFrame++;
        animation.goToAndStop(currFrame, true);
        requestAnimationFrame(playSegment);
      }
    };
    playSegment();

    //trigger the hearts
    playHeartsAnimation(e.clientX, e.clientY);
  });

});