/**
 * 天赋技能Tip
 */
class TalentSkillTip extends BasePopupView {
	private controller: fairygui.Controller;
	private iconLoader: GLoader;
	private nameTxt: fairygui.GTextField;
	private levelTxt: fairygui.GTextField;
	private unLockDescTxt: fairygui.GRichTextField;
	private unLockCondTxt: fairygui.GTextField;
	private curDescTxt: fairygui.GRichTextField;
	private nextDescTxt: fairygui.GRichTextField;
	private upgradeBtn: fairygui.GButton;

	private skillId: number;
	private career: number;
	private isCanUpgrade: boolean;
	private roleIndex: number;

	public constructor() {
		super(PackNameEnum.TalentCultivate, "TalentSkillTip");
		this.isDestroyOnHide = true;
	}

	public initUI(): void {
		this.controller = this.getController("c1");
		this.iconLoader = this.getChild("loader_icon") as GLoader;
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.levelTxt = this.getChild("txt_level").asTextField;
		this.unLockDescTxt = this.getChild("txt_unLockDesc").asRichTextField;
		this.unLockCondTxt = this.getChild("txt_unLockCond").asTextField;
		this.curDescTxt = this.getChild("txt_curDesc").asRichTextField;
		this.nextDescTxt = this.getChild("txt_nextDesc").asRichTextField;
		this.upgradeBtn = this.getChild("btn_upgrade").asButton;
		this.upgradeBtn.addClickListener(this.clickUpgradeBtn, this);
	}

	public show(data: any) {
		this.modal = true;
		super.show();
		if (data) {
			this.skillId = data.id;
			this.career = data.career;
			this.updateTips();
		}
	}

	public updateTips(): void{
		let skillData: any = CacheManager.talentCultivate.getSkillData(this.skillId, this.career);
		let isOpen: boolean = skillData.isOpen;
		let level: number = skillData.level;
		let limitLevel: number = skillData.limitLevel;
		let talentSkillCfg: any = ConfigManager.cultivateEffectType.getByPk(`${this.skillId}`);
		this.roleIndex = CacheManager.role.getRoleIndex(skillData.career);
		this.iconLoader.load(URLManager.getIconUrl(talentSkillCfg.icon, URLManager.SKIL_ICON));
		this.nameTxt.text = talentSkillCfg.name;
		this.isCanUpgrade = false;
		if(isOpen){
			if(skillData.learnedLevel == 0){
				this.curDescTxt.text = HtmlUtil.br(talentSkillCfg.desc);
			}else{
				let curCfg: any = ConfigManager.cultivateEffect.getByPk(`${this.skillId},${level}`);
				this.curDescTxt.text = HtmlUtil.br(curCfg.desc);
			}
			let nextCfg: any = ConfigManager.cultivateEffect.getByPk(`${this.skillId},${level+1}`);
			this.nextDescTxt.text = HtmlUtil.br(nextCfg.desc);
			this.levelTxt.text = `${level}/${limitLevel}`;

			if(level == limitLevel){//已满级
				this.controller.selectedIndex = 2;
			}else{
				this.controller.selectedIndex = 1;
				this.isCanUpgrade = CacheManager.talentCultivate.getSkillPoint(this.roleIndex) > 0;
			}
		}else{
			let preSkillDict: any = ConfigManager.cultivateEffectType.getPreConditions(this.skillId);
			this.unLockDescTxt.text = talentSkillCfg.desc;
			this.unLockCondTxt.text = "";
			for(let key in preSkillDict){
				let unLockCfg: any = ConfigManager.cultivateEffectType.getByPk(key);
				this.unLockCondTxt.text += `${unLockCfg.name}到达${preSkillDict[key]}级解锁\n`;
			}
			if(talentSkillCfg.effect == 1){
				this.unLockCondTxt.text = "所有技能满级后解锁";
			}
			if(skillData.limitLevel){
				this.levelTxt.text = skillData.level + "/" + skillData.limitLevel;
			}else{
				this.levelTxt.text = `0/0`;
			}
			this.controller.selectedIndex = 0;
		}
		App.DisplayUtils.grayButton(this.upgradeBtn, !this.isCanUpgrade, !this.isCanUpgrade);
	}

	private clickUpgradeBtn(): void{
		ProxyManager.cultivate.talentSkillUpgrade(this.roleIndex, this.skillId);
	}
}