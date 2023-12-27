class ShapeSkillItem extends ListRenderer {

	private iconLoader: GLoader;
	private controller: fairygui.Controller;

	private skillId: number;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.iconLoader = this.getChild("loader_icon") as GLoader;
		this.controller = this.getController("c1");
		this.addClickListener(this.click, this);
	}

	public setData(data: any): void {
		this.skillId = data.skillId;
		this._data = data;
		let skillData: any = ConfigManager.skill.getByPk(this.skillId);
		if(skillData) {
			this.iconLoader.load(this.getIconRes(skillData.skillIcon));
		}
		this.controller.selectedIndex = data.isOpen ? 1 : 0;
		this.iconLoader.grayed = !data.isOpen;

		let tip: boolean = false;
		if (data.isTalent && data.isChange) {
			switch (data.shape) {
				case EShape.EShapePet:
					tip = CacheManager.petChange.isCanUpgradeTSkill(data.change);//宠物幻形的天赋技能红点
					break;
				case EShape.EShapeSpirit:
					tip = CacheManager.magicWeaponChange.isCanUpgradeTSkill(data.change);//法宝幻形的天赋技能红点
					break;
				case EShape.EShapeBattle:
					tip = CacheManager.battleArrayChange.isCanUpgradeTSkill(data.change, data.roleIndex);
					break;
				case EShape.EShapeLaw:
					tip = CacheManager.magicArrayChange.isCanUpgradeTSkill(data.change, data.roleIndex);
					break;
				case EShape.EShapeSwordPool:
					tip = CacheManager.swordPoolChange.isCanUpgradeTSkill(data.change, data.roleIndex);
					break;
				case EShape.EShapeMount:
					tip = CacheManager.mountChange.isCanUpgradeTSkill(data.change, data.roleIndex);
					break;
			}
		}
		CommonUtils.setBtnTips(this, tip);
	}

	private click(): void {
		EventManager.dispatch(UIEventEnum.ShapeSkillTipViewOpen, this._data);
	}

	public getIconRes(skillIcon: number): string {
		if (skillIcon) {
			return URLManager.getIconUrl(skillIcon, URLManager.SKIL_ICON);
		}
		return "";
	}
}