class ContestChallengersWindow extends BaseWindow {
    private rankList: List;

    public constructor() {
        super(PackNameEnum.Contest, "ContestChallengersWindow");
    }

    public initOptUI(): void {
        this.rankList = new List(this.getGObject("list_rank").asList);
    }

    public updateAll(data:simple.ISContestPlayer[]): void {
        this.rankList.data = data;
    }

}