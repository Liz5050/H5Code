/**
 * 外形天赋技能
 */
class ShapeSkillTipView extends BaseWindow {
	private curTxt: fairygui.GRichTextField;
	private nextTxt: fairygui.GRichTextField;
	private upgradeBtn: fairygui.GButton;
	private tipCom: fairygui.GComponent;

	private imgIndex: number;
	private _data: any;

	public constructor() {
		super(PackNameEnum.Shape, "ShapeSkillTipView");
	}

	public initOptUI(): void {
		this.curTxt = this.getGObject("txt_cur").asRichTextField;
		this.nextTxt = this.getGObject("txt_next").asRichTextField;
		this.upgradeBtn = this.getGObject("btn_upgrade").asButton;
		this.tipCom = this.getGObject("com_tip").asCom;
		this.upgradeBtn.addClickListener(this.clickUpgradeBtn, this);
	}

	public updateAll(data: any = null) {
		let nameStr: string;
		let nextNameStr: string;
		let openStr: string;
		let skillCfg: any = ConfigManager.skill.getByPk(data.skillId);
		let skillNextCfg: any;
		this._data = data;
		if (data.isTalent) {
			nameStr = skillCfg.skillName + " Lv." + skillCfg.skillLevel;
		} else {
			nameStr = skillCfg.skillName;
		}
		if (data.openLevelStr) {
			openStr = `<font color = ${Color.Color_2}>${data.openLevelStr} 解锁</font>`;
		} else if (data.propCode) {
			let itemCfg: any = ConfigManager.item.getByPk(data.propCode);
			let color: string = CacheManager.pack.propCache.getItemCountByCode(data.propCode) >= data.propCost ? Color.Color_6 : Color.Color_4;
			openStr = `升级条件：<font color = ${color}>${itemCfg.name}*${data.propCost}</font>`;
		}

		if (data.isOpen) {
			this.curTxt.text = `<font size = "24">${HtmlUtil.html(nameStr, Color.Green2)}</font>`;
			this.curTxt.text += `\n\n<font size = "22">${HtmlUtil.br(skillCfg.skillDescription)}</font>`;
			if (data.isTalent) {
				skillNextCfg = ConfigManager.skill.getByPk(data.skillId + 1);
			}
		} else {
			this.curTxt.text = `<font size = "24">${HtmlUtil.html(nameStr, Color.Red2)}</font>`;
			this.curTxt.text += `\n\n<font size = "22">${HtmlUtil.br(skillCfg.skillDescription)}</font>`;
			this.curTxt.text += `\n\n<font size = "22" >${openStr}</font>`;
		}
		if (skillNextCfg) {
			nextNameStr = skillNextCfg.skillName + " Lv." + skillNextCfg.skillLevel;
			this.nextTxt.text = `\n\n<font size = "24">${HtmlUtil.html(nextNameStr, Color.Red2)}</font>`;
			this.nextTxt.text += `\n\n<font size = "22">${HtmlUtil.br(skillNextCfg.skillDescription)}</font>`;
			this.nextTxt.text += `\n\n<font size = "22">${openStr}</font>`;
		} else {
			this.nextTxt.text = "";
		}


		if(CacheManager.pack.propCache.getItemCountByCode(data.propCode) >= data.propCost && skillNextCfg){
			this.upgradeBtn.visible = true;
			this.tipCom.y = this.nextTxt.height + this.nextTxt.y + 65;
		}else{
			this.upgradeBtn.visible = false;
			this.tipCom.y = this.nextTxt.height + this.nextTxt.y + 10;
		}
	}

	private clickUpgradeBtn(): void{
		if(this._data.roleIndex) {
			ProxyManager.shape.shapeUpgradeChangeSkill(this._data.shape, this._data.change, this._data.skillIndex, this._data.roleIndex);
		}
		else {
			ProxyManager.shape.shapeUpgradeChangeSkill(this._data.shape, this._data.change, this._data.skillIndex);
		}
		this.hide();
	}

}