import * as OBC from "openbim-components"
import { FragmentsGroup } from "bim-fragment"

export class SimpleQTO extends OBC.Component<null> implements OBC.UI, OBC.Disposable{
    private _components: OBC.Components
    static uuid = "4167d90b-9b08-44b8-a547-f1c9ccafde33"
    uiElement = new OBC.UIElement<{
        activationBtn: OBC.Button
        qtoList: OBC.FloatingWindow
    
    }>()
    enabled: boolean = true
    
    constructor(components: OBC.Components) {
        super(components)
        this._components = components
        this.setUI()
        components.tools.add(SimpleQTO.uuid, this)
    }

    async setup(){
        const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
        highlighter.events.select.onHighlight.add((fragmentIdMap) => {
            this.sumQuantities(fragmentIdMap)
        })
    }


    private setUI(){
        const activationBtn = new OBC.Button(this._components)
        activationBtn.materialIcon = "functions"

        const qtoList = new OBC.FloatingWindow(this._components)
        qtoList.title = "Quantification"
        this._components.ui.add(qtoList)
        qtoList.visible = false

        activationBtn.onClick.add(() => {
            activationBtn.active = !activationBtn.active
            qtoList.visible = activationBtn.active
        })

        this.uiElement.set({activationBtn, qtoList})
    }

    async sumQuantities(fragmentIdMap: OBC.FragmentIdMap){
        const fragmentManager = await this._components.tools.get(OBC.FragmentManager)
        for (const fragmentId in fragmentIdMap){
            const fragment = fragmentManager.list[fragmentId]
            const model = fragment.mesh.parent
            if (!(model instanceof FragmentsGroup && model.properties)) {continue}
            const properties = model.properties
        }
    }

    async dispose () {
        this.uiElement.dispose()
    }

    get(): null {
        return null
    }
}