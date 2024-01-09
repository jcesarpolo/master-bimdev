import * as OBC from 'openbim-components'

export class TodoCreator extends OBC.Component<null> implements OBC.UI {
    static uuid = "c8b94e2b-23a4-4840-98b7-ef0e790a2b01"
    enabled = true
    uiElement = new OBC.UIElement<{
        activationButton: OBC.Button
        todoList: OBC.FloatingWindow
    }>()
    private _components: OBC.Components

    constructor(components: OBC.Components) {
        super(components)
        this._components = components
        components.tools.add(TodoCreator.uuid, this)
        this.setUI()
    }

    private setUI(){
        const activationButton = new OBC.Button(this._components)
        activationButton.materialIcon = "construction"

        const newTodoBtn = new OBC.Button(this._components, {name: "Create" })
        activationButton.addChild(newTodoBtn)

        const todoList = new OBC.FloatingWindow(this._components)
        this._components.ui.add(todoList)
        todoList.visible = false
        todoList.title = "To-Do List"

        const todoListBtn = new OBC.Button(this._components, {name: "List" })
        activationButton.addChild(todoListBtn)
        todoListBtn.onClick.add(() => todoList.visible = !todoList.visible)


        this.uiElement.set({activationButton, todoList})
    }

    get(this, _components) {
        return this.uiElement.get('todoList')
    }
}