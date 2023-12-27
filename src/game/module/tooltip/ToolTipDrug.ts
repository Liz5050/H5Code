class ToolTipDrug extends ToolTipBase {
	private nameTxt: fairygui.GTextField;
	private useNumTxt: fairygui.GRichTextField;
	private descTxt: fairygui.GRichTextField;
	private usageDescTxt: fairygui.GRichTextField;
	private gainTxt: fairygui.GTextField;
	private openLevelTxt: fairygui.GRichTextField;

	private baseItem: BaseItem;
	private itemData: ItemData;

	private toolTipSource: ToolTipSouceEnum = ToolTipSouceEnum.None;

	public constructor() {
		super(PackNameEnum.Common, "ToolTipDrug");
	}

	public initUI(): void {
		super.initUI();
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.useNumTxt = this.getChild("txt_useNum").asRichTextField;
		this.descTxt = this.getChild("txt_desc").asRichTextField;
		this.usageDescTxt = this.getChild("txt_usageDesc").asRichTextField;
		this.gainTxt = this.getChild("txt_gain").asTextField;
		this.openLevelTxt = this.getChild("txt_openLevel").asRichTextField;
		this.baseItem = <BaseItem>this.getChild("loader_item");
		this.baseItem.isShowName = false;
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		this.toolTipSource = toolTipData.source;
		if (toolTipData) {
			this.itemData = <ItemData>toolTipData.data;
			if (ItemsUtil.isTrueItemData(this.itemData)) {
				this.nameTxt.text = this.itemData.getName(true);
				this.descTxt.text = this.itemData.getDesc();
				this.descTxt["renderNow"]();
				this.usageDescTxt.text = this.itemData.getItemInfo().usageDesc;
				this.gainTxt.text = this.itemData.getItemInfo().gainDesc;

			}
			this.baseItem.itemData = this.itemData;
			this.enableOptList(toolTipData.isEnableOptList);

			if(toolTipData.extData){
				let num: number = toolTipData.extData["useNum"];
				let maxNum: number = toolTipData.extData["maxNum"];
				let color: string = Color.Color_4;
				if(num >= maxNum){
					color = Color.Color_8;
				}
				this.useNumTxt.text = `<font color = ${color}>${num}/${maxNum}</font>`;

				if(toolTipData.extData.shape){
					let shape: EShape = toolTipData.extData.shape;
					let level: EShape = toolTipData.extData.level;
					this.openLevelTxt.text = `(${GameDef.EShapeName[shape]}达到<font color = "#f2e1c0">${ConfigManager.mgShape.getStageStar(shape, level)}</font>增加使用上限)`;
				}else{
					this.openLevelTxt.text = "";
				}
			}
		}
	}

}