/** 
 * 技能信息Item
 * 
*/

class SkillInfoItem extends ListRenderer {

    private txtName: fairygui.GRichTextField;
    private loaderIcon : GLoader;


    public constructor() {
        super();
    }

    protected constructFromXML(xml:any): void{
        super.constructFromXML(xml);
        this.txtName = this.getChild("txt_desc").asRichTextField;
        this.loaderIcon = <GLoader>this.getChild("icon_loader");

    }

    public setData(oridata:any) : void {
        let skillid = oridata;
        if(skillid > 0) {
            let data = ConfigManager.skill.getSkill(skillid);
            let desc : string;
            desc = "<font size = 22 color = \"#c8b185\">" + data.skillDescription + "</font>" ;
            let levellimit : string = "";
            let levelneed : number = ConfigManager.mgShapeOpen.getOpenLevel(EShape.EShapeSpirit , data.skillId);
            if(levelneed > CacheManager.magicWeaponStrengthen.shapeInfo.level_I) {
                let cfg = ConfigManager.mgShape.getByShapeAndLevel(EShape.EShapeSpirit ,levelneed);
                if(cfg) {
                    levellimit = " <font color = \""  + Color.RedCommon + "\">(" + cfg.stage + "阶开启)</font>" ;
                }
            }
            this.txtName.text = data.skillName + levellimit + "\n" + desc;
            this.loaderIcon.load(URLManager.getIconUrl(data.skillIcon , URLManager.SKIL_ICON));
            this.loaderIcon.setScale(1.12,1.1);
        }
        else{
            let desc : string;
            desc = "<font size = 22 color = \"#c8b185\">激活后，法宝将会跟随角色出战，直到战至最后一个角色。</font>" ;
            let levellimit : string = "";
            if(5 > CacheManager.magicWeaponStrengthen.cfg.stage) {
                levellimit = " <font color = \""  + Color.RedCommon + "\">(" + "5阶开启)</font>" ;
            }
            this.txtName.text = "法宝外显" + levellimit + "\n" + desc;
            this.loaderIcon.load(URLManager.getIconUrl(130001 , URLManager.SKIL_ICON));
            this.loaderIcon.setScale(1.12,1.1);
        }
    }
}