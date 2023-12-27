class SkillDescItem extends ListRenderer {
    private skill_title : fairygui.GRichTextField;
    private skill_desc : fairygui.GRichTextField;
    
    private strs: Array<string> = ["蓝色","紫色","橙色","红色"];

    public constructor() {
		super();
	}

    protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
        this.skill_title = this.getChild("skill_title").asRichTextField;
        this.skill_desc = this.getChild("skill_desc").asRichTextField;
        
	}

	public setData(data: any) {
        this.skill_desc.text = data.cfg.skillDescription;
        if(data.isActive) {
            this.skill_title.text = "<font color="+ Color.Color_1 + ">【"+data.cfg.skillName + data.cfg.skillLevel + "重】</font> <font size=22>(已生效)</font>";
            this.skill_title.color = Color.ItemColor[data.cfg.skillLevel+1];
        }
        else {
            var str = "收集一套" + this.strs[data.cfg.skillLevel - 1] +"心法书激活("+ data.levelnum +"/5)";
            this.skill_title.color = Color.ItemColor[data.cfg.skillLevel+1];
            this.skill_title.text = "【"+data.cfg.skillName + data.cfg.skillLevel + "重】 <font size=22 color="+Color.Color_9 + ">" + str +"</font>";
        }
	}
}