/**
 * 技能项，点击弹出Tip
 */
class BaseSkillItem extends ListRenderer {
	public iconLoader: GLoader;
	/**
	 * 是否启用Tip
	 */
	public enableToolTip: boolean = true;
	private _skillData: SkillData;
	private toolTipData: ToolTipData;
	/**激活 */
	private _enabled: boolean;
	/**扩展数据 */
	private _extData: any;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.iconLoader = this.getChild("loader_icon") as GLoader;
		this.iconLoader.clear();
		this.addClickListener(this.click, this);
	}

	public setData(data: any): void {
		this._data = data;
		this.skillData = data;
	}

	public set skillData(skillData: SkillData) {
		this._skillData = skillData;
		if (skillData) {
			this.iconLoader.load(skillData.getIconRes());
			this.enabled = true;
		} else {
			this.iconLoader.clear();
			this.enabled = false;
		}
	}

	public get skillData(): SkillData {
		return this._skillData;
	}

	public set enabled(enabled: boolean) {
		this._enabled = enabled;
		this.iconLoader.grayed = !enabled;
	}

	public get enabled(): boolean {
		return this._enabled;
	}

	public set extData(extData: any) {
		this._extData = extData;
	}

	public get extData(): any {
		return this._extData;
	}

	/**点击弹出tooltip */
	protected click(): void {
		if (!this.enableToolTip) {
			return;
		}
		if (this.skillData) {
			if (!this.toolTipData) {
				this.toolTipData = new ToolTipData();
			}
			this.toolTipData.data = this.skillData;
			this.toolTipData.extData = this.extData;
			this.toolTipData.type = ToolTipTypeEnum.Skill;
			ToolTipManager.show(this.toolTipData);
		}
		this.selected = false;
	}
}