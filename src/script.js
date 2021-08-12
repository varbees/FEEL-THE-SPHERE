import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { generateUUID } from 'three/src/math/MathUtils'

//Loading
const textureLoader = new THREE.TextureLoader()

const normalTexture = textureLoader.load('textures/normalmetalhammer.jpg')


// Debug
const gui = new dat.GUI( {width: 300})
gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene =  new THREE.Scene()

// Objects
// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const sphereGeometry = new THREE.SphereBufferGeometry(.5, 64, 64)

// Materials

const material = new THREE.MeshStandardMaterial({
    color : 0x292929,
    metalness : 0.75,
    roughness : 0.1,
    normalMap : normalTexture
})
// material.color = new THREE.Color(0xff0000)

// Mesh
const sphere = new THREE.Mesh(sphereGeometry,material)
scene.add(sphere)



gui.add(sphere.material, 'wireframe')

// Lights

const pointLight1 = new THREE.PointLight(0xffffff, 0.2)
pointLight1.position.set(3,3,4)
scene.add(pointLight1)

//debug for light1
const light1 = gui.addFolder('whiteLight')
light1.add(pointLight1.position, 'x').min(-6).max(6).step(0.01).name('x')
light1.add(pointLight1.position, 'y').min(-3).max(3).step(0.01).name('y')
light1.add(pointLight1.position, 'z').min(-3).max(3).step(0.01).name('z')

//2nd Light
const pointLight2 = new THREE.PointLight(0xff0000, 7)
pointLight2.position.set(-1.97, 1.58, -1.65)
// pointLight2.intensity = 1
scene.add(pointLight2)

//debug for pointLight2
const light2 = gui.addFolder('Red Light')
light2.add(pointLight2.position, 'x').min(-6).max(6).step(0.01).name('x')
light2.add(pointLight2.position, 'y').min(-3).max(3).step(0.01).name('y')
light2.add(pointLight2.position, 'z').min(-3).max(3).step(0.01).name('z')
light2.add(pointLight2, 'intensity').min(0).max(10).step(0.01).name('intensity')

//3rd Light
const pointLight3 = new THREE.PointLight(0x25c8b4, 7)
pointLight3.position.set(1.97, -1.58, -1.65)
// pointLight2.intensity = 1
scene.add(pointLight3)

//debug for pointLight3
const light3 = gui.addFolder('cyan Light')
light3.add(pointLight3.position, 'x').min(-6).max(6).step(0.01).name('x')
light3.add(pointLight3.position, 'y').min(-3).max(3).step(0.01).name('y')
light3.add(pointLight3.position, 'z').min(-3).max(3).step(0.01).name('z')
light3.add(pointLight3, 'intensity').min(0).max(10).step(0.01).name('intensity')
//Debug Light Helper
// const pointLightHelper = new THREE.PointLightHelper(pointLight3, 0.5)
// scene.add(pointLightHelper)
//Debug Light colors for pointLight3
const light3Color = {
    color : 0x00ff00
}

light3.addColor(light3Color, 'color').onChange(()=> {
    pointLight3.color.set(light3Color.color)
})




/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha : true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */


//Function to regulate movement of sphere in relation with mouse - to make it appear smooth
document.addEventListener('mousemove', onDocumentMouseMove)
document.addEventListener('touchmove', onDocumentMouseMove)

let mouseX = 0
let mouseY = 0

let targetX = 0
let targetY = 0

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowX
    mouseY = event.clientY - windowY

}

//ScrollEffect
const updateSphere = (event) => {
    sphere.position.y = window.scrollY * 0.003
}
window.addEventListener('scroll', updateSphere)


const clock = new THREE.Clock()

const tick = () =>
{
    targetX = mouseX * 0.001
    targetY = mouseY * 0.001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.5 * elapsedTime

    sphere.rotation.x += .05 * (targetY - sphere.rotation.x)
    sphere.rotation.y += .5 * (targetX - sphere.rotation.y)
    sphere.position.z += -.05 * (targetY - sphere.rotation.x)

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()