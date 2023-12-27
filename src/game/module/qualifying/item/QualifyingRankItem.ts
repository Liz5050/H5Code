class QualifyingRankItem extends ListRenderer {
    private nameTxt: fairygui.GTextField;
    private stageTxt: fairygui.GTextField;
    private scoreTxt: fairygui.GTextField;
    private serverTxt: fairygui.GTextField;
    private c1: fairygui.Controller;//0其他1第一名2...
    private rankTxt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.scoreTxt = this.getChild("txt_score").asTextField;
        this.stageTxt = this.getChild("txt_stage").asTextField;
        this.serverTxt = this.getChild("txt_server").asTextField;
        this.rankTxt = this.getChild("txt_rank").asTextField;
        this.addClickListener(this.onItemClick,this);
    }

    public setData(data: simple.ISQualifyingPlayer, index: number): void {
        this._data = data;
        this.itemIndex = index;

        this.c1.selectedIndex = index > 2 ? 0 : index + 1;
        this.nameTxt.text = data.name_S;
        this.scoreTxt.text = HtmlUtil.colorSubstitude(LangQualifying.LANG24, data.score_I);
        this.serverTxt.text = `S${data.entityId.typeEx_SH}`;
        this.rankTxt.text = index + 1 + '';
        this.stageTxt.text = QualifyingCache.getLevelStr(data.quaLevel_I);
    }

    private onItemClick() {
        EventManager.dispatch(LocalEventEnum.CommonViewPlayerMenu,{toEntityId:this._data.entityId,from:ECopyType.ECopyQualifying}, true);
    }
}