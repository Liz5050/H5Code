class BossComingRewardItem extends ListRenderer {
	private baseItem:BaseItem;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.baseItem = this.getChild("baseItem") as BaseItem;
		//this.baseItem.isShowCareerIco = false;
	}

	public setData(data:any):void {
		this._data = data;
		this.baseItem.setData(data);
	}
}