/**
 * 巅峰竞技玩法主控制器
 * @author Chris
 */
class PeakController extends BaseController {
    private module: PeakModule;
    private rankWin: PeakRankWindow;
    private cdWin: PeakCDWindow;
    private report1Win: PeakReport1Window;
    private report2Win: PeakReport2Window;
    private gambleInfoWin: PeakGambleInfoWindow;
    private gambleWin: PeakGambleWindow;
    private reportWinType: EPeakWinType;
    private resultWin: WindowPeakArenaResult;

    public constructor() {
        super(ModuleEnum.Peak);
    }

    public initView(): BaseModule {
        this.module = new PeakModule();
        return this.module;
    }

    public addListenerOnInit(): void {
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgPeakArenaState], this.onPeakState, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgPeakArenaInfo], this.onPeakInfo, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgPeakArenaRecord], this.onPeakRecord, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgPeakArenaBetRecord], this.onPeakBetRecord, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgPeakArenaOwnRecord], this.onPeakOwnRecord, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgPeakArenaPopularityRank], this.onPeakPopularityRank, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgPeakArenaPlayerSign], this.onPeakSignInfo, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgPeakArenaPlayerWorship], this.onPeakWorshipInfo, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgPeakArenaEnterTimer], this.onPeakEnterTimer, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgPeakBattleResult], this.onPeakBattleResult, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgPeakArenaBet], this.onPeakBetResult, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMgPeakArenaLike], this.onPeakBetLikeResult, this);

        this.addListen0(LocalEventEnum.PeakGetPeakInfo, this.onGetPeakInfo, this);
        this.addListen0(LocalEventEnum.PeakGetPeakRecord, this.onGetPeakRecord, this);
        this.addListen0(LocalEventEnum.PeakGetPeakBetRecord, this.onGetPeakBetRecord, this);
        // this.addListen0(LocalEventEnum.PeakGetPeakOwnRecord, this.onGetPeakOwnRecord, this);
        this.addListen0(LocalEventEnum.PeakGetPeakPopularityRank, this.onGetPeakPopularityRank, this);
        this.addListen0(LocalEventEnum.PeakSignUp, this.onPeakSignUp, this);
        this.addListen0(LocalEventEnum.PeakWorship, this.onPeakWorship, this);
        this.addListen0(LocalEventEnum.PeakLike, this.onPeakLike, this);
        this.addListen0(LocalEventEnum.PeakBet, this.onPeakBet, this);

        this.addListen0(UIEventEnum.PeakGambleOpen, this.onOpenGambleWin, this);
        this.addListen0(UIEventEnum.PeakGambleInfoOpen, this.onOpenGambleInfoWin, this);
        this.addListen0(UIEventEnum.PeakPopRankOpen, this.onOpenPopRankWin, this);
        this.addListen0(NetEventEnum.moneyJeton, this.onMoneyJetonUpdate, this);
        this.addListen0(NetEventEnum.ComposeLimitUpdate, this.onComposeLimitUpdate, this);
        // this.addListen0(NetEventEnum.moneyPeak, this.onMoneyPeakUpdate, this);
        this.addListen0(NetEventEnum.copyLeft, this.onCopyLeft, this);
    }

    public addListenerOnShow():void {
        this.addListen1(NetEventEnum.packPosTypePropChange, this.onPackItemUpdate, this);
    }

    private showWin(isShow:boolean, type:EPeakWinType, data:any = null): void {
        let win:BaseWindow;
        if (isShow) {
            switch (type) {
                case EPeakWinType.typeCD:this.cdWin ? win = this.cdWin : win = this.cdWin = new PeakCDWindow();
                    break;
                case EPeakWinType.typeRank:this.rankWin ? win = this.rankWin : win = this.rankWin = new PeakRankWindow();
                    break;
                case EPeakWinType.typeReport1:this.report1Win ? win = this.report1Win : win = this.report1Win = new PeakReport1Window();
                    break;
                case EPeakWinType.typeReport2:this.report2Win ? win = this.report2Win : win = this.report2Win = new PeakReport2Window();
                    break;
                case EPeakWinType.gambleInfo:this.gambleInfoWin ? win = this.gambleInfoWin : win = this.gambleInfoWin = new PeakGambleInfoWindow();
                    break;
                case EPeakWinType.gamble:this.gambleWin ? win = this.gambleWin : win = this.gambleWin = new PeakGambleWindow();
                    break;
                case EPeakWinType.result:this.resultWin ? win = this.resultWin : win = this.resultWin = new WindowPeakArenaResult();
                    break;
            }
        }

        isShow ? (!win.isShow ? win.show(data) : win.updateAll(data)) : (!win || win.hide());
    }

    private onGetPeakInfo(group:EPeakGroup):void {
        if (group == undefined) group = CacheManager.peak.curGroup;
        CacheManager.peak.curGroup = group;
        ProxyManager.peak.getPeakInfo(group);
    }

    private onGetPeakRecord(reportWinType:EPeakWinType, state:EPeakArenaState, groupId:EPeakGroup, pairId:number):void {
        this.reportWinType = reportWinType;
        if (reportWinType == EPeakWinType.typeReport1)
            this.onGetPeakOwnRecord(state);
        else
            ProxyManager.peak.getPeakRecord(state, groupId, pairId);
        // if (this.reportWinType == EPeakWinType.typeReport1) this.showWin(true, this.reportWinType, {
        //     records: [],//查看我的战绩时，先打开面板，因为可能没有
        //     winType: this.reportWinType
        // });
    }

    private onGetPeakBetRecord():void {
        ProxyManager.peak.getPeakBetRecord();
    }

    private onGetPeakOwnRecord(state:EPeakArenaState):void {
        CacheManager.peak.updateRecordState(state);
        ProxyManager.peak.getPeakOwnRecord(state);
    }

    private onGetPeakPopularityRank():void {
        ProxyManager.peak.getPeakPopularityRank();
    }

    private onPeakSignUp():void {
        ProxyManager.peak.reqSignUp();
    }

    private onPeakWorship(entityId:any):void {
        ProxyManager.peak.reqWorship(entityId);
    }

    private onPeakLike(entityId:any):void {
        ProxyManager.peak.reqLike(entityId);
    }

    private onPeakBet(pairId:number, betNO:number, betNum:number):void {
        ProxyManager.peak.reqBet(pairId, betNO, betNum);
    }

    private onOpenGambleWin(data:any):void {
        this.showWin(true, EPeakWinType.gamble, data);
    }

    private onOpenGambleInfoWin():void {
        this.showWin(true, EPeakWinType.gambleInfo);
    }

    private onOpenPopRankWin():void {
        this.showWin(true, EPeakWinType.typeRank);
    }

    private onMoneyJetonUpdate(jeton:number):void {
        this.isShow && this.module.updateJeton();
    }

    private onMoneyPeakUpdate(peak:number):void {
        this.isShow && this.module.updatePeak();
    }

    private onComposeLimitUpdate():void {
        this.isShow && this.module.updatePeakShopLimit();
    }

    private onCopyLeft(lastCopyType:number):void {
        if (CopyUtils.isPeak(lastCopyType)) {
            this.show({tabType:PanelTabType.PeakMain});
            EventManager.dispatch(LocalEventEnum.PeakGetPeakRecord, EPeakWinType.typeReport1, PeakCache.getCurRecordState());
        }
    }

    private onPeakState(msg:simple.SMgPeakArenaState):void {
        CacheManager.peak.updateState(msg);
        //收到状态改变时再请求赛况
        if (this.isShow) this.onGetPeakInfo(CacheManager.peak.curGroup);
        if (this.report1Win && this.report1Win.isShow) {
            EventManager.dispatch(LocalEventEnum.PeakGetPeakRecord, EPeakWinType.typeReport1, PeakCache.getCurRecordState());
        }
    }

    private onPeakInfo(msg:simple.SMgPeakArenaInfo):void {
        CacheManager.peak.updateInfo(msg);
        if (this.isShow) this.module.updateMain(CacheManager.peak.info);
    }

    private onPeakRecord(msg:simple.SMgPeakArenaRecords):void {
        let record:any = msg;
        let records:any[] = msg.records.data;
        for (let rc of records) {
            rc.player1 = {name_S:msg.pair.player1.name_S, entityId:msg.pair.player1.entityId};
            rc.player2 = {name_S:msg.pair.player2.name_S, entityId:msg.pair.player2.entityId};
        }
        // if (this.reportWinType == EPeakWinType.typeReport1) {
        //     record = records;
        // }
        // CacheManager.peak.updateRecordState(msg.state);
        this.showWin(true, this.reportWinType, {records:record, winType:this.reportWinType});
    }

    private onPeakBetRecord(msg:simple.SMgPeakArenaBetRecords):void {
        CacheManager.peak.updateBetRecords(msg);
        this.showWin(true, EPeakWinType.gambleInfo, CacheManager.peak.betRecords);
    }

    private onPeakOwnRecord(msg:simple.SMgPeakArenaOwnRecord):void {
        this.showWin(true, EPeakWinType.typeReport1, {data:msg, winType:this.reportWinType});
    }

    private onPeakPopularityRank(msg:simple.SMgPeakArenaPopularityRank):void {
        this.showWin(true, EPeakWinType.typeRank, msg.ranks.data);
    }

    private onPeakSignInfo(msg:any):void {
        CacheManager.peak.updateSignInfo(msg.value_I);
        if (this.isShow) this.module.updateSign();
    }

    private onPeakWorshipInfo(msg:any):void {
        CacheManager.peak.updateWorshipCount(msg.value_I);
        if (this.isShow) this.module.updateWorship();
    }

    private onPeakEnterTimer(msg:any):void {
        CacheManager.peak.updateEnterTimer(msg.value_I);
        this.checkShowCDWin();
    }

    private onPeakBattleResult(msg:any):void {
        // App.TimerManager.doDelay(2000,function(){//2秒后再显示结算
        //     if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgPeakArena))
                this.showWin(true, EPeakWinType.result, msg);
            // },this);
        // if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgPeakArena)) {
        //     CacheManager.king.stopKingEntity();
        // }
    }

    private onPeakBetResult(msg:any):void {
        CacheManager.peak.updateBetResult(msg.value_I);
        this.isShow && this.module.updateBetResult();
    }

    private onPeakBetLikeResult(msg:any):void {
        CacheManager.peak.updateLikeResult(msg.value_I);
        if (this.isShow) this.module.updateLikeResult();
        this.rankWin && this.rankWin.isShow && this.rankWin.updateLikeLeftCount();
    }

    private checkShowCDWin() {
        this.removeListener(UIEventEnum.SceneMapUpdated, this.checkShowCDWin,this);
        let isCheckPointMap:boolean = CacheManager.map.isMapInstanceType(EMapInstanceType.EMapInstanceTypeCheckPoint) && !CacheManager.copy.isInCopy;
        if (isCheckPointMap && CacheManager.peak.hasEnterTimer()) {
            this.showWin(true, EPeakWinType.typeCD);
        } else {
            this.showWin(false, EPeakWinType.typeCD);
            this.addListen0(UIEventEnum.SceneMapUpdated, this.checkShowCDWin,this);
        }
    }

    private onPackItemUpdate() {
        this.isShow && this.module.updateItemCost();
    }
}

enum EPeakWinType {
    typeCD,
    typeRank,
    typeReport1,
    typeReport2,
    gambleInfo,
    gamble,
    result
}

enum EPeakGroup {
    GROUP0 = 0,
    GROUP1 = 1,
    GROUP2 = 2,
    GROUP3 = 3,
    GROUP4 = 4
}