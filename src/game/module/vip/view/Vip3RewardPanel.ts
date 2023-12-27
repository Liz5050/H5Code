class Vip3RewardPanel extends BaseModule {

    private static MODEL_ID:number = 12050901;
    private static ITEM_ID:number[] = [12150109, 12250109, 12350109];
    private c1: fairygui.Controller;
    private modelContainer: fairygui.GComponent;
    private fightComp: FightPanel;
    private chargeBtn: fairygui.GButton;
    private itemList:any[];
    private modelShow: ModelShow;
    private modelItemData: ItemData;

    public constructor() {
        super(ModuleEnum.Vip3Reward, PackNameEnum.Vip3Reward);
    }

    public initOptUI(): void {
        this.c1 = this.getController('c1');
        this.modelContainer = this.getGObject("model_container").asCom;
        this.chargeBtn = this.getGObject("btn_charge").asButton;
        this.chargeBtn.addClickListener(this.onClick, this);
        this.fightComp = <FightPanel>this.getGObject("comp_fight");

        this.modelShow = new ModelShow(EShape.EShapeMagic);

        this.modelContainer.displayListContainer.addChild(this.modelShow);
    }

    public updateAll(data: any = null): void {
        this.modelShow.setData(Vip3RewardPanel.MODEL_ID);

        if (!this.modelItemData) {
            this.modelItemData = new ItemData(Vip3RewardPanel.MODEL_ID);
            this.fightComp.updateValue(WeaponUtil.getCombatByItemData(this.modelItemData));
        }

        if (!this.itemList) {
            this.itemList = [];
            let itemData:ItemData;
            let item:BaseItem;
            let fc:FightPanel;
            for (let i=0; i<Vip3RewardPanel.ITEM_ID.length;i++) {
                item = this.getGObject("baseItem" + i) as BaseItem;
                fc = this.getGObject("comp_fight" + i) as FightPanel;
                itemData = new ItemData(Vip3RewardPanel.ITEM_ID[i]);
                item.setData(itemData);
                fc.updateValue(WeaponUtil.getCombatByItemData(itemData));

                this.itemList.push({item:item, fc:fc});
            }
        }

        this.c1.selectedIndex = CacheManager.vip.isVip3AndHasReward() ? 1 : 0;
    }

    private onClick() {
        if (this.c1.selectedIndex == 0) {
            HomeUtil.openRecharge();
        } else {
            HomeUtil.open(ModuleEnum.VIP,false,{vipLevel:3});
        }
    }

    public hide(param: any = null, callBack: CallBack = null):void {
        super.hide(param, callBack);
        this.modelShow.reset();
    }
}