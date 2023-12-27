class FashionPlayerController {
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
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateFashionList], this.updateFashionList, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateFashionInfo], this.updateFashionInfo, this);
	}

	/**登录更新装扮列表 */
	private updateFashionList(data: any): void{
		CacheManager.fashionPlayer.updateFashionList(data.fashions.data);
		if(this._module && this._module.isShow){
			this._module.updateFashionInfo();
		}
		// for(let info of data.fashions.data){
		// 	switch(info.type_I){
		// 		case 1:
		// 			CacheManager.clothesFashion.activesFashion = info;
		// 			break;
		// 		case 2:
		// 			// CacheManager.weaponFashion.activesFashion = info;
		// 			break;
		// 	}
		// }
		
	}

	/**操作更新装扮列表 */
	private updateFashionInfo(data: any): void{
		CacheManager.fashionPlayer.updateFashion(data);
		if(this._module && this._module.isShow){
			this._module.updateFashionInfo();
		}
		// switch(data.type_I){
		// 	case 1:
		// 		// CacheManager.clothesFashion.activesFashion = data;
		// 		// this.module.clothesFashionPanel.setChanges();
		// 		break;
		// 	case 2:
		// 		// CacheManager.weaponFashion.activesFashion = data;
		// 		// this.module.weaponFashionPanel.setChanges();
		// 		break;
		// }
	}
}