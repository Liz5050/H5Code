class WindowPeakArenaResult extends BaseWindow {
    private bgLoader:GLoader;

    private leftTime:number = 0;
    private curTime:number;

    private isWin:boolean;
    private timeTxt: fairygui.GRichTextField;
    private c1: fairygui.Controller;
    private c11: fairygui.Controller;
    private resultTxt: fairygui.GRichTextField;
    private interId: number;
    private topBg: GLoader;
    private effectBg1: GLoader;
    private effectBg2: GLoader;

    public constructor() {
        super(PackNameEnum.CopyResult,"WindowPeakArenaResult");
    }

    public initOptUI():void {
        this.c1 = this.frame.getController('c1');
        this.c11 = this.getController('c1');
        this.bgLoader = this.frame.getChild("loader_result_Bg") as GLoader;
        this.timeTxt = this.getGObject("timeTxt").asRichTextField;
        this.resultTxt = this.getGObject("txt_result").asRichTextField;
        this.closeObj.visible = true;
        this.topBg = <GLoader>this.getGObject("topBg");
        this.effectBg1 = <GLoader>this.getGObject("effectBg_1");
        this.effectBg2 = <GLoader>this.getGObject("effectBg_2");

        this.topBg.load(URLManager.getModuleImgUrl("kingBattleResultBg.png",PackNameEnum.Copy));
        this.effectBg1.load(URLManager.getModuleImgUrl("KingBattleResultEffect.png",PackNameEnum.Copy));
        this.effectBg2.load(URLManager.getModuleImgUrl("KingBattleResultEffect.png",PackNameEnum.Copy));
        this.frame.getChild("closeButton").text = LangPeak.MAIN24;
    }

    public updateAll(data?:any):void {
        this.isWin = EntityUtil.isMainPlayer(data.entityId);
        this.c1.selectedIndex = this.isWin ? 0 : 1;
        this.c11.selectedIndex = this.isWin ? 1 : 0;
        this.resultTxt.text = App.StringUtils.substitude(this.isWin ? LangPeak.MAIN23:LangPeak.MAIN22, data.name_S);
        this.bgLoader.load(URLManager.getModuleImgUrl(this.isWin ? "copy_result_win.png" : "copy_result_fail.png", PackNameEnum.Copy));

        if(this.leftTime == 0) {
            this.curTime = egret.getTimer();
            let copyCfg:any = ConfigManager.copy.getByPk(CopyEnum.CopyKingBattle);
            this.leftTime = CopyUtils.getCopyResultSec(copyCfg, this.isWin);
            this.timeTxt.text = "(" + HtmlUtil.html(this.leftTime + "秒",Color.Green) + "后自动关闭)";
            this.interId = egret.setInterval(this.onTimerHandler,this,1000);
        }
        if (this.isWin) {
            this.effectBg1.rotation = -180;
            this.effectBg2.rotation = 180;
            egret.Tween.get(this.effectBg1,{loop:true}).to({rotation:180},4000);
            egret.Tween.get(this.effectBg2,{loop:true}).to({rotation:-180},5000);
        }
    }

    private onTimerHandler():void {
        let time:number = egret.getTimer();
        this.leftTime -= Math.round((time - this.curTime)/1000);
        this.curTime = time;
        if(this.leftTime <= 0) {
            this.hide();
            return;
        }
        this.timeTxt.text = "(" + HtmlUtil.html(this.leftTime + "秒",Color.Green) + "后自动关闭)";
    }

    private removeTimer():void {
        this.leftTime = 0;
        egret.clearInterval(this.interId);
    }

    public hide():void {
        super.hide();
        this.removeTimer();
        if(App.Socket.isConnecting() && CacheManager.copy.isInCopyByType(ECopyType.ECopyMgPeakArena)) {
            EventManager.dispatch(LocalEventEnum.CopyReqExit);
            // HomeUtil.open(ModuleEnum.Arena, false, {tabType:PanelTabType.KingBattle});
        }
        egret.Tween.removeTweens(this.effectBg1);
        egret.Tween.removeTweens(this.effectBg2);
    }
}