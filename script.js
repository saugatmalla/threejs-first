import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const COLORS = {
    red: '#C63B2F',
    green: '#C5E250',
    blue: '#0000ff',
    white: '#acacac',
    brown: '#463220',
}

const canvas = document.querySelector('canvas.webgl');

const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.white);

//object
const landGeometry = new THREE.PlaneGeometry(4, 3);
const landMaterial = new THREE.MeshBasicMaterial({ color: COLORS.brown, side: THREE.DoubleSide });
const landMesh = new THREE.Mesh(landGeometry, landMaterial);
landMesh.rotateX(Math.PI * 0.5);

const boxPositions = [
    [0, 0, 0],
    [0, 0, 1],
    [-0.5, 0, -1],
    [1.5, 0, 0],
    [-1.5, 0, 0],
    [-0.5, 0, 1],
    [1.5, 0, 1],
];

function generateBoxes() {
    const boxes = [];
    for (let i = 0; i < boxPositions.length; i++) {
        const height = Math.random() * 1 + 0.3;
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, height, 0.2),
            new THREE.MeshBasicMaterial({ color: COLORS.red })
        );
        box.position.set(boxPositions[i][0], boxPositions[i][1] + height * 0.5 + 0.01, boxPositions[i][2]);
        boxes.push(box);
    }
    return boxes;
}

const buildings = generateBoxes();

const sizes = {
    width: 800,
    height: 600
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
camera.position.y = 1;
camera.position.x = -2
scene.add(camera);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersects = null;
let currentIntersect = null;
let selectedIntersect = null;

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1;
    mouse.y = - (event.clientY / sizes.height) * 2 + 1;
});

window.addEventListener('click', () => {
    if (currentIntersect) {
        if (selectedIntersect) {
            selectedIntersect.object.material.color.set(COLORS.red)
            if (selectedIntersect.object === currentIntersect.object) {
                selectedIntersect = null;
            } else {
                selectedIntersect = currentIntersect;
                selectedIntersect.object.material.color.set(COLORS.green)
            }
        } else {
            selectedIntersect = currentIntersect;
            selectedIntersect.object.material.color.set(COLORS.green)
        }
    }
})

function handleRaycasterHover() {
    intersects = raycaster.intersectObjects(buildings);
    // for (const intersect of intersects) {
    //     intersect.object.material.color.set('#0000ff')
    // }

    // for (const building of buildings) {
    //     if (!intersects.find(intersect => intersect.object === building)) {
    //         building.material.color.set('#ff0000')
    //     }
    // }
}

function handleMouseHover() {
    if (intersects.length) {
        // if (currentIntersect === null) {
        //     console.log('mouse enter');
        // }
        document.body.style.cursor = 'pointer';
        currentIntersect = intersects[0];
    } else {
        // if (currentIntersect) {
        //     console.log('mouse leave');
        // }
        document.body.style.cursor = 'auto';
        currentIntersect = null;
    }
}

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);
scene.add(landMesh);
scene.add(...buildings);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});

renderer.setSize(sizes.width, sizes.height);

const controls = new OrbitControls(camera, canvas);
controls.minDistance = 2;
controls.maxDistance = 5;
controls.maxPolarAngle = Math.PI * 0.5;
controls.enableDamping = true;

const clock = new THREE.Clock();

function animate() {

    //raycaster
    raycaster.setFromCamera(mouse, camera);
    handleRaycasterHover();
    handleMouseHover();

    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

animate();