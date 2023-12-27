class TeamController extends BaseController {
    private teamWindow: TeamWindow;
    private teamConfirmWindow: TeamConfirmWindow;
    private teamApplyList: TeamApplyListWindow;
    private teamInvite: TeamInviteWindow;
    private teamBeInvite: TeamBeInviteWindow;

    /**无队伍时，邀请过的玩家实体id */
    private invitePlayer: any;
    private teamInviteSend: TeamInviteSendWindow;
    private modelTipWin: TeamModelTipsWindow;

    public constructor() {
        super(ModuleEnum.Team);
    }

    public show(data?: any): void {
        // UIManager.closeAll();
        super.show(data);
        /*if(CacheManager.team.hasNewApply)
        {
            // CacheManager.team.hasNewApply = false;
            this.onApplyListOpen();
        }
        if(CacheManager.team.hasNewInvite)
        {
            CacheManager.team.hasNewInvite = false;
            if(!this.teamBeInvite)
            {
                this.teamBeInvite = new TeamBeInviteWindow();
            }
            this.teamBeInvite.show();
        }
        EventManager.dispatch(LocalEventEnum.TeamTipsIconUpdate);*/
    }

    public initView(): BaseWindow {
        this.teamWindow = new TeamWindow(this.moduleId);
        return this.teamWindow;
    }

    protected addListenerOnInit(): void {
        this.addListen0(LocalEventEnum.CreateTeam, this.onCreateTeamHandler, this);
        this.addListen0(LocalEventEnum.ApplyEnterTeam, this.onApplyTeamHandler, this);
        this.addListen0(LocalEventEnum.ApplyExEnterTeam, this.onApplyExTeamHandler, this);
        this.addListen0(LocalEventEnum.ExitTeam, this.onExitTeamHandler, this);
        this.addListen0(LocalEventEnum.KickOutMember, this.onKickOutTeamHandler, this);
        this.addListen0(LocalEventEnum.TeamListRefresh, this.onTeamListRefresh, this);
        this.addListen0(LocalEventEnum.TeamAutoMatch, this.onAutoMatchHandler, this);
        this.addListen0(LocalEventEnum.TeamEnterCopyCheck, this.onEnterCopyCheck, this);
        this.addListen0(LocalEventEnum.TeamAutoSettingChange, this.onChangeTeamSetting, this);
        this.addListen0(LocalEventEnum.TeamApplyDeal, this.onApplyDealHandler, this);
        this.addListen0(LocalEventEnum.GetNearbyPlayerList, this.onGetNearbyPlayers, this);
        this.addListen0(LocalEventEnum.TeamInvitePlayer, this.onInvitePlayerEnterTeam, this);
        this.addListen0(LocalEventEnum.TeamTargetChange, this.onChangeTeamTarget, this);
        this.addListen0(NetEventEnum.copyEnter, this.onEnterCopy, this);
        this.addListen0(NetEventEnum.copyLeft, this.onLeftCopy, this);
        this.addListen0(LocalEventEnum.TeamInviteSend, this.onSendChat, this);
        this.addListen0(UIEventEnum.TeamInviteSendOpen, this.onInviteSendWindowOpen, this);
        this.addListen0(UIEventEnum.TeamInvitePlayerOpen, this.onInviteWindowOpen, this);

        /**申请列表红点更新 */
        this.addListen0(LocalEventEnum.TeamTipsIconUpdate, this.onTeamTipsIconUpdate, this);

        this.addListen0(UIEventEnum.TeamApplyListOpen, this.onApplyListOpen, this);
        this.addListen0(UIEventEnum.TeamModelTipsOpen, this.onModelTipOpen, this);

        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGroupInfo], this.onTeamInfoUpdate, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGroupEntityInfo], this.onMemberInfoUpdate, this);
        // this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGroupApplyList],this.onApplyListUpdate,this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGroupNearbyList], this.onNearPlayerUpdate, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGroupList], this.onTeamListUpdate, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGroupModifyTarget], this.onTeamTargetUpdate, this);
        // this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGroupMatchGroup],this.onTeamMatchHandler,this);
        // this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGroupMatchPlayer],this.onSelfMatchHandler,this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGroupLeft], this.onLeftTeamHandler, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGroupDisbandGroup], this.onTeamDisbandHandler, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGroupModifyCaptain], this.onCaptainChangeHandler, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGroupCheckCopy], this.onCheckEnterCopy, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGroupSetGroup], this.onTeamSettingUpdate, this);

        // this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGroupApply],this.onTeamApplyUpdate,this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGroupInvite], this.onTeamInviteUpdate, this);


        //  ECmdPublicGroupApply 		        = 20050,//申请组队 ::Message::Public::SGroupInvite [Message/Public/GamePublic.cdl]
        // 	ECmdPublicGroupInvite 				= 20051,//邀请组队 ::Message::Public::SGroupInvite [Message/Public/GamePublic.cdl]
        // 	ECmdPublicGroupAgree 		        = 20052,//同意组队 ::Message::Public::SGroupAgree [Message/Public/Group.cdl]
        // 	ECmdPublicGroupKickOut 				= 20054,//踢出玩家 ::Message::Public::SEntityId [Message/Public/GamePublic.cdl]
        // 	ECmdPublicGroupModifyAllocation		= 20056,//修改分配 ::Message::Public::SAttribute [Message/Public/EntityUpdate.cdl]
        // 	ECmdPublicGroupOffline				= 20057,//玩家下线 NULL
        // 	ECmdPublicGroupInviteEx				= 20058,//邀请扩展 ::Message::Public::SGroupInviteEx [Message/Public/Group.cdl]
        // 	ECmdPublicGroupRecject			    = 20059,//拒绝     ::Message::Public::SGroupAgree [Message/Public/Group.cdl]
        // 	ECmdPublicGroupSetGroup = 20068,//设置队伍 Message::Public::SGroupSetting [Message/Public/Group.cdl]
        // ECmdPublicGroupAutoGroup = 20069,//快速入伍  Message::Public::SGroupAuto [Message/Public/Group.cdl]

        // ECmdPublicGroupPoints = 20071, //队员坐标 ::Message::Public::SEntityPointInfo [Message/Public/GamePublic.cdl]
        // ECmdPublicGroupEquipInfo = 20072, //队员装备 ::Message::Public::SGroupEquipInfo [Message/Public/Group.cdl]
    }

    protected addListenerOnShow(): void {
        //this.addListen1(LocalEventEnum.TeamTargetChange,this.onChangeTeamTarget,this);
        this.addListen1(LocalEventEnum.TeamWorldShow, this.onTeamWorldShowHandler, this);

        //this.addListen1(UIEventEnum.TeamInvitePlayerOpen, this.onInviteWindowOpen, this);
        this.addListen1(NetEventEnum.ChatHomeMsgUpdate, this.onChatUpdate, this);
        this.addListen1(LocalEventEnum.ChatHomePanelVisible, this.onSetChatPanel, this);
    }

    /**打开邀请界面 */
    private onInviteWindowOpen(): void {
        if (!this.teamInvite) {
            this.teamInvite = new TeamInviteWindow();
        }
        this.teamInvite.show();
    }

    /**打开邀请总界面 */
    private onInviteSendWindowOpen(teamType : number): void {
        if (!this.teamInviteSend) {
            this.teamInviteSend = new TeamInviteSendWindow();
        }
        this.teamInviteSend.show(teamType);
    }

    /**打开申请列表 */
    private onApplyListOpen(): void {
        if (!this.teamApplyList) {
            this.teamApplyList = new TeamApplyListWindow();
        }
        this.teamApplyList.show();
        ProxyManager.team.getApplyList();
    }

    private updateTeamWindow(): void {
        let hasTeam:boolean = CacheManager.team.hasTeam;
        let inCopy:boolean = CacheManager.copy.isInCopy;
        if (this.isShow) {
            if (hasTeam && !inCopy)
                this.teamWindow.updateAll();
            else
                this.hide();
        } else if (hasTeam && !inCopy) {
            this.show();
        }
    }

    private onTeamTipsIconUpdate(): void {
        if (this.teamWindow && this.teamWindow.isShow) {
            // this.teamWindow.setApplyTips(CacheManager.team.hasNewApply);
        }
    }

    private onModelTipOpen(data:any): void {
        if (!this.modelTipWin) this.modelTipWin = new TeamModelTipsWindow();
        this.modelTipWin.show(data);
    }

    /******************队伍相关协议更新 server update***********/

    /**
     * 队伍信息更新
     * ::Message::Public::SGroup [Message/Public/Group.cdl]
     */
    private onTeamInfoUpdate(groupData: any): void {
        if (!CacheManager.team.hasTeam) {
            //更新前无队伍
            CacheManager.team.hasNewInvite = false;
            EventManager.dispatch(LocalEventEnum.TeamTipsIconUpdate);
        }
        CacheManager.team.updateTeamInfo(groupData);
        this.updateTeamWindow();
        if (CacheManager.team.hasTeam) {
            //更新后有队伍
            if (this.teamBeInvite && this.teamBeInvite.isShow) {
                this.teamBeInvite.hide();
            }
        }
        if (this.invitePlayer) {
            this.onInvitePlayerEnterTeam(this.invitePlayer);
            this.invitePlayer = null;
            if (this.teamInvite && this.teamInvite.isShow) {
                this.teamInvite.hide();
            }
        }
    }

    private onEnterCopy():void {
        if (CacheManager.copy.isInCopy && this.isShow) {
            this.hide();
        }
    }

    private onLeftCopy(leftCopyType:ECopyType):void {
        if (CopyUtils.isLegend(leftCopyType)) {
            let code:number = CopyUtils.getFirstStarNoFullCopyCode(CopyEnum.CopyLegend, ECopyType.ECopyLegend);
            if (code > 0) {
                let copyTarget:any = CacheManager.team.getCopyTarget(ConfigManager.copy.getByPk(code));
                if (!CacheManager.team.hasTeam) {
                    // EventManager.dispatch(LocalEventEnum.CreateTeam, copyTarget);
                } else if (CacheManager.team.captainIsMe) {//组队打下一关的target-我是队长
                    this.onChangeTeamTarget(copyTarget.type, copyTarget.targetValue, copyTarget.enterMinLevel, copyTarget.enterMaxLevel, false);
                }
            } else if (CacheManager.team.hasTeam && CacheManager.team.captainIsMe) {//都打完了-我是队长
                this.onExitTeamHandler();
            }
        }
    }

    private onSendChat(type:number):void {
        ProxyManager.team.sendChat(type);
    }

    /**
     * 队员信息更新
     * ::Message::Public::SPublicMiniPlayer [Message/Public/GamePublic.cdl]
     */
    private onMemberInfoUpdate(data: any): void {
        CacheManager.team.updateMemberInfo(data);
        this.updateTeamWindow();
    }

    /**
     * 申请列表更新
     * ::Message::Public::SSeqGroupInvite [Message/Public/Group.cdl]
     */
    private onApplyListUpdate(data: any): void {
        CacheManager.team.applyDataList = data.invites.data;
        if (this.teamApplyList && this.teamApplyList.isShow) {
            this.teamApplyList.updateApplyList();
        }
    }

    /**
     * 附近玩家列表更新
     * ::Message::Public::SSeqPublicMiniPlayer [Message/Public/GamePublic.cdl]
     */
    private onNearPlayerUpdate(data: any): void {
        CacheManager.team.updateNearbyPlayer(data.miniplayers.data);
        if (this.teamInvite && this.teamInvite.isShow) {
            this.teamInvite.updatePlayerList();
        }
    }

    /**
     * 队伍列表更新
     * ::Message::Public::SSeqMiniGroup [Message/Public/Group.cdl]
     */
    private onTeamListUpdate(msgData: any): void {
        CacheManager.team.teamList = msgData.groups.data;
        // if(this.teamWindow && this.teamWindow.isShow)
        // {
        // 	this.teamWindow.updateTeamView();
        // }
    }

    /**
     * 队伍目标更新
     * ::Message::Public::SGroupTarget [Message/Public/Group.cdl]
     */
    private onTeamTargetUpdate(data: any): void {
        //**targeValue 字段命名服务端漏写了t 其他相同结构中又没有少t*/
        data.targetValue_I = data.targeValue_I;
        CacheManager.team.updateTeamTarget(data);
        this.updateTeamWindow();
        // if(this.teamWindow && this.teamWindow.isShow)
        // {
        // 	this.teamWindow.updateTeamTarget();
        // }
    }

    /**
     * 队伍匹配
     * SBool [CdlPublic.cdl]
     */
    private onTeamMatchHandler(data: any): void {
        CacheManager.team.groupMatching = data.bVal_B;
        // if(this.teamWindow && this.teamWindow.isShow)
        // {
        // 	this.teamWindow.updateTeamView();
        // }
    }

    /**
     * 个人匹配
     * SBool [CdlPublic.cdl]
     */
    private onSelfMatchHandler(data: any): void {
        CacheManager.team.playerMatching = data.bVal_B;
        // if(this.teamWindow && this.teamWindow.isShow)
        // {
        // 	this.teamWindow.updateTeamView();
        // }
    }

    /**
     * 离开队伍
     * SGroupEntityLeft    [Group.cdl]
     * SEntityId entityId;
     * EGroupLeftReason reason;
     */
    private onLeftTeamHandler(data: any): void {
        if (EntityUtil.isMainPlayer(data.entityId)) {
            if (data.reason == EGroupLeftReason.EGroupLeftKicked) {
                //被踢
                Tip.showTip("您已被踢出队伍");
            }
            else if (data.reason == EGroupLeftReason.EGroupLeftDisband) {
                //解散
                Tip.showTip("队伍已解散");
            }
            else {
                Tip.showTip("您已离开队伍");
            }
            CacheManager.team.updateTeamInfo(null);
            CacheManager.team.hasNewApply = false;
            EventManager.dispatch(LocalEventEnum.TeamTipsIconUpdate);
        }
        else {
            CacheManager.team.updateMemberInfo(data, data.reason);
        }
        this.updateTeamWindow();
    }

    /**
     * 队伍解散
     * null
     */
    private onTeamDisbandHandler(): void {
    }

    /**
     * 队长改变
     * SEntityId
     */
    private onCaptainChangeHandler(data: any): void {
        CacheManager.team.teamInfo.captainId = data;
        let _entity: any = CacheManager.team.getTeamMember(data);
        if (_entity) {
            Tip.showTip(_entity.name_S + "成为了队长");
        }
        this.updateTeamWindow();
        EventManager.dispatch(NetEventEnum.TeamCaptainChange);
    }

    /**
     * 进副本确认
     * SCopyCheckStatus [Group.cdl]
     */
    private onCheckEnterCopy(data: any): void {
        if (!this.teamConfirmWindow) {
            this.teamConfirmWindow = new TeamConfirmWindow();
        }

        if (!this.teamConfirmWindow.isShow) {
            if (data.status.value_B.indexOf(false) == -1) {
                //确认界面没显示，且没有队员拒绝的情况
                this.teamConfirmWindow.show(data);
            }
        }
        else {
            this.teamConfirmWindow.updateCheckEnterState(data.status);
        }
    }

    /**
     * 队伍设置更新
     * SGroupSetting
     **/
    private onTeamSettingUpdate(data: any): void {
        CacheManager.team.autoEnter = data.autoEnter_B;
        CacheManager.team.memberInvite = data.memberInvite_B;
    }

    /**
     * 玩家申请入队更新
     * SGroupInvite
     */
    private onTeamApplyUpdate(data: any): void {
        CacheManager.team.addPlayerApplyList(data);
        if (this.teamApplyList && this.teamApplyList.isShow) {
            this.teamApplyList.updateApplyList();
        }
        if (CacheManager.team.hasTeam && !CacheManager.team.teamIsFull) {
            CacheManager.team.hasNewApply = true;
            EventManager.dispatch(LocalEventEnum.TeamTipsIconUpdate);
        }
    }

    /**
     * 队长邀请入队更新
     * SGroupInvite
     */
    private onTeamInviteUpdate(data: any): void {
        CacheManager.team.addCaptainInviteMeList(data);
        if (this.teamBeInvite && this.teamBeInvite.isShow) {
            this.teamBeInvite.updateInviteList();
        }
        if (!CacheManager.team.hasTeam) {
            CacheManager.team.hasNewInvite = true;
            EventManager.dispatch(LocalEventEnum.TeamTipsIconUpdate);
        }
    }

    /*******************请求操作 client send*****************************/
    /**
     * 请求创建队伍
     * C2S_SGroupCreateGroup
     */
    private onCreateTeamHandler(data: any): void {
        if (CacheManager.team.hasTeam) {
            Tip.showTip("已有队伍");
            return;
        }
        let _target: any = data;
        if (!data) _target = CacheManager.team.teamTarget;
        if (!_target) {
            Tip.showTip("队伍目标设置出错");
            return;
        }
        ProxyManager.team.createTeam(_target);
    }

    /**
     * 申请入队
     * 根据 entityId 入队
     */
    private onApplyTeamHandler(entityId: any): void {
        if (CacheManager.team.hasTeam) {
            Tip.showTip("已有队伍");
            return;
        }
        ProxyManager.team.applyTeam(entityId);
    }

    /**
     * 申请入队
     * 根据 groupId 入队
     */
    private onApplyExTeamHandler(groupId: any, copyCode:number): void {
        if (CacheManager.team.hasTeam) {
            Tip.showTip("已有队伍");
            return;
        }
        /*let copyType:ECopyType = ConfigManager.copy.getCopyType(copyCode);
        if (CopyUtils.isLegend(copyType)) {
            let canChallengeCode: number = CopyUtils.getFirstStarNoFullCopyCode(CopyEnum.CopyLegend, ECopyType.ECopyLegend);
            if (copyCode > canChallengeCode) {
                Tip.showTip(LangLegend.LANG25, Color.Red);
                return;
            }
        }*/
        ProxyManager.team.applyExTeam(groupId, copyCode);
    }

    /**
     * 请求退出队伍
     */
    private onExitTeamHandler(): void {
        ProxyManager.team.exitTeam();
    }

    /**
     * 请求踢出一个队员
     * SEntityId
     */
    private onKickOutTeamHandler(entityId: any): void {
        ProxyManager.team.kickOutMember(entityId);
    }

    /**
     * 请求刷新队伍列表
     * @param targetType 队伍目标
     * @param targetValue 地图id或者副本id
     */
    private onTeamListRefresh(targetType: EGroupTargetType, targetValue: number): void {
        if (targetType == EGroupTargetType.EGroupTargetNull) return;
        ProxyManager.team.refreshTeamList(targetType, targetValue);
    }

    /**
     * 请求改变队伍目标点
     */
    private onChangeTeamTarget(type: EGroupTargetType, targetValue: number, minLv: number, maxLv: number, isUpdate: boolean): void {
        if (CacheManager.team.hasTeam) {
            let oldTeamTarget:any = CacheManager.team.teamTarget;
            if (!oldTeamTarget || oldTeamTarget.targetValue != targetValue)
                ProxyManager.team.changeTeamTarget(type, targetValue, minLv, maxLv);
        }
        else {
            CacheManager.team.updateTeamTarget({
                targetType: type,
                targetValue_I: targetValue,
                minLevel_SH: minLv,
                maxLevel_SH: maxLv
            });
        }
        if (isUpdate) {
            this.updateTeamWindow();
        }

    }

    /**
     * 请求自动匹配
     */
    private onAutoMatchHandler(type: EGroupTargetType = null, targetValue: number = -1): void {
        if (CacheManager.team.hasTeam) {
            if (!CacheManager.team.captainIsMe) {
                Tip.showTip("队长才可匹配");
                return;
            }
            if (CacheManager.team.teamIsFull) {
                Tip.showTip("队伍已满员");
                return;
            }
            if (CacheManager.team.teamTarget.type != EGroupTargetType.EGroupTargetCopy) {
                Tip.showTip("只可匹配副本队伍");
                return;
            }
            //有队伍匹配
            ProxyManager.team.groupMatch(CacheManager.team.groupMatching);
        }
        else {
            let _targetType: EGroupTargetType = type;
            let _targetValue: number = targetValue;
            if (_targetType == null) {
                let _target: any = CacheManager.team.teamTarget;
                _targetType = _target.type;
                _targetValue = _target.targetValue;
            }
            //无队伍匹配
            ProxyManager.team.playerMatch(CacheManager.team.playerMatching, _targetType, _targetValue);
        }
    }

    /**发送进副本确认状态 */
    private onEnterCopyCheck(isEnter: boolean): void {
        ProxyManager.team.enterCopyCheck(isEnter);
    }

    /**
     * 请求世界喊话
     */
    private onTeamWorldShowHandler(): void {
        ProxyManager.team.teamWorldShow();
    }

    /**变更队伍设置 */
    private onChangeTeamSetting(autoEnter: boolean, memberInvite: boolean = true): void {
        ProxyManager.team.teamSetting(autoEnter, memberInvite);
    }

    /**
     * 处理申请/邀请信息
     */
    private onApplyDealHandler(entityId: any, certId: string, isAgree: boolean, type: EGroupMsgType = EGroupMsgType.EGroupMsgTypeApply): void {
        if (this.teamApplyList && this.teamApplyList.isShow) {
            this.teamApplyList.removeApplyItem(entityId);
        }
        if (this.teamBeInvite && this.teamBeInvite.isShow) {
            this.teamBeInvite.removeBeInviteItem(entityId);
        }
        if (isAgree) {
            ProxyManager.team.agreeTeam(entityId, certId, type);
        }
        else {
            ProxyManager.team.rejectTeam(entityId, certId, type);
        }
        CacheManager.team.hasNewInvite = false;
        CacheManager.team.hasNewApply = false;
        EventManager.dispatch(LocalEventEnum.TeamTipsIconUpdate);
    }

    /**
     * 请求附近玩家列表
     */
    private onGetNearbyPlayers(): void {
        ProxyManager.team.getNearbyPlayer();
    }

    /**
     * 邀请玩家入队
     */
    private onInvitePlayerEnterTeam(entityId: any): void {
        // if (this.teamInvite && this.teamInvite.isShow) {
            // this.teamInvite.removeInviteItem(entityId);
        // }
        if (!CacheManager.team.hasTeam) {
            // Tip.showTip("暂无队伍");
            this.invitePlayer = entityId;
            this.onCreateTeamHandler(null);
            return;
        }
        let _teamInfo: any = CacheManager.team.teamInfo;
        if (_teamInfo.playerCount_BY == _teamInfo.maxPlayer_BY) {
            Tip.showTip("队伍已满员");
            return;
        }
        ProxyManager.team.inviteTeam(entityId);
    }

    private onChatUpdate() {
        if (this.isShow) {
            this.teamWindow.updateChanelList();
        }
    }

    private onSetChatPanel(visible: boolean): void {
        if (this.isShow) {
            this.teamWindow.updateChanelList();
        }
    }

    /*protected onModuleCloseHandler(moduleId: any, data?: any): void {
        // if (this.moduleId == moduleId && !CacheManager.team.hasTeam) {
        //     this.hide(data);
        // }
    }*/
}