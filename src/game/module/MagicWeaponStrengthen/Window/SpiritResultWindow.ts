/**
 * 法宝副本结算奖励提示
 * @author zhh
 * @time 2018-09-12 21:21:24
 */
class SpiritResultWindow extends BaseWindow {
    private loaderIco:GLoader;
    private txtReward:fairygui.GTextField;
    private btnGo:fairygui.GButton;
    private count:number = 10;
	public constructor() {
		super(PackNameEnum.MagicWeaponCopy,"SpiritResultWindow")

	}
	public initOptUI():void{
        //---- script make start ----
        this.loaderIco = <GLoader>this.getGObject("loader_ico");
        this.txtReward = this.getGObject("txt_reward").asTextField;
        this.btnGo = this.getGObject("btn_go").asButton;

        this.btnGo.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----

	}

	public updateAll(data?:any):void{
        let rewardItem:ItemData = ConfigManager.const.getSpiritCopyReward();
        this.txtReward.text =rewardItem.getItemAmount() +"";
        this.loaderIco.load(rewardItem.getIconRes());
        this.count = 10;
        App.TimerManager.doTimer(1000,10,this.onTimer,this);
        this.onTimer();
	}
    private onTimer():void{
        this.btnGo.text = `前往领取(${this.count})`;
        this.count--;
        if(this.count==0){
            this.hide();
        }
    }

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnGo:
                this.hide();
                break;

        }
        
    }

    public hide(param: any = null, callBack: CallBack = null):void {
		super.hide(param,callBack);
        EventManager.dispatch(LocalEventEnum.CopyReqExit);
        HomeUtil.open(ModuleEnum.MagicWeaponStrengthen,false,{tabType:PanelTabType.MagicWeaponCopy},ViewIndex.One);
        App.TimerManager.remove(this.onTimer,this);
	}

}