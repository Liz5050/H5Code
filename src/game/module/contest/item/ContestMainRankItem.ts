class ContestMainRankItem extends ListRenderer {
    private c1: fairygui.Controller;//012代表没结果，1胜，2胜
    private nameTxt: fairygui.GTextField;
    private gambleBtn: fairygui.GButton;
    private opponentBtn: fairygui.GButton;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.getChild("name_block").addClickListener(this.onClickNameBlock, this);
        this.gambleBtn = this.getChild("btn_gamble").asButton;
        this.gambleBtn.addClickListener(this.onClickGamble, this);
        this.opponentBtn = this.getChild("btn_opponent").asButton;
        this.opponentBtn.addClickListener(this.onClickOpponent, this);
    }

    public setData(data: simple.ISContestPair, index: number): void {
        this._data = data;
        this.nameTxt.text = ChatUtils.getPlayerName(data.player1);
        this.c1.selectedIndex = data.win_I;
        this.updateGambleBtn();
    }

    private onClickGamble() {
        EventManager.dispatch(UIEventEnum.ContestWin, EContestWinType.Gamble, this._data);
    }

    private onClickOpponent() {
        EventManager.dispatch(UIEventEnum.ContestWin, EContestWinType.Challengers, this._data.players2.data);
    }

    public updateGambleBtn() {//-1-可下注 0-没结果 1-player1赢 2-players2赢
        let canGamble:boolean;
        if (this._data.win_I == -1) {
            let pairRound:number = CacheManager.contest.pairInfo ? CacheManager.contest.pairInfo.round_I:0;
            canGamble = CacheManager.contest.canGamble(pairRound, this._data.player1.name_S);
        } else {
            canGamble = false;
        }
        App.DisplayUtils.grayButton(this.gambleBtn, !canGamble, !canGamble);
    }

    private onClickNameBlock() {
        EventManager.dispatch(LocalEventEnum.CommonViewPlayerMenu,{toEntityId:this._data.player1.entityId,from:ECopyType.ECopyContest}, true);
    }
}