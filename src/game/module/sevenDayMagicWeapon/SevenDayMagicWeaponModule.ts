class SevenDayMagicWeaponModule extends BaseModule {
    private controller: fairygui.Controller;
    private magicWeaponActivePanel: MagicWeaponActivePanel;
    private magicWeaponFusePanel: MagicWeaponFusePanel;
    // private runePanel: PackRunePanel;
    private propBtn: fairygui.GButton;

    public constructor() {
        super(ModuleEnum.SevenDayMagicWeapon, PackNameEnum.SevenDayMagicWeapon);
    }

    public initOptUI(): void {
        this.controller = this.getController("c1");
        this.magicWeaponActivePanel = new MagicWeaponActivePanel(this.getGObject("panel_active").asCom, this.controller, 0);
        this.magicWeaponFusePanel = new MagicWeaponFusePanel(this.getGObject("panel_fuse").asCom, this.controller, 1);
        // this.runePanel = new PackRunePanel(this.getGObject("panel_rune").asCom, this.controller, 2);
        // this.propBtn = this.getGObject("btn_item").asButton;
        this.addListen1(LocalEventEnum.MagicWeaponUpdate,this.updateAll,this);
        this.closeObj.visible = false;
    }

    //根据缓存更新
    public updateAll(): void {
        // this.controller.selectedIndex = 0;
        // this.magicWeaponActivePanel.updateAll();
        if(CacheManager.sevenDayMagicWeapon.isCanFuse()){
            this.controller.selectedIndex = 1;
            if(this.magicWeaponFusePanel){
                this.magicWeaponFusePanel.updateAll();
            }
        }else{
            this.controller.selectedIndex = 0;
            if(this.magicWeaponActivePanel){
                this.magicWeaponActivePanel.updateAll();
            }
        }
    }

    protected onMainTabChanged(e: any): void {
    }

    public updateMagicWeapon(): void{
        if(CacheManager.sevenDayMagicWeapon.isCanFuse()){
            this.controller.selectedIndex = 1;
            if(this.magicWeaponFusePanel){
                this.magicWeaponFusePanel.updateAll();
            }
        }else{
            this.controller.selectedIndex = 0;
            if(this.magicWeaponActivePanel){
                this.magicWeaponActivePanel.updateInfo();
            }
        }
    }
}