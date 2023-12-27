class BossRewardItem extends ListRenderer{
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

	public setData(data:any):void {
		this._data = data;
		this.baseItem.setData(data.itemData);
		if (data.none == 1) {
            this.controller.selectedIndex = 3;
		}
		else if(data.rate == 0 || (data.rate == 1 && data.isQiongcang)) {
			this.controller.selectedIndex = 0;	
		}
		else {
			this.controller.selectedIndex = data.isOwner ? 1 : 2;
		}
	}
}