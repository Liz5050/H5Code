/**
 * tips旁边购买物品操作UI
 * @author zhh
 * @time 2018-09-06 22:13:04
 */
class ToolTipDebugBuy extends BasePopupView {
    private txtBuyNum:fairygui.GTextField;
    private txtCode:fairygui.GTextField;
    private btnBuyDebug:fairygui.GButton;
    private itemData:ItemData;

    private clickCb:Function;
    private clickCaller:any;

	public constructor() {
		super(PackNameEnum.Common, "ToolTipDebugBuy");
	}

	public initUI(): void {
		super.initUI();
        //---- script make start ----
        this.txtBuyNum = this.getGObject("txt_buyNum").asTextField;
        this.txtCode = this.getGObject("txt_code").asTextField;
        this.btnBuyDebug = this.getGObject("btn_buyDebug").asButton;
        this.txtBuyNum.text = "10";
        this.btnBuyDebug.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
        this._view.setPivot(0, 0, true);

	}

	public update(itemInfo:ItemData,cb:Function=null,caller:any=null) {
        this.clickCb = cb;
        this.clickCaller = caller;
        if(itemInfo instanceof ItemData){
            this.itemData = itemInfo;
            if(this.itemData){
                this.txtCode.text = ""+this.itemData.getCode();
            }	
        }			
			
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnBuyDebug:
                if(this.itemData){
                    if(!isNaN(Number(this.txtBuyNum.text))){
                        ProxyManager.test.addItem(this.itemData.getCode(),Number(this.txtBuyNum.text));
                    }                    
                }else{
                    Tip.showLeftTip("非物品数据无法GM购买");
                }
                if(this.clickCb && this.clickCaller){
                    this.clickCb.call(this.clickCaller);
                }
                break;

        }
    }

	
}