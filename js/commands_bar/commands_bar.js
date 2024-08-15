let playerHint = document.getElementById('player-hint');
let leftTile = document.getElementById('left-tile');
let rightTile = document.getElementById('right-tile');

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

async function setPlayerView() {
  leftTile.classList.remove('clickable-element');
  rightTile.classList.remove('clickable-element');
  let forceIndicLoad = await loadHtml("#left-tile", "./force_selector.html");
  let directionIndicLoad = await loadHtml("#right-tile", "./direction_selector.html");
  await Promise.all([forceIndicLoad, directionIndicLoad]);

  // Await for the user to select the power
  playerHint.innerText = 'Press the space bar to select the power';
  selectedForce = await startForceIndicatorMotion();

  // Await for the user to select the direction
  playerHint.innerText = 'Press the space bar to select the direction';
  selectedDirection = await startDirectionIndicatorMotion();
}

setInitialView();
