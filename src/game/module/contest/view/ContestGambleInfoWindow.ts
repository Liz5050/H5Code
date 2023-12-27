class ContestGambleInfoWindow extends BaseWindow {
    private rankList: List;

    public constructor() {
        super(PackNameEnum.Contest, "ContestGambleInfoWindow");
    }

    public initOptUI(): void {
        this.rankList = new List(this.getGObject("list_rank").asList);
    }

    public updateAll(data:simple.SContestBetInfo): void {
        if (data) {
            this.rankList.setVirtual(data.betRecords.data);
        } else {
            EventManager.dispatch(LocalEventEnum.ContestReqBetInfo);
        }
    }

}