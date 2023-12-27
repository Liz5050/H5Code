class QualifyingStageItem extends ListRenderer {
    private c1: fairygui.Controller;//0显示排名1显示段位
    private itemList: List;
    private stageTxt: fairygui.GTextField;
    private rankTxt: fairygui.GTextField;
    private c2: fairygui.Controller;
    private c3: fairygui.Controller;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.c2 = this.getController('c2');
        this.c3 = this.getController('c3');
        this.itemList = new List(this.getChild("list_item").asList);

        this.stageTxt = this.getChild("txt_stage").asTextField;
        this.rankTxt = this.getChild("txt_rank").asTextField;
    }

    public setData(data: any, index: number): void {
        this._data = data;
        this.itemIndex = index;
        let logoIndex:number = 0;
        if (data.minRank > 0 && data.maxRank > 0) {
            this.c1.selectedIndex = 0;
            this.rankTxt.text = data.minRank != data.maxRank ? `d${data.minRank}-${data.maxRank}` : `d${data.minRank}m`;
            this.itemList.data = RewardUtil.getStandeRewards(data.reward);
            this.c2.selectedIndex = data.minRank > 20 ? 1 : 0;
            if (data.minRank == 1) {
                logoIndex = 0;
            } else if (data.minRank == 2) {
                logoIndex = 1;
            } else {
                logoIndex = 2;
            }
        } else {
            this.c1.selectedIndex = 1;
            this.stageTxt.text = QualifyingCache.getLevelCode(data.level);
            this.itemList.data = RewardUtil.getStandeRewards(data.sessionRewards);
            logoIndex = 4 + QualifyingCache.getLevelBig(data.level);
        }
        this.c3.selectedIndex = logoIndex;
    }

}