class WeaponFashionCache extends BaseFashionCache{
	private fashionDatas: Array<any>;	
	private fashionData: any;
	public propertyItems: Array<any>;
	public constructor() {
		super();
	}

	public listData():void{
		this.fashionDatas = this.getListData();
	}
	
	/**化形基本属性 */
	public setAttrs():void{
		this.propertyItems = [];
		let attrsDict: any;
		attrsDict = WeaponUtil.getAttrDict(this.fashionData.attrList);
		for(let key in attrsDict){
			let typeIncrease: number = this.star < 5 ? attrsDict[key] : 0;
			let value:number = (this.star+1)*attrsDict[key];
			this.propertyItems.push({"name": GameDef.EJewelName[key][0], "value": Math.ceil(value), "typeIncrease": typeIncrease});
		}
	}
	public sortFashion():void{
		if(this.fashionsData && this.fashionsData.length > 0){
			this.fashionsData.sort((a: any, b:any): number =>{
				return this.getFashionSort(a) - this.getFashionSort(b);
			});
		}
	}

	private getFashionSort(data:any):number{
		if(CacheManager.pack.backPackCache.getItemCountByCode2(data.propCode) > 0){
			if(this.getStar(data.code) == -1){
				return 1;
			}
			return 10;
		}
		return data.code;
	}

	protected getListData():any[]{
		return ConfigManager.mgFashion.getFashionByType(2);
	}

	public get fashionsData(): Array<any>{
		if(this.fashionDatas){
			return this.fashionDatas;
		}
		return [];
	}

	/**设置当前选择时装数据 */
	public set currentChangeData(data: any){
		this.fashionData = data;
		// this.setNextChangeData();
	}

	public get star(): number{
		if(this.activesFashion){
			for(let i = 0; i < this.activesFashion.fashionDict.key_I.length; i++){
				if(this.activesFashion.fashionDict.key_I[i] == this.code){
					return this.activesFashion.fashionDict.value_I[i];
				}
			}
		}
		return -1;
	}

	public get equipFashion(): number{
		if(this.activesFashion){
			return this.activesFashion.equipFashion_I;
		}
		return 0;
	}

	/**获取当前外形基本属性 */
	public get attrItems(): Array<any>{
		if(this.propertyItems){
			return this.propertyItems;
		}
		return [];
	}

	public get code(): number{
		if(this.fashionData){
			return this.fashionData.code;
		}
		return 0;
	}

	public get modelId(): number{
		if(this.fashionData){
			return this.fashionData.modelId;
		}
		return 0;
	}

	public get name(): string{
		if(this.fashionData){
			return this.fashionData.name;
		}
		return null;
	}

	public get propCode(): number{
		if(this.fashionData){
			return this.fashionData.propCode;
		}
		return 0;
	}

	public get type(): number{
		if(this.fashionData){
			return this.fashionData.type;
		}
		return 0;
	}

	public get useNum(): number{
		if(this.fashionData){
			return this.fashionData.useNum;
		}
		return 0;
	}

	/**获取当前外形基本属性字典 */
	public get attrDict(): any{
		if(this.fashionData){
			return WeaponUtil.getAttrDict(this.fashionData.attrList);
		}
		return null;
	}

	public clear():void{
		
	}
}