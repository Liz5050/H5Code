/**
 * 神羽模块
 * @author zhh
 * @time 2018-08-08 17:33:32
 */
class GodWingModule extends BaseTabModule {
    
    private c1:fairygui.Controller;
    public constructor() {
        super(ModuleEnum.GodWing,PackNameEnum.GodWing);

    }
    public initOptUI(): void {
        super.initOptUI();        
        this.tabBgType = TabBgType.Default;
        //this.c1 = this.getController("c1");
        //this.c1.setSelectedIndex(0);
        this.indexTitle = false;
    }
     protected initTabInfo():void{
        this.className = {			
           [PanelTabType.GodWingEquip]:["GodWingEquipPanel",GodWingEquipPanel,PackNameEnum.GodWingEquipPanel],
           [PanelTabType.GodWingCompose]:["GodWingComposePanel",GodWingComposePanel,PackNameEnum.GodWingPanel],
           [PanelTabType.GodWingTransform]:["GodWingTransformPanel",GodWingTransformPanel,PackNameEnum.GodWingPanel]
        };        
	}

    public updateAll(data?: any): void {
        this.setIndex(PanelTabType.GodWingEquip,data);
        this.setBtnTips(PanelTabType.GodWingEquip,CacheManager.godWing.checkTip());
    }
    public updateByPropPack():void{
        if(this.curPanel){
            this.curPanel.updateAll();
        }        
        this.setBtnTips(PanelTabType.GodWingEquip,CacheManager.godWing.checkTip());
    }
    
    public updateEquiPanel():void{
        if(this.isTypePanel(PanelTabType.GodWingEquip)){
            this.curPanel.updateAll();
        }
    }

    protected updateSubView():void{
        let idx:number = Math.max(0,this._tabTypes.indexOf(this.curType));        
        //this.c1.setSelectedIndex(idx);
        if(idx > 0) {
            this.tabBgType = TabBgType.None;
        }
        else {
             this.tabBgType = TabBgType.Default;
        }
       
    }
	
    

}