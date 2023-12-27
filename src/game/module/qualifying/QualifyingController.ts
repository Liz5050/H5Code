/**
 * 3V3玩法主控制器
 * @author Chris
 */
class QualifyingController extends BaseController {
    private module: QualifyingModule;
    private inviteWin: QualifyingInvitationWindow;
    private resultWin: QualifyingResultWindow;
    private rewardWin: QualifyingStageRewardWindow;

    public constructor() {
        super(ModuleEnum.Qualifying);
    }

    public initView(): BaseModule {
        this.module = new QualifyingModule();
        return this.module;
    }

    public addListenerOnInit(): void {
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicQualifyingOpen],this.onQualifyingOpen,this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicQualifyingClose],this.onQualifyingClose,this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicQualifyingNoticeMsg],this.onQualifyingNotice,this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicQualifyingInfo],this.onQualifyingInfo,this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicQualifyingCopyInfo],this.onQualifyingCopyInfo,this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicQualifyingCopyShowReward],this.onQualifyingCopyShowReward,this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicQualifyingCopyUpdate],this.onQualifyingCopyInfoUpdate,this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicQualifyingRanks],this.onQualifyingRanks,this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicQualifyingGetGoalReward],this.onQualifyingGoalReward,this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicQualifyingFriendInfo],this.onQualifyingFriendInfo,this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicQualifyingDayOpen],this.onQualifyingDayIconOpen,this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicQualifyingDayClose],this.onQualifyingDayIconClose,this);

        this.addListen0(LocalEventEnum.QualifyingReqInfo, this.onReqInfo, this);
        this.addListen0(LocalEventEnum.QualifyingReqMatch, this.onReqMatch, this);
        this.addListen0(LocalEventEnum.QualifyingReqCancelMatch, this.onReqCancelMatch, this);
        this.addListen0(LocalEventEnum.TeamCrossInfoUpdate, this.onCrossTeamInfoUpdate, this);
        this.addListen0(LocalEventEnum.QualifyingReqEnterCopy, this.onReqEnterCopy, this);
        this.addListen0(LocalEventEnum.QualifyingReqRanks, this.onReqRanks, this);
        this.addListen0(LocalEventEnum.QualifyingReqGetDayRewards, this.onReqGetDayRewards, this);
        this.addListen0(LocalEventEnum.QualifyingReqGetGoalReward, this.onReqGetGoalReward, this);
        this.addListen0(LocalEventEnum.QualifyingReqFriendList, this.onReqFriendList, this);

        this.addListen0(UIEventEnum.QualifyingWin, this.onOpenWin, this);//统一处理打开二级界面
        this.addListen0(LocalEventEnum.GameInit, this.gameInit, this);
        // this.addListen0(NetEventEnum.copyLeft, this.onCopyLeft, this);
    }

    public addListenerOnShow():void {
    }

    private gameInit():void {
        this.removeListener(LocalEventEnum.GameInit, this.gameInit, this);
        if (ConfigManager.mgOpen.isOpenedByKey(ModuleEnum[ModuleEnum.Qualifying],false))
            this.onReqInfo();//游戏初始化请求数据
    }

    private showWin(isShow:boolean, type:EQualifyingWinType, data:any = null): void {
        let win:BaseWindow;
        if (isShow) {
            switch (type) {
                case EQualifyingWinType.Invite:this.inviteWin ? win = this.inviteWin : win = this.inviteWin = new QualifyingInvitationWindow();
                    break;
                case EQualifyingWinType.Result:this.resultWin ? win = this.resultWin : win = this.resultWin = new QualifyingResultWindow();
                    break;
                case EQualifyingWinType.Reward:this.rewardWin ? win = this.rewardWin : win = this.rewardWin = new QualifyingStageRewardWindow();
                    break;
            }
        }

        isShow ? (!win.isShow ? win.show(data) : win.updateAll(data)) : (!win || win.hide());
    }

    ///////////////////////////////////请求////////////////////////////////////////
    private onReqInfo() {
        ProxyManager.qualifying.reqInfo();
    }

    private onReqMatch() {
        ProxyManager.qualifying.reqMatch();
    }

    private onReqCancelMatch() {
        ProxyManager.qualifying.reqCancelMatch();
    }

    private onReqEnterCopy() {
        ProxyManager.qualifying.reqEnterCopy();
    }

    private onReqRanks() {
        ProxyManager.qualifying.reqRanks();
    }

    private onReqGetDayRewards() {
        ProxyManager.qualifying.reqGetDayRewards();
    }

    private onReqGetGoalReward(count:number) {
        ProxyManager.qualifying.reqGetGoalReward(count);
    }

    private onReqFriendList(idSeq:any) {
        ProxyManager.qualifying.reqFriendList(idSeq);
    }

    private onOpenWin(winType:EQualifyingWinType, data?:any) {
        this.showWin(true, winType, data);
    }

    private onCopyLeft(lastCopyType:number):void {
        if (CopyUtils.isContest(lastCopyType)) {
            this.show({tabType:CacheManager.contest.state == EContestState.EContestStateQualification ? PanelTabType.ContestQualification : PanelTabType.ContestMain});
        }
    }

    private onCrossTeamInfoUpdate():void {
        let teamInfo:any = CacheManager.team2.teamInfo;
        if (this.isShow) {
            this.module.updateQualifyingTeam(teamInfo);
        } else if (teamInfo && CacheManager.team2.isQualifyingTeam && !CacheManager.copy.isInCopyByType(ECopyType.ECopyQualifying)) {
            this.show({tabType:PanelTabType.QualifyingMain});
        }
        EventManager.dispatch(LocalEventEnum.QualifyingStateChanged);
        if (CacheManager.qualifying.isSingleMatch) {
            this.onReqMatch();
            CacheManager.qualifying.isSingleMatch = false;
        }
    }

    ///////////////////////////////////返回////////////////////////////////////////
    private onQualifyingOpen(msg:simple.SQualifyingOpen): void {
        CacheManager.qualifying.setOpen(msg);
        EventManager.dispatch(LocalEventEnum.QualifyingStateUpdate);
    }

    private onQualifyingClose(): void {
        CacheManager.qualifying.setOpen(null);
        EventManager.dispatch(LocalEventEnum.QualifyingStateUpdate);
    }

    private onQualifyingNotice(msg:simple.SPublicNotice): void {
        //显示广播
        Log.trace(Log.TVT, `收到3V3广播：${msg}`);
    }

    private onQualifyingInfo(msg:simple.SQualifyingInfo): void {
        CacheManager.qualifying.updateInfo(msg);
        if (this.isShow) {
            this.module.updateQualifyingInfo(msg);
        }
        EventManager.dispatch(LocalEventEnum.QualifyingInfoUpdate);
        EventManager.dispatch(LocalEventEnum.QualifyingTipsChanged);
    }

    private onQualifyingCopyInfo(msg:simple.SQualifyingCopyInfo): void {
        CacheManager.qualifying.updateCopyInfo(msg);
        // if (this.isShow) {
        //     this.module.updateQualifyingInfo(msg);
        // }
        EventManager.dispatch(LocalEventEnum.QualifyingCopyInfo, msg);
    }

    private onQualifyingCopyInfoUpdate(msg:simple.SQualifyingCopyUpdate): void {
        // CacheManager.qualifying.updateCopyInfo(msg);
        // if (this.isShow) {
        //     this.module.updateQualifyingInfo(msg);
        // }
        EventManager.dispatch(LocalEventEnum.QualifyingCopyInfoUpdate, msg);
    }

    private onQualifyingCopyShowReward(msg:simple.SQualifyingCopyShowReward): void {
        // CacheManager.qualifying.updateCopyShowReward(msg);
        // if (this.isShow) {
        //     this.module.updateQualifyingInfo(msg);
        // }
        this.showWin(true, EQualifyingWinType.Result, msg);
        Log.trace(Log.TVT, "CopyShowReward：", msg);
    }

    private onQualifyingRanks(msg:simple.SQualifyingRanks): void {
        CacheManager.qualifying.updateRanks(msg);
        if (this.isShow) {
            this.module.updateQualifyingRanks(msg);
        }
        // EventManager.dispatch(LocalEventEnum.QualifyingCopyInfoUpdate);
    }

    private onQualifyingGoalReward(msg:any): void {
        CacheManager.qualifying.updateGoalGet(msg.value_I);
        if (this.isShow) {
            this.module.updateQualifyingGoalGet();
        }
    }

    private onQualifyingFriendInfo(msg:simple.SQualifyingFriendInfo): void {
        this.showWin(true, EQualifyingWinType.Invite, msg);
    }

    private onQualifyingDayIconOpen(msg:any): void {
        CacheManager.qualifying.isOpen = true;
    }

    private onQualifyingDayIconClose(msg:any): void {
        CacheManager.qualifying.isOpen = false;
    }

}

enum EQualifyingWinType {
    Invite,
    Result,
    Reward,
}