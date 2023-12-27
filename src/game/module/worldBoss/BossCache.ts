class BossCache implements ICache {

	public reviveCityEnd:number = 0;

	protected _followBoss: number[];
	protected _bossList: any;
	public constructor() {
		this._followBoss = [];
		this._bossList = {};
	}
	protected checkFollow(): void {
		for (let bossCode of this._followBoss) {
			var dt: number = this.getBossDt(bossCode);
			var serTime: number = CacheManager.serverTime.getServerTime();
			if(dt>serTime && dt-serTime==60){
				//通知
				EventManager.dispatch(LocalEventEnum.BossRefrishNotice,bossCode);
			}
		}
	}
	/**
	 * 关注某个boss
	 */
	public setFollowBoss(bossId: number, isFollow: boolean): void {
		if (isFollow) {
			this._followBoss.push(bossId);
		} else {
			var i: number = this._followBoss.indexOf(bossId);
			i > -1 ? this._followBoss.splice(i, 1) : null;
		}

		var isRun: boolean = App.TimerManager.isExists(this.checkFollow, this);
		if (this._followBoss.length > 0) {
			!isRun ? App.TimerManager.doTimer(1000, 0, this.checkFollow, this) : null;
		} else if (isRun) {
			App.TimerManager.remove(this.checkFollow, this);
		}

	}

	public isFollowBoss(bossCode: number): boolean {
		return this._followBoss.indexOf(bossCode) > -1;

	}

	public setBossList(data: any,isUpdate:boolean): void {
		if (!isUpdate) {			
			//初始化
			this._bossList = null;
			this._bossList = {};
			var keys: number[] = data.key_I;
			var len: number = keys.length;
			for (var i: number = 0; i < len; i++) {
				this._bossList[keys[i]] = data.value[i]; //SIntBoolDate
			}

		} else {
			//更新
			this._bossList[data.val_I] = data; //SIntBoolDate
		}
	}

	/**
	 * 判断某个boss是否死亡
	 */
	public isBossDeath(bossId: number): boolean {
		if (this._bossList[bossId]) {
			return !this._bossList[bossId].bVal_B;
		}
		return false;
	}

	public isTire():boolean{
		var tire:number = CacheManager.role.role.tire_BY;
		return tire>=CopyEnum.TIRE_MAX_VALUE;
	}

	/**
	 * 判断某个boss 是否在刷新cd中
	 */
	public isBossCd(bossId: number): boolean {
		var dt: number = this.getBossDt(bossId);
		var serTime: number = CacheManager.serverTime.getServerTime();
		return dt >= serTime;
	}

	/**
	 * 获取boss刷新时间
	 */
	public getBossDt(bossId: number): number {
		if (this._bossList[bossId]) {
			var dt: number = this._bossList[bossId].dateVal_DT;
			return dt;
		}
		return 0;

	}
	public get bossList(): any {
		return this._bossList;
	}

	/**回城复活cd中 */
	public isCityReviveCd():boolean{
		var sec:number = this.reviveCityEnd - egret.getTimer();
		return sec>0;
	}

	public clear(): void {

	}
}