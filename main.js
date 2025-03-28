import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const canvas = document.querySelector('#c');
const view1Elem = document.querySelector('#view1');
const view2Elem = document.querySelector('#view2');
const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

// Camara
const fov = 45;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 10, 20);

const cameraHelper = new THREE.CameraHelper( camera );

class MinMaxGUIHelper {
	constructor(obj, minProp, maxProp, minDif) {
	  this.obj = obj;
	  this.minProp = minProp;
	  this.maxProp = maxProp;
	  this.minDif = minDif;
	}
	get min() {
	  return this.obj[this.minProp];
	}
	set min(v) {
	  this.obj[this.minProp] = v;
	  this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
	}
	get max() {
	  return this.obj[this.maxProp];
	}
	set max(v) {
	  this.obj[this.maxProp] = v;
	  this.min = this.min;  // this will call the min setter
	}
}

const gui = new GUI();
	gui.add(camera, 'fov', 1, 180);
	const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
	gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near');
	gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far');

// controles
const controls = new OrbitControls(camera, view1Elem);
controls.target.set(0, 5, 0);
controls.update();

const camera2 = new THREE.PerspectiveCamera(
	60,  // fov
	2,   // aspect
	0.1, // near
	500, // far
);
camera2.position.set(40, 10, 30);
camera2.lookAt(0, 5, 0);
   
const controls2 = new OrbitControls(camera2, view2Elem);
controls2.target.set(0, 5, 0);
controls2.update();

// Escena
const scene = new THREE.Scene();
scene.background = new THREE.Color( 'black' );
scene.add(cameraHelper);

{
const planeSize = 40;

// Texture loader
const loader = new THREE.TextureLoader();
const texture = loader.load('./img/groundTexture.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
texture.colorSpace = THREE.SRGBColorSpace;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

// Plane terrain
const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
scene.add(mesh);
}

// Cube
{
const cubeSize = 4;
const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' });
const mesh = new THREE.Mesh(cubeGeo, cubeMat);
mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
scene.add(mesh);
}

{
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
  const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
  scene.add(mesh);
}


// setup the helper of the lights
class ColorGUIHelper {

	constructor( object, prop ) {

		this.object = object;
		this.prop = prop;

	}
	get value() {

		return `#${this.object[ this.prop ].getHexString()}`;

	}
	set value( hexString ) {

		this.object[ this.prop ].set( hexString );

	}

}

class DegRadHelper {

	constructor( obj, prop ) {

		this.obj = obj;
		this.prop = prop;

	}
	get value() {

		return THREE.MathUtils.radToDeg( this.obj[ this.prop ] );

	}
	set value( v ) {

		this.obj[ this.prop ] = THREE.MathUtils.degToRad( v );

	}

}

	// setup the lights

function makeXYZGUI(gui, vector3, name, onChangeFn) {
	const folder = gui.addFolder(name);
	folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
	folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
	folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
	folder.open();
}

{
	const color = 0xFFFFFF;
	const intensity = 150;
	const light = new THREE.SpotLight( color, intensity );
	light.position.set(0, 10, 0);
	scene.add( light );
	scene.add( light.target );

	const helper = new THREE.SpotLightHelper(light);
	scene.add(helper);

	function updateLight() {
		helper.update();
	}

	const guai = new GUI();
	guai.addColor( new ColorGUIHelper( light, 'color' ), 'value' ).name( 'color' );
	guai.add(new DegRadHelper(light, 'angle'), 'value', 0, 90).name('angle').onChange(updateLight);
	guai.add( light, 'intensity', 0, 150, 0.01 );
	guai.add( light, 'distance', 0, 40 ).onChange(updateLight);
	guai.add(light, 'penumbra', 0, 1, 0.01);
	
	makeXYZGUI( guai, light.position, 'position', updateLight );
}

function setScissorForElement(elem) {
	const canvasRect = canvas.getBoundingClientRect();
	const elemRect = elem.getBoundingClientRect();
   
	// compute a canvas relative rectangle
	const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
	const left = Math.max(0, elemRect.left - canvasRect.left);
	const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
	const top = Math.max(0, elemRect.top - canvasRect.top);
   
	const width = Math.min(canvasRect.width, right - left);
	const height = Math.min(canvasRect.height, bottom - top);
   
	// setup the scissor to only render to that part of the canvas
	const positiveYUpBottom = canvasRect.height - bottom;
	renderer.setScissor(left, positiveYUpBottom, width, height);
	renderer.setViewport(left, positiveYUpBottom, width, height);
   
	// return the aspect
	return width / height;
}

function resizeRendererToDisplaySize( renderer ) {

	const canvas = renderer.domElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const needResize = canvas.width !== width || canvas.height !== height;
	if ( needResize ) {

		renderer.setSize( width, height, false );

	}

	return needResize;

}

renderer.render(scene, camera);

function render() {

	resizeRendererToDisplaySize( renderer );

	renderer.setScissorTest(true);
 
    // render the original view
    {
      const aspect = setScissorForElement(view1Elem);
 
      // adjust the camera for this aspect
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      cameraHelper.update();
 
      // don't draw the camera helper in the original view
      cameraHelper.visible = false;
 
      scene.background.set(0x000000);
 
      // render
      renderer.render(scene, camera);
    }
 
    // render from the 2nd camera
    {
      const aspect = setScissorForElement(view2Elem);
 
      // adjust the camera for this aspect
      camera2.aspect = aspect;
      camera2.updateProjectionMatrix();
 
      // draw the camera helper in the 2nd view
      cameraHelper.visible = true;
 
      scene.background.set(0x000040);
 
      renderer.render(scene, camera2);
    }

	requestAnimationFrame(render);
}

requestAnimationFrame(render);
