import * as THREE from 'three';
const renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const fov = 75;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

const scene = new THREE.Scene();

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

const color = 0xFFFFFF;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

const loader = new THREE.TextureLoader();

renderer.render(scene, camera);


function makeInstance(geometry, x) {
	const materials = [
		new THREE.MeshPhongMaterial({map: loadColorTexture('https://threejs.org/manual/examples/resources/images/flower-1.jpg')}),
		new THREE.MeshPhongMaterial({map: loadColorTexture('https://threejs.org/manual/examples/resources/images/flower-2.jpg')}),
		new THREE.MeshPhongMaterial({map: loadColorTexture('https://threejs.org/manual/examples/resources/images/flower-3.jpg')}),
		new THREE.MeshPhongMaterial({map: loadColorTexture('https://threejs.org/manual/examples/resources/images/flower-4.jpg')}),
		new THREE.MeshPhongMaterial({map: loadColorTexture('https://threejs.org/manual/examples/resources/images/flower-5.jpg')}),
		new THREE.MeshPhongMaterial({map: loadColorTexture('https://threejs.org/manual/examples/resources/images/flower-6.jpg')}),
	];
	const cube = new THREE.Mesh(geometry, materials);

	function loadColorTexture( path ) {
		const texture = loader.load( path );
		texture.colorSpace = THREE.SRGBColorSpace;
		return texture;
	}

	scene.add(cube);

	cube.position.x = x;

	return cube;
}

const cubes = [
	makeInstance(geometry,  0),
	makeInstance(geometry, -2),
	makeInstance(geometry,  2),
];

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
