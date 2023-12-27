class ExpPosOccupyCache extends ActivityWarfareCache {
	private _occupyInfos:any[];
	private _myOccupyInfo:any;

	private _rankInfos:any[];
	private _myRank:number = 0;
	private _myExp:number = 0;
	public constructor() {
		super();
		this.iconId = IconResId.ExpPositionOccupy;
	}

	public updateOccupyInfos(data:any[]):void {
		this._occupyInfos = data;
		// optional SEntityId entityId = 1;
		// optional string name_S = 2;
		// optional string guildName_S = 3;
		// optional int32 posId_I = 4;
	}

	public get occupyInfos():any[] {
		return this._occupyInfos;
	}

	public getOccupyInfo(posId:number):any {
		if(!this._occupyInfos) return;
		for(let i:number = 0; i < this._occupyInfos.length; i++) {
			if(this._occupyInfos[i].posId_I == posId) {
				return this._occupyInfos[i];
			}
		}
		return null;
	}

	/**
	 * 更新自己占领信息
	 */
	public updateSelfOccupyInfo(data:any):void {
		//  optional int32 posId_I = 1;
		// optional int64 totalExp_L64 = 2;
		this._myOccupyInfo = data;
	}

	public get myOccupyInfo():any {
		return this._myOccupyInfo
	}

	public get expColor():number {
		if(!this.myOccupyInfo) return 0xf2e1c0;
		let occupyCfg:any = ConfigManager.expPosition.getByPk(this.myOccupyInfo.posId_I);
		if(!occupyCfg) {
			return 0xf2e1c0;
		}
		if(!Color.expOccupyTips[occupyCfg.expTimes]) {
			return 0xf2e1c0;
		}
		return Color.expOccupyTips[occupyCfg.expTimes];
	}

	public get copyCode():number {
		if(!this.openInfo) return 0;
		return this.openInfo.copyCode_I;
	}

	/**
	 * 更新排行榜信息
	 * SEntityId entityId = 1;
	 * string name_S = 2;
	 * string guildName_S = 3;
	 * int64 exp_L64 = 4;
	 */
	public updateRankInfos(data:any):void {
		this._rankInfos = data.ranks.data;
		for(let i:number = 0; i < this._rankInfos.length; i++) {
			if(EntityUtil.isMainPlayer(this._rankInfos[i].entityId)) {
				this._myRank = i + 1;
				this._myExp = this._rankInfos[i].exp_L64;
				break;
			}
		}
		EventManager.dispatch(NetEventEnum.ExpPositionRankListUpdate);
	}

	public get rankInfos():any[] {
		return this._rankInfos;
	}

	public get myRank():number {
		return this._myRank;
	}

	public get myExp():number {
		if(!this.myOccupyInfo) return 0;
		return this.myOccupyInfo.totalExp_L64;
	}
}