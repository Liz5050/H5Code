
class ShopController extends BaseController {
    private module: ShopModule;
    private spiritRenewWindow: WindowSpiritRenew;
    private bestEquipWindow: WindowBestEquip;
    private scollData: any;
    private buyWindow:BuyWindow;
    public constructor() {
        super(ModuleEnum.Shop);
    }

    public initView(): BaseGUIView {
        this.module = new ShopModule(this.moduleId);
        return this.module;

    }
    public addListenerOnInit(): void {
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateShopLimit], this.onShopLimit, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateMyMysteryShop], this.onMysteryShop, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateMyMysteryShopTime], this.onMysteryShopTime, this);
        this.addListen0(LocalEventEnum.ShopBuyItem, this.shopBuyItem, this);
        this.addListen0(LocalEventEnum.ShopBuyAndUse, this.onBuyAndUseItem, this);
        // this.addListen0(LocalEventEnum.ShopRenewSpirit, this.renewSpirit, this);
        this.addListen0(UIEventEnum.ShopRenewSpiritOpen, this.renewSpiritOpen, this);
        this.addListen0(UIEventEnum.ShopBuyOpen, this.openShop, this);
        this.addListen0(UIEventEnum.QuickShopBuyOpen,this.onOpenQuickBuyHandler,this);
        this.addListen0(UIEventEnum.BestEquipOpen, this.bestEquipOpen, this);


        // this.addListen0(NetEventEnum.moneyGoldUpdate, this.updateGold, this);
        // this.addListen0(NetEventEnum.moneyGoldBindUpdate, this.updateGoldBind, this);
        // this.addListen0(NetEventEnum.moneyHonourUpdate, this.updateHonour, this);
    }

    public addListenerOnShow(): void {
		this.addListen1(LocalEventEnum.MysteryShopFreeRefresh, this.mysteryShopFreeRefresh, this);
        this.addListen1(NetEventEnum.packPosTypePropChange, this.onPropPackChangeHandler, this);
	}

    /**
     * 神秘商店信息更新
     * @param data SSeqMysteryShop
     */
    private onMysteryShop(data: any): void{
        CacheManager.shop.mysteryGoods = data.mysteryShops.data;
        if(this.isShow){
            this.module.updateShop();
        }
    }

    /**
     * 神秘商店免费刷新时间更新
     * @param data SMysteryShopTime
     */
    private onMysteryShopTime(data: any): void{
        if(data.endDt_DT){
            CacheManager.shop.mysteryRefreshTime = data.endDt_DT;//下次免费刷新时间处理
            CacheManager.shop.startCountdown();//倒计时
        }
        if(this.isShow){
            this.module.updateShop();
        }
        EventManager.dispatch(LocalEventEnum.HomeIconSetTip, IconResId.Shop, CacheManager.shop.checkTips());
    }

    /**更新元宝 */
    private updateGold(): void {
        if (this.isShow) {
            this.module.updateMoney();
        }
    }

    /**更新绑定元宝 */
    private updateGoldBind(): void {
        if (this.isShow) {
            this.module.updateMoney();
        }
    }

    /**更新荣誉 */
    private updateHonour(): void {
        if (this.isShow) {
            this.module.updateMoney();
        }
    }

    /**
     * 更新限购物品的购买量
     * @param data SAttribute
     */
    private onShopLimit(data: any): void {
        let jobj = JSON.parse(data.valueStr_S);
        CacheManager.shop.limitGoods = jobj;
        if (this.module && this.module.isShow) {
            this.module.updateShop();
        }
    }

    /**
     * 购买物品
     * @param itemCode
     * @param shopCode
     */
    private shopBuyItem(itemCode: any, shopCode: number, amount: number, npcId: any = 0): void {
        ProxyManager.shop.buyItem(npcId, shopCode, itemCode, amount, 0, false);
    }

    /**
     * 购买并立即使用某个物品
     * @param itemCodeOrData 传code或者ItemData
     * @param shopCode
     * @param infEx    其他参数 具体查看接口
     */
    protected onBuyAndUseItem(itemCodeOrData: any, shopCode: number, infEx: any = null): void {

        var code: number = 0;
        if (typeof (itemCodeOrData) == "number") {
            code = itemCodeOrData;
        } else {
            code = itemCodeOrData.getCode();
        }
        !infEx ? infEx = {} : "";
        var npcId: number = infEx.npcId ? infEx.npcId : 0; //
        var amount: number = infEx.amount ? infEx.amount : 1; //购买数量
        var useAmount: number = infEx.useAmount ? infEx.useAmount : 1; //使用数量
        var discountCardCode: number = infEx.discountCardCode ? infEx.discountCardCode : 0; //折扣卡code
        var useDiscountCard: number = infEx.useDiscountCard ? infEx.useDiscountCard : 0; //是否使用折扣卡

        ProxyManager.shop.buyAndUseItem(npcId, shopCode, code, amount, useAmount, discountCardCode, useDiscountCard);

    }

    /**
     * 打开守护续费面板
     */
    private renewSpiritOpen(itemData: ItemData): void {
        if (ItemsUtil.isTrueItemData(itemData)) {
            if (this.spiritRenewWindow == null) {
                this.spiritRenewWindow = new WindowSpiritRenew();
            }
            this.spiritRenewWindow.setItemData(itemData);
            this.spiritRenewWindow.show();
        }
    }

    /**
     * 守护续费
     */
    private renewSpirit(itemData: ItemData): void {
        if (ItemsUtil.isTrueItemData(itemData)) {
            ProxyManager.shop.renewSpirit(itemData.getUid());
        }
    }

    /**
     * 续费成功
     */
    private onSpiritRenewSuccess(data: any): void {
        let uid: string = data.uid;
        let itemData: ItemData = CacheManager.pack.backPackCache.getItemByUid(uid);
    }

    private openShop(itemData: ItemData): void {
        let code: number = ItemsUtil.getbindCode(itemData.getCode());
        let sellData: Array<any> = ConfigManager.shopSell.select({ "itemCode": code });
        if (sellData.length > 0) {
            let shopData: any = ConfigManager.shop.getByPk(sellData[0].shopCode);
            if (shopData) {
                let shopId: Array<number> = CacheManager.shop.shops;
                for (let i = 0; i < shopId.length; i++) {
                    if (shopData.code == shopId[i]) {
                        this.scollData = { "index": i, "goodData": sellData[0] };
                        this.show(this.scollData);
                        // this.module.scrollToGoods(i, sellData[0]);
                    }
                }
            }

        }
    }

    /**打开快速购买 */
    private onOpenQuickBuyHandler(code:number,cb:CallBack=null):void {
        if(!this.buyWindow) {
            this.buyWindow = new BuyWindow();
        }
        this.buyWindow.setBuyCb(cb);
        this.buyWindow.show(code);
        
    }

    /**
     * 打开极品装备预览面板
     */
    private bestEquipOpen(): void {
        if (this.bestEquipWindow == null) {
            this.bestEquipWindow = new WindowBestEquip();
        }
        this.bestEquipWindow.show();
    }

    private mysteryShopFreeRefresh(): void{
        this.module.updateBtnTips();
    }

    /**道具背包发生改变 */
	private onPropPackChangeHandler(): void {
		if(this.isShow){
            this.module.updateProp();
        }
	}
}