class MiningRobWindow extends BaseWindow {
    private itemList: List;
    private ownerTxt: fairygui.GRichTextField;
    private fightTxt: fairygui.GRichTextField;
    private guildTxt: fairygui.GRichTextField;
    private leftTxt: fairygui.GRichTextField;
    private robBtn: fairygui.GButton;
    private miningInfo: any;

    public constructor() {
        super(PackNameEnum.MiningHire, "MiningRobWindow");
    }

    public initOptUI(): void {
        this.itemList = new List(this.getGObject("list_item").asList);
        this.ownerTxt = this.getGObject("txt_owner").asRichTextField;
        this.fightTxt = this.getGObject("txt_fight").asRichTextField;
        this.guildTxt = this.getGObject("txt_guild").asRichTextField;
        this.leftTxt = this.getGObject("txt_left").asRichTextField;
        this.robBtn = this.getGObject("btn_rob").asButton;
        this.robBtn.addClickListener(this.onClickRob, this);
    }

    public updateAll(data: any = null): void {
        this.miningInfo = CacheManager.mining.getMiningInfo(data as number);
        if (this.miningInfo) {
            let rewardList:ItemData[] = ConfigManager.mining.getMinerReward(this.miningInfo.minerId_I, CacheManager.serverTime.serverOpenDay, true);
            for (let item of rewardList) {
                item.itemAmount = item.getItemAmount() / 10;
            }
            this.itemList.data = rewardList;

            this.ownerTxt.text = App.StringUtils.substitude(LangMining.LANG43, this.miningInfo.player.name_S);
            this.fightTxt.text = App.StringUtils.substitude(LangMining.LANG44, this.miningInfo.player.warfare_L64);
            this.guildTxt.text = App.StringUtils.substitude(LangMining.LANG45, this.miningInfo.player.guildName_S || LangMining.LANG47);

            let myMiningInfo:any = CacheManager.mining.myMiningInfo;
            let stCfg:any = ConfigManager.mining.getMiningStaticData();
            let leftRobCount:number = stCfg.robTimes - myMiningInfo.robTimes_I;
            let robCountStr:string = (leftRobCount>0?leftRobCount:0) + '/' + stCfg.robTimes;
            if (leftRobCount<=0) robCountStr = HtmlUtil.html(robCountStr, Color.Red);
            this.leftTxt.text = App.StringUtils.substitude(LangMining.LANG46, robCountStr);

            let minerData:any = ConfigManager.mining.getMinerData(this.miningInfo.minerId_I);
            this.txtTitle.text = minerData.name + LangMining.LANG49;
            this.txtTitle.color = Color.toNum(Color.getRumor((2 + this.miningInfo.minerId_I) + ""));//stCfg.robbedTimes单日最多被掠夺次数+缺本次被掠夺次数判断
        }
    }

    private onClickRob() {
        if (this.miningInfo) {
            EventManager.dispatch(LocalEventEnum.ReqEnterMiningChallengeCopy, CopyEnum.CopyMiningChallenge, this.miningInfo.player.entityId, 0);
            this.hide();
        }
    }
}