import * as THREE from 'three';

const GRAVITY = -0.02;
const FRICTION_FACTOR = 0.5;

class CollisionInfo {
  constructor(isColliding, collisionDirection) {
    this.isColliding = isColliding;
    this.collisionDirection = collisionDirection;
  }
}

/**
 * Check for a collision between the object identified by meshObj and the plane of
 * the room identified by meshPlane.
 */

/*function roomCollision(meshObj, meshPlane) {
  const box1 = new THREE.Box3();
  const box2 = new THREE.Box3();
  box1.copy(meshObj.geometry.boundingBox).applyMatrix4(meshObj.matrixWorld);
  box2.copy(meshPlane.geometry.boundingBox).applyMatrix4(meshPlane.matrixWorld);
  return box1.intersectsPlane(box2);
}*/

/**
 * Check for a collision between a PhysicalObject and another object
 */
function boxCollision(physObj1, obj2) {
  const box1 = new THREE.Box3().setFromObject(physObj1.object);
  const box2 = new THREE.Box3().setFromObject(obj2 instanceof PhysicalObject ? obj2.object : obj2);
  // const box1 = new THREE.Box3();
  // const box2 = new THREE.Box3();
  // box1.copy(mesh1.geometry.boundingBox).applyMatrix4(mesh1.matrixWorld);
  // box2.copy(mesh2.geometry.boundingBox).applyMatrix4(mesh2.matrixWorld);

  if (box1.equals(box2))
    return new CollisionInfo(false, new THREE.Vector3(0, 0, 0));

  box1.min.add(physObj1.velocity);
  box1.max.add(physObj1.velocity);

  if(obj2 instanceof PhysicalObject) {
    box2.min.add(obj2.velocity);
    box2.max.add(obj2.velocity);
  }

  // TODO: replace with distance vector between boxes
  let center1 = new THREE.Vector3(0, 0, 0);
  box1.getCenter(center1);
  let center2 = new THREE.Vector3(0, 0, 0);
  box2.getCenter(center2);
  let centersSub = center1.sub(center2);

  return new CollisionInfo(box1.intersectsBox(box2), centersSub);
}

export default class PhysicalObject {
  constructor(object, velocity) {
    this.setObject(object);
    this.velocity = velocity; // Vector3

    this.objectMesh.geometry.computeBoundingBox();
  }

  setObject(object) {
    this.object = object;
    this.objectMesh = this.object.children[0];
  }

  reactToCollision(sceneObjectsMeshes) {
    this.velocity.z += GRAVITY;
    let handledCollisionX = false;
    let handledCollisionY = false;
    let handledCollisionZ = false;

    for (let i = 0;
         i < sceneObjectsMeshes.length && (!handledCollisionX || !handledCollisionY || !handledCollisionZ);
         i++) {
      let sceneObjMesh = sceneObjectsMeshes[i];
      let collisionInfo = boxCollision(this, sceneObjMesh);

      // TODO: make reaction proportional to the portion of the segment that connects the centers
      //  that is inside the intersection between the boxes

      if (collisionInfo.isColliding) {
        if (collisionInfo.collisionDirection.x !== 0 && !handledCollisionX) {
          handledCollisionX = true;
          this.velocity.x *= FRICTION_FACTOR;
          this.velocity.x = -this.velocity.x;
        }
        if (collisionInfo.collisionDirection.y !== 0 && !handledCollisionY) {
          handledCollisionY = true;
          this.velocity.y *= FRICTION_FACTOR;
          this.velocity.y = -this.velocity.y;
        }

        if (collisionInfo.collisionDirection.z !== 0 && !handledCollisionZ) {
          handledCollisionZ = true;
          this.velocity.z *= FRICTION_FACTOR;
          this.velocity.z = -this.velocity.z;
        }
      }
    }

    if (!handledCollisionZ) {
      this.object.position.z += this.velocity.z;
    }
  }

  updatePosition() {
    this.object.position.x += this.velocity.x;
    this.object.position.y += this.velocity.y;
    this.object.position.z += this.velocity.z;
  }
}
