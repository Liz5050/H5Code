/**
 * 公共模块
 */
class CommonController extends BaseController {
	// private playerInfoWindow: PlayerInfoWindow;
	private playerMenu:PlayerMenuView;
	//是否显示查看结果
	private canShow:boolean = true;
	//是否直接打开查看界面，不显示菜单
    private showInfo:boolean = false;
    //是否查看战力
    private showFc: boolean;

	// private messageComplete:boolean = true;
	public constructor() {
		super(ModuleEnum.Common);
	}

	protected addListenerOnInit(): void {
		// this.addListen0(LocalEventEnum.CommonViewPlayerInfo, this.showPlayerInfoHandler, this);
		this.addListen0(LocalEventEnum.CommonViewPlayerMenu,this.getPlayerInfoHandler,this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateLookUpPlayerReply], this.onLookUpPlayerReply, this);
	}

	/**
	 * 请求玩家信息
	 * @param showInfo 是否直接打开查看界面，不显示菜单
	 * @param canShow 是否显示查看结果
	 * @param showError 是否显示后端的错误提示
	 */
	private getPlayerInfoHandler(data: any,showInfo:boolean = false,canShow:boolean = true,showFc:boolean = true): void {
		// if(!this.messageComplete) {
		// 	Tip.showTip("正在请求数据，请稍后");
		// 	return;
		// }
		// this.messageComplete = false;
		if (data != null) {
			this.canShow = canShow; 
			this.showInfo = showInfo;
			this.showFc = showFc;
			let showError:boolean = data.showError == false ? false : true;
			let from:ECopyType = !data.from ? 0 : Number(data.from);
			ProxyManager.operation.lookupPlayer(data.toEntityId,null,true,showError,from);
		}
	}

	/**
	 * 查看玩家信息返回
	 * @param data SLookupPlayerReply
	 */
	private onLookUpPlayerReply(data: any): void {
		// this.messageComplete = true;
		if(this.showInfo) {
			CommonController.lookupPlayer(data, this.showFc);
			return;
		}
		if(!this.canShow) {
			EventManager.dispatch(NetEventEnum.LookUpPlayerUpdate,data);
			return;
		}
		if(!this.playerMenu) {
			this.playerMenu = new PlayerMenuView();
		}
		this.playerMenu.show(data);
	}

	/**查看玩家 */
	// private showPlayerInfoHandler(data:any):void {
	// 	if (this.playerInfoWindow == null) {
	// 		this.playerInfoWindow = new PlayerInfoWindow();
	// 	}
	// 	this.playerInfoWindow.show(data);
	// }

    public static lookupPlayer(data: any, showFc:boolean = true) {
        let viewIdx:number = UIManager.isShow(ModuleEnum.Chat) || UIManager.isShow(ModuleEnum.Friend)?ViewIndex.One:ViewIndex.Two; //主界面聊天打开 需要显示返回按钮
        let parent: fairygui.GComponent = LayerManager.UI_Main;
        if(UIManager.isShow(ModuleEnum.Team)) {
            parent = LayerManager.UI_Popup;
        }
        EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.PlayerOther,{playerData : data, parent: parent, showFc: showFc},viewIdx);
    }
}