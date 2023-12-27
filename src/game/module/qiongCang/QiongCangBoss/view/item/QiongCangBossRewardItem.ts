class QiongCangBossRewardItem extends ListRenderer{
	private controller:fairygui.Controller;
	private baseItem:BaseItem;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.controller = this.getController("c1");
		this.baseItem = this.getChild("baseItem") as BaseItem;
		//this.baseItem.isShowCareerIco = false;
	}

	public setData(data:any,index:number):void {
		this._data = data;
		this.baseItem.setData(data);
		if(index <= 1) {
			this.controller.selectedIndex = 0;
		}
		else {
			this.controller.selectedIndex = 1;
		}
	}
}