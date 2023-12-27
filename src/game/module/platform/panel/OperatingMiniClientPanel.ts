class OperatingMiniClientPanel extends OperatingBgPanel {
	public constructor() {
		super();
		this.rewardType = EShareRewardType.EShareRewardTypeMicro;
	}
	protected initOptUI():void{
		super.initOptUI();
		this.txtFight.visible = true;		
	}

	protected isSaveDestop():boolean{
		return this._tabType==PanelTabType.SaveDesktop;
	}

	protected doOperating():void{
        if(this.isSaveDestop() && !CacheManager.platform.isGetDestopReward()){ //IOS平台
			Sdk.saveToDesktop();
            ProxyManager.operation.getPlatformReward(this.rewardType);
        }else{
            Sdk.platformOperation(this.rewardType);
        }
        HomeUtil.close(ModuleEnum.Operating);
    }

	protected getBgUrl():string{
        let name:string = PanelTabType[this._tabType].toLowerCase();
		if(this._tabType==PanelTabType.SaveDesktop){
			name = 'miniclient'; 
		}
		//miniclient.jpg
        return URLManager.getModuleImgUrl(`${name}.jpg`,PackNameEnum.Operating);
    }
}