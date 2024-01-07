import * as THREE from "three";
import * as OBC from "openbim-components"
import {GUI} from "three/examples/jsm/libs/lil-gui.module.min"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { Project, IProject, UserRole, ProjectStatus} from "./class/Project";
import { ProjectsManager } from "./class/ProjectsManager";
import { FragmentsGroup, IfcProperties } from "bim-fragment";

// Function to show or hide the modal depending on a toggle.
function toggleModal(id : string, toggle: boolean) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
        if (toggle) {
            modal.showModal()
        }
        else {
            modal.close()
        }
    } else {
        console.warn(`Modal "${id}" not found on the page`)
    }
}

//The HTML element
const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn !== null) {
    // Shows the formed when the button is clicked
    newProjectBtn.addEventListener("click", () => {toggleModal("new-project-modal", true)} )
} else {
    console.warn("New projects button was not found")
}

const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)

const projectForm = document.getElementById("new-project-form")
const popup = document.getElementById("error-popup")
if (projectForm && popup && projectForm instanceof HTMLFormElement) {
    projectForm.addEventListener("submit", (e) =>{
        e.preventDefault()
        const formData = new FormData(projectForm)
        const projectData : IProject = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            role: formData.get("role") as UserRole,
            status: formData.get("status") as ProjectStatus,
            finishDate: new Date(formData.get("finish-date") as string).getTime()? new Date(formData.get("finish-date") as string) : new Date()
        }
        try{
            const project = projectsManager.newProject(projectData)
            projectForm.reset()
            toggleModal("new-project-modal", false)
            //console.log(project)
        }
        catch (error) {
            const message = popup.querySelector("#error-popup-text")
            if (!message) {return}
            message.textContent = error.message
            toggleModal("error-popup", true)
        }
    })

    projectForm.addEventListener("reset", () => {
        toggleModal("new-project-modal", false)
    })

    popup.addEventListener("click", () => {
        toggleModal("error-popup", false)
    })
} else {
    console.warn("The project form was not found.")
}

const exportBtn = document.getElementById("export-projects-btn")
if (exportBtn && exportBtn instanceof HTMLElement) {
    exportBtn.addEventListener("click", () => {
        projectsManager.exportToJSON()
    })
}
const importBtn = document.getElementById("import-projects-btn")
if (importBtn && importBtn instanceof HTMLElement) {
    importBtn.addEventListener("click", () => {
        projectsManager.importFromJSON()
    })
}

const projectsNavBtn = document.getElementById("projects-nav-btn")
const projectsPage = document.getElementById("projects-page")
const detailsPage = document.getElementById("project-details")
if (projectsNavBtn && projectsPage && detailsPage) {
    projectsNavBtn.addEventListener("click", () => {
        detailsPage.style.display = "none"
        projectsPage.style.display = "flex"
    })
}

//ThreeJS Viewer
// const scene = new THREE.Scene()

// const viewerContainer = document.getElementById("viewer-container") as HTMLElement
// const camera = new THREE.PerspectiveCamera(75)
// camera.position.z = 4

// const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
// viewerContainer.append(renderer.domElement)

// function resizeViewer() {
//     const containerDimensions = viewerContainer.getBoundingClientRect()
//     renderer.setSize(containerDimensions.width, containerDimensions.height)
//     const aspectRatio = containerDimensions.width / containerDimensions.height
//     camera.aspect = aspectRatio
//     camera.updateProjectionMatrix() 
// }

// window.addEventListener("resize", () => { resizeViewer()})
// resizeViewer()

const boxGeometry = new THREE.BoxGeometry()
const material = new THREE.MeshStandardMaterial({color: "#B2BEB5"})
const cube = new THREE.Mesh(boxGeometry, material)

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
// //scene.add(cube)
// scene.add(ambientLight, directionalLight)

// const cameraControls = new OrbitControls(camera, renderer.domElement)

// function renderScene(){
//     renderer.render(scene, camera)
//     requestAnimationFrame(renderScene)
// }
// renderScene()

// const axis = new THREE.AxesHelper()
// const grid = new THREE.GridHelper()
// grid.material.transparent = true
// grid.material.opacity = 0.4
// grid.material.color = new THREE.Color("#808080")

// scene.add(axis, grid)

// const gui = new GUI()
// const cubeControls = gui.addFolder("Cube")
// cubeControls.add(cube.position, "x", -10, 10, 1)
// cubeControls.add(cube.position, "y", -10, 10, 1)
// cubeControls.add(cube.position, "z", -10, 10, 1)
// cubeControls.add(cube, "visible")
// cubeControls.addColor(material, "color")

// const dlightHelper = new THREE.DirectionalLightHelper(directionalLight, 2)
// scene.add(dlightHelper)
// const lightControls = gui.addFolder("Lights")
// lightControls.add(directionalLight, "intensity", 0, 1, 0.1)
// lightControls.add(directionalLight.position, "x", -10, 10, 1)
// lightControls.add(directionalLight.position, "y", -10, 10, 1)
// lightControls.add(directionalLight.position, "z", -10, 10, 1)

// const objLoader = new OBJLoader()
// const mtlLoader = new MTLLoader()
// objLoader.load("../assets/Gear/Gear1.obj", (mesh) => {
//     scene.add(mesh)
// })
// mtlLoader.load("../assets/Gear/Gear1.mtl", (materials) => {
//     materials.preload()
//     objLoader.setMaterials(materials)
// })

const viewer = new OBC.Components()

const sceneComponent = new OBC.SimpleScene(viewer)
sceneComponent.setup()
viewer.scene = sceneComponent
const scene = sceneComponent.get()
scene.background = null

