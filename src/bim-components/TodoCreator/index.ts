import * as OBC from 'openbim-components'
import { TodoCard } from './src/TodoCard'
import * as THREE from 'three'
import { BufferGeometry, BufferAttribute, Mesh, Box3, MeshStandardMaterial } from 'three';



interface Todo {
    description: string
    date: Date
    fragmentMap: OBC.FragmentIdMap
    camera: {position: THREE.Vector3, target: THREE.Vector3}
}


// Function to get geometries by expressIds and compute their combined bounding box
async function getGeometriesAndBoundingBox(expressIds: number[], scene: THREE.Scene): Promise<Box3> {
    const meshes: THREE.Mesh[] = [];

    expressIds.forEach(id => {
        const geometry = findGeometryByExpressId(id, scene);
        if (geometry) {
            const material = new THREE.MeshStandardMaterial({ color: 0x8F8F8F }); // Default material
            const mesh = new THREE.Mesh(geometry, material);
            meshes.push(mesh);
        }
    });

    return calculateBoundingBox(meshes);
}

// Helper function to find geometry by expressId in the scene
function findGeometryByExpressId(expressId: number, scene: THREE.Scene): THREE.BufferGeometry | null {
    let targetGeometry: THREE.BufferGeometry | null = null;
    scene.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh && child.geometry && child.geometry.attributes.expressID) {
            const expressIDAttribute = child.geometry.attributes.expressID;
            for (let i = 0; i < expressIDAttribute.count; i++) {
                if (expressIDAttribute.getX(i) === expressId) {
                    targetGeometry = child.geometry;
                    break;
                }
            }
        }
    });
    return targetGeometry;
}

// Function to calculate the bounding box from an array of meshes
function calculateBoundingBox(meshes: THREE.Mesh[]): Box3 {
    const boundingBox = new THREE.Box3();
    meshes.forEach(mesh => {
        mesh.geometry.computeBoundingBox();
        if (mesh.geometry.boundingBox){
            boundingBox.union(mesh.geometry.boundingBox);
        }
    });
    return boundingBox;
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
        console.log(highlighter.selection.select)
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
        todoCard.onCardClick.add(async () => {
            
            // const expressIds = Object.values(todo.fragmentMap)
            // .flatMap(set => Array.from(set)) // Convert each Set to an array and flatten
            // .map(id => parseInt(id, 10));
            // const boundingBoxes = await getGeometriesAndBoundingBox(expressIds, this._components.scene.get())
            // console.log(boundingBoxes)
            // camera.controls.fitToBox(boundingBoxes, true)
            
            console.log(this._components.scene.get().children)

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
            //console.log(todo.fragmentMap)
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