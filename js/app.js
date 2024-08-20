import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import {Room, PLANES_DEPTH, WALL_HEIGHT} from 'room';
import {DartboardLoader, DARTBOARD_LABEL} from 'dartboard'
import {DartLoader, DART_LABEL, PhysicsDart, changeDefaultDartTexture} from 'dart'
import ReflectingTable from 'reflecting_table'

// The coordinates where the dart should be placed when it has to be launched
const THROWING_POSITION = new THREE.Vector3(0.2, 5.5, (3 / 4) * WALL_HEIGHT);
// A reference to the dart to be launched (as PhysicsDart)
let dartToBeLaunched;
// The list of the remaining darts (as THREE.Group)
let remainingDarts = [];

// The points scored by the player
let score = 0;

// Initialize the list of Mesh objects that will populate the scene
let sceneMeshes = [];

// Initialize all the needed stuff
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('game-view')});
renderer.shadowMap.enabled = true;  // Enable shadows
// Scale if the game becomes performance intensive (and try adding false as thrid argument)
renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);
document.getElementById('game-container').appendChild(renderer.domElement);
// Move the camera
camera.up.set(0, 0, 1);
camera.position.set(THROWING_POSITION.x, THROWING_POSITION.y - 3.5, THROWING_POSITION.z + 0.5);

// DEBUG
// scene.background = new THREE.Color(0x7792cc);
scene.background = new THREE.Color(0x000000);

const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.enableDamping = true;

// Configure the lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(0, -5, 3 * WALL_HEIGHT / 4);
dirLight.castShadow = true;
scene.add(dirLight);

// Add room floor and wall to the scene
let room = new Room();
scene.add(room);
sceneMeshes.push(...room.children);
for (let c of room.children) c.geometry.computeBoundingBox();

// Load the dartboard
DartboardLoader.Load().then(obj => {
  scene.add(obj);

  sceneMeshes.push(obj);
  obj.children[0].geometry.computeBoundingBox();

  obj.position.y = room.children[1].position.y - PLANES_DEPTH / 2;
  obj.position.z = WALL_HEIGHT * 3 / 4;

  camera.lookAt(obj.position.x, obj.position.y, obj.position.z);
  orbitControls.target.copy(obj.position);
});

// Load the dart to be launched
DartLoader.Load().then(obj => {
  scene.add(obj);

  sceneMeshes.push(obj);
  obj.children[0].geometry.computeBoundingBox();

  dartToBeLaunched = new PhysicsDart(obj, new THREE.Vector3(0, 0, 0));
  dartToBeLaunched.freezePosition();

  // obj.position.z = (3 / 4) * WALL_HEIGHT;
  // obj.position.y = 5.5;
  obj.position.copy(THROWING_POSITION);
});

/*
// Add cubes to the scene
// Cube 1
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
let group1 = new THREE.Group();
const boxGroup1 = new THREE.BoxHelper(cube, 0xffff00);
group1.add(cube);
group1.add(boxGroup1);
scene.add(group1);
sceneMeshes.push(group1);
group1.children[0].geometry.computeBoundingBox();
group1.position.set(0, 0, PLANES_DEPTH + 5);
// Cube 2
const material2 = new THREE.MeshBasicMaterial({color: 0xfcba03});
const cube2 = new THREE.Mesh(geometry, material2);
let group2 = new THREE.Group();
group2.add(cube2);
// scene.add(group2);
// sceneMeshes.push(group2);
group2.children[0].geometry.computeBoundingBox();
group2.position.set(0, 5, PLANES_DEPTH + 5);
// Add physics
let physicalCube1 = new PhysicalObject(group1, new THREE.Vector3(0, 0, 0));
let physicalCube2 = new PhysicalObject(group2, new THREE.Vector3(0, 0, 0));*/

// Put a table in the scene
const reflectingTable = new ReflectingTable();
scene.add(reflectingTable);
reflectingTable.position.set(1, 1.1, 1.25);

// Put the remaining darts on the table
for (let i = 0; i < 2; i++) {
  DartLoader.Load().then(obj => {
    scene.add(obj);

    sceneMeshes.push(obj);
    obj.children[0].geometry.computeBoundingBox();

    reflectingTable.putOnTable(obj);

    remainingDarts.push(obj);
  });
}

