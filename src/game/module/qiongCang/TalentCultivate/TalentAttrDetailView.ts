class TalentAttrDetailView extends BasePopupView{
	private nameTxt: fairygui.GTextField;
	private attrTxt: fairygui.GTextField;
	private roleIndex: number;

	public constructor() {
		super(PackNameEnum.TalentCultivate, "TalentAttrDetailView");
	}

	public initUI(): void{
		this.nameTxt = this.getGObject("txt_name").asTextField;
		this.attrTxt = this.getGObject("txt_attr").asTextField;
	}

	public show(roleIndex: number): void{
		this.roleIndex = roleIndex;
		this.modal = true;
		super.show();
		this.updateAttr();
	}

	private updateAttr(): void{
		let attrDict: any = CacheManager.talentCultivate.getAttrDetailDict(this.roleIndex);
		let career: number = CacheManager.role.getRoleCareerByIndex(this.roleIndex);
		this.nameTxt.text = ConfigManager.talent.getHeadName(CareerUtil.getBaseCareer(career));
		this.attrTxt.text = WeaponUtil.getAttrAndCareerNameStr(attrDict, career, false);
	}
}