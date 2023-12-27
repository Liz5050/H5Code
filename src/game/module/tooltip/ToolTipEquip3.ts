/**官印装备tips */
class ToolTipEquip3 extends ToolTipEquipBase{
	private txtDesc:fairygui.GTextField;
	public constructor() {
		super(PackNameEnum.Common, "ToolTipEquip3");
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);		
		
	}

	public initUI(): void {
		super.initUI();
		this.txtDesc = this.getGObject("txt_desc").asTextField;
	}
	
	protected updateInfo(itemInfo: any):void{
		super.updateInfo(itemInfo);
		let attrDict: any = WeaponUtil.getAttrDict(this.itemData.bestAttrList)
		this.txtDesc.text = this.getFmtAttrDictHtml(attrDict, Color.Color_7, Color.Color_6);
	}
	
}