class ShopMysteryItem extends ListRenderer {
	private shopItem: BaseItem;
	private nameTxt: fairygui.GRichTextField;
	private addScoresTxt: fairygui.GTextField;
	private orgPriceTxt: fairygui.GTextField;
	private priceTxt: fairygui.GTextField;
	private levelTxt: fairygui.GTextField;
	private buyBtn: fairygui.GButton;

	private discountController: fairygui.Controller;
	private scoreController: fairygui.Controller;
	private unitController: fairygui.Controller;

	public isCanBuy: boolean = true;
	private isEquipItem: boolean;
	private itemData: ItemData;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.shopItem = <BaseItem>this.getChild("baseItem");
		this.nameTxt = this.getChild("txt_name").asRichTextField;
		this.addScoresTxt = this.getChild("txt_addScores").asTextField;
		this.orgPriceTxt = this.getChild("txt_orgPrice").asTextField;
		this.priceTxt = this.getChild("txt_price").asTextField;
		this.levelTxt = this.getChild("txt_level").asTextField;
		this.buyBtn = this.getChild("btn_buy").asButton;
		this.buyBtn.addClickListener(this.click, this);

		this.discountController = this.getController("c1");
		this.scoreController = this.getController("c2");
		this.unitController = this.getController("c3");
	}

	/**
	 * @param data SMysteryShop
	 */
	public setData(data: any): void {
		this._data = data;
		this.itemData = new ItemData(data.itemCode_I);
		this.itemData.itemAmount = data.amount_I;
		this.shopItem.itemData = this.itemData;
		this.shopItem.showBind();
		this.shopItem.toolTipSource = ToolTipSouceEnum.ShopMall;
		// if(data.amount_I > 1){
		// 	this.shopItem.updateNum(data.amount_I.toString());
		// }
		// orgPrice_I

		this.shopItem.txtName.visible = false;
		this.nameTxt.text = `<font color = ${Color.ItemColor[this.shopItem.itemData.getColor()]}>${this.shopItem.itemData.getName(false)}</font>`;
		if (data.discount_I == 5) {
			this.discountController.selectedIndex = 1;
		} else if (data.discount_I == 8) {
			this.discountController.selectedIndex = 2;
		} else {
			this.discountController.selectedIndex = 0;
		}

		let orgPrice: number = data.orgPrice_I;
		if (orgPrice == 0) {
			orgPrice = Math.floor(data.price_I / (data.discount_I / 10));
		}
		if (data.unit_I == EPriceUnit.EPriceUnitCoinBind) {
			this.unitController.selectedIndex = 0;
			this.priceTxt.text = `${App.MathUtils.formatNum(data.price_I)}`;
			this.orgPriceTxt.text = `${App.MathUtils.formatNum(orgPrice)}`;
		} else if (data.unit_I == EPriceUnit.EPriceUnitGold) {
			this.unitController.selectedIndex = 1;
			this.priceTxt.text = `${data.price_I}`;
			this.orgPriceTxt.text = `${orgPrice}`;
		}

		this.scoreController.selectedIndex = 0;
		this.isCanBuy = true;
		this.levelTxt.text = "";
		this.isEquipItem = false;
		if (ItemsUtil.isEquipItem(this.itemData) && !WeaponUtil.isSpecialTipsEquip(this.itemData.getType())) {
			let shopScore: number = WeaponUtil.getScoreBase(this.itemData);
			let career: number = CareerUtil.getBaseCareer(this.itemData.getCareer());
			let type: number = this.itemData.getType();
			let curScore: number = CacheManager.pack.rolePackCache.getEquipsScoreByCT(career, type);
			let addScore: number = shopScore - curScore;
			if (addScore > 0) {
				this.addScoresTxt.text = `评分 ${addScore}`;
				this.scoreController.selectedIndex = 1;
			} else {
				this.isCanBuy = false;
			}
			this.levelTxt.text = `（${WeaponUtil.getEquipLevelText(this.itemData, false)}）`;
			this.isEquipItem = true;
		}
	}

	private click(): void {
		let flag: boolean = false;
		if (this._data.unit_I == EPriceUnit.EPriceUnitCoinBind) {
			flag = MoneyUtil.checkCoinEnough(EPriceUnit.EPriceUnitCoinBind, this._data.price_I);
		} else if (this._data.unit_I == EPriceUnit.EPriceUnitGold) {
			flag = MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold, this._data.price_I);
		}
		if (flag) {
			if (ItemsUtil.checkSmeltTips(false, 1) && this.isEquip) {
				Tip.showTip("背包已满，无法购买");
			} else {
				if (this.isCanBuy) {
					AlertII.show(App.StringUtils.substitude(LangShop.L9, this._data.price_I, GameDef.EPriceUnitName[this._data.unit_I], this.itemData.getName(true), this._data.amount_I),
						AlertCheckEnum.SHOP_MYSTERY_TIPS, function (type: AlertType) {
						if (type == AlertType.YES) {
							let itemCodes: Array<number> = [];
							let amounts: Array<number> = [];
							itemCodes.push(this._data.itemCode_I);
							amounts.push(this._data.amount_I);
							ProxyManager.shop.bugMysteryShopItem({ "data_I": itemCodes }, { "data_I": amounts });
						}
					}, this);
				} else {
					AlertII.show(`购买失败\n<font color = ${Color.RedCommon}>该装备评分过低无法购买</font>`, null, null, this, [AlertType.YES]);
				}
			}
		}
	}

	public get isEquip(): boolean {
		return this.isEquipItem;
	}
}