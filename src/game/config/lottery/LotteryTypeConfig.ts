class LotteryTypeConfig extends BaseConfig {
	public constructor() {
		super("t_lottery_type","type");
	}

	/**
	 * 根据分类获取符合当前等级的配置
	 */
	public getCurrentTypeConfig(category:LotteryCategoryEnum):any {
		let dict:any = this.getDict();
		let roleLv:number = CacheManager.role.getRoleLevel();
		if(category == LotteryCategoryEnum.LotteryRune) {
			let runeFloor:number = CacheManager.copy.getCopyProcess(CopyEnum.CopyTower);
			let runeCopyCfg:any = ConfigManager.mgRuneCopy.getByPk(runeFloor);
			return dict[runeCopyCfg.lotteryType];
		}else if(category == LotteryCategoryEnum.LotteryTower){			
			let subType:number = CacheManager.towerTurnable.lotteryType;
			return dict[subType];
		}else {
			for(let type in dict) {
				if(Math.floor(Number(type) / 100) != category) continue;
				let minLv:number = !dict[type].minLevel ? 0 : dict[type].minLevel;
				let roleState:number = !dict[type].roleState ? 0 : dict[type].roleState;
				let roleStateMatch:boolean
                if (category == LotteryCategoryEnum.LotteryEquip) {
                    roleStateMatch = CacheManager.role.getRoleState() == roleState;
				} else {
                    roleStateMatch = CacheManager.role.getRoleState() >= roleState;
				}
				if(roleLv <= dict[type].maxLevel && roleLv >= minLv && roleStateMatch) {
					return dict[type];
				}
			}
		}
		Log.trace(Log.SERR,"t_lottery_type 没有符合当前等级的分类 : ",LotteryCategoryEnum[category]);
		return null;
	}
}