class ToolTipChangeProp extends ToolTipBase {
    private bgLoader: GLoader;
    private nameBgLoader: GLoader;
    private nameTxt: fairygui.GTextField;
    private activeDescTxt: fairygui.GRichTextField;
    private fightPanel: FightPanel;
    private talentIconLoader: GLoader;
    private talentDescTxt: fairygui.GRichTextField;
    private skillList: List;
    private roadBtn: fairygui.GButton;
    private controller: fairygui.Controller;


    private modelContainer: fairygui.GComponent;
    private modelBody: egret.DisplayObjectContainer;
    private model: ModelShow;

    private itemData: ItemData;
    private type: number;

    public constructor() {
        super(PackNameEnum.Common, "ToolTipChangeProp");
        this.isAnimateShow = false;
    }

    public initUI(): void {
        super.initUI();
        this.bgLoader = this.getGObject("loader_bg") as GLoader;
        this.nameBgLoader = this.getGObject("loader_nameBg") as GLoader;
        this.nameTxt = this.getGObject("txt_name").asTextField;
        this.activeDescTxt = this.getGObject("txt_activeDesc").asRichTextField;
        this.fightPanel = <FightPanel>this.getGObject("panel_fight");
        this.talentIconLoader = this.getChild("loader_talentIcon") as GLoader;
        this.talentDescTxt = this.getGObject("txt_talentDesc").asRichTextField;
        this.skillList = new List(this.getGObject("list_skill").asList);
        this.roadBtn = this.getGObject("btn_road").asButton;
        this.controller = this.getController("c1");
        this.modelContainer = this.getGObject("model_container").asCom;
        this.model = new ModelShow(EShape.ECustomPlayer);
        this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");
        this.modelBody.addChild(this.model);
        this.modelBody.x = 80;
        this.modelBody.y = 100;
        this.modelBody.scaleX = 0.9;
        this.modelBody.scaleY = 0.9;
        (this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody);

        this.roadBtn.addClickListener(this.onClickBtn, this);

        this.bgLoader.load(URLManager.getModuleImgUrl("bg/equip_tips.png", PackNameEnum.Common));
        this.nameBgLoader.load(URLManager.getModuleImgUrl("bg/name_bg.png", PackNameEnum.Common));

    }

    public setToolTipData(toolTipData: ToolTipData) {
        super.setToolTipData(toolTipData);
        this.itemData = toolTipData.data;
        let shape: number = this.itemData.getShape();
        
        let change: number = this.itemData.getEffect();
        let changeCfg: any = this.getChangeCfg(shape, change);
        this.nameTxt.text = this.itemData.getName();

        this.model.setShowType(shape);
        this.model.setData(changeCfg.modelId);
        this.updateModelPos(shape);
        this.activeDescTxt.text = `激活或提升${GameDef.EShapeName[shape]}幻形: <font color = ${Color.Color_4}>${changeCfg.name}</font>`;

        let talentSkillIndex: number = this.getTSkillIndex(shape, change);
        let talentSkillId: number = ConfigManager.mgShapeChangeSkillUpgrade.getSkillId(talentSkillIndex, 1);
        let talentSkillCfg: any = ConfigManager.skill.getByPk(talentSkillId);
        this.talentIconLoader.load(URLManager.getIconUrl(talentSkillCfg.skillIcon, URLManager.SKIL_ICON));
        this.talentDescTxt.text = HtmlUtil.br(talentSkillCfg.skillDescription);

        let skillDict: any = this.getSkillDict(shape, change);
        let skillData: Array<any> = [];
        for (let key in skillDict) {
            skillData.push({ "skillId": Number(key), "openLevelStr": this.getOpenLevelStr(shape, change, skillDict[key]) });
        }
        this.skillList.data = skillData;

        let fight: number = 0;
        let attrDict: any = WeaponUtil.getAttrDict(changeCfg.attrList);
        fight += WeaponUtil.getCombat(attrDict);
        fight += WeaponUtil.getCombatBySkillId(talentSkillId);
        if(shape == EShape.EShapePet || shape == EShape.EShapeSpirit){
            fight *= CacheManager.role.roles.length;
        }
        // if(shape != EShape.EShapeLaw && shape != EShape.EShapeBattle && shape != EShape.EShapeSwordPool &&  shape != EShape.EShapeWing){
        //     fight *= CacheManager.role.roles.length;
        // }

        this.fightPanel.updateValue(fight);

        let data: Array<any> = ConfigManager.propGet.getDataById(this.itemData.getCode());
        if (data.length > 0) {
            this.type = data[0].type;
            this.roadBtn.text = data[0].name;
            this.controller.selectedIndex = 1;
        } else {
            this.controller.selectedIndex = 0;
        }
    }

    private updateModelPos(shape: EShape): void{
         switch (shape) {
            // case EShape.EShapePet:
            //     this.modelBody.x = 80;
            //     this.modelBody.y = 100;
            //     break;
            case EShape.EShapeLaw:
                this.model.y = 120;
                break;
            case EShape.EShapeBattle:
                this.model.y = 130;
                break;
            // case EShape.EShapeMount:
            //     this.model.y = 150;
            //     break;
            default :
                // this.modelBody.x = 80;
                this.modelBody.y = 100;
                break;
        }
    }

    private getChangeCfg(shape: EShape, change: number): any {
        if(shape == EShape.EShapeSpirit){
            return ConfigManager.mgShapeChange.getByShapeChangeAndLevel(shape, change, 0);
        }else{
            return ConfigManager.mgShapeChangeEx.getByShapeChangeAndLevel(shape, change, 0);
        }
    }

    private getTSkillIndex(shape: EShape, change: number): number {
        if(shape == EShape.EShapeSpirit){
            return ConfigManager.mgShapeChange.getChangeTalentSkill(shape, change);
        }else{
            return ConfigManager.mgShapeChangeEx.getChangeTalentSkill(shape, change);
        }
    }

    private getSkillDict(shape: EShape, change: number): number {
        if(shape == EShape.EShapeSpirit){
            return ConfigManager.mgShapeChange.getChangeSkillDict(shape, change);
        }else{
            return ConfigManager.mgShapeChangeEx.getChangeSkillDict(shape, change);
        }
    }

    private getOpenLevelStr(shape: EShape, change: number, level: number): string {
        if(shape == EShape.EShapeSpirit){
            return ConfigManager.mgShapeChange.getStageStar(shape, change, level);
        }else{
            return ConfigManager.mgShapeChangeEx.getStageStar(shape, change, level);
        }
    }

    private onClickBtn(e: egret.TouchEvent): void {
        switch (e.target) {
            case this.roadBtn:
                EventManager.dispatch(LocalEventEnum.PropGetGotoLink, { type: this.type });
                this.hide();
                break;
        }
    }

    public get height(): number {
        if (this.controller.selectedIndex == 0) {
            return 1000;
        } else {
            return 1120;
        }

    }
}