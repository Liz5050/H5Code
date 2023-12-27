class CopyContestResult extends BaseWindow {

    private leftTime:number;
    private stageTxt: fairygui.GTextField;
    private gainTxt: fairygui.GRichTextField;
    private totalTxt: fairygui.GRichTextField;
    private timeId: number;
    private c1: fairygui.Controller;
    private bgLoader: GLoader;
    private c2: fairygui.Controller;
    private frameC1: fairygui.Controller;
    private topLoader: GLoader;

    public constructor() {
        super(PackNameEnum.CopyResult,"WindowContestResult");
        this.isPopup = false;
    }

    public initOptUI():void {
        this.c1 = this.getController('c1');
        this.c2 = this.getController('c2');
        this.bgLoader = this.frame.getChild("loader_result_Bg") as GLoader;
        this.topLoader = this.getGObject('topBg') as GLoader;
        this.frameC1 = this.frame.getController('c1');
        this.closeObj.visible = true;

        this.stageTxt = this.getGObject("txt_stage").asTextField;
        this.gainTxt = this.getGObject("txt_gain").asRichTextField;
        this.totalTxt = this.getGObject("txt_total").asRichTextField;
    }

    public updateAll(data:any):void {
        let result:any = data.data;//SContestBattleResult
        this.bgLoader.load(URLManager.getModuleImgUrl(result.bWin_B ? "copy_result_win.png" : "copy_result_fail.png",PackNameEnum.Copy));
        this.topLoader.load(URLManager.getModuleImgUrl(result.bWin_B ? "kingBattleResultBg.png" : "fail_logo.png",PackNameEnum.Copy));
        this.frameC1.selectedIndex = result.bWin_B ? 0 : 1;

        if (result.state_I == EContestState.EContestStateQualification) {
            this.c1.selectedIndex = 0;
            this.gainTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG32, result.addScore_I);
            this.totalTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG33, result.myScore_I);
        } else {
            this.c1.selectedIndex = 1;
            this.stageTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG18, result.round_I + 1);
        }
        this.leftTime = 5;
        this.onTimeUpdate();
        this.timeId = egret.setInterval(this.onTimeUpdate, this, 1000);
    }

    private onTimeUpdate():void {
        this.leftTime--;
        if(this.leftTime <= 0) {
            this.onCloseHandler();
            return;
        }
        let str:string = App.StringUtils.substitude(LangLegend.LANG21 + (this.leftTime > 0 ? LangLegend.LANG22 : ""), this.leftTime);
        (this.closeObj as fairygui.GButton).text = str;
    }

    protected onCloseHandler():void {
        super.onCloseHandler();
        EventManager.dispatch(LocalEventEnum.CopyReqExit, false);
    }

    public hide():void {
        egret.clearInterval(this.timeId);
        this.timeId = -1;
        super.hide();
    }
}