import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MTLLoader } from './node_modules/three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from './node_modules/three/examples/jsm/loaders/OBJLoader.js';

let camera, scene, renderer;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const jumpSound = new Audio('pipe.mp3')

init();



function init() {

    window.addEventListener('click', onMouseClick, false);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, -400, 600);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x99DDFF);





    //Cube---------------------------------------------------------

    let mario_cube = undefined;

    const mtlLoader = new MTLLoader();

    mtlLoader.load('SuperMario.mtl', function (materials) {
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('SuperMario.obj', function (object) {
            mario_cube = object;
            scene.add(mario_cube);
            mario_cube.position.set(0, -1, 0);
            render();


            camera.position.set(0, 0, 5);
            camera.lookAt(0, 0, 0);
            renderer.render(scene, camera);

        });

    });
    function onMouseClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            if (mario_cube && mario_cube.contains(clickedObject)) {
                console.log("Mario cliqué !");


                    mario_cube.traverse(child => {
        if (child.isMesh && child.material) {
            child.material.color.set('#8B4513'); // marron
        }
    });

                const newMtlLoader = new MTLLoader();
                newMtlLoader.load('Louis.mtl', function (materials) {
                    materials.preload();
                    const newObjLoader = new OBJLoader();
                    newObjLoader.setMaterials(materials);
                    newObjLoader.load('Louis.obj', function (object) {
                        object.position.set(0, 1, 0);
                        scene.add(object);

                        gsap.to(object.position, {
                            y:1,
                            duration: 0.5,
                            ease : 'power.out2'
                        });

                         // recommence à zéro
                        jumpSound.play();


                    });
                });
            }
        }
    }
    THREE.Object3D.prototype.contains = function (obj) {
        if (this === obj) return true;
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].contains(obj)) return true;
        }
        return false;
    };
    //Cube---------------------------------------------------------




    // Lumière ambiante : éclaire toute la scène uniformément
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    // Lumière directionnelle : simule la lumière du soleil
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 10, 7); // position du "soleil"
    scene.add(directionalLight);

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

