class KingBattleController extends ArenaSubController {
	private rankWindow:KingBattleRankWindow;
	private rewardWindow:KingBattleRewardWindow;
	private matchView:KingBattleMatchView;
	private kingBattleResult:WindowKingBattleResult;
	public constructor() {
		super();
	}

	protected addListenerOnInit():void {
		this.addListen0(UIEventEnum.OpenKingBattleRank,this.onOpenBattleRankHandler,this);
		this.addListen0(UIEventEnum.OpenKingBattleReward,this.onOpenBattleRewardHandler,this);
		this.addListen0(LocalEventEnum.KingBattleMatching,this.onStartMatchHandler,this);
		this.addListen0(LocalEventEnum.EnterKingBattle,this.onEnterKingBattleHandler,this);
		// this.addListen0(LocalEventEnum.GetBattleRankInfo,this.onGetRankInfo,this);

		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicKingStifeMatchRet],this.onMatchResultUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicPlayerKingStifeInfo],this.onPlayerBattleInfoUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicKingStifeRet],this.onBattleResultUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicKingStifeRank],this.onRankUpdateHandler,this);
	}

	/**
	 * 查看排行榜
	 */
	private onOpenBattleRankHandler(type:number):void {
		if(!this.rankWindow) {
			this.rankWindow = new KingBattleRankWindow();
		}
		this.rankWindow.show(type);
		this.onGetRankInfo(type);
	}

	/**
	 * 查看段位奖励
	 */
	private onOpenBattleRewardHandler():void {
		if(!this.rewardWindow) {
			this.rewardWindow = new KingBattleRewardWindow();
		}
		this.rewardWindow.show();
		this.onGetRankInfo(1);
	}

	/**请求匹配 */
	private onStartMatchHandler():void {
		if(!CacheManager.copy.checkCanEnterCopy()) {
			return;
		}
		if(CacheManager.copy.getEnterLeftNum(CopyEnum.CopyKingBattle) <= 0) {
			Tip.showTip("挑战次数不足");
			return;
		}
		ProxyManager.arena.startMatch();
	}

	/**请求进入王者争霸 */
	private onEnterKingBattleHandler():void {
		ProxyManager.arena.enterKingBattle();
		this.module.hide();
	}

	/**请求排行榜数据 */
	private onGetRankInfo(type:number):void {
		ProxyManager.arena.getKingBattleRank(type);
	}

	/**
	 * 玩家自己信息更新
	 * SPlayerKingStife [GamePublic.cdl]
	 */
	private onPlayerBattleInfoUpdate(data:any):void {
		CacheManager.arena.updateSelfBattleInfo(data);
		if(this.isShow) {
			this.module.updateKingBattleInfo();
		}
		if(this.kingBattleResult && this.kingBattleResult.isShow) {
			this.kingBattleResult.updateKingBattle();
		}
	}

	/**
	 * 匹配结果更新 
	 * SPlayerKingStife [GamePublic.cdl]
	 * ::Message::Public::SPublicMiniPlayer player;		
	 * int level;
	 * int winCount;
	 **/
	private onMatchResultUpdate(data:any):void {
		if(!this.matchView) {
			this.matchView = new KingBattleMatchView();
		}
		this.matchView.show(data);
		CacheManager.checkPoint.isAuto = false;
		// EventManager.dispatch(NetEventEnum.KingBattleMatchUpdate);
	}

	/**
	 * 战斗结果更新 
	 * SPlayerKingStifeRet [Message/Public/GamePublic.cdl]
	 * bool success;						//是否胜利
	int winCount;						//净胜次数
	int consecutiveWin; 				//连胜次数
	int level;							//新的等级
	Message::Public::SeqReward rewards; //奖励
	 */
	private onBattleResultUpdate(data:any):void {
		App.TimerManager.doDelay(2000,function(){
			//王者争霸结算
			if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgKingStife)) {
				if(!this.kingBattleResult) {
					this.kingBattleResult = new WindowKingBattleResult();
				}
				this.kingBattleResult.show(data);
			}
		},this);
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgKingStife)) {
			CacheManager.king.stopKingEntity();
		}
	}

	/**
	 * 排行榜更新
	 * SKingStifeRank
	 * type_I
	 * rank
	 */
	private onRankUpdateHandler(data:any):void {
		CacheManager.arena.updateRankInfo(data);
		if(this.rankWindow && this.rankWindow.isShow) {
			this.rankWindow.updateAll(data.type_I);
		}
		if(this.rewardWindow && this.rewardWindow.isShow) {
			this.rewardWindow.updateAll();
		}
	}
}