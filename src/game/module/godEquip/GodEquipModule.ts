/**
 * 神装
 */

class GodEquipModule extends BaseTabModule {
	private roleItemPanel: RoleItemPanel; 
	private roleIndex: number = 0;

	public constructor(moduleId: ModuleEnum) {
		super(ModuleEnum.GodEquip, PackNameEnum.GodEquip);
		this.indexTitle = false;
	}

	public initOptUI(): void {
		super.initOptUI();
		this.className = {
			[PanelTabType.GodEquip]:["GodEquipPanel",GodEquipPanel], 
			[PanelTabType.Shura]:["ShuraPanel",ShuraPanel,PackNameEnum.Shura]
		};
		this.roleItemPanel = <RoleItemPanel>this.getGObject("RoleItemPanel");
        this.roleItemPanel.setSelectChangedFun(this.onRoleSelectChanged, this);
	}

	public updateAll(): void {
		this.roleItemPanel.updateRoles();
        this.roleIndex = this.roleItemPanel.selectedIndex;
		this.updateBtnTip();
	}

	/**神装红点 */
	public updateBtnTip():void {
		this.setBtnTips(PanelTabType.GodEquip, CacheManager.godEquip.checkTips());
		this.setBtnTips(PanelTabType.Shura, CacheManager.shura.checkTips());
		this.checkRoleItemRedTip();
	}


    protected updateSubView():void {
		this.checkRoleItemRedTip();
		this.roleIndex = this.roleItemPanel.getFirstFuncRedTip();
        this.setRoleIndex(this.roleIndex);
	}

	private onRoleSelectChanged(index: number, data: any): void {
        this.setRoleIndex(index);
    }

	private setRoleIndex(index: number): void {
        this.roleIndex = index;
        this.roleItemPanel.selectedIndex = index;
		if(this.curPanel) {
			this.curPanel["roleIndex"] = index;
		}
		this.checkRoleItemRedTip();
    }

	/**检测角色头像红点 */
    private checkRoleItemRedTip(): void {
        if (!this.roleItemPanel.listData) return;
		let index: number;
		for (let data of this.roleItemPanel.listData) {
			index = data["index"];
			if (data["role"] != null) {
				let isTip: boolean = false;
				if(this.isTypePanel(PanelTabType.GodEquip)){
					isTip = CacheManager.godEquip.checkTipByIndex(index);
				}else if(this.isTypePanel(PanelTabType.Shura)){
					isTip = CacheManager.shura.checkTipByIndex(index);
				}
                this.roleItemPanel.setRoleRedTip(index, isTip);

			}
		}
    }

	public updateDecomposeTips(): void {
		if (this.curPanel instanceof GodEquipPanel) {
			this.curPanel.updateDecomposeTips();
		}else if (this.curPanel instanceof ShuraPanel) {
			this.curPanel.updateDecomposeTips();
		}
	}

	public updateGodEquip(): void {
		this.updateBtnTip();
		if (this.curPanel instanceof GodEquipPanel) {
			this.curPanel.updateEquips();
		}else if(this.curPanel instanceof ShuraPanel) {
			this.curPanel.updateEquip();
		}
	}

	// public updateGetFragment(count: number): void {
	// 	if (this.curPanel instanceof GodEquipPanel) {
	// 		this.curPanel.updateGetFragment(count);
	// 	}
	// }

	public onGenerateSuccess(type: EEquip): void {
		if (this.curPanel instanceof GodEquipPanel) {
			this.curPanel.onGenerateSuccess(type);
		}
	}

	public hide(): void {
        super.hide();
        this.curIndex = -1;
        this.roleIndex = this.roleItemPanel.selectedIndex = 0;
    }

}