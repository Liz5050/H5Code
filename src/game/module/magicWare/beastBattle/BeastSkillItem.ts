class BeastSkillItem extends ListRenderer {

	private iconLoader: GLoader;

	private skillId: number;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.iconLoader = this.getChild("loader_icon") as GLoader;
		this.addClickListener(this.click, this);
	}

	public setData(skillId: number): void {
		this._data = skillId;
		this.skillId = skillId;
		let skillData: any = ConfigManager.skill.getByPk(this.skillId);
		if(skillData) {
			this.iconLoader.load(URLManager.getIconUrl(skillData.skillIcon, URLManager.SKIL_ICON));
		}
	}

	private click(): void {
		EventManager.dispatch(LocalEventEnum.BeastShowSkillTips, this._data);
	}
}