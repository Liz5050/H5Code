class ShopGoodItem extends ListRenderer{
	private shopItem: BaseItem;
	private nameTxt: fairygui.GRichTextField;
	private descTxt: fairygui.GTextField;
	private priceTxt: fairygui.GTextField;
	private limitTxt: fairygui.GRichTextField;
	private buyBtn: fairygui.GButton;

	private limitNum: number;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void{
		super.constructFromXML(xml);
		this.shopItem = <BaseItem>this.getChild("baseItem");
		this.nameTxt = this.getChild("txt_name").asRichTextField;
		this.descTxt = this.getChild("txt_desc").asTextField;
		this.priceTxt = this.getChild("txt_price").asTextField;
		this.limitTxt = this.getChild("txt_limit").asRichTextField;
		this.buyBtn = this.getChild("btn_buy").asButton;
		this.buyBtn.addClickListener(this.click, this);

	}

	public setData(data: any): void{
		this._data = data;
		let itemData: ItemData = new ItemData(data.itemCode);
		itemData.itemAmount = 1;
		this.shopItem.itemData = itemData;
		this.shopItem.showBind();
		this.shopItem.txtName.visible = false;
		this.nameTxt.text = `<font color = ${Color.ItemColor[this.shopItem.itemData.getColor()]}>${this.shopItem.itemData.getName(false)}</font>`;
		this.descTxt.text = data.usageTip;
		this.priceTxt.text = data.price;
		this.limitTxt.text = "";
		if(data.limitNum && data.limitType == 1){
			let shop: any = CacheManager.shop.limitGoods[data.shopCode];
			if(shop && shop[data.itemCode]){
				this.limitNum = data.limitNum - shop[data.itemCode];
			}else{
				this.limitNum = data.limitNum;
			}
			this.limitTxt.text = ShopUtil.getLimitStr(data.limitType, 0, this.limitNum);
		}
	}

	private click(): void{
		EventManager.dispatch(UIEventEnum.QuickShopBuyOpen, this._data.itemCode);
	}
}