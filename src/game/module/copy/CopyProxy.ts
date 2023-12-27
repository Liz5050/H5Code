class CopyProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**
	 * 请求进入个人boss
	 */
	public enterPersonalBoss(copyCode:number,bossId:number,useMoney:boolean=false):void{
		this.send("ECmdGameEnterMgPersonalBoss",{copyCode:copyCode,bossId:bossId,useMoney:useMoney});
	}
	/**
	 * 进入副本
	 * struct:C2S_SEnterCopy
	 */
	public enterCopy(code:number,extraTime:number=0):void{
		//CacheManager.king.stopKingEntity();
		this.send("ECmdGameEnterCopy",{"code":code,"extraTime":extraTime});
	}
	/**
	 * 诛仙塔进入下一层
	 */
	public enterNextFloor():void{
		this.send("ECmdGameContinueRuneCopy",{});
	}
	public leftCopy(isLeftTeam:boolean = false):void{
		//CacheManager.king.stopKingEntity();
		this.send("ECmdGameLeftCopy",{bVal_B:isLeftTeam});
	}

	/**鼓舞
	 * @param type //鼓舞类型  1：银两鼓舞，2：元宝鼓舞
	 */
	public inspireInExpCopy(type:number):void{
		this.send("ECmdGameInspireInExperienceCopy",{type:type});
	}
	/** 重置副本冷却时间(九幽副本)
	 * 
	 */
	public resetExpCopyCd():void{
		this.send("ECmdGameResetExperienceCopyCD",{});
	}

	/**
	 * 扫荡
	 */
	public delegate(copyCode:number,key1:number=0):void{
		this.send("ECmdGameStartDelegateNew",{copyCode:copyCode,key1:key1});
	}

	/**
	 * 增加副本次数
	 */
	public addCopyNum(copyType:number):void{
		this.send("ECmdGameAddCopyNum",{copyType:copyType});
	}
	
	public enterForceWar():void{
		this.send("ECmdGameEnterForceWar",{});
	}
	/**
	 * 领取新的经验副本经验
	 * @param multiple 倍数
	 */
	public getExpCopyReward(multiple:number):void{
		this.send("ECmdGameGetNewExperienceExp",{value_I:multiple});
	}
	/**
	 * 秘境boss摇色子
	 */
	public sendRoundDice():void{
		this.send("ECmdGameSecretBossRand",{});
	}

	/**
	 * 请求刷新副本恢复次数 
	 * 服务端不是按秒检测，当客户端恢复次数的倒计时为0的时候，服务端不会马上推送副本信息更新
	 */
	public refreshCopyCDTime():void {
		this.send("ECmdGameRefreshCopyDescNum",{})
	}
	/**
	 * 获取诛仙塔每天奖励
	 */
	public getTowerReward():void{
		this.send("ECmdGameGetRuneCopyReward",{});
	}
	
	public getTowerRewardOpen():void{
		this.send("ECmdGameRuneCopyRewardForShow",{});
	}

	/**
	 * 合击副本召唤伙伴
	 */
	public punchLeadCopySummon():void {
		this.send("ECmdGamePunchLeadCopySummon", {});
	}
	/**诛仙塔抽奖 */
	public towerLottery(value_I:number):void{
		this.send("ECmdGameLotteryRuneCopy", {value_I:value_I});
	}
	/**
	 * 领取法宝副本奖励
	 * @param value_I 倍数
	 *  */
	public getSpiritReward(value_I:number):void{
		this.send("ECmdGameGetSpiritReward", {value_I:value_I});
	}

	/**扫荡法宝副本(无掉落的副本) */
	public delegateSpirit(copyCode:number,key1:number=0):void{
		this.send("ECmdGameDelegateSpirit",{copyCode:copyCode,key1:key1});
	}
	/**守护神剑 招呼幸运boss */
	public callLuckBoss():void{
		this.send("ECmdGameDefenseCopyRefreshLuckyBoss",{});
	}
	/**守护神剑 使用技能 */
	public useDefendSkill(index:number):void{
		this.send("ECmdGameDefenseCopyUserSkill",{value_I:index});
	}

	/**
	 * 进入穹苍幻境
	 * C2S_SEnterMgQiongCangDreamland
	 */
	public enterQC(copyCode:number,floor:number):void{
		this.send("ECmdGameEnterQiongCangCopy",{copyCode:copyCode,floor:floor});
	}
	/**领取穹苍幻境的奖励 */
	public getQCReward():void{
		this.send("ECmdGameGetQiongCangCopyReward",{});
	}

	public reqCopyAssit(copyCode:number,mapId:number):void{
		this.send("ECmdGameGuildCopyAssistReq",{copyCode:copyCode,mapId:mapId});
	}

}