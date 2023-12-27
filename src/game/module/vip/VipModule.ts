/**
 * Vip礼包模块
 */
class VipModule extends BaseTabModule
{
    private c1: fairygui.Controller;
    public constructor()
    {
        super(ModuleEnum.VIP, PackNameEnum.VIP);
    }

    public initOptUI(): void
    {
        super.initOptUI();
        this.className = {
            [PanelTabType.VipActive]:["VipActivePanel", VipActivePanel,PackNameEnum.VIP],
            [PanelTabType.VipGiftPackage]:["VipGiftPackagePanel", VipGiftPackagePanel, PackNameEnum.VipGift]
        };

        this.c1 = this.getController("c1");
    }

    public updateAll(data?: any): void
    {
        this.updateVip(data);
        this.updateVipGiftPackageTips();
        this.updateVipTips();
    }

    protected updateSubView():void {
		if(this.curPanel instanceof VipGiftPackagePanel){
            this.c1.selectedIndex = 1;
            if (CacheManager.vipGift.checkVipGiftTips(EVipGiftPackageType.EVipGiftPackageTypeCommon)
                && CacheManager.vipGift.tabFlag) {//首次点击时派发红点消失
                CacheManager.vipGift.tabFlag = false;
                this.updateVipGiftPackageTips();
                EventManager.dispatch(LocalEventEnum.VipGiftTips);
            }
        }else{
			this.c1.selectedIndex = 0;
		}
	}

    public updateVip(data:any):void {
        if(this.isTypePanel(PanelTabType.VipActive)) {
            this.curPanel.updateAll(data);
        }
    }

    public updateVipRewardGet(): void {
        if(this.isTypePanel(PanelTabType.VipActive)) {
            this.curPanel.updateNext();
        }
    }

    public updateVipItemGet():void {
        if(this.isTypePanel(PanelTabType.VipActive)) {
            this.curPanel.updateItemGet();
        }
    }

    public updateVipGiftItemGet():void {
        if(this.isTypePanel(PanelTabType.VipGiftPackage)) {
            this.curPanel.updateItemGet();
        }
    }

    public updateVipGiftPackageInfo():void {
        if(this.isTypePanel(PanelTabType.VipGiftPackage)) {
            (this.curPanel as VipGiftPackagePanel).updateGiftPackageInfo();
        }
        this.updateVipGiftPackageTips();
    }

    /**VIP礼包红点 */
    private updateVipGiftPackageTips(): void {
        let flag: boolean = CacheManager.vipGift.tabFlag && CacheManager.vipGift.checkVipGiftTips(EVipGiftPackageType.EVipGiftPackageTypeCommon);
        this.setBtnTips(PanelTabType.VipGiftPackage, flag);
    }

    public updateVipTips():void {
        this.setBtnTips(PanelTabType.VipActive, !!CacheManager.vip.getFirstVipLevelReward());
    }

    public hide():void {
        super.hide();

    }

}