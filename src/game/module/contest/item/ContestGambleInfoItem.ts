class ContestGambleInfoItem extends ListRenderer {
    private nameTxt: fairygui.GTextField;
    private stageTxt: fairygui.GTextField;
    private resultTxt: fairygui.GTextField;
    private rewardTxt: fairygui.GTextField;
    private c1: fairygui.Controller;//0守擂者失败1成功
    private c2: fairygui.Controller;//0等待结果1选中有奖励2选错

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);

        this.c1 = this.getController('c1');
        this.c2 = this.getController('c2');
        this.stageTxt = this.getChild("txt_stage").asTextField;
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.resultTxt = this.getChild("txt_result").asTextField;
        this.rewardTxt = this.getChild("txt_reward").asTextField;
    }

    public setData(data: simple.ISContestBetRecord, index: number): void {
        this.stageTxt.text = `1V${data.round_I+1}`;
        this.c1.selectedIndex = data.betWin_B ? 1 : 0;
        this.nameTxt.text = data.name_S;
        let betDate:any = ConfigManager.const.getByPk("ContestBetPercent");
        if (data.betNum_I * betDate.constValue/100 == data.result_I) {
            this.c2.selectedIndex = 1;
            this.rewardTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG22, data.result_I);
        } else if (data.betNum_I * betDate.constValueEx/100 == data.result_I) {
            this.c2.selectedIndex = 2;
            this.rewardTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG23, data.result_I);
        } else {
            this.c2.selectedIndex = 0;
        }

    }

}