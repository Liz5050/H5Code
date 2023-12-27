class ShareRewardConfig extends BaseConfig{
	private typeDict:any;
	public constructor() {
		super("t_share_reward","id");
		this.typeDict = {};
	}

	public getByType(type:EShareRewardType):any{
		if(!this.typeDict[type]){	
			let dict:any = this.getDict();
			for(let key in dict){
				if(dict[key].type==type){
					this.typeDict[type] = dict[key];
					break;
				}
			}
		}
		return this.typeDict[type];
	}

	public getRewardByType(type:EShareRewardType):ItemData[]{
		let info:any = this.getByType(type);
		let rewards:ItemData[] = [];
		if(info){
			rewards = RewardUtil.getStandeRewards(info.rewardStr);
		}
		return rewards;
	}

}