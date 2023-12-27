/**
 * 功能预告
 */
class FunctionForecast extends fairygui.GComponent {
	private iconBtn: IconButton;
	private tipTxt: fairygui.GRichTextField;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		this.iconBtn = <IconButton>this.getChild("btn_icon_1");
		this.tipTxt = this.getChild("txt_notice_tips").asRichTextField;
		this.iconBtn.addClickListener(this.clickIcon, this);
	}

	private clickIcon(): void {
		Tip.showTip("功能未开放");
	}
}