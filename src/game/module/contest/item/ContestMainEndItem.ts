class ContestMainEndItem extends ListRenderer {
    private c1: fairygui.Controller;//012代表没结果，1胜，2胜
    private nameTxt: fairygui.GTextField;
    private rankTxt: fairygui.GTextField;
    private vipTxt: fairygui.GTextField;
    private scoreTxt: fairygui.GTextField;
    private secsTxt: fairygui.GTextField;
    private c2: fairygui.Controller;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.c2 = this.getController('c2');
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.getChild("name_block").addClickListener(this.onClickNameBlock, this);
        this.rankTxt = this.getChild("txt_rank").asTextField;
        this.vipTxt = this.getChild('txt_vip').asTextField;
        this.scoreTxt = this.getChild("txt_score").asTextField;
        this.secsTxt = this.getChild("txt_honor").asTextField;
    }

    public setData(data: simple.ISContestPlayerValue, index: number): void {
        this._data = data;
        this.c1.selectedIndex = index > 3 ? 3 : index;
        this.rankTxt.text = index + 1 + "";
        this.vipTxt.text = data.player.vipLevel_I > 0 ? `V` : "";//${data.player.vipLevel_I}
        this.nameTxt.text = ChatUtils.getPlayerName(data.player);
        if (data.value_I < 8) {
            this.scoreTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG58, data.value_I + 1);
            this.secsTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG59, data.valueEx_I);
            this.c2.selectedIndex = 0;
        }
        else {
            this.scoreTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG58, data.value_I);
            this.secsTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG60, data.valueEx_I);
            this.c2.selectedIndex = 1;
        }
    }

    private onClickNameBlock() {
        EventManager.dispatch(LocalEventEnum.CommonViewPlayerMenu,{toEntityId:this._data.player.entityId,from:ECopyType.ECopyContest}, true);
    }
}