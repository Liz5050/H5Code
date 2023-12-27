class BuyWindow extends BaseWindow {
    private baseItem:BaseItem;
	private buyBtn:fairygui.GButton;
    protected nameTxt:fairygui.GRichTextField;
	private desTxt:fairygui.GRichTextField;
	private priceTxt:fairygui.GTextField;
	private totalPriceTxt:fairygui.GTextField;
    protected limitTxt:fairygui.GRichTextField;
    protected number_input:NumberInput;
    protected minBuyNum:number = 1;

    protected code:number;
    protected itemCfg:any;
	protected shopCfg:any;

    protected buyCallBack:CallBack;
    protected c1: fairygui.Controller;//0元宝1筹码
    protected unit: EPriceUnit;

	public constructor() {
		super(PackNameEnum.Common,"BuyWindow");

	}
	public initOptUI():void{
		this.c1 = this.getController('c1');
		this.nameTxt = this.getGObject("nameTxt").asRichTextField;
		this.desTxt = this.getGObject("desTxt").asRichTextField;
		this.priceTxt = this.getGObject("priceTxt").asTextField;
		this.totalPriceTxt = this.getGObject("totalPriceTxt").asTextField;
		this.limitTxt = this.getGObject("txt_limit").asRichTextField;

		this.baseItem = this.getGObject("baseItem") as BaseItem;
		this.baseItem.isShowName = false;
		this.baseItem.touchable = false;
		this.baseItem.enableToolTip = false;
		this.number_input = this.getGObject("number_input") as NumberInput;
		this.number_input.showExBtn = true;
		this.number_input.setChangeFun(this.inputTxtChange,this);

		this.buyBtn = this.getGObject("buyBtn").asButton;
		this.buyBtn.addClickListener(this.onBuyClickHandler,this);
	}

	public updateAll(data?:any):void{
		let unit:EPriceUnit = EPriceUnit.EPriceUnitGold;
		if (data.shopCode) {
			this.shopCfg = data;
            this.code = data.itemCode;
            unit = ConfigManager.shop.getByPk(data.shopCode).unit;
		} else {
            this.code = data;
		}
		this.unit = unit;
		if(unit == EPriceUnit.EPriceUnitGold){
			this.c1.selectedIndex = 0;
		}else if(unit == EPriceUnit.EPriceUnitJeton){
			this.c1.selectedIndex = 1;
		}else if(unit == EPriceUnit.EPriceUnitFightingSpirit){
			this.c1.selectedIndex = 3;
		}

		this.fillData();
	}

    protected fillData():void {
        this.itemCfg = ConfigManager.item.getByPk(this.code);
        if(!this.itemCfg) {
            Log.trace(Log.SERR,"itemCode error : ",this.code);
        }
        this.nameTxt.text = HtmlUtil.html(this.itemCfg.name,Color.getItemColr(this.itemCfg.color));
        // this.desTxt.text = this.itemCfg.descStr;

        if (!this.shopCfg) {
            this.shopCfg = ConfigManager.shopSell.getByPk(ShopType.SHOP_QUICK + "," + this.code);
            if(!this.shopCfg) this.shopCfg = ConfigManager.shopSell.getByPk(ShopType.SHOP_NORMAL + "," + this.code);
        }

        let itemData:ItemData = new ItemData(this.code);
        this.baseItem.itemData = itemData;
        this.number_input.max = itemData.getOverlay();
        let minBuyNum:number = this.shopCfg.minBuyNum || 1;
        this.number_input.addValue = minBuyNum;
        this.number_input.addMoreValue = minBuyNum * 10;
        this.number_input.max = 999 * minBuyNum;
        this.number_input.min = minBuyNum;
        this.limitTxt.text = "";


        this.setLimit();
        this.setInitValue(minBuyNum);
        this.priceTxt.text = this.shopCfg.price;
        this.desTxt.text = this.shopCfg.usageTip;
        this.inputTxtChange();
	}

	protected setLimit():void {
        if(this.shopCfg.limitNum){
            let shopInfo: any = CacheManager.shop.limitGoods[this.shopCfg.shopCode];
            if(shopInfo && shopInfo[this.shopCfg.itemCode]){
                this.setInputMax(this.shopCfg.limitNum - shopInfo[this.shopCfg.itemCode]);
            }else{
                this.setInputMax(this.shopCfg.limitNum);
            }
            this.limitTxt.text = ShopUtil.getLimitStr(this.shopCfg.limitType, 0, this.number_input.max);
        }
	}

	protected setInputMax(value:number):void {
        this.number_input.max = value;
        if(this.number_input.max == 0){
            this.number_input.value = 0;
        }
	}

	public setBuyCb(cb:CallBack):void{
		this.buyCallBack = cb; 
	}

	protected onBuyClickHandler():void {
		let price:number = this.shopCfg.price * this.number_input.value;
		let isMoney:boolean = MoneyUtil.checkEnough(this.unit,price);
		if(this.buyCallBack){
			this.buyCallBack.fun.call(this.buyCallBack.caller,isMoney);
		}
		if(this.number_input.max == 0){
			Tip.showLeftTip("已达到购买上限");
		}else if(isMoney) {
			ProxyManager.shop.buyItem(0, this.shopCfg.shopCode, this.code, this.number_input.value, 0, false);//仅购买到背包
		}
		this.hide();
	}

    protected inputTxtChange():void {
		let price:number = this.shopCfg.price * this.number_input.value;
		if(price > this.getMoney()) {
			this.totalPriceTxt.color = Color.Red;
		}
		else {
			this.totalPriceTxt.color = 0xFF7610;
		}
		this.totalPriceTxt.text = price + "";
	}

    protected getMoney():number {
		return CacheManager.role.getMoney(this.unit);
		// return this.unit == EPriceUnit.EPriceUnitGold ? CacheManager.role.money.gold_I : CacheManager.role.money.jeton_I;
	}

    protected setInitValue(minBuyNum:number) {
		let initVal:number = minBuyNum;
		if (this.unit != EPriceUnit.EPriceUnitGold) {
            let max:number = this.getMoney()/this.shopCfg.price>>0 || 1;
            initVal = Math.min(max, this.number_input.max);
		}
        this.number_input.value = initVal;
    }

	public hide():void {
		super.hide();
		this.code = 0;
		this.itemCfg = null;
		this.shopCfg = null;
		this.number_input.max = 999;
		this.number_input.value = 1;
		this.buyCallBack = null;
	}

}