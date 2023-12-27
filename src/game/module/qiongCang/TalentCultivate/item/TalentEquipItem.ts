class TalentEquipItem extends ListRenderer {
    private bgLoader: GLoader;
	private iconLoader: GLoader;
	private controller: fairygui.Controller;

    private itemCfg: any;
    private isActive: boolean;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.bgLoader = this.getChild("loader_bg") as GLoader;
		this.iconLoader = this.getChild("loader_icon") as GLoader;
		this.controller = this.getController("c1");
        this.addClickListener(this.click, this);
    }

    public setData(data: any): void {
        this._data = data;
        this.itemCfg = ConfigManager.item.getByPk(data.code);
        this.isActive = true;
        let isBtnTip: boolean = false;
        if(this.itemCfg){
            this.iconLoader.load(URLManager.getIconUrl(this.itemCfg.icon, URLManager.ITEM_ICON));
            this.bgLoader.load(URLManager.getModuleImgUrl("TalentCultivate/color_" + this.itemCfg.color + ".png", PackNameEnum.QiongCang));
            this.controller.selectedIndex = 2;
        }else{
            if(CacheManager.talentCultivate.isPosActive(data.roleIndex,data.pos)){
                this.controller.selectedIndex = 1;
                isBtnTip = CacheManager.talentCultivate.isHasEquips(data.roleIndex);
            }else{
                this.controller.selectedIndex = 0;
                this.isActive = false;
            }
            this.iconLoader.clear();
            this.bgLoader.load(URLManager.getModuleImgUrl("TalentCultivate/color_1.png", PackNameEnum.QiongCang));
        }
        CommonUtils.setBtnTips(this, isBtnTip);
    }

    private click(): void{
        if(this.isActive){
            //打开装备更换界面
            EventManager.dispatch(LocalEventEnum.TalentReplaceWindowOpen, this._data);
        }else{
            Tip.showTip(`天赋等级达到${this._data.openLevel}级开启`)
        }
    }
}