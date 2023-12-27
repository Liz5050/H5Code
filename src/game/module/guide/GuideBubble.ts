/**
 * 气泡指引
 */
class GuideBubble extends fairygui.GComponent {
	private bubble: fairygui.GComponent;
	private descTxt: fairygui.GRichTextField;
	private _desc: string;

	public constructor() {
		super();
		this.bubble = fairygui.UIPackage.createObject(PackNameEnum.Guide, "GuideBubble").asCom;
		this.descTxt = this.bubble.getChild("txt_desc").asRichTextField;
		this.addChild(this.bubble);
	}

	public set desc(desc: string) {
		this._desc = desc;
		this.descTxt.text = desc;
	}

	public get desc(): string {
		return this._desc;
	}
}