/**
 * 组队2模块
 * @author Chris
 */
class Team2Panel extends BaseTabView {
    public static curSelectCode:number;//当前选中的code
    private createBtn: fairygui.GButton;
    private fastJoinBtn: fairygui.GButton;
    private quitBtn: fairygui.GButton;
    private startBtn: fairygui.GButton;
    private earningsTxt: fairygui.GRichTextField;
    private autoFastJoinCb: fairygui.GButton;
    private btnLeft: fairygui.GButton;
    private btnRight: fairygui.GButton;
    private rewardList: List;
    private copyList: List;
    private teamList: List;
    private noTeamsTipTxt: fairygui.GTextField;
    private doubleTipTxt: fairygui.GTextField;
    private copyNameTxt: fairygui.GTextField;
    private autoStartCb: fairygui.GButton;
    private autoFullStartCb: fairygui.GButton;
    private c1: fairygui.Controller;//ETeam2State
    private lastCopyItem: Team2CopyItem;
    private teamInfo: any;
    private state:ETeam2State;

    private autoFastJoinCD:number;//自动加入cd
    private autoStartCD:number;//自动开启副本cd
    private autoFullStartCD:number;//满员自动开始副本cd
    private stepCount:number = 0;
    private isFullMem: boolean;
    private useSetAutoJoin : boolean ;
    private droplog : fairygui.GButton;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        this.c1 = this.getController('c1');
        //middle
        this.copyList = new List(this.getGObject("list_copy").asList);
        this.copyList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onCopyListSelect, this);
        this.copyList.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL, this.onCopyListScroll, this);

        this.rewardList = new List(this.getGObject("list_reward").asList);

        this.btnLeft = this.getGObject("btn_left").asButton;
        this.btnLeft.addClickListener(this.onClick, this);
        this.btnRight = this.getGObject("btn_right").asButton;
        this.btnRight.addClickListener(this.onClick, this);

        this.noTeamsTipTxt = this.getGObject("txt_no_teamlist_tip").asTextField;
        this.doubleTipTxt = this.getGObject("txt_double_tip").asTextField;
        this.copyNameTxt = this.getGObject("txt_copy_name").asTextField;

        //bottom
        this.createBtn = this.getGObject("btn_create").asButton;
        this.createBtn.addClickListener(this.onClick, this);
        this.fastJoinBtn = this.getGObject("btn_fastjoin").asButton;
        this.fastJoinBtn.addClickListener(this.onClick, this);
        this.quitBtn = this.getGObject("btn_quit").asButton;
        this.quitBtn.addClickListener(this.onClick, this);
        this.startBtn = this.getGObject("btn_start").asButton;
        this.startBtn.addClickListener(this.onClick, this);
        this.earningsTxt = this.getGObject("txt_earnings").asRichTextField;//LangTeam2.LANG1
        this.autoFastJoinCb = this.getGObject("cb_auto_fastjoin").asButton;//LangTeam2.LANG2
        this.autoFastJoinCb.addClickListener(this.onClick, this);
        this.autoStartCb = this.getGObject("cb_auto_start").asButton;//LangTeam2.LANG6
        this.autoStartCb.addClickListener(this.onClick, this);
        this.autoFullStartCb = this.getGObject("cb_auto_full_start").asButton;
        this.autoFullStartCb.addClickListener(this.onClick, this);

        this.autoFastJoinCb.visible = false;
        this.autoStartCb.visible = false;
        this.autoFullStartCb.visible = false;
        this.selectCb(this.autoFullStartCb, false);
        this.selectCb(this.autoStartCb, false);
        this.selectCb(this.autoFastJoinCb, false);

        this.teamList = new List(this.getGObject("list_team").asList);
        this.useSetAutoJoin = true;

        this.droplog = this.getGObject("droprecord").asButton;
        this.droplog.addClickListener(this.showDropList, this);
    }

    public addListenerOnShow(): void {
        CacheManager.sysSet.autoCopy = false;
        this.setState(ETeam2State.Team_NONE);
        App.TimerManager.doTimer(1000, 0, this.onCountdown, this);
    }

    private onCountdown():void {
        this.stepCount++;
        switch (this.state) {
            case ETeam2State.Team_NONE:
                if (this.stepCount % 2 == 0) {//2秒定时请求一次队伍列表
                    this.lastCopyItem && this.reqGetList(this.lastCopyItem.getData())
                }
                this.countdownCb(this.autoFastJoinCb);
                break;
            case ETeam2State.Team_Leader:
                this.countdownCb(this.autoStartCb);
                this.countdownCb(this.autoFullStartCb);
                break;
        }
    }

    public updateAll(data?: any): void {
        //更新跨服副本列表
        let copys:any[];
        if (!this.copyList.data) {
            copys = ConfigManager.copy.getCrossTeamCopyList();
            
            // this.copyList.data = copys;
            this.copyList.setVirtual(copys);
            //this.copyList.selectedIndex = CacheManager.copy.getTeamCopyToSelect();
            this.onCopyListScroll();
        } else {
            // this.copyList.data = this.copyList.data;
            this.copyList.list.refreshVirtualList();
        }
        //定位到一个可以挑战的副本
        let specifyCode:number = data && data.copyCode ? data.copyCode : 0;
        let defaultSelectIdx:number = CacheManager.copy.getTeamCopyToSelect(specifyCode);
        this.copyList.scrollToView(defaultSelectIdx, false);
        this.selectCopy(defaultSelectIdx);
        //更新自己队伍信息
        this.updateTeamInfo(true);
        this.updateEarnings();
        EventManager.dispatch(LocalEventEnum.TeamCrossOpen);
    }

    private updateEarnings():void {
        let copy:any = ConfigManager.copy.getByPk(CopyEnum.CopyCrossTeam);
        let pCopy:any = CacheManager.copy.getPlayerCopyInf(CopyEnum.CopyCrossTeam);
        let left:number = pCopy ? copy.numByDay - pCopy.todayEnterNum_I:copy.numByDay;
        let color:string = Color.Color_6; //'#09c735'
        if (left <= 0) {
            left = 0;
            color = Color.Color_4;
        }
        let numDayStr:string = App.StringUtils.substitude(LangTeam2.LANG1, left, copy.numByDay, color);
        let teamCopy:any = ConfigManager.team.getTeamInfo(CopyEnum.CopyCrossTeam);        
        color = Color.Color_6
        left = pCopy ?teamCopy.assistTimes - pCopy.assistCount_I:teamCopy.assistTimes;
        if (left <= 0) {
            left = 0;
            color = Color.Color_4;
        }
        this.earningsTxt.text = numDayStr + HtmlUtil.brText + App.StringUtils.substitude(LangTeam2.LANG27, left,teamCopy.assistTimes, color);
    }

    /**
     * optional SEntityId groupId = 1;
     * optional SEntityId captainId = 2;
     * optional string name_S = 3;
     * optional int32 copyCode_I = 4;
     * optional int32 maxPlayer_BY = 5;
     * optional SeqPublicTinyPlayer players = 6;
     * optional bool fighting_B = 7;
     */
    public updateTeamInfo(isOpen:boolean = false):void {
        this.teamInfo = CacheManager.team2.teamInfo;
        if (this.teamInfo) { //有自己的队伍
			if(CacheManager.team2.curTeamCopyCfg.copyType != ECopyType.ECopyCrossTeam) {
                //当前队伍信息不是跨服组队副本，先退出队伍
                // EventManager.dispatch(LocalEventEnum.ExitTeamCross);
                return;
			}

            let memList:any[] = this.teamInfo.players.data;

            this.isFullMem = memList.length >= this.teamInfo.maxPlayer_BY;
            this.selectCb(this.autoFullStartCb, this.autoFullStartCb.selected);
            if (CacheManager.team2.captainIsMe) {
                this.setState(ETeam2State.Team_Leader);
                if (isOpen) {
                    this.selectCb(this.autoStartCb, false);
                    this.selectCb(this.autoFullStartCb, false);
                }
                if(memList.length < 3) {
                    while(memList.length < 3) {
                        memList.push(undefined);
                    }
                }
            } else {
                this.setState(ETeam2State.Team_Member);
            }
            this.teamList.data = memList;
            this.noTeamsTipTxt.text = "";

            if (this.lastCopyItem && this.lastCopyItem.getData().code != this.teamInfo.copyCode_I) {//加入队伍时发现和自己当前选中不一致，再次选中
                let copys: any[] = this.copyList.data;
                for (let i = 0; i < copys.length; i++) {
                    if (copys[i].code == this.teamInfo.copyCode_I) {
                        this.selectCopy(i);//选中
                        this.updateCopyInfo(copys[i]);//更新内容
                        break;
                    }
                }
            }
        } else {

            this.setState(ETeam2State.Team_NONE);
            this.updateCopyInfo(this.lastCopyItem.getData());
            this.lastCopyItem && this.reqGetList(this.lastCopyItem.getData());
        }
    }

    public updateTeamList():void {
        if (this.state == ETeam2State.Team_NONE) {
            if (this.lastCopyItem && this.canCopy(this.lastCopyItem.getData())) {
                let list:any[] = CacheManager.team2.teamList;
                if (!list || list.length <= 0) {
                    this.teamList.data = [];
                    this.noTeamsTipTxt.text = LangTeam2.LANG3;
                    if(!this.autoFastJoinCb.selected&& this.useSetAutoJoin) {
                        this.selectCb(this.autoFastJoinCb, false);
                    }
                    if(!this.autoFastJoinCb.visible) {
                        this.autoFastJoinCb.visible = false;
                    }
                } else {
                    this.teamList.data = list;
                    this.noTeamsTipTxt.text = "";
                }

            } else if (this.lastCopyItem) {
                let data:any = this.lastCopyItem.getData();
                this.noTeamsTipTxt.text = App.StringUtils.substitude(LangTeam2.LANG13,
                    data.enterMinRoleState > 0 ? data.enterMinRoleState + LangTeam2.LANG8 : data.enterMinLevel + LangTeam2.LANG9);
                this.selectCb(this.autoFastJoinCb, false);
                if(this.autoFastJoinCb.visible) {
                    this.autoFastJoinCb.visible = false;
                }

                let list:any[] = CacheManager.team2.teamList;
                if (!list || list.length <= 0) {
                    this.teamList.data = [];
                    if(!this.autoFastJoinCb.selected&& this.useSetAutoJoin) {
                        this.selectCb(this.autoFastJoinCb, false);
                    }
                    if(!this.autoFastJoinCb.visible) {
                        this.autoFastJoinCb.visible = false;
                    }
                } else {
                    this.teamList.data = list;
                }
            }

        }
    }

    private canCopy(copy:any):boolean {
        let roleLevel:number = CacheManager.role.getRoleLevel();
        let roleState:number = CacheManager.role.getRoleState();
        if (copy.enterMinRoleState ) {
            if (copy.enterMinRoleState > roleState) 
                return false;
        } else if (copy.enterMinLevel > roleLevel) {
            return false;
        }
        if(this.CheckCopyHasS(copy.code)) {
            return true;
        }
        else {
            var next = ConfigManager.copy.getLastTeamCopy(copy.code);
            if(next&& next!=null) {
                if(!this.CheckCopyHasS(next.code)) {
                    return false;
                }
            }
        }
        return true;
    }

    private CheckCopyHasS(code : number) : boolean {
        let pCopy:any = CacheManager.copy.getPlayerCopyInf(CopyEnum.CopyCrossTeam);
        if (pCopy) {
            if (pCopy.starDict && pCopy.starDict.key_I) {
                let copyCode:number;
                for (let i = 0; i < pCopy.starDict.key_I.length; i++) {
                    copyCode = pCopy.starDict.key_I[i];
                    if (copyCode == code && pCopy.starDict.value_I[i] == 3) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private selectCb(cb:fairygui.GButton, isSelect:boolean):void {
        cb.selected = isSelect;

        let content:string = "";
        let cd:number;
        switch (cb) {
            case this.autoFastJoinCb:
                content = LangTeam2.LANG2;
                cd = this.autoFastJoinCD = ConfigManager.team.getFastJoinCountTime();
                break;
            case this.autoStartCb:
                content = LangTeam2.LANG6;
                let autoStartCD:number = CacheManager.team2.getEnterCopyAutoCount();
                if (autoStartCD < 0) autoStartCD = ConfigManager.team.getAutoStartCountTime();
                cd = this.autoStartCD = autoStartCD;
                break;
            case this.autoFullStartCb:
                content = cb.selected && this.isFullMem ? LangTeam2.LANG6 : LangTeam2.LANG10;
                let autoFullStartCD:number = CacheManager.team2.getEnterCopyAutoCount();
                if (autoFullStartCD < 0 || autoFullStartCD > ConfigManager.team.getFullStartCountTime()) autoFullStartCD = ConfigManager.team.getFullStartCountTime();
                cd = this.autoFullStartCD = autoFullStartCD;
                break;
        }
        if (cd) {
            cb.text = App.StringUtils.substitude(content, cd);
        }
    }

    private countdownCb(cb:fairygui.GButton):void {
        let content:string = "";
        let cd:number;
        switch (cb) {
            case this.autoFastJoinCb:
                if (this.autoFastJoinCb.selected && this.autoFastJoinCD) {
                    cd = --this.autoFastJoinCD;
                    content = LangTeam2.LANG2;
                    if (cd <= 0) {//倒计时结束
                        if (!PackUtil.checkOpenSmelt()) {
                            if (!CacheManager.copy.isInCopy) {//发送快速加入
                                this.lastCopyItem && EventManager.dispatch(LocalEventEnum.QuickJoinTeamCross, this.lastCopyItem.getData().code);
                            } else {
                                this.selectCb(this.autoFastJoinCb, false);
                            }
                        } else {
                            this.selectCb(this.autoFastJoinCb, false);
                        }
                    }
                }
                break;
            case this.autoStartCb:
                if (this.autoStartCb.selected && !(this.autoFullStartCb.selected && this.isFullMem) && this.autoStartCD) {
                    cd = --this.autoStartCD;
                    content = LangTeam2.LANG6;
                    if (cd <= 0) {//倒计时结束
                        EventManager.dispatch(LocalEventEnum.EnterCopyCross);
                    }
                }
                break;
            case this.autoFullStartCb:
                if (this.autoFullStartCb.selected && this.isFullMem && this.autoFullStartCD) {
                    cd = --this.autoFullStartCD;
                    content = LangTeam2.LANG6;
                    if (cd <= 0) {//倒计时结束
                        EventManager.dispatch(LocalEventEnum.EnterCopyCross);
                    }
                }
                break;
        }
        if (cd) {
            cb.text = App.StringUtils.substitude(content, cd);
        }
    }

    private getDefaultSelectCopy(specifyCode:number):number {
        let copys: any[] = this.copyList.data;
        let selectIdx:number = 0;
        if (copys && copys.length) {
            let copy:any;
            let roleLevel:number = CacheManager.role.getRoleLevel();
            let roleState:number = CacheManager.role.getRoleState();
            for (let i = 0; i < copys.length; i++) {
                copy = copys[i];
                if (specifyCode == copy.code) {
                    selectIdx = i;
                    break;
                } else if (copy.enterMinRoleState ) {
                    if (copy.enterMinRoleState <= roleState) selectIdx = i;
                } else if (copy.enterMinLevel <= roleLevel) {
                    selectIdx = i;
                }
            }
        }
        return selectIdx;
    }

    private onClick(e:egret.TouchEvent):void{
        let btn: any = e.target;
        switch (btn) {
            case this.createBtn:
                if (!PackUtil.checkOpenSmelt()) {
                    if (!CacheManager.copy.isInCopy) {//发送创建
                        if (this.lastCopyItem) {
                            let copyCode:number = this.lastCopyItem.getData().code;
                            if (CacheManager.team2.checkHasOtherCrossTeam(copyCode, ()=>{
                                EventManager.dispatch(LocalEventEnum.CreateTeamCross, copyCode);
                            })) return;
                            EventManager.dispatch(LocalEventEnum.CreateTeamCross, copyCode);
                        }
                    } else {
                        Tip.showTip(LangTeam2.LANG11);
                    }
                }
                break;
            case this.fastJoinBtn:
                if (!PackUtil.checkOpenSmelt()) {
                    if (!CacheManager.copy.isInCopy) {//发送快速加入
                        if (this.lastCopyItem) {
                            let copyCode:number = this.lastCopyItem.getData().code;
                            if (CacheManager.team2.checkHasOtherCrossTeam(copyCode, ()=>{
                                EventManager.dispatch(LocalEventEnum.QuickJoinTeamCross, copyCode);
                            })) return;
                            EventManager.dispatch(LocalEventEnum.QuickJoinTeamCross, copyCode);
                        }
                    } else {
                        Tip.showTip(LangTeam2.LANG11);
                    }
                }
                break;
            case this.quitBtn:
                EventManager.dispatch(LocalEventEnum.ExitTeamCross);
                break;
            case this.startBtn:
                EventManager.dispatch(LocalEventEnum.EnterCopyCross);
                break;
            case this.autoFastJoinCb:
                this.selectCb(this.autoFastJoinCb, this.autoFastJoinCb.selected);
                this.useSetAutoJoin = this.autoFastJoinCb.selected;
                break;
            case this.autoStartCb:
                this.selectCb(this.autoStartCb, this.autoStartCb.selected);
                break;
            case this.autoFullStartCb:
                this.selectCb(this.autoFullStartCb, this.autoFullStartCb.selected);
                break;
            case this.btnLeft:
                let idx:number = this.copyList.list.getFirstChildInView() - 3;
                idx < 0 ? idx = 0 : null;
                this.copyList.scrollToView(idx, true, true);
                break;
            case this.btnRight:
                idx = this.copyList.list.getFirstChildInView() + 3;
                idx > this.copyList.data.length-1 ? idx = this.copyList.data.length-1 : null;
                this.copyList.scrollToView(idx, true, true);
                break;
        }
    }

    public hide() {
        super.hide();
        CacheManager.sysSet.autoCopy = true;
        //关闭界面则退出队伍
        EventManager.dispatch(LocalEventEnum.TeamCrossHide, this.getAutoStartCount());
        App.TimerManager.remove(this.onCountdown, this);
        this.stepCount = 0;
        this.state = undefined;
        Team2Panel.curSelectCode = 0;
    }

    private getAutoStartCount():number {
        if (CacheManager.team2.hasTeam) {
            if (CacheManager.team2.captainIsMe) {
                if (this.autoStartCb.selected && !(this.autoFullStartCb.selected && this.isFullMem)) {//队长，有倒计时
                    return this.autoStartCD;
                } else if (this.autoFullStartCb.selected && this.isFullMem) {//队长，有倒计时
                    return this.autoFullStartCD;
                }
                return Team2Cache.COUNT_NO_CD;//队长，没勾选倒计时
            }
            return Team2Cache.COUNT_NO_LEADER;//队员
        }
        else if(CacheManager.team2.curInviteInfo) {
            return Team2Cache.COUNT_HAD_INVITE;//有好友邀请
        }
        return Team2Cache.COUNT_NO_TEAM;//没队
    }

    private onCopyListSelect(e:fairygui.ItemEvent):void {
        let item:Team2CopyItem = <Team2CopyItem>e.itemObject;
        if(this.canCopy(item.getData())) {
            this.selectCopy(item);
            CacheManager.team2.mySelectCopyCode = item.getData().code;
        }
        else{
            let roleLevel:number = CacheManager.role.getRoleLevel();
            let roleState:number = CacheManager.role.getRoleState();
            if (item.getData().enterMinRoleState ) {
                if (item.getData().enterMinRoleState > roleState) {
                    Tip.showLeftTip("<font color = "+Color.Color_4 +">转生不足</font>");
                    return;
                }
            }
            Tip.showLeftTip("<font color = "+Color.Color_4 +">前置副本没有通关</font>");
        }
    }

    private selectCopy(select: any) {
        let item:Team2CopyItem = typeof select != 'number' ? select : this.copyList.getVirtualChild(select) as Team2CopyItem;
        this.lastCopyItem && this.lastCopyItem.setSelect(false);
        this.lastCopyItem = item;
        Team2Panel.curSelectCode = item.getData().code;
        item.setSelect(true);
        this.copyList.list.refreshVirtualList();
        if (this.state == ETeam2State.Team_NONE) {
            let data:any = item.getData();
            this.updateCopyInfo(data);

            this.reqGetList(data);
            this.updateTeamList();
        }
    }

    private updateCopyInfo(data:any):void {
        this.copyNameTxt.text = data.name;
        let rewards:ItemData[] = RewardUtil.getStandeRewards(data.reward);
        this.rewardList.data = rewards;
        (this.rewardList.list.getChildAt(rewards.length - 1) as BaseItem).showCareerIco(4);
    }

    private reqGetList(copy:any): void {
        if (this.state == ETeam2State.Team_NONE && this.canCopy(copy)) {
            EventManager.dispatch(LocalEventEnum.GetTeamListCross, copy.code);
        }
    }

    private setState(state:ETeam2State):void {
        if (this.state != state) {
            this.state = state;
            this.c1.selectedIndex = state;

            switch (state) {
                case ETeam2State.Team_NONE:
                    this.selectCb(this.autoFastJoinCb, false);
                    break;
                case ETeam2State.Team_Member:
                    break;
                case ETeam2State.Team_Leader:
                    this.selectCb(this.autoStartCb, false);
                    this.selectCb(this.autoFullStartCb, false);
                    break;
            }
        }
    }

    private onCopyListScroll() {
        let percX:number = this.copyList.list.scrollPane.percX;

        if(percX == 0) {
            this.btnLeft.visible = false;
            this.btnRight.visible = true;
        }
        else if(percX == 1) {
            this.btnLeft.visible = true;
            this.btnRight.visible = false;
        }
        else {
            this.btnLeft.visible = true;
            this.btnRight.visible = true;
        }
    }

    private showDropList() {
        ControllerManager.team2.reqDropLog();
    }

}
