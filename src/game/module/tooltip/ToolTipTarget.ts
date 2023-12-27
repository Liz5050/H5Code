/**
 * 目标Tip
 */
class ToolTipTarget extends ToolTipBase{
	private titleTxt:fairygui.GRichTextField;
	private contentTxt:fairygui.GRichTextField;

	public constructor() {
		super(PackNameEnum.Common, "ToolTipTarget");
	}

	public initUI(): void {
		super.initUI();
		this.titleTxt = this.getGObject("title").asRichTextField;
		this.contentTxt = this.getGObject("txt_content").asRichTextField;
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		if (toolTipData) {
			let data:any = toolTipData.data;
			this.titleTxt.text = data.title;
			this.contentTxt.text = data.content;
		}else{
			this.titleTxt.text = "";
			this.contentTxt.text = "";
		}
	}
}