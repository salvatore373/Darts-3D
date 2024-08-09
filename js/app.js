import * as THREE from 'three';
import {Room, PLANES_DEPTH, WALL_HEIGHT} from 'room';
import DartboardLoader from 'dartboard'
import DartLoader from 'dart'

// Initialize all the needed stuff
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;  // Enable shadows
// Scale if the game becomes performance intensive (and try adding false as thrid argument)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Move the camera
camera.up.set(0, 0, 1);
camera.position.set(0, -5, 3 * WALL_HEIGHT / 4)
// camera.position.set(10,0, 0)  // side view
camera.lookAt(0, 0, 0);

// DEBUG
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// Configure the lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(0, -5, 3 * WALL_HEIGHT / 4);
dirLight.castShadow = true;
// dirLight.shadow.mapSize.width = 1024;
// dirLight.shadow.mapSize.height = 1024;
// dirLight.shadow.camera.left = -400;
// dirLight.shadow.camera.right = 350;
// dirLight.shadow.camera.top = 400;
// dirLight.shadow.camera.bottom = -300;
// dirLight.shadow.camera.near = 100;
// dirLight.shadow.camera.far = 800;
scene.add(dirLight);

// Add room floor and wall to the scene
let room = new Room();
scene.add(room);

// Load the dartboard
DartboardLoader.Load().then(obj => {
  scene.add(obj);
  obj.position.y = room.children[1].position.y - PLANES_DEPTH / 2;
  obj.position.z = WALL_HEIGHT * 3 / 4;
});

// Load the dart
DartLoader.Load().then(obj => {
  scene.add(obj);
  obj.position.z = 1.5;
});

// Add the cube to the scene
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
cube.position.set(0, 0, 1.5);

// Define and add the animation loop
function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
