class ContestMainPanel extends BaseTabView {
    private ruleTxt: fairygui.GRichTextField;
    private rankBtn: fairygui.GButton;
    private top3List: List;
    private myRankTxt: fairygui.GRichTextField;
    private rankList: List;
    private nextCountTxt: fairygui.GRichTextField;
    private leftPlayersTxt: fairygui.GRichTextField;
    private curStageTxt: fairygui.GTextField;
    private gambleInfoBtn: fairygui.GButton;
    private c1: fairygui.Controller;
    private curRound: number;
    private maxRound: number;
    private hasReqRoundInfo: boolean;
    private mySerCb: fairygui.GButton;
    private timeId:number = -1;
    private hasReqPairInfo: boolean;
    private leftPlayersCount: number = 0;
    private countdownType: number;
    private c2: fairygui.Controller;
    private state: EContestState;
    private endView: ContestMainEndView;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        this.c1 = this.getController('c1');
        this.c2 = this.getController('c2');
        this.ruleTxt = this.getGObject('comp_rule').asCom.getChild("txt_desc").asRichTextField;
        this.ruleTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG15);
        this.endView = this.getGObject('comp_end') as ContestMainEndView;

        this.rankBtn = this.getGObject('btn_rank').asButton;
        this.rankBtn.addClickListener(this.onClickRank, this);
        this.gambleInfoBtn = this.getGObject('btn_gamble_info').asButton;
        this.gambleInfoBtn.addClickListener(this.onClickGambleInfo, this);
        this.mySerCb = this.getGObject('cb_my_ser').asButton;
        this.mySerCb.addClickListener(this.onClickMySer, this);
        this.top3List = new List(this.getGObject('list_score').asList);
        this.rankList = new List(this.getGObject('list_rank').asList);
        this.myRankTxt = this.getGObject('txt_my_rank').asRichTextField;
        this.leftPlayersTxt = this.getGObject('txt_left_players').asRichTextField;
        this.curStageTxt = this.getGObject('txt_cur_stage').asTextField;
        this.nextCountTxt = this.getGObject('txt_next_count').asRichTextField;
    }

    public updateAll(data?: any): void {
        EventManager.dispatch(LocalEventEnum.ContestReqContestInfo);
        EventManager.dispatch(LocalEventEnum.ContestReqBetInfo);
    }

    public updateInfo():boolean {
        let data:any = CacheManager.contest.contestInfo;
        this.state = CacheManager.contest.stateInfo.state_I;
        if (this.state == EContestState.EContestStateSignUp || this.state == EContestState.EContestStateQualification) {//报名
            this.c1.selectedIndex = 1;
            return true;
        } else if (this.state == EContestState.EContestStateContest) {//赛况
            this.c1.selectedIndex = 2;

            this.leftPlayersCount = data.leftPlayerCount_I;
            this.leftPlayersTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG12, data.leftPlayerCount_I);
            this.myRankTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG11
                , data.signUp_B
                    ? (data.rank_I > 0 ? data.rank_I : LangContest.LANG40) : LangContest.LANG39);
            let top3DataList:any[] = [];
            if (data.ranks && data.ranks.data.length) {
                top3DataList = data.ranks.data.slice(0,3);
            }
            this.top3List.data = top3DataList;

            this.updateRoundInfo();
            this.updatePairInfo();
            return false;
        } else {//结束
            this.c1.selectedIndex = 3;
            this.endView.update(data);
            return true;
        }
    }

    public updatePairInfo():void {
        let pairInfo:any = CacheManager.contest.pairInfo;
        if (pairInfo) {
            let filtered:any[] = this.filterSer(pairInfo.pairs.data);
            this.rankList.setVirtual(filtered);

            if (filtered.length > 0) this.c2.selectedIndex = 0;
            else if (this.state > EContestState.EContestStateContest) this.c2.selectedIndex = 2;
            else this.c2.selectedIndex = 1;
        } else if (CacheManager.contest.state == EContestState.EContestStateContest && !this.hasReqPairInfo) {
            this.hasReqPairInfo = true;
            EventManager.dispatch(LocalEventEnum.ContestReqPairInfo);
        }
    }

    private filterSer(list: simple.ISContestPair[]) :any[] {
        if (!this.mySerCb.selected) return list;
        let filtered:any[] = [];
        let mySerId:number = CacheManager.role.entityInfo.entityId.typeEx_SH;
        for (let info of list) {
            if (info.player1.entityId.typeEx_SH == mySerId) filtered.push(info);
        }
        return filtered;
    }

    public updateRoundInfo():void {
        let roundInfo:any = CacheManager.contest.roundInfo;
        if (roundInfo) {
            let roundState:EContestState = roundInfo.state_I;
            this.curRound = roundInfo.round_I;
            this.maxRound = roundInfo.maxRound_I;
            this.countdownType = roundInfo.endType_I;// 守擂赛 1-匹配 2-下注 3-本场结束
            this.curStageTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG18, this.curRound + 1);
            this.countdownNextRound(0);//先干掉倒计时
            if (roundState == EContestState.EContestStateContest && roundInfo.round_I <= roundInfo.maxRound_I) {
                this.countdownNextRound(roundInfo.endSec_I);
            } else {//干掉倒计时
            }
        } else if (!this.hasReqRoundInfo) {
            this.hasReqRoundInfo = true;
            EventManager.dispatch(LocalEventEnum.ContestReqRoundInfo);
        }
    }

    private countdownNextRound(nextRoundStartDt: number) {
        let leftTime:number = nextRoundStartDt - CacheManager.serverTime.getServerTime();
        if (leftTime >= 0) {
            let cdStr:string;
            if (this.countdownType == EContestCountdownType.EMatch) {
                cdStr = LangContest.LANG44;
            } else if (this.countdownType == EContestCountdownType.EGamble) {
                cdStr = LangContest.LANG45;
            } else {
                cdStr = LangContest.LANG13;
            }
            this.nextCountTxt.text = HtmlUtil.colorSubstitude(cdStr, leftTime);
            if (this.timeId == -1)
                this.timeId = egret.setInterval(this.countdownNextRound, this, 1000, nextRoundStartDt);
        } else {
            this.nextCountTxt.text = "";
            if (this.timeId != -1) {
                egret.clearInterval(this.timeId);
                this.timeId = -1;
            }
        }
    }

    public updateContestBetInfo():void {
        this.rankList.callItemsFunc("updateGambleBtn");
    }

    private onClickRank() {
        EventManager.dispatch(UIEventEnum.ContestWin, EContestWinType.MainRank, CacheManager.contest.contestInfo.ranks.data);
    }

    private onClickGambleInfo() {
        EventManager.dispatch(UIEventEnum.ContestWin, EContestWinType.GambleInfo);
    }

    private onClickMySer() {
        if (this.c1.selectedIndex != 2) return;
        this.updatePairInfo();
    }

    public hide():void {
        super.hide();
        this.countdownNextRound(0);
        this.hasReqRoundInfo = false;
        this.hasReqPairInfo = false;
        this.endView.hide();
    }

}