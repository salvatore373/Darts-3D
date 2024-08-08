// function Room() {
//   let room = new THREE.
// }
import * as THREE from 'three';

const FLOOR_WIDTH = 10;
const FLOOR_HEIGHT = 10;
const WALL_HEIGHT = 5;
const PLANES_DEPTH = 0.5;

export default class Room extends THREE.Group {
  constructor() {
    super();

    // Define the floor
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(FLOOR_WIDTH, FLOOR_HEIGHT, PLANES_DEPTH),
      new THREE.MeshBasicMaterial({
        color: 0x660748ad, side: THREE.DoubleSide,
      })
    );
    this.add(floor);
    // Define the wall
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(FLOOR_WIDTH, WALL_HEIGHT, PLANES_DEPTH),
      new THREE.MeshBasicMaterial({
        color: 0x4c72ad, side: THREE.DoubleSide,
      })
    );
    const floorSideY = floor.position.y + FLOOR_HEIGHT / 2;
    wall.position.set(0, floorSideY, WALL_HEIGHT/2 - PLANES_DEPTH/2);
    wall.rotation.x = Math.PI / 2;
    this.add(wall);

    // Define the floor
    // const floorGeometry = new THREE.PlaneGeometry(10, 10);
    // const floorMaterial = new THREE.MeshBasicMaterial({
    //   color: 0x4c72ad, side: THREE.DoubleSide,
    // });
    // const floor = THREE.Mesh(floorGeometry, floorMaterial);
    // this.add(floor);

    // Define the wall
    // const wallGeometry = new THREE.PlaneGeometry(10, 10);
    // const wallMaterial = new THREE.MeshBasicMaterial({
    //   color: 0x0748ad, side: THREE.DoubleSide,
    // });
    // const wall = THREE.Mesh(wallGeometry, wallMaterial);
    // this.add(wall);
  }
}
