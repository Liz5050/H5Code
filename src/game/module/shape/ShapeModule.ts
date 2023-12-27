/**
 * 外观
 */

class ShapeModule extends BaseTabModule {
	private roleItemPanel: RoleItemPanel;
	private roleIndex: number = 0;

	public constructor() {
		super(ModuleEnum.Shape, PackNameEnum.Shape);
	}

	public initOptUI(): void {
		super.initOptUI();
		this.className = {
			[PanelTabType.Mount]: ["MountPanel", MountPanel, PackNameEnum.Mount],
            [PanelTabType.Pet]:["PetPanel",PetPanel,PackNameEnum.Pet],
			[PanelTabType.ShapeBattle]: ["BattleArrayPanel", BattleArrayPanel, PackNameEnum.ShapeBattle],
			[PanelTabType.Wing]: ["MagicWareWingPanel", MagicWareWingPanel, PackNameEnum.MagicWare],
			[PanelTabType.MagicLaw]:["MagicArrayPanel", MagicArrayPanel, PackNameEnum.MagicArray],
			[PanelTabType.ShapeSwordPool]:["SwordPoolPanel", SwordPoolPanel, PackNameEnum.SwordPool],
		};
		this.roleItemPanel = <RoleItemPanel>this.getGObject("RoleItemPanel");
		this.roleItemPanel.setSelectChangedFun(this.onRoleSelectChanged, this);
		this.descBtn.visible = true;


		//注册标签页
		let tabButtonItem: TabButtonItem;
		let panelTypeType: PanelTabType;
		let targetName: string = GuideTargetName.ShapeModulePetTab;
		for(let item of this.tabBtnList.list._children) {
			tabButtonItem = item as TabButtonItem;
			panelTypeType = tabButtonItem.getData();
			if (panelTypeType == PanelTabType.Wing) {
				targetName = GuideTargetName.ShapeModuleWingTab;
			} else if (panelTypeType == PanelTabType.Mount) {
				targetName = GuideTargetName.ShapeModuleMountTab;
			} else if (panelTypeType == PanelTabType.ShapeSwordPool) {
				targetName = GuideTargetName.ShapeModuleSwordPoolTab;
			} else if (panelTypeType == PanelTabType.ShapeBattle) {
				targetName = GuideTargetName.ShapeModuleBattleTab;
			} else {
				targetName = null;
			}
			if (targetName) {
				GuideTargetManager.reg(targetName, item);
			}
		}
	}

	public updateAll(): void {
		this.heightController.selectedIndex = 1;
		this.roleItemPanel.updateRoles();
		this.roleIndex = this.roleItemPanel.selectedIndex;
		this.checkBtnTip();
	}

    protected showCondition(type:PanelTabType):boolean {
        if(type == PanelTabType.Pet) {
            if(CacheManager.serverTime.serverOpenDay >= ConfigManager.mgOpen.getOpenTypeValue(MgOpenEnum.Pet, EOpenCondType.EOpenCondTypeServerOpenDays)) {
                return true;
            }
        }
		return false;
	}

	/**红点 */
	public checkBtnTip(): void {
		this.checkRoleItemRedTip();
		this.updateWingTips();
		this.setBtnTips(PanelTabType.Mount, CacheManager.mount.checkTips());
		this.setBtnTips(PanelTabType.Pet,CacheManager.pet.checkTips());
		this.setBtnTips(PanelTabType.ShapeBattle, CacheManager.battleArray.checkTips());
		this.setBtnTips(PanelTabType.MagicLaw, CacheManager.magicArray.checkTips());
		this.setBtnTips(PanelTabType.ShapeSwordPool, CacheManager.swordPool.checkTips());
	}

	protected updateSubView(): void {
		this.checkRoleItemRedTip();
		this.roleIndex = this.roleItemPanel.getFirstFuncRedTip();
        this.setRoleIndex(this.roleIndex);
		if(this.isTypePanel(PanelTabType.Pet)){
            this.roleItemPanel.visible = false;
		}else {
            this.roleItemPanel.visible = true;
        }
	}

	private onRoleSelectChanged(index: number, data: any): void {
		this.setRoleIndex(index);
	}

