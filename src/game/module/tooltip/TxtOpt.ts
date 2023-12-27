/**
 * ToolTip文本操作项
 */
class TxtOpt extends ListRenderer {
	private optTxt: fairygui.GTextField;
	private optType: ToolTipOptEnum;
	private optData: any;

	public constructor() {
		super();
	}

	public setData(data: any): void {
		this._data = data;
		if (data != null) {
			this.optType = data.type;
			this.optData = data.data;
			this.optTxt.text = GameDef.ToolTipOptName[this.optType];
		}
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.optTxt = this.getChild("txt_opt").asTextField;
	}
}