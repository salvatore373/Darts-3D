import * as THREE from 'three';
import Room from 'room';

// Initialize all the needed stuff
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
const renderer = new THREE.WebGLRenderer();
// Scale if the game becomes performance intensive (and try adding false as thrid argument)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Move the camera
camera.up.set(0,0,1);
camera.position.set(0, -5, 5)
// camera.position.set(10,0, 0)  // side view
camera.lookAt(0, 0, 0);

// Add room floor and wall to the scene
let room = new Room();
scene.add(room);

// const planeGeometry = new THREE.PlaneGeometry(10, 10);
// const planeMaterial = new THREE.MeshBasicMaterial( {color: 0x4c72ad, side: THREE.DoubleSide} );
// const room = new THREE.Mesh( planeGeometry, planeMaterial );
// scene.add(room);


// Add the cube to the scene
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// Define and add the animation loop
function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
