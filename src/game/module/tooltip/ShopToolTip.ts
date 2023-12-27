class ShopToolTip  extends ToolTipBase {
	private nameTxt: fairygui.GTextField;
	private typeTxt: fairygui.GTextField;
	private levelTxt: fairygui.GTextField;
	private descTxt: fairygui.GRichTextField;
	private limitTxt: fairygui.GTextField;
	private priceTxt: fairygui.GRichTextField;
	private buyBtn: fairygui.GButton;

	private baseItem: BaseItem;
	private itemData: ItemData;

	private shopData: any;

	public constructor() {
		super(PackNameEnum.Common, "ShopToolTip");
	}

	public initUI(): void {
		super.initUI();
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.typeTxt = this.getChild("txt_type").asTextField;
		this.levelTxt = this.getChild("txt_level").asTextField;
		this.descTxt = this.getChild("txt_desc").asRichTextField;
		this.limitTxt = this.getChild("txt_buyLimit").asTextField;
		this.priceTxt = this.getChild("txt_cost").asRichTextField;
		this.baseItem = <BaseItem>this.getChild("loader_item");
		this.buyBtn = this.getChild("btn_buy").asButton;
		this.buyBtn.addClickListener(this.clickBuy, this);
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		if (toolTipData) {
			this.itemData = <ItemData>toolTipData.data;
			if (ItemsUtil.isTrueItemData(this.itemData)) {
				this.nameTxt.text = this.itemData.getName(true);
				this.typeTxt.text = GameDef.ECategory[this.itemData.getItemInfo().category];
				this.levelTxt.text = this.itemData.getItemLevel().toString();
				this.descTxt.text = this.itemData.getDesc();

				this.limitTxt.text = "";
				// this.limitTxt.visible = false;
				this.shopData = null;
				if (toolTipData.shopData != null) {
					this.shopData = toolTipData.shopData;

					let shop: any = ConfigManager.shop.getByPk(this.shopData["sellData"].shopCode);
					if(MoneyUtil.checkEnough(shop.unit, this.shopData["sellData"].price, false)){
						this.priceTxt.text = `${this.shopData["sellData"].price}`;
					}else{
						this.priceTxt.text = `<font color = ${Color.ItemColor[EColor.EColorRed]}>${this.shopData["sellData"].price}</font>`;
					}

					if(this.shopData["limitTxt"]){
						this.limitTxt.text = this.shopData["limitTxt"];
					}
					this.buyBtn.visible = this.shopData["limitNum"] ? true : false;

				}
			}
			this.baseItem.itemData = this.itemData;
			this.enableOptList(toolTipData.isEnableOptList);
		}
	}

	private clickBuy(): void{
		ToolTipManager.hide();
		ProxyManager.shop.buyItem(0, this.shopData["sellData"].shopCode, this.shopData["sellData"].itemCode, 1, 0, false);
		
	}

	public center():void{
		let optListWidth:number = 130;
		let centerX:number = (fairygui.GRoot.inst.width - this.width + optListWidth)/2;
		let centerY:number = (fairygui.GRoot.inst.height - this.height)/2;
		this.setXY(centerX, centerY);
	}
}