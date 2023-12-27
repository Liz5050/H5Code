class ChangeCareerSkillItem extends fairygui.GComponent
{
    private txt1: fairygui.GTextField;
    private txt2: fairygui.GTextField;
    private iconLoader: GLoader;
    private viewCtl: fairygui.Controller;
    public constructor()
    {
        super();
    }

    protected constructFromXML(xml:any):void
    {
        super.constructFromXML(xml);
        this.viewCtl = this.getController("c1");
        this.iconLoader = this.getChild("loader") as GLoader;
        this.txt1 = this.getChild("txt_name1").asTextField;
        this.txt2 = this.getChild("txt_name2").asTextField;
    }

    public update(skillCfgs:Array<string>):void
    {
        let _thisObj:ChangeCareerSkillItem = this;
        _thisObj.iconLoader.load(URLManager.getIconUrl(skillCfgs[0], URLManager.SKIL_ICON));
        let viewIdx:number = 0;
        let name2:string = skillCfgs[2];
        if (name2 != "") {
            _thisObj.txt2.text = name2;
            viewIdx++;
        }
        let name1:string = skillCfgs[1];
        if (name1 != "") {
            _thisObj.txt1.text = name1;
            viewIdx++;
        }
        this.viewCtl.selectedIndex = viewIdx;
    }
}