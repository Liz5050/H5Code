class QualifyingStageRewardItem extends ListRenderer {
    private c1: fairygui.Controller;//0显示排名1显示段位
    private itemList: List;
    private stageTxt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.itemList = new List(this.getChild("list_item").asList);

        this.stageTxt = this.getChild("txt_stage").asTextField;
    }

    public setData(data: any, index: number): void {
        this._data = data;
        this.itemIndex = index;

        this.c1.selectedIndex = QualifyingCache.getLevelBig(data.level);
        this.stageTxt.text = QualifyingCache.getLevelCode(data.level);
        this.itemList.data = RewardUtil.getStandeRewards(data.levelUpRewards);
    }

}