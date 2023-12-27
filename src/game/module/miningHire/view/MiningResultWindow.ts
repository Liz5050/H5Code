class MiningResultWindow extends BaseWindow {
    private manItem: MiningManItem;
    private getBtn: fairygui.GButton;
    private getDoubleBtn: fairygui.GButton;
    private itemsTxt: fairygui.GRichTextField;
    private lostsTxt: fairygui.GRichTextField;
    private goldTxt: fairygui.GTextField;
    private robbedList: List;
    private c1: fairygui.Controller;
    private doubleCost: number;

    public constructor() {
        super(PackNameEnum.MiningHire, "MiningResultWindow", null, LayerManager.UI_Main);
        this.isPopup = false;
    }

    public initOptUI(): void {
        this.c1 = this.getController('c1');
        this.manItem = this.getGObject("comp_man") as MiningManItem;
        this.getBtn = this.getGObject("btn_get").asButton;
        this.getBtn.addClickListener(this.onClickGet, this);
        this.getDoubleBtn = this.getGObject("btn_get_double").asButton;
        this.getDoubleBtn.addClickListener(this.onClickGetDouble, this);
        this.itemsTxt = this.getGObject("txt_items").asRichTextField;
        this.lostsTxt = this.getGObject("txt_losts").asRichTextField;
        this.goldTxt = this.getGObject("txt_gold").asTextField;
        this.robbedList = new List(this.getGObject("list_robbed").asList);
    }

    public updateAll(data: any = null): void {
        let myMiningInfo:any = CacheManager.mining.myMiningInfo;
        if (myMiningInfo) {
            let minerId:number = myMiningInfo.minerId_I;
            let minerData:any = ConfigManager.mining.getMinerData(minerId);
            Log.trace(Log.ENCOUNTER, "挖矿结果：", minerId, minerData);
            this.doubleCost = minerData.doubleCost;
            this.goldTxt.text = minerData.doubleCost+'';
            this.manItem.update(minerId, true);
            let minerRewardList:ItemData[] = ConfigManager.mining.getMinerReward(minerId, CacheManager.serverTime.serverOpenDay);
            let minerSpecialRewardList:ItemData[] = ConfigManager.mining.getMinerSpecialReward(minerId, CacheManager.serverTime.serverOpenDay);
            let rewardStr:string = "";
            let rewardLossStr:string = "";
            for (let itemdata of minerRewardList) {
                rewardStr += itemdata.getName(true) + 'x' + itemdata.getItemAmount() + '\n';
                let isSpecial:boolean;
                if (myMiningInfo.robbedTimes_I>0) {
                    if (minerSpecialRewardList && minerSpecialRewardList.length) {
                        for (let sdata of minerSpecialRewardList) {
                            if (sdata.getCode() == itemdata.getCode()) {
                                isSpecial = true;
                                break;
                            }
                        }
                    }
                    if (isSpecial) continue;
                    rewardLossStr += '-' + itemdata.getItemAmount()/10 * myMiningInfo.robbedTimes_I + '\n';
                }
            }
            this.itemsTxt.text = rewardStr;
            this.lostsTxt.text = rewardLossStr;
            //掠夺记录后面加
            let robbedList:any[] = myMiningInfo.robbedInfo && myMiningInfo.robbedInfo.data;
            if (robbedList) {
                let robbedStrList:string[] = [];
                for (let robbedOne of robbedList) {
                    robbedStrList.push(MiningCache.makeRecord2(robbedOne, myMiningInfo));
                }
                this.robbedList.data = robbedStrList;
            }
            this.c1.selectedIndex = !robbedList || robbedList.length == 0  ? 1 : 0;//myMiningInfo.robbedTimes_I > 0 ? 0 : 1;
        }
    }

    private onClickGet() {
        EventManager.dispatch(LocalEventEnum.ReqGetMiningReward, 0);
    }

    private onClickGetDouble() {
        if (MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold, this.doubleCost))
            EventManager.dispatch(LocalEventEnum.ReqGetMiningReward, 1);
    }
}