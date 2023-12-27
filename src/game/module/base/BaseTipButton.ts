class BaseTipButton extends fairygui.GButton {
	protected cTip: fairygui.Controller;
	public constructor() {
		super();
	}
	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.cTip = this.getController("c_tip");
	}
	public set tip(isTip: boolean) {
		this.cTip.setSelectedIndex(isTip ? 1 : 0);
	}
}