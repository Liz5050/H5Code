/**
 * 福利
 */

class Welfare2Controller extends BaseController {
    private module: Welfare2Module;
    private privilegeSetWindow:PrivilegeCopySetWindow;
    private windowPrivilegeExpCard : WindowPrivilegeExpCard;
    private offlineWinHide: boolean;
    private activationWinHide : boolean;
    private timeLimitWinHide : boolean;
    private needShowTempCardWin : boolean;
    private firstCardInfo : boolean;
    private commonIsLoaded:boolean;


    public constructor() {
        super(ModuleEnum.Welfare2);
        this.onCommonLoaded(PackNameEnum.Common);
        this.viewIndex = ViewIndex.One;
        this.offlineWinHide = false;
        this.activationWinHide = false;
        this.timeLimitWinHide = false;
        this.needShowTempCardWin = false;
        this.firstCardInfo = false;
    }

    public initView(): BaseModule{
        this.module = new Welfare2Module();
        return this.module;
    }

    public addListenerOnInit(): void {
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGatePlayerMonthCardInfo], this.onGardInfo, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSignRewardsInfo], this.onSignRewardsInfo, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSevenDayLoginReward],this.onSevenDayReward,this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateTodayOnlineDays],this.onlineDays,this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateOnlineReward],this.onlineTimeRewardUpdate,this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGatePushContinueLoginFlag],this.onContinueLoginFlag,this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGamePrivilegeCardMultiSettingRetSuccess],this.onPrivilegeSetSuccess,this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGamePrivilegeCardMultiSettingInfo],this.onPrivilegeSetInfoUpdate,this);

        this.addListen0(UIEventEnum.ShowPrivilegeCardExpWindow, this.onWindowPriExpCardShow, this);
        this.addListen0(LocalEventEnum.GameCrossDay, this.onCrossDay, this);//服务器跨天
        this.addListen0(NetEventEnum.OnlineTimeTodayUpdate,this.onlineTimeUpdate,this);
        this.addListen0(LocalEventEnum.GetOnlineReward,this.onGetOnlineRewardHandler,this);
        this.addListen0(UIEventEnum.TempCardCheckWinClose, this.CheckExpCardWinShow, this);
        this.addListen0(LocalEventEnum.PrivilegeCopySetOpen,this.onPrivilegeCopySetOpen,this);

        this.addListen0(UIEventEnum.PackageLoaded, this.onCommonLoaded, this);
        
    }

    protected addListenerOnShow(): void {
        this.addListen1(LocalEventEnum.ReqPrivilegeReward, this.onReqPrivilegeReward, this);
        this.addListen1(LocalEventEnum.ChangeNoticeTitle,this.changeNoticeTitle,this);
    }

    private changeNoticeTitle() : void {
        this.module.title = "Welfare2_1"
    }

    private onReqPrivilegeReward() {
        this.sendSocketMsg(ECmdGame[ECmdGame.ECmdGameGetPlayerPrivilegeCardReward],{});
    }

    /**
     * 服务器跨天，重新计算是否可领取
     */
    private onCrossDay() {
        if (this.isShow) {
            this.module.updatePrivilegePanel();
        }
    }

    /**
     *
     * @param msg:SMonthCardInfo
     */
    private onGardInfo(msg:any) {
        CacheManager.welfare2.updateCardInfo(msg);
        if (this.isShow) {
            this.module.updatePrivilegePanel();
            this.module.updateBtnTips();
        }//console.log('ModuleEnum.Welfare1111',CacheManager.welfare2.privilegeRewardFlag)
        EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.Welfare,CacheManager.welfare2.checkTips());
        EventManager.dispatch(LocalEventEnum.MonthCardInfoUpdate);
        if(!this.firstCardInfo) {
            this.firstCardInfo = true;
            if(CacheManager.welfare2.isPrivilegeCardExpEnd) {
                this.needShowTempCardWin = true;
                if (this.commonIsLoaded) {
		            egret.setTimeout(this.CheckExpCardWinShow,this, 1500);
                }
            }
            else {
                if(CacheManager.welfare2.hasPrivilegeCard && !CacheManager.welfare2.isPrivilegeCard) {

                        this.needShowTempCardWin = true;
                        if (this.commonIsLoaded) {
		                    egret.setTimeout(this.CheckExpCardWinShow,this, 1500);
                        }
                    
                }
            }
        }
    }

    private onCommonLoaded(packageName: string): void {
		if (packageName == PackNameEnum.Common && ResourceManager.isPackageLoaded(packageName)) {
			this.removeListener(UIEventEnum.PackageLoaded, this.onCommonLoaded, this);
			this.commonIsLoaded = true;
			if (this.commonIsLoaded && this.needShowTempCardWin) {
				 egret.setTimeout(this.CheckExpCardWinShow,this, 1500);;//home打开后再显示
			}
		}
	}

    /**
	 * 每日签到登录和领取奖励后推送
	 * @param data SDailySignRewardInfo
	 */
	private onSignRewardsInfo(data: any): void{
		// let dayDict: any = {};
		// let rewardDict: any = {};
		// let date: Date = new Date(data.severDt_DT*1000);
        // let rewardArr: Array<any> = data.canGetRewards.data_I;
        // for(let d of rewardArr){
		// 	rewardDict[d] = true;
		// }
        // CacheManager.welfare2.getSignRewardArr = rewardArr;

        CacheManager.welfare2.signRewardsInfo = data;
        if(this.isShow){
			this.module.updateSignInPanel();
		}
        EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.Welfare,CacheManager.welfare2.checkTips());
	}

    /**登陆奖励已领取 */
    private onSevenDayReward(data:any):void{		
		CacheManager.welfare2.updateLoginReward(data.intSeq.data_I);
		if(this.isShow){
			this.module.updateLoginRewardPanel();
		}
		EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.Welfare,CacheManager.welfare2.checkTips());
		EventManager.dispatch(LocalEventEnum.HomeLoginRewardUpdate);
	}

    /**在线天数更新 */
	private onlineDays(data:any):void{
		CacheManager.welfare2.onlineDays = data.intSeq.data_I[0];
		if(this.isShow){
			this.module.updateLoginRewardPanel();
		}
		EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.Welfare,CacheManager.welfare2.checkTips());
        EventManager.dispatch(NetEventEnum.OnlineDaysUpdate);
        EventManager.dispatch(LocalEventEnum.HomeLoginRewardUpdate);
	}

    /**
     * 在线奖励更新
     */
    private onlineTimeRewardUpdate(data:any):void {
        CacheManager.welfare2.updateOnlineRewardState(data);
        if(this.isShow) {
            this.module.updateOnlineTime();
        }
        EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.Welfare,CacheManager.welfare2.checkTips());
        EventManager.dispatch(LocalEventEnum.HomeLoginRewardUpdate);
    }

    /**
     * 今日在线时长更新
     */
    private onlineTimeUpdate():void {
        if(this.isShow) {
            this.module.updateOnlineTime();
        }
        EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.Welfare,CacheManager.welfare2.checkTips());
    }

    /**
     * 领取在线奖励
     */
    private onGetOnlineRewardHandler(type:number,time:number):void {
        ProxyManager.welfare2.getOnlineReward(type,time);
    }

    /**
     * 是否已错过连续奖励
     */
    private onContinueLoginFlag(data: any): void {
        CacheManager.welfare2.isMissLoginTitle = !data.bVal_B;
    }

    /**
     * 特权月卡设置成功
     * SPrivilegeCardMultiSetting
     */
    private onPrivilegeSetSuccess(data:any):void {
        CacheManager.welfare2.updatePrivilegeSetInfo(data);
    }

    /**
     * 特权月卡设置信息，登陆推送
     * SeqPrivilegeCardMultiSetting
     */
    private onPrivilegeSetInfoUpdate(data:any):void {
        CacheManager.welfare2.updatePrivilegeSetInfoList(data.data);
    }

    /**
     * 打开特权设置界面
     */
    private onPrivilegeCopySetOpen(fromCode:number):void {
        if(!this.privilegeSetWindow) {
            this.privilegeSetWindow = new PrivilegeCopySetWindow();
        }
        this.privilegeSetWindow.show(fromCode);
    }

    private onWindowPriExpCardShow(data: any) : void {
        if(!this.windowPrivilegeExpCard) {
            this.windowPrivilegeExpCard = new WindowPrivilegeExpCard();
        }
        this.windowPrivilegeExpCard.show(data);
    }

    private CheckExpCardWinShow() {
        this.offlineWinHide = !ControllerManager.sysSet.offlineWindowOpen();
        this.activationWinHide = !ControllerManager.activation.isShow;
        this.timeLimitWinHide = !ControllerManager.timeLimitTask.isTaskOpenedWindowOpen();
        this.showExpCardWin();
    }

    private showExpCardWin() {
        if(this.offlineWinHide && this.activationWinHide && this.timeLimitWinHide && this.needShowTempCardWin) {
            this.needShowTempCardWin = false;
            if(CacheManager.welfare2.isPrivilegeCardExpEnd) {
                if(!CacheManager.player.stateInfo["PrivilegeTempCard"]) {
                    this.onWindowPriExpCardShow(null);
                    CacheManager.player.updatePrivilegeTempCardStatus();
                }
            }
            else {
                if(CacheManager.player.stateInfo["PrivilegeEndTime"] != CacheManager.welfare2.privilegeCardEntDt) {
                    this.onWindowPriExpCardShow(null);
                    CacheManager.player.updatePrivilegeCardEndTime(CacheManager.welfare2.privilegeCardEntDt)
                }
                
            }
            
        }
    }


}