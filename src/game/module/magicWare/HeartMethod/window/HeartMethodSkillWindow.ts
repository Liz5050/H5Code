class skilldata {
    public cfg : any;
    public isActive :boolean;
    public levelnum : number;
}

class HeartMethodSkillWindow extends BaseWindow {

    private txt_name : fairygui.GTextField;
    private loader_skill : GLoader;
    private list_skill : List;
    private roleIndex : number;
    private selectIndex : number;

    private effectCfg : any;
    private suitCfg : any;
    private skillCfg : any;
    private isSkillOpen : boolean;
    private cuData:any;
    private isActive : boolean;
    private isMax : boolean;
    private txt_close : fairygui.GTextField;
    private c1 : fairygui.Controller;
    private close_loader : GLoader;


    public constructor() {
        super(PackNameEnum.MagicWare , "HeartMethodSkillWindow");
    }
    
    public initOptUI() : void {
        this.txt_name = this.getGObject("skill_Title").asTextField;
        this.loader_skill = <GLoader>this.getGObject("skill_loader");
        this.list_skill = new List(this.getGObject("skillList").asList);
        this.txt_close = this.getGObject("txt_closeTip").asTextField;
        this.c1 = this.getController("c1");
        this.close_loader = <GLoader>(this.getGObject("close"));
        this.close_loader.addClickListener(this.close,this);
        this.isActive = false;
    }

    public close() {
        this.hide();
    }

    public updateAll( data : any) {
        this.roleIndex = data.role;
        this.selectIndex = data.index;
        this.cuData = CacheManager.cultivate.getCultivateInfoByRoleAndType(this.roleIndex, ECultivateType.ECultivateTypeHeartMethod);
        this.GetSkillNow();
        this.loader_skill.load(URLManager.getModuleImgUrl((this.selectIndex + 1) + "b.jpg", PackNameEnum.MagicWare));
        this.updateSkillList();
    }

    public updateSkillList() {
        var datalist : Array<skilldata> = [];
        if(!this.isActive) {
            var data = new skilldata();
            data.cfg = this.skillCfg;
            data.isActive = false;
            data.levelnum = this.getNumEquipInLevel(2);
            datalist.push(data);
            this.list_skill.data = datalist;
            this.c1.selectedIndex = 0;
            return;
        }
        if(this.isMax) {
            var data = new skilldata();
            data.cfg = this.skillCfg;
            data.isActive = true;
            data.levelnum = this.getNumEquipInLevel(5);
            datalist.push(data);
            this.list_skill.data = datalist;
            this.c1.selectedIndex = 0;
            return;
        }
        var data = new skilldata();
        data.cfg = this.skillCfg;
        data.isActive = true;
        data.levelnum = 5;
        datalist.push(data);
        var data2 = new skilldata();
        data2.cfg = ConfigManager.skill.getSkill(this.skillCfg.skillId + 10);
        data2.isActive = false;
        data2.levelnum = this.getNumEquipInLevel(this.GetMethodSuitLevel() + 1);
        datalist.push(data2);
        this.list_skill.data = datalist;
        this.c1.selectedIndex = 1;
    }


    public GetSkillNow() {
        let level = this.GetMethodSuitLevel();
        this.isSkillOpen = level > 0;
        if(level == 0) {
            level = 2;
            this.isActive = false;
        }
        else {
            this.isActive = true;
        }
        this.isMax = (level == 5);

        this.suitCfg = ConfigManager.cultivateSuit.getCurSuitInfoByCurLevelHeart(ECultivateType.ECultivateTypeHeartMethod, this.selectIndex+1 , level-1);
        if(this.suitCfg) {
            let arr:string[] = CommonUtils.configStrToArr(this.suitCfg.effectStr,false);		
			arr = arr[0].split(",");		
            this.effectCfg = ConfigManager.cultivateEffect.getByPk(arr[0]+","+(level-1));
            if(this.effectCfg) {
                this.skillCfg = ConfigManager.skill.getSkill(this.effectCfg.addSkillId);
                if(this.skillCfg) {
                    this.txt_name.text = this.skillCfg.skillName;
                }
            }
        }
       
        
    }

	public GetMethodSuitLevel() : number {
        var level = 10;
        if(this.cuData) {
            for(let i = 1;i <= 5 ; i++) {
                let pos = i + 5 * this.selectIndex;
                let qd = new EquipData();
                let code = this.cuData.levelInfo[pos];
                if(!code|| code == null) {
                    return 0;
                }
                let itemCfg: any = ConfigManager.item.getByPk(code);
                if(level > itemCfg.color) {
                    level = itemCfg.color;
                }
            }
        }
        else {
            return 0;
        }
        return level;
    }

    public getNumEquipInLevel(level : number) {
        var num = 0;
        if(this.cuData) {
            for(let i = 1;i <= 5 ; i++) {
                let pos = i + 5 * this.selectIndex;
                let qd = new EquipData();
                let code = this.cuData.levelInfo[pos];
                if(!code|| code == null) {
                    continue;
                }
                let itemCfg: any = ConfigManager.item.getByPk(code);
                if(level <= itemCfg.color) {
                    num++;
                }
            }
        }
        return num;
    }
    

    
}