import { IProject, Project } from "./Project"

export class ProjectsManager {
    list: Project[] = []

    constructor() {
        const project = this.newProject({
            name: "Project 1",
            description: "This is a description",
            role: "Architect",
            status: "Active",
            finishDate: new Date()
            })
        // project.ui.click()
    }


    newProject (data: IProject) {
        const projectNames = this.list.map((project) => {
            return project.name
        })
        const nameInUse = (projectNames.includes(data.name))
        if (nameInUse) {
            throw new Error(`A project with the name "${data.name}" already exist`)
        }
        if (data.name.length < 5) {
            throw new Error("The project name must be at least 5 characters long")
        }

        const project = new Project(data)
        // project.ui.addEventListener("click", () => { 
        //     const projectsPage = document.getElementById("projects-page")
        //     const detailsPage = document.getElementById("project-details")
        //     if (!projectsPage || !detailsPage) {return}
        //     projectsPage.style.display = "none"
        //     detailsPage.style.display = "flex"
        //     this.setDetailsPage(project)
        // })

        // this.ui.appendChild(project.ui)
        this.list.push(project)
        return project
    }

    setDetailsPage (project: Project) {
        const detailsPage = document.getElementById("project-details")
        if (!detailsPage) { return }
        const names = detailsPage.querySelectorAll("[data-project-info='name']")
        if (names) {names.forEach((name)=>{name.textContent = project.name})}
        const descriptions = detailsPage.querySelectorAll("[data-project-info='description']")
        if (descriptions) { descriptions.forEach((description)=>{description.textContent = project.description})}
        const status = detailsPage.querySelector("[data-project-info='status']")
        if (status) {status.textContent = project.status}
        const cost = detailsPage.querySelector("[data-project-info='cost']")
        if (cost) {cost.textContent ="$" + project.cost.toString()}
        const role = detailsPage.querySelector("[data-project-info='role']")
        if (role) {role.textContent = project.role}
        const finishDate = detailsPage.querySelector("[data-project-info='finish-date']")
        if (finishDate) {finishDate.textContent = project.finishDate.toDateString()}
        const progress = detailsPage.querySelector("[data-project-info='progress']") as HTMLDivElement
        if (progress) {
            progress.textContent = `${project.progress}%`
            progress.style.width = `${project.progress}%`
        }
        const initials = detailsPage.querySelector("[data-project-info='initials']") as HTMLElement
        if (initials) {initials.textContent = project.getInitials()}
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
        // project.ui.remove()
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
