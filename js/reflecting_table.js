import * as THREE from 'three';
import * as Colors from 'colors'

const FOOT_HEIGHT = 1;
const TABLE_DEPTH = .1;
const TABLE_WIDTH = 3;
const TABLE_HEIGHT = 3;

const MAX_NUM_OBJS_ON_TABLE_PER_ROW = 2;
const MAX_NUM_OBJS_ON_TABLE_PER_COL = 1;
const MAX_NUM_OBJS_ON_TABLE = MAX_NUM_OBJS_ON_TABLE_PER_ROW + MAX_NUM_OBJS_ON_TABLE_PER_COL;

export default class ReflectingTable extends THREE.Object3D {
  constructor() {
    super();
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(720, {
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
    });
    this.cubeCamera = new THREE.CubeCamera(1, 100, cubeRenderTarget);
    const material = new THREE.MeshPhongMaterial({
      envMap: cubeRenderTarget.texture,
    });
    const plane = new THREE.Mesh(new THREE.BoxGeometry(TABLE_WIDTH, TABLE_HEIGHT, TABLE_DEPTH), material);
    plane.castShadow = true;
    plane.receiveShadow = true;
    plane.add(this.cubeCamera);

    const tableFoot = new THREE.Mesh(
      new THREE.CylinderGeometry(.3, .3, FOOT_HEIGHT, 36),
      new THREE.MeshPhongMaterial({color: Colors.SECONDARY_COLOR})
    );
    tableFoot.castShadow = true;
    tableFoot.receiveShadow = true;
    tableFoot.rotation.x = Math.PI / 2;
    tableFoot.position.z = -0.5;
    tableFoot.position.y = plane.position.y;
    tableFoot.position.x = plane.position.x;

    this.add(plane);
    this.add(tableFoot);

    this.height = TABLE_DEPTH + FOOT_HEIGHT;
    this.numObjectsOnTable = 0;
  }

  updateCamera(renderer, scene) {
    this.cubeCamera.update(renderer, scene);
  }

  putOnTable(object) {
    if (this.numObjectsOnTable < MAX_NUM_OBJS_ON_TABLE) {
      let xPos = (this.numObjectsOnTable % MAX_NUM_OBJS_ON_TABLE_PER_ROW + 1) * TABLE_WIDTH / (MAX_NUM_OBJS_ON_TABLE_PER_ROW + 1);
      let yPos = (Math.floor(this.numObjectsOnTable / MAX_NUM_OBJS_ON_TABLE_PER_COL) % MAX_NUM_OBJS_ON_TABLE_PER_COL + 1) * TABLE_WIDTH / (MAX_NUM_OBJS_ON_TABLE_PER_COL + 1);
      this.numObjectsOnTable++;

      object.position.x = (this.position.x-(TABLE_WIDTH/2)) + xPos;
      object.position.y = (this.position.y-(TABLE_HEIGHT/2)) + yPos;
      object.position.z = this.position.z + TABLE_DEPTH;
    } else {
      console.error("The table is full. Cannot put any new element on it.")
    }
  }
}
