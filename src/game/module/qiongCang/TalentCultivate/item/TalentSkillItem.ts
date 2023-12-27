/**
 * 天赋技能项
 */
class TalentSkillItem extends ListRenderer {
	private c1: fairygui.Controller;
	private c2: fairygui.Controller;
	private iconLoader: GLoader;
	private levelTxt: fairygui.GRichTextField;
	private mc: UIMovieClip;
	/**
	 * 技能数据，从服务器返回的json中解析出来的
	 */
	private _skillData: any;
	/**
	 * 技能配置数据
	 */
	private cfgSkillData: any;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");
		this.iconLoader = <GLoader>this.getChild("loader_icon");
		this.levelTxt = this.getChild("txt_level").asRichTextField;
		this.addClickListener(this.click, this);
	}

	public setData(data: any, index: number = -1): void {
		this.skillData = data;
	}

	public set skillData(skillData: any) {
		this._skillData = skillData;
		if (skillData) {
			this.cfgSkillData = ConfigManager.cultivateEffectType.getByPk(skillData.id);
			if (this.cfgSkillData) {
				this.iconLoader.load(URLManager.getIconUrl(this.cfgSkillData.icon, URLManager.SKIL_ICON));
				this.isBig = this.cfgSkillData.iconFlag == 1;
			}
			if(skillData.limitLevel){
				let color: string = (skillData.learnedLevel < skillData.level || !skillData.isOpen) ? Color.Color_6 : Color.Color_2;
				this.levelTxt.text = `<font color = ${color}>${skillData.level}/${skillData.limitLevel}</font>`;
				this.isShowLevel = true;
			}else{
				this.isShowLevel = false;
			}
			this.iconLoader.grayed = !skillData.isOpen;
			let roleIndex: number = CacheManager.role.getRoleIndex(skillData.career);
			if(CacheManager.talentCultivate.getSkillPoint(roleIndex) > 0 && skillData.level < skillData.limitLevel) {
				this.showBtnMc(true);
			} else {
				this.showBtnMc(false);
			}
		}
	}

	public get skillData(): any {
		return this._skillData;
	}

	/**
	 * 是否为大图标
	 */
	public set isBig(isBig: boolean) {
		this.c1.selectedIndex = isBig ? 1 : 0;
	}

	public get isBig(): boolean {
		return this.c1.selectedIndex == 1;
	}

	/**
	 * 是否显示等级
	 */
	public set isShowLevel(isShow: boolean) {
		this.c2.selectedIndex = isShow ? 1 : 0;
	}

	private click(): void {
		EventManager.dispatch(LocalEventEnum.TalentSkillTipOpen, this.skillData);//先屏蔽功能
		// Tip.showTip("功能尚未开放");
	}

	/**
	 * 显示按钮特效
	 */
	private showBtnMc(isShow: boolean): void {
		if(isShow) {
			if(this.mc == null) {
				this.mc = UIMovieManager.get(PackNameEnum.MCCircle);
			}
			if(this.isBig) {
				this.mc.setPivot(0.5, 0.5);
				this.mc.setScale(0.8, 0.8);
				this.mc.x = -156;
				this.mc.y = -162;
			} else {
				this.mc.setScale(0.65, 0.65);
				this.mc.setPivot(0.5, 0.5);
				this.mc.x = -117;
				this.mc.y = -112;
			}
			this.addChild(this.mc);
		} else {
			if(this.mc != null) {
				this.mc.removeFromParent();
			}
		}
	}
}