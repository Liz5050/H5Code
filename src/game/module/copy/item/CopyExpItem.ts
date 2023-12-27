class CopyExpItem extends ListRenderer {
	public txt_expnumber: fairygui.GTextField;
	public txt_tip: fairygui.GTextField;
	public btn_use: fairygui.GButton;
	public baseItem: BaseItem;
	protected isUse: boolean;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.txt_expnumber = this.getChild("txt_expnumber").asTextField;
		this.txt_tip = this.getChild("txt_shuoming").asTextField;
		this.btn_use = this.getChild("btn_use").asButton;
		this.baseItem = <BaseItem>this.getChild("baseItem");
		this.btn_use.addClickListener(this.onClickBtn, this);
	}

	protected onClickBtn(): void {
		var itemData: ItemData = <ItemData>this._data;
		var buffInf: any = ConfigManager.state.getByPk(itemData.getItemInfo().effectEx);
		if (CacheManager.buff.isHasBuffByType(buffInf.type) && !CacheManager.buff.isHasBuffById(buffInf.stateId)) {
			var nameStr:string = itemData.getName(true);
			var msg:string = `已经有经验药效果,是否使用${nameStr}替换?`+HtmlUtil.brText+"(替换后经验加成时间将重新计算)";
			Alert.info(msg,this.handlerUseAndBuy,this);
		} else {
			this.handlerUseAndBuy();
		}

	}

	private handlerUseAndBuy(): void {
		if (this.isUse) {
			//使用
			var useAmount: number = 1;
			EventManager.dispatch(LocalEventEnum.PackUseByCode, this._data, useAmount);
		} else {
			//购买
			var codeUnbind: number = (<ItemData>this._data).getItemInfo().codeUnbind;
			var sellInf: any = ConfigManager.shopSell.getByPk(ShopType.SHOP_GOLDBIND + "," + codeUnbind);
			var isBindOk: boolean = sellInf && CommonUtils.isPriceEnough(sellInf.price, EPriceUnit.EPriceUnitGoldBind);
			if (isBindOk) {
				EventManager.dispatch(LocalEventEnum.ShopBuyAndUse, codeUnbind, ShopType.SHOP_GOLDBIND);
			} else {
				EventManager.dispatch(LocalEventEnum.ShopBuyAndUse, this._data, ShopType.SHOP_NORMAL);
			}

		}
	}

	public setData(data: any): void {
		this._data = data;
		var idata: ItemData = <ItemData>data;
		this.baseItem.itemData = idata;
		var num: number = CacheManager.pack.backPackCache.getItemCountByCode(idata.getCode());
		this.isUse = num > 0;
		var bufId: number = idata.getItemInfo().effectEx
		var stateInf: any = ConfigManager.state.getByPk(bufId);
		this.txt_expnumber.text = stateInf.stateEffect1 + "%";
		this.txt_tip.visible = !this.isUse;
		if (this.isUse) {
			this.btn_use.text = "使用";
		} else {
			this.btn_use.text = "购买";
		}
	}

}