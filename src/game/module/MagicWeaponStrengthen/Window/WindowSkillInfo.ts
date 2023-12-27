/**
 * 法器升星技能一览界面
*/

class WindowSkillInfo extends BaseWindow {

    private skillList : List;
    private skillids : any[];

    public constructor() {
        super(PackNameEnum.MagicWeaponStrengthen , "WindowSkillInfo");
    }

    public initOptUI() : void {
        this.title = "能力一览";
        this.skillList = new List(this.getGObject("skillList").asList);
        this.skillids = [];
    }

    public updateAll() : void {
        this.skillids = ConfigManager.mgShapeOpen.getAllSkillByShape(EShape.EShapeSpirit);
        let skilldata : any[] = [-1];
        for(let i=0; i < this.skillids.length ; i ++) {
            skilldata.push(this.skillids[i]);
        }
        this.skillList.data = skilldata;
    }

    

    

}
