class TalentSkillResetView extends BasePopupView{
	private nameTxt: fairygui.GRichTextField;
	private skillPointTxt: fairygui.GTextField;
	private goldTxt: fairygui.GTextField;
	private resetBtn: fairygui.GButton;
	private roleIndex: number;

	public constructor() {
		super(PackNameEnum.TalentCultivate, "TalentSkillResetView");
	}

	public initUI(): void{
		this.nameTxt = this.getGObject("txt_name").asRichTextField;
		this.skillPointTxt = this.getGObject("txt_skillPoint").asTextField;
		this.goldTxt = this.getGObject("txt_gold").asTextField;
		this.resetBtn = this.getGObject("btn_reset").asButton;
		this.resetBtn.addClickListener(this.clickReset, this);
	}

	public show(roleIndex: number): void{
		this.roleIndex = roleIndex;
		this.modal = true;
		super.show();
		this.updateAll();
	}

	public updateAll(): void{
		let career: number = CacheManager.role.getRoleCareerByIndex(this.roleIndex, true);
		let talentCfg: any = ConfigManager.talent.getByPk(career);
		let usedSkillPoint: number = CacheManager.talentCultivate.getUsedSkillPoint(this.roleIndex);
		this.nameTxt.text = `是否消耗元宝重置<font size = "30" color = ${Color.Color_5}> ${talentCfg.head} </font>的技能点`;
		this.skillPointTxt.text = `重置后可返还${usedSkillPoint}技能点`;
		this.goldTxt.text = `${talentCfg.costNum}`;
		App.DisplayUtils.grayButton(this.resetBtn, usedSkillPoint == 0, usedSkillPoint == 0);
	}

	private clickReset(): void{
		ProxyManager.cultivate.talentSkillReset(this.roleIndex);
		this.hide();
	}
}