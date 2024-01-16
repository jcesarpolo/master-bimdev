import * as OBC from "openbim-components"

export class TodoCard extends OBC.SimpleUIComponent {

    set description(value: string){
        const descriptionElement = this.getInnerElement("description") as HTMLParagraphElement
        descriptionElement.textContent = value
    }

    set date(value: Date) {
        const dateElement = this.getInnerElement("date") as HTMLParagraphElement
        dateElement.textContent = value.toDateString()

    }

    constructor(components: OBC.Components){
        const template = `
        <div class="todo-item">
            <div style="display: flex; flex-direction: row; column-gap: 10px; border-radius: 10px; align-items: center;">
                <div style="display: flex; column-gap: 15px; align-items: center;">
                    <p style="background-color: #979696; aspect-ratio: 1; align-items: center; border-radius: 10px; padding: 8px;"><span class="material-icons-round">
                        construction
                        </span></p>
                    <p id="description" style="font-size: var(--font-sm);">Make anything here  as you want,even something longer</p>
                </div>
                <p id="date" style="width: 100px; font-size: var(--font-base);">Fri, 20 sep</p>
            </div>
        </div>
        `
        
        super(components, template)
    }
}