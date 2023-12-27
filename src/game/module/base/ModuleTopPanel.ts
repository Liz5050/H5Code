/**
 * 模块顶部面板
 */
class ModuleTopPanel extends fairygui.GLabel{
    //金钱更新
    private txtCoin: fairygui.GTextField;
    private txtGold: fairygui.GTextField;
    private iconLoader:GLoader;
    private _isOpenRecharge:boolean = true;
    private c1 : fairygui.Controller;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
        this.getChild("btn_coin").addClickListener(this.clickCoin, this);
        this.getChild("btn_gold").addClickListener(this.clickGold, this);
        this.iconLoader = <GLoader>this.getChild("icon");
        this.txtCoin = this.getChild("txt_coin").asTextField;
        this.txtGold = this.getChild("txt_gold").asTextField;
        this.c1 = this.getController("c1");
        if(App.DeviceUtils.IsWXGame) {
            this.c1.setSelectedIndex(1);
        }
        else {
            this.c1.setSelectedIndex(1);
        }
	}

	/**更新金钱 */
    public updateMoney(money: any = null): void {
        if (money == null) {
            money = CacheManager.role.money;
        }
        this.txtCoin.text = App.MathUtils.formatNum2(money.coinBind_L64);
        this.txtGold.text = money.gold_I;//App.MathUtils.formatNum(money.gold_I,false,1,100000);
    }
    public set icon(value:string){
        this.iconLoader.load(value);
    }

    /**点击元宝 是否可以打开充值界面 */
    public get isOpenRecharge():boolean{
        return this._isOpenRecharge;
    }

    public set isOpenRecharge(value:boolean){
        this._isOpenRecharge = value;
    }

    private clickCoin():void{
        EventManager.dispatch(UIEventEnum.QuickShopBuyOpen, ItemCodeConst.CoinOfShop);
    }

    private clickGold():void{
        if(this._isOpenRecharge){
            HomeUtil.openRecharge();
        }
    }
}