	private setRoleIndex(index: number): void {
		this.roleIndex = index;
		this.roleItemPanel.selectedIndex = index;
		if (this.curPanel) {
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
				if (this.isTypePanel(PanelTabType.Mount)) {
					isTip = CacheManager.mount.checkTipsByRoleIndex(index);
				} else if (this.isTypePanel(PanelTabType.Wing)) {
					isTip = CacheManager.magicWare.isRoleRedTip(EStrengthenExType.EStrengthenExTypeWing, index);
				}
				else if (this.isTypePanel(PanelTabType.ShapeBattle)) {
					isTip = CacheManager.battleArray.checkTipsByRoleIndex(index);
				}
				else if(this.isTypePanel(PanelTabType.MagicLaw)) {
					isTip = CacheManager.magicArray.checkTipsByRoleIndex(index);
				}
				else if(this.isTypePanel(PanelTabType.ShapeSwordPool)) {
					isTip = CacheManager.swordPool.checkTipsByRoleIndex(index);
				}
				this.roleItemPanel.setRoleRedTip(index, isTip);
			}
		}
	}

	public updateMoney(): void {
        super.updateMoney();
        if(this.curPanel instanceof PetPanel){
            this.curPanel.updateProp();
        }
		else if(this.curPanel instanceof MountPanel) {
			this.curPanel.updateProp();
		}
		else if(this.curPanel instanceof BattleArrayPanel) {
			this.curPanel.updateProp();
		}
		else if (this.curPanel instanceof MagicWareWingPanel) {
			this.curPanel.updateProp();
		}
		else if(this.curPanel instanceof MagicArrayPanel) {
			this.curPanel.updateProp();
		}
		else if(this.curPanel instanceof SwordPoolPanel) {
			this.curPanel.updateProp();
		}
        this.checkBtnTip();
    }

	public onPropUpdate(): void {
		if (this.curPanel instanceof MountPanel) {
			this.curPanel.updateProp();
		}
		else if(this.curPanel instanceof PetPanel){
            this.curPanel.updateProp();
        }
		else if (this.curPanel instanceof BattleArrayPanel) {
			this.curPanel.updateProp();
		}
		else if (this.curPanel instanceof MagicWareWingPanel) {
			this.curPanel.updateProp();
		}
		else if(this.curPanel instanceof MagicArrayPanel) {
			this.curPanel.updateProp();
		}
		else if(this.curPanel instanceof SwordPoolPanel) {
			this.curPanel.updateProp();
		}
		this.checkBtnTip();
	}

	public updatePanel(): void {
		if (this.curPanel instanceof MountPanel) {
			this.curPanel.updateAll();
		}
		else if(this.curPanel instanceof PetPanel){
           this.curPanel.updateAll();
        }
		else if (this.curPanel instanceof BattleArrayPanel) {
			this.curPanel.updateAll();
		}
		else if (this.curPanel instanceof MagicWareWingPanel) {
			this.curPanel.updateAll();
		}
		else if(this.curPanel instanceof MagicArrayPanel) {
			this.curPanel.updateAll();
		}
		else if(this.curPanel instanceof SwordPoolPanel) {
			this.curPanel.updateAll();
		}
		this.checkBtnTip();
	}

	/**更新界面（祝福值更新） */
	public luckUpgrade(data: any): void {
		if (this.curPanel instanceof MountPanel) {
			this.curPanel.onSuccess(data);
		}
		else if(this.curPanel instanceof PetPanel){
           this.curPanel.onSuccess(data);
        }
		else if (this.curPanel instanceof BattleArrayPanel) {
			this.curPanel.onSuccess(data);
		}
		else if(this.curPanel instanceof MagicArrayPanel) {
			this.curPanel.onSuccess(data);
		}
		else if(this.curPanel instanceof SwordPoolPanel) {
			this.curPanel.onSuccess(data);
		}
		this.checkBtnTip();
	}

	public hide(): void {
		super.hide();
		this.curIndex = -1;
		this.roleIndex = this.roleItemPanel.selectedIndex = 0;
	}

	/**
     * 强化成功
     */
	public onStrengthenExUpgraded(info: SUpgradeStrengthenEx): void {
		if (this.curPanel instanceof MagicWareWingPanel) {
			this.curPanel.onSuccess(info);
		}
		this.updateWingTips();
		this.checkRoleItemRedTip();
	}

	/**
     * 强化信息更新
     */
	public onStrengthenExUpdated(data: any): void {
		if (this.curPanel instanceof MagicWareWingPanel) {
			this.curPanel.updateAll();
		}
		this.updateWingTips();
		this.checkRoleItemRedTip();
	}

	/**
     * 激活成功
     */
	public onnStrengthenExActived(info: SUpgradeStrengthenEx): void {
		if (this.curPanel instanceof MagicWareWingPanel) {
			this.curPanel.onActived();
		}
		this.updateWingTips();
		this.checkRoleItemRedTip();
	}

	/**翅膀红点 */
	private updateWingTips(): void {
		let isTip: boolean = CacheManager.magicWare.isTabRedTip(EStrengthenExType.EStrengthenExTypeWing);
		this.setBtnTips(PanelTabType.Wing, isTip);
	}


    public clickDesc(): void {
		let desc: string = "";
		if(this.isTypePanel(PanelTabType.Pet)) {
			desc = LangShapeBase.LANG5;
		}
		else if(this.isTypePanel(PanelTabType.Wing)) {
			desc = LangShapeBase.LANG23;
		}
		else if(this.isTypePanel(PanelTabType.Mount)) {
			desc = LangShapeBase.LANG6;
		}
		else if(this.isTypePanel(PanelTabType.ShapeBattle)) {
			desc = LangShapeBase.LANG7;
		}
		else if(this.isTypePanel(PanelTabType.MagicLaw)) {
			desc = LangShapeBase.LANG8;
		}
		else if(this.isTypePanel(PanelTabType.ShapeSwordPool)) {
			desc = LangShapeBase.LANG9;
		}
        EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:desc}); 
	}

	public updateIcon(): void{
		this.updateWingTips();
		this.checkRoleItemRedTip();
		if (this.curPanel instanceof MagicWareWingPanel) {
			this.curPanel.updateIcon();
		}
	}
}