

// ottimizzazione.js
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
    this.targetRotationX = 0;

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
      const gltf = await loader.loadAsync('./eurocoin.glb');
      this.model = gltf.scene;

      // scala leggermente più piccola su mobile
      if (this.isMobile) this.model.scale.set(2, 2, 2);
      else this.model.scale.set(5, 5, 5);

      this.scene.add(this.model);
      this.setupScrollAnimation();
    } catch (e) {
      console.error('Errore caricamento eurocoin.glb:', e);
    }
  }

  setupScrollAnimation() {
    // keyframes desktop
    const posKFDesktop = [
      { x: 19, y: -5,   z: 60 },{ x: 35, y: -2,   z: 50 },{ x: 8, y: -8,   z: 80 },
      { x: 35, y: -2.2, z: 40 },{ x: 18, y: -8,   z: 75 },{ x: 4.2, y: -5,   z: 97.2 },
      { x: 30, y: 0,    z: 80 },{ x: 70, y: 0,    z:100 },{ x: 25, y: 0,    z: 65 },{ x: 25, y: -10,    z: 45 }
    ];
    // keyframes mobile: shift X a sinistra di 10 unità
    const posKFMobile = [
      { x: 1, y: -11,   z: 70 },{ x: 6, y: -2,   z: 60 },{ x: -6, y: -8,   z: 40 },
      { x: -8, y: -2.2, z: 50 },{ x: 18, y: -8,   z: 75 },{ x: 0.2, y: -1,   z: 97.2 },
      { x: 30, y: 0,    z: 80 },{ x: 5, y: 0,    z:65 },{ x: 5, y: 0,    z: 45 },{ x: 0, y: 0,    z: 65 }
    ];

    const rotYKF = [
      Math.PI*1.9, 
      -Math.PI*0.5, 
      1, 
      0, 
      0,
      -Math.PI*0.5, 
      Math.PI*0.5, 
      Math.PI*0.71, 
      -Math.PI*0.1, 
      -Math.PI*0.2
    ];

    const rotXKF = [
      -Math.PI*0.1, 
      -Math.PI*0.5, 
      Math.PI*0.1, 
      Math.PI*0.2, 
      0, 
      0, 
      0, 
      Math.PI*0.1, 
      Math.PI*0.1, 
      0
    ];

    const scrollDist = document.documentElement.scrollHeight - window.innerHeight;

    ScrollTrigger.create({
      trigger: '.content', start: 'top top', end: `+=${scrollDist}`, scrub: true,
      pin: this.renderer.domElement, anticipatePin: 1,
      onUpdate: self => {
        const t = self.progress * (posKFDesktop.length - 1);
        const i = Math.floor(t), frac = t - i;
        const i1 = Math.min(i + 1, posKFDesktop.length - 1);
        const smooth = frac * frac * (3 - 2 * frac);

        const kf = this.isMobile ? posKFMobile : posKFDesktop;
        const rawX = THREE.MathUtils.lerp(kf[i].x, kf[i1].x, smooth);

        this.targetPosition.set(
          rawX,
          THREE.MathUtils.lerp(kf[i].y,  kf[i1].y,  smooth),
          THREE.MathUtils.lerp(kf[i].z,  kf[i1].z,  smooth)
        );
        this.targetRotationY = THREE.MathUtils.lerp(rotYKF[i], rotYKF[i1], smooth);
        this.targetRotationX = THREE.MathUtils.lerp(rotXKF[i], rotXKF[i1], smooth);
      }
    });
  }

  renderLoop() {
    if (this.model) {
      this.model.position.lerp(this.targetPosition, 0.1);
      this.model.rotation.x += (this.targetRotationX - this.model.rotation.x) * 0.1;
      this.model.rotation.y += (this.targetRotationY - this.model.rotation.y) * 0.1;
    }
    this.renderer.render(this.scene, this.camera);
  }
}

// Avvia
new Scene3D();
