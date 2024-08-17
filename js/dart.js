import * as THREE from 'three';
import * as utils from 'utils'
import {PhysicalObject, boxCollision} from "physical_object";
import {DARTBOARD_LABEL} from "dartboard";

const objPath = './assets/throwing_dart_v1_L3.123cce958837-fa5f-4635-8f4a-9e4d59dbe115/11750_throwing_dart_v1_L3.obj';
const texturePath = './assets/throwing_dart_v1_L3.123cce958837-fa5f-4635-8f4a-9e4d59dbe115/11750_throwing_dart_v1_L3.mtl';

export const DART_LABEL = "dart";

export class DartLoader {
  // constructor() {
  //   super(undefined, THREE.Vector3(0, 0, 0));
  //
  //   return Promise((resolve, reject) => {
  //     Dart.Load().then((obj) => {
  //       this.setObject(obj);
  //       return this;
  //     }).catch((err) => reject(err));
  //   })
  // }


  static async Load() {
    let obj = await utils.loadObj(objPath, texturePath);
    obj.scale.set(0.15, 0.15, 0.15)
    obj.rotation.x = Math.PI / 2;

    obj.children[0].castShadow = true;
    obj.children[0].receiveShadow = true;

    obj.name = DART_LABEL;

    return obj;
  }
}


/**
 * An extension of PhysicalObject that makes the dart stay attached to the dartboard when it is hit.
 */
export class PhysicsDart extends PhysicalObject {
  launched = false;
  isPositionFrozen = false;

  freezePosition() {
    this.isPositionFrozen = true;
  }

  updatePosition(sceneObjectsMeshes) {
    if (!this.isPositionFrozen)
      super.updatePosition(sceneObjectsMeshes);
  }

  reactToCollision(sceneObjectsMeshes) {
    if (!this.isPositionFrozen) {
      // Do not collide with other darts
      sceneObjectsMeshes = sceneObjectsMeshes.filter((dart) => dart.name !== DART_LABEL);
      let collidingObjs = super.reactToCollision(sceneObjectsMeshes);

      for (let sceneObj of collidingObjs) {
        if (sceneObj.name === DARTBOARD_LABEL) {
          // Stop the dart from moving
          this.velocity.x = 0;
          this.velocity.y = 0;
          this.velocity.z = 0;
          // Stop updating the dart's position
          this.freezePosition();
        }
      }
    }
  }

  launch(velocityX, velocityY, velocityZ) {
    this.isPositionFrozen = false;
    this.launched = true;
    this.velocity = new THREE.Vector3(velocityX, velocityY, velocityZ);
  }
}
