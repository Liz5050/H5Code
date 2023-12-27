class ChangePropSkillItem extends ListRenderer {

	private iconLoader: GLoader;
	private nameTxt: fairygui.GTextField;
	private descTxt: fairygui.GRichTextField;

	private skillId: number;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.iconLoader = this.getChild("loader_icon") as GLoader;
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.descTxt = this.getChild("txt_desc").asRichTextField;
	}

	public setData(data: any): void{
		this.skillId = data.skillId;
		this._data = data;
		let skillCfg: any = ConfigManager.skill.getByPk(this.skillId);
		this.iconLoader.load(URLManager.getIconUrl(skillCfg.skillIcon, URLManager.SKIL_ICON));
		this.nameTxt.text = `${data.openLevelStr}习得技能【${skillCfg.skillName}】`;
		this.descTxt.text = HtmlUtil.br(skillCfg.skillDescription);
	}
}