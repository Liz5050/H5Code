class SpecialEquipController extends BaseController {
    private module: SpecialEquipModule;

    public constructor() {
        super(ModuleEnum.SpecialEquip);
		this.viewIndex = ViewIndex.Two;
    }

    protected initView(): BaseGUIView{
        this.module = new SpecialEquipModule(this.moduleId);
        return this.module;
    }

    protected addListenerOnInit(): void {
    }

    protected addListenerOnShow(): void {
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameUpgradeEquipEx], this.onUpgradeEquipEx, this);
        this.addListen0(NetEventEnum.packRolePackItemsChange, this.packRolePackItemsChange, this);//角色背包有变动
        this.addListen1(NetEventEnum.packBackPackItemsChange, this.backpackChange, this);
    }

    /**
     * 装备（龙鳞甲和摄坤铃）进阶返回
     * @param data S2C_SUpgradeEquipEx
     */
    private onUpgradeEquipEx(data: any): void{
        // let itemData: ItemData = CacheManager.pack.rolePackCache.getDressEquipByType(data.type, data.index);
        // this.module.updateModule({"item": itemData, roleIndex: data.index});
    }

    private packRolePackItemsChange(packIndex: number): void{
        let itemData: ItemData = CacheManager.pack.rolePackCache.getItemAtIndex(packIndex);
        let index: number = itemData.getRoleIndex();
        if(WeaponUtil.isSpecialTipsEquip(itemData.getType())){
            this.module.updateModule({"item": itemData, roleIndex: index});
        }

    }

    private backpackChange(): void{
        this.module.updateProp();
    }
}