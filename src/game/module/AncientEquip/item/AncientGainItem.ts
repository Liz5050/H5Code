/**
 * 获取道具item
 * @author zhh
 * @time 2018-08-24 16:02:39
 */
class AncientGainItem extends ListRenderer {
    private txtName:fairygui.GTextField;
	private type: string;//跳转类型，GotoEnum
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.txtName = this.getChild("txt_name").asTextField;

        //---- script make end ----
		this.addClickListener(this.click, this);

	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		this.type = this._data.type; //linkType
		if(this.type){	
			this.txtName.text = this._data.name;
		}				
	}

	private click(): void {
		EventManager.dispatch(LocalEventEnum.AncientEquipHideSecondWin);
		EventManager.dispatch(LocalEventEnum.PropGetGotoLink,{type:this.type,posType:this._data.posType});		
		
	}

}