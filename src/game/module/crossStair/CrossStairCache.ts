class CrossStairCache extends ActivityWarfareCache implements ICache {
	private _stairInfo:any;
	private _rankInfos:any[];
	public rewardSuccess:boolean = true;
	public constructor() {
		super();
		this.iconId = IconResId.CrossStair;
	}

	public updateOpenInfo(data:any):void {
		super.updateOpenInfo(data);
		if(!data) {
			this._stairInfo = null;
			this._rankInfos = null;
		}
	}

	public updateStairInfo(data:any):void {
		if(!this._stairInfo) {
			this._stairInfo = data;
		}
		this._stairInfo.floor_I = data.floor_I;
		this._stairInfo.killNum_I = data.killNum_I;
		this._stairInfo.lastAcceptedFloor_I = data.lastAcceptedFloor_I;
		this._stairInfo.continuityKill_I = data.continuityKill_I;
		CacheManager.copy.combo = data.continuityKill_I;
		EventManager.dispatch(NetEventEnum.CrossStairInfoUpdate);
	}

	public updateStairRank(ranks:any[]):void {
		this._rankInfos = ranks;
		EventManager.dispatch(NetEventEnum.CrossStairRankInfoUpdate);
	}

	public updateFloorRewardState():void {
		this._stairInfo.lastAcceptedFloor_I += 1;
		this.rewardSuccess = true;
		EventManager.dispatch(NetEventEnum.CrossStairFloorRewardSuccess);
	}

	public hadGet(floor:number):boolean {      
		if(!this.stairInfo) return false;
		return floor <= this.stairInfo.lastAcceptedFloor_I;
	}

	/**
	 * 是否通关 
	 * (预留接口，防止策划需要在玩家通关后把活动图标，界面红点干掉)
	 */
	public get isComplete():boolean {
		let floor:number = 0;
		let killNum:number = 0;
		if(this._stairInfo) {
			floor = this._stairInfo.floor_I;
			killNum = this._stairInfo.killNum_I;
		}
		let floorCfg:any = ConfigManager.crossStair.getByPk(floor);
		if(floorCfg) return floorCfg.floor >= 9 && killNum >= floorCfg.killNum;
		return false;
	}

	public checkTips():boolean {
		return this.isOpen && !this.isComplete && !CacheManager.copy.isInCopyByType(ECopyType.ECopyCrossStair);
	}

	public get stairInfo():any {
		return this._stairInfo;
	}

	public get rankInfos():any[] {
		return this._rankInfos;
	}

	public clear():void {
		super.clear();
		this._stairInfo = null;
		this._rankInfos = null;
	}
}