/**
 * 召唤幸运boss
 * @author zhh
 * @time 2018-09-26 14:35:25
 */
class DefendCallBossWin extends BaseWindow {
    private txtCount:fairygui.GTextField;
    private txtPrice:fairygui.GTextField;
    private btnCall:fairygui.GButton;

	public constructor() {
		super(PackNameEnum.Copy2,"DefendCallBossWin");
        this.isForceCloseObj = true;
        this.isShowCloseObj  = true;

	}
	public initOptUI():void{
        //---- script make start ----
        this.txtCount = this.getGObject("txt_count").asTextField;
        this.txtPrice = this.getGObject("txt_price").asTextField;
        this.btnCall = this.getGObject("btn_call").asButton;

        this.btnCall.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----

	}

	public updateAll(data?:any):void{
		this.txtPrice.text = ConfigManager.copy.luckCost + "";
		this.txtCount.text = `可召唤次数：${CacheManager.copy.luckCount}次`;
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnCall:
				if(CacheManager.copy.luckCount<=0){
					Tip.showLeftTip("召唤次数不足");
					return;
				}
				if(MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,ConfigManager.copy.luckCost)){
					ProxyManager.copy.callLuckBoss();
				}
                break;

        }
        this.hide();
    }


}