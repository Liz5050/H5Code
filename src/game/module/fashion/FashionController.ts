class FashionController extends BaseController{
	private module: FashionModule;

	public constructor() {
		super(ModuleEnum.Fashion);
		this.viewIndex = ViewIndex.Two;
	}

	public initView(): BaseGUIView{
		this.module = new FashionModule(this.moduleId);
		return this.module;
	}

	public addListenerOnInit():void{
		// this.addMsgListener(EGateCommand[EGateCommand.ECmdGateFashionList], this.updateFashionList, this);
		// this.addMsgListener(EGateCommand[EGateCommand.ECmdGateFashionInfo], this.updateFashionInfo, this);
	}

	public addListenerOnShow(): void{
		this.addListen1(NetEventEnum.packBackPackItemsChange, this.backpackChange, this);
        this.addListen1(NetEventEnum.packPosTypeBagChange, this.backpackChange, this);
	}

	/**登录更新装扮列表 */
	private updateFashionList(data: any): void{
		for(let info of data.fashions.data){
			switch(info.type_I){
				case 1:
					CacheManager.clothesFashion.activesFashion = info;
					break;
				case 2:
					CacheManager.weaponFashion.activesFashion = info;
					break;
			}
		}
		
	}

	/**操作更新装扮列表 */
	private updateFashionInfo(data: any): void{
		switch(data.type_I){
			case 1:
				CacheManager.clothesFashion.activesFashion = data;
				this.module.clothesFashionPanel.setChanges();
				break;
			case 2:
				CacheManager.weaponFashion.activesFashion = data;
				this.module.weaponFashionPanel.setChanges();
				break;
		}
	}

	private backpackChange():void{
		switch(this.module.controller.selectedIndex){
			case 0:
				this.module.clothesFashionPanel.updateItem();
				break;
			case 1:
				this.module.weaponFashionPanel.updateItem();
				break;
		}
		this.module.updateBtnTips();
	}
}