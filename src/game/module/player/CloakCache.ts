class CloakCache  extends BaseShapeCache{
	public shapeList:Array<any>;
	public shapeData:any;
	//public materialItems:Array<any>;
	//public drugItems:Array<any>;
	public skillItems:Array<any>;
	public propertyItems:Array<any>;
	public luckyMin:number;
	public shapeName: string;
	public drugItemMax:Array<any>;

	private shapeItem: any;
	private drugsAttr:Array<any>;
	private drug2AttrRate:any;
	private changesDict: any;

	/**是否在一键提升中 */
	public isAutoPromote:boolean = false;

	/**是否刚接收材料升级返回数据 */
	public isShapeUpdateEx:boolean = false;
	
	public constructor() {
		super();
	}

	public setData(){
		this.setDrugs();
		this.setSkills();
		this.setDrugsValue();
		this.setMaterials();
		this.setPropertys();
		this.setChangeDict();
	}

	/**设置提升材料类型 */
	public setMaterials():void{
		this.materialItems = [];
		let materials:Array<any>;
		materials = ConfigManager.item.selectCTShapeAndColor(ECategory.ECategoryMaterial, EProp.EPropEquipRefineMaterial, EShape.EShapeCloak, EColor.EColorBlue, EColor.EColorOrange);
		for(let key in materials){
			let material:any = materials[key];
			let itemData:ItemData = new ItemData(material.code);
			if(!itemData.isBind){
				this.materialItems.push(itemData);
			}
		}
	}

	/**读取仙羽类型 */
	public setDrugs():void{
		this.drugItems = this.getDrugs(EShape.EShapeCloak);
	
		// let drugs:any;
		// drugs = ConfigManager.mgShapeDrugAttr.getByPk(EShape.EShapeCloak);
		// for(let i = 0; i < 3; i++){
		// 	let itemData:ItemData = new ItemData(drugs['drug' + (i+1) +'ItemCode']);
		// 	this.drugItems.push(itemData);
		// }
	}

	/**读取技能类型 */
	public setSkills():void{
		this.skillItems = [];
		let skills:any;
		skills = ConfigManager.mgShapeOpen.select({"shape": EShape.EShapeCloak});
		for(let skill of skills){
			let skillData:SkillData = new SkillData(skill.openSkill);
			this.skillItems.push(skillData);
		}
	}

	/**读取仙羽已使用数量 */
	private setDrugsAmount():void{
		let amount:Array<any> = [];
		for(let i = 0; i < 3; i++){
			amount[i] = this.drugDictValue[i] ? this.drugDictValue[i] : 0;
			this.drugsAttr[i]["amount"] = amount[i];
		}
	}

	/**读取仙羽的加成属性值 */
	private setDrugsValue(){
		this.drugsAttr = [];
		let drugs:any;
		drugs = ConfigManager.mgShapeDrugAttr.getByPk(EShape.EShapeCloak);

		for(let i = 1; i < 4; i++){
			this.drugsAttr.push({"attrList":WeaponUtil.getAttrDict(drugs[`drug${i}PerAttrList`]), "amount":0});
		}
		this.drug2AttrRate = drugs.drug2AttrRate;
	}

	/**设置加成属性的参数 */
	public setPropertys():void{
		this.propertyItems = [];
		this.drugItemMax = [];
		// let shapeItem:any;
		let property:any;
		this.shapeItem = ConfigManager.mgShape.getByShapeAndLevel(EShape.EShapeCloak, this.level);
		property = WeaponUtil.getAttrDict(this.shapeItem.attrList);
		let nextProperty: any = null;
		if(this.level < 600){
			nextProperty = WeaponUtil.getAttrDict((ConfigManager.mgShape.getByShapeAndLevel(EShape.EShapeCloak, this.level + 1)).attrList);
		}
		
		this.setDrugsAmount();
		for(let key in property){
			let typeIncrease: number = nextProperty ? nextProperty[key] - property[key] : 0;
			let value:number = property[key];
			for(let attrValue of this.drugsAttr){
				value += (attrValue["attrList"][key] ? attrValue["attrList"][key] : 0) * attrValue["amount"];
			}
			if(this.drugsAttr[1]["amount"] > 0){
				value *= (1+this.drug2AttrRate/10000*this.drugsAttr[1]["amount"]);
			}

			this.propertyItems.push({"name": GameDef.EJewelName[key][0], "value": Math.ceil(value), "typeIncrease": typeIncrease});
		}
		this.luckyMin = this.shapeItem.luckyMin;
		this.shapeName = this.shapeItem.name;
		this.drugItemMax.push(this.shapeItem.drug1ItemMax);
		this.drugItemMax.push(this.shapeItem.drug2ItemMax);
		this.drugItemMax.push(this.shapeItem.drug3ItemMax);
	}

	private setChangeDict():void{
		this.changesDict = {};
		if(this.shapeData){
			for(let i = 0; i < this.shapeData.changeDict.key_I.length; i++){
				this.changesDict[this.shapeData.changeDict.key_I[i]] = this.shapeData.changeDict.value_I[i];
			}
		}
	}

	public get level(): number{
		if(this.shapeData){
			return this.shapeData.level_I;
		}
		return 0;
	}

	public get warfare(): number{
		if(this.shapeData){
			return this.shapeData.warfare_L64;
		}
		return 0;
	}

	public get lucky(): number{
		if(this.shapeData){
			return this.shapeData.lucky_I;
		}
		return 0;
	}

	public set lucky(value:number){
		this.shapeData.lucky_I = value;
	}

	public get drugDict(): any{
		if(this.shapeData){
			return this.shapeData.drugDict;
		}
		return 0;
	}

	public get drugDictKey(): Array<number>{
		if(this.shapeData){
			return this.shapeData.drugDict.key_I;
		}
		return [];
	}

	public get drugDictValue(): Array<number>{
		if(this.shapeData){
			return this.shapeData.drugDict.value_I;
		}
		return [];
	}

	public get changeDict(): any{
		if(this.changesDict){
			return this.changesDict;
		}
		return null;
	}

	public get skillsData(): Array<number>{
		if(this.shapeData){
			return this.shapeData.skills.data_I;
		}
		return [];
	}

	public get useModelId(): number{
		if(this.shapeData){
			return this.shapeData.useModelId_I;
		}
		return 0;
	}

	public set useModelId(value: number){
		this.shapeData.useModelId_I = value;
	}

	public get modelID(): number{
		if(this.shapeItem){
			return this.shapeItem.modelId;
		}
		return 0;
	}

	public clear():void{
		
	}
}