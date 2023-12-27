class MiningRecordWindow extends BaseWindow {
    private itemList: List;

    public constructor() {
        super(PackNameEnum.MiningHire, "MiningRecordWindow");
    }

    public initOptUI(): void {
        this.itemList = new List(this.getGObject("list_item").asList);
    }

    public updateAll(data: any = null): void {
        CacheManager.mining.isRobbedRedTips = false;
        let recordList:any[] = CacheManager.mining.getMiningRecordList();
        if (recordList) {
            this.itemList.data = recordList;
        }
    }

}