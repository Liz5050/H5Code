class ChangeCareerTab3 extends BaseTabPanel
{
    private titleTxt: fairygui.GRichTextField;
    private skill1: ChangeCareerSkillItem;
    private skill2: ChangeCareerSkillItem;
    private skill3: ChangeCareerSkillItem;
    private attrTxt1: fairygui.GRichTextField;
    private attrTxt2: fairygui.GRichTextField;
    private upgradeTxt: fairygui.GRichTextField;
    public initOptUI(): void
    {
        this.titleTxt = this.getGObject("txt_skill").asRichTextField;
        this.skill1 = this.getGObject("skill1") as ChangeCareerSkillItem;
        this.skill2 = this.getGObject("skill2") as ChangeCareerSkillItem;
        this.skill3 = this.getGObject("skill3") as ChangeCareerSkillItem;
        this.attrTxt1 = this.getGObject("txt_current").asRichTextField;
        this.attrTxt2 = this.getGObject("txt_next").asRichTextField;
        this.upgradeTxt = this.getGObject("txt_information").asRichTextField;
    }

    public updateAll(data?:any):void
    {
        let stateData:ChangeCareerStateData = data as ChangeCareerStateData;
        this.titleTxt.text = stateData.title;
        this.skill1.update(stateData.skills[0]);
        this.skill2.update(stateData.skills[1]);
        this.skill3.update(stateData.skills[2]);
        this.upgradeTxt.text = stateData.upgradeDesc;

        //attr
        let subState:number = CacheManager.role.getRoleSubState();
        let attrNames:Array<string> = stateData.attrNames;
        let attrs:Array<Array<string>> = stateData.attrs;
        let attrCur:Array<string> = attrs[subState - 1];
        let attrNext:Array<string> = attrs[subState] ? attrs[subState] : attrCur;
        this.attrTxt1.text="";
        for (let i = 0; i < attrNames.length; i++) {
            this.attrTxt1.text += attrNames[i] + "\t" + attrCur[i] + (i != attrNames.length - 1 ? HtmlUtil.brText : "");
        }
        this.attrTxt2.text="";
        for (let i = 0; i < attrNext.length; i++) {
            this.attrTxt2.text += attrNext[i] + (i != attrNext.length - 1 ? HtmlUtil.brText : "");
        }
    }

    protected onTabChanged(e: any): void {
    }
}