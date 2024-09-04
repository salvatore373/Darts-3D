import * as THREE from 'three';
import * as utils from 'utils'
import {PhysicalObject, boxCollision} from "physical_object";
import {DARTBOARD_LABEL} from "dartboard";
import {WALL_TAG, WALL_HEIGHT} from "room";
import {AudioUtils} from 'audio'

const objPath = './assets/throwing_dart_v1_L3.123cce958837-fa5f-4635-8f4a-9e4d59dbe115/11750_throwing_dart_v1_L3.obj';

const DART_TEXTURES = {
  'red': "./assets/throwing_dart_v1_L3.123cce958837-fa5f-4635-8f4a-9e4d59dbe115/11750_throwing_dart_v1_L3.mtl",
  'green': "./assets/throwing_dart_v1_L3.123cce958837-fa5f-4635-8f4a-9e4d59dbe115/11750_throwing_dart_v1_L3-2.mtl"
}
window.dartTextures = DART_TEXTURES;
let defaultDartTexture = DART_TEXTURES.red;

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


  static async Load(texturePath) {
    if (!texturePath)
      texturePath = defaultDartTexture;
    let obj = await utils.loadObj(objPath, texturePath);
    obj.scale.set(0.15, 0.15, 0.15)
    obj.rotation.x = Math.PI / 2;

    obj.children[0].castShadow = true;
    obj.children[0].receiveShadow = true;

    obj.name = DART_LABEL;

    return obj;
  }
}

export function changeDefaultDartTexture(newTexture) {
  defaultDartTexture = newTexture;
}


/**
 * An extension of PhysicalObject that makes the dart stay attached to the dartboard when it is hit.
 */
export class PhysicsDart extends PhysicalObject {
  launched = false;
  isPositionFrozen = false;

  constructor(...args) {
    super(...args);

    let audioUtils = AudioUtils.getInstance();
    // Load the launch audio file
    this.launchAudio = new THREE.PositionalAudio( audioUtils.listener );
    audioUtils.loader.load('./assets/shot.mp3', (buffer) => {
      this.launchAudio.setBuffer(buffer);
    });
    // Load the hit audio file
    this.hitAudio = new THREE.PositionalAudio( audioUtils.listener );
    audioUtils.loader.load('./assets/hit.mp3', (buffer) => {
      this.hitAudio.setBuffer(buffer);
    });

    this.object.add(this.launchAudio);
    this.object.add(this.hitAudio);
  }

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
        // if (sceneObj.name === DARTBOARD_LABEL || sceneObj.name === WALL_TAG) {
        if (sceneObj.name === DARTBOARD_LABEL) {
          // Put the dart in the collision position
          this.object.position.y = sceneObj.position.y;

          // Fire an event with the x,z coordinates of the collision
          window.dispatchEvent(new CustomEvent('scoreUpdate', {
            detail: {
              hitPosition: this.object.position,
            }
          }));

          // Stop the dart from moving
          this.velocity.x = 0;
          this.velocity.y = 0;
          this.velocity.z = 0;
          // Ensure that the dart looks attached to the dartboard
          // this.object.position.y = WALL_HEIGHT/2;
          // Stop updating the dart's position
          this.freezePosition();

          // Play a sound
          this.launchAudio.stop();
          this.hitAudio.play();
        }
      }
    }
  }

  launch(velocityX, velocityY, velocityZ) {
    this.isPositionFrozen = false;
    this.launched = true;
    this.velocity = new THREE.Vector3(velocityX, velocityY, velocityZ);

    // Play a sound
    this.launchAudio.play();
  }
}
