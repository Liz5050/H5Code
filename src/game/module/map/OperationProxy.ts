class OperationProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**开始采集 */
	public beginCollect(sEntityId: any,roleIndex:number): void {
		this.send("ECmdGameBeginCollect", { "entityId": sEntityId ,"roleIndex":roleIndex});
	}

	/**结束采集 */
	public endCollect(sEntityId: any,roleIndex:number): void {
		this.send("ECmdGameEndCollect", { "entityId": sEntityId ,"roleIndex":roleIndex});
	}

	/**终止采集 */
	public abortCollect(): void {
		let index:number = CacheManager.king.leaderIndex;
		this.send("ECmdGameAbortCollect", {"roleIndex" : index});
	}

	/**
	* 传送类型
	* @param passType  传送点类型
	* @param fromCode  传送传送Npc Id或者切图点ID(passPointId || NpcID )
	* @param toCode    要传送到地图点ID passToId
	* @param reserve1  保留参数1
	*/
	public pass(passType: EPassType, fromCode: number, toCode: number, reserve1: number = 1): void {
		// CacheManager.king.stopKingEntity();
		this.send("ECmdGamePass", { "passType": passType, "fromCode": fromCode, "toCode": toCode, "reserve1": reserve1 });
	}

	/*
	* 传送到目的地（使用传送道具）
	* @param mapId
	* @param conveyType 传送类型
	* @param point	//EConveyTypeTask时，需传入指定的point
	*/
	public convey(mapId: number, conveyType: EConveyType = EConveyType.EConveyTypeNormal, point: any = null): void {
		if(CacheManager.king.checkKingPassing()) return;
        // CacheManager.king.stopKingEntity();
		if (point) {
			this.send("ECmdGameConvey", { "mapId": mapId, "conveyType": conveyType, "point": { "x_SH": point.x, "y_SH": point.y } });
		} else {
			this.send("ECmdGameConvey", { "mapId": mapId, "conveyType": conveyType });
		}
	}

	/**
	 * 查看玩家信息
	 */
	public lookupPlayer(toEntityId: any, fromEntityId: any = null, showLookingInfo: boolean = true, showError: boolean = true,from?:ECopyType): void {
		if (fromEntityId == null) {
			fromEntityId = CacheManager.role.entityInfo.entityId;
		}
		this.send("ECmdGameInteractiveLookupRequest", { "fromEntityId": fromEntityId, "toEntityId": toEntityId, "showLookingInfo": showLookingInfo, "showError": showError ,copyType:from});
	}

	/**
	 * 领取分享、关注、下载微端奖励
	 */
	public getPlatformReward(type:EShareRewardType):void {
		this.send("ECmdGameGetShareReward",{value_I:type});
	}

	/**
	 * 改变战斗模式
	 */
	public setMode(mode: EEntityFightMode): void {
		this.send("ECmdGameSetMode", {mode: mode});
	}
}