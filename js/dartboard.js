import * as THREE from 'three';
import * as utils from 'utils'

const objPath = './assets/dart_obj/dart_tarcza_obj.obj';
const texturePath = './assets/dart_obj/dart_tarcza_obj.mtl';

export default class Dartboard extends THREE.Group {
  constructor() {
    super();
  }

  async Load() {
    let obj = await utils.loadObj(objPath, texturePath);
    obj.scale.set(0.4, 0.4, 0.4);
    obj.rotation.z = Math.PI;
    return obj;
  }
}
