class ActivityInfo {
	/**活动编码 */
	public code:number;
	/**活动归属图标分类 */
	public category:ActivityCategoryEnum;
	/**活动类型 */
	public type:ESpecialConditonType;
	/**开始时间 */
	public startDt:number;
	/**结束时间 */
	public endDt:number;
	/**领奖开始时间 */
	public getStartDt:number;
	/**领奖结束时间 */
	public getEndDt:number;
	public title:string;
	public context:string;
	/**条件与奖励 */
	public rewardInfos:ActivityRewardInfo[];
	/**特殊标记（与ESpecialFlag相对应） */
	public flag:number;

	// int code;                           //活动编码
	// int type;                           //活动类型
	// date startDt;                        //开始时间
	// date endDt;                           //结束时间
	// date getStartDt;                     //领奖开始时间
	// date getEndDt;                        //领奖结束时间
	// string title;                        //主题
	// string context;                        //描述
	// SeqSpecialActiveCondAndReward seqCondAndReward;   //条件与奖励
	// int flag;                           //特殊标记（与ESpecialFlag相对应）
	/**对应活动图标是否初始化 */
	private _iconInit:boolean = false;
	private _openDate:Date;
	public constructor() {
	}

	public parseData(data:any):void {
		this._iconInit = false;
		this.code = data.code_I;
		this.category = data.category_I;
		this.type = data.type_I;
		this.startDt = data.startDt_DT;
		this._openDate = new Date(this.startDt * 1000);
		this._openDate.setHours(0);
		this._openDate.setMinutes(0);
		this._openDate.setSeconds(0);

		this.endDt = data.endDt_DT;
		this.getStartDt = data.getStartDt_DT;
		this.getEndDt = data.getEndDt_DT;
		this.title = data.title_S;
		this.context = data.context_S;
		let rewards:any[] = data.seqCondAndReward.data;
		this.rewardInfos = [];
		for(let i:number = 0; i < rewards.length; i++) {
			let rewardInfo:ActivityRewardInfo = new ActivityRewardInfo(this.code,this.type);
			rewardInfo.parseData(rewards[i],i);
			this.rewardInfos.push(rewardInfo);
		}
		this.flag = data.flag_I;
	}

	public get iconInit():boolean{
		return this._iconInit;
	}

	public set iconInit(value:boolean) {
		this._iconInit = value;
	}

	/**
	 * 活动是否开启（仅检测时间）
	 * 部分活动开启条件特殊处理
	 */
	public isOpenByTime():boolean {
		if(this.category == ActivityCategoryEnum.ActivityLimitRecharge) {
			if(!CacheManager.recharge.isFirstRecharge()) {
				//限时充值活动优先判断是否首充过，首充过才开启
				return false;
			}
		}
		else if(this.category == ActivityCategoryEnum.ActivityInvest) {
			//投资活动
			if((!CacheManager.activity.hasInvested && this.openedDay > 8)) {
				//未参加投资活动，并且开启时间已经超过8天
				return false;
			}
		}
		let serverTime:number = CacheManager.serverTime.getServerTime();
		return this.startDt <= serverTime && this.endDt > serverTime;
	}

	/**
	 * 活动是否开启（包含是否领取所有奖励的判断）
	 */
	public get isOpen():boolean {
		if(!this.isOpenByTime()) return false;
		if(CacheManager.activity.isComplete(this)) {
			return false;
		}
		return true;
	}

	/**
	 * 检测活动是否在可领奖时间内
	 */
	public get checkGetTime():boolean {
		let serverTime:number = CacheManager.serverTime.getServerTime();
		return this.getStartDt <= serverTime && this.getEndDt > serverTime;
	}

	/**
	 * 活动是否过期
	 */
	public get isOverTime():boolean {
		let serverTime:number = CacheManager.serverTime.getServerTime();
		if(this.category == ActivityCategoryEnum.ActivityInvest && !this.isOpen) {
			//投资活动未开启即为失效，实际活动时间没有失效
			return true;
		}
		return this.endDt <= serverTime;
	}

	/**
	 * 获取活动剩余时间（秒）
	 */
	public get leftTime():number {
		let serverTime:number = CacheManager.serverTime.getServerTime();
		return this.endDt - serverTime;
	}

	/**获取显示上的剩余时间，与实际剩余时间无关 */
	public get leftShowTime():number {
		let time:number = 0;
		if(this.category == ActivityCategoryEnum.ActivityInvest && !CacheManager.activity.hasInvested) {
			time = 8 * 24 * 60 * 60 - this.openedSec;//投资计划倒计时显示最大8天,已投资不显示倒计时
		}
		else if(this.type == ESpecialConditonType.ESpecialConditonTypeToplistActiveOpen) {
			time = this.leftTime - 3600;//冲榜排名提前1小时，显示活动已结束
		}
		else if(this.type == ESpecialConditonType.ESpecialConditonTypeRechargeToday) {
			time = Math.round(CacheManager.serverTime.getTodayLeftTime() / 1000);
		}
		return time;
	}

	/**
	 * 获取活动已进行了多少天
	 */
	public get openedDay():number {
		if(!this._openDate) return 0;
		let day:number = Math.floor(this.openedSec / 60 / 60 / 24) + 1;
		return day;
	}

	/**
	 * 是否在活动的某些天数区间内
	 * @param minDay 最小天数
	 * @param maxDay 最大天数
	 */
	public isBetween(minDay:number,maxDay:number):boolean{
		let sec:number = CacheManager.serverTime.getServerTime();//服务器时间
		let overSec:number = sec - this.startDt; //已过去的时间 daySec
		let daySec:number = 86400; //1天的秒数
		minDay = Math.max(minDay-1,0)
		return overSec>=minDay*daySec && overSec<daySec*maxDay;
	}

	/**
	 * 获取活动已进行了多少秒
	 */
	public get openedSec():number {
		let sec:number = CacheManager.serverTime.getServerTime() - Math.floor(this._openDate.getTime() / 1000);
		return sec;
	}

	public get iconId():number {
		if(this.category == ActivityCategoryEnum.ActivityNormal) {
			return Number(this.context);
		}
		let categoryName:string = ActivityCategoryEnum[this.category];
		return IconResId[categoryName];
	}

	public get openDate():Date {
		return this._openDate;
	}
}