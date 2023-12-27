/**
 * 组队2控制器
 * @author Chris
 */
class Team2Controller extends BaseController {
    private module: CopyHallModule;
    private recordWin : TeamDropRecordWindow;

    public constructor() {
        super(ModuleEnum.Team2);//非模块
    }

    public initView(): BaseModule {
        return null;
    }

    public setModule(module:CopyHallModule): void {
        if (!this.module) this.module = module;
    }

    public addListenerOnInit(): void {
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCrossTeamInfo], this.onUpdateTeamInfoCross, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCrossTeamGetList], this.onUpdateTeamListCross, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCrossTeamLeft], this.onLeftTeamCross, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicCrossTeamFriendInvite], this.onFriendInvite, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetCachedDropLogMsgs],this.onCrossDropLog,this);

        this.addListen0(LocalEventEnum.CreateTeamCross, this.onCreateTeamCross, this);
        this.addListen0(LocalEventEnum.GetTeamListCross, this.onGetTeamListCross, this);
        this.addListen0(LocalEventEnum.ExitTeamCross, this.onExitTeamCross, this);
        this.addListen0(LocalEventEnum.KickOutMemberCross, this.onKickOutMemCross, this);
        this.addListen0(LocalEventEnum.ApplyEnterTeamCross, this.onApplyEnterTeamCross, this);
        this.addListen0(LocalEventEnum.EnterCopyCross, this.onEnterCopyCross, this);
        this.addListen0(LocalEventEnum.QuickJoinTeamCross, this.onQuickJoinTeamCross, this);
        this.addListen0(LocalEventEnum.TeamCrossOpen, this.onTeamPanelOpen, this);
        this.addListen0(LocalEventEnum.TeamCrossHide, this.onTeamPanelHide, this);
        this.addListen0(LocalEventEnum.TeamCrossInviteWorld, this.onReqTeamCrossInviteWorld, this);
        this.addListen0(LocalEventEnum.TeamCrossInviteGuild, this.onReqTeamCrossInviteGuild, this);
        this.addListen0(LocalEventEnum.TeamCrossInviteFriend, this.onReqTeamCrossInviteFriend, this);
        this.addListen0(NetEventEnum.copyLeft, this.onLeftCopy, this);
        this.addListen0(UIEventEnum.SceneMapUpdated,this.onSceneMapUpdated,this);
    }

    /**
     * 队伍信息更新
     * Message::public::SCrossTeam [Message/Public/Group.cdl]
     */
    private onUpdateTeamInfoCross(msg:any) {
        CacheManager.team2.updateTeamInfo(msg);
        if (!CacheManager.team2.isQualifyingTeam) {
            this.module && this.module.isShow && this.module.updateTeamInfo();
        }
    }

    /**
     * 好友邀请我组队
     * SCrossTeamFriendInvite
     *  */
    public onFriendInvite(data:any):void{
        if(CacheManager.team2.hasTeam || CacheManager.team2.isIgnoreInvite(data.fromPlayer.entityId) ){
            return; //有队伍状态下或是我忽略的邀请 不管
        }
        CacheManager.team2.curInviteInfo = data;
        CacheManager.team2.setEnterCopyAutoCount(Team2Cache.COUNT_HAD_INVITE);
    }

    /**
     * 离开队伍
     */
    private onLeftTeamCross(reason: any = null) {
        if (reason.value_I == EGroupLeftReason.EGroupLeftKicked) {//被踢
            CacheManager.team2.onKicked();
        }
        CacheManager.team2.updateTeamInfo(null);
        this.module && this.module.isShow && this.module.updateTeamInfo() ;
        this.module && this.module.isShow && this.module.updateTeamList();
    }

    /**
     * 队伍列表信息更新
     * groups
     */
    private onUpdateTeamListCross(msg:any) {
        CacheManager.team2.updateTeamList(msg.groups.data);
        this.module && this.module.isShow && this.module.updateTeamList();
    }

    private onLeftCopy(leftCopyType:ECopyType):void {
        if (CopyUtils.isCrossTeam(leftCopyType)) {
            EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.CopyHall,{tabType:PanelTabType.Team2});
        }
    }

    private onSceneMapUpdated():void {
        if (CacheManager.copy.isInCopyByType(ECopyType.ECopyCrossTeam)) {
            CacheManager.team2.cancelEnterCopyAutoCount();
        }
    }

    private onCreateTeamCross(copyCode:number) {
        ProxyManager.team2.createTeam(copyCode);
    }

    private onGetTeamListCross(copyCode:number) {
        ProxyManager.team2.reqTeamList(copyCode);
    }

    private onExitTeamCross() {
        ProxyManager.team2.exitTeam();
    }

    private onKickOutMemCross(memId:any) {
        ProxyManager.team2.kickoutTeamMem(memId);
    }

    private onApplyEnterTeamCross(copyCode:number, teamId:any) {
        let leftSec: number = CacheManager.team2.getJoinTeamLeftSec(teamId);
        if (leftSec > 0) {
            Tip.showLeftTip(`${leftSec}秒后才可加入`);
            return;
        }
        ProxyManager.team2.applyTeam(copyCode, teamId);
    }

    private onQuickJoinTeamCross(copyCode:number) {
        ProxyManager.team2.quickJoin(copyCode);
    }

    private onEnterCopyCross() {
        ProxyManager.team2.enterCopy();
    }

    private onTeamPanelOpen() {
        CacheManager.team2.setEnterCopyAutoCount(Team2Cache.COUNT_NO_TEAM);
    }

    private onTeamPanelHide(autoLeftCount:number) {
        if(!CacheManager.copy.isInCopy) {
            CacheManager.team2.setEnterCopyAutoCount(autoLeftCount);
        }
    }

    private onReqTeamCrossInviteWorld() {
        ProxyManager.team2.reqInviteWorld();
        Tip.showTip(LangTeam2.LANG21);
    }

    private onReqTeamCrossInviteGuild() {
        ProxyManager.team2.reqInviteGuild();
        Tip.showTip(LangTeam2.LANG21);
    }

    private onReqTeamCrossInviteFriend(entityId:any) {
        ProxyManager.team2.reqInviteFriend(entityId);
    }

    public reqDropLog():void{
		//ECmdGameGetCachedDropLogMsgs
		ProxyManager.team2.reqDropLog(ECachedDropLogMsgCopyType.ECachedDropLogMsgCopyTypeCROSSTEAM);
	}

    private onCrossDropLog(data:any):void{
        if(this.module&&this.module.isShow){
            if(!this.recordWin) {
			    this.recordWin = new TeamDropRecordWindow();
		    }
		    this.recordWin.show(data);
            //this.module.updateDropLog();
        }
    }
}
