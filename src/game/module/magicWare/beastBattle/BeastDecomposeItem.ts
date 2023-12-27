class BeastDecomposeItem extends fairygui.GButton{
	private baseItem: BaseItem;
	private _data: ItemData;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.baseItem = <BaseItem>this.getChild("baseItem");
		this.addClickListener(this.click, this);
		this.baseItem.touchable = false;
	}

	public setData(itemData: ItemData, index: number):void{
		this._data = itemData;
		if(itemData){
			this.baseItem.setData(itemData);
			this.baseItem.numTxt.visible = false;
		}
		this.selected = CacheManager.beastBattle.decomIndexSel[index];
	}

	private click():void{

	}

	public get itemData(): ItemData{
		return this._data;
	}
}