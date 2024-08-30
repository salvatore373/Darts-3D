import * as THREE from 'three'

let _audioUtilsInstance = null

export class AudioUtils {
  constructor() {
    this.loader = new THREE.AudioLoader();
    this.listener = new THREE.AudioListener();
  }

  static getInstance() {
    if (!_audioUtilsInstance) {
      _audioUtilsInstance = new AudioUtils();
    }

    return _audioUtilsInstance;
  }
}
