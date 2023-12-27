/**
 * 必杀属性详情窗口
 */
class UniqueSkillAttrView extends BasePopupView {
	private attrTxt: fairygui.GRichTextField;
	private effectTxt: fairygui.GRichTextField;
	private controller: fairygui.Controller;

	private suitNum: Array<number> = [3, 5, 8];
	private effectDatas: any;

	public constructor() {
		super(PackNameEnum.UniqueSkill, "UniqueSkillAttrView");
	}

	public initUI(): void {
		this.attrTxt = this.getGObject("txt_attr").asRichTextField;
		this.effectTxt = this.getGObject("txt_effect").asRichTextField;
		this.controller = this.getController("c1");
	}

	public show(): void {
		this.modal = true;
		super.show();
		this.center();
		this.updateAttr();
	}

	private updateAttr(): void {
		let chipData: any;
		let dict: any;
		let attrDict: any = {};
		let effectStr: string = "";
		let isEmpty: boolean = true;
		let structInfo: any = CacheManager.uniqueSkill.getUniqueSkillInfo();
		let info: any = structInfo ? structInfo.levelInfo : {};
		this.attrTxt.text = "";
		for (let key in info) {
			chipData = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeKill},${key},${info[key]}`);//类型，位置，等级
			dict = WeaponUtil.getAttrDict(chipData.attr);
			for (let key in dict) {
				if (!attrDict[key]) {
					attrDict[key] = 0;
				}
				attrDict[key] += dict[key];
			}
			effectStr += `${chipData.effectDesc}\n`;
			isEmpty = false;
		}
		for (let key in attrDict) {
			this.attrTxt.text += `<font color = ${Color.Color_7}>${GameDef.EJewelName[key][2]}:</font>    +${attrDict[key]}\n`;
		}
		this.effectTxt.text = effectStr;

		if (isEmpty) {
			this.controller.selectedIndex = 1;
		} else {
			this.controller.selectedIndex = 0;
		}
		App.TimerManager.doDelay(50, () => {
			this.center();
		}, this);
	}
}