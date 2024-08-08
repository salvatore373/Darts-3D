import * as THREE from 'three';


// GLTF
// import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
// const loader = new GLTFLoader();
// loader.load(path2, function (gltf) {
//   scene.add(gltf.scene);
//
// }, undefined, function (error) {
//   console.error(error);
// });

// OBJ
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

const mtlLoader = new MTLLoader();

/**
 * Loads a OBJ 3D model and adds a material on it.
 */
export async function loadObj(path, texturePath) {
  return new Promise((resolve, reject) => {
    mtlLoader.load(texturePath,
      function (materials) {
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(path, function (object) {
          resolve(object);
        }, undefined, function (error) {
          reject(error);
        });
      },
      undefined,
      function (error) {
        reject(error);
      }
    );
  });
}
