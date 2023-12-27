class GuildBattleController extends BaseController {
	private module:GuildBattleModule;
	private rankWindow:GuildBattleRankWindow;
	private memberWindow:GuildBattleMemberWindow;
	private resultWindow:WindowGuildBattleResult;
	public constructor() {
		super(ModuleEnum.GuildBattle);
	}

	protected initView():BaseModule {
		this.module = new GuildBattleModule(this.moduleId);
		return this.module;
	}

	/**类初始化时开启的监听 */
    protected addListenerOnInit(): void {
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgNewGuildWarOpen],this.onGuildBattleOpen,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgNewGuildWarClose],this.onGuildBattleClose,this);

		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgNewGuildWarGuildRank],this.onGuildRankUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgNewGuildWarPlayerRank],this.onGuildPlayerRankUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgNewGuildWarCollectInfo],this.onCollectInfoUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgNewGuildWarUpdateCollectInfo],this.onLeftAttackTimesUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgNewGuildWarUpdateGuildScore],this.onGuildScoreUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgNewGuildWarUpdateOwnScore],this.onMyScoreUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgNewGuildWarUpdatePlayerInfo],this.onPlayerInfoUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgNewGuildWarAllPlayerInfo],this.onPlayerListUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgNewGuildWarGetScoreRewardRet],this.onScoreRewardUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgNewGuildWarUpdatePlayerPoint],this.onMyBattleScoreUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgNewGuildWarWinInfo],this.onGuildBattleResult,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgNewGuildWarLastGetDailyReward],this.onDayRewardUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgNewGuildWarLastWinGuild],this.onGuildBattleWiner,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgNewGuildWarLastRank],this.onMyGuildRankUpdate,this);


		this.addListen0(UIEventEnum.GuildBattleRankOpen,this.onOpenRankHandler,this);
		this.addListen0(UIEventEnum.GuildBattleMemberOpen,this.onOpenMemberWindow,this);
		this.addListen0(NetEventEnum.copyLeft,this.onExitCopyHandler,this)
    }

    /**模块显示时开启的监听 */
    protected addListenerOnShow(): void {
		EventManager.dispatch(LocalEventEnum.HideActivityWarTips);
    }

	/**
	 * 仙盟战开启
	 * SMgNewGuildWarOPen
	 *  */
	private onGuildBattleOpen(data:any):void {
		CacheManager.guildBattle.updateOpenInfo(data);
	}

	/**仙盟战结束 */
	private onGuildBattleClose():void {
		CacheManager.guildBattle.updateOpenInfo(null);
	}

	/**
	 * 仙盟排名更新
	 * SMgNewGuildRank
	 */
	private onGuildRankUpdate(data:any):void {
		CacheManager.guildBattle.updateGuildRanks(data.ranks.data);
		if(this.rankWindow && this.rankWindow.isShow) {
			this.rankWindow.updateGuildRanks();
		}	
	}

	/**
	 * 个人排名更新
	 * SMgNewGuildRank
	 */
	private onGuildPlayerRankUpdate(data:any):void {
		CacheManager.guildBattle.updatePlayerRanks(data.ranks.data);
		if(this.rankWindow && this.rankWindow.isShow) {
			this.rankWindow.updatePlayerRanks();
		}
	}

	/**
	 * 采集信息更新
	 * SMgNewGuildCollectInfo
	 */
	private onCollectInfoUpdate(data:any):void {
		CacheManager.guildBattle.updateCollectInfo(data);
	}

	/**
	 * 采集者护盾剩余攻击次数
	 */
	private onLeftAttackTimesUpdate(data:any):void {
		EventManager.dispatch(NetEventEnum.GuildBattleCollectShieldUpdate,data.value_I)
	}

	/**
	 * 仙盟积分更新
	 * SInt
	 */
	private onGuildScoreUpdate(data:any):void {
		CacheManager.guildBattle.updateMyGuildScore(data.value_I);
	}

	/**
	 * 自己积分信息更新
	 * SMgNewGuildPlayerScore
	 */
	private onMyScoreUpdate(data:any):void {
		CacheManager.guildBattle.updateMyScore(data);
		CacheManager.copy.combo = data.continuityKill_I;
		if(data.updateType_I == EMgNewGuildUpdateType.EMgNewGuildUpdateTypeTimer) {
			if(this.memberWindow && this.memberWindow.isShow) {
				this.memberWindow.updateAll();
			}
		}
	}

	/**
	 * 仙盟战玩家信息更新(积分和所在地图)
	 * 单个更新
	 * SMgNewGuildPlayerInfo
	 */
	private onPlayerInfoUpdate(data:any):void {
		// let position:number = CacheManager.guildBattle.maps.indexOf(data.mapId_I);
		let info:GuildBattlePlayerInfo = CacheManager.guildBattle.getMemberInfo(EntityUtil.getEntityId(data.player.entityId));
		let positionUpdate:boolean = false;
		if(!info || info.mapId != data.mapId_I) {
			positionUpdate = true;
		}
		CacheManager.guildBattle.updateGuildPlayerInfo(data);
		if(positionUpdate) {
			EventManager.dispatch(NetEventEnum.GuildBattleMemberPositionUpdate);
		}
		if(this.memberWindow && this.memberWindow.isShow) {
			this.memberWindow.updateAll();
		}
	}

	/**
	 * 盟战玩家列表更新(进副本推送一次)
	 * SMgNewGuildAllPlayerInfo
	 */
	private onPlayerListUpdate(data:any):void {
		CacheManager.guildBattle.updateGuildPlayerInfoList(data.infos.data);
	}

	/**
	 * 积分目标奖励领奖更新
	 * SInt
	 */
	private onScoreRewardUpdate(data:any):void {
		CacheManager.guildBattle.updateHadGetScore(data.value_I);
	}

	/**
	 * 自己战功更新（不同于积分）
	 * SInt
	 */
	private onMyBattleScoreUpdate(data:any):void {
		CacheManager.guildBattle.updateBattleScore(data.value_I);
	}

	/**
	 * 仙盟争霸结算
	 * SMgNewGuildWarResult
	 */
	private onGuildBattleResult(data:any):void {
		if(!this.resultWindow) {
			this.resultWindow = new WindowGuildBattleResult();
		}
		this.resultWindow.show(data);
	}

	/**
	 * 每日奖励领取标志
	 * 0未领取 1已领取
	 */
	private onDayRewardUpdate(data:any):void {
		CacheManager.guildBattle.dayRewardGet = data.value_I;
		if(this.isShow) {
			this.module.updateDayRewardState();
		}
		EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.GuildNew,CacheManager.guildNew.checkTips());
	}

	/**
	 * 胜利仙盟更新
	 */
	private onGuildBattleWiner(data:any):void {
		CacheManager.guildBattle.updateWiner(data);
		EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.GuildNew,CacheManager.guildNew.checkTips());
	}

	/**
	 * 我的仙盟排名更新
	 * SInt
	 */
	private onMyGuildRankUpdate(data:any):void {
		CacheManager.guildBattle.myGuildRank = data.value_I;
	}

	/**
	 * 查看排名/奖励
	 */
	private onOpenRankHandler():void {
		if(!this.rankWindow) {
			this.rankWindow = new GuildBattleRankWindow();
		}
		this.rankWindow.show();
		ProxyManager.guildBattle.getRankList(0);
	}

	private onOpenMemberWindow():void {
		if(!this.memberWindow) {
			this.memberWindow = new GuildBattleMemberWindow();
		}
		this.memberWindow.show();
	}

	private onExitCopyHandler(copyType:ECopyType):void {
		if(copyType != ECopyType.ECopyMgNewGuildWar) return;
		if(this.memberWindow && this.memberWindow.isShow) {
			this.memberWindow.hide();
		}
		if(this.rankWindow && this.rankWindow.isShow) {
			this.rankWindow.hide();
		}
	}
}
