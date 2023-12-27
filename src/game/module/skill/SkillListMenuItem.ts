/**
 * 技能面板技能底部技能栏列表项
 */
class SkillListMenuItem extends ListRenderer {
	private iconLoader: GLoader;
	private _skillData: SkillData;
	private _isOpen:boolean;
	private _isLock:boolean;

	public constructor() {
		super();
	}

	public setData(data: any): void {
		this._skillData = <SkillData>data;
		this.iconLoader = this.getChild("loader_skillDress") as GLoader;
		this.iconLoader.load(this.skillData.getIconRes());
		this.isOpen = CacheManager.skill.isLearnedSkill(this.skillData.skillId);
	}

	public get skillData():SkillData{
		return this._skillData;
	}

	public set isLock(isLock: boolean) {
		if(!this.isOpen){//未开放的不能设置
			return;
		}
		this.getController("c1").setSelectedIndex(isLock ? 0 : 1);
		this._isLock = isLock;
		this.touchable = !isLock;
	}

	public get isLock():boolean{
		return this._isLock;
	}

	public set isOpen(isOpen: boolean) {
		this.getController("c1").setSelectedIndex(isOpen ? 1 : 0);
		this._isOpen = isOpen;
		this.isLock = !isOpen;
		this.iconLoader.visible = isOpen;
		this.touchable = isOpen;
	}

	public get isOpen():boolean{
		return this._isOpen;
	}
}