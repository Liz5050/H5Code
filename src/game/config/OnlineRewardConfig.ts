class OnlineRewardConfig extends BaseConfig {
	private dayCfgs:any[];//每日在线奖励（每日重置）
	private onceCfg:any;//一次性奖励（只可领取一次）
	public constructor() {
		super("t_online_rewards","type,onlineMinute");
	}

	public getDayOnlineRewardCfgs():any[] {
		if(!this.dayCfgs) {
			this.dayCfgs = [];
			let dict:any = this.getDict();
			for(let key in dict) {
				if(dict[key].type == 2) {
					this.dayCfgs.push(dict[key]);
				}
			}
		}
		return this.dayCfgs;
	}

	public getOnceOnlineRewardCfg():any {
		if(!this.onceCfg) {
			let dict:any = this.getDict();
			for(let key in dict) {
				if(dict[key].type == 1) {
					this.onceCfg = dict[key];
					break;
				}
			}
		}
		return this.onceCfg;
	}
}