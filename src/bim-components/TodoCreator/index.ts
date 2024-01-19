import * as OBC from 'openbim-components'
import { TodoCard } from './src/TodoCard'
import * as THREE from 'three'

interface Todo {
    description: string
    date: Date
    fragmentMap: OBC.FragmentIdMap
    camera: {position: THREE.Vector3, target: THREE.Vector3}
}


export class TodoCreator extends OBC.Component<Todo[]> implements OBC.UI {
    static uuid = "c8b94e2b-23a4-4840-98b7-ef0e790a2b01"
    enabled = true
    uiElement = new OBC.UIElement<{
        activationButton: OBC.Button
        todoList: OBC.FloatingWindow
    }>()
    private _components: OBC.Components
    private _list: Todo[] = []

    constructor(components: OBC.Components) {
        super(components)
        this._components = components
        components.tools.add(TodoCreator.uuid, this)
        this.setUI()
    }

    async addTodo(description: string) {
        const camera = this._components.camera
        if (!(camera instanceof OBC.OrthoPerspectiveCamera)){
            throw new Error("This tool only works with OrthoPerspectiveCamera")
        }
        
        const position = new THREE.Vector3()
        camera.controls.getPosition(position)
        const target = new THREE.Vector3()
        camera.controls.getTarget(target)
        const todoCamera = {position, target}
        
        const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
        const todo : Todo = {
            camera: todoCamera,
            description,
            date: new Date(),
            fragmentMap: highlighter.selection.select
        }
        this._list.push(todo)
        const todoCard = new TodoCard(this._components)
        const todoList = this.uiElement.get("todoList")
        todoList.addChild(todoCard)
        todoCard.description = todo.description
        todoCard.date = todo.date
        todoCard.onCardClick.add(() => {
            camera.controls.setLookAt(todo.camera.position.x,
                todo.camera.position.y,
                todo.camera.position.z,
                todo.camera.target.x,
                todo.camera.target.y,
                todo.camera.target.z,
                true)
            
            const fragmentsMapLength = Object.keys(todo.fragmentMap).length
            if (fragmentsMapLength === 0) { return }
                highlighter.highlightByID("select", todo.fragmentMap)
            
        })
    }


    private setUI(){
        const activationButton = new OBC.Button(this._components)
        activationButton.materialIcon = "construction"

        const newTodoBtn = new OBC.Button(this._components, {name: "Create" })
        activationButton.addChild(newTodoBtn)

        const form = new OBC.Modal(this._components)
        this._components.ui.add(form)
        form.title = "New To-Do"

        const descriptionInput = new OBC.TextArea(this._components)
        descriptionInput.label = "Description"
        form.slots.content.addChild(descriptionInput)

        form.slots.content.get().style.padding = "20px"

        form.onAccept.add(() => {
            this.addTodo(descriptionInput.value)
            form.visible = false
            descriptionInput.value = ""
        })
        form.onCancel.add(() => form.visible = false)

        newTodoBtn.onClick.add(() => form.visible = !form.visible)

        const todoList = new OBC.FloatingWindow(this._components)
        this._components.ui.add(todoList)
        todoList.visible = false
        todoList.title = "To-Do List"

        const todoListBtn = new OBC.Button(this._components, {name: "List" })
        activationButton.addChild(todoListBtn)
        todoListBtn.onClick.add(() => todoList.visible = !todoList.visible)

        this.uiElement.set({activationButton, todoList})
    }

    get(): Todo[] {
        return this._list
    }
}