// Define and add the animation loop
function animate() {
  reflectingTable.updateCamera(renderer, scene);
  renderer.render(scene, camera);

  if (dartToBeLaunched != null) {
    dartToBeLaunched.updatePosition(sceneMeshes);

    // if (actionKeys.SPACEBAR && !dartToBeLaunched.launched) {
    //   dartToBeLaunched.launch(0, 0.8, 0);
    // }
  }

  // physicalCube1.reactToCollision(sceneMeshes);
  // physicalCube1.updatePosition();
  // physicalCube2.reactToCollision(sceneMeshes);
}

function launchDart(event) {
  let selectedForce = event.detail.selectedForce;
  let selectedDirection = event.detail.selectedDirection;
  let velocityX = 0;
  let velocityY = 0;
  let velocityZ = 0;

  // Choose the appropriate dart velocity based on the selected force and direction
  switch (selectedForce) {
    case window.forceBarConstants.GREAT_FORCE:
      velocityY = 0.8;
      score += 100;
      break;
    case window.forceBarConstants.GOOD_FORCE:
      velocityY = 0.5;
      score += 60;
      break;
    case window.forceBarConstants.BAD_FORCE:
      velocityY = 0.2;
      score += 30;
      break;
  }
  switch (selectedDirection) {
    case window.directionBarConstants.BAD_DIRECTION_LEFT:
      velocityX = -0.4;
      score -= 30;
      break;
    case window.directionBarConstants.BAD_DIRECTION_RIGHT:
      velocityX = 0.4;
      score -= 30;
      break;
    case window.directionBarConstants.GOOD_DIRECTION_LEFT:
      velocityX = -0.2;
      score -= 15;
      break;
    case window.directionBarConstants.GOOD_DIRECTION_RIGHT:
      velocityX = 0.2;
      score -= 15;
      break;
    case window.directionBarConstants.GREAT_DIRECTION:
      velocityX = 0;
      break;
  }

  // Generate some random velocity so that the darts do not hit the dartboard always in the same point
  let randErrX = Math.random() / 10;
  if (Math.random() > 0.5)
    randErrX *= -1;
  let randErrZ = Math.random() / 10;
  if (Math.random() > 0.5)
    randErrZ *= -1;

  // Launch the dart with the chosen velocity
  dartToBeLaunched.launch(velocityX + randErrX, velocityY, velocityZ + randErrZ);

  // Wait for the dart to reach the dartboard or the ground
  setTimeout(() => {
    if (remainingDarts.length > 0) {
      // There are still some darts to be thrown, then take one and put it in the right position
      let newDart = remainingDarts.pop();
      newDart.position.copy(THROWING_POSITION);
      dartToBeLaunched = new PhysicsDart(newDart, new THREE.Vector3(0, 0, 0));
      dartToBeLaunched.freezePosition();

      // Display and send the commands
      window.dispatchEvent(new CustomEvent('needForCommands', {
        detail: {
          score: score
        }
      }));
    } else {
      // No darts are left to be launched, then advice the listeners that the game is over
      window.dispatchEvent(new CustomEvent('gameOver', {
        detail: {
          score: score
        }
      }));
    }
  }, 1000);
}

async function changeDartsTexture(event) {
  let newTexture = event.detail.newTexture;
  changeDefaultDartTexture(newTexture);

  // dartToBeLaunched
  let oldObj = dartToBeLaunched.object;
  scene.remove(oldObj);
  dartToBeLaunched.object = await DartLoader.Load(newTexture);
  dartToBeLaunched.object.position.copy(oldObj.position);
  dartToBeLaunched.object.rotation.copy(oldObj.rotation);
  dartToBeLaunched.object.children[0].geometry.computeBoundingBox();
  sceneMeshes.splice(sceneMeshes.indexOf(oldObj), 1, dartToBeLaunched.object);
  scene.add(dartToBeLaunched.object);

  for (let i = 0; i < remainingDarts.length; i++) {
    let oldObj = remainingDarts[i];
    scene.remove(oldObj);
    let newObj= await DartLoader.Load(newTexture);
    newObj.position.copy(oldObj.position);
    newObj.rotation.copy(oldObj.rotation);
    newObj.children[0].geometry.computeBoundingBox();
    sceneMeshes.splice(sceneMeshes.indexOf(oldObj), 1, newObj);
    scene.add(newObj);
    remainingDarts.splice(i, 1, newObj);
  }
}

// Launch the dart whenever the force and direction have been selected
window.addEventListener('forceAndDirSelected', launchDart);
// When requested, change the texture of all the darts in the scene
window.addEventListener('changeTexture', changeDartsTexture);
// Start the animation loop
renderer.setAnimationLoop(animate);
