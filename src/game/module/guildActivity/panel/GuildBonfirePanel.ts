/**
 * 篝火
 */
class GuildBonfirePanel extends BaseTabView {
    private bgLoader: GLoader;
    private fireLoader: GLoader;
    private fireWoodTxt: fairygui.GTextField;
    private progressBar: fairygui.GProgressBar;
    private fireBtn: fairygui.GButton;
    private tipTxt1: fairygui.GRichTextField;
    private tipTxt2: fairygui.GRichTextField;

    private fireLevel: number = 0;
    private cfg: any;
    private itemNum: number;
    private perExp: number = 5;//每个柴火增加的经验
    private perContribution: number = 30;
    private tip1: string = "每捐献1个柴火增加<font color='#0df14b'>{0}</font>点篝火值以及<font color='#0df14b'>{1}</font>点仙盟贡献";
    private tip2: string = "再捐献总计<font color='#0df14b'>{0}</font>个柴火可增加<font color='#0df14b'>{1}</font>仙盟资金";
    private fireImgIndex: number = 1;
    private isInitConst: boolean;
    private isMaxLevel: boolean;

    public constructor() {
        super();
    }

    protected initOptUI(): void {
        this.bgLoader = this.getGObject("loader_bg") as GLoader;
        this.fireLoader = this.getGObject("loader_fire") as GLoader;
        this.fireWoodTxt = this.getGObject("txt_fireWood").asTextField;
        this.progressBar = this.getGObject("progressBar").asProgress;
        this.tipTxt1 = this.getGObject("txt_tip1").asRichTextField;
        this.tipTxt2 = this.getGObject("txt_tip2").asRichTextField;
        this.fireBtn = this.getGObject("btn_fire").asButton;
        this.fireBtn.addClickListener(this.clickFireBtn, this);

        this.bgLoader.load(URLManager.getModuleImgUrl("bonfire_bg.jpg", PackNameEnum.GuildActivity));
    }

    public updateAll(data: any = null): void {
        if (!this.isInitConst) {
            this.isInitConst = true;
            this.perExp = ConfigManager.const.getConstValue("DonateFirewoodExpReward");
            this.perContribution = ConfigManager.const.getConstValue("DonateFirewoodContributionReward");
        }
        this.fireLevel = CacheManager.guildActivity.fireLevel;
        this.isMaxLevel = ConfigManager.guildFire.isMaxLevel(this.fireLevel);
        this.cfg = ConfigManager.guildFire.getByPk(this.fireLevel);
        if (this.isMaxLevel) {
            this.progressBar.value = this.cfg.cost;
        } else {
            this.progressBar.value = CacheManager.guildActivity.fireExp;
        }
        this.progressBar.max = this.cfg.cost;

        let num: number = Math.ceil((this.cfg.cost - CacheManager.guildActivity.fireExp) / this.perExp);
        this.tipTxt1.text = App.StringUtils.substitude(this.tip1, this.perExp, this.perContribution);
        this.tipTxt2.text = this.isMaxLevel?"篝火已满级，继续捐献仍可获得仙盟贡献":App.StringUtils.substitude(this.tip2, num, this.cfg.guildMoneyReward);
        this.fireImgIndex = this.fireLevel;

        if(this.fireLevel < 1) {
            this.fireImgIndex = 1;
        } else if(this.fireLevel > 3) {
            this.fireImgIndex = 3;
        }
        this.fireLoader.load(URLManager.getModuleImgUrl(`img_fire_${this.fireImgIndex}.png`, PackNameEnum.GuildActivity));
        this.updateCurrent();
    }

    public updateCurrent(): void {
        this.itemNum = CacheManager.pack.propCache.getItemCountByFun(ItemsUtil.isGuildFireWood, ItemsUtil);
        this.fireWoodTxt.text = "x " + this.itemNum;
        this.fireWoodTxt.color = this.itemNum == 0 ? Color.Red2 : Color.Green2;
        CommonUtils.setBtnTips(this.fireBtn, CacheManager.guildActivity.isFireRedTip);
    }

    private clickFireBtn(): void {
        /*
        if (this.isMaxLevel) {
            Tip.showRollTip("今日篝火已满级，请明日再来");
            return;
        }
        */
        if (this.itemNum == 0) {
            Tip.showTip("道具不足");
            return;
        }
        let num: number = this.itemNum;
        if (this.itemNum > 100) {
            num = 100;
        }
        EventManager.dispatch(LocalEventEnum.GuildDonateFirewood, {"num": num});
    }
}