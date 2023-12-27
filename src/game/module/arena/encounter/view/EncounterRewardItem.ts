class EncounterRewardItem extends ListRenderer {
    private rankTxt: fairygui.GTextField;
    private itemList: List;
    private c1: fairygui.Controller;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);

        this.rankTxt = this.getChild("rankTxt").asTextField;
        this.c1 = this.getController("c1");
        this.itemList = new List(this.getChild("list_item").asList);
    }

    public setData(data: any, index:number): void {
        this._data = data;
        this.c1.selectedIndex = index % 2 ? 1 : 0;
        if (data.rankStart != data.rankEnd)
            this.rankTxt.text = App.StringUtils.substitude(LangArena.LANG29, data.rankStart, data.rankEnd);
        else
            this.rankTxt.text = App.StringUtils.substitude(LangArena.LANG21, data.rankStart);
        let list:ItemData[] = RewardUtil.getStandeRewards(data.rewards);
        let serOpenDay:number = CacheManager.serverTime.serverOpenDay;
        let serOpenRewardJs:any = data.rewardJs ? JSON.parse(data.rewardJs) : [];
        let serOpenRewardList:ItemData[];
        for (let jso of serOpenRewardJs) {
            if (serOpenDay >= jso.stDay && serOpenDay <= jso.enDay) {
                serOpenRewardList = RewardUtil.getStandeRewards(jso.reward);
                break;
            }
        }
        if (serOpenRewardList) list = list.concat(serOpenRewardList);
        this.itemList.data = list;
    }
}