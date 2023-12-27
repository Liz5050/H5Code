/**
 * 法器
 */

class MagicWareModule extends BaseTabModule {
    private roleItemPanel: RoleItemPanel;
    private roleIndex: number = 0;
    private strengthenTypes: EStrengthenExType[];
    public constructor() {
        super(ModuleEnum.MagicWare, PackNameEnum.MagicWare);
    }

    public initOptUI(): void {
        super.initOptUI();
        this.className = {
            [PanelTabType.DragonSoul]: ["DragonScalePanel", DragonScalePanel],
            [PanelTabType.ColorStone]: ["ColorStonePanel", ColorStonePanel],
            [PanelTabType.HeartMethod]: ["HeartMethodPanel", HeartMethodPanel],
            [PanelTabType.BeastBattle]: ["BeastBattlePanel", BeastBattlePanel, PackNameEnum.BeastBattle],
        };
        this.roleItemPanel = <RoleItemPanel>this.getGObject("RoleItemPanel");
        this.roleItemPanel.setSelectChangedFun(this.onRoleIndexChanged, this);
        this.strengthenTypes = [
            EStrengthenExType.EStrengthenExTypeDragonSoul,
            EStrengthenExType.EStrengthenExTypeColorStone,
            EStrengthenExType.EStrengthenExTypeHeartMethod,
        ];
    }

    public updateAll(data?: any): void {
        this.roleItemPanel.updateRoles();
        this.roleIndex = this.roleItemPanel.selectedIndex;
        this.checkRedTip();
    }

    private onRoleIndexChanged(index: number, data: any): void {
        this.setRoleIndex(index);
    }

    public onPropUpdate(): void {
        if (this.curPanel instanceof DragonScalePanel) {
            this.curPanel.updateProp();
        } else if (this.curPanel instanceof MagicWareWingPanel) {
            this.curPanel.updateProp();
        }
        else if (this.curPanel instanceof HeartMethodPanel) {
            this.curPanel.updateProp();
        } else if (this.curPanel instanceof ColorStonePanel) {
            this.curPanel.updateProp();
        }
        this.checkRoleItemRedTip();
        this.checkTabBtnRedTip();
        this.updateBeastPanel();
    }

    public updateBeastEquipExp(): void{
        this.updateBeastPanel();
    }

    protected updateSubView(): void {
        this.checkRoleItemRedTip();
        this.roleIndex = this.roleItemPanel.getFirstFuncRedTip();
        this.setRoleIndex(this.roleIndex);
        if (this.isTypePanel(PanelTabType.BeastBattle)) {
            this.roleItemPanel.visible = false;
        } else {
            this.roleItemPanel.visible = true;
        }
    }

    private setRoleIndex(index: number): void {
        this.roleIndex = index;
        this.roleItemPanel.selectedIndex = index;
        if (this.curPanel instanceof DragonScalePanel) {
            this.curPanel.roleIndex = index;
        }
        else if (this.curPanel instanceof MagicWareWingPanel) {
            this.curPanel.roleIndex = index;
        }
        else if (this.curPanel instanceof HeartMethodPanel) {
            this.curPanel.roleIndex = index;
        } else if (this.curPanel instanceof ColorStonePanel) {
            this.curPanel.roleIndex = index;
        }
        this.checkRedTip();
    }

    /**
     * 强化成功
     */
    public onStrengthenExUpgraded(info: SUpgradeStrengthenEx): void {
        if (info.type == EStrengthenExType.EStrengthenExTypeDragonSoul && this.curPanel instanceof DragonScalePanel) {
            this.curPanel.updateBySUpgradeStrengthenEx(info);
        } else if (this.curPanel instanceof MagicWareWingPanel) {
            this.curPanel.onSuccess(info);
        } else if (this.curPanel instanceof ColorStonePanel) {
            this.curPanel.onUpgrade(info);
        }
        this.checkRedTip();
    }

    /**
     * 强化信息更新
     */
    public onStrengthenExUpdated(data: any): void {
        if (this.curPanel instanceof DragonScalePanel) {
            //龙魂不需要处理这个消息
            this.curPanel.updateAll();
        } else if (this.curPanel instanceof MagicWareWingPanel) {
            this.curPanel.updateAll();
        } else if (this.curPanel instanceof ColorStonePanel) {
            this.curPanel.updateAll();
        }
        this.checkRedTip();
    }

    /**
     * 激活成功
     */
    public onnStrengthenExActived(info: SUpgradeStrengthenEx): void {
        if (this.curPanel instanceof DragonScalePanel) {
            this.curPanel.updateBySUpgradeStrengthenEx(info);
        } else if (this.curPanel instanceof MagicWareWingPanel) {
            this.curPanel.onActived();
        } else if (this.curPanel instanceof ColorStonePanel) {
            this.curPanel.updateAll();
        }
        this.checkRedTip();
    }



    /**检测角色头像红点 */
    private checkRoleItemRedTip(): void {
        if (!this.roleItemPanel.listData) return;
        let type: EStrengthenExType = this.strengthenTypes[this.curIndex];
        if (type == null) return;
        let index: number;
        for (let data of this.roleItemPanel.listData) {
            index = data["index"];
            if (data["role"] != null) {
                let isTip: boolean = CacheManager.magicWare.isRoleRedTip(type, index);
                this.roleItemPanel.setRoleRedTip(index, isTip);
            }
        }
    }

    /**检测标签页红点 */
    private checkTabBtnRedTip(): void {
        for (let i: number = 0; i < this.strengthenTypes.length; i++) {
            let type: EStrengthenExType = this.strengthenTypes[i];
            let isTip: boolean = CacheManager.magicWare.isTabRedTip(type);
            let panelType: PanelTabType = this._tabTypes[i]; //type == EStrengthenExType.EStrengthenExTypeDragonSoul ? PanelTabType.DragonSoul : PanelTabType.HeartMethod;
            panelType != null ? this.setBtnTips(panelType, isTip) : null;
        }
        this.setBtnTips(PanelTabType.BeastBattle, CacheManager.beastBattle.checkTips());
    }

    private checkRedTip(): void {
        this.checkRoleItemRedTip();
        this.checkTabBtnRedTip();
    }

    public hide(): void {
        super.hide();
        this.curIndex = -1;
        this.roleIndex = this.roleItemPanel.selectedIndex = 0;
    }


    public onHeartMethodUpadte(): void {
        if (this.curPanel instanceof HeartMethodPanel) {
            this.curPanel.onUpDateData();
        }
        this.checkRedTip();

    }

    public onHeartMethodActive(): void {
        if (this.curPanel instanceof HeartMethodPanel) {
            this.curPanel.onActive();
        }
        this.checkRedTip();
    }

    public updateBeastPanel(): void {
        if (this.curPanel instanceof BeastBattlePanel) {
            this.curPanel.updatePanel();
        }
        this.checkRedTip();
    }

    
    protected onSelectBtnChange(): void {
        super.onSelectBtnChange();
        if (this.curPanel instanceof ColorStonePanel) {
            this.tabBgType = TabBgType.High ;
        }
        else {
            this.tabBgType = TabBgType.Default;
        }
        
    }
}