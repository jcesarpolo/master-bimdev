import { IProject, Project } from "./Project"

export class ProjectsManager {
    list: Project[] = []
    ui : HTMLElement

    constructor(container: HTMLElement) {
        this.ui = container
    }


    newProject (data: IProject) {
        const projectNames = this.list.map((project) => {
            return project.name
        })
        const nameInUuse = (projectNames.includes(data.name))
        if (nameInUuse) {
            throw new Error(`A project with the name "${data.name}" already exist`)
        }

        const project = new Project(data)
        project.ui.addEventListener("click", () => { 
            const projectsPage = document.getElementById("projects-page")
            const detailsPage = document.getElementById("project-details")
            if (!projectsPage || !detailsPage) {return}
            projectsPage.style.display = "none"
            detailsPage.style.display = "flex"
        })

        this.ui.appendChild(project.ui)
        this.list.push(project)
        return project
    }

    getProject (id: string) {
        const project = this.list.find((project) => {
            return project.id === id
        })
        return project
    }

    getProjectByName(name: string) {
        const project = this.list.find ((project) => {
            return project.name === name
        })
        return project
    }

    getTotalProjectsCost() {
        const totalCost = this.list.reduce((total, project) => {
            return total + project.cost
        }, 0)
    }

    deleteProject (id: string) {
        const project = this.getProject(id)
        if (!project) {return}
        project.ui.remove()
        const remaining = this.list.filter((project) => {
            return project.id !== id
        })
        this.list = remaining
        }

    exportToJSON(filename: string = "projects") {
        const json = JSON.stringify(this.list)
        const blob = new Blob([json], {type: "application/json"})
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
    }

    importFromJSON() {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "application/json"
        const reader = new FileReader()
        reader.addEventListener( "load", () => {
            const json = reader.result
            if (!json) {return}
            const projects: IProject[] = JSON.parse(json as string)
            for (const project of projects) {
                try {
                    this.newProject(project)
                } catch (error) {
                    //console.error(error.message)
                    //console.warn(`${project}`)
                }
            }
        })
        input.addEventListener("change", () => {
            const filesList = input.files
            if (!filesList) {return}
            reader.readAsText(filesList[0])
        })
        input.click()
    }


    
}
