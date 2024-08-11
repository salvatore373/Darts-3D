import * as THREE from 'three';
import {Room, PLANES_DEPTH, WALL_HEIGHT} from 'room';
import {DartboardLoader, DARTBOARD_LABEL} from 'dartboard'
import {DartLoader, DART_LABEL, PhysicsDart} from 'dart'
import {PhysicalObject} from 'physical_object'

// Initialize the list of Mesh objects that will populate the scene
let sceneMeshes = [];

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
// camera.position.set(-5, 0, 3 * WALL_HEIGHT / 4 )
camera.position.set(0, 0, 3 * WALL_HEIGHT / 4)
camera.lookAt(0, 0, 0);
// camera.position.set(10,0, 0)  // side view
// camera.lookAt(0, 0, 3 * WALL_HEIGHT / 4);

scene.background = new THREE.Color( 0x6292cc );

// DEBUG
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
// DEBUG
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

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
for (let c of room.children)
  c.geometry.computeBoundingBox();

// Load the dartboard
DartboardLoader.Load().then(obj => {
  scene.add(obj);

  sceneMeshes.push(obj);
  obj.children[0].geometry.computeBoundingBox();

  obj.position.y = room.children[1].position.y - PLANES_DEPTH / 2;
  obj.position.z = WALL_HEIGHT * 3 / 4;

  // camera.lookAt(obj.position.x, obj.position.y, obj.position.z);
});

// Load the dart
let dartPhysObj = null;
DartLoader.Load().then(obj => {
  scene.add(obj);

  sceneMeshes.push(obj);
  obj.children[0].geometry.computeBoundingBox();

  dartPhysObj = new PhysicsDart(obj, new THREE.Vector3(0, 0.8, 0));

  // obj.position.z = 1.5;
  obj.position.z = (3 / 4) * WALL_HEIGHT;
  obj.position.y = 5.5;
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

// Define and add the animation loop
function animate() {
  tableCamera.update(renderer,scene);
  renderer.render(scene, camera);

  if (dartPhysObj != null) {
    dartPhysObj.updatePosition(sceneMeshes);
  }

  // physicalCube1.reactToCollision(sceneMeshes);
  // physicalCube1.updatePosition();
  // physicalCube2.reactToCollision(sceneMeshes);
}

renderer.setAnimationLoop(animate);
