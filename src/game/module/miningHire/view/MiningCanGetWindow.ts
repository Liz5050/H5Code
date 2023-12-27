class MiningCanGetWindow extends BaseWindow {

    private list_gift : List;
    private goto_btn : fairygui.GButton;

    public constructor() {
        super(PackNameEnum.MiningHire, "MiningCanGetWindow");
    }

    public initOptUI(): void {
        this.list_gift = new List(this.getGObject("list_gift").asList);
        this.goto_btn = this.getGObject("btn_get").asButton;
        this.goto_btn.addClickListener(this.gotoMining,this);
    }

    public updateAll(data: any = null): void {
        let myMiningInfo:any = CacheManager.mining.myMiningInfo;
        if(myMiningInfo) {
            if (myMiningInfo) {
                let minerId:number = myMiningInfo.minerId_I;
                let minerData:any = ConfigManager.mining.getMinerData(minerId);
                let minerRewardList:ItemData[] = ConfigManager.mining.getMinerReward(minerId, CacheManager.serverTime.serverOpenDay);
                this.list_gift.data =  minerRewardList;
            }
        }

    }

    public gotoMining() {
        EventManager.dispatch(LocalEventEnum.ReqEnterMiningCopy, CopyEnum.CopyMining, 0);
        this.hide();
    }

    public onHide(): void {
        super.onHide();
        CacheManager.mining.needGetReward = false;
    }

    

}