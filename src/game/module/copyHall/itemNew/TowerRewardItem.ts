class TowerRewardItem extends ListRenderer {
	private baseItem:BaseItem;
	public constructor() {
		super();
	}
	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
		this.baseItem = <BaseItem>this.getChild("baseItem");

	}
	public setData(data:any,index:number):void{
		this._data = data;
		this.itemIndex = index;
		var itemData:ItemData = data.item;
		var type:number = data.type;	
		this.baseItem.itemData = itemData; 
		if(type){			
			this.baseItem.icoUrl = URLManager.getModuleImgUrl("img_rune_suo.png",PackNameEnum.Copy);
			this.baseItem.colorUrl = URLManager.getItemColorUrl(`color_${EColor.EColorPurple}`);
			this.baseItem.setNameText("新镶孔");
		}

	}
}