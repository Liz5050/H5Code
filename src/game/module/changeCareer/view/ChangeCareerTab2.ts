class ChangeCareerTab2 extends BaseTabPanel
{
    private titleTxt: fairygui.GRichTextField;
    private skill1: ChangeCareerSkillItem;
    private skill2: ChangeCareerSkillItem;
    private upgradeTxt: fairygui.GRichTextField;
    private skill3: ChangeCareerSkillItem;
    private skill4: ChangeCareerSkillItem;
    public initOptUI(): void
    {
        this.titleTxt = this.getGObject("txt_skill").asRichTextField;
        this.skill1 = this.getGObject("skill1") as ChangeCareerSkillItem;
        this.skill2 = this.getGObject("skill2") as ChangeCareerSkillItem;
        this.skill3 = this.getGObject("skill3") as ChangeCareerSkillItem;
        this.skill4 = this.getGObject("skill4") as ChangeCareerSkillItem;
        this.upgradeTxt = this.getGObject("txt_information").asRichTextField;
    }

    public updateAll(data?:any):void
    {
        let stateData:ChangeCareerStateData = data as ChangeCareerStateData;
        this.titleTxt.text = stateData.title;
        this.skill1.update(stateData.skills[0]);
        this.skill2.update(stateData.skills[1]);
        this.skill3.update(stateData.skills[2]);
        this.skill4.update(stateData.skills[3]);
        this.upgradeTxt.text = stateData.upgradeDesc;
    }

    protected onTabChanged(e: any): void {
    }
}