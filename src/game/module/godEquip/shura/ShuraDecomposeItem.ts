/**
 * 修罗装备分解项
 */
class ShuraDecomposeItem extends ListRenderer {
	private equipItem: BaseItem;
	private equipNameTxt: fairygui.GTextField;
	private fragmentCostTxt: fairygui.GTextField;
	private decomposeBtn: fairygui.GButton;
	private godEquipCostData: any;

	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
		this.equipItem = <BaseItem>this.getChild("baseIitem");
		this.equipNameTxt = this.getChild("txt_equipName").asTextField;
		this.fragmentCostTxt = this.getChild("txt_get").asTextField;
		this.decomposeBtn = this.getChild("btn_decompose").asButton;
		this.decomposeBtn.addClickListener(this.clickDecompose, this);
		this.equipItem.touchable = false;
		this.equipItem.isShowCareerIco = false;
	}

	public setData(itemData: ItemData):void{
		this._data = itemData;
		this.godEquipCostData = ConfigManager.equipUpgrade.getByPk(`${itemData.getCategory()},${EEquipType.EEquipTypeJiuli},${itemData.getType()},${itemData.getNewItemLevel()}`);
		this.equipItem.itemData = itemData;
		// this.equipItem.txtName.text = itemData.getName(true);
		this.equipItem.txtName.color = Color.ItemColorHex[itemData.getColor()];
		this.equipNameTxt.color = Color.ItemColorHex[itemData.getColor()];
		this.equipNameTxt.text = itemData.getName();
		if(this.godEquipCostData){
			this.fragmentCostTxt.text = `修罗碎片×${this.godEquipCostData.costNum}`;
			this.decomposeBtn.touchable = true;
		}else{
			this.fragmentCostTxt.text = `修罗碎片×0`;
			this.decomposeBtn.touchable = false;
		}
	}

	private clickDecompose(): void{
		// let uids: Array<string> = [];
		if(this.godEquipCostData){
			// this.decomposeBtn.touchable = false;
			// uids.push(this._data.getUid());
			// ProxyManager.godEquip.decomposeGodEquip(uids);
			this.decomposeBtn.touchable = false;
			ProxyManager.cultivate.decomposeItem(this._data.getUid(), 1, EPlayerItemPosType.EPlayerItemPosTypeBag);
		}
	}
}