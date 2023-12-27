/**
 * 1VN玩法主控制器
 * @author Chris
 */
class ContestController extends BaseController {
    private module: ContestModule;
    private scoreRankWin:ContestScoreRankWindow;
    private mainRankWin:ContestMainRankWindow;
    private challengersWin:ContestChallengersWindow;
    private gambleInfoWin:ContestGambleInfoWindow;
    private gambleWin:ContestGambleWindow;
    private matchWin:ContestMatchWindow;

    public constructor() {
        super(ModuleEnum.Contest);
    }

    public initView(): BaseModule {
        this.module = new ContestModule();
        return this.module;
    }

    public addListenerOnInit(): void {
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicContestState],this.onContestState,this);// 1vN状态 Message::Public::SContestState
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicContestClose],this.onCloseContest,this);// NULL
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicContestQualificationInfo],this.onUpdateQualificationInfo,this);// 资格赛信息 Message::Public::SContestQualificationInfo
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicContestInfo],this.onUpdateContestInfo,this);// 守擂赛信息 Message::Public::SContestInfo
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicContestMatchInfo],this.onUpdateContestMatchInfo,this);// 进入匹配信息 S2C- Message::Public::SContestMatchInfo	 [Message/Public/GamePublic.cdl]
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicContestPairInfo],this.onUpdateContestPairInfo,this);// 守擂者匹配信息 S2C- Message::Public::SContestPairInfo	 [Message/Public/GamePublic.cdl]
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicContestPairInfoUpdate],this.onUpdateContestPairInfoUpdate,this);// 守擂者匹配信息更新 S2C- Message::Public::SContestPairInfo	 [Message/Public/GamePublic.cdl]
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicContestBetInfo],this.onUpdateContestBetInfo,this);// 下注记录 C2S- NULL   S2C- Message::Public::SContestBetInfo
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicContestBattleResult],this.onContestResult,this);// 战斗结果
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicContestRoundInfo],this.onUpdateContestRoundInfo,this);// 场次信息

        this.addListen0(LocalEventEnum.ContestReqSign, this.onReqSign, this);
        this.addListen0(LocalEventEnum.ContestReqQualificationInfo, this.onReqQualificationInfo, this);
        this.addListen0(LocalEventEnum.ContestReqContestInfo, this.onReqContestInfo, this);
        this.addListen0(LocalEventEnum.ContestReqBet, this.onReqContestBet, this);
        this.addListen0(LocalEventEnum.ContestReqBetInfo, this.onReqContestBetInfo, this);
        this.addListen0(LocalEventEnum.ContestReqRoundInfo, this.onReqContestRoundInfo, this);
        this.addListen0(LocalEventEnum.ContestReqPairInfo, this.onReqContestPairInfo, this);

        this.addListen0(UIEventEnum.ContestWin, this.onOpenWin, this);//统一处理打开二级界面
        this.addListen0(NetEventEnum.copyLeft, this.onCopyLeft, this);
    }

    public addListenerOnShow():void {
        this.addListen1(NetEventEnum.packPosTypePropChange, this.onPackItemUpdate, this);
        this.addListen1(NetEventEnum.moneyFightingSpirit, this.fightingSpiritUpdate, this);
    }

    private showWin(isShow:boolean, type:EContestWinType, data:any = null): void {
        let win:BaseWindow;
        if (isShow) {
            switch (type) {
                case EContestWinType.ScoreRank:this.scoreRankWin ? win = this.scoreRankWin : win = this.scoreRankWin = new ContestScoreRankWindow();
                    break;
                case EContestWinType.MainRank:this.mainRankWin ? win = this.mainRankWin : win = this.mainRankWin = new ContestMainRankWindow();
                    break;
                case EContestWinType.Challengers:this.challengersWin ? win = this.challengersWin : win = this.challengersWin = new ContestChallengersWindow();
                    break;
                case EContestWinType.GambleInfo:this.gambleInfoWin ? win = this.gambleInfoWin : win = this.gambleInfoWin = new ContestGambleInfoWindow();
                    break;
                case EContestWinType.Gamble:this.gambleWin ? win = this.gambleWin : win = this.gambleWin = new ContestGambleWindow();
                    break;
                case EContestWinType.Match:this.matchWin ? win = this.matchWin : win = this.matchWin = new ContestMatchWindow();
                    break;
            }
        }

        isShow ? (!win.isShow ? win.show(data) : win.updateAll(data)) : (!win || win.hide());
    }

    ///////////////////////////////////请求////////////////////////////////////////
    private onReqSign() {
        ProxyManager.contest.reqSign();
    }

    private onReqQualificationInfo() {
        ProxyManager.contest.reqQualificationInfo();
    }

    private onReqContestInfo() {
        ProxyManager.contest.reqContestInfo();
    }

    private onReqContestBet(pairId:number, contestKeeperBetWin:boolean, betNum:number) {
        ProxyManager.contest.reqContestBet(pairId, contestKeeperBetWin, betNum);
    }

    private onReqContestBetInfo() {
        ProxyManager.contest.reqContestBetInfo();
    }

    private onReqContestRoundInfo() {
        ProxyManager.contest.reqContestRoundInfo();
    }

    private onReqContestPairInfo() {
        ProxyManager.contest.reqContestPairInfo();
    }

    private onOpenWin(winType:EContestWinType, data?:any) {
        this.showWin(true, winType, data);
    }

    private onCopyLeft(lastCopyType:number):void {
        if (CopyUtils.isContest(lastCopyType)) {
            this.show({tabType:CacheManager.contest.state == EContestState.EContestStateQualification ? PanelTabType.ContestQualification : PanelTabType.ContestMain});
        }
    }

    ///////////////////////////////////返回////////////////////////////////////////
    private onContestState(msg:simple.SContestState): void {
        let preState:EContestState = CacheManager.contest.state;
        let preRound:number = CacheManager.contest.stateRound;
        CacheManager.contest.updateState(msg);
        if (preState != msg.state_I) EventManager.dispatch(LocalEventEnum.ContestStateUpdate);
        if (preState && preState != msg.state_I) {//状态切换时主动请求
            if (msg.state_I == EContestState.EContestStateQualification) {
                EventManager.dispatch(LocalEventEnum.ContestReqQualificationInfo);
            } else if (msg.state_I == EContestState.EContestStateContest) {
                EventManager.dispatch(LocalEventEnum.ContestReqContestInfo);

                if (this.isShow) this.module.checkChangeContestTab();
            }
        } else if (this.isShow) {
            let curRound:number = CacheManager.contest.stateRound;
            if (preRound != curRound) {
                let curState:EContestState = CacheManager.contest.state;
                if (curState == EContestState.EContestStateQualification && this.module.isTypePanel(PanelTabType.ContestQualification)) {
                    EventManager.dispatch(LocalEventEnum.ContestReqQualificationInfo);
                } else if (curState >= EContestState.EContestStateContest && this.module.isTypePanel(PanelTabType.ContestMain)) {
                    EventManager.dispatch(LocalEventEnum.ContestReqContestInfo);
                }
            }
        }
        EventManager.dispatch(LocalEventEnum.ContestCheckIcon);
        EventManager.dispatch(LocalEventEnum.ContestStateUpdate);
    }

    private onCloseContest(): void {
        CacheManager.contest.isOpen = false;
        EventManager.dispatch(LocalEventEnum.ContestCheckIcon);
    }

    private onUpdateQualificationInfo(msg:simple.SContestQualificationInfo): void {
        CacheManager.contest.updateQualificationInfo(msg);
        if (this.isShow) this.module.updateQualificationInfo();
        EventManager.dispatch(LocalEventEnum.ContestQualificationInfoUpdate);
    }

    private onUpdateContestInfo(msg:simple.SContestInfo): void {
        CacheManager.contest.updateContestInfo(msg);
        if (this.isShow) this.module.updateContestInfo();
        EventManager.dispatch(LocalEventEnum.ContestInfoUpdate);
    }

    private onUpdateContestMatchInfo(msg:simple.SContestMatchInfo): void {
        CacheManager.contest.updateMatchInfo(msg);
        this.checkShowMatchWin();
    }

    private checkShowMatchWin() {
        this.removeListener(UIEventEnum.SceneMapUpdated, this.checkShowMatchWin,this);
        let isShowMatch:boolean = !CacheManager.copy.isInCopy;
        if (CacheManager.contest.hasLastEnterTimer()) {
            this.showWin(isShowMatch, EContestWinType.Match, CacheManager.contest.matchInfo);
            if (!isShowMatch) this.addListen0(UIEventEnum.SceneMapUpdated, this.checkShowMatchWin,this);
        } else {
            this.showWin(false, EContestWinType.Match);
        }
    }

    private onUpdateContestPairInfo(msg:simple.SContestPairInfo): void {
        CacheManager.contest.updatePairInfo(msg);
        Log.trace(Log.OVN, `onUpdateContestPairInfo:round=${msg.round_I}, msgLen=${msg.pairs && msg.pairs.data.length}, pairLen=${CacheManager.contest.pairInfo.pairs.data.length}`);
        if (this.isShow) this.module.updateContestPairInfo();
    }

    private onUpdateContestPairInfoUpdate(msg:simple.SContestPairInfo): void {
        CacheManager.contest.updatePairInfoItems(msg);
        Log.trace(Log.OVN, `onUpdateContestPairInfo[Update]:round=${msg.round_I}, msgLen=${msg.pairs && msg.pairs.data.length}, pairLen=${CacheManager.contest.pairInfo.pairs.data.length}`);
        if (this.isShow) this.module.updateContestPairInfo();
    }

    private onUpdateContestBetInfo(msg:simple.SContestBetInfo): void {
        // this.showWin(true, EContestWinType.GambleInfo, msg);
        CacheManager.contest.updateBetInfo(msg);
        if (this.gambleInfoWin && this.gambleInfoWin.isShow) this.gambleInfoWin.updateAll(msg);
        if (this.isShow) this.module.updateContestBetInfo();
    }

    private onContestResult(msg:any): void {
        App.TimerManager.doDelay(1500,function(){
            //结算晚点出来
            if(CacheManager.copy.isInCopyByType(ECopyType.ECopyContest)) {
                EventManager.dispatch(NetEventEnum.ContestResult, msg);
            }
        },this);
    }

    private onUpdateContestRoundInfo(msg:any): void {
        CacheManager.contest.updateRoundInfo(msg);
        if (this.isShow) this.module.updateRoundInfo();
    }

    private onPackItemUpdate(): void{
        if(this.isShow){
            this.module.updateExchangePanel();
        }
    }

    private fightingSpiritUpdate(): void{
        if(this.isShow){
            this.module.updateShopPanel();
        }
    }

}

enum EContestWinType {
    ScoreRank,
    MainRank,
    Challengers,
    GambleInfo,
    Gamble,
    Match,
}