class GamePlayProxy extends BaseProxy {
	public constructor() {
		super();
	}
	/**阵地争夺 */
	public enterExpPosOccupy(copyCode:number):void {
		this.send("ECmdPublicPositionEnter",{copyCode_I:copyCode});
	}

	/**进入阵营战 血战五洲 */
	public enterCampBattle():void {
		if(CacheManager.campBattle.isCross) {
			this.send("ECmdPublicBattleBichCrossEnter",{});
		}
		else {
			this.send("ECmdPublicBattleBichEnter",{});
		}
	}

	/**
	 * 领取血战五洲积分奖励
	 */
	public getCampBattleScoreReward(score:number):void {
		this.send("ECmdPublicBattleBichGetReward",{value_I:score});
	}

	/**进入青云之巅 */
	public enterCrossStair():void {
		this.send("ECmdPublicCrossStairEnter",{});
	}

	/**
	 * 领取通关层数奖励
	 */
	public getCrossStairFloorReward():void {
		this.send("ECmdPublicCrossStairAcceptReward",{})
	}

	/**进入仙盟守卫 */
	public enterGuildDefend():void{
		this.send("ECmdGameMgGuildDefenseEnter",{});
	}

}