const viewerContainer = document.getElementById("viewer-container") as HTMLElement
const rendererComponent = new OBC.PostproductionRenderer(viewer, viewerContainer)
viewer.renderer = rendererComponent

const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer)
viewer.camera = cameraComponent
cameraComponent.updateAspect()
rendererComponent.postproduction.enabled = true

viewer.init()

//Fragment Manager and download
//Must be after the viewer is initialized and before the ifc loader is created
const fragmentManager = new OBC.FragmentManager(viewer)
function exportFragments(model : FragmentsGroup) {
    //Export frag
    const fragmentsBinary = fragmentManager.export(model)
    const blob = new Blob([fragmentsBinary])
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${model.name.replace(".ifc", "")}.frag`
    a.click()
    URL.revokeObjectURL(url)

    //Export JSON
    const json = JSON.stringify(model.properties)
    const jsonBlob = new Blob([json], {type: "application/json"})
    const jsonUrl = URL.createObjectURL(jsonBlob)
    const an = document.createElement("a")
    an.href = jsonUrl
    an.download = `${model.name.replace(".ifc", "")}.json`
    an.click()
    URL.revokeObjectURL(jsonUrl)
}


const ifcloader = new OBC.FragmentIfcLoader(viewer)
ifcloader.settings.wasm = {
    path: "https://unpkg.com/web-ifc@0.0.43/",
    absolute: true
}

//Higfhlighter setup
const raycaster = new OBC.SimpleRaycaster(viewer)
viewer.raycaster = raycaster
const highlighter = new OBC.FragmentHighlighter(viewer)
highlighter.setup()

//Initialize the Properties Processor
const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer)
highlighter.events.select.onClear.add(() => {
    propertiesProcessor.cleanPropertiesList()
})

//Classify the model
const classifier = new OBC.FragmentClassifier(viewer)
const classificationWindow = new OBC.FloatingWindow(viewer)
classificationWindow.visible = false
classificationWindow.title = "Model Groups"
viewer.ui.add(classificationWindow)

const classificationBtn = new OBC.Button(viewer)
classificationBtn.materialIcon = "account_tree"

classificationBtn.onClick.add(() => {
    classificationWindow.visible = !classificationWindow.visible
    classificationBtn.active = classificationWindow.visible
})

async function createModelTree() {
    const fragmentTree = new OBC.FragmentTree(viewer)
    await fragmentTree.init()
    await fragmentTree.update(["model","storeys", "entities"])
    fragmentTree.onHovered.add((fragmentMap) => {
        highlighter.highlightByID("hover", fragmentMap)
    })
    fragmentTree.onSelected.add((fragmentMap) => {
        highlighter.highlightByID("select", fragmentMap)
    })
    const tree = fragmentTree.get().uiElement.get("tree")
    return tree
}

//setup culler for optimization
const culler = new OBC.ScreenCuller(viewer)
cameraComponent.controls.addEventListener("sleep", () => {
    culler.needsUpdate = true
})

async function onModelLoaded(model: FragmentsGroup){
    highlighter.update()
    //add the meshes to the culler
    for (const fragment of model.items) {culler.add(fragment.mesh)}
    culler.needsUpdate = true

    try {
        classifier.byModel(model.name, model)
        classifier.byStorey(model)
        classifier.byEntity(model)
        const tree = await createModelTree()
        classificationWindow.slots.content.dispose(true)
        classificationWindow.addChild(tree)

        propertiesProcessor.process(model)
        highlighter.events.select.onHighlight.add((fragmentMap) => {
            const expressID = [...Object.values(fragmentMap)[0]][0]
            propertiesProcessor.renderProperties(model, Number(expressID))
        })
    }
    catch (error) {
        alert(error)
    }
}
let tempProperties : IfcProperties= {};
fragmentManager.onFragmentsLoaded.add((model) => {
    //add properties here
    if (tempProperties) {
        model.properties = tempProperties
        tempProperties = {}
    }
    onModelLoaded(model)
})

ifcloader.onIfcLoaded.add(async (model) => {
    exportFragments(model)
    onModelLoaded(model)
})

const importFragmentsBtn = new OBC.Button(viewer)
importFragmentsBtn.materialIcon = "upload"
importFragmentsBtn.tooltip = "Load FRAG file"

importFragmentsBtn.onClick.add(() => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept=".frag, .json" 
    input.multiple = true
    
    input.addEventListener("change", () => {
        const filesList = input.files
        if (!filesList || filesList.length != 2) {return}
        for (const file of filesList) {
            const reader = new FileReader()
            if (file.name.endsWith(".frag")) {
                reader.readAsArrayBuffer(file)
            }
            else if (file.name.endsWith(".json")) {
                reader.readAsText(file)
            }

            reader.addEventListener( "load", async () => {
                const result = reader.result
                let fragmentBinary : Uint8Array = new Uint8Array(0)
                let properties : IfcProperties = {}

                if (!result) {return}
                if (result instanceof ArrayBuffer) {
                    const binary = result
                    fragmentBinary = new Uint8Array(binary)
                } else {
                    const json = result as string
                    properties = JSON.parse(json) as IfcProperties
                    tempProperties = properties
                }
                await fragmentManager.load(fragmentBinary)
            })
        }
    })
    input.click()
})

const toolbar = new OBC.Toolbar(viewer)
toolbar.addChild(
    ifcloader.uiElement.get("main"),
    importFragmentsBtn,
    classificationBtn,
    propertiesProcessor.uiElement.get("main"),
    fragmentManager.uiElement.get("main")
)
viewer.ui.addToolbar(toolbar)

