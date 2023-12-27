class PeakRankWindow extends BaseWindow {
    private rankList: List;

    public constructor() {
        super(PackNameEnum.Peak, "PeakRankWindow");
    }

    public initOptUI(): void {
        this.rankList = new List(this.getGObject("list_item").asList);
    }

    public updateAll(data?:any): void {
        if (!data) {
            EventManager.dispatch(LocalEventEnum.PeakGetPeakPopularityRank);
        } else {
            //更新人气排行
            this.rankList.data = data;
        }
    }

    public updateLikeLeftCount() {
        let item:PeakRankItem;
        let idx:number = 0;
        while (idx < this.rankList.list.numChildren) {
            item = this.rankList.list.getChildAt(idx) as PeakRankItem;
            item.updateLikeLeftCount();
            idx++;
        }
    }
}