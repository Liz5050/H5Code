/**
 * Vip礼包模块
 */
class VipGiftModule extends BaseTabModule
{
    

    public constructor()
    {
        super(ModuleEnum.VipGift, PackNameEnum.VipGift);
    }

    public initOptUI(): void
    {
        super.initOptUI();
        this.className = {
            [PanelTabType.VipGiftPackage]:["VipGiftPackagePanel", VipGiftPackagePanel]
        };

        let bg:GLoader = this.getGObject("loader_bg") as GLoader;
        bg.load(URLManager.getModuleImgUrl("vipgift_bg.jpg", PackNameEnum.VipGift));
    }

    public updateAll(data?: any): void
    {
        this.updateVipGiftPackageTips();
    }

    public updateVipGiftPackageInfo():void {
        if(this.isTypePanel(PanelTabType.VipGiftPackage)) {
            (this.curPanel as VipGiftPackagePanel).updateGiftPackageInfo();
        }
        this.updateVipGiftPackageTips();
    }

    /**VIP礼包红点 */
    private updateVipGiftPackageTips(): void {
        let flag: boolean = CacheManager.vipGift.checkVipGiftTips(EVipGiftPackageType.EVipGiftPackageTypeCommon);
        this.setBtnTips(PanelTabType.VipGiftPackage, flag);
    }

    public hide():void {
        super.hide();
        
    }

}