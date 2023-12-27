class ToolTipGodWing extends ToolTipEquip {
	
	public constructor() {
		super();
				
	}

	protected updateInfo(itemInfo: any):void{
		var name: string = this.itemData.getName(true);
		this.nameTxt.text = name;
		let godWingCfg:any = ConfigManager.mgStrengthenExAccessory.getByPk(this.itemData.getCode());
		let attrDict:any = WeaponUtil.getAttrDict(godWingCfg.attrList);
		let fight:number = WeaponUtil.getCombat(attrDict);
		this.scoreTxt.text = "评分："+fight;
		let limits:string[] = godWingCfg.limits.split("#");
		let cond:string[] = limits[0].split(",");
		if(cond.length>0){
			let condStr:string = ConfigManager.mgStrengthenExAccessory.getCondName(cond[0]);
			this.rebirthTimeTxt.text = App.StringUtils.substitude(LangGodWing.L7,cond[1],condStr);//穿戴条件
		}
		this.careerTxt.text = "通用";		
		this.typeTxt.text = ConfigManager.mgStrengthenExAccessory.getTypeName(godWingCfg.type); //神羽类型名称
		this.txtFight.text = fight+"";
		this.baseAttrTxt.text = WeaponUtil.getAttrText2(attrDict,true,Color.Color_8,Color.Color_7,true,false,true);
		
	}
}