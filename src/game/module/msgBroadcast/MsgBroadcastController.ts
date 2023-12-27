/**
 * 消息广播
 */
class MsgBroadcastController extends BaseController {
	private module: MsgBroadcastModule;
	public constructor() {
		super(ModuleEnum.MsgBroadcast);
		this.viewIndex = ViewIndex.Zero;
	}

	public initView(): BaseModule {
		this.module = new MsgBroadcastModule(this.moduleId);
		return this.module;
	}

	public addListenerOnInit(): void {
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicErrorMsg], this.onErrorMsg, this);
		this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicNoticeMsg], this.onNoticeMsg, this);

		this.addListen0(LocalEventEnum.ShowBroad, this.onNoticeMsg, this);
		this.addListen0(LocalEventEnum.ShowRollTip, this.showRollTip, this);
		this.addListen0(LocalEventEnum.ChatAddToBroad, this.onChatAddBroad, this);
		this.addListen0(LocalEventEnum.ChangeMap, this.onChangeMap, this);
		this.addListen0(LocalEventEnum.ShowBroadStory, this.onShowBroadStory, this);
		this.addListen0(LocalEventEnum.ShowBroadTopTip, this.onShowTopTip, this);		
		
	}

	private onErrorMsg(data: any): void {
		if (!ConfigManager.errorCode) {//外网新手创建角色时才会出现配置没加载完成的情况。这时报错只有角色名称重复或含有屏蔽词
			AlertII.show("角色名称错误，请重新填写", null, null, this,[AlertType.YES]);
			return;
		}
		let error: any = ConfigManager.errorCode.getByPk(data.code_I);
		if (!error) {
			Log.trace(Log.GAME, `===>>>客户端找不到服务器错误码为 ${data.code_I} 的描述<<<===`)
		} else {
			let msg: string = error.showServerMsg ? data.message_S : error.errorStr;
			if (error.display > 0) {//error.display->显示位置，后续接入到广播
				if (error.display == EShowArea.EShowAreaHistory) {
					Tip.addTip(HtmlUtil.html(msg, Color.ItemColorHex[error.color]), TipType.LeftBottomText);
				} else {
					//this.showRollTip(msg, Color.ItemColorHex[error.color]);
					if (ResourceManager.isPackageLoaded(PackNameEnum.Common)) {
						Tip.showLeftTip(HtmlUtil.html(msg, Color.ItemColorHex[error.color]));
					}
				}
			}

            this.handleError(error.errorName, error.errorStr);
            if (App.DebugUtils.isDebug || (msg != "目标选择不对" && msg != "攻击中断"))
            	Log.trace(Log.SERR, msg);
		}

	}

	/**
	 * 处理广播内容
	 * @param data SPublicNotice
	 */
	private onNoticeMsg(data: any): void {
		Log.trace(Log.TEST,"SPublicNotice",data);		
		data = ChatUtils.fmtBroadMsg(data);
		data.createDt = egret.getTimer();
		if(data.type_I==EChatType.EChatTypeGuild){
			let schat:any = ChatUtils.noticeToChatMsg(data);			
			EventManager.dispatch(LocalEventEnum.ChatAddChanelMsg,schat);
			return;
		}
		let isSys:boolean = false; //是否系统消息
		var area: number = data.area_I;
		if (BitUtils.band(area, EShowArea.EShowAreaMiddle) != 0) { //跑马灯			
			Log.trace(Log.TEST,"收到跑马灯数据：",data);	
			isSys = true;						
			CacheManager.chat.setBroadMsg(data, EShowArea.EShowAreaMiddle);
			if (this.isShow) {
				this.module.showRound();
			}
		}
		let isDfCp:boolean = BitUtils.band(area, EShowArea.EShowAreaDefenseCopy) != 0;
		if(isDfCp){
			Log.trace(Log.TEST,"---------- 收到守卫神剑广播数据 -------------：",data);
			let schat:any = ChatUtils.noticeToChatMsg(data);
			CacheManager.chat.addDfCopyLog(schat);
		}
		if (BitUtils.band(area, EShowArea.EShowAreaMiddleTop) != 0 || isDfCp) { //场景广播
			Log.trace(Log.TEST,"收到场景广播数据：",data);			
			isSys = true;					
			CacheManager.chat.setBroadMsg(data, EShowArea.EShowAreaMiddleTop);
			if (this.isShow) {
				this.module.showRadio();
			}
		}
		if (BitUtils.band(area, EShowArea.EShowAreaRightDown) != 0) {
			this.showRollTip(data.content_S);
		}
		if (BitUtils.band(area, EShowArea.EShowAreaChat) != 0) { //聊天区域

		}
		if (BitUtils.band(area, EShowArea.EShowAreaMiddleDown) != 0) {//剧情
			let inf: any = ConfigManager.propertiesMsg.getByPk(data.msgKey_S);
			let stayTime:number = inf && inf.duration?inf.duration:MsgBroadcastModule.STORY_SEC;
			this.showStory(data, false,stayTime);
		}
		if(BitUtils.band(area, EShowArea.EShowAreaExplorer) != 0) {//寻宝 
			EventManager.dispatch(NetEventEnum.LotteryBroadcastUpdate,{type:data.code_I,record:data});
		}
		if(data.type_I==EChatType.EChatTypeCrossEx){ //跨服广播 添加到跨服频道
			let schat:SChatMsg = ChatUtils.noticeToChatMsg(data);			
			EventManager.dispatch(LocalEventEnum.ChatAddChanelMsg,schat);
			isSys = false;
		}
		
		if(isSys){ //所有系统消息立马更新 2018年9月14日10:50:42
			let schat:any = ChatUtils.noticeToChatMsg(data);			
			EventManager.dispatch(LocalEventEnum.ChatAddChanelMsg,schat);
		}		

	}
	private showStory(data: any, isFirst: boolean, delay:number = MsgBroadcastModule.STORY_SEC): void {
		CacheManager.chat.setBroadMsg(data, EShowArea.EShowAreaMiddleDown);
		if (this.isShow) {
			this.module.showStory(false, delay);
		}
	}

	private onShowTopTip(msg:string):void{
		if (this.isShow) { //显示顶部缩放提示信息，目前会马上顶掉上一条显示
			this.module.showTopTip(msg);
		}
	}
	private onShowBroadStory(data: any): void {
		let msgInf: any = { content_S: data.msg, changeMapNoClear: data.changeMapNoClear};
		this.showStory(msgInf, data.isFirst, data.delay);
	}

	private onChangeMap(data: any): void {
		if (this.isShow) {
			CacheManager.chat.clearBroadMsg(EShowArea.EShowAreaMiddleDown);
			this.module.hideStory();
		}
	}

	private onChatAddBroad(data: any, area: number): void {
		var msg: SChatMsg = <SChatMsg>data;
		var notice: any = {};
		notice.content_S = msg.content_S;
		notice.type_I = msg.chatType_I;
		CacheManager.chat.setBroadMsg(notice, area);
		switch (area) {
			case EShowArea.EShowAreaMiddle:
				if (this.module) {
					this.module.showRound();
				}
				break;
		}
	}

	private showRollTip(tip: string, color: number = Color.White): void {
		if (this.isShow) {
			this.module.showRollTip(tip, color);
		}
	}

	/**
	 * 一些错误码的客户端操作
	 */
	private handleError(errorName: string, errorStr: string = ""): void {
		switch (errorName) {
			case "ErrorCell_MoveInputPointError": //坐标混乱时，先恢复正常
				// CacheManager.king.stopKingEntity();
				break;
			case "ErrorCell_FightToBossMaxTire":
			case "ErrorGate_TireZero":
			case "ErrorPublic_FightToBeastIslandBossMaxTire":
			case "ErrorCell_MovePointCanNotMove":
				Tips.show(errorStr);
				break;
			case "ErrorLogin_GameMaintenance":
                AlertII.show("该服务器正在维护中",null,null, this,[AlertType.YES]);
                break;
			case "ErrorLogin_LoginInfoErrorContactWithGM":
			case "ErrorLogin_NeedLoginFromPlatform":
                AlertII.show(errorStr,null,function(){
					if (ControllerManager.createRole.isShow) {
						location.reload();
					}
				}, this,[AlertType.YES]);
                break;
			case "ErrorLogin_NoRole":
			case "ErrorLogin_RoleNameIsToLong":
			case "ErrorLogin_CreateRoleNameError":
			case "ErrorLogin_CreateRoleDataError":
			case "ErrorLogin_UserNameError":
			case "ErrorLogin_ErrorCodeVersion":
			case "ErrorLogin_MaxPlayerRoleLimit":
			// case "ErrorLogin_GameMaintenance":
			case "ErrorLogin_ErrorNoCard":
			case "ErrorLogin_NeedQueue":
                AlertII.show(errorStr,null,null, this,[AlertType.YES]);
                break;
            case "ErrorGate_OnlieDropBagFull":
                // EventManager.dispatch(LocalEventEnum.ShowSmeltTipsWin, 20);
                break;
            default:
                // AlertII.show(errorStr,null,null, this,[AlertType.YES]);
				break;
		}
	}
}