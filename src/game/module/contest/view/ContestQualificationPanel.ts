class ContestQualificationPanel extends BaseTabView {
    private applyView: ContestApplyView;
    private rankBtn: fairygui.GButton;
    private top3List: List;
    private myWinCountTxt: fairygui.GRichTextField;
    private myLoseCountTxt: fairygui.GRichTextField;
    private myScoreTxt: fairygui.GRichTextField;
    private myRankTxt: fairygui.GRichTextField;
    private rankList: List;
    private nextCountTxt: fairygui.GRichTextField;
    private c1: fairygui.Controller;
    private curRound: number;
    private maxRound: number;
    private hasReqRoundInfo: boolean;
    private timeId:number = -1;
    private c2: fairygui.Controller;
    private endView: ContestQualificationEndView;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        this.c1 = this.getController('c1');
        this.c2 = this.getController('c2');
        this.applyView = this.getGObject('comp_apply') as ContestApplyView;
        this.endView = this.getGObject('comp_end') as ContestQualificationEndView;

        this.rankBtn = this.getGObject('btn_rank').asButton;
        this.rankBtn.addClickListener(this.onClickRank, this);
        this.top3List = new List(this.getGObject('list_score').asList);
        this.rankList = new List(this.getGObject('list_rank').asList);
        this.myWinCountTxt = this.getGObject('txt_win_count').asRichTextField;
        this.myLoseCountTxt = this.getGObject('txt_lose_count').asRichTextField;
        this.myScoreTxt = this.getGObject('txt_my_score').asRichTextField;
        this.myRankTxt = this.getGObject('txt_my_rank').asRichTextField;
        this.nextCountTxt = this.getGObject('txt_next_count').asRichTextField;
    }

    public updateAll(data?: any): void {
        EventManager.dispatch(LocalEventEnum.ContestReqQualificationInfo);
    }

    public updateInfo():boolean {
        let data:any = CacheManager.contest.qualificationInfo;
        let state:EContestState = CacheManager.contest.stateInfo.state_I;
        if (state == EContestState.EContestStateSignUp) {//报名
            this.c1.selectedIndex = 1;
            this.applyView.update(data);
            return true;
        } else if (state == EContestState.EContestStateQualification) {//赛况
            this.c1.selectedIndex = 2;

            this.myWinCountTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG1, data.winCount_I);
            this.myLoseCountTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG2, data.loseCount_I);
            this.myScoreTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG3, data.score_I);
            this.myRankTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG4, data.signUp_B ? data.rank_I : LangContest.LANG39);
            let top3DataList:any[] = [];
            if (data.ranks && data.ranks.data.length) {
                top3DataList = data.ranks.data.slice(0,3);
            }
            this.top3List.data = top3DataList;
            this.rankList.data = data.records ? data.records.data : [];
            this.c2.selectedIndex = this.rankList.data.length > 0 ? 1 : 0;

            this.updateRoundInfo();
            return false;
        } else {//结束页面
            this.c1.selectedIndex = 3;
            this.endView.update(data);
            return true;
        }
    }

    public updateRoundInfo():void {
        let roundInfo:any = CacheManager.contest.roundInfo;
        if (roundInfo) {
            let roundState:EContestState = roundInfo.state_I;
            this.curRound = roundInfo.round_I;
            this.maxRound = roundInfo.maxRound_I;
            this.countdownNextRound(0);
            if (roundState == EContestState.EContestStateQualification && roundInfo.round_I < roundInfo.maxRound_I) {
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
            this.nextCountTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG5, this.maxRound, this.curRound, leftTime);
            if (this.timeId == -1)
                this.timeId = egret.setInterval(this.countdownNextRound, this, 1000, nextRoundStartDt);
        } else {
            if ((CacheManager.contest.state == EContestState.EContestStateQualification && this.curRound >= this.maxRound)
                || CacheManager.contest.state >= EContestState.EContestStateContest)
                this.nextCountTxt.text = LangContest.LANG46;
            else
                this.nextCountTxt.text = "";
            if (this.timeId != -1) {
                egret.clearInterval(this.timeId);
                this.timeId = -1;
            }
        }
    }

    private onClickRank() {
        EventManager.dispatch(UIEventEnum.ContestWin, EContestWinType.ScoreRank);
    }

    public hide():void {
        super.hide();
        this.countdownNextRound(0);
        this.hasReqRoundInfo = false;
    }
}