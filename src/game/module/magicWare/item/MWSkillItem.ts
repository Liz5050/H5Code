/**
 * 翅膀技能
 */
class MWSkillItem extends BaseSkillItem {
	private openTxt: fairygui.GRichTextField;
	private c1: fairygui.Controller;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.openTxt = this.getChild("txt_open").asRichTextField;
		this.c1 = this.getController("c1");
	}

	public setData(data: any) {
		let skillData: SkillData = data["skillData"];
		super.setData(skillData);
		this.openTxt.text = data["openDesc"];
		this.enabled = data["enabled"];
		this.openTxt.visible = !this.enabled;
		this.c1.selectedIndex = this.enabled?1:0;
	}
}