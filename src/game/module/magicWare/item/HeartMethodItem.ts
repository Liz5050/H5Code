class HeartMethodItem extends ListRenderer {
    private icon_loader : GLoader;
    private index_loader : GLoader;
    private border_loader : GLoader;
    public itemdata : any;
    
    public constructor() {
		super();
	}

    protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
        this.icon_loader = <GLoader>this.getChild("iconLoader");
        this.index_loader = <GLoader>this.getChild("indexLoader");
        this.border_loader = <GLoader>this.getChild("loader_color");
	}

	public setData(data: any) {
        this.itemdata = data;
        if(data.data) {
            let itemCfg: any = ConfigManager.item.getByPk(data.data);
            this.index_loader.visible = false;
            this.icon_loader.visible =true;
            this.border_loader.visible = true;
            if(itemCfg) {
                this.icon_loader.load(URLManager.getIconUrl(itemCfg.icon, URLManager.ITEM_ICON));
                this.border_loader.load(URLManager.getItemColorUrl("color_" + itemCfg.color));
            }
        }
        else {
            this.index_loader.visible = true;
            let index = data.pos - 1;
            if(index == 0) {
                index = 1;
            }
            else {
                index = index % 5 + 1;
            }
            this.index_loader.load(URLManager.getModuleImgUrl(index + ".png",PackNameEnum.MagicWare));
            this.icon_loader.visible =false;
            this.border_loader.visible = false;
        }
        CommonUtils.setBtnTips(this, CacheManager.heartMethod.checkEquipCanUplvl(data.pos, data.role)||CacheManager.heartMethod.checkEquipCanReplace(data.pos, data.role))
	}


}