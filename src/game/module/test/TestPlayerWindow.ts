/**
 * 人物信息窗口
 */
class TestPlayerWindow extends BaseWindow {
	private c1: fairygui.Controller;
	private infoTxt: fairygui.GRichTextField;

	public constructor() {
		super(PackNameEnum.Test, "TestPlayerWindow", null, LayerManager.UI_DEMO);
	}

	public initOptUI(): void {
		this.c1 = this.getController("c1");
		this.infoTxt = this.getGObject("com_info").asCom.getChild("txt_info").asRichTextField;

		this.c1.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onTabChanged, this);
	}

	public updateAll(data: any = null): void {
		this.onTabChanged();
	}

	protected onTabChanged(e: any = null): void {
		let index: number = this.c1.selectedIndex;
		if (index == 0) {
			this.updateSkill();
		} else if (index == 1) {
			this.updateAttr();
		}
	}

	private updateSkill(): void {
		let info: string = "技能列表：\n";
		let skillData: SkillData;
		for (let roleIndex in CacheManager.skill.skills) {
			if (roleIndex != "0") {
				info += "\n\n";
			}
			info += `角色：${roleIndex}\n`;
			for (let skillId in CacheManager.skill.skills[roleIndex]) {
				skillData = CacheManager.skill.skills[roleIndex][skillId];
				info += `${skillId}: ${skillData.skill.skillName}\n`;
			}
		}

		info += "\nBUFF列表：\n";
		let buffers: any = CacheManager.buff.getBuffers();
		let buff: any;
		for (let roleIndex in buffers) {
			if (roleIndex != "0") {
				info += "\n\n";
			}
			info += `角色：${roleIndex}\n`;
			for (let bufferId in buffers[roleIndex]) {
				buff = buffers[roleIndex][bufferId];
				if (buff != null) {
					info += ` ${bufferId}: ${buff.bufferInfo.name}\n`;
				}
			}
		}

		this.infoTxt.text = info;
	}

	private updateAttr(): void {
		let info: string = "";
		let fightAttrBase: any;
		let fightAttrAdd: any;
		let fightAttr: any;
		for (let i: number = 0; i < CacheManager.role.roles.length; i++) {
			if (i != 0) {
				info += "\n\n";
			}
			info += `角色${i}\n`;
			info += "基础属性：\n\n";
			fightAttrBase = CacheManager.role.getRoleFightBaseAttr(i);
			fightAttrAdd = CacheManager.role.getRoleFightAddAttr(i);
			fightAttr = CacheManager.role.getRoleFightAttr(i);
			info += `生命：${fightAttrBase.maxLife_L64} + ${fightAttrAdd.maxLife_L64} => ${fightAttr.maxLife_L64}\n`;
			info += `攻击：${Number(fightAttrBase.physicalAttack_L64) + Number(fightAttrBase.magicAttack_I)} + ${Number(fightAttrAdd.physicalAttack_L64) + Number(fightAttrAdd.magicAttack_I)} => ${Number(fightAttr.physicalAttack_L64) + Number(fightAttr.magicAttack_I)}\n`;
			info += `防御：${Number(fightAttrBase.physicalDefense_I) + Number(fightAttrBase.magicDefense_I)} + ${Number(fightAttrAdd.physicalDefense_I) + Number(fightAttrAdd.magicDefense_I)} => ${Number(fightAttr.physicalDefense_I) + Number(fightAttr.magicDefense_I)}\n`;
			info += `破甲：${fightAttrBase.pass_I} + ${fightAttrAdd.pass_I} => ${fightAttr.pass_I}\n`;
			info += `暴击伤害：${fightAttrBase.critDamage_L64} + ${fightAttrAdd.critDamage_L64} => ${fightAttr.critDamage_L64}\n`;
			info += `伤害减免：${fightAttrBase.sufferDamageRate_I / 100}% + ${fightAttrAdd.sufferDamageRate_I / 100}% => ${fightAttr.sufferDamageRate_I / 100}%\n`;
			info += `伤害加深：${fightAttrBase.outPutDamageRate_I / 100}% + ${fightAttrAdd.outPutDamageRate_I / 100}% => ${fightAttr.outPutDamageRate_I / 100}%\n`;
			info += `暴击加强：${fightAttrBase.outPutCritDamageRate_I / 100}% + ${fightAttrAdd.outPutCritDamageRate_I / 100}% => ${fightAttr.outPutCritDamageRate_I / 100}%\n`;
			info += `暴击几率：${fightAttrBase.critRate_I / 100}% + ${fightAttrAdd.critRate_I / 100}% => ${fightAttr.critRate_I / 100}%\n`;
		}
		this.infoTxt.text = info;
	}
}