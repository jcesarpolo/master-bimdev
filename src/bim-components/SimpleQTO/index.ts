import * as OBC from "openbim-components"
import { FragmentsGroup } from "bim-fragment"
import * as WEBIFC from "web-ifc"

type QtoResult = { [name: string]: {[qtoName: string]: number} }

export class SimpleQTO extends OBC.Component<QtoResult> implements OBC.UI, OBC.Disposable{
    private _components: OBC.Components
    private _qtoResult: QtoResult = {}
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
        highlighter.events.select.onClear.add(() => {
            this.resetQuantities()
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
    resetQuantities(){
        this._qtoResult = {}
    }
    async sumQuantities(fragmentIdMap: OBC.FragmentIdMap){
        const fragmentManager = await this._components.tools.get(OBC.FragmentManager)
        //const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
        for (const fragmentId in fragmentIdMap){
            const fragment = fragmentManager.list[fragmentId]
            const model = fragment.mesh.parent
            if (!(model instanceof FragmentsGroup && model.properties)) {continue}
            const properties = model.properties
            OBC.IfcPropertiesUtils.getRelationMap(properties, 
                WEBIFC.IFCRELDEFINESBYPROPERTIES,
                (setID, relatedIDs) => {
                    const set = properties[setID]
                    const expressIDs = fragmentIdMap[fragmentId]
                    const workingIDs = relatedIDs.filter(id => expressIDs.has(id.toString()))
                    const {name: setName} = OBC.IfcPropertiesUtils.getEntityName(properties, setID)
                    if (set.type !== WEBIFC.IFCELEMENTQUANTITY || workingIDs.length === 0 || !setName) {return}
                    if (!(setName in this._qtoResult)) {this._qtoResult[setName] = {}}
                    OBC.IfcPropertiesUtils.getQsetQuantities(
                        properties,
                        setID,
                        (qtoID) => {
                            const {name: qtoName} = OBC.IfcPropertiesUtils.getEntityName(properties, qtoID)
                            const {value} = OBC.IfcPropertiesUtils.getQuantityValue(properties, qtoID)
                            if (!qtoName || !value) {return}
                            if (!(qtoName in this._qtoResult[setName])) {this._qtoResult[setName][qtoName] = 0}
                            this._qtoResult[setName][qtoName] += value
                        }
                    )
                }
            )
        }
        console.log(this._qtoResult)
    }

    async dispose () {
        this.uiElement.dispose()
        this.resetQuantities()
    }

    get(): QtoResult {
        return this._qtoResult
    }
}