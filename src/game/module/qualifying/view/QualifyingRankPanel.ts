class QualifyingRankPanel extends BaseTabView {
    private contain0: egret.DisplayObjectContainer;
    private contain1: egret.DisplayObjectContainer;
    private contain2: egret.DisplayObjectContainer;
    private rankList: List;
    private myRankTxt: fairygui.GRichTextField;
    private playerModel0: PlayerModel;
    private playerModel1: PlayerModel;
    private playerModel2: PlayerModel;
    private topPlayer: simple.ISQualifyingPlayer;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        this.contain0 = this.getGObject("contain_0").asCom.displayObject as egret.DisplayObjectContainer;
        this.contain1 = this.getGObject("contain_1").asCom.displayObject as egret.DisplayObjectContainer;
        this.contain2 = this.getGObject("contain_2").asCom.displayObject as egret.DisplayObjectContainer;
        this.playerModel0 = new PlayerModel();
        this.contain0.addChild(this.playerModel0);
        this.playerModel1 = new PlayerModel();
        this.contain1.addChild(this.playerModel1);
        this.playerModel2 = new PlayerModel();
        this.contain2.addChild(this.playerModel2);
        this.getChild("block_0").addClickListener(this.onClick, this);

        this.rankList = new List(this.getGObject("list_rank").asList);
        this.myRankTxt = this.getGObject('txt_my_rank').asRichTextField;
    }

    public updateAll(data?: any): void {
        EventManager.dispatch(LocalEventEnum.QualifyingReqRanks);
    }

    public updateRanks(rankInfo:simple.SQualifyingRanks):void {
        this.myRankTxt.text = HtmlUtil.colorSubstitude(LangQualifying.LANG2, rankInfo.myRank_I);

        let list:any[] = rankInfo.ranks.data;
        this.rankList.setVirtual(list);

        let top:simple.ISQualifyingPlayer = list[0];
        let weapons:any;
        let career:number;
        for (let i:number = 0;i < 3; i++) {
            weapons = top ? top.roleWeapons.value[i] : null;
            career = top ? top.roleWeapons.key_I[i] : 1;
            this["playerModel" + i].updatePlayerModelAll(weapons, career);
        }
        this.topPlayer = top;
    }

    public hide():void {
        super.hide();
    }

    private onClick() {
        if (this.topPlayer) EventManager.dispatch(LocalEventEnum.CommonViewPlayerMenu,{toEntityId:this.topPlayer.entityId,from:ECopyType.ECopyQualifying}, true);
    }
}