/**
 * 法宝幻形
 */

class MagicWeaponChangeModule extends BaseTabModule{

	public constructor() {
		super(ModuleEnum.MagicWeaponChange, PackNameEnum.MagicWeaponChange);
	}

	public initOptUI():void{
		super.initOptUI();
		this.className = {
			[PanelTabType.MagicWeaponChange]:["MagicWeaponChangePanel",MagicWeaponChangePanel],
		};
		this.tabBtnList.list.visible = false;
	}

	public updateAll():void{
		this.tabBgType = TabBgType.Low;
	}

	/**更新宠物幻形界面 */
    public updateMagicWeaponChangePanel():void{
        if(this.curPanel instanceof MagicWeaponChangePanel){
           this.curPanel.updatePanel();
        }
    }

	/**
	 * 幻化成功
	 */
	public onChangeModelSuccess(): void {
		if(this.curPanel instanceof MagicWeaponChangePanel) {
			this.curPanel.updateChangeList();
			this.curPanel.updateModel();
		}
	}

	/**
	 * 道具更新
	 */
	public onPropPackChange(): void {
		if(this.curPanel instanceof MagicWeaponChangePanel) {
			this.curPanel.updateProp();
			this.curPanel.refreshChangeList();
		}
	}
}