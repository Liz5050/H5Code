class MgRechargeConfig extends BaseConfig {
	private _typeDictData:any;
	private _rechargeFirstData:any[];
	/**团购配置 */
	private _groupBuy:BaseConfig;
	/**{index:{groupNum:[]}} */
	private _groupBuyInfos:any;
	private _groupBuyGroups:any;
	private _groupBuyIdxInfos:any;

	public constructor() {
		super("t_mg_recharge","id");
		this._groupBuy = new BaseConfig("t_mg_recharge_group","id");

	}

	public parseByPk(sourceData: any, pk: string): any {
		let data = {};
		this._typeDictData = {};
		this._rechargeFirstData = [];
		if (sourceData) {
			for (let d of sourceData) {
				var key: string = "";
				let pks = pk.split(",");
				if (pks.length > 1) {//组合主键
					for (let k of pks) {
						if (d[k]) {
							key += d[k] + this.sep;
						} else {
							key += 0 + this.sep;
						}
					}
				} else {
					key = d[pk] ? d[pk] : 0;					
				}
				data[key] = d;
				if(!this._typeDictData[d.type]){
					this._typeDictData[d.type] = [];
				}
				this._typeDictData[d.type].push(d);
				if(d.firstValueEx){
					this._rechargeFirstData.push(d);
				}
			}
		}
		return data;
	}

	public getFirstRecharge():any[]{
		this.getDict();
		let infos:any[] = this.filterByPlatform(this._rechargeFirstData,"order");
		return infos;
	}

	public getByType(type:number):any[]{
        this.getDict();
        return this.filterByPlatform(this._typeDictData[type]);

	}
	/**获取双倍 */
	public getDoubleValue(data:any):number{
		let retVal:number = data.value;
		let rewardStr:string = data.rewardStr;
		
		let arr:string[] = rewardStr.split(",");
		let unit: number = Number(arr[1]);
		if(unit==EPriceUnit.EPriceUnitGold){
			retVal+=Number(arr[arr.length-1]);
		}		
		return retVal;
	}
	/**获取4倍 */
	public getDouDoubleValue(data:any):number{
		let retVal:number = data.value;
		let firstValueEx:number = ObjectUtil.getConfigVal(data,"firstValueEx",0)
		retVal+=firstValueEx;
		return retVal;
	}

	public getTypeIcoUrl(data:any):string{
		let type:number = ObjectUtil.getConfigVal(data,"type",0);
        let icon:number = data.icon?data.icon:1;
		return URLManager.getModuleImgUrl(`recharge_type_${type}_${icon}.png`,PackNameEnum.Recharge);
	}

	public getGroupBuyByPk(value:any):any{
		return this._groupBuy.getByPk(value);
	}

	public getIndexInfos(index:number):any[]{
		this.groupBuyFilter(index);
		return this._groupBuyIdxInfos[index];
	}

	public getGroupBuyInfos(index:number,groupNum:number):any[]{
		this.groupBuyFilter(index);
		let infs:any[] = this._groupBuyInfos[index][groupNum];
		App.ArrayUtils.sortOn(infs,'id');
		return infs;
	}

	public getIndexGroups(index:number):number[]{
		this.groupBuyFilter(index);	
		return this._groupBuyGroups[index];
	}
	
	private groupBuyFilter(index:number):void{
		if(!this._groupBuyGroups || !this._groupBuyGroups[index] ){
			!this._groupBuyInfos?this._groupBuyInfos = {}:null;			
			!this._groupBuyGroups?this._groupBuyGroups = {}:null;
			!this._groupBuyIdxInfos?this._groupBuyIdxInfos = {}:null;
			this._groupBuyIdxInfos[index] = [];
			this._groupBuyInfos[index] = {};
			let dict:any = this._groupBuy.getDict();
			let groups:number[] = []; //团购组
			for(let key in dict){
				let d:any = dict[key];
				if(d.index==index){
					this._groupBuyIdxInfos[index].push(d);
					let groupNum:number = d.groupNum?d.groupNum:0;
					if(!this._groupBuyInfos[index][groupNum]){ //分组
						this._groupBuyInfos[index][groupNum] = [];
					}
					this._groupBuyInfos[index][groupNum].push(d);
					if(groups.indexOf(groupNum)==-1){
						groups.push(groupNum);
					}
				}
			}
			App.ArrayUtils.sortOn(groups);
			this._groupBuyGroups[index] = groups;			
		}
	}

	private filterByPlatform(source:Array<any>,sortKey:string="money",isDesc:boolean=false):Array<any>{
        let infos:Array<any> = [];
        for(let info of source){
            if((info.platform & Sdk.platform_config_data.platform_pay_type) > 0) {
                infos.push(info);
            }
        }
        App.ArrayUtils.sortOn(infos,sortKey,isDesc);
        return infos;
    }
}