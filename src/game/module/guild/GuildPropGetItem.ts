class GuildPropGetItem extends ListRenderer {
	private bossTxt: fairygui.GTextField;
	private mapTxt: fairygui.GTextField;
	private timeTxt: fairygui.GTextField;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.bossTxt = this.getChild("txt_boss").asTextField;
		this.mapTxt = this.getChild("txt_map").asTextField;
		this.timeTxt = this.getChild("txt_time").asTextField;
		this.getChild("btn_go").addClickListener(this.go, this);
	}

	public setData(data: any, index: number = -1): void {
	}

	/**前往 */
	private go(): void {

	}
}