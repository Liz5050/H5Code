class QualifyingMainPanel extends BaseTabView {
    private c1: fairygui.Controller;
    private compC1: fairygui.Controller;
    private compC2: fairygui.Controller;
    private leftTimeTxt: fairygui.GTextField;
    private countsTxt: fairygui.GRichTextField;
    private itemList: List;
    private mulBtn: fairygui.GButton;
    private singleMatchBtn: fairygui.GButton;
    private previewBtn: fairygui.GButton;
    private playerModel0: QualifyingTeamModelItem;
    private playerModel1: QualifyingTeamModelItem;
    private playerModel2: QualifyingTeamModelItem;
    private cancelMatchBtn: fairygui.GButton;
    private logo:QualifyingLogo;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        this.c1 = this.getController('c1');
        let btnComp = this.getGObject('comp_btn').asCom;
        this.compC1 = btnComp.getController('c1');
        this.compC2 = btnComp.getController('c2');

        this.leftTimeTxt = this.getGObject('txt_lefttime').asTextField;
        this.countsTxt = this.getGObject('txt_counts').asRichTextField;
        this.itemList = new List(this.getGObject('list_item').asList);
        this.mulBtn = btnComp.getChild('btn_mul').asButton;
        this.mulBtn.addClickListener(this.onClick, this);
        this.singleMatchBtn = btnComp.getChild('btn_single_match').asButton;
        this.singleMatchBtn.addClickListener(this.onClick, this);
        this.previewBtn = this.getGObject('btn_preview').asButton;
        this.previewBtn.addClickListener(this.onClick, this);
        this.cancelMatchBtn = btnComp.getChild('btn_cancel_match').asButton;
        this.cancelMatchBtn.addClickListener(this.onClick, this);
        this.logo = this.getGObject('g_logo') as QualifyingLogo;

        //组队
        this.playerModel0 = this.getGObject('team_0') as QualifyingTeamModelItem;
        this.playerModel1 = this.getGObject('team_1') as QualifyingTeamModelItem;
        this.playerModel2 = this.getGObject('team_2') as QualifyingTeamModelItem;
    }

    public updateAll(data?: any): void {
        EventManager.dispatch(LocalEventEnum.QualifyingReqInfo);
    }

    public updateInfo(data:simple.SQualifyingInfo):void {
        this.logo.update(data);
        this.leftTimeTxt.text = data.leftTimes_I + "";
        this.countsTxt.text = HtmlUtil.colorSubstitude(LangQualifying.LANG1, data.totalCount_I > 0 ? (data.winCount_I / data.totalCount_I * 100).toFixed(2).replace('.00','') : 0, data.winCount_I, data.totalCount_I - data.winCount_I - data.loseCount_I, data.loseCount_I);

        let nextLevelData:any = ConfigManager.qualifying.getLevelData(data.level_I+1);
        if (nextLevelData) {
            this.itemList.data = RewardUtil.getStandeRewards(nextLevelData.levelUpRewards);
        }
        this.updateTeam(CacheManager.team2.teamInfo);
    }

    public updateTeam(teamInfo:any):void {
        if (teamInfo != null && CacheManager.team2.isQualifyingTeam) {
            if (teamInfo.qualifyingMatching_B) {
                this.c1.selectedIndex = 2;
                this.compC1.selectedIndex = 2;
            } else {
                this.c1.selectedIndex = 1;
                this.compC1.selectedIndex = 1;
            }
            this.compC2.selectedIndex = teamInfo && EntityUtil.isMainPlayer(teamInfo.captainId) ? 1 : 0;
            this.updateTeamMems(teamInfo.players.data);
        } else {
            this.c1.selectedIndex = 0;
            this.compC1.selectedIndex = 0;
            this.compC2.selectedIndex = 1;
        }
    }

    private updateTeamMems(mems:simple.SPublicTinyPlayer[]):void {
        //先清空
        for (let i:number = 0;i < 3; i++) {
            this['playerModel' + (i)].updateAll(null, i);
        }

        let me:simple.SPublicTinyPlayer;
        let left:simple.SPublicTinyPlayer[] = [];
        for (let p of mems) {
            if (EntityUtil.isMainPlayer(p.entityId)) {
                me = p;
            } else {
                left.push(p);
            }
        }
        this.playerModel0.updateAll(me, 0);
        for (let i:number = 0;i < left.length; i++) {
            this['playerModel' + (i+1)].updateAll(left[i], i+1);
        }
    }

    private onClick(e:egret.TouchEvent):void{
        let btn: any = e.target;
        switch (btn) {
            case this.mulBtn:
                if (this.c1.selectedIndex == 0) {//多人组队
                    if (CacheManager.qualifying.canJoin(true))
                        this.createTeam();
                } else if (this.c1.selectedIndex == 1) {//取消组队
                    EventManager.dispatch(LocalEventEnum.ExitTeamCross);
                }
                break;
            case this.singleMatchBtn:
                if (this.c1.selectedIndex == 0) {//单人匹配
                    if (CacheManager.qualifying.canJoin(true)) {
                        CacheManager.qualifying.isSingleMatch = true;
                        this.createTeam();
                    }
                } else if (this.c1.selectedIndex == 1) {//开始匹配
                    EventManager.dispatch(LocalEventEnum.QualifyingReqMatch);
                }
                break;
            case this.previewBtn:
                EventManager.dispatch(UIEventEnum.QualifyingWin, EQualifyingWinType.Reward);
                break;
            case this.cancelMatchBtn:
                EventManager.dispatch(LocalEventEnum.QualifyingReqCancelMatch);
                break;
        }
    }

    public hide():void {
        super.hide();
    }

    private createTeam() {
        if (CacheManager.team2.checkHasOtherCrossTeam(CopyEnum.CopyQualifying, ()=>{
            if (this.parent) EventManager.dispatch(LocalEventEnum.CreateTeamCross, CopyEnum.CopyQualifying);
        }, this)) return;
        if (this.parent) EventManager.dispatch(LocalEventEnum.CreateTeamCross, CopyEnum.CopyQualifying);
    }
}