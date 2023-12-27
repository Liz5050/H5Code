/**
 * 天天返利活动配置
 */
class RechargeRebateConfig extends BaseConfig {
	private _exRewardCfgs:{[code:number]:any[]};
	private _exRewardCodes:number[];
	private roundCfgs:{[round:number]:any[]};

	private holidayRecharge:BaseConfig;
	private rechargeGroup:{[key:string]:any[]};
	private rechargeAmount:{[code:number]:number[]};
	public constructor() {
		super("t_mg_recharge_day_return","id");

		this.holidayRecharge = new BaseConfig("t_mg_compose_recharge_active_ex","code,id");
	}

	private parseRechargeCfg():void {
		if(!this.rechargeGroup) {
			this.rechargeGroup = {};
			this.rechargeAmount = {};
			let dict:any = this.holidayRecharge.getDict();
			for(let key in dict) {
				let cfg:any = dict[key];
				let rechargeKey:string = cfg.code + "_" + cfg.rechargeAmount;
				if(!this.rechargeGroup[rechargeKey]) {
					this.rechargeGroup[rechargeKey] = [];
				}
				// if(this.rechargeAmount.indexOf(cfg.rechargeAmount) == -1) this.rechargeAmount.push(cfg.rechargeAmount);
				if(!this.rechargeAmount[cfg.code]) {
					this.rechargeAmount[cfg.code] = [];
				}
				if(this.rechargeAmount[cfg.code].indexOf(cfg.rechargeAmount) == -1) this.rechargeAmount[cfg.code].push(cfg.rechargeAmount);
				if(cfg.type == 2) {
					this.rechargeGroup[rechargeKey].unshift(cfg);
				}
				else {
					this.rechargeGroup[rechargeKey].push(cfg);
				}
			}
		}
	}

	public getRechargeAmounts(activityCode:number):number[] {
		if(!this.rechargeAmount) this.parseRechargeCfg();
		return this.rechargeAmount[activityCode];
	}

	public getRechargeList(activityCode:number,amount:number):any[] {
		if(!this.rechargeGroup) this.parseRechargeCfg();
		return this.rechargeGroup[activityCode + "_" + amount];
	}

	public getHolidayRechargeCfg(activityCode:number,id:number):any {
		return this.holidayRecharge.getByPKParams(activityCode,id);
	}

	private parseRoundCfg():void {
		this._exRewardCfgs = {};
		this.roundCfgs = {};
		this._exRewardCodes = [];
		let dict:any = this.getDict();
		for(let id in dict) {
			let list:any[] = this.roundCfgs[dict[id].round];
			if(!list) {
				list = [];
				this.roundCfgs[dict[id].round] = list;
			}
			list.push(dict[id]);

			if(dict[id].exRewards) {
				let exRewards:string[] = dict[id].exRewards.split("#");
				for(let i:number = 0; i < exRewards.length; i++) {
					let code:number = Number(exRewards[i].split(",")[1]);
					if(!this._exRewardCfgs[code]) {
						this._exRewardCfgs[code] = [];
						this._exRewardCodes.push(code);
					}
					this._exRewardCfgs[code].push(dict[id]);
				}
				// RewardUtil.getReward(dict[id].exRewards)
				// this._exRewardCfgs.push(dict[id]);
			}
		}
	}

	public getAllRewardsByRound(round:number):any[] {
		if(!this.roundCfgs) {
			this.parseRoundCfg();
		}
		return this.roundCfgs[round];
	}

	public get exRewardCodes():number[] {
		if(!this._exRewardCfgs) {
			this.parseRoundCfg();
		}
		return this._exRewardCodes;
	}

	public getExRewardsByCode(code:number):any[] {
		return this._exRewardCfgs[code];
	}
}