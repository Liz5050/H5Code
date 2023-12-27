class ContestQualificationEndItem extends ListRenderer {
    private c1: fairygui.Controller;//012代表没结果，1胜，2胜
    private nameTxt: fairygui.GTextField;
    private rankTxt: fairygui.GTextField;
    private vipTxt: fairygui.GTextField;
    private scoreTxt: fairygui.GTextField;
    private honorTxt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.getChild("name_block").addClickListener(this.onClickNameBlock, this);
        this.rankTxt = this.getChild("txt_rank").asTextField;
        this.vipTxt = this.getChild('txt_vip').asTextField;
        this.scoreTxt = this.getChild("txt_score").asTextField;
        this.honorTxt = this.getChild("txt_honor").asTextField;
    }

    public setData(data: simple.ISContestPlayerValue, index: number): void {
        this._data = data;
        this.c1.selectedIndex = index > 3 ? 3 : index;
        this.rankTxt.text = index + 1 + "";
        this.vipTxt.text = data.player.vipLevel_I > 0 ? `V` : ""; //${data.player.vipLevel_I}
        this.nameTxt.text = ChatUtils.getPlayerName(data.player);
        this.scoreTxt.text = data.value_I + "";
        this.honorTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG54, data.valueEx_I, data.valueEx2_I);
    }

    private onClickNameBlock() {
        EventManager.dispatch(LocalEventEnum.CommonViewPlayerMenu,{toEntityId:this._data.player.entityId,from:ECopyType.ECopyContest}, true);
    }
}