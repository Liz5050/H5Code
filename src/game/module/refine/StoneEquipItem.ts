class StoneEquipItem extends ListRenderer{
	private numTxt: fairygui.GTextField;
	private equipItem: BaseItem;
	private colorController: fairygui.Controller;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.equipItem = <BaseItem> this.getChild("baseItem");
		this.numTxt = this.getChild("txt_num").asTextField;
		this.colorController = this.getController("c1");
		// this.equipItem.touchable = false;
		this.equipItem.enableToolTip = false;
		// this.equipItem.addEventListener(fairygui.StateChangeEvent.CHANGED, this.click, this);
		// this.addClickListener(this.click, this);
		// this.addStateListener(this.click, this);
		
	}

	public setData(data: any):void{
		let itemData: ItemData = data["itemData"];
		this._data = data;
		let hole: Array<any> = itemData.getItemExtInfo().hole ? itemData.getItemExtInfo().hole : [];
		let inlayNum: number = 0;
		this.equipItem.itemData = itemData;
		if(hole.length > 0){
			for(let code of hole){
				if(code){
					inlayNum ++;
				}
			}
		}
		this.numTxt.text = `${inlayNum}/${itemData.getItemInfo().jewelNumMax + (CacheManager.vip.vipLevel > 4 ? 1 : 0)}`;
		this.colorController.selectedIndex = itemData.getStoneColor() == EProp.EPropJewelAdvance ? 0 : 1;

		CommonUtils.setBtnTips(this, data["isBtnTip"]);
	}

	public get data(): ItemData{
		return this._data;
	}

	public setSelected(value: boolean): void{
		this.equipItem.selected = value;
	}
}