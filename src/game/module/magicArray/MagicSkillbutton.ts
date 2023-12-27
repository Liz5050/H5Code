class LawSkillData {
    public roleindex : number;
    public skillid : number;
    public isTanlent : boolean;
    public shape : boolean;
    public change : boolean;
}

class MagicSkillbutton extends ListRenderer {


    private loader_icon : GLoader
    private skillid : number;
    private isTanlent : boolean;
    private skilldata : any;
    private c1 : fairygui.Controller;

    public constructor() {
		super();

	}

    public constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.loader_icon = this.getChild("loader_icon") as GLoader;
        this.addClickListener(this.click, this);
        this.c1 = this.getController("c1");
    }

    public setData(skillData:any):void{
        this.skilldata = skillData;
        this.skillid = skillData.skillId;
        this.isTanlent = skillData.isTalent;
        if(!this.skilldata.change) {
            var cfg = ConfigManager.skill.getSkill(skillData.skillId);
            if(cfg) {
                this.loader_icon.load(URLManager.getIconUrl(cfg.skillIcon,"skill"));
            }
            if(CacheManager.magicArray.isOpenSkill(skillData.skillId, skillData.roleIndex)) {
                this.c1.selectedIndex = 1;
                this.loader_icon.grayed = false;
            }
            else{
                this.c1.selectedIndex = 0;
                this.loader_icon.grayed = true;
            }
        }
        else {
            var cfg = ConfigManager.skill.getSkill(skillData.skillId);
            if(cfg) {
                this.loader_icon.load(URLManager.getIconUrl(cfg.skillIcon,"skill"));
            }
            if(this.skilldata.isOpen) {
                this.c1.selectedIndex = 1;
                this.loader_icon.grayed = false;
            }
            else{
                this.c1.selectedIndex = 0;
                this.loader_icon.grayed = true;
            }
        }
    }

    private click(): void{
        if(!this.isTanlent) {
		        EventManager.dispatch(UIEventEnum.ShapeSkillTipViewOpen, this.skilldata);
        }
        else {
            if(this.skilldata.change) {
                EventManager.dispatch(UIEventEnum.ShapeSkillTipViewOpen, this.skilldata);
            }
            else{
                EventManager.dispatch(UIEventEnum.ShapeSkillTipViewOpen, this.skilldata);
            }
        }
	}

    

}