import
{ 
  toIndexedVertices,
  randomNum 
} from './utils';

import vertex from './vertex.glsl'
import fragment from './fragment.glsl'

import gsap from 'gsap';

import '../css/main.css';

'use strict';

class App 
{
  constructor()
  {
    this.canvas = document.querySelector('#c');
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias : true, alpha : true});
    this.scene = new THREE.Scene();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // camera is slightly left of blob
    // less = left, less = up, less = zoom in
    this.camera.position.set(-0.25, 0, 3.2);

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.addBlob();

    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));

    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  addBlob()
  {
    const geometry = new THREE.IcosahedronGeometry(1.75, 40);
    toIndexedVertices(geometry);
    this.displacementVal = randomNum(0.3, 0.8);
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      // fragmentShader: fragment, causes issues on mac
      uniforms: {
        uTime: { value: 0 },

        uTimeScaleVert: { value: 0.01 },
        uNoiseScaleVert: { value: 0.41 },
        uDisplacementScale: { value: 0.3 },

        uTimeScaleFrag: { value: 0.01 },
        uNoiseScaleRed: { value: 0 },
        uNoiseScaleGreen: { value: 0.92 },
        uNoiseScaleBlue: { value: 1.08 }
      }
    });
  
    this.object = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.object);
  }

  onWindowResize()
  {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera); 
  }

  onMouseMove(event)
  {
    this.mouse.x = (event.clientX / this.width) * 2 - 1;
    this.mouse.y = - (event.clientY / this.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.intersects = this.raycaster.intersectObject(this.object);

    // stop blob on mouse hover
    if (this.intersects.length > 0)
    {
      gsap.to(this.material.uniforms.uDisplacementScale, {
        value: 0,
        ease: 'bounce.easein'
    })
    }
    else
    {
      gsap.to(this.material.uniforms.uDisplacementScale, {
        value: this.displacementVal,
        ease: 'bouce.easein'
    })
    }
  }

  render()
  {
    this.material.uniforms.uTime.value++;
    this.renderer.render(this.scene, this.camera);
  }
}
  
new App();