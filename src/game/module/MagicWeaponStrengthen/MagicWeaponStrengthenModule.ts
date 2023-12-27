class MagicWeaponStrengthenModule extends BaseTabModule {


    public constructor() {
        super(ModuleEnum.MagicWeaponStrengthen , PackNameEnum.MagicWeaponStrengthen);
        this.indexTitle = false;
    }
        
    public initOptUI() : void {
        super.initOptUI();
        this.className = {
            [PanelTabType.MagicWeaponStarUp] : ["MagicStrengthenPanel" , MagicStrengthenPanel],
            [PanelTabType.MagicWeaponCopy] : ["MagicWeaponCopyPanel" , MagicWeaponCopyPanel,PackNameEnum.MagicWeaponCopy],
        };
    }

    public updateAll(data?:any):void{
        this.setCopyTips();
        this.setStrengthenTips();
    }
    public setCopyTips():void{
        this.setBtnTips(PanelTabType.MagicWeaponCopy,CacheManager.copy.isSpiritTip());   
    }

    public setStrengthenTips():void {
        this.setBtnTips(PanelTabType.MagicWeaponStarUp , CacheManager.magicWeaponStrengthen.checkTips());
    }

    public updateCopyPanel():void{
        if(this.isTypePanel(PanelTabType.MagicWeaponCopy)){
            this.curPanel.updateAll();
        }
    }

    public updateStrengthenPanel():void {
        this.updateAll();
        if(this.isTypePanel(PanelTabType.MagicWeaponStarUp)) {
             (<MagicStrengthenPanel>this.curPanel).updateAll();
        }
    }

    public setCopyPanelTips():void{
        if(this.isTypePanel(PanelTabType.MagicWeaponCopy)){
            (<MagicWeaponCopyPanel>this.curPanel).setBtnTips();
        }
    }

    public setStrengthenPanelTips() : void {
        if(this.isTypePanel(PanelTabType.MagicWeaponStarUp)) {
            (<MagicStrengthenPanel>this.curPanel).setBtnTips();
        }
    }

    protected updateSubView():void {
    
	}


}