class WindowOtherRoleAttr extends BaseWindow {
	private static _instance: WindowOtherRoleAttr;
	public static get instance(): WindowOtherRoleAttr {
		if (WindowOtherRoleAttr._instance == null) {
			WindowOtherRoleAttr._instance = new WindowOtherRoleAttr();
		}
		return WindowOtherRoleAttr._instance;
	}
    
	private careerTxt: fairygui.GTextField;//职业
	private lifeTxt: fairygui.GTextField;
	private attackTxt: fairygui.GTextField;//攻击
	private defenseTxt: fairygui.GTextField;//防御
	private passTxt: fairygui.GTextField;//穿透，破甲
	// private toughnessTxt: fairygui.GTextField;//坚韧
	// private critTxt: fairygui.GTextField;//暴击
	// private joukTxt: fairygui.GTextField;//闪避
	// private hitTxt: fairygui.GTextField;//命中
	private careerBtns: Array<fairygui.GButton> = [];
	private careers: Array<number> = [1, 2, 4];

	private curIndex:number = -1;
	private roleDatas:any[];
	public constructor() {
		super(PackNameEnum.PlayerOther, "WindowOtherRoleAttr");
	}

	public initOptUI(): void {
		this.lifeTxt = this.getGObject("txt_life").asTextField;
		this.attackTxt = this.getGObject("txt_attack").asTextField;
		this.defenseTxt = this.getGObject("txt_defense").asTextField;
		this.passTxt = this.getGObject("txt_pass").asTextField;
		// this.toughnessTxt = this.getGObject("txt_toughness").asTextField;
		// this.critTxt = this.getGObject("txt_crit").asTextField;
		// this.joukTxt = this.getGObject("txt_jouk").asTextField;
		// this.hitTxt = this.getGObject("txt_hit").asTextField;
		for (let career of this.careers) {
			let btn: fairygui.GButton = this.getGObject("btn_" + career).asButton;
			btn.addClickListener(this.clickBtn, this);
			this.careerBtns.push(btn);
		}
	}

	public updateAll(data:any): void {
		this.roleDatas = data.playerData;
		let curData:any = data.curData;
		let openRoles:number[] = [];
		for(let i:number = 0; i < this.careerBtns.length; i++) {
			if(i < this.roleDatas.length) {
				openRoles.push(CareerUtil.getBaseCareer(this.roleDatas[i].career_SH));
			}
		}

		for(let i:number = 0; i < this.careers.length; i++) {
			let isOpen:boolean = openRoles.indexOf(this.careers[i]) != -1;
			App.DisplayUtils.grayButton(this.careerBtns[i], !isOpen, !isOpen);
		}
		let index:number = this.careers.indexOf(CareerUtil.getBaseCareer(curData.career_SH));
		this.setIndex(index);
	}

	private clickBtn(e: egret.TouchEvent): void {
		let btn: fairygui.GButton = e.currentTarget as fairygui.GButton;
		let index:number = this.careerBtns.indexOf(btn);
		this.setIndex(index);
	}

	private setIndex(index:number):void {
		if(this.curIndex == index) return;
		if(this.curIndex != -1) {
			this.careerBtns[this.curIndex].selected = false;
		}
		this.curIndex = index;
		this.careerBtns[this.curIndex].selected = true;
		this.updateFightAttr();
	}


	/**更新属性 */
	private updateFightAttr(): void {
		let curData:any;
		for(let i:number = 0; i < this.roleDatas.length; i++) {
			if(CareerUtil.getBaseCareer(this.roleDatas[i].career_SH) == this.careers[this.curIndex]) {
				curData = this.roleDatas[i];
			}
		}
		let fightAttr: any = curData.attribute;
		this.lifeTxt.text = fightAttr.maxLife_L64.toString();
		this.attackTxt.text = Number(fightAttr.physicalAttack_L64) + ""; //+ Number(fightAttr.magicAttack_I)).toString();
		this.defenseTxt.text = Number(fightAttr.physicalDefense_I) + "";//+ Number(fightAttr.magicDefense_I)).toString();
		this.passTxt.text = (fightAttr.pass_I).toString();
		// this.toughnessTxt.text = (fightAttr.toughness_I).toString();
		// this.critTxt.text = Number(fightAttr.physicalCrit_I) + ""; //Number(fightAttr.magicCrit_I)).toString();
		// this.joukTxt.text = (fightAttr.jouk_I).toString();
		// this.hitTxt.text = (fightAttr.hit_I).toString();

		//极品属性
		this.updateAttr("txt_outPutDamageRate", fightAttr.outPutDamageRate_I / 100 + "%");//伤害加深
		this.updateAttr("txt_critRate", fightAttr.critRate_I / 100 + "%");//暴击几率
		// this.updateAttr("txt_joukRate", fightAttr.joukRate_I / 100 + "%");//闪避几率
		// this.updateAttr("txt_knowingRate", fightAttr.knowingRate_I / 100 + "%");//会心几率
		// this.updateAttr("txt_wuxingAttackPercentage", fightAttr.wuxingAttackPercentage_I);//五行攻击
		// this.updateAttr("txt_armorRate", fightAttr.armorRate_I / 100 + "%");//人物护甲
		this.updateAttr("txt_sufferDamageRate", fightAttr.sufferDamageRate_I / 100 + "%");//伤害减免
		this.updateAttr("txt_outPutCritDamageRate", fightAttr.outPutCritDamageRate_I / 100 + "%");//暴击伤害
		// this.updateAttr("txt_critDefenseRate", fightAttr.critDefenseRate_I / 100 + "%");//暴击抵抗
		// this.updateAttr("txt_blockRate", fightAttr.blockRate_I / 100 + "%");//格挡几率
		// this.updateAttr("txt_wuxingDefense", fightAttr.wuxingDefense_I);//五行防御
		// this.updateAttr("txt_speed", fightAttr.speed_I);//移动速度
	}

	/**更新属性 */
	private updateAttr(name: string, value: string): void {
		this.getGObject(name).asTextField.text = value;
	}

	public hide():void {
		super.hide();
		if(this.curIndex != -1) {
			this.careerBtns[this.curIndex].selected = false;
			this.curIndex = -1;
		}
	}
}