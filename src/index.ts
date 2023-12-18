import * as THREE from "three";
import { Project, IProject, UserRole, ProjectStatus} from "./class/Project";
import { ProjectsManager } from "./class/ProjectsManager";

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
const scene = new THREE.Scene()

const viewerContainer = document.getElementById("viewer-container") as HTMLElement
const containerDimensions = viewerContainer.getBoundingClientRect()
const aspectRatio = containerDimensions.width / containerDimensions.height
const camera = new THREE.PerspectiveCamera(75, aspectRatio)

const renderer = new THREE.WebGLRenderer()
viewerContainer.append(renderer.domElement)
renderer.setSize(containerDimensions.width, containerDimensions.height)

renderer.render(scene, camera)