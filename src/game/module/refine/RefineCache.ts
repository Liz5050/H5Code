class RefineCache implements ICache{
	/**是否在一键强化中 */
	public isOneKeyStrengthening:boolean = false;

	/**洗练剩余免费次数 */
	public refreshFreeTime: number = 0;

	/**
	 * 所有装备强化信息
	 */
	private _strengthenDict:any;

	public constructor() {
	}

	/**
	 * 功能是否开放了
	 */
	public isOpen():boolean{
		let openLevel:number = ConfigManager.mgOpen.getByPk(10).openLevel;
		return CacheManager.role.getRoleLevel() >= openLevel;
	}

	/**
	 * 某个装备是否可以强化
	 * @param needTip 是否需要提示
	 */
	public isCanStrengthen(itemData:ItemData, needTip:boolean=true):boolean{
		if(itemData){
			if(itemData.isStrengthenMax()){
				if(needTip){
					Tip.showTip("已强化至当前装备最高等级");
				}
				return false;
			}
			let conf:any = ConfigManager.mgStrengthen.getByTypeAndLevel(itemData.getType(), itemData.getStrengthenLevel());
			if(Number(CacheManager.role.money.coinBind_L64) < conf.useCoin){
				if(needTip){
					Tip.showTip("铜钱不足，无法提升");
				}
				return false;
			}
			return true;
		}
		return false;
	}

	/**
	 * 是否可以强化
	 */
	public checkStrengthen(): boolean{
		let itemDatas: Array<ItemData> = this.getStrengthenEquips();
		let isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.WeaponStrengthen,false);
		if(isOpen && itemDatas.length > 0){
			for(let itemData of itemDatas){
				if(this.isCanStrengthen(itemData, false)){
					return true;
				}
			}
		}
		return false; 
	}

	/**
	 * 设置玩家所有装备强化信息
	 * @param data SDictSeqInt
	 */
	public set strengthDict(data:any){
		this._strengthenDict = {};
		//key_I为装备类型，//value为[强化等级,幸运值]
		this._strengthenDict[data.dictSeq.key_I] = data.dictSeq.value;
	}

	/**
	 * key_I为装备类型，value为[强化等级,幸运值]
	 */
	public get strengthenDict():any{
		return this._strengthenDict;
	}

	/**
	 * 获取可强化装备
	 */
	public getStrengthenEquips():Array<ItemData>{
		let data:Array<ItemData> = [];
		var all: Array<ItemData> = CacheManager.pack.rolePackCache.getByC(ECategory.ECategoryEquip);
		for(let itemData of all){
			if(itemData.getType() < EEquip.EEquipSpirit){//守护以下装备都不能强化
				data.push(itemData);
			}
		}
		return data;
	}

	/**
	 * 是否可以镶嵌宝石
	 */
	public checkInlayTip(): boolean{
		let isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.JewelEmbel,false);
		if(isOpen){
			for(let i = 1; i < EDressPos.EDressPosSpirit; i++){
				let itemData: ItemData = CacheManager.pack.rolePackCache.getItemAtIndex(i);
				if(itemData && Number(itemData) != ItemDataEnum.locked && this.isCanInlay(itemData)){
					return true;
				}
			}
		}
		return false;
	}

	/**某个装备是否可镶嵌或替换宝石 */
	public isCanInlay(itemData: ItemData): boolean{
		let stoneItems: Array<ItemData> = [];
		stoneItems = CacheManager.pack.backPackCache.getByCT(ECategory.ECategoryJewel, itemData.getStoneColor());
		if(stoneItems.length > 0){
			for(let stoneItem of stoneItems){
				if(stoneItem.getItemLevel() > itemData.getStoneMinLevel()){
					return true;
				}
			}
		}
		return false;
	}

	/**是否有免费洗炼次数 */
	public isCanRefreshFree(): boolean{
		if(this.refreshFreeTime > 0 && CacheManager.role.playerLevelWhen3State != 0){
		// if(this.refreshFreeTime > 0){
			return true;
		}
		return false;
	}

	public checkTips(): boolean{
		if(this.checkStrengthen() || this.isCanRefreshFree() || this.checkInlayTip()){
             return true;
        }
		return false;
	}

	public clear():void{
		
	}
}