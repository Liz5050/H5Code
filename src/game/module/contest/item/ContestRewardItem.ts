class ContestRewardItem extends ListRenderer {
    private c1: fairygui.Controller;//012..代表1V8胜利，1V8失败，1V7失败....淘汰赛失败
    private itemList: List;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.itemList = new List(this.getChild("list_item").asList);
    }

    public setData(data: any, index: number): void {
        this._data = data;
        this.c1.selectedIndex = data.value || 0;
        this.itemList.data = RewardUtil.getStandeRewards(data.valueStr);
    }

}