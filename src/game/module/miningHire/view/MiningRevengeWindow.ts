class MiningRevengeWindow extends BaseWindow {
    private headImg: GLoader;
    private nameTxt: fairygui.GRichTextField;
    private fightTxt: fairygui.GRichTextField;
    private timeTxt: fairygui.GRichTextField;
    private itemList: List;
    private revBtn: fairygui.GButton;
    private _data: any;

    public constructor() {
        super(PackNameEnum.MiningHire, "MiningRevengeWindow");
    }

    public initOptUI(): void {
        this.headImg = this.getGObject("icon_head") as GLoader;
        this.nameTxt = this.getGObject("txt_name").asRichTextField;
        this.fightTxt = this.getGObject("txt_fight").asRichTextField;
        this.timeTxt = this.getGObject("txt_time").asRichTextField;
        this.revBtn = this.getGObject("btn_revenge").asButton;
        this.revBtn.addClickListener(this.onClickRevenge, this);
        this.itemList = new List(this.getGObject("list_item").asList);
    }

    /**
     *
     * @param data:SPlayerMiningRecord
     */
    public updateAll(data: any = null): void {
        this._data = data;
        this.headImg.load(URLManager.getPlayerHead(data.player.career_SH));
        this.nameTxt.text = App.StringUtils.substitude(LangMining.LANG41, data.player.name_S);
        this.fightTxt.text = App.StringUtils.substitude(LangMining.LANG42, data.player.warfare_L64);
        this.timeTxt.text = App.StringUtils.substitude(LangMining.LANG58, App.DateUtils.formatDate(data.operDt_DT, DateUtils.FORMAT_Y_M_D_HH_MM_SS));
        let rewardList:ItemData[] = ConfigManager.mining.getMinerReward(data.operMiner_I, CacheManager.serverTime.serverOpenDay, true);
        for (let item of rewardList) {
            item.itemAmount = item.getItemAmount() / 10;
        }
        this.itemList.data = rewardList;
    }

    private onClickRevenge() {
        EventManager.dispatch(LocalEventEnum.ReqEnterMiningChallengeCopy, CopyEnum.CopyMiningChallenge, this._data.player.entityId, this._data.recordId_L64);
        this.hide();
    }
}