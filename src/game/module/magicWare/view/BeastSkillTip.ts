/**
 * 神兽技能Tips
 * @author zxd
 * @time 2018-11-29 20:18:54
 */
class BeastSkillTip extends BaseWindow {
    private skill_icon : BeastSkillItem;
    private desc_txt : fairygui.GRichTextField;
    private name_txt : fairygui.GRichTextField;
    private state_txt : fairygui.GTextField;

    public constructor() {
		super(PackNameEnum.BeastBattle,"BeastSkillTip");
	}

    public initOptUI():void{
        this.skill_icon = <BeastSkillItem>this.getGObject("skill_all");
        this.desc_txt = this.getGObject("txt_desc").asRichTextField;
        this.name_txt = this.getGObject("txt_name").asRichTextField;
        this.state_txt = this.getGObject("txt_state").asTextField;
    }

    public updateAll(data?:any):void{

        var cfg = ConfigManager.skill.getSkill(data);
        if(cfg) {
            this.desc_txt.text = HtmlUtil.br(cfg.skillDescription);
            this.name_txt.text = cfg.skillName;
            var state = ConfigManager.state.getByPk(cfg.additionState);
            if(state) {
                if(state.type == EStateType.EStateOneBeastAttribute) {
                    this.state_txt.text = LangBeast.LANG1;
                }
                if(state.type == EStateType.EStateAllBeastAttribute) {
                    this.state_txt.text = LangBeast.LANG2;
                }
                this.skill_icon.setData(data);
            }
            
        }
    }


}