import * as THREE from 'three';
import * as Colors from 'colors'

const FLOOR_WIDTH = 30;
const FLOOR_HEIGHT = 20;
export const WALL_HEIGHT = 10;
export const PLANES_DEPTH = 0.5;

export const FLOOR_TAG = 'floor';
export const WALL_TAG = 'wall';

export class Room extends THREE.Group {
  constructor() {
    super();

    // Define the floor
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(FLOOR_WIDTH, FLOOR_HEIGHT, PLANES_DEPTH),
      new THREE.MeshPhongMaterial({
        // color: Colors.PRIMARY_COLOR,
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load('./assets/wood1.png'), transparent: true,
      })
    );
    floor.receiveShadow = true;
    this.floor = floor;
    floor.name = FLOOR_TAG;
    this.add(floor);
    // Define the wall
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(FLOOR_WIDTH, WALL_HEIGHT, PLANES_DEPTH),
      new THREE.MeshBasicMaterial({
        color: Colors.SECONDARY_COLOR, side: THREE.DoubleSide,
      })
    );
    const floorSideY = floor.position.y + FLOOR_HEIGHT / 2;
    wall.position.set(0, floorSideY, WALL_HEIGHT / 2 - PLANES_DEPTH / 2);
    wall.rotation.x = Math.PI / 2;
    wall.receiveShadow = true;
    wall.castShadow = true;
    wall.name = WALL_TAG;
    this.wall = wall;
    this.add(wall);
  }
}
