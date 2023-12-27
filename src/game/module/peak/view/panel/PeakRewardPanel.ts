class PeakRewardPanel extends BaseTabView {
    private rewardList: List;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        this.rewardList = new List(this.getGObject("list_item").asList);
    }

    public updateAll(data?: any): void {
        if (!this.rewardList.data) {
            let localRewards:any[] = ConfigManager.peak.getRankRewards(false);
            localRewards.unshift({isLocal:true});

            let crossRewards:any[] = ConfigManager.peak.getRankRewards(true);
            crossRewards.unshift({isLocal:false});
            this.rewardList.setVirtual(localRewards.concat(crossRewards));
        }
    }
}