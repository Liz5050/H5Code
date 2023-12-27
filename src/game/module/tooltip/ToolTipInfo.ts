/**
 * 基本信息提示Tip
 */
class ToolTipInfo extends ToolTipBase{
	private infoTxt:fairygui.GRichTextField;

	public constructor() {
		super(PackNameEnum.Common, "ToolTipInfo");
	}

	public initUI(): void {
		super.initUI();
		this.infoTxt = this.getGObject("title").asRichTextField;
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		if (toolTipData) {
			this.infoTxt.text = toolTipData.data;
		}else{
			this.infoTxt.text = "";
		}
	}
}