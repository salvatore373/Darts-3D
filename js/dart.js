import * as THREE from 'three';
import * as utils from 'utils'

const objPath = './assets/throwing_dart_v1_L3.123cce958837-fa5f-4635-8f4a-9e4d59dbe115/11750_throwing_dart_v1_L3.obj';
const texturePath = './assets/throwing_dart_v1_L3.123cce958837-fa5f-4635-8f4a-9e4d59dbe115/11750_throwing_dart_v1_L3.mtl';

export default class Dart extends THREE.Group {
  constructor() {
    super();
  }

  async Load() {
    let obj = await utils.loadObj(objPath, texturePath);
    obj.scale.set(0.15, 0.15, 0.15)
    return obj;
  }
}
