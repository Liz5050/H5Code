class ToolTipEquip5 extends ToolTipBase {
	private c1:fairygui.Controller;
	private nameTxt: fairygui.GRichTextField;
	private levelTxt: fairygui.GTextField;
	private numTxt: fairygui.GTextField;
	private attrTxt: fairygui.GRichTextField;
	private descTxt: fairygui.GRichTextField;

	private baseItem: BaseItem;
	private itemData: ItemData;
	private petEquipType: number;

	private warehouseScoreCom:WarehouseExchangeCom;

	private bgImg: fairygui.GImage;
	private addY: number = 0;

	private toolTipSource: ToolTipSouceEnum = ToolTipSouceEnum.None;

	public constructor() {
		super(PackNameEnum.Common, "ToolTipEquip5");
	}

	public initUI(): void {
		super.initUI();
		this.c1 = this.getController("c1");
		this.nameTxt = this.getChild("txt_name").asRichTextField;
		this.levelTxt = this.getChild("txt_level").asTextField;
		this.numTxt = this.getChild("txt_num").asTextField;
		this.attrTxt = this.getChild("txt_attr").asRichTextField;
		this.descTxt = this.getChild("txt_desc").asRichTextField;
		this.baseItem = <BaseItem>this.getChild("baseItem");
		this.baseItem.isShowName = false;

		this.bgImg = this.getChild("n0").asImage;

		this.warehouseScoreCom = this.getChild("com_exchange") as WarehouseExchangeCom;
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		this.toolTipSource = toolTipData.source;
		this.c1.selectedIndex = 0;
		if (toolTipData) {
			this.itemData = <ItemData>toolTipData.data;
			if(toolTipData.source == ToolTipSouceEnum.GuildScoreWarehouse) {
				this.c1.selectedIndex = 1;
				this.warehouseScoreCom.setData(this.itemData);
			}
			if (ItemsUtil.isTrueItemData(this.itemData)) {
				this.nameTxt.text = this.itemData.getName(true);
				this.levelTxt.text = `${this.itemData.getLevel()}级`;
				this.numTxt.text = this.itemData.getItemAmount().toString();
				this.descTxt.text = this.itemData.getDesc();

				let attrDict: any =  WeaponUtil.getBaseAttrDict(this.itemData);
				let attrStr: string = WeaponUtil.getAttrAndCareerNameStr(attrDict, this.itemData.getCareer(), true, Color.Color_8, Color.Color_7, "+");
				this.attrTxt.text = attrStr.slice(0, attrStr.length - 1);
			}
			this.baseItem.itemData = this.itemData;
			this.enableOptList(toolTipData.isEnableOptList);
		}
	}
}