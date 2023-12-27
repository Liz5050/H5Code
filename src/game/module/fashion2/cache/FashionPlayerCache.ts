class FashionPlayerCache implements ICache{
	private _activeInfo: any = {};
	private _activeFashionStar: any = {};
	private _activeFashionEndTime: any = {};

	private playerModel: any = {};

	/**当前操作的角色索引 */
	public operationIndex:number = 0;

	public constructor() {
	}

	public updateFashionList(fashions: Array<any>): void{
		this._activeInfo = {};
		this._activeFashionStar = {};
		this._activeFashionEndTime = {};
		for(let info of fashions){
			if(!this._activeInfo[info.roleIdx_I]){
				this._activeInfo[info.roleIdx_I] = {};
			}
			this._activeInfo[info.roleIdx_I][info.type_I] = info;
			
			if(!this._activeFashionStar[info.roleIdx_I]){
				this._activeFashionStar[info.roleIdx_I] = {};
			}
			for(let i = 0; i < info.fashionDict.key_I.length; i++){
				this._activeFashionStar[info.roleIdx_I][info.fashionDict.key_I[i]] = info.fashionDict.value_I[i];
			}

			if(!this._activeFashionEndTime[info.roleIdx_I]){
				this._activeFashionEndTime[info.roleIdx_I] = {};
			}
			for(let i = 0; i < info.fashionEndDt.key_I.length; i++){
				this._activeFashionEndTime[info.roleIdx_I][info.fashionEndDt.key_I[i]] = info.fashionEndDt.value_I[i];//TODO 时间待处理
			}

		}
	}

	public updateFashion(fashion: any): void{
		if(!this._activeInfo[fashion.roleIdx_I]){
			this._activeInfo[fashion.roleIdx_I] = {};
		}
		this._activeInfo[fashion.roleIdx_I][fashion.type_I] = fashion;

		if(!this._activeFashionStar[fashion.roleIdx_I]){
			this._activeFashionStar[fashion.roleIdx_I] = {};
		}
		let activeCode:number = 0;
		let roleIndex:number = 0;
		for(let i = 0; i < fashion.fashionDict.key_I.length; i++){
			let fashionCode:number = fashion.fashionDict.key_I[i];
			let state:number = fashion.fashionDict.value_I[i];
			if(!this._activeFashionStar[fashion.roleIdx_I][fashionCode] && state) {
				activeCode = fashionCode;
				roleIndex = fashion.roleIdx_I;
			}
			this._activeFashionStar[fashion.roleIdx_I][fashionCode] = state;
		}
		if(activeCode > 0) {
			EventManager.dispatch(LocalEventEnum.OpenUpgradeSuccessView,{fashionType:fashion.type_I,roleIndex:roleIndex,fashionCode:activeCode});
		}

		if(!this._activeFashionEndTime[fashion.roleIdx_I]){
			this._activeFashionEndTime[fashion.roleIdx_I] = {};
		}
		for(let i = 0; i < fashion.fashionEndDt.key_I.length; i++){
			this._activeFashionEndTime[fashion.roleIdx_I][fashion.fashionEndDt.key_I[i]] = fashion.fashionEndDt.value_I[i];//TODO 时间待处理
		}
	}

	public getFashionByRoleAndType(roleIndex: number, type: EFashionType): any{
		if(this._activeInfo[roleIndex] && this._activeInfo[roleIndex][type]){
			return this._activeInfo[roleIndex][type];
		}
		return null;
	}

	/**
	 * 时装等级（0为未激活）
	 */
	public getFashionStar(roleIndex: number, code: number): number{
		if(this._activeFashionStar[roleIndex] && this._activeFashionStar[roleIndex][code]){
			return this._activeFashionStar[roleIndex][code];
		}
		return 0;
	}

	public isFashionActived(roleIndex: number, code: number): boolean{
		if(this._activeFashionStar[roleIndex] && this._activeFashionStar[roleIndex][code]){
			return true;
		}
		return false;
	}

	//TODO 时间需要处理
	public getFashionEndTime(roleIndex: number, code: number): number{
		if(this._activeFashionEndTime[roleIndex] && this._activeFashionEndTime[roleIndex][code]){
			return this._activeFashionEndTime[roleIndex][code];
		}
		return 0;
	}

	public isCurFashion(roleIndex: number, type: number, code: number): boolean{
		if(this._activeInfo[roleIndex] && this._activeInfo[roleIndex][type]){
			if(this._activeInfo[roleIndex][type].equipFashion_I == code){
				return true;
			}
		}
		return false;
	}
	
	public setPlayerModel(modelDict: any, fashionType: number): void{
		if(!this.playerModel){
			this.playerModel = {};
		}
		for(let i = 0; i < CacheManager.role.roles.length; i++){
			if(!this.playerModel[i]){
				this.playerModel[i] = {};
			}
			let career: number = CareerUtil.getBaseCareer(CacheManager.role.getRoleCareerByIndex(i));
			let showType: EEntityAttribute = this.getModelShowType(fashionType);
			this.playerModel[i][showType] = modelDict[career];
		}
	}

	public getPlayerModel(roleIndex: number): any{
		if(!this.playerModel){
			this.playerModel = {};
		}
		if(!this.playerModel[roleIndex]){
			this.playerModel[roleIndex] = {};
		}
		if(!this.playerModel[roleIndex][EEntityAttribute.EAttributeClothes]){
			this.playerModel[roleIndex][EEntityAttribute.EAttributeClothes] = CacheManager.role.getModelId(EEntityAttribute.EAttributeClothes,roleIndex);
		}
		if(!this.playerModel[roleIndex][EEntityAttribute.EAttributeWeapon]){
			this.playerModel[roleIndex][EEntityAttribute.EAttributeWeapon] = CacheManager.role.getModelId(EEntityAttribute.EAttributeWeapon,roleIndex);
		}
		if(!this.playerModel[roleIndex][EEntityAttribute.EAttributeWing]){
			this.playerModel[roleIndex][EEntityAttribute.EAttributeWing] = CacheManager.role.getModelId(EEntityAttribute.EAttributeWing,roleIndex);
		}
		return this.playerModel[roleIndex];
	}

	public resetPlayerModel(): void{
		this.playerModel = {};
	}

	 private getModelShowType(type:EFashionType):EEntityAttribute{        
		return ShapeUtils.getFashionAttrType(type);
    }

	/**
	 * @param fashionData t_mg_fashion表数据
	 */
	public checkTipsByIndexAndData(roleIndex: number, fashionData: any): boolean{
		if(this.isFashionActived(roleIndex, fashionData.code)){//是否激活
			if(this.getFashionStar(roleIndex, fashionData.code) == ConfigManager.mgFashionStar.getMaxStar(fashionData.code)){
				return false;//等级达到最大
			}
		}
		if(CacheManager.pack.propCache.getItemCountByCode2(fashionData.propCode) > 0){
			return true;//有道具可激活或升级
		}
	}

	public checkTipsByIndexAndType(roleIndex: number, type: EFashionType): boolean{
		let fashionData: any[] = ConfigManager.mgFashion.getFashionByType(type);
		for(let fashion of fashionData){
			if(this.checkTipsByIndexAndData(roleIndex, fashion)){
				return true;
			}
		}
		return false;
	}

	public checkTipsByType(type: EFashionType): boolean{
		for(let i = 0; i < CacheManager.role.roles.length; i++){
			if(this.checkTipsByIndexAndType(i, type)){
				return true;
			}
		}
		return false;
	}

	public checkFashionTips(): boolean{
		let types: EFashionType[] = [EFashionType.EFashionClothes, EFashionType.EFashionWeapon, EFashionType.EFashionWing];
		for(let type of types){
			if(this.checkTipsByType(type)){
				return true;
			}
		}
		return false;
	}

	public checkTips(): void{
		
	}

	public clear(): void {

	}


}