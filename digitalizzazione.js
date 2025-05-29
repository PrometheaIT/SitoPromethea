// immagine.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap@3.12.2';
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap@3.12.2/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

class Scene3D {
  constructor() {
    this.initScene();
    this.loadModel();
    this.addEventListeners();
    this.updateDeviceMode();
  }

  initScene() {
    this.container = document.querySelector('.canvas-container');
    if (!this.container) {
      console.error('Container non trovato!');
      return;
    }

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(10, 20, 15);
    this.scene.add(dir);

    this.targetPosition = new THREE.Vector3();
    this.targetRotationY = 0;

    this.renderer.setAnimationLoop(() => this.renderLoop());
  }

  addEventListeners() {
    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.updateDeviceMode();
    });
  }

  updateDeviceMode() {
    const aspect = window.innerWidth / window.innerHeight;
    this.isMobile = aspect < 1;
  }

  async loadModel() {
    try {
      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync('./robot.glb');
      this.model = gltf.scene;

      // scala leggermente più piccola su mobile
      if (this.isMobile) this.model.scale.set(2, 2, 2);
      else this.model.scale.set(5, 5, 5);

      this.scene.add(this.model);
      this.setupScrollAnimation();
    } catch (e) {
      console.error('Errore caricamento smartphone.glb:', e);
    }
  }

  setupScrollAnimation() {
    // keyframes desktop
    const posKFDesktop = [
    { x:  22,      y:  -18,   z: 50 },
      { x:  0,      y:   -10,     z: 90 },
      { x: 0,       y:   -10,    z: 80 },
      { x: 35,  y:  -2.2,   z: 40 },
      { x: 18,      y:   -8,    z: 75 },
      { x:   2.2,     y: -1,       z:  97.2 },
      { x:  30,  y:   0,  z:  80 },
      { x:  50,  y:   0,  z: 100 },
      { x:   29,  y:   0,  z: 65 },
      { x:   9,  y:   -10,  z: 70 }
    ];
    // keyframes mobile: shift X a sinistra di 10 unità
    const posKFMobile = [
      { x: 1.5,     y: -9, z: 75 },
      { x: 0,     y: 0,    z: 85 },
      { x: 0,     y: -1,   z: 80 },
      { x: -0.035,y: 1, z: 98.2 },
      { x: 18,    y: 8,   z: 75 },
      { x: 10,   y: -1,   z: 55 },
      { x: 8,    y: 0,    z: 65 },
      { x: 5.2,    y: 0,    z: 70 },
      { x: 3.2,     y: 0,    z: 70 },
      { x: 3.8,     y: 0,    z: 70 }
    ];

    const rotKF = [
      -Math.PI * 0.15,
       1,
       4,
       6,
       6,
      4,
       Math.PI * 0.5,
       Math.PI * 0.71,
      -Math.PI * 0.1,
      -Math.PI * 0.5
    ];

    const scrollDist = document.documentElement.scrollHeight - window.innerHeight;

    ScrollTrigger.create({
      trigger: '.content',
      start: 'top top',
      end: `+=${scrollDist}`,
      scrub: true,
      pin: this.renderer.domElement,
      anticipatePin: 1,

      onUpdate: self => {
        const t = self.progress * (posKFDesktop.length - 1);
        const i = Math.floor(t);
        const frac = t - i;
        const i1 = Math.min(i + 1, posKFDesktop.length - 1);
        const smooth = frac * frac * (3 - 2 * frac);

        const keyframes = this.isMobile ? posKFMobile : posKFDesktop;
        const rawX = THREE.MathUtils.lerp(keyframes[i].x, keyframes[i1].x, smooth);

        this.targetPosition.set(
          rawX,
          THREE.MathUtils.lerp(keyframes[i].y, keyframes[i1].y, smooth),
          THREE.MathUtils.lerp(keyframes[i].z, keyframes[i1].z, smooth)
        );
        this.targetRotationY = THREE.MathUtils.lerp(rotKF[i], rotKF[i1], smooth);
      }
    });
  }

  renderLoop() {
    if (this.model) {
      this.model.position.lerp(this.targetPosition, 0.1);
      this.model.rotation.y += (this.targetRotationY - this.model.rotation.y) * 0.1;
    }
    this.renderer.render(this.scene, this.camera);
  }
}

// Avvia
new Scene3D();