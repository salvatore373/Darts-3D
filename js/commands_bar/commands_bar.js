let playerHint = document.getElementById('player-hint');
let leftTile = document.getElementById('left-tile');
let rightTile = document.getElementById('right-tile');
let scoreIndicator = document.getElementById('score-indicator');

let selectedDirection;
let selectedForce;


function loadHtml(selector, url) {
  return new Promise(resolve => {
    $(selector).load(url, function () {
      resolve();
    });
  })
}

function setInitialView() {
  playerHint.innerText = 'Choose an action';
  scoreIndicator.innerText = '';

  rightTile.innerText = 'Change dart texture';
  rightTile.classList.add('clickable-element');
  // TODO: finish implementing

  leftTile.innerText = 'Play';
  leftTile.classList.add('clickable-element');
  leftTile.onclick = function () {
    setPlayerView();
    leftTile.onclick = undefined
  };

}

async function setPlayerView(event) {
  leftTile.classList.remove('clickable-element');
  rightTile.classList.remove('clickable-element');
  leftTile.innerHTML = '';
  rightTile.innerHTML = '';
  let forceIndicLoad = await loadHtml("#left-tile", "./html/force_selector.html");
  let directionIndicLoad = await loadHtml("#right-tile", "./html/direction_selector.html");
  await Promise.all([forceIndicLoad, directionIndicLoad]);

  // If a new score is passed, update the displayed one
  let score = event === undefined ? undefined : event.detail.score;
  scoreIndicator.innerText = 'Score: ' + (score === undefined ? 0 : score);

  // Display the force and direction selectors and get the selected values
  let selectedCommands = await waitForCommands()

  // Advise all the listeners that the force and direction have been selected
  window.dispatchEvent(new CustomEvent('forceAndDirSelected', {
    detail: selectedCommands
  }));
}

async function waitForCommands() {
  // Await for the user to select the power
  playerHint.innerText = 'Press the space bar to select the power';
  selectedForce = await startForceIndicatorMotion();

  // Await for the user to select the direction
  playerHint.innerText = 'Press the space bar to select the direction';
  selectedDirection = await startDirectionIndicatorMotion();

  return {selectedForce: selectedForce, selectedDirection: selectedDirection};
}

function setGameOverView(event) {
  let score = event.detail.score;
  leftTile.innerHTML = '';
  rightTile.innerHTML = '';
  scoreIndicator.innerText = '';

  playerHint.innerText = 'Game Over'

  leftTile.innerText = 'Try again';
  leftTile.classList.add('clickable-element');
  leftTile.onclick = function () {
    leftTile.onclick = undefined
    location.reload()
  };

  rightTile.innerText = `Score: ${score}`;
}

setInitialView();
// Display and send the commands whenever needed
window.addEventListener('needForCommands', setPlayerView);
// Display the "game over" view when needed
window.addEventListener('gameOver', setGameOverView);
