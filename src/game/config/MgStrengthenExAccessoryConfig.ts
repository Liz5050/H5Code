/**神羽配置 */
class MgStrengthenExAccessoryConfig extends BaseConfig {
	/**根据 strengthen_ex_type type level 获取数据 */
	private _levelInfoDict:any;
	private _godWingLevelItemDict:any;
	private _nameDict:any;
	private _condName:any;
	public constructor() {
		super("t_mg_strengthen_ex_accessory","itemCode");
		this._nameDict = {
			[EWingAccessoryType.EWingAccessoryTypeOne]:"飞羽",
			[EWingAccessoryType.EWingAccessoryTypeTow]:"纤羽",
			[EWingAccessoryType.EWingAccessoryTypeThree]:"绒羽",
			[EWingAccessoryType.EWingAccessoryTypeFour]:"翎羽",
		};
		this._condName = {
			"1":"级",
			"2":"阶",
			"3":"星"
		};
	}
	public parseByPk(sourceData: any, pk: string): any {
		let data = {};
		this._levelInfoDict = {};
		if (sourceData) {
			let key: string = "";
			let pks: Array<string> = pk.split(",");
			for (let d of sourceData) {
				key = "";
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
				let levelKey:string = this.getLevelKey(d.strengthenExType,d.type,d.level);
				this._levelInfoDict[levelKey]=d;

			}
		}
		return data;
	}
	private getLevelKey(strengthenExType:number,type:number,level:number):string{
		!strengthenExType?strengthenExType=0:null;
		!type?type=0:null;
		!level?level=0:null;
		let levelKey:string = strengthenExType+"_"+type+"_"+level;
		return levelKey;
	}
	/**根据当前阶的信息获取下一阶的信息 */
	public getNextLevelInfo(info:any):any{
        this.getDict();
		let reInfo:any;
		if(info){
			let key:string = this.getLevelKey(info.strengthenExType,info.type,info.level+1);
			reInfo = this._levelInfoDict[key];
		}
		return reInfo;
	}	
	public getInfoBy(strengthenExType:number,type:number,level:number):any{
        this.getDict();
		let levelKey:string = this.getLevelKey(strengthenExType,type,level);
		return this._levelInfoDict[levelKey];;
	}
	/**获取某类神羽中所有阶的神羽*/
	public getGodWingLevelItemCodes(type:number):ItemData[]{
		let codes:ItemData[];
		if(!this._godWingLevelItemDict){
			this._godWingLevelItemDict = {};
		}
		if(!this._godWingLevelItemDict[type]){
			codes = [];
			let minLv:number = 1;
			let levelInfo:any = this.getInfoBy(EStrengthenExType.EStrengthenExTypeWing,type,minLv);
			while(levelInfo){
				codes.push(new ItemData(levelInfo.itemCode));
				minLv++;
				levelInfo = this.getInfoBy(EStrengthenExType.EStrengthenExTypeWing,type,minLv);
			}
			this._godWingLevelItemDict[type] = codes;
		}
		codes = this._godWingLevelItemDict[type];
		return codes;
	}
	/**根据一个神羽code 获取另外三种神羽中同阶的物品信息 */
	public getOtherTypeSameLevel(itemCode:number):ItemData[]{
		let cfg:any = this.getByPk(itemCode);
		let items:ItemData[] = [];
		if(cfg){
			for(let i:number=0;i<CacheManager.godWing.godWingTypeOrder.length;i++){
				let type:number = CacheManager.godWing.godWingTypeOrder[i];
				if(type!=cfg.type){
					let info:any = this.getInfoBy(EStrengthenExType.EStrengthenExTypeWing,type,cfg.level);
					if(info){
						items.push(new ItemData(info.itemCode));
					}
				}
			}
		}
		
		return items;
	}
	
	public getTypeName(type:number):string{
		return this._nameDict[type];
	}

	public getCondName(condType:string):string{
		return this._condName[condType];
	}

}