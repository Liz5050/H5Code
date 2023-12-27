/**
 * 天赋技能面板
 */
class TalentSkillPanel {
	private currentPanel: fairygui.GComponent;
	private panelDict: { [career: number]: fairygui.GComponent };
	private lineDict: { [career: number]: Array<fairygui.GImage> };
	private career: number;
	private skillDict: any;

	public constructor(panel1: fairygui.GComponent, panel2: fairygui.GComponent, panel4: fairygui.GComponent) {
		this.panelDict = {};
		this.panelDict[1] = panel1;
		this.panelDict[2] = panel2;
		this.panelDict[4] = panel4;

		this.lineDict = {
			1: [],
			2: [],
			4: []
		};
		this.initLine(1, panel1);
		this.initLine(2, panel2);
		this.initLine(4, panel4);
	}

	public updateByCareer(career: number): void {
		this.career = career;
		for (let key in this.panelDict) {
			this.panelDict[key].visible = (career.toString() == key);
		}
		this.currentPanel = this.panelDict[career];
		this.skillDict = CacheManager.talentCultivate.getSkillDict(this.career);
		this.updateSkills();
		this.updateSkillLine();
	}

	private initLine(career: number, panel: fairygui.GComponent): void {
		for (let c of panel._children) {
			if (c.name.indexOf("line_") != -1) {
				this.lineDict[career].push(c.asImage);
			}
		}
	}

	private updateSkills(): void {
		let talentSkillItem: TalentSkillItem;
		let skillId: number;
		let skillData: any;
		for (let i: number = 1; i <= 16; i++) {
			talentSkillItem = <TalentSkillItem>this.currentPanel.getChild("item_" + i);
			skillId = CacheManager.talentCultivate.genSkillId(this.career, i);
			skillData = CacheManager.talentCultivate.getSkillData(skillId, this.career, this.skillDict);
			// skillData = this.skillDict[skillId];
			// if (skillData == null) {
			// 	let cfgSkillData: any = ConfigManager.cultivateEffectType.getByPk(skillId);
			// 	skillData = {};
			// 	skillData["id"] = skillId;
			// 	skillData["level"] = 0;
			// 	skillData["learnedLevel"] = 0;
			// 	skillData["limitLevel"] = cfgSkillData.effect1;//读配置
			// 	skillData["isOpen"] = false;
			// }
			// skillData["career"] = this.career;
			talentSkillItem.skillData = skillData;
		}
	}

	/**
	 * 更新技能线
	 */
	private updateSkillLine(): void {
		let lines: Array<fairygui.GImage> = this.lineDict[this.career];
		let name: string;
		let indexs: Array<string>;
		for (let line of lines) {
			name = line.name;
			indexs = name.replace("line_", "").split("_");
			line.visible = CacheManager.talentCultivate.isLineEnable(this.career, Number(indexs[0]), Number(indexs[1]), this.skillDict);
		}
	}
}