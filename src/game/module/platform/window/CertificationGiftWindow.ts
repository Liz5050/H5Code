class CertificationGiftWindow extends BaseWindow {
    
    public list_item : List;
    public btn_get : fairygui.GButton;

    public constructor() {
        super(PackNameEnum.MicroClient , "CertificationGiftWindow");
    }

    public initOptUI() : void {
        this.list_item = new List(this.getGObject("list_gift").asList);
        this.btn_get = this.getGObject("btn_get").asButton;
        this.btn_get.addClickListener(this.onClickGet, this);
    }

    public onClickGet() : void {
        if(Sdk.platform_config_data.is_eissm == 2) {
            Sdk.platformOperation(EShareRewardType.EShareRewardTypeSM);
        }
        else {
            EventManager.dispatch(LocalEventEnum.CertificationOpenWindow);
        }
        this.hide();
    }

    public updateAll() : void {
        var cfg = ConfigManager.const.getByPk("IssmReward1");
        var list = new Array<ItemData>();
        var item = new ItemData(cfg.constValue);
        item.itemAmount = cfg.constValueEx;
        list.push(item);

        cfg = ConfigManager.const.getByPk("IssmReward2");
        item = new ItemData(cfg.constValue);
        item.itemAmount = cfg.constValueEx;
        list.push(item);

        cfg = ConfigManager.const.getByPk("IssmReward3");
        item = new ItemData(cfg.constValue);
        item.itemAmount = cfg.constValueEx;
        list.push(item);

        this.list_item.data = list;
    }



}