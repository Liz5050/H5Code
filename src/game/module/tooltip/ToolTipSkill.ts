/**
 * 技能Tip
 */
class ToolTipSkill extends ToolTipBase {
	private nameTxt: fairygui.GTextField;
	private typeTxt: fairygui.GTextField;
	private descTxt: fairygui.GRichTextField;
	private openTxt: fairygui.GRichTextField;
	private iconLoader: GLoader;
	private skillData: SkillData;
	private extData: any;
	private isActive: boolean;
	private shape: EShape;
	private openSkill: number;

	public constructor() {
		super(PackNameEnum.Common, "ToolTipSkill");
	}

	public initUI(): void {
		super.initUI();
		this.nameTxt = this.getGObject("txt_name").asTextField;
		this.typeTxt = this.getGObject("txt_type").asTextField;
		this.descTxt = this.getGObject("txt_desc").asRichTextField;
		this.openTxt = this.getGObject("txt_open").asRichTextField;
		this.iconLoader = this.getGObject("loader_icon") as GLoader;
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		if (toolTipData) {
			this.skillData = <SkillData>toolTipData.data;
			this.nameTxt.text = this.skillData.skill.skillName;
			this.typeTxt.text = GameDef.ESkillUseTypeName[this.skillData.useType];
			this.descTxt.text = this.skillData.skill.skillDescription;
			this.iconLoader.load(URLManager.getIconUrl(this.skillData.skillIcon, URLManager.SKIL_ICON));

			//处理开放条件显示
			this.extData = toolTipData.extData;
			if (this.extData != null) {
				this.isActive = <boolean>toolTipData.extData["active"];
				this.shape = <EShape>toolTipData.extData["shape"];
				this.openSkill = <number>toolTipData.extData["openSkill"];
				if (!this.isActive) {
					//未激活
					if(this.openSkill > 0){
						let data: Array<any> = ConfigManager.mgShapeChangeEx.select({"openSkill": this.openSkill});
						let level: number = data[0].level;
						this.openTxt.text = `${level}阶自动激活`;
					}
					else{
						let openLevel: number = ConfigManager.mgShapeOpen.getOpenLevel(this.shape, this.skillData.skillId);
						let shapeName: string = GameDef.EShapeName[this.shape];
						if (this.shape == EShape.EShapePet || this.shape == EShape.EShapeMount) {
							let stageStar: string = ConfigManager.mgShape.getStageStar(this.shape, openLevel);
							this.openTxt.text = `${stageStar}自动激活`;
						} else {
							this.openTxt.text = `${shapeName}等级${openLevel}时激活`;
						}
					}
				} else {
					this.openTxt.text = "";
				}
			}else{
				this.openTxt.text = "";
			}

		} else {
			this.nameTxt.text = "";
			this.descTxt.text = "";
			this.openTxt.text = "";
			this.iconLoader.clear();
		}
	}
}