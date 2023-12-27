/**
 * 时装类Tip
 */
class ToolTipFashion extends ToolTipBase {
    private bgLoader: GLoader;
    private nameBgLoader: GLoader;
    private name1Txt: fairygui.GTextField;
    private name2Txt: fairygui.GTextField;
    private fightPanel: FightPanel;
    private typeNameTxt: fairygui.GTextField;
    private useTxt: fairygui.GTextField;
    private attrTxt: fairygui.GTextField;
    private timeTxt: fairygui.GTextField;
    private activationBtn: fairygui.GButton;
    private imgBg: fairygui.GImage;

    private roadBtn: fairygui.GButton;
    private controller: fairygui.Controller;
    private type: number;

    private modelContainer: fairygui.GComponent;
    private modelBody: egret.DisplayObjectContainer;
    private model: ModelShow;

    private fashionData: any;
    private itemData: ItemData;

    public constructor() {
        super(PackNameEnum.Common, "ToolTipFashion");
        this.isAnimateShow = false;
    }

    public initUI(): void {
        super.initUI();
        this.bgLoader = this.getGObject("loader_bg") as GLoader;
        this.nameBgLoader = this.getGObject("loader_nameBg") as GLoader;
        this.name1Txt = this.getGObject("txt_name1").asTextField;
        this.name2Txt = this.getGObject("txt_name2").asTextField;
        this.fightPanel = <FightPanel>this.getGObject("panel_fight");
        this.typeNameTxt = this.getGObject("txt_typeName").asTextField;
        this.useTxt = this.getGObject("txt_use").asTextField;
        this.attrTxt = this.getGObject("txt_attr").asTextField;
        this.timeTxt = this.getGObject("txt_time").asTextField;
        this.activationBtn = this.getGObject("btn_activation").asButton;
        this.imgBg = this.getGObject("img_bg").asImage;

        this.roadBtn = this.getGObject("btn_road").asButton;
        this.controller = this.getController("c1");

        this.modelContainer = this.getGObject("model_container").asCom;
        this.model = new ModelShow(EShape.ECustomPlayer);
        this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");
        this.modelBody.addChild(this.model);
        this.modelBody.x = 258;
        this.modelBody.y = 230;
        this.modelBody.scaleX = 0.75;
        this.modelBody.scaleY = 0.75;
        (this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody);

        this.bgLoader.load(URLManager.getModuleImgUrl("bg/equip_tips.png", PackNameEnum.Common));
        this.nameBgLoader.load(URLManager.getModuleImgUrl("bg/name_bg.png", PackNameEnum.Common));

        this.activationBtn.addClickListener(this.clickActivationBtn, this);
        this.roadBtn.addClickListener(this.onClickBtn, this);
    }

    public setToolTipData(toolTipData: ToolTipData) {
        super.setToolTipData(toolTipData);
        let isShowActiveBtn: boolean = true;
        if (toolTipData.data instanceof ItemData) {
            this.itemData = toolTipData.data;
            this.fashionData = ConfigManager.mgFashion.getFashionByItemCode(this.itemData.getCode());
            isShowActiveBtn = true;
        } else {
            this.fashionData = toolTipData.data;
            isShowActiveBtn = false;
        }
        this.activationBtn.visible = CacheManager.pack.propCache.hasItem(this.itemData) && isShowActiveBtn;
        if (this.fashionData) {
            if (this.fashionData.type == EFashionType.EFashionWeapon) {
                this.modelBody.x = 370;
                this.modelBody.y = 140;
            } else {
                this.modelBody.x = 258;
                this.modelBody.y = 230;
            }
            this.name1Txt.text = this.name2Txt.text = this.fashionData.name;
            this.typeNameTxt.text = this.getFashionTypeStr(this.fashionData.type);

            let modelDict: any = WeaponUtil.getAttrDict(this.fashionData.modelIdList);
            let roleIndex: number = toolTipData.roleIndex ? toolTipData.roleIndex : RoleIndexEnum.Role_index0;
            let career: number = CacheManager.role.getRoleCareerByIndex(roleIndex, true);
            this.model.setShowType(this.getModelShowType(this.fashionData.type));
            // this.model.setData(this.fashionData.modelId);
            this.model.setData(modelDict[career]);

            let fashionStarData: any = ConfigManager.mgFashionStar.getByCodeAndStar(this.fashionData.code, 1);
            let attrDict: any = WeaponUtil.getAttrDict(fashionStarData.attrList);
            this.fightPanel.updateValue(WeaponUtil.getCombat(attrDict));
            this.attrTxt.text = WeaponUtil.getAttrDictStr(fashionStarData.attrList, true);
            if(this.fashionData.timeLimit){
                let limitTime: number = this.fashionData.timeLimit*3600;
                this.timeTxt.text = `有效时间：${App.DateUtils.getTimeStrBySeconds(limitTime, DateUtils.FORMAT_3)}`;
            }else{
                this.timeTxt.text = "";
            }


            let data: Array<any> = ConfigManager.propGet.getDataById(this.fashionData.propCode);
            if (data.length > 0) {
                this.type = data[0].type;
                this.roadBtn.text = data[0].name;
                this.controller.selectedIndex = 1;
            } else {
                this.controller.selectedIndex = 0;
            }
        } else {
        }

        if (this.activationBtn.visible) {
            this.imgBg.height = this.attrTxt.height + this.attrTxt.y + 100;
        } else {
            this.imgBg.height = this.attrTxt.height + this.attrTxt.y + 20;
        }
    }

    private getModelShowType(type: EFashionType): EShape {
        return ShapeUtils.getModelShowType(type);
    }

    private getFashionTypeStr(type: number): string {
        switch (type) {
            case EFashionType.EFashionClothes:
                return LangCommon.getTabName(PanelTabType.FashionClothes);
            case EFashionType.EFashionWeapon:
                return LangCommon.getTabName(PanelTabType.FashionWeapon);
            case EFashionType.EFashionWing:
                return LangCommon.getTabName(PanelTabType.FashionWing);
        }
        return "";
    }

    private clickActivationBtn(): void {        
        ItemsUtil.openFashion(this.fashionData,ViewIndex.Two);
        this.hide();
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
        // if (this.activationBtn.visible) {
        //     this.imgBg.height = this.attrTxt.height + this.attrTxt.y + 150;
        // } else {
        //     this.imgBg.height = this.attrTxt.height + this.attrTxt.y + 20;
        // }

        if (this.controller.selectedIndex == 0) {
            return this.imgBg.height;
        } else {
            return this.imgBg.height + 120;
        }
    }
}