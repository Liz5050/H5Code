/**
 * 必杀技能详情窗口
 */

class UniqueSkillDetailView extends BasePopupView{
	private descTxt: fairygui.GTextField;
	private skillEffectTxt: fairygui.GRichTextField;
	private hitAddTxt: fairygui.GRichTextField;

	private effectDatas: any;

	public constructor() {
		super(PackNameEnum.UniqueSkill, "UniqueSkillDetailView");
	}

	public initUI(): void{
		this.descTxt = this.getGObject("txt_desc").asTextField;
		this.skillEffectTxt = this.getGObject("txt_skillEffect").asRichTextField;
		this.hitAddTxt = this.getGObject("txt_hitAdd").asRichTextField;
	}

	public show(): void{
		this.modal = true;
		super.show();
		this.center();
		this.updateEffect();
		this.updateHitEffect();
	}

	private updateEffect(): void{
		let skillData: any = ConfigManager.skill.getByPk(SkillCache.SKILLID_XP);
		// let effectDatas: any = {};
		this.effectDatas = {};
		this.descTxt.text = skillData.skillDescription;
		this.skillEffectTxt.text = "";
		// for(let i = 1; i < 4; i++){
		// 	let effectId: number = skillData[`specialEffect${i}`];
		// 	// effectDatas.push(ConfigManager.state.getByPk(effectId));
		// 	this.effectDatas[effectId] = ConfigManager.state.getByPk(effectId);
		// }
		// for(let key in this.effectDatas){
		// 	this.skillEffectTxt.text += `${this.effectDatas[key].name}${this.effectDatas[key].stateEffect2/10}%\n`;
		// }
		this.skillEffectTxt.text = "对玩家造成伤害480%\n对怪物造成伤害1050%";
	}

	private updateHitEffect(): void{
		let levelMaxNum: any = CacheManager.uniqueSkill.getLevelMaxNum();
		this.hitAddTxt.text = "";
		for(let num in levelMaxNum){
			if(levelMaxNum[num]){
				let suitData: any = ConfigManager.cultivateSuit.getByPk(`${ECultivateType.ECultivateTypeKill},0,${levelMaxNum[num]},${num}`);//养成类型，等级，数量
				// let effectArr: Array<string> = suitData.effectStr.split("#");
				// let stateArr: Array<string> = (effectArr[0].split(","));
				// let stateId: number = Number(stateArr[0]);
				// let stateData: any = ConfigManager.state.getByPk(stateId);
				// if(this.effectDatas[stateData.set]){
				// 	// this.hitAddTxt.text += `${this.effectDatas[stateData.set].name}${this.effectDatas[stateData.set].stateEffect2/100}%\n`;
				// 	this.hitAddTxt.text += `${stateData.name}+${(stateData.stateEffect2 - this.effectDatas[stateData.set].stateEffect2)/10}%\n`;
				// }
				this.hitAddTxt.text += `${suitData.effectAddDesc}\n`;
			}
		}
		if(this.hitAddTxt.text == ""){
			this.hitAddTxt.text = "无";
		}
	}
}