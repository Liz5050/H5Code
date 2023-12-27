/**
 * 材料副本
 * @author zhh
 * @time 2018-05-24 19:39:38
 */
class CopyHallMaterialsPanel extends BaseTabView{
    private listCopy:List;
    private copyInfos:any[];

	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index:number) {
		//super(view, controller, index);
        super();
	}

	public initOptUI():void{
        //---- script make start ----
        this.listCopy = new List(this.getGObject("list_copy").asList);

        //---- script make end ----
        this.copyInfos = ConfigManager.copy.getCopysByType(ECopyType.ECopyMgMaterial);
        
	}

	public updateAll(data?:any):void{
        let tempArr:any[] = this.copyInfos.concat();
        App.ArrayUtils.sortOn(tempArr,'enterMinLevel');
        /*
        let dfNum:number = 5;
        if(tempArr.length<dfNum){
            let addNum:number = dfNum-tempArr.length;
            for(let i:number = 0;i<addNum;i++){
                tempArr.push(CopyItem.NONE_DATA);
            }
        }        
        */
        this.listCopy.setVirtual(tempArr);        
        let copyCode: number;
        for (let i: number = 0; i < this.listCopy.list._children.length; i++) {
            if(i<this.copyInfos.length){
                copyCode = this.copyInfos[i].code;
                GuideTargetManager.reg(GuideTargetName.CopyHallMaterialsPanelChanglleBtn + copyCode, this.listCopy.list._children[i]["btnChanglle"]);
            }            
        }
	}	
    public hide():void{
        super.hide();
        this.listCopy.scrollToView(0);
    }

}