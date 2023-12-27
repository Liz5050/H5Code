class PeakRewardItem extends ListRenderer {
    private titleCtl: fairygui.Controller;
    private typeCtl: fairygui.Controller;
    private rankCtl: fairygui.Controller;
    private rewardList: List;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.typeCtl = this.getController('c1');
        this.titleCtl = this.getController('c2');
        this.rankCtl = this.getController('c3');
        this.rewardList = new List(this.getChild("list_item").asList);
    }

    public setData(data: any, index: number): void {
        this._data = data;
        this.itemIndex = index;

        if (data.rewards) {
            this.height = 130;
            this.typeCtl.selectedIndex = 1;

            let rankIdx:number = 0;
            switch (data.maxRank) {
                case 1:rankIdx = 0;break;
                case 2:rankIdx = 1;break;
                case 4:rankIdx = 2;break;
                case 8:rankIdx = 3;break;
                case 16:rankIdx = 4;break;
                case 32:rankIdx = 5;break;
                case 64:rankIdx = 6;break;
                default:rankIdx = 7;break;
            }
            this.rankCtl.selectedIndex = rankIdx;
            this.rewardList.data = RewardUtil.getStandeRewards(data.rewards);
        } else {
            this.height = 52;
            this.typeCtl.selectedIndex = 0;
            this.titleCtl.selectedIndex = data.isLocal ? 0 : 1;
        }
    }

}