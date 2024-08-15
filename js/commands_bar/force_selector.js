const indicator = document.getElementById('force-selector-indicator');
const barContainer = document.getElementById('force-selector');
// const floatingText = document.getElementById('force-selector-floating-text');

let direction = 1; // 1 for right, -1 for left
let position = 0;
const speed = 4; // Increased speed of the indicator movement in pixels
let animationId;

const BAD_FORCE = 0;
const GOOD_FORCE = 1;
const GREAT_FORCE = 2;

// Function to move the indicator
function moveForceIndicator() {
  position += speed * direction;

  if (position <= 0 || position >= barContainer.clientWidth - indicator.clientWidth) {
    direction *= -1; // Change direction if at the edges
  }

  indicator.style.left = position + 'px';
  animationId = requestAnimationFrame(moveForceIndicator); // Continue animation
}

// Function to stop the indicator and display result
function stopForceIndicator() {
  cancelAnimationFrame(animationId); // Stop the animation

  const barWidth = barContainer.clientWidth;
  // let result;

  // Determine the result based on the indicator's position on the gradient
  if (position < barWidth / 5 || position > 4 * barWidth / 5) {
    // result = 'Bad!';
    return BAD_FORCE;
  } else if (position < 2 * barWidth / 5 || position > 3 * barWidth / 5) {
    // result = 'Good!';
    return GOOD_FORCE;
  } else {
    // result = 'Great!';
    return GREAT_FORCE;
  }

  // Trigger text fade and move effect
  // floatingText.textContent = result;
  // floatingText.classList.add('fade-out');
}


function startForceIndicatorMotion() {
  // Start moving the indicator
  moveForceIndicator();

  // Event listener for spacebar to stop the indicator
  return new Promise((resolve) => {
    let res;
    function onSpaceBarPressed(event) {
      if (event.code === 'Space') {
        res = stopForceIndicator();
      }
      document.removeEventListener('keydown', onSpaceBarPressed);
      resolve(res);
    }

    document.addEventListener('keydown', onSpaceBarPressed);
  });
}
