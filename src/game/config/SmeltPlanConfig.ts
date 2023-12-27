class SmeltPlanConfig extends BaseConfig {
	/**合成大类大于该值的显示在背包合成 */
	private static PACK_SMELT_CATE:number = 1000;
	private smeltCateCfg:BaseConfig;
	/**大类->小类数组 */
	private _packSmeltDict:{ [index: number]: any[] };
	private packSmeltCates:any[];
	private smeltCateTypeDict:{[index:string]:any[]};
	private talentSmeltCfg:BaseConfig;


	public constructor() {
		super("t_smelt_plan","smeltPlanCode");
		this.smeltCateTypeDict = {}; 
		this.smeltCateCfg = new BaseConfig("t_smelt_category","smeltCategory,smeltType");
		this.talentSmeltCfg = new BaseConfig("t_talent_smelt","color");
	}
	/**获取需要的第一个合成材料 */
	public getMeterialItem(planCode:number):ItemData{
		let smeltPlanInfo  = ConfigManager.smeltPlan.getByPk(planCode);
		let meterialItem:ItemData = CommonUtils.configStrToArr(smeltPlanInfo.smeltMaterialList)[0];		
		return meterialItem;
	}
	/**根据大小类获取合成数据 */
	public getSmelts(cate:number,type:number):any[]{
		let key:string = `${cate}_${type}`;
		if(!this.smeltCateTypeDict[key]){
			this.smeltCateTypeDict[key] = [];
			let d:any = this.getDict();
			for(let k in d){
				let v:any = d[k];
				if(v.smeltCategory==cate && v.smeltType==type){
					this.smeltCateTypeDict[key].push(v);
				}
			}
		}
		return this.smeltCateTypeDict[key]
	}

	public getPackSmeltCates():any[]{
		if(!this.packSmeltCates){
			this.packSmeltCates = [];			
			let cates:number[] = [];
			let dict:any = this.smeltCateCfg.getDict();
			for(let k in dict){
				let v:any = dict[k];
				if(v.smeltCategory>SmeltPlanConfig.PACK_SMELT_CATE){//是在背包显示的合成
					if(cates.indexOf(v.smeltCategory)==-1){
						cates.push(v.smeltCategory);
						this.packSmeltCates.push(v);
					}					
				}
			}
			App.ArrayUtils.sortOn(this.packSmeltCates,"smeltCategory");
		}
		return this.packSmeltCates;
	}

	public getPackSmeltTypes(cate:number):any[]{
		this.initPackSmeltDict();
		return this._packSmeltDict[cate];
	}

	public getSmeltCateInfo(cate:number,type:number):any{
		return this.smeltCateCfg.getByPk(`${cate},${type}`);
	}
	/**
	 * 需要在合成背包显示的合成大小类数据
	 */
	public getPackSmeltDict():any{
		this.initPackSmeltDict();
		return this._packSmeltDict;
	}

	/**获取天赋合成的配置 */
	public getTalentSmeltInfo(clr:number):any{
		return this.talentSmeltCfg.getByPk(clr);
	}

	private initPackSmeltDict():void{
		if(!this._packSmeltDict){
			this._packSmeltDict = {};
			let dict:any = this.smeltCateCfg.getDict();
			for(let k in dict){
				let v:any = dict[k];
				if(v.smeltCategory>SmeltPlanConfig.PACK_SMELT_CATE){//是在背包显示的合成					
					if(!this._packSmeltDict[v.smeltCategory]){
						this._packSmeltDict[v.smeltCategory] = [];
					}
					if(this._packSmeltDict[v.smeltCategory].indexOf(v)==-1){
						this._packSmeltDict[v.smeltCategory].push(v);
					}
				}
			}
		}
	}


}