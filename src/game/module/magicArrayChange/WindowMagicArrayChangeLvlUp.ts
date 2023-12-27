class WindowMagicArrayChangeLvlUp extends BaseWindow {

    private txt_lvl:fairygui.GTextField;
    private txt_name : fairygui.GTextField;
    private item_icon: GLoader;
    private txt_now : fairygui.GRichTextField;
    private txt_next : fairygui.GRichTextField;
    private txt_cost : fairygui.GRichTextField;
    private btn_lvlup : fairygui.GButton;
    private btn_getItem : fairygui.GButton;
    private big_loader: GLoader;
    private mat_loader: GLoader;

    private modelContainer: fairygui.GComponent;
    private modelBody: egret.DisplayObjectContainer;
    private model: ModelShow;


    private modelContainer2: fairygui.GComponent;
    private modelBody2: egret.DisplayObjectContainer;
    private model2: ModelShow;



    private skilldata : any;
    private curCfg : any;

    private c1 : fairygui.Controller;
    
    public constructor() {
        super(PackNameEnum.MagicArray , "WindowMagicArrayLvlUp");
    }

    public initOptUI() : void {
        this.c1 = this.getController("c1");
        this.txt_lvl = this.getGObject("level").asTextField;
        this.txt_name = this.getGObject("name").asTextField;
        this.item_icon = this.getGObject("loader_icon") as GLoader;
        this.txt_now = this.getGObject("now_skill").asRichTextField;
        this.txt_next = this.getGObject("next_skill").asRichTextField;
        this.big_loader = this.getGObject("big_loader") as GLoader;
        this.txt_cost = this.getGObject("cost").asRichTextField;
        this.mat_loader = this.getGObject("mat_icon") as GLoader;
        this.btn_lvlup = this.getGObject("btn_lvlup").asButton;
        this.btn_getItem = this.getGObject("getItem").asButton;
        this.btn_lvlup.addClickListener(this.onClickUpLvl, this);
        this.btn_getItem.addClickListener(this.getItem, this);
        this.mat_loader.addClickListener(this.onTouchCostIconHandler, this);


        this.modelContainer = this.getGObject("model_container").asCom;
        this.model = new ModelShow(EShape.EShapeLaw);
        this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");
        this.modelBody.addChild(this.model);
        this.modelBody.x = 20;
        this.modelBody.y = 5;
        (this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody);

        this.modelContainer2 = this.getGObject("model_container2").asCom;
        this.model2 = new ModelShow(EShape.EShapeLaw);
        this.modelBody2 = ObjectPool.pop("egret.DisplayObjectContainer");
        this.modelBody2.addChild(this.model2);
        this.modelBody2.x = 20;
        this.modelBody2.y = 5;
        (this.modelContainer2.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody2);
    }

    public updateAll(data : any) {
        this.model.setData(data.change);
        //this.model2.setData(1002);
        this.skilldata = data;
        var id = data.skillId;
        var cfg = ConfigManager.skill.getSkill(id);
        var nextcfg = ConfigManager.skill.getSkill(id + 1);
        if(nextcfg) {
            if(nextcfg.skillLevel <= cfg.skillLevel) {
                nextcfg = undefined;
            }
        }

        this.txt_now.text = "";
        this.txt_next.text = "";

        if(cfg) {
            this.txt_now.text =  HtmlUtil.br(cfg.skillDescription);
        }

        if(nextcfg) {
            this.txt_next.text = HtmlUtil.br(cfg.skillDescription);
        }

        this.big_loader.load(URLManager.getModuleImgUrl("1001.png",PackNameEnum.MagicArray));
        this.curCfg = cfg;

        if(!nextcfg) {
            this.c1.selectedIndex = 1;
        }
        else {
            this.c1.selectedIndex = 0;
        }
        if(cfg) {
            this.txt_name.text = cfg.skillName + "  " + cfg.skillLevel + "级"
            //this.txt_lvl.text = cfg.skillLevel + "级";
            this.item_icon.load(URLManager.getIconUrl(cfg.skillIcon,"skill"));
            if(cfg.needItemCode) {
                var item = ConfigManager.item.getByPk(cfg.needItemCode);
                if(item) {
                    this.mat_loader.load(URLManager.getIconUrl(item.icon, URLManager.ITEM_ICON));
                    let count: number = CacheManager.pack.propCache.getItemCountByCode2(cfg.needItemCode);
                    var num =0;
                    if(nextcfg) {
                        num = nextcfg.needItemNum;
                    }
                    this.txt_cost.text = MoneyUtil.getResourceText(count, num);
                    if(nextcfg) {
                        CommonUtils.setBtnTips(this.btn_lvlup, count >= num);
                        this.btn_lvlup.grayed = count < num;
                    }
                    else {
                        CommonUtils.setBtnTips(this.btn_lvlup, false);
                    }
                }
            }
        }
        if(!CacheManager.magicArrayChange.getInfoByChange(this.skilldata.change, this.skilldata.roleIndex)) {
            CommonUtils.setBtnTips(this.btn_lvlup, false);
            this.btn_lvlup.grayed = true;
        }
        this.txt_now.align = fairygui.AlignType.Left;
        if(!data.isOpen) {
            this.txt_name.text = cfg.skillName + "  0" + "级"
            this.c1.setSelectedIndex(2);
        }


    }

    public onClickUpLvl() {
        ProxyManager.shape.shapeUpgradeChangeSkill(EShape.EShapeLaw, this.skilldata.change, this.skilldata.skillIndex, this.skilldata.roleIndex);
    }

    public getItem() {
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.curCfg.needItemCode });
        this.hide();
    }


    protected onTouchCostIconHandler(): void {
        ToolTipManager.showByCode(this.curCfg.needItemCode);
    }

    public updateUI() {
        if(this.skilldata.skillId < CacheManager.magicArrayChange.getTalentSkill(this.skilldata.change,this.skilldata.roleIndex).skillId) {
            Tip.showTip("天赋升级成功");
        }
        this.updateAll(CacheManager.magicArrayChange.getTalentSkill(this.skilldata.change,this.skilldata.roleIndex));
    }


}