import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 10);
light.position.set(1, 1, 1).normalize();
scene.add(light);

const loader = new FBXLoader();
let YBot;
let mixer;
const clock = new THREE.Clock();

loader.load('YBot.fbx', (object) => {
    YBot = object;
    YBot.position.set(0, -100, -500);
    scene.add(YBot);

    // Load animation
    const animLoader = new FBXLoader();
    animLoader.load('Fall_Flat.fbx', (anim) => {
        mixer = new THREE.AnimationMixer(YBot);
        const fall = mixer.clipAction(anim.animations[0]);
        fall.play();
    });
}, undefined, (error) => {
    console.error(error);
});

const geometry = new THREE.BoxGeometry(1, 1, 1);
const wireframeGeometry = new THREE.WireframeGeometry(geometry);
const material = new THREE.LineBasicMaterial({ color: 0xffffff });

const cube = new THREE.LineSegments(wireframeGeometry, material);
scene.add(cube);
camera.position.set(0.0, 1.0, 5.0);

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (YBot) {
        YBot.rotation.y += 0.01;
    }

    if (mixer) {
        mixer.update(delta);
    }

    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();