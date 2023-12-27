/**
 * 角色属性窗口
 */
class RoleAttrWindow extends BaseWindow {
	private static _instance: RoleAttrWindow;
	private careerTxt: fairygui.GTextField;//职业
	private lifeTxt: fairygui.GTextField;
	private attackTxt: fairygui.GTextField;//攻击
	private defenseTxt: fairygui.GTextField;//防御
	private passTxt: fairygui.GTextField;//穿透，破甲
	// private toughnessTxt: fairygui.GTextField;//坚韧
	// private critTxt: fairygui.GTextField;//暴击
	private joukTxt: fairygui.GTextField;//闪避
	private hitTxt: fairygui.GTextField;//命中
	private careerBtns: Array<fairygui.GButton> = [];
	private careers: Array<number> = [1, 2, 4];

	private roleCache: RoleCache;

	public constructor() {
		super(PackNameEnum.Player, "WindowRoleAttr");
		this.roleCache = CacheManager.role;
	}

	public initOptUI(): void {
		this.lifeTxt = this.getGObject("txt_life").asTextField;
		this.attackTxt = this.getGObject("txt_attack").asTextField;
		this.defenseTxt = this.getGObject("txt_defense").asTextField;
		this.passTxt = this.getGObject("txt_pass").asTextField;
		// this.toughnessTxt = this.getGObject("txt_toughness").asTextField;
		// this.critTxt = this.getGObject("txt_crit").asTextField;
		this.joukTxt = this.getGObject("txt_jouk").asTextField;
		this.hitTxt = this.getGObject("txt_hit").asTextField;
		for (let career of this.careers) {
			let btn: fairygui.GButton = this.getGObject("btn_" + career).asButton;
			btn.addClickListener(this.clickBtn, this);
			this.careerBtns.push(btn);
		}
	}

	public updateAll(): void {
	}

	public selectByCareer(career: number): void {
		career = CareerUtil.getBaseCareer(career);
		for (let btn of this.careerBtns) {
			let c: number = Number(btn.name.replace("btn_", ""));
			btn.selected = (c == career);
			let isOpen: boolean = CacheManager.role.isOpenedCareer(c);
			App.DisplayUtils.grayButton(btn, !isOpen, !isOpen);
		}
		this.updateFightAttr(this.roleCache.getRoleIndex(career));
	}

	/**更新属性 */
	private updateFightAttr(index: number): void {
		let fightAttr: any = this.roleCache.getRoleFightAttr(index);
		this.lifeTxt.text = fightAttr.maxLife_L64.toString();
		this.attackTxt.text = (Number(fightAttr.physicalAttack_L64) + Number(fightAttr.magicAttack_I)).toString();
		this.defenseTxt.text = (Number(fightAttr.physicalDefense_I) + Number(fightAttr.magicDefense_I)).toString();
		this.passTxt.text = (fightAttr.pass_I).toString();
		// this.toughnessTxt.text = (fightAttr.toughness_I).toString();
		// this.critTxt.text = (Number(fightAttr.physicalCrit_I) + Number(fightAttr.magicCrit_I)).toString();
		this.joukTxt.text = (fightAttr.jouk_I).toString();
		this.hitTxt.text = (fightAttr.hit_I).toString();

		//极品属性
		this.updateAttr("txt_outPutDamageRate", fightAttr.outPutDamageRate_I / 100 + "%");//伤害加深
		this.updateAttr("txt_critRate", fightAttr.critRate_I / 100 + "%");//暴击几率
		// this.updateAttr("txt_critDamagePercentage", fightAttr.critDamage_L64+"");//暴击伤害
		this.updateAttr("txt_critDamagePercentage", (fightAttr.physicalCrit_I + fightAttr.magicCrit_I) +"");//暴击

		// this.updateAttr("txt_joukRate", fightAttr.joukRate_I / 100 + "%");//闪避几率
		// this.updateAttr("txt_knowingRate", fightAttr.knowingRate_I / 100 + "%");//会心几率
		// this.updateAttr("txt_wuxingAttackPercentage", fightAttr.wuxingAttackPercentage_I);//五行攻击
		// this.updateAttr("txt_armorRate", fightAttr.armorRate_I / 100 + "%");//人物护甲
		this.updateAttr("txt_sufferDamageRate", fightAttr.sufferDamageRate_I / 100 + "%");//伤害减免
		this.updateAttr("txt_outPutCritDamageRate", fightAttr.outPutCritDamageRate_I / 100 + "%");//暴击加强
		// this.updateAttr("txt_critDefenseRate", fightAttr.critDefenseRate_I / 100 + "%");//暴击抵抗
		// this.updateAttr("txt_blockRate", fightAttr.blockRate_I / 100 + "%");//格挡几率
		// this.updateAttr("txt_wuxingDefense", fightAttr.wuxingDefense_I);//五行防御
		// this.updateAttr("txt_speed", fightAttr.speed_I);//移动速度
	}

	/**更新属性 */
	private updateAttr(name: string, value: string): void {
		this.getGObject(name).asTextField.text = value;
	}

	public static get instance(): RoleAttrWindow {
		if (RoleAttrWindow._instance == null) {
			RoleAttrWindow._instance = new RoleAttrWindow();
		}
		return RoleAttrWindow._instance;
	}

	private clickBtn(e: egret.TouchEvent): void {
		let btn: fairygui.GButton = e.target;
		let career: number = Number(btn.name.replace("btn_", ""));
		this.selectByCareer(career);
	}
}