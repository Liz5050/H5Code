class ContestMainEndView extends fairygui.GComponent {
    private stageTxt: fairygui.GRichTextField;
    private rankTxt: fairygui.GRichTextField;
    private leftTxt: fairygui.GRichTextField;
    private rankList: List;
    private contain0: egret.DisplayObjectContainer;
    private contain1: egret.DisplayObjectContainer;
    private contain2: egret.DisplayObjectContainer;
    private playerModel0: PlayerModel;
    private playerModel1: PlayerModel;
    private playerModel2: PlayerModel;
    private playerValue0: any;
    private playerValue1: any;
    private playerValue2: any;
    private _data: any;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);

        this.stageTxt = this.getChild("txt_my_stage").asRichTextField;
        this.rankTxt = this.getChild("txt_my_rank").asRichTextField;
        this.leftTxt = this.getChild("txt_left").asRichTextField;
        this.rankList = new List(this.getChild("list_rank").asList);
        this.contain0 = this.getChild("contain_0").asCom.displayObject as egret.DisplayObjectContainer;
        this.contain1 = this.getChild("contain_1").asCom.displayObject as egret.DisplayObjectContainer;
        this.contain2 = this.getChild("contain_2").asCom.displayObject as egret.DisplayObjectContainer;
        this.getChild("block_0").addClickListener(this.onClick, this);
        this.getChild("block_1").addClickListener(this.onClick, this);
        this.getChild("block_2").addClickListener(this.onClick, this);
        this.playerModel0 = new PlayerModel();
        this.contain0.addChild(this.playerModel0);
        this.contain0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        this.playerModel1 = new PlayerModel();
        this.contain1.addChild(this.playerModel1);
        this.contain1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        this.playerModel2 = new PlayerModel();
        this.contain2.addChild(this.playerModel2);
        this.contain2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    }

    public update(data:any):void {
        this._data = data;
        let list:any[] = data.ranks ? data.ranks.data : [];
        let curRound:number = CacheManager.contest.stateInfo.round_I;
        this.stageTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG55, curRound);
        this.leftTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG57, data.leftPlayerCount_I);
        this.rankTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG56
            , data.signUp_B ? (data.rank_I > 0 ? data.rank_I : LangContest.LANG40) : LangContest.LANG39);
        this.rankList.data = list;

        let top3List:any[] = list.length > 0 ? list.slice(0,3) : [];
        let playerValue:simple.ISContestPlayerValue;
        let weapons:any;
        for (let i:number = 0;i < top3List.length; i++) {
            playerValue = top3List[i];
            this["playerValue" + i] = playerValue;
            weapons = playerValue.player.roleWeapons.value[0];
            if (weapons) this["playerModel" + i].updatePlayerModelAll(weapons, playerValue.player.career_I);
        }
    }

    private onClick(evt: egret.TouchEvent) {
        let player:any = this['playerValue' + evt.target.name.split('_')[1]];
        if (player) EventManager.dispatch(LocalEventEnum.CommonViewPlayerMenu,{toEntityId:player.player.entityId,from:ECopyType.ECopyContest}, true);
    }

    public hide():void {
        if (!this._data) return;
        for (let i:number = 0;i < 3; i++) {
            this["playerModel" + i].destroy();
        }
    }
}