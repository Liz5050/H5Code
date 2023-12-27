/**
 * 五色技能Tips
 * @author zhh
 * @time 2018-10-16 20:18:54
 */
class ColorStoneSkillTips extends BaseWindow {
    private windowItemtip:fairygui.GImage;
    private line1:fairygui.GImage;
    private txtCond:fairygui.GTextField;
    private txtName:fairygui.GTextField;
    private txtDesc:fairygui.GRichTextField;

	public constructor() {
		super(PackNameEnum.MagicWare,"ColorStoneSkillTips");
	}
    
	public initOptUI():void{
        //---- script make start ----
        this.windowItemtip = this.getGObject("window_itemtip").asImage;
        this.line1 = this.getGObject("line1").asImage;
        this.txtCond = this.getGObject("txt_cond").asTextField;
        this.txtName = this.getGObject("txt_name").asTextField;
        this.txtDesc = this.getGObject("txt_desc").asRichTextField;
        //---- script make end ----

	}

	public updateAll(data?:any):void{
		//strengthExCfg
        let skillCfg:any = ConfigManager.skill.getSkill(data.openSkill);
        this.txtName.text = skillCfg.skillName;
        this.txtDesc.text = skillCfg.skillDescription;
        let star:number = data.star?data.star:0;
        this.txtCond.text = `${data.stage}阶${star}级解锁`;
                 

	}


}