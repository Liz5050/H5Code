class ArenaSubController {
	private _module:ArenaModule;
	public constructor() {
		this.addListenerOnInit();
	}

	public set module(module:ArenaModule) {
		this._module = module;
	}

	public get module():ArenaModule {
		return this._module;
	}

	protected addListenerOnInit():void {
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

	public get isShow():boolean {
		return this._module && this._module.isShow;
	}
}