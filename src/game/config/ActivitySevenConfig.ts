class ActivitySevenConfig extends BaseConfig {
	private dayCfgs:{[day:number]:any};
	private dayShowIndex:{[day:number]:number[]};
	private days:number[];

	/**七日狂欢积分奖励配置 */
	private targetRewardCfg:BaseConfig;
	/**双生乐园活动副本配置 */
	private lostCopyCfg:BaseConfig;
	/**累充返利配置 */
	private rechargeRebate:BaseConfig;
	/**特惠礼包信息配置 */
	private preferentialGift:BaseConfig;

	private lostMaxNum:number = 0;
	private targetCfgs:any[];
	private _maxScore:number = -1;
	public constructor() {
		super("t_activity_config","id");
		this.targetRewardCfg = new BaseConfig("t_activity_target_reward","target");
		this.lostCopyCfg = new BaseConfig("t_active_paradies_lost","num"); //id和num一样的 不会重复
		this.rechargeRebate = new BaseConfig("t_mg_compose_recharge_active","code,day");
		this.preferentialGift = new BaseConfig("t_preferential_gift_info","id");

	}

	private praseCfg():void {
		if(!this.dayCfgs) {
			this.dayCfgs = {};
			this.dayShowIndex = {};
			this.days = [];
			let dict:any = this.getDict();
			for(let id in dict) {
				let openDay:number = dict[id].openDay;
				let dayDict:{[day:number]:any} = this.dayCfgs[openDay];
				if(!dayDict) {
					this.dayShowIndex[openDay] = [];
					dayDict = {};
					this.dayCfgs[openDay] = dayDict;
				}
				let showIndex:number = dict[id].showIndex;
				if(!dayDict[showIndex]) {
					dayDict[showIndex] = [];
				}
				dayDict[showIndex].push(dict[id]);

				if(this.dayShowIndex[openDay].indexOf(showIndex) == -1) {
					this.dayShowIndex[openDay].push(showIndex);
					this.dayShowIndex[openDay].sort(function sortIndex(index1:number,index2:number):number {
						return index1 - index2;
					});
				}
				if(this.days.indexOf(openDay) == -1) {
					this.days.push(openDay);
				}
			}
			this.days.sort(function sortDay(day1:number,day2:number):number {
				return day1 - day2;
			})
		}
	}

	private parseTargetCfg():void {
		if(!this.targetCfgs) {
			this.targetCfgs = [];
			this._maxScore = 0;
			let dict:any = this.targetRewardCfg.getDict();
			for(let key in dict) {
				this.targetCfgs.push(dict[key]);
				if(this._maxScore < dict[key].target) {
					this._maxScore = dict[key].target;
				}
				// this._totalScore += dict[key].target;
			}
		}
	}

	public getDayCfgs():number[] {
		if(!this.days) {
			this.praseCfg();
		}
		return this.days;
	}

	public getDayTypes(day:number):number[] {
		if(!this.dayShowIndex) {
			this.praseCfg();
		}
		return this.dayShowIndex[day];
	}

	public getTaskItemCfgs(day:number,showIndex:number):any[] {
		if(!this.dayCfgs) {
			this.praseCfg();
		}
		return this.dayCfgs[day][showIndex];
	}

	/**
	 * 七日狂欢积分奖励配置
	 */
	public getScoreRewardCfgs():any[] {
		if(!this.targetCfgs) {
			this.parseTargetCfg();
		}
		return this.targetCfgs;
	}

	/**
	 * 七日狂欢积分奖励总积分
	 */
	public get maxScore():number {
		if(this._maxScore == -1) {
			this.parseTargetCfg();
		}
		return this._maxScore;
	}

	/**获取双生副本的配置 */
	public getLostCopyInfoCfg(num:number):any{
		return this.lostCopyCfg.getByPk(num);
	}

	/**获取双乐园副本显示的星级数字 */
	public getLostStarNumPng(info:any):string{
		if(typeof(info)=="number"){
			info = this.getLostCopyInfoCfg(info);
		}
		let url:string = URLManager.getModuleImgUrl(`lost_cp/${info.sourceId}.png`,PackNameEnum.Activity);
		return url; 
	}

	public getLostMaxNum():number{
		if(this.lostMaxNum==0){
			this.lostMaxNum++;
			let info:any = this.getLostCopyInfoCfg(this.lostMaxNum);
			while(info){
				this.lostMaxNum++;
				info = this.getLostCopyInfoCfg(this.lostMaxNum);
			}
			this.lostMaxNum--;
		}
		return this.lostMaxNum;
	}	

	/**
	 * 获取每日充值返利配置
	 */
	public getDayRechargeRebateCfg(code:number,day:number):any {
		return this.rechargeRebate.getByPk(code + "," + day);
	}

	/**
	 * 获取七日累充返利配置
	 */
	public getSevenRechargeCfg(code:number):any {
		return this.rechargeRebate.getByPk(code + ",-1");
	}

	public getPreferentialGiftCfg(id:number):any {
		return this.preferentialGift.getByPk(id);
	}
}