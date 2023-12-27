/**
 * 商城模块
 */

class ShopModule extends BaseTabModule{

	public constructor(moduleId: ModuleEnum) {
		super(ModuleEnum.Shop, PackNameEnum.Shop);
		this.indexTitle = false;
	}

	public initOptUI(): void{
		super.initOptUI();
		this.className = {
			[PanelTabType.ShopMystery]:["ShopMysteryPanel",ShopMysteryPanel],
			[PanelTabType.ShopProp]:["ShopPropPanel",ShopPropPanel]
		};
	}

	public updateAll(data: any = null): void{
		this.updateBtnTips();
	}

	public updateShop(): void{
		if(this.curPanel instanceof ShopPropPanel){
			this.curPanel.updateList();
		}else if(this.curPanel instanceof ShopMysteryPanel){
            this.curPanel.updateAll();
			this.updateBtnTips();
        }
	}

	public updateProp(): void{
		if(this.curPanel instanceof ShopMysteryPanel){
            this.curPanel.updateProp();
        }
	}

	public updateBtnTips():void {
        this.setBtnTips(PanelTabType.ShopMystery, CacheManager.shop.checkFreeRefresh(), null, true);
    }

	protected getTabListDefaultItem():string {
		return URLManager.getPackResUrl(PackNameEnum.Shop, "ShopTabButtonItem");
	}

}