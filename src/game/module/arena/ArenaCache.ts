class ArenaCache implements ICache {
	private _selfBattleInfo:any;
	private _changeStar:number = 0;
	public isUpgradeLv:boolean;
	public oldLevel:number = -1;
	private rankInfo:{[type:number]:any} = {};

	//王者争霸活动时间配置
	private startCfg:any;
    private endCfg:any;
	public constructor() {
	}

	public updateSelfBattleInfo(data:any):void {
		this._changeStar = 0;
		if(this._selfBattleInfo) {
			let cfg:any = ConfigManager.mgKingStife.getByPk(this._selfBattleInfo.level_I);
			let cfgNew:any = ConfigManager.mgKingStife.getByPk(data.level_I);
			if(cfg.stage == cfgNew.stage && cfg.advance == cfgNew.advance) {
				let star1:number = cfg.star ? cfg.star : 0;
				let star2:number = cfgNew.star ? cfgNew.star : 0;
				this._changeStar = star2 - star1;
			}
			this.oldLevel = this._selfBattleInfo.level_I;
			//升段位或升阶才显示晋级特效
			this.isUpgradeLv = cfg.stage != cfgNew.stage || cfg.advance != cfgNew.advance;
		}
		this._selfBattleInfo = data;
		EventManager.dispatch(LocalEventEnum.KingBattleInfoUpdate);
	}

	/**更新排行榜数据 */
	public updateRankInfo(data:any):void {
		this.rankInfo[data.type_I] = data;
	}

	/**获取排行榜信息 */
	public getRankInfo(type:number):any {
		let info:any = this.rankInfo[type];
		if(!info) return null;
		return info.rank;
	}

	public get changeStar():number {
		return this._changeStar;
	}

	public set changeStar(value:number) {
		this._changeStar = value;
	}

	public get selfBattleInfo():any {
		return this._selfBattleInfo;
	}

	/**获取当前段位 */
	public getCurBattleStage():number {
		if(!this._selfBattleInfo) return 1;
		let cfg:any = ConfigManager.mgKingStife.getByPk(this._selfBattleInfo.level_I);
		if(!cfg) return 1;
		return cfg.stage;
	}

	public getCurStageReward():ItemData {
		if(!this._selfBattleInfo) return null;
		let cfg:any = ConfigManager.mgKingStife.getByPk(this._selfBattleInfo.level_I);
		if(!cfg) return null;
		let rewardCfg:any = ConfigManager.kingStageReward.getByPk(cfg.stage);
		let arr:string[] = rewardCfg.rewards.split("#")[0].split(",");
		let itemData:ItemData = new ItemData(Number(arr[1]));
		itemData.itemAmount = Number(arr[2]);
		return itemData;
	}

	public checkTips():boolean {
		return this.checkKingBattleTips() || CacheManager.encounter.checkTips() || CacheManager.mining.checkTips();
	}

	/**活动是否显示红点 */
	public checkGamePlayTips(type:EActiveType):boolean {
		// if(type == EActiveType.EActiveTypePosition) {
		// 	return CacheManager.posOccupy.isOpen && !CacheManager.copy.isInCopyByType(ECopyType.ECopyPosition);
		// }
		// else 
		if(type == EActiveType.EActiveTypeWorlBoss) {
			return CacheManager.timeLimitBoss.isOpen && !CacheManager.copy.isInCopyByType(ECopyType.ECopyWorldBoss);
		}
		else if(type == EActiveType.EActiveTypeBattleBich) {
			return CacheManager.campBattle.isOpen && !CacheManager.copy.isInCopyByType(ECopyType.ECopyBattleBich);
		}
		else if(type == EActiveType.EActiveTypeQuestion) {
			return CacheManager.exam.isExamStart();
		}
		else if(type == EActiveType.EActiveTypeCrossStair) {
			return CacheManager.crossStair.checkTips();
		}
		return false;
	}

	/**活动是否已开启 */
	public checkGamePlayIsOpen(type:EActiveType):boolean {
		if(type == EActiveType.EActiveTypePosition) {
			return CacheManager.posOccupy.isOpen;
		}
		else if(type == EActiveType.EActiveTypeWorlBoss) {
			return CacheManager.timeLimitBoss.isOpen;
		}
		else if(type == EActiveType.EActiveTypeBattleBich) {
			return CacheManager.campBattle.isOpen;
		}
		else if(type == EActiveType.EActiveTypeQuestion) {
			return CacheManager.exam.isExamStart();
		}
		else if(type == EActiveType.EActiveTypeCrossStair) {
			return CacheManager.crossStair.isOpen;
		}
		return false;
	}

	public checkKingBattleTips():boolean {
		if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.KingBattle],false)) return false;
		if(this.checkResultTime()) return false;
		return CacheManager.copy.getEnterLeftNum(CopyEnum.CopyKingBattle) > 0;
	}

	//检测王者争霸是否结算中
	public checkResultTime():boolean {
		if(!this.startCfg) {
			this.startCfg = ConfigManager.const.getByPk("KingStifeStartDt");
			this.endCfg = ConfigManager.const.getByPk("KingStifeEndDt");
		}
		let date:Date = new Date(CacheManager.serverTime.getServerTime() * 1000);
        let day:number = date.getDay();
        let hours:number = date.getHours();
        let minutes:number = date.getMinutes();
		let startValue:number = this.startCfg.constValue != undefined ? this.startCfg.constValue : 0;
		let endValue:number = this.endCfg.constValue != undefined ? this.endCfg.constValue : 0;
        let endEx:number = this.endCfg.constValueEx != undefined ? this.endCfg.constValueEx : 0;
        let startEx:number = this.startCfg.constValueEx != undefined ? this.startCfg.constValueEx : 0;
		if(day == 1) {
			if(hours < startValue) return true;
			if(hours == startValue && minutes < startEx) return true;
		}
		if(day == 0) {
			if(hours > endValue) return true;
			if(hours == endValue && minutes >= endEx) return true;
		}
		return false;
	}

	public clear():void {

	}
}