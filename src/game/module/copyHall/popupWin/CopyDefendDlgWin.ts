/**
 * 守卫神剑扫荡弹窗
 * @author zhh
 * @time 2018-09-26 10:44:00
 */
class CopyDefendDlgWin extends BaseWindow {
    private baseItem:BaseItem;
    private windowItemtip:fairygui.GImage;
    private txtPrice:fairygui.GTextField;
    private txtTotal:fairygui.GTextField;
    private btnBuy:fairygui.GButton;
    private numberInput: NumberInput;
    private total:number = 0;
    private price:number = 0;
	public constructor() {
		super(PackNameEnum.CopyDaily,"CopyDefendDlgWin");

	}
	public initOptUI():void{
        //---- script make start ----
        this.baseItem = <BaseItem>this.getGObject("baseItem");
        this.windowItemtip = this.getGObject("window_itemtip").asImage;
        this.txtPrice = this.getGObject("txt_price").asTextField;
        this.txtTotal = this.getGObject("txt_total").asTextField;
        this.btnBuy = this.getGObject("btn_buy").asButton;
        this.numberInput = <NumberInput>this.getGObject("numberInput");
		this.numberInput.showExBtn = true;
        this.numberInput.setChangeFun(this.numChange, this);
        this.numberInput.min = 0;
        this.numberInput.max = CopyEnum.DLG_DF_CP;
        this.btnBuy.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
        this.price = ConfigManager.copy.luckCost;
        this.txtPrice.text = this.price + "";
        this.baseItem.itemData = null;
        this.baseItem.icoUrl = URLManager.getPackResUrl(PackNameEnum.CopyDaily,"luckboss");

	}
    /**
	 * 数量改变
	 */
	private numChange(): void {
		this.total = this.price * this.numberInput.value;
		this.txtTotal.text = this.total.toString();
	}

	public updateAll(data?:any):void{
		this.numberInput.value = 3;
        this.numChange();
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnBuy:
                if(MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,this.total)){
                    let copyInfo:any = ConfigManager.copy.getRoleDefendCopy();
                    ProxyManager.copy.delegate(copyInfo.code,this.numberInput.value);
                }
                break;
        }
        this.hide();
    }


}