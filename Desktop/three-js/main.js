import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
const geometry1 = new THREE.BoxGeometry( 1, 1, 1 );
const material1 = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
const light = new THREE.DirectionalLight( 0xffffff, 3 );
light.position.set( -1, 2, 4 );

const cube = new THREE.Mesh( geometry, material );

const cube1 = new THREE.Mesh( geometry1, material1 );
scene.add( cube );
scene.add( light );
// scene.add( cube1 );

camera.position.z = 5;
camera.position.y = 0;

function animate() {

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
    // cube1.rotation.x += 0.02;
	// cube1.rotation.y += 0.01;

	renderer.render( scene, camera );

}