class BaseFashionCache implements ICache{
	protected activeFashions: Array<any>;
	public constructor() {
	}
	protected getListData():any[]{
		return null;
	}
	public checkTips():boolean{
		var flag:boolean = false;
		var isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Fashion,false);
		if(isOpen){
			flag = this.isFashionTips(this.getListData());
		}		
		return flag;
	}
	/**
	 * 根据时装列表数据判断是否有可升级或激活的时装
	 */
	public isFashionTips(datas:any[]):boolean{
		var flag:boolean=false;
		for(let value of datas){
			var num:number = CacheManager.pack.backPackCache.getItemCountByCode2(value.propCode);
			var star:number = this.getStar(value.code);
			if(num>0 && !ShapeUtils.isShapeFullStar(star)){
				flag = true;
				break;
			}
		}		
		return flag;
	}

	public getStar(code: number):number{
		if(this.activesFashion){
			for(let i = 0; i < this.activesFashion.fashionDict.key_I.length; i++){
				if(this.activesFashion.fashionDict.key_I[i] == code){
					return this.activesFashion.fashionDict.value_I[i];
				}
			}
		}
		return -1;
	}

	public set activesFashion(data: any){
		if(data){
			this.activeFashions = data;
		}
	}

	public get activesFashion(): any{
		if(this.activeFashions){
			return this.activeFashions;
		}
		return null;
	}

	public clear():void{

	}
}