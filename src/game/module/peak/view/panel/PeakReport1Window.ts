class PeakReport1Window extends BaseWindow {
    private stateCtl: fairygui.Controller;
    private reportList: List;
    private content1: fairygui.GTextField;
    private content2: fairygui.GTextField;
    private isAudition: boolean;
    private leftTime: number;
    private endTimeStamp: number;

    public constructor() {
        super(PackNameEnum.Peak, "PeakReport1Window");
    }

    public initOptUI(): void {
        this.stateCtl = this.getController("c1");
        this.content1 = this.getGObject("txt_content1").asTextField;
        this.content2 = this.getGObject("txt_content2").asTextField;
        this.stateCtl = this.getController("c1");
        this.reportList = new List(this.getGObject("list_item").asList);
    }

    public updateAll(data?:any): void {
        let isAudition:boolean = CacheManager.peak.isCrossOpen && CacheManager.peak.recordState == EPeakArenaState.EPeakArenaStateEliminate64
            || (!CacheManager.peak.isCrossOpen && CacheManager.peak.recordState == EPeakArenaState.EPeakArenaStateEliminate16);
        this.stateCtl.selectedIndex = isAudition ? 1 : 0;

        App.TimerManager.remove(this.countDown, this);

        let msg = data.data;
        let records:any[] = msg.records.data;
        this.reportList.data = records;

        if (isAudition) {
            let winCount:number = 0;
            let failCount:number = 0;
            for (let r of records) {
                if (r.successEntityId && r.successEntityId.id_I != 0) {
                    EntityUtil.isMainPlayer(r.successEntityId) ? ++winCount : ++failCount;
                }
            }

            let isFree:boolean = CacheManager.peak.curState == EPeakArenaState.EPeakArenaStateEliminate64Free
                || CacheManager.peak.curState == EPeakArenaState.EPeakArenaStateEliminate16Free;
            if (!isFree) {
                if (failCount < 10) {
                    this.content1.text = App.StringUtils.substitude(LangPeak.RECORD2, msg.round_I, msg.leftPlayer_I, winCount, failCount);
                    // this.countDown();
                    // EventManager.addListener(LocalEventEnum.PeakCountdownUpdated, this.countDown, this);
                    this.endTimeStamp = msg.nextRound_I;
                    // this.leftTime = msg.nextRound_I - CacheManager.serverTime.getServerTime();//msg.nextRound_I;
                    if (this.countDown()) {
                        App.TimerManager.doFrame(3, 0, this.countDown, this);
                    }
                    Log.trace(Log.PEAK, `1_结束时间戳:${msg.nextRound_I},倒计时:${this.leftTime}S`);
                } else {
                    this.stateCtl.selectedIndex = 2;
                    this.content1.text = HtmlUtil.colorSubstitude(LangPeak.RECORD8, msg.round_I, msg.leftPlayer_I);
                    this.content2.text = "";
                }
            }
            else {
                this.stateCtl.selectedIndex = 2;
                this.content1.text = HtmlUtil.colorSubstitude(LangPeak.RECORD6 + (failCount < 10 ? "" : LangPeak.RECORD9), msg.leftPlayer_I, winCount, failCount);
                this.content2.text = "";
            }

        }
        this.isAudition = isAudition;
    }

    private countDown(forceLeft:number = -1):number {
        // let leftTime:number = forceLeft > 0 ? forceLeft : CacheManager.peak.getEnterTimer();
        // --this.leftTime;
        let time:number = this.endTimeStamp - CacheManager.serverTime.getServerTime();
        if (time != this.leftTime) {
            this.leftTime = time;
            this.content2.text = App.StringUtils.substitude(LangPeak.RECORD3, this.leftTime >= 0 ? this.leftTime : 0);
            if (this.leftTime < 0) {
                App.TimerManager.remove(this.countDown, this);
            }
        }
        return this.leftTime;
    }

    public hide(param: any = null, callBack: CallBack = null):void {
        super.hide(param,callBack);
        App.TimerManager.remove(this.countDown, this);
        // if (this.isAudition) this.countDown(0);
        // EventManager.removeListener(LocalEventEnum.PeakCountdownUpdated, this.countDown, this);
    }

}