class ActivityRewardInfo {
	private _code:number;
	private _type:ESpecialConditonType;
	public index:number;
	/**条件对应t_active_special_config */
	public conds:number[];
	public rewards:any[];

	private itemDatas:ItemData[];
	public constructor(code:number,type:ESpecialConditonType) {
		this._code = code;
		this._type = type;
	}

	public parseData(data:any,index:number):void {
		this.index = index;
		this.conds = data.conds.data_I;
		this.rewards = data.rewards.data;
	}

	public getItemDatas():ItemData[] {
		if(!this.itemDatas) {
			this.itemDatas = [];
			for(let i:number = 0; i < this.rewards.length; i++) {
				let rewardStr:string = this.rewards[i].type_I + "," + this.rewards[i].code_I + "," + Number(this.rewards[i].num_L64);
				let itemData:ItemData = RewardUtil.getReward(rewardStr);
				this.itemDatas.push(itemData);
			}
		}
		return this.itemDatas;
	}

	/**
	 * 已领取次数
	 */
	public get hadGetCount():number {
		let getRewarInfo:number[] = CacheManager.activity.getActivityGetRewardInfo(this.code);
		if(!getRewarInfo || getRewarInfo.length == 0 || getRewarInfo.length <= this.index) {
			return 0;
		}
		return getRewarInfo[this.index];
	}

	public get type():ESpecialConditonType {
		return this._type;
	}

	public get code():number {
		return this._code;
	}

	/**
	 * 冲榜达标对应类型的达标值
	 */
	public getTargetValues():any[] {
		let type:EReachGoalActiveType = this.conds[1];
		let value:number = 0;
		let values:any[] = [0];
		let myValueStr:string = "";
		switch(type) {
			case EReachGoalActiveType.EReachGoalActiveTypeLevel:
				let roleState:number = CacheManager.role.getRoleState();
				let level:number = CacheManager.role.getRoleLevel();
				value = roleState * 10000 + level;
				if(roleState > 0) {
					myValueStr = roleState + "转" + level + "级";
				}
				else {
					myValueStr = level + "级";
				}
				values = [value,"等  级","我的等级：" + "<font color='#fea700'>" + myValueStr + "</color>"];
				break;
			case EReachGoalActiveType.EReachGoalActiveTypeCastTotalLevel:
				value = CacheManager.role.getPlayerStrengthenExTotalLv(EStrengthenExType.EStrengthenExTypeCast);
				values = [value,"总等级","我的铸造总等级：" + "<font color='#fea700'>" + value + "</color>"];
				break;
			case EReachGoalActiveType.EReachGoalActiveTypeDragonSoulTotalState:
				value = CacheManager.role.getPlayerStrengthenExTotalLv(EStrengthenExType.EStrengthenExTypeDragonSoul);
				values = [value,"总等级","我的龙炎甲总星数：" + "<font color='#fea700'>" + value + "</color>"];
				break;
			case EReachGoalActiveType.EReachGoalActiveTypeWingTotalState:
				value = CacheManager.role.getPlayerStrengthenExTotalLv(EStrengthenExType.EStrengthenExTypeWing);
				values = [value,"总等级","我的翅膀总等级：" + "<font color='#fea700'>" + value + "</color>"];
				break;
			case EReachGoalActiveType.EReachGoalActiveTypeEquipTotalScore:
				value = CacheManager.pack.rolePackCache.getAllEquipedScore();
				values = [value,"总评分","我的装备总评分：" + "<font color='#fea700'>" + value + "</color>"];
				break;
			case EReachGoalActiveType.EReachGoalActiveTypeIllustrated:
				value = CacheManager.cultivate.getCultivateFight(ECultivateType.ECultivateTypeIllustrated);
				values = [value,"总战力","我的图鉴总战力：" + "<font color='#fea700'>" + value + "</color>"];
				break;
			case EReachGoalActiveType.EReachGoalActiveTypeWarfare:
				value = CacheManager.role.combatCapabilities;
				values = [value,"总战力","我的总战力：" + "<font color='#fea700'>" + value + "</color>"];
				break;
			case EReachGoalActiveType.EReachGoalActiveTypeRecharge:
				value = CacheManager.activity.rankRechargeNum;
				values = [value,"充值元宝","已充值元宝：" + "<font color='#fea700'>" + value + "</color>"];
				break;
			case EReachGoalActiveType.EReachGoalActiveTypePetLevel:
				value = CacheManager.pet.level < 0 ? 0 : CacheManager.pet.level;
				values = [value,"等  级","我的宠物等级：" + "<font color='#fea700'>" + value + "</color>"];
				break;
		}
		return values;
	}
}