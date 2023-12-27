class BeastEquipItem extends ListRenderer {
	private requireTxt: fairygui.GRichTextField;
	private baseItem: BaseItem;
	private controller: fairygui.Controller;

	private ColorName: string[] = ["", "白", "", "紫", "橙", "红", "金"];
	private ColorExName: string[] = ["", "神", "圣"];

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.requireTxt = this.getChild("txt_require").asRichTextField;
		this.baseItem = <BaseItem>this.getChild("baseItem");
		this.controller = this.getController("c1");
		this.baseItem.isShowName = false;
		this.baseItem.touchable = false;
	}

	public setData(data: any): void {
		this._data = data;
		if(data.itemCode_I){
			this.controller.selectedIndex = 1;
			this.baseItem.itemData = new ItemData(data);
			this.requireTxt.text = "";
		}else{
			this.controller.selectedIndex = 0;
			let name: string = `${this.ColorExName[this.colorEx]}${this.ColorName[data.holeData.color]}${data.holeData.star}星${GameDef.EBeastEquipType[data.holeData.type]}`
			this.requireTxt.text = `<font color = ${Color.ItemColor[data.holeData.color]}>${name}</font>`;
		}
		let isTips: boolean = CacheManager.beastBattle.checkEquipDressByHole(data.holeData.code, data.id_BY, data);
		if(!isTips){
			isTips = CacheManager.beastBattle.checkEquipStrengthByHole(data.holeData.code, data);
		}
		CommonUtils.setBtnTips(this, isTips);
	}

	private get colorEx(): number{
		if(this._data && this._data.holeData.colorEx){
			return this._data.holeData.colorEx;
		}
		return 0;
	}

	public get itemData(): ItemData{
		return this.baseItem.itemData;
	}

	public get beastCode(): number{
		if(this._data){
			return this._data.holeData.code;
		}
		return -1;
	}

}