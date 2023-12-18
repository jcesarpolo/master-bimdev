import { v4 as uuidv4} from "uuid";

export type ProjectStatus = "Active" | "Pending" | "Finished";
export type UserRole = "Architect" | "Developer" | "Engineer";


export interface IProject {
    name : string
    description : string
    role : UserRole
    status: ProjectStatus
    finishDate: Date

}

export class Project implements IProject{
   
    ui: HTMLDivElement
    cost : number = 0
    progress : number = 0
    id : string
    
    
    name : string
    description : string
    role : UserRole
    status: ProjectStatus
    finishDate: Date

    constructor(data: IProject){
        for (const key in data) {
            this[key] = data[key]
        }
        this.id = uuidv4()
        this.setUi()
    }

    setUi() {
        if (this.ui && this.ui instanceof HTMLElement) {return}
        this.ui = document.createElement("div")
        this.ui.className = "project-card"
        this.ui.innerHTML = `
        <div class="card-header">
            <p style="background-color: #ca8134; padding: 10px; border-radius: 8px; aspect-ratio: 1; min-width:20px;">${this.getInitials()}</p>
            <div>
                <h5>${this.name}</h5>
                <p>${this.description}</p>
            </div>
        </div>
        <div class="card-content">
            <div class="card-property">
                <p style="color: #969696;">Status</p>
                <p>${this.status}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Role</p>
                <p>${this.role}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Cost</p>
                <p>$${this.cost}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Estimated Progress</p>
                <p>${this.progress}</p>
            </div>
        </div> `
    }

    getInitials() {
        const name = this.name
        const names = name.split(" ")
        const initials = names.map((name) => {
            return name[0].toUpperCase()
        })
        return initials.join("")
    }
}