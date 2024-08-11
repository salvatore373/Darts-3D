import * as THREE from 'three';
import * as Colors from 'colors'

const FOOT_HEIGHT = 1;
const TABLE_DEPTH = .1;
const TABLE_WIDTH = 3;
const TABLE_HEIGHT = 3;

export default class ReflectingTable extends THREE.Object3D {
  constructor() {
    super();
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
    });
    this.cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
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
  }

  updateCamera(renderer, scene) {
    this.cubeCamera.update(renderer, scene);
  }
}
