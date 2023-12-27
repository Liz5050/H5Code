class CrossBossRewardPanel extends BaseWindow {
    private itemList: List;
    private bossCode: number;

    public constructor() {
        super(PackNameEnum.CrossBoss, "CrossBossRewardPanel", null, LayerManager.UI_Main);
        this.isPopup = false;
        this.isShowCloseObj = true;
    }

    public initOptUI(): void {
        this.itemList = new List(this.getGObject("list_item").asList);
    }

    public updateAll(data: any = null): void {
        this.bossCode = <number>data;
        let gameBossInf:any = ConfigManager.mgGameBoss.getByPk(this.bossCode);
        let rewards:ItemData[] = RewardUtil.getRewards(gameBossInf.showReward);
        let listData:any[] = [];
        for (let data of rewards) {
            listData.push({itemData:data, none:1});
        }
        this.itemList.data = listData;
    }

}