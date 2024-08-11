import * as THREE from 'three';
import * as Colors from 'colors'

const FLOOR_WIDTH = 10;
const FLOOR_HEIGHT = 20;
export const WALL_HEIGHT = 10;
export const PLANES_DEPTH = 0.5;

export class Room extends THREE.Group {
  constructor() {
    super();

    // Define the floor
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(FLOOR_WIDTH, FLOOR_HEIGHT, PLANES_DEPTH),
      new THREE.MeshPhongMaterial({
        color: Colors.PRIMARY_COLOR, side: THREE.DoubleSide,
      })
    );
    floor.receiveShadow = true;
    this.floor = floor;
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
    this.wall = wall;
    this.add(wall);
  }
}
