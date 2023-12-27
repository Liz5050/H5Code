class TimeLimitBossController extends BaseController {
	private bossWindow:TimeLimitBossWindow;
	private rewardView:TimeLimitBossRewardView;
	private resultWindow:TimeLimitBossResult;

	private showTips:number = 0;
	public constructor() {
		super(ModuleEnum.TimeLimitBoss);
	}

	public initView():BaseWindow {
		this.bossWindow = new TimeLimitBossWindow();
		return this.bossWindow;
	}

	/**类初始化时开启的监听 */
    protected addListenerOnInit(): void {
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicWorldBossOpen],this.onBossOpenInfoUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicWorldBossClose],this.onBossCloseUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicWorldBossLife],this.onBossLifeUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicWorldBossHurtList],this.onBossHurtInfoUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicWorldBossReward],this.onResultUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicWorldBossInspireInfo],this.onBuffUpdate,this);

		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicWorldBossDropInfo],this.onDropInfoUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicWorldBossDropClose],this.onDropClose,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicWorldBossDropItem],this.onMyDropRewardUpdate,this);

		// ECmdPublicWorldBossDropInfo		  	   = 32664,		// 掉落信息 Message::Public::SWorldBossDropInfo[Message/Public/GamePublic.cdl]
		// ECmdPublicWorldBossDropClose	  	   = 32665,		// 掉落关闭 NULL
		// ECmdPublicWorldBossPickDrop			   = 32666,  	// 抢奖励 NULL
		// ECmdPublicWorldBossDropItem			   = 32667, 	// 抢到的掉落 Message::Public::SSeqReward[Message/Public/GamePublic.cdl]

		this.addListen0(UIEventEnum.TimeLimitBossRewardOpen,this.onOpenRewardPanel,this);
		this.addListen0(LocalEventEnum.TimeLimitBossEnter,this.onEnterBossCopyHandler,this);
		this.addListen0(LocalEventEnum.TimeLimitBossAddBuff,this.onAddBuffHandler,this);
    }

    /**模块显示时开启的监听 */
    protected addListenerOnShow(): void {
		EventManager.dispatch(LocalEventEnum.HideActivityWarTips);
    }

	/**
	 * 限时世界boss开启
	 * SWorldBossOpen
	 */
	private onBossOpenInfoUpdate(data:any):void {
		Log.trace(Log.TEST,"收到Boss活动开启",data);
		CacheManager.timeLimitBoss.updateOpenInfo(data);
	}

	/**
	 * 活动结束
	 */
	private onBossCloseUpdate():void {
		CacheManager.timeLimitBoss.updateOpenInfo(null);
		if(this.isShow) {
			this.hide();
		}
	}

	/**
	 * 伤害列表更新
	 */
	private onBossHurtInfoUpdate(data:any):void {
		CacheManager.timeLimitBoss.updateHurtList(data);
	}

	/**
	 * boss血量更新
	 * SWorldBossLife
	 */
	private onBossLifeUpdate(data:any):void {
		if(this.bossWindow && this.bossWindow.isShow) {
			this.bossWindow.updateBossLife(data);
		}
	}

	/**
	 * boss结算
	 * SWorldBossReward
	 */
	private onResultUpdate(data:any):void {
		Log.trace(Log.TEST,"收到Boss结算",data);
		if(this.rewardView && this.rewardView.isShow) {
			this.rewardView.hide();
		}
		if(!this.resultWindow) {
			this.resultWindow = new TimeLimitBossResult();
		}
		this.resultWindow.show(data);
	}

	/**
	 * 请求鼓舞
	 */
	private onAddBuffHandler():void {
		let buffCfg:any = ConfigManager.worldBossBuff.getNextBuffCfg();
		if(!buffCfg) {
			Tip.showRollTip("鼓舞次数已达上限");
			return;
		}
		if(MoneyUtil.checkEnough(buffCfg.unit,buffCfg.cost)) {
			ProxyManager.boss.timeLimitBossAddBuff(buffCfg.type);
			this.showTips ++;
		}
	}

	/**
	 * 鼓舞buff更新 
	 * SWorldBossInspireInfo
	 * int32 coinInspireNum_I = 1;
	 * int32 goldInspireNum_I = 2;
	 **/
	private onBuffUpdate(data:any):void {
		CacheManager.timeLimitBoss.updateBuffInfo(data);
		if(this.showTips > 0) {
			let buffCfg:any = ConfigManager.worldBossBuff.getCurBuffCfg();
			if(buffCfg) {
				Tip.showRollTip("攻击力加成：" + buffCfg.effect2 + "%");
			}
			this.showTips --;
		}
	}

	/**
	 * 掉落信息更新
	 * SWorldBossDropInfo
	 * int32 itemCode_I = 1;
	 * int32 dropNum_I = 2;
	 * int32 leftNum_I = 3;
	 */
	private onDropInfoUpdate(data:any):void {
		CacheManager.timeLimitBoss.updateDropInfo(data);
	}

	/**
	 * 掉落关闭
	 * 暂时无用
	 */
	private onDropClose():void {

	}

	/**
	 * 我抢到的掉落奖励
	 * (用于客户端飘字，实际道具没有进背包，在结算时，统一一次性进背包)
	 */
	private onMyDropRewardUpdate(data:any):void {
		let rewards:any[] = data.rewards.data;
		if(!rewards || !rewards.length) {
			return;
		}
		let itemData:ItemData = RewardUtil.getRewardBySReward(rewards[0]);
		let dropInfo:any = CacheManager.timeLimitBoss.dropInfo;
		if(itemData.getCode() != dropInfo.itemCode_I) {
			//极品装备
			EventManager.dispatch(LocalEventEnum.TimeLimitBossBetterEffect);
		}
		EventManager.dispatch(NetEventEnum.packBackAddItem, itemData, rewards[0].num_L64);
		MoveMotionUtil.itemMoveToBag(rewards[0].code_I);
	}

	/**请求进入世界boss副本 */
	private onEnterBossCopyHandler():void {
		if(!CacheManager.timeLimitBoss.showIcon) {
			Tip.showRollTip("活动暂未开启");
			return;
		}
		if(!ConfigManager.mgOpen.isOpenedByKey(IconResId[IconResId.TimeLimitBoss])) {
			return;
		}
		if(!CacheManager.copy.checkCanEnterCopy()) {
			return;
		}
		let leftOpenTime:number = CacheManager.timeLimitBoss.leftOpenTime;
		if(leftOpenTime > 0) {
			Tip.showRollTip("距活动开启还剩：" + HtmlUtil.html(App.DateUtils.getTimeStrBySeconds(leftOpenTime,DateUtils.FORMAT_4,true),Color.Green2));
			return;
		}
		ProxyManager.boss.enterTimeLimitBoss();
	}

	private onOpenRewardPanel():void {
		if(!this.rewardView) {
			this.rewardView = new TimeLimitBossRewardView();
		}
		this.rewardView.show();
	}
}