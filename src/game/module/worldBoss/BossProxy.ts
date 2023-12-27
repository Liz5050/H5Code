class BossProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**
	 * 获取boss列表
	 */
	public reqBossList():void{
		this.send("ECmdGameUpdateGameBossInfo",{});
	}

	/**
	 * 请求进入boss副本
	 * @param copyCode
	 * @param mapId
	 */
	public reqEnterBossCopy(copyCode:number,mapId:number):void{
		// CacheManager.king.stopKingEntity();
		this.send("ECmdGameEnterGameBoss",{copyCode:copyCode,mapId:mapId})
	}
	/**
	 * 获取boss死亡记录
	 * @param copyCode
	 * @param bossCode
	 */
	public reqBossDeathRecord(copyCode:number,bossCode:number):void{
		this.send("ECmdGameGetGameBossDeathRecord",{copyCode:copyCode,bossCode:bossCode});
	}

	/**
	 * 获取游戏boss掉落记录
	 * @param section //显示区域 0：世界boss，1：神兽岛
	 */
	public reqBossDropRecord(section:number):void{
		this.send("ECmdGameGetGameBossDropRecord",{section:section})
	}

	/**
	 * 进入限时世界boss
	 */
	public enterTimeLimitBoss():void {
		this.send("ECmdPublicWorldBossEnter",{});
	}

	/**
	 * 限时世界BOSS抢奖励
	 */
	public pickUpDrop():void {
		this.send("ECmdPublicWorldBossPickDrop",{});
	}

	/**
	 * 请求限时世界boss当前血量
	 */
	public reqTimeLimitBossLife():void {
		this.send("ECmdPublicWorldBossLife",{});
	}

	/**
	 * 世界boss鼓舞
	 * @param type 1铜钱鼓舞 2元宝鼓舞
	 */
	public timeLimitBossAddBuff(type:number):void {
		this.send("ECmdPublicWorldBossInspire",{value_I : type});
	}

	/**刷新并挑战野外boss */
	public refreshAndEnterBoss(copyCode:number,mapId:number):void {
		this.send("ECmdGameCopyRefreshNewWorldBoss",{copyCode_I:copyCode,mapId_I:mapId});
	}

	/**请求进入神兽入侵boss */
	public reqCrossGuildBoss(copyCode:number,mapId:number):void{
		this.send("ECmdGameEnterGuildBossIntruderCross",{copyCode:copyCode,mapId:mapId});
	}

	/**获取掉落记录 */
	public reqDropLog(type:number,pageSize:number=100,pageIndex:number=0):void{
		//ECmdGameGetCachedDropLogMsgs
		this.send("ECmdGameGetCachedDropLogMsgs",{type:type,pageSize:pageSize,pageIndex:pageIndex});
	}

}