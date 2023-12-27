class PeakCDWindow extends BaseWindow {
    private cdTxt: fairygui.GTextField;

    public constructor() {
        super(PackNameEnum.PeakCD, "PeakCDWindow", null, LayerManager.UI_Message);
        this.isAnimateShow = false;
        this.modal = false;
        this.isPopup = false;
    }

    public initOptUI(): void {
        this.cdTxt = this.getGObject("txt_count").asTextField;
    }

    public updateAll(): void {
        /*if (this.countDown() >= 0) {
            App.TimerManager.doTimer(1000, 0, this.countDown, this);
        }*/
        this.countDown();
        EventManager.addListener(LocalEventEnum.PeakCountdownUpdated, this.countDown, this);
        CacheManager.sysSet.autoCopy = false;
    }

    private countDown():number {
        let leftTime:number = CacheManager.peak.getEnterTimer();
        if (leftTime >= 0) {
            this.cdTxt.text = leftTime + '';
        } else {
            this.hide();
        }
        return leftTime;
    }

    public hide(param: any = null, callBack: CallBack = null):void {
        super.hide(param,callBack);
        EventManager.removeListener(LocalEventEnum.PeakCountdownUpdated, this.countDown, this);
        CacheManager.sysSet.autoCopy = true;
    }
}