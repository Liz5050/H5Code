class ReviveThreeView extends BaseContentView {
    private txtKill:fairygui.GRichTextField;
    private txtAutotime:fairygui.GRichTextField;
    private btnRevive:fairygui.GButton;

    private reviveTime:number;
    private tipStr:string;

    private timer:egret.Timer;
    private c1: fairygui.Controller;
    private revivalType:number = -1;

	public constructor() {
		super(PackNameEnum.Resurgence,"ReviveThreeView",null,LayerManager.UI_Home);
        this.modal = false;
        this.isPopup = false;
	}

    public initUI():void{
		super.initUI();
		if (this.view) {
			this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height - 280);
			this.view.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
		}
	}

	public initOptUI():void {
        this.txtKill = this.getGObject("txt_kill").asRichTextField;
        this.txtAutotime = this.getGObject("txt_autoTime").asRichTextField;
        this.btnRevive = this.getGObject("btn_revive").asButton;
        let needMoney:number = ConfigManager.const.getConstValue("RevivalGold");
        this.btnRevive.text = "   " + needMoney + "原地复活";
        this.btnRevive.addClickListener(this.onGUIBtnClick, this);
        this.tipStr = HtmlUtil.html("自动复活","#c8b185");
        this.view.addClickListener(this.onGUIBtnClick,this);

        this.timer = new egret.Timer(1000,0);
        this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimerHandler,this);

        this.c1 = this.getController('c1');
	}

	public updateAll(data?:any):void {
        this.parent.setChildIndex(this,1);
        if(data.revivalType!=null){
            this.revivalType = data.revivalType; 
        }
        this.txtKill.text = data.tips;
        this.reviveTime = CacheManager.resurgence.reliveCd;
        this.txtAutotime.text = this.reviveTime + "秒  " + this.tipStr;
        this.c1.selectedIndex = !data.noShowBtn ? 0 : 1;
        // // this.curTime = egret.getTimer();
        // App.TimerManager.doTimer(1000,10,this.onTimerHandler,this);
        Log.trace(Log.UI,"显示复活界面");
        this.timer.reset();
        this.timer.start();
        // if(!App.TimerManager.isExists(this.onTimerHandler,this)) {
        // }
	}

    private onTimerHandler():void {
        // let time:number = egret.getTimer();
        this.reviveTime --; //Math.round((time - this.curTime)/1000);
        // this.curTime = time;
        if(this.reviveTime <= 0) {            
            if(this.c1.selectedIndex == 0) {
                EventManager.dispatch(LocalEventEnum.Revive, { revivalType: ERevivalType.ERevivalTypeInBackToTheCity, priceUnit: 0 });
            } else {//传奇之路倒计时完要发原地复活
                let type:number = this.revivalType!=-1?this.revivalType:ERevivalType.ERevivalTypeInSitu;
                EventManager.dispatch(LocalEventEnum.Revive,{revivalType:type,priceUnit:EPriceUnit.EPriceUnitGold});
            }
            this.hide();
            return;
        }
        this.txtAutotime.text = this.reviveTime + "秒  " + this.tipStr;
    }

    private onGUIBtnClick(e:egret.TouchEvent):void {
        let btn:any = e.target;
        if(btn == this.btnRevive) {
            let needMoney:number = ConfigManager.const.getConstValue("RevivalGold");
            if(MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,needMoney)) {
                this.hide();
                EventManager.dispatch(LocalEventEnum.Revive, { revivalType: ERevivalType.ERevivalTypeInSitu, priceUnit: EPriceUnit.EPriceUnitGold });
            }
        }
        else {
            Tip.showRollTip(LangCommon.L24);
        }
        e.stopImmediatePropagation();
    }

    public hide():void {
        if(this.timer) {
            this.timer.stop();
        }
        super.hide();
        this.revivalType = -1;
        Log.trace(Log.UI,"关闭复活界面");
    }
}