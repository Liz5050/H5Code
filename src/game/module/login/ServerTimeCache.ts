class ServerTimeCache implements ICache {
	public static TIME_ZONE:number = 8;

	private startTime: number = 0;
	private timePassed: number = 0;
	private lastTime:number;
	private timerCount:number = 0;

	private serverDate:Date;
	private todayDate:Date;
	private serverDateInfo:any;
	private _openDate:Date;
	private loginDay:number;//登录时的服务器天数

	private _onlineTime:number = 0;//在线时长（秒）
	private _totalOnlineTime:number = 0;//累计在线时长（秒）
	private _updateTime:number = 0;//在线时长更新时间点
	public constructor() {
		this.serverDate = new Date();
	}

	public startClock(secTime: number): void {
		App.TimerManager.remove(this.onTimer, this);
		App.TimerManager.doTimer(100,0,this.onTimer,this);
		this.startTime = secTime * 1000;
		this.timePassed = 0;
        this.lastTime = egret.getTimer();
        this.loginDay = this.getTotalDays();
        this.timerCount = 0;
	}

	/**
	 * 更新开服、合服时间信息
	 */
	public updateOpenServerDate(data:any):void {
		this.serverDateInfo = data;
		this._openDate = new Date(this.serverDateInfo.openDt_DT * 1000);
		this._openDate.setHours(0);
		this._openDate.setMinutes(0);
		this._openDate.setSeconds(0);
		EventManager.dispatch(NetEventEnum.OpenServerDateUpdate);
		
	}

	/**
	 * 更新今日在线时间(秒)
	 */
	public updateOnlineTime(timeArr:number[]):void {
		this._onlineTime = timeArr[0];
		this._totalOnlineTime = timeArr[1];
		this._updateTime = egret.getTimer();
		EventManager.dispatch(NetEventEnum.OnlineTimeTodayUpdate);
	}

	/**获取今日在线时长(秒) */
	public get onlineTime():number {
		return this._onlineTime + Math.round((egret.getTimer() - this._updateTime) / 1000);
	}

	/**获取创号至今的累积在线时长(秒) */
	public get totalOnlineTime():number {
		return this._totalOnlineTime + Math.round((egret.getTimer() - this._updateTime) / 1000);
	}

	/**
	 * 获取开服天数 
	 */
	public get serverOpenDay():number {
		if(!this._openDate) return 0;
		let sec:number = this.getServerTime() - Math.floor(this._openDate.getTime() / 1000);
		let day:number = Math.floor(sec / 60 / 60 / 24) + 1;
		return day;
	}

	public get openDate():Date {
		return this._openDate;
	}

	/**
	 * 获取服务器时间
	 * @returns 单位秒
	 */
	public getServerTime(): number {
		let curTime: number = (this.startTime + this.timePassed) / 1000;
		if (curTime <= 0) {
			curTime = (new Date().getTime())/1000;
		}
		return Math.ceil(curTime);
	}

	/**
	 * 获取服务器时间
	 * @returns 单位毫秒
	 */
	public getServerMTime(): number {
		let curTime: number = this.startTime + this.timePassed;
		if (curTime <= 0) {
			curTime = new Date().getTime();
		}
		return Math.ceil(curTime);
	}

	public getTotalDays(): number {
		return Math.floor((this.getServerTime() + ServerTimeCache.TIME_ZONE * 3600)/3600/24);
	}

	public getServerDate():Date {
		this.serverDate.setTime(this.getServerMTime());
		return this.serverDate;
	}

	/**
	 * 今日跨天剩余时间(毫秒) 
	 * 当前时间到明天 00:00:00的剩余时间
	 **/
	public getTodayLeftTime():number {
		let curTime:number = this.getServerMTime();
		if(!this.todayDate) {
			this.todayDate = new Date();
		}
		this.todayDate.setTime(curTime + 86400000);
		this.todayDate.setHours(0);
		this.todayDate.setMinutes(0);
		this.todayDate.setSeconds(0);
		return this.todayDate.getTime() - curTime;
	}

	private onTimer(): void {
        this.timerCount++;
		let now:number = egret.getTimer();
		let pass:number = now - this.lastTime;
		this.timePassed += pass;
        this.lastTime = now;
        if (this.timerCount % 10 == 0 && this.getTodayLeftTime() >= 86399100) {//跨天，派发事件
			EventManager.dispatch(LocalEventEnum.GameCrossDay);
		}
	}

	/**
	 * 获取当前时间到milliDt的间隔s，向上取整
	 * @param milliDt 时间戳
	 * @param isMilis 是否返回毫秒
	 */
	public getLeftSecsUtilDate(milliDt:number, isMilis:boolean = false):number {
        let curDt:number = CacheManager.serverTime.getServerMTime();
        return Math.ceil((milliDt - curDt) / (isMilis ? 1 : 1000));
	}

	public clear(): void {

	}
}