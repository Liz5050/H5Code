class PeakRankItem extends ListRenderer {
    private c1: fairygui.Controller;//0其他排名123冠亚季
    private rankTxt: fairygui.GTextField;
    private nameTxt: fairygui.GTextField;
    private scoreTxt: fairygui.GTextField;
    private likeBtn: fairygui.GButton;
    private c2: fairygui.Controller;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.c2 = this.getController('c2');
        this.rankTxt = this.getChild("txt_rank").asTextField;
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.scoreTxt = this.getChild("txt_score").asTextField;
        this.likeBtn = this.getChild("btn_like").asButton;
        this.likeBtn.addClickListener(this.onClickLike, this);
    }

    public setData(data: simple.ISMgPeakArenaPopularity, index: number): void {
        this._data = data;
        this.itemIndex = index;

        this.c1.selectedIndex = index<3 ? index +1 : 0;
        this.rankTxt.text = index + 1 + "";
        this.nameTxt.text = data.player.name_S;
        this.scoreTxt.text = data.popularity_I + "";

        this.updateLikeLeftCount();
    }

    private onClickLike() {
        EventManager.dispatch(LocalEventEnum.PeakLike, this._data.player.entityId);
    }

    public updateLikeLeftCount() {
        this.c2.selectedIndex = CacheManager.peak.leftLikeCount > 0 ? 1 : 0;
    }
}