class CampBattleCache extends ActivityWarfareCache {

	private _myScore:number = 0;
	private _myRank:number = 0;
	private _scoreInfos:any[];
	private _hadGetList:number[] = [];

	public isCross:boolean = false;
	public constructor() {
		super();
		this.iconId = IconResId.CampBattle;
	}

	/**
	 * 更新阵营积分列表
	 */
	public updateScoreList(data:any):void {
		this._scoreInfos = data.scoreList.data;
		for(let i:number = 0; i < this._scoreInfos.length; i ++) {
			this._scoreInfos[i].rank = i+1;
		}
		this._myRank = data.myRank_I;
		this._myScore = data.myScore_I;
		EventManager.dispatch(NetEventEnum.CampBattleScoreListUpdate);
	}

	/**
	 * 更新积分奖励已领取列表
	 */
	public updateHadGetList(data:any):void {
		this._hadGetList = data;
		EventManager.dispatch(NetEventEnum.CampBattleScoreRewardUpdate);
	}

	public updateMyScore(score:number):void {
		this._myScore += score;
		EventManager.dispatch(NetEventEnum.CampBattleScoreListUpdate);
	}

	/**
	 * 积分奖励是否已领取
	 */
	public hadGet(score:number):boolean {
		return this._hadGetList.indexOf(score) != -1;
	}

	public get myScore():number {
		return this._myScore;
	}

	public get myRank():number {
		return this._myRank;
	}

	/**
	 * 积分排名列表
	 */
	public get scoreInfos():any[] {
		return this._scoreInfos;
	}

	/**下次阵营交换时间 */
	public get exchangeTime():number {
		if(!this.openInfo) {
			return 0;
		}
		let passTime:number = CacheManager.serverTime.getServerTime() - this.openInfo.openDt_DT;
		
		let time:number = 300;
		let changeTime:number = 300;
		if(changeTime <= passTime) {
			//第一轮交换时间已过
			changeTime += time;
		}
		return changeTime - passTime;
	}

	public clear():void {
		super.clear();
		this.isCross = false;
	}
}