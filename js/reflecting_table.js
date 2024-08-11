import * as THREE from 'three';


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
    const ball = new THREE.Mesh(new THREE.BoxGeometry(3, 3, .1), material);
    ball.castShadow = true;
    ball.receiveShadow = true;
    ball.add(this.cubeCamera);
    this.add(ball);
  }

  updateCamera(renderer, scene) {
    this.cubeCamera.update(renderer, scene);
  }
}
