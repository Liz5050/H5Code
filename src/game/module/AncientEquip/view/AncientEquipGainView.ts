/**
 * 获取途径组件
 * @author zhh
 * @time 2018-08-27 16:58:32
 */
class AncientEquipGainView extends BaseView{
    private listGain:List;
    private itemCode: number;
	private cfg: any;
	private itemData: ItemData;
	private _listAddH:number = 0;
	public constructor(view:fairygui.GComponent) {
		super(view)
	}
	public initOptUI():void{
        //---- script make start ----
        this.listGain = new List(this.getGObject("list_gain").asList);

        this.listGain.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----


	}
	public updateAll(data?:any):void{
		this.itemCode = data.itemCode;
		if (this.itemCode) {
			this.cfg = ConfigManager.propGet.getByPk(this.itemCode);
			if (this.cfg != null) {
				this.itemData = new ItemData(this.itemCode);
				if(!this.cfg.buyLink){
					this.listGain.data = [];
					return;
				}
				// let links:string[] = CommonUtils.configStrToArr(this.cfg.buyLink,false);
				let linkInfo:any[] = [];
				// for(let i:number=0;i<links.length;i++){
				// 	let obj:any = {};
				// 	obj.type = links[i];
				// 	if(data.posType){
				// 		obj.posType = data.posType; 
				// 	}
				// 	linkInfo.push(obj);
				// }
				linkInfo = ConfigManager.propGet.getDataById(this.itemCode);
				for(let obj of linkInfo){
					if(data.posType){
						obj.posType = data.posType; 
					}
				}
				this._listAddH = 75*(linkInfo.length-1);
				this.listGain.data = linkInfo; 
				this.listGain.list.resizeToFit();
			}else{
				this.listGain.data = [];
			}
		}
	}
	public get listAddH():number{
		return this._listAddH;
	}
    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:ListRenderer = <ListRenderer>e.itemObject;
        if(item){
            
        }

        var list: any = e.target;
        switch (list) {
            case this.listGain.list:
                break;

        }
               
    }


}