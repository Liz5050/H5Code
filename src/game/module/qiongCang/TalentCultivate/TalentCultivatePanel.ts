class TalentCultivatePanel extends fairygui.GComponent {
	private nameLoader: GLoader;
	private talentExpBall: TalentExpBall;
	private expRedPointImg: fairygui.GImage;
	private expTxt: fairygui.GTextField;
	private skillPointTxt: fairygui.GRichTextField;
	private luckyTxt: fairygui.GRichTextField;
	private luckyBar: UIProgressBar;//祝福值
	private fightPanel: FightPanel;
	private attrDetailBtn: fairygui.GButton;
	private skillResetBtn: fairygui.GButton;
	private equipList: List;

	private career: number;
	private roleIndex: number;
	private equipNum: number = 5;
	private pos: number;
	private isMax: boolean;
	private isCanUpgrade: boolean;
	private skillPanel: TalentSkillPanel;

	public constructor() {
		super();
	}


	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.nameLoader = this.getChild("loader_name") as GLoader;
		this.talentExpBall = this.getChild("talentExpBall") as TalentExpBall;
		this.expRedPointImg = this.getChild("img_expRedPoint").asImage;
		this.expTxt = this.getChild("txt_exp").asTextField;
		this.skillPointTxt = this.getChild("txt_skillPoint").asRichTextField;
		this.luckyTxt = this.getChild("txt_lucky").asRichTextField;
		this.luckyBar = <UIProgressBar>this.getChild("progressBar_lucky");
		this.luckyBar.setStyle(URLManager.getPackResUrl(PackNameEnum.TalentCultivate, "exp_bar"), null, 641, 24, 0, 0, UIProgressBarType.Mask);
		this.luckyBar.showEffect(URLManager.getPackResUrl(PackNameEnum.TalentCultivate, "exp_effect"), 67, 0.5);
		this.luckyBar.labelType = BarLabelType.None;
		// this.luckyBar.labelSize = 20;
		this.fightPanel = <FightPanel>this.getChild("fight_panel");
		this.attrDetailBtn = this.getChild("btn_attrDetail").asButton;
		this.skillResetBtn = this.getChild("btn_skillReset").asButton;
		this.equipList = new List(this.getChild("list_equip").asList);
		this.attrDetailBtn.addClickListener(this.clickDetailBtn, this);
		this.skillResetBtn.addClickListener(this.clickResetBtn, this);
		this.talentExpBall.addClickListener(this.clickTalentBall, this);

		this.skillPanel = new TalentSkillPanel(this.getChild("skillPanel1").asCom, this.getChild("skillPanel2").asCom, this.getChild("skillPanel4").asCom)
	}

	public updateAll(data: any): void {
		this.career = data.career;
		this.roleIndex = CacheManager.role.getRoleIndex(this.career);
		this.nameLoader.load(URLManager.getModuleImgUrl("TalentCultivate/name_cultivate_" + this.career + ".png", PackNameEnum.QiongCang));
		this.updateExp();
		this.updateEquips();
		this.updateSkillPoint();
		this.skillPanel.updateByCareer(this.career);
	}

	private clickDetailBtn(): void {
		EventManager.dispatch(LocalEventEnum.TalentAttrDetailViewOpen, this.roleIndex);
	}

	private clickResetBtn(): void {
		EventManager.dispatch(LocalEventEnum.TalentSkillResetViewOpen, this.roleIndex);
	}

	private clickTalentBall(): void {
		if (this.isMax) {
			Tip.showTip("天赋等级已满");
		} else if (this.isCanUpgrade) {
			ProxyManager.cultivate.talentUpgrade(ECultivateType.ECultivateTypeTalent, this.pos, this.roleIndex);
		} else {
			Tip.showTip("天赋经验不足");
		}
	}

	public updateEquips(): void {
		let equips: any = CacheManager.talentCultivate.getEquips(this.roleIndex);
		let talentEquipData: Array<any> = [];
		let openLevel: number;
		for (let i = 1; i <= this.equipNum; i++) {
			openLevel = CacheManager.talentCultivate.getEquipPosOpenLevel(this.roleIndex, i);
			if (equips[i]) {
				talentEquipData.push({ "roleIndex": this.roleIndex, "pos": i, "openLevel": openLevel, "code": equips[i] });
			} else {
				talentEquipData.push({ "roleIndex": this.roleIndex, "pos": i, "openLevel": openLevel });
			}
		}
		this.equipList.data = talentEquipData;

		this.fightPanel.updateValue(CacheManager.talentCultivate.getTalentWarfare(this.roleIndex));
	}

	public updateExp(): void {
		this.pos = CacheManager.talentCultivate.getTalentPos(this.roleIndex);
		let level: number = CacheManager.talentCultivate.getTalentLevel(this.roleIndex);
		let lucky: number = CacheManager.talentCultivate.getTalentLucky(this.roleIndex);
		let cultivateCfg: any = ConfigManager.cultivate.getCfgByLevelAndType(ECultivateType.ECultivateTypeTalent, this.pos, level);
		let nextCultivateCfg: any = ConfigManager.cultivate.getCfgByLevelAndType(ECultivateType.ECultivateTypeTalent, this.pos, level + 1);
		let talentExp: number = CacheManager.role.getMoney(EPriceUnit.EPriceUnitTalentExp);
		let max: number = ConfigManager.cultivate.getMaxLevel(ECultivateType.ECultivateTypeTalent, this.pos);
		this.isMax = max <= level;

		if (!this.isMax) {
			this.isCanUpgrade = talentExp >= cultivateCfg.btnAdd;
			this.talentExpBall.max = nextCultivateCfg.itemNum;
			this.talentExpBall.value = talentExp;
			this.expTxt.text = `${talentExp}\n经验值`;
			this.luckyTxt.text = `<font color = ${Color.Color_6}>Lv.${level}</font>(${lucky}/${nextCultivateCfg.itemNum})`;
			this.luckyBar.setValue(lucky, nextCultivateCfg.itemNum);
		}else {
			this.isCanUpgrade = false;
			this.luckyTxt.text = `<font color = ${Color.Color_6}>Lv.${level}</font>(${cultivateCfg.itemNum}/${cultivateCfg.itemNum})`;
			this.luckyBar.setValue(cultivateCfg.itemNum, cultivateCfg.itemNum);
		}

		this.expRedPointImg.visible = CacheManager.talentCultivate.isCanUpgradeByIndex(this.roleIndex);
	}

	private updateSkillPoint(): void{
		let skillPoint: number = CacheManager.talentCultivate.getSkillPoint(this.roleIndex);
		if(skillPoint > 0){
			this.skillPointTxt.text = `当前可用的技能点：<font color = ${Color.Color_6}>${skillPoint}</font>`;
		}else{
			this.skillPointTxt.text = `天赋等级每提升10级可获得1个技能点`;
		}
	}
}