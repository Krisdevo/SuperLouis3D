import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { MTLLoader } from './node_modules/three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from './node_modules/three/examples/jsm/loaders/OBJLoader.js';

let camera, scene, renderer;

init();



function init() {

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, - 400, 600);

    scene = new THREE.Scene();
    scene.background = new THREE.Color('rgb(61, 167, 253)');



//Cube---------------------------------------------------------

let mario_cube = undefined;

const mtlLoader = new MTLLoader();

mtlLoader.load('SuperMario.mtl', function(materials) {
    materials.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('SuperMario.obj', function(object) {
        mario_cube = object;
        scene.add(mario_cube);
        mario_cube.position.set(0,-1,0);
        render(); 
    });
});
//Cube---------------------------------------------------------



//Louis--------------------------------------------------------
    const fontloader = new FontLoader();

    fontloader.load('Super Mario 256_Regular.json', function (font) {

        const geometry = new TextGeometry('Louis', {
            font: font,
            size: 2,
            depth: 0.5,
            curveSegments: 12,
            height: 0.15,

        });

        geometry.center()
        //material mesh
        const material = new THREE.MeshBasicMaterial({ color: 'rgb(175, 28, 28)' });;
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 1.5, 0)
        scene.add(mesh);
        
//Louis--------------------------------------------------------   
        
        
        
        //render
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
    });


    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    controls.addEventListener('change', render);

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();

}

function render() {

    renderer.render(scene, camera);

}

