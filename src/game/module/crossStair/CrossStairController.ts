class CrossStairController extends BaseController{
	private exitView:CrossStairExitView;
	public constructor() {
		super(ModuleEnum.CrossStair);
	}

	protected initView(): any {
        return null;
    }

    /**类初始化时开启的监听 */
    protected addListenerOnInit(): void {
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCrossStairOpen],this.onStairOpenInfoUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCrossStairClose],this.onStairCloseHandler,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCrossStairInfo],this.onStairInfoUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCrossStairRank],this.onStairRankUpdate,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCrossStairLeftCopy],this.onLeftCrossStairCopy,this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCrossStairAcceptRewardSuccessRet],this.onFloorRewardGetSuccess,this);
		
	// 	//爬楼（青云之巅）
	// ECmdPublicCrossStairOpen				= 31140,	//跨服爬楼开启 Message::Public::SCrossStairOpen [Message/Public/GamePublic.cdl]
	// ECmdPublicCrossStairClose				= 31141,	//跨服爬楼关闭 Message::Public::SBool [Message/Public/CdlPublic.cdl]
	// ECmdPublicCrossStairInfo				= 31142,	//跨服爬楼信息 Message::Public::SCrossStairInfo [Message/Public/GamePublic.cdl]
	// ECmdPublicCrossStairRank				= 31143,	//跨服爬楼排行信息 Message::Public::SCrossStairRanks [Message/Public/GamePublic.cdl]		
	// ECmdPublicCrossStairOpenNotice	= 31148,	//跨服爬楼开启通知 Message::Public::SCrossStairOpen [Message/Public/GamePublic.cdl]
	// ECmdPublicCrossStairMyRank			= 31153,	//跨服爬楼自己排名 Message::Public::SCrossStairMyRank [Message/Public/GamePublic.cdl]
	// ECmdPublicCrossStairLeftCopy    = 31157,  //跨服爬楼退出副本，数组第一个值表示倒计时秒数 Message::Public::SSeqInt [Message/Public/CdlPublic.cdl]
	// ECmdPublicCrossStairAcceptReward    = 31158,  //跨服爬楼领取奖励
	// ECmdPublicCrossStairAcceptRewardSuccessRet    = 31159,  //跨服爬楼领取奖励成功返回
    }

    /**模块显示时开启的监听 */
    protected addListenerOnShow(): void {

    }

	/**
	 * 活动开启通知
	 * SCrossStairOpen
	 */
	private onStairOpenInfoUpdate(data:any):void {
		CacheManager.crossStair.updateOpenInfo(data);
	}

	/**
	 * 活动关闭
	 */
	private onStairCloseHandler(data:any):void {
		CacheManager.crossStair.updateOpenInfo(null);
	}

	/**
	 * 活动信息更新
	 * SCrossStairInfo
	 * int32 floor_I = 1;
	 * int32 maxFloor_I = 2;
	 * int32 killNum_I = 3;
	 * int32 lastAcceptedFloor
	 */
	private onStairInfoUpdate(data:any):void {
		CacheManager.crossStair.updateStairInfo(data);
	}

	/**
	 * 排行榜更新
	 * SCrossStairRanks
	 */
	private onStairRankUpdate(data:any):void {
		if(!data.crossStairRanks || !data.crossStairRanks.data) return;
		CacheManager.crossStair.updateStairRank(data.crossStairRanks.data);
	}

	/**
	 * 准备离开副本 
	 * SSeqInt
	 */
	private onLeftCrossStairCopy(data:any):void {
		EventManager.dispatch(LocalEventEnum.AutoStopFight);
		if(!this.exitView) {
			this.exitView = new CrossStairExitView();
		}
		this.exitView.show(data.intSeq.data_I[0]);
		let info:any = CacheManager.crossStair.stairInfo;
		EventManager.dispatch(LocalEventEnum.ShowCrossStairFloorTips,info.floor_I,LangCheckPoint.L6);
		EventManager.dispatch(LocalEventEnum.HidePlayerFightView);
	}

	/**
	 * 通关层数奖励领取成功
	 */
	private onFloorRewardGetSuccess():void {
		CacheManager.crossStair.updateFloorRewardState();
	}
}