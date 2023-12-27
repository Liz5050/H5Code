class PlatformController extends BaseController {
	private microWin:MicroClientWindow;
	private followWin:FollowRewardWindow;
	private shareWin:ShareRewardWindow;
    private windowCer:CertificationWindow;
	private windowCerGift:CertificationGiftWindow;
	private isfirstGetSM : boolean;

	private moduleView:OperatingModule;

	public constructor() {
		super(ModuleEnum.Operating); //暂时没有特定的UI
		CacheManager.certification.isGetSmReward = false;
		CacheManager.certification.isSendSm = false;
		this.isfirstGetSM = true;
		this.initView
	}

	protected initView():any{
		if(!this.moduleView){
			this.moduleView = new OperatingModule();
		}
		return this.moduleView;
	}

	protected addListenerOnInit():void{
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameShareRewardInfo],this.onGetShareReward,this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateIssm], this.onGetCerInfo, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateIssmRewardInfo], this.onMsgSmRewardGet, this)
		this.addListen0(LocalEventEnum.PlatformShowMicorReward,this.onShowMicroReward,this);
		this.addListen0(LocalEventEnum.PlatformShowFollowReward,this.onShowFollowReward,this);
		this.addListen0(LocalEventEnum.PlatformShowShareReward,this.onShowShareReward,this);
		this.addListen0(LocalEventEnum.CertificationOpenWindow,this.onShowCerWindow,this);
		this.addListen0(LocalEventEnum.CertificationOpenGiftWindow,this.onShowCerGiftWindow,this);
		this.addListen0(LocalEventEnum.CertificationSend,this.sendCertification,this);
		
	}	

	/**分享奖励领取返回 S2C_SShareRewardInfo */
	private onGetShareReward(data:any):void{
		//data.value_I
		CacheManager.platform.setShareRewardInfo(data);
		if(this.isShow){
			this.moduleView.updateShare();
		}
		if(this.shareWin && this.shareWin.isShow){
			this.shareWin.updateAll();
		}
		if(data.type==EShareRewardType.EShareRewardTypeMicro){
			if(Sdk.isNeedSaveToDesktop){
				EventManager.dispatch(LocalEventEnum.AddHomeIcon,IconResId.SaveDesktop);
			}else{
				EventManager.dispatch(LocalEventEnum.RemoveHomeIcon,IconResId.SaveDesktop);
			}
		}
		Log.trace(Log.TEST,"xx领取平台奖励返回 data.type",data.type);
		this.checkIcon();
	}

	private onGetCerInfo(data:any) {
		
		if(!CacheManager.certification.checkShowSMIcon()) {
			//return;
		}
		if(Sdk.platform_config_data.is_eissm == 3 && !CacheManager.certification.isSendSm) {
			ProxyManager.certification.sendCertificationFake();
			//return;
		}
		CacheManager.certification.issm = data.issm_I;
		CacheManager.certification.onlineHour = data.onlineHour_I;
		CacheManager.certification.onlineTime = data.onlineTime_I;
		if((CacheManager.certification.issm == 1||CacheManager.certification.issm == 3) && CacheManager.certification.isSendSm) {
			this.getSMReward();
			if(this.windowCer) {
				if(this.windowCer.isShow) {
					this.windowCer.hide();
					Tip.showRollTip("实名验证已通过");
				}
			}
			EventManager.dispatch(UIEventEnum.SMStatesUpdate);
		}
		if(CacheManager.certification.issm == 2 && CacheManager.certification.isSendSm) {
			this.getSMReward();
			if(this.windowCer) {
				if(this.windowCer.isShow) {
					this.windowCer.hide();
					Tip.showRollTip("实名验证已通过,未成年人将受到防沉迷系统管理");
				    EventManager.dispatch(UIEventEnum.SMStatesUpdate);
				}
			}
		}
		if(CacheManager.certification.issm == 0 && CacheManager.certification.isSendSm) {
			if(this.windowCer) {
				if(this.windowCer.isShow) {
					Tip.showRollTip("实名认证失败，身份证信息错误");
				    EventManager.dispatch(UIEventEnum.SMStatesUpdate);
				}
			}
		}
		if(!this.isfirstGetSM) {
			if(Sdk.platform_config_data.is_anti_addiction == 1) {
				if(CacheManager.certification.issm != 1) {
					if(CacheManager.certification.onlineHour == 1) {
						AlertII.show("您累计在线时间已经满1小时", null, null, null, [AlertType.YES]);
					}
					if(CacheManager.certification.onlineHour == 2) {
						AlertII.show("您累计在线时间已经满2小时", null, null, null, [AlertType.YES]);
					}
					if(CacheManager.certification.onlineHour == 7) {
						AlertII.show("您的账户防沉迷剩余时间将在5分钟后进入沉迷状态，系统将自动将您离线休息一段时间", null, null, null, [AlertType.YES]);
					}
					if(CacheManager.certification.onlineHour == 3) {
						AlertII.show("您已经进入不健康游戏时间，请您暂离游戏进行适当休息和活动，合理安排您的游戏时间。点击确定退出游戏",null,
						function(){ Sdk.SdkRefreshPage();},this,[AlertType.YES]);
					}
				} 
			}
		}
		else {
			if(Sdk.platform_config_data.is_anti_addiction == 1) {
				if(CacheManager.certification.onlineHour == 3) {
					//AlertII.show("您累计下线时间不满5小时，为了保证您能正常游戏，请您稍后登陆",null,
						//function(){ Sdk.SdkRefreshPage();})
				}
				else if(CacheManager.certification.onlineTime > 0) {
					var str = "账号已经纳入防沉迷系统，请填写身份信息以便更好地体验游戏。你已持续在线"+this.getTimeStr(CacheManager.certification.onlineTime)+","
							  +this.getTimeStr(3600*3 - CacheManager.certification.onlineTime) + "后将被强制下线，是否需要进行身份信息填写?";
					AlertII.show(str,null,this.onShowCerWindow,this,[AlertType.YES,AlertType.NO], ["填写","我未成年"], null);
				}
			}
		}
		this.isfirstGetSM = false;
		Log.trace(Log.TEST," xx 实名认证消息返回:",data);
	}
	
	private checkIcon():void{
		let isNeed:boolean = CacheManager.platform.isNeedEntrance();
		Log.trace(Log.TEST," xx checkIcon 是否需要平台图标:",isNeed);
		if(!isNeed){
			EventManager.dispatch(LocalEventEnum.RemoveHomeIcon,IconResId.Oprating);
			this.hide();
		}
	}

	private onShowMicroReward():void{
		if(!this.microWin){
			this.microWin = new MicroClientWindow();
		}
		this.microWin.show();
	}

	private onShowFollowReward():void{
		if(!this.followWin){
			this.followWin = new FollowRewardWindow();
		}
		this.followWin.show();
	}

	private onShowShareReward():void{
		if(!this.shareWin){
			this.shareWin = new ShareRewardWindow();
		}
		this.shareWin.show();
	}

	private onShowCerWindow() : void {
        if(!this.windowCer) {
            this.windowCer = new CertificationWindow();
        }
        this.windowCer.show();
    }

	private onShowCerGiftWindow() : void {
		if(!this.windowCerGift) {
			this.windowCerGift = new CertificationGiftWindow();
		}
		this.windowCerGift.show();
	}

	private sendCertification(name:string,card:string) : void {
		ProxyManager.certification.sendCertification(name,card);
		CacheManager.certification.isSendSm = true;
	}

	private onMsgSmRewardGet(data : any) {
		if(data == 0) {
			CacheManager.certification.isGetSmReward = false;
		}
		else {
			CacheManager.certification.isGetSmReward = true;
		}
	}

	private getSMReward() {
		console.log("获取奖励》》》》》》》》》》》》》》》》》》》》》》》》》》》");
		ProxyManager.certification.getGift();
	}

	public show(data?: any):void{
		super.show({});
		this.checkIcon();
	}

	private getTimeStr(time : number) : string {
		if(time < 60) {
			return time + "秒";
		}
		if(time >= 60 && time < 3600) {
			return time/60 + "分" + time%60 + "秒";
		}
		if(time >= 3600) {
			return time/3600 + "小时" + (time%3600)/60 + "分" + time%60 + "秒";
		}
		return "";
	}

}