class ShopMysteryPanel extends BaseTabView {
	private goodList: List;
	private endTimeTxt: fairygui.GTextField;
	private goldTxt: fairygui.GTextField;
	private propTxt: fairygui.GRichTextField;
	private refreshGroup: fairygui.GGroup;
	private bestEquipBtn: fairygui.GButton;
	private refreshBtn: fairygui.GButton;
	private buyBtn: fairygui.GButton;

	private controller: fairygui.Controller;
	private refreshGoldCost: number;
	private propCode: number;
	private isHasProp: boolean;

	public constructor() {
		super();
	}

	public initOptUI(): void {
		this.goodList = new List(this.getGObject("list_good").asList);
		this.endTimeTxt = this.getGObject("txt_time").asTextField;
		this.goldTxt = this.getGObject("txt_gold").asTextField;
		this.propTxt = this.getGObject("txt_prop").asRichTextField;
		this.refreshGroup = this.getGObject("group_refresh").asGroup;
		this.bestEquipBtn = this.getGObject("btn_bestEquip").asButton;
		this.refreshBtn = this.getGObject("btn_refresh").asButton;
		this.buyBtn = this.getGObject("btn_buy").asButton;
		this.controller = this.getController("c1");

		this.refreshBtn.addClickListener(this.clickRefresh, this);
		this.bestEquipBtn.addClickListener(this.clickBestEquip, this);
		this.buyBtn.addClickListener(this.clickBuyBtn, this);

		this.refreshGoldCost = ConfigManager.const.getConstValue("MysteryShopGoldCost");
		this.propCode = ConfigManager.const.getConstValue("MysteryShopKeyItemCode");
		this.goldTxt.text = this.refreshGoldCost.toString();
	}

	public updateAll(): void {
		this.updateList();
		this.updateTime();
		this.updateProp();

		EventManager.dispatch(LocalEventEnum.HomeIconSetTip, IconResId.Shop, CacheManager.shop.checkTips());
	}

	/**刷新 */
	private clickRefresh(): void {
		let hasDiscount: boolean = false;
		for (let i = 0; i < this.goodList.list.numItems; i++) {
			let goodItem: ShopMysteryItem = <ShopMysteryItem>this.goodList.list.getChildAt(i);
			let goodData: any = goodItem.getData();
			if(goodData.discount_I == 5){
				hasDiscount = true;
				break;
			}
		}
		if(hasDiscount){
			AlertII.show(`当前有5折巨惠商品，确定放弃购买吗？`, null, function (type: AlertType){
				if(type == AlertType.YES){
					this.refreshGood();
				}
			}, this);
		}else{
			this.refreshGood();
		}
	}

	private refreshGood(): void{
		if(CacheManager.shop.checkFreeRefresh() || this.isHasProp || MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold, this.refreshGoldCost)){
			ProxyManager.shop.refreshMysteryShop();//刷新商品
		}
	}

	/**极品装备预览 */
	private clickBestEquip(): void {
		EventManager.dispatch(UIEventEnum.BestEquipOpen);
	}

	/**购买全部 */
	private clickBuyBtn(): void {
		if(this.controller.selectedIndex == 0){
			let itemCodes: Array<number> = [];
			let amounts: Array<number> = [];
			let coinCost: number = 0;
			let goldCost: number = 0;
			let isEquip: boolean = false;
			for (let i = 0; i < this.goodList.list.numItems; i++) {
				let goodItem: ShopMysteryItem = <ShopMysteryItem>this.goodList.list.getChildAt(i);
				let goodData: any = goodItem.getData();
				if (goodItem.isCanBuy) {
					itemCodes.push(goodData.itemCode_I);
					amounts.push(goodData.amount_I);

					if(goodData.unit_I == EPriceUnit.EPriceUnitCoinBind){
						coinCost += goodData.price_I;
					}else if(goodData.unit_I == EPriceUnit.EPriceUnitGold){
						goldCost += goodData.price_I;
					}
					if(goodItem.isEquip){
						isEquip = true;
					}
				}
			}
			if(MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold, goldCost)){
				if(MoneyUtil.checkCoinEnough(EPriceUnit.EPriceUnitCoinBind, coinCost)){
					if(ItemsUtil.checkSmeltTips(false, 5) && isEquip){
						Tip.showTip("背包已满，无法购买");
					}else{
						if (itemCodes.length > 0) {
							ProxyManager.shop.bugMysteryShopItem({ "data_I": itemCodes }, { "data_I": amounts });
						}else{
							// AlertII.show(`购买失败\n<font color = ${Color.RedCommon}>装备评分过低无法购买</font>`,null,null, this,[AlertType.YES]);
							Tip.showTip("没有商品可购买");
						}
					}
				}
			}
		}else{
			Tip.showTip("没有商品可购买");
		}
	}

	private updateList(): void {
		this.goodList.data = CacheManager.shop.mysteryGoods;
		if(CacheManager.shop.mysteryGoods.length > 0){
			// this.goodList.setVirtual(CacheManager.shop.mysteryGoods);
			this.controller.selectedIndex = 0;
		}else{
			this.controller.selectedIndex = 1;
		}
	}

	public updateTime(): void {
		App.TimerManager.remove(this.updateLeftTime, this);
		App.TimerManager.doTimer(1000, 0, this.updateLeftTime, this);
		this.updateLeftTime();
	}

	private updateLeftTime(): void {
		let leftTime: number = CacheManager.shop.mysteryRefreshTime - Math.floor(CacheManager.serverTime.getServerMTime() / 1000);
		let isFreeRefresh: boolean = !(leftTime > 0);
		let timeStr: string;
		if (!isFreeRefresh) {
			timeStr = App.DateUtils.formatSeconds(leftTime, DateUtils.FORMAT_SECONDS_3);
			// console.log(leftTime + "-" + timeStr);
			this.endTimeTxt.text = timeStr;
			this.refreshGroup.visible = true;
			this.refreshBtn.title = "刷  新";
		} else {
			this.refreshGroup.visible = false;
			this.refreshBtn.title = "免费刷新";
			App.TimerManager.remove(this.updateLeftTime, this);
		}
		CommonUtils.setBtnTips(this.refreshBtn, isFreeRefresh, null,null,isFreeRefresh);
	}

	public updateProp(): void {
		let propNum: number = CacheManager.pack.propCache.getItemCountByCode2(this.propCode);
		if (propNum > 0) {
			this.propTxt.text = `<font color = ${Color.GreenCommon}>${propNum}</font>/1`;
			this.isHasProp = true;
		} else {
			this.propTxt.text = `<font color = ${Color.RedCommon}>${propNum}</font>/1`;
			this.isHasProp = false;
		}
	}
}