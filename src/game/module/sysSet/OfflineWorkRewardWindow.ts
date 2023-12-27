class OfflineWorkRewardWindow extends BaseWindow
{
    private timeTxt: fairygui.GTextField;
    private moneyTxt1: fairygui.GRichTextField;
    private moneyTxt2: fairygui.GRichTextField;
    private expTxt1: fairygui.GRichTextField;
    private expTxt2: fairygui.GRichTextField;
    private equipTxt1: fairygui.GRichTextField;
    private equipTxt2: fairygui.GRichTextField;
    private stoneTxt1: fairygui.GRichTextField;
    private stoneTxt2: fairygui.GRichTextField;

    public constructor()
    {
        super(PackNameEnum.Setup, "WindowOfflineWorkReward",null,LayerManager.UI_Tips);
    }

    public initOptUI(): void
    {
        this.timeTxt = this.getGObject("txt_time").asTextField;
        this.moneyTxt1 = this.getGObject("txt_money1").asRichTextField;
        this.moneyTxt2 = this.getGObject("txt_money2").asRichTextField;
        this.expTxt1 = this.getGObject("txt_exp1").asRichTextField;
        this.expTxt2 = this.getGObject("txt_exp2").asRichTextField;
        this.equipTxt1 = this.getGObject("txt_equip1").asRichTextField;
        // this.equipTxt2 = this.getGObject("txt_equip2").asRichTextField;
        this.stoneTxt1 = this.getGObject("txt_stone1").asRichTextField;
        // this.stoneTxt2 = this.getGObject("txt_stone2").asRichTextField;

    }

    public updateAll(data: any = null): void {
        let showWorkTime:number = data.workTime < 60 ? 60 : data.workTime;
        this.timeTxt.text = App.StringUtils.substitude(LangSetting.LANG8, App.DateUtils.formatSeconds(showWorkTime, showWorkTime < 24 * 3600 ? DateUtils.FORMAT_SECONDS_2 : DateUtils.FORMAT_SECONDS_5));
        this.moneyTxt1.text = App.StringUtils.substitude(LangSetting.LANG10, LangSetting.LANG21, App.MathUtils.formatNum2(data.rewardCoin));
        this.moneyTxt2.text = App.StringUtils.substitude(LangSetting.LANG11, LangSetting.LANG21, App.MathUtils.formatNum2(data.extraCoin));
        this.expTxt1.text = App.StringUtils.substitude(LangSetting.LANG10, LangSetting.LANG22, App.MathUtils.formatNum2(data.rewardExp));
        this.expTxt2.text = App.StringUtils.substitude(LangSetting.LANG11, LangSetting.LANG22, App.MathUtils.formatNum2(data.extraExp));
        this.equipTxt1.text = App.StringUtils.substitude(LangSetting.LANG10, LangSetting.LANG23, data.rewardEquip);
        // this.equipTxt2.text = App.StringUtils.substitude(LangSetting.LANG11, LangSetting.LANG23, 0/*data.extraEquip*/);
        this.stoneTxt1.text = App.StringUtils.substitude(LangSetting.LANG10, LangSetting.LANG24, data.rewardProp);
        // this.stoneTxt2.text = App.StringUtils.substitude(LangSetting.LANG11, LangSetting.LANG24, 0/*data.extraEquip*/);
    }

    public onHide(data?: any): void {
        super.onHide(data);
        EventManager.dispatch(UIEventEnum.TempCardCheckWinClose);
    }
}