import * as THREE from 'three';
const loadingElem = document.querySelector('#loading');
const progressBarElem = loadingElem.querySelector('.progressbar');

const renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Camara
const fov = 75;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

const scene = new THREE.Scene();
// Geometria
const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

// Luz
const color = 0xFFFFFF;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

const loadManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(loadManager);
const texture = loader.load('https://threejs.org/manual/examples/resources/images/flower-1.jpg');
const xOffset = .1;   // offset by half the texture
const yOffset = .25;  // offset by 1/4 the texture
texture.offset.set(xOffset, yOffset);

renderer.render(scene, camera);

	const material = new THREE.MeshPhongMaterial({
	map: texture,
  	});

	loadManager.onLoad = () => {
		loadingElem.style.display = 'none';
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cubes.push(cube);  // add to our list of cubes to rotate
	};

	loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
		const progress = itemsLoaded / itemsTotal;
		progressBarElem.style.transform = `scaleX(${progress})`;
	  };

	const cubes = [];

function render(time) {
	time *= 0.001;

	cubes.forEach((cube, ndx) => {
		const speed = 1 + ndx * .1;
		const rot = time * speed;
		cube.rotation.x = rot;
		cube.rotation.y = rot;
	});

	renderer.render(scene, camera);

	requestAnimationFrame(render);
}

requestAnimationFrame(render);
