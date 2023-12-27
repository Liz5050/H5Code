class TitleController {
	// private titleWindow: TitleWindow;
	private _module:FashionModuleII;
	public constructor() {
	}

	public set module(module:FashionModuleII) {
		this._module = module;
	}

	protected addListen0(name: any, listener: Function, listenerObj: any): void {
		EventManager.addListener(name, listener, listenerObj);
	}

	/**
     * 添加服务器消息监听
     */
    protected addMsgListener(type: string, listener: Function, listenerObj: any): void {
        App.MessageCenter.addListener(type, listener, listenerObj);
    }

	public addListenerOnInit(): void {
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateMyTitles], this.onTitlesUpdate, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateUseTitle], this.onTitleUseUpdate, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateTitleTimeOut], this.onTitleTimeOut, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateTitleGet], this.onAddTitleHandler, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateTitieRemove], this.onRemoveTitleHandler, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateTitleUpdate], this.onTitleUpdate, this);

		this.addListen0(LocalEventEnum.TitleUse,this.onUseTitleHandler,this);
		this.addListen0(LocalEventEnum.TitleUnload,this.onUnloadTitleHandler,this);
		
		// ECmdGateMyTitles					= 12290,	//玩家当前称号 ::Message::Game::SSeqTitle [Message/Game/ITitle.cdl]
		// ECmdGateTitleTimeOut				= 12291,	//称号到期	   ::Message::Game::STitle [Message/Game/ITitle.cdl]
		// ECmdGateTitleGet					= 12292,	//获得称号	   ::Message::Game::STitle [Message/Game/ITitle.cdl]
		// ECmdGateTitieRemove					= 12293,	//移除称号	   ::Message::Game::STitle [Message/Game/ITitle.cdl]
		// ECmdGateTitleUpdate					= 12294,	//称号更新	   ::Message::Game::STitle [Message/Game/ITitle.cdl]
		// ECmdGateUseTitle					= 12295,	//佩戴称号	   ::Message::Game::STitle [Message/Game/ITitle.cdl]
	}

	private updateTitleState():void {
		if(this._module && this._module.isShow)
		{
			this._module.updateTitleState();
		}
	}
	/**
	 * 称号列表更新（登陆推送）
	 * SSeqTitle [ITitle.cdl]
	 */
	private onTitlesUpdate(data: any): void {
		// data.titles.data;
		CacheManager.title.updateTitleList(data.titles.data);
	}

	/**
	 * 更新佩戴中的称号
	 * STitle [ITitle.cdl]
	 */
	private onTitleUseUpdate(data: any): void {
		CacheManager.title.updateInUseTitle(data);
		this.updateTitleState();
		EventManager.dispatch(NetEventEnum.RoleTitleUpdate,data.roleIndex_I);
	}

	/**
	 * 称号到期
	 * STitle
	 */
	private onTitleTimeOut(data:any):void {
		CacheManager.title.removeTitle(data);
		this.updateTitleState();
	}

	/**
	 * 新增称号
	 * STitle
	 */
	private onAddTitleHandler(data:any):void {
		CacheManager.title.addTitle(data);
		let titleCfg:any = ConfigManager.title.getByPk(data.titleCode_I);
		if(titleCfg)
		{
			let useTitleCfg:any;
			let useTitle:any = CacheManager.title.getUseTitle(0);
			if(useTitle)
			{
				useTitleCfg = ConfigManager.title.getByPk(useTitle.titleCode_I);
			}
			if(!useTitle || useTitleCfg && useTitleCfg.warfare < titleCfg.warfare)
			{
				//直接佩戴战力较高的称号
				this.onUseTitleHandler(titleCfg.code);
			}
			HomeUtil.open(ModuleEnum.Open,false,{isTitle:true,cfg:titleCfg});
		}
		this.updateTitleState();
	}

	/**
	 * 移除称号
	 * STitle
	 */
	private onRemoveTitleHandler(data:any):void {
		CacheManager.title.removeTitle(data);
		this.updateTitleState();
	}

	/**
	 * 称号更新
	 * 
	 */
	private onTitleUpdate(data:any):void {
		CacheManager.title.updateTitle(data);
		this.updateTitleState();
	}

	/**
	 * 佩戴称号请求
	 */
	private onUseTitleHandler(titleCode:number):void {
		ProxyManager.title.useTitle(titleCode,CacheManager.title.operationIndex);
	}

	/**
	 * 卸下称号请求
	 */
	private onUnloadTitleHandler():void {
		ProxyManager.title.unloadTitle(CacheManager.title.operationIndex);
	}
}