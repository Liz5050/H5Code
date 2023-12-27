class LotteryController extends BaseController{
	private module:LotteryModule;
	private lotteryResult:LotteryResultWindow;
	private lotteryStore:LotteryStoreWindow;
	private lotteryNumReward:LotteryRewardWindow;
	private lotteryProWindow : LotteryProbabilityWindow;

	public constructor() {
		super(ModuleEnum.Lottery);
	}

	/**
     * 初始化模块视图
     */
    protected initView(): BaseModule {
        this.module = new LotteryModule(this.moduleId);
		return this.module;
    }

	 /**类初始化时开启的监听 */
    protected addListenerOnInit(): void {
		
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameLottery],this.onLotterySuccessUpdate,this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameLotteryInfo],this.onLotteryInfoUpdate,this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameLotteryRecord],this.onLotteryRecordUpdate,this);

		this.addListen0(LocalEventEnum.LotteryRequest,this.onLotteryRequestHandler,this);
		this.addListen0(LocalEventEnum.LotteryGetLog,this.onGetLotteryLogHandler,this);
		
		this.addListen0(LocalEventEnum.LotteryGetCountReward,this.onGetLotteryCountReward,this);
		this.addListen0(UIEventEnum.LotteryPackOpen, this.onOpenLotteryPackHandler,this);
		this.addListen0(UIEventEnum.LotteryNumRewardOpen, this.onOpenLotteryNumRewardHandler,this);
		this.addListen0(UIEventEnum.LotteryProbilityOpen, this.onOpenLotteryProbWindow, this);

    }

    /**模块显示时开启的监听 */
    protected addListenerOnShow(): void {
		this.addListen1(NetEventEnum.packPosTypePropChange, this.onPosTypeBagChange, this);
		this.addListen1(NetEventEnum.packPosTypeLotteryChange,this.onLotteryEquipBagUpdate,this);
		this.addListen1(NetEventEnum.packPosTypeLotteryRuneChange,this.onLotteryRuneBagUpdate,this);
		this.addListen1(NetEventEnum.packPosTypeLotteryAncientChange,this.onLotteryAncientBagUpdate,this);
		this.addListen1(NetEventEnum.LotteryBroadcastUpdate,this.onAddLotteryRecord,this);
		this.addListen1(LocalEventEnum.PackUpdateCode,this.onPackUpdateHandler,this);
    }

	private onPackUpdateHandler(updateCode:number,itemCodes:number[]):void {
		if(updateCode == 1522) {
			let centerX:number = Math.round(fairygui.GRoot.inst.width * 0.5);
			let centerY:number = Math.round(fairygui.GRoot.inst.height * 0.5);
			MoveMotionUtil.itemMoveToBag(itemCodes,100,LayerManager.UI_Popup,centerX,centerY);
		}
	}

	/**
	 * 打开寻宝仓库
	 */
	private onOpenLotteryPackHandler(category:LotteryCategoryEnum):void {
		if(!this.lotteryStore) {
			this.lotteryStore = new LotteryStoreWindow();
		}
		this.lotteryStore.show(category);
	}

	/**
	 * 打开累计寻宝次数奖励
	 */
	private onOpenLotteryNumRewardHandler(data:any):void {
		if(!this.lotteryNumReward) {
			this.lotteryNumReward = new LotteryRewardWindow();
		}
		this.lotteryNumReward.show(data);
	}

	/**
	 * 军火库
	 */
	private onOpenLotteryProbWindow(data:any):void {
		if(!this.lotteryProWindow) {
			this.lotteryProWindow = new LotteryProbabilityWindow();
		}
		this.lotteryProWindow.show(data);
	}

	/**
	 * 寻宝请求
	 */
	private onLotteryRequestHandler(type:number,amount:number):void {
		ProxyManager.lottery.lottery(type,amount);
	}

	/**
	 * 寻宝日志请求
	 */
	private onGetLotteryLogHandler(category:LotteryCategoryEnum):void {
		ProxyManager.lottery.lotteryRecord(category);
	}

	/**
	 * 领取累计次数奖励
	 */
	private onGetLotteryCountReward(type:number,times:number):void {
		ProxyManager.lottery.getLotteryCountReward(type,times);
	}

	/**
	 * 寻宝成功返回
	 * S2C_SLottery
	 * SeqLotteryRecord
	 * int32 itemCode_I
	 * string jsStr_S
	 * int32 num_I
	 * bool valued_B
	 */
	private onLotterySuccessUpdate(data:any):void {
		if(!this.lotteryResult) {
			this.lotteryResult = new LotteryResultWindow();
		}
		if (this.lotteryResult.isShow) {
			this.lotteryResult.updateAll(data);
		} else {
			this.lotteryResult.show(data);
		}
	}

	/**
	 * 寻宝信息更新
	 * SNewLotteryInfo
	 * int32 type = 1;   
	 * int32 times = 2;   //寻宝次数(本周)
	 * int32 bless = 3;   //祝福值
	 * SeqInt hadGetRewards= 4; //已领取奖励
	 * int32 freeTime = 5; //免费次数
	 */
	private onLotteryInfoUpdate(data:any):void {
		CacheManager.lottery.updateLotteryInfo(data.infos);
		if(this.isShow) {
			this.module.updateLotteryInfo();
		}
		EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.Lottery,CacheManager.lottery.checkAllTips());
	}

	/**
	 * 寻宝记录更新
	 * S2C_SLotteryRecord
	 * int32 type = 1;  
	 * SeqSPublicNotice records = 2;	
	 */
	private onLotteryRecordUpdate(data:any):void {
		CacheManager.lottery.updateRecords(data);
		if(this.isShow) {
			this.module.updateRecord();
		}
	}

	private onAddLotteryRecord(data:any):void {
		CacheManager.lottery.addRecords(data);
		if(this.isShow) {
			this.module.updateRecord();
		}
	}

	/**道具背包更新 */
	private onPosTypeBagChange():void {
		this.module.onPosTypeBagChange();
		if(this.lotteryResult && this.lotteryResult.isShow) {
			this.lotteryResult.onPosTypeBagChange()
		}
	}

	/**
	 * 装备寻宝仓库更新
	 */
	private onLotteryEquipBagUpdate():void {
		// CacheManager.pack.lotteryEquipPack;
		this.module.onLotteryEquipBagUpdate();
		if(this.lotteryStore && this.lotteryStore.isShow) {
			this.lotteryStore.updateAll(-1);
		}
	}

	/**
	 * 战纹寻宝仓库更新
	 */
	private onLotteryRuneBagUpdate():void {
		// CacheManager.pack.lotteryRunePack;
		this.module.onLotteryRuneBagUpdate();
		if(this.lotteryStore && this.lotteryStore.isShow) {
			this.lotteryStore.updateAll(-1);
		}
	}

	/**
	 * 混元寻宝仓库更新
	 */
	private onLotteryAncientBagUpdate():void {
		this.module.onLotteryAncientBagUpdate();
		if(this.lotteryStore && this.lotteryStore.isShow) {
			this.lotteryStore.updateAll(-1);
		}
	}
}