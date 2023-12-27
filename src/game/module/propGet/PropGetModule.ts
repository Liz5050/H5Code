/**
 * 道具获取
 */
class PropGetModule extends BaseWindow {
	private c1: fairygui.Controller;
	private baseItem: BaseItem;
	private getList: List;
	private priceTxt: fairygui.GTextField;
	private totalTxt: fairygui.GTextField;
	private numberInput: NumberInput;
	private itemCode: number;
	private cfg: any;
	private itemData: ItemData;
	private isCanBuy: boolean;
	private sellCfg: any;
	private price: number = 0;
	private total: number = 0;
	private oHeight: number = 0;
    private shopType: ShopType;

	public constructor() {
		super(PackNameEnum.PropGet, "Main", ModuleEnum.PropGet);
		this.isAnimateShow = false;
	}

	public initOptUI(): void {
		this.c1 = this.getController("c1");
		this.baseItem = <BaseItem>this.getGObject("baseItem");
		this.baseItem.txtName.fontSize = 22;
		// this.baseItem.txtName.y = this.baseItem.txtName.y + 20;
		this.baseItem.enableToolTip = false;
		this.baseItem.touchable = false;
		this.getList = new List(this.getGObject("list_getItem").asList);
		this.priceTxt = this.getGObject("txt_price").asTextField;
		this.totalTxt = this.getGObject("txt_total").asTextField;
		this.numberInput = <NumberInput>this.getGObject("numberInput");
		this.numberInput.showExBtn = true;
		this.numberInput.setChangeFun(this.numChange, this);
		this.getGObject("btn_buy").addClickListener(this.clickBuy, this);
		// this.getGObject("btn_recharge").addClickListener(this.clickRecharge, this);
	}

	public updateAll(data: any = null): void {
		this.numberInput.value = data.itemAmount || 1;
		this.itemCode = data.itemCode;
		if (this.itemCode) {
			this.cfg = ConfigManager.propGet.getByPk(this.itemCode);
			if (this.cfg != null) {
				this.itemData = new ItemData(this.itemCode);
				this.baseItem.itemData = this.itemData;
				this.baseItem.selected = false;
				if (WeaponUtil.isSpecialTipsEquip(this.itemData.getType())) {
					this.baseItem.setNameText(this.itemData.getName(true));
				}
				this.isCanBuy = this.cfg.canBuy == 1;
				this.c1.selectedIndex = this.isCanBuy ? 1 : 0;
				if (this.isCanBuy) {
					this.sellCfg = ConfigManager.shopSell.getByPKParams(ShopType.SHOP_NORMAL, this.itemCode);
					if(!this.sellCfg) {
						this.sellCfg = ConfigManager.shopSell.getByPKParams(ShopType.SHOP_QUICK, this.itemCode);
					}
					if(this.sellCfg != null) {
						this.shopType = this.sellCfg.shopCode;
                        this.price = this.sellCfg.price;
                        this.total = this.price * this.numberInput.value;
                        this.priceTxt.text = this.price.toString();
                        this.totalTxt.text = this.total.toString();
                        this.oHeight = 834;
                    } else {
                        this.c1.selectedIndex = 0;
                        this.oHeight = 591;
                    }
				} else {
					this.oHeight = 591;
				}

				// let data: any = {};
				// let types: Array<string> = this.cfg.buyLink.split("#");
				// let showText: Array<string> = this.cfg.showText.split("#");
				this.getList.data = ConfigManager.propGet.getDataById(this.itemCode);
				this.frame.height = this.oHeight + 82 * (this.getList.data.length-1);
				this.view.setSize(this.view.width,this.frame.height*0.86); //动态改变窗体大小的，因为窗体做了缩放 需要乘以缩放才是真正的高度
				this.center();
			}
		}
	}

	/**
	 * 数量改变
	 */
	private numChange(): void {
		this.total = this.price * this.numberInput.value;
		this.totalTxt.text = this.total.toString();
	}

	/**
	 * 点击购买
	 */
	private clickBuy(): void {
		if (MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold, this.total)) {
			EventManager.dispatch(LocalEventEnum.ShopBuyItem, this.itemCode, this.shopType || ShopType.SHOP_NORMAL, this.numberInput.value);
			this.hide();
		}
		else {
			this.hide();
		}
	}

	/**
	 * 点击充值
	 */
	private clickRecharge(): void {
		HomeUtil.openRecharge();
		this.hide();
	}
}