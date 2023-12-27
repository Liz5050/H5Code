/**
 * 神装分解的装备项
 */
class GodEquipDecomposeItem extends ListRenderer {
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

	public setData(itemData: ItemData, index: number):void{
		this._data = itemData;
		this.godEquipCostData = ConfigManager.mgGodEquipCost.getByPk(`${itemData.getType()},${itemData.getNewItemLevel()}`);
		this.equipItem.itemData = itemData;
		this.equipItem.txtName.color = Color.ItemColorHex[itemData.getColor()];
		this.equipNameTxt.color = Color.ItemColorHex[itemData.getColor()];
		this.equipNameTxt.text = itemData.getName();
		if(this.godEquipCostData){
			this.fragmentCostTxt.text = `神装碎片×${this.godEquipCostData.cost}`;
			this.decomposeBtn.touchable = true;
		}else{
			this.fragmentCostTxt.text = `神装碎片×0`;
			this.decomposeBtn.touchable = false;
		}
		if(index == 0){
			GuideTargetManager.reg(GuideTargetName.GodEquipDecomposeWindowDecomposeBtn, this.decomposeBtn, true);
		}
	}

	private clickDecompose(): void{
		let uids: Array<string> = [];
		if(this.godEquipCostData){
			this.decomposeBtn.touchable = false;
			uids.push(this._data.getUid());
			ProxyManager.godEquip.decomposeGodEquip(uids);
		}
	}
}