class GuildBattleProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**
	 * 进入仙盟争霸
	 * C2S_SEnterMgNewGuildWar
	 * optional int32 copyCode = 1;  	//副本id
	 * optional int32 mapId = 2;  		//地图ID
	 */
	public enterGuildBattle(mapId:number,copyCode:number = CopyEnum.CopyGuildBattle):void {
		this.send("ECmdGameCopyEnterMgNewGuildWar",{copyCode:copyCode,mapId:mapId});
	}

	/**
	 * 领取积分奖励
	 */
	public scoreRewardGet(score:number):void {
		this.send("ECmdGameCopyGetMgNewGuildScoreReward",{value_I:score});
	}

	/**
	 * 请求排行榜数据
	 * @param type 1仙盟排行 2个人排行 EMgNewGuildWarRank
	 */
	public getRankList(type:EMgNewGuildWarRank):void {
		this.send("ECmdGameCopyGetMgNewGuildRank",{value_I:type});
	}

	/**
	 * 请求采集
	 */
	public collect():void {
		this.send("ECmdGameCopyStartMgNewGuildCollect",{});
	}

	/**
	 * 领取每日奖励
	 */
	public getDailyReward():void {
		this.send("ECmdGameCopyGetMgNewGuildDailyReward",{});
	}

	// ECmdGameCopyGetMgNewGuildDailyReward= 101694;		//新仙盟战-- 领取每日奖励
	// ECmdGameCopyEnterMgNewGuildBoss		= 101690;		//新仙盟战-- 进入仙盟战 C2S_SEnterMgNewGuildWar
	// ECmdGameCopyGetMgNewGuildScoreReward = 101691;		//新仙盟战-- 领取目标积分奖励 Message::Public::SInt    [Message/Public/CdlPublic.cdl
	// ECmdGameCopyGetMgNewGuildRank		= 101692;		//新仙盟战-- 获取积分排行 Message::Public::SInt    [Message/Public/CdlPublic.cdl  0 : 帮会排行榜， 1：个人排行榜
	// ECmdGameCopyStartMgNewGuildCollect	= 101693;		//新仙盟战-- 开始采集
}