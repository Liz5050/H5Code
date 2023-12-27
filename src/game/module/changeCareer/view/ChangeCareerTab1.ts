class ChangeCareerTab1 extends BaseTabPanel
{
    private titleTxt: fairygui.GRichTextField;
    private upgradeTxt: fairygui.GRichTextField;
    private skill1: ChangeCareerSkillItem;
    private skill2: ChangeCareerSkillItem;

    public initOptUI(): void
    {
        this.titleTxt = this.getGObject("txt_skill").asRichTextField;
        this.skill1 = this.getGObject("skill1") as ChangeCareerSkillItem;
        this.skill2 = this.getGObject("skill2") as ChangeCareerSkillItem;
        this.upgradeTxt = this.getGObject("txt_information").asRichTextField;
    }

    public updateAll(data?:any):void
    {
        let stateData:ChangeCareerStateData = data as ChangeCareerStateData;
        this.titleTxt.text = stateData.title;
        this.skill1.update(stateData.skills[0]);
        this.skill2.update(stateData.skills[1]);
        this.upgradeTxt.text = stateData.upgradeDesc;
    }

    /**
     * 覆盖，不作处理，由module直接调参数过来updateAll
     * @param e
     */
    protected onTabChanged(e: any): void {
    }
}