class GodEquipItem extends ListRenderer {
	private baseItem: BaseItem;
	private nameTxt: fairygui.GTextField;

	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
		this.baseItem = <BaseItem>this.getChild("baseItem");
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.baseItem.touchable = false;
		this.baseItem.isShowCareerIco = false;
	}

	public setData(itemData: ItemData):void{
		this._data = itemData;
		if(itemData){
			this.baseItem.itemData = itemData;
			this.nameTxt.text = itemData.getName(true);
			this.baseItem.txtName.y = 118;
			this.baseItem.txtName.color = 0xf2e1c0;
			// this.baseItem.txtName.stroke = 1;
			// this.baseItem.txtName.strokeColor = 0x170a07;
			// this.baseItem.txtName.fontSize = 24;
		}else{
			this.baseItem.itemData = null;
			this.nameTxt.text = "";
		}
	}

	public isCanEquip(): boolean{
		return WeaponUtil.isCanEquipByItemData(this._data);
	}
}