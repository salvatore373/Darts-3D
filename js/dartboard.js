import * as THREE from 'three';
import * as utils from 'utils'

const objPath = './assets/dart_obj/dart_tarcza_obj.obj';
const texturePath = './assets/dart_obj/dart_tarcza_obj.mtl';

export const DARTBOARD_LABEL = "dartboard";

export class DartboardLoader{
  static async Load() {
    let obj = await utils.loadObj(objPath, texturePath);
    obj.scale.set(0.4, 0.4, 0.4);
    obj.rotation.z = Math.PI;

    obj.children[0].receiveShadow = true;
    obj.children[0].castShadow = true;

    obj.name = DARTBOARD_LABEL;

    return obj;
  }
}
