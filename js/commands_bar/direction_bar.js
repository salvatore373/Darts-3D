const arrow = document.getElementById('arrow');
let animationId;

let angle = -Math.PI / 2; // Start at -π radians
let direction = 1; // 1 for right (increasing angle), -1 for left (decreasing angle)
const speed = 0.19; // Speed of the indicator movement (radians per frame)

const BAD_DIRECTION_LEFT = 0;
const GOOD_DIRECTION_LEFT = 1;
const BAD_DIRECTION_RIGHT = 3;
const GOOD_DIRECTION_RIGHT = 4;
const GREAT_DIRECTION = 2;

// Export the constants
window.directionBarConstants = {
  BAD_DIRECTION_LEFT: BAD_DIRECTION_LEFT,
  GOOD_DIRECTION_LEFT: GOOD_DIRECTION_LEFT,
  BAD_DIRECTION_RIGHT: BAD_DIRECTION_RIGHT,
  GOOD_DIRECTION_RIGHT: GOOD_DIRECTION_RIGHT,
  GREAT_DIRECTION: GREAT_DIRECTION,
}

function moveDirectionIndicator() {
  angle += speed * direction;

  if (angle >= Math.PI / 2 || angle <= -Math.PI / 2) {
    direction *= -1; // Reverse direction at the bounds
  }

  // Convert radians to degrees for CSS transform
  const angleInDegrees = angle * (180 / Math.PI);
  arrow.style.transform = `translateX(-50%) rotate(${angleInDegrees}deg)`;

  animationId = requestAnimationFrame(moveDirectionIndicator); // Continue the animation
}

// Function to stop the arrow (optional)
function stopDirectionIndicator() {
  cancelAnimationFrame(animationId); // Stop the animation

  let totalLength = Math.PI
  let modifiedAngle = angle + Math.PI / 2;

  // Determine the result based on the indicator's position on the gradient
  if (modifiedAngle < totalLength / 5) {
    return BAD_DIRECTION_LEFT;
  } else if (modifiedAngle > 4 * totalLength / 5) {
    return BAD_DIRECTION_RIGHT;
  } else if (modifiedAngle < 2 * totalLength / 5) {
    return GOOD_DIRECTION_LEFT;
  } else if (modifiedAngle > 3 * totalLength / 5) {
    return GOOD_DIRECTION_RIGHT;
  } else {
    return GREAT_DIRECTION;
  }
}


function startDirectionIndicatorMotion() {
  // Start moving the arrow
  moveDirectionIndicator();

  // Event listener for spacebar to stop the arrow
  return new Promise((resolve) => {
    function onSpaceBarPressed(event) {
      let res;
      if (event.code === 'Space') {
        event.preventDefault();
        res = stopDirectionIndicator();

        document.removeEventListener('keydown', onSpaceBarPressed);
        resolve(res);
      }
    }

    document.addEventListener('keydown', onSpaceBarPressed);
  });
}

