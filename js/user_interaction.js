// All the recognized keys and whether they have been pressed or not
export const actionKeys = {
  SPACEBAR: false,
}


window.addEventListener('keydown', function (e) {
  switch (e.code) {
    case 'Space':
      actionKeys.SPACEBAR = true;
      break;
  }
});
window.addEventListener('keyup', function (e) {
  switch (e.code) {
    case 'Space':
      actionKeys.SPACEBAR = false;
      break;
  }
});
