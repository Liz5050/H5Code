/**
 * 锻造
 * @time 2018-05-29 11:37:09
 */
class ForgeModule extends BaseTabModule {
    private roleItemPanel: RoleItemPanel;
    private fightPanel: FightPanel;
    private forgeTypes:EStrengthenExType[];
    private roleIndex: number = 0;

    public constructor() {
        super(ModuleEnum.Forge,PackNameEnum.Forge);
        this.indexTitle = false;
    }

    public initOptUI(): void {
        super.initOptUI();
        this.className = {
            [PanelTabType.Strengthen]:["ForgeStrengthenPanel",ForgeStrengthenPanel, PackNameEnum.ForgeStrengthen],
            [PanelTabType.Refine]:["ForgeRefinePanel",ForgeRefinePanel,PackNameEnum.ForgeRefine],
            [PanelTabType.Casting]:["ForgeCastingPanel",ForgeCastingPanel,PackNameEnum.ForgeCasting],
            [PanelTabType.Immortals]:["ForgeImmortalsPanel",ForgeImmortalsPanel,PackNameEnum.ForgeImmortals],
        };
        
        this.fightPanel = <FightPanel>this.getGObject("fightPanel");
        this.roleItemPanel = <RoleItemPanel>this.getGObject("panel_roleItem");
        this.roleItemPanel.setSelectChangedFun(this.onRoleIndexChanged, this);
        this.forgeTypes = [EStrengthenExType.EStrengthenExTypeUpgrade,EStrengthenExType.EStrengthenExTypeRefine,EStrengthenExType.EStrengthenExTypeCast];

        //注册标签页
		let tabButtonItem: TabButtonItem;
		let panelTypeType: PanelTabType;
		let targetName: string = null;
		for(let item of this.tabBtnList.list._children) {
			tabButtonItem = item as TabButtonItem;
            panelTypeType = tabButtonItem.getData();
			if (panelTypeType == PanelTabType.Refine) {
				targetName = GuideTargetName.ForgeModuleRefineTab;
			} else if(panelTypeType == PanelTabType.Immortals){
                targetName = GuideTargetName.ForgeModuleImmortalsTab;
            } else {
                targetName = null;
            }
            if (targetName) {
			    GuideTargetManager.reg(targetName, item);
            }
		}
    }

    public updateAll(data?: any): void {
        this.roleItemPanel.updateRoles();
        this.roleIndex = this.roleItemPanel.selectedIndex;
        // let type:PanelTabType = PanelTabType.Strengthen;
        // if(data && data.tabType) {
        //     type = data.tabType;
        // }
        // this.setIndex(type);
    }

    public onPropUpdate(): void {
        if(this.curPanel) {
            (this.curPanel as ForgeBaseTabPanel).updateProp();
        }
        this.checkRoleItemRedTip();
        this.checkAllTabBtn();
    }

    public onStrengthenExUpdated(info: SUpgradeStrengthenEx): void {
        if(this.curPanel) {
            (this.curPanel as ForgeBaseTabPanel).updateBySUpgradeStrengthenEx(info);
        }
        this.checkRoleItemRedTip();
        this.updateFight();
    }
    /**神兵信息更新 */
    public onImmortalUpdate():void{
        if(this.isTypePanel(PanelTabType.Immortals)){
            (this.curPanel as ForgeBaseTabPanel).updateAll();
        }
        this.checkRoleItemRedTip();
        this.setBtnTips(PanelTabType.Immortals,CacheManager.forgeImmortals.checkTip());
        this.updateFight();
    }

    public onCheckPointUpdate():void{
        if(this.curPanel instanceof ForgeStrengthenPanel){
            this.curPanel.updateBtn();
        }else if(this.curPanel instanceof ForgeRefinePanel){
            this.curPanel.updateBtn();
        }
    }

    protected updateSubView():void {
        this.checkRoleItemRedTip();
        this.setRoleIndex(this.roleItemPanel.getFirstFuncRedTip());
    }

    private setRoleIndex(index:number):void {
        this.roleIndex = index;
        this.roleItemPanel.selectedIndex = index;
        if(!this.curPanel) return;
        (this.curPanel as ForgeBaseTabPanel).roleIndex = index;
        
        this.updateFight();
        this.onPropUpdate();
    }   

    private onRoleIndexChanged(index: number, data: any): void {
        this.setRoleIndex(index);
    }

    /**
     * 更新战斗力
     */
    public updateFight(): void {
        if(this.isTypePanel(PanelTabType.Immortals)){            
            this.fightPanel.updateValue((<ForgeImmortalsPanel>this.curPanel).fight);
            return;
        }
        let type:EStrengthenExType = this.forgeTypes[this.curIndex];
        if(type == null) return;
        let level: number = CacheManager.role.getPlayerStrengthenExLevel(type, this.roleIndex);
        let cfg: any = ConfigManager.mgStrengthenEx.getByTypeAndLevel(type, level);

        let attrDict: any;
        let fight: number = 0;
        if (cfg != null) {
            fight = WeaponUtil.getCombat(WeaponUtil.getAttrDict(cfg.attrList))
        }
        fight = CacheManager.role.getPlayerStrengthenWarfare(type, this.roleIndex);
        this.fightPanel.updateValue(fight);
    }

    /**检测角色头像红点 */
    private checkRoleItemRedTip(): void {
        if(!this.roleItemPanel.listData) return;
        let type:EStrengthenExType = this.forgeTypes[this.curIndex];
        //if(type == null) return;
        let index: number;
        for (let data of this.roleItemPanel.listData) {
            index = data["index"];
            if (data["role"] != null) {
                let isTip:boolean;
                if(type!=null){
                    isTip = CacheManager.role.isCanUpgradeStrengthenEx(type, index);
                }else{
                    isTip = CacheManager.forgeImmortals.checkRoleTip(index);
                }
                this.roleItemPanel.setRoleRedTip(index,isTip);
            }
        }
    }

    private checkAllTabBtn():void {
        for(let i:number = 0; i < this.tabTypes.length; i ++) {
            if(this.tabTypes[i]==PanelTabType.Immortals){
                this.setBtnTips(this.tabTypes[i],CacheManager.forgeImmortals.checkTip());
            }
            else{
                this.setBtnTips(this.tabTypes[i], this.checkTabBtnTips(this.forgeTypes[i]));
            }

        }
    }

    /**检测页签按钮红点 */
    private checkTabBtnTips(type:EStrengthenExType):boolean {
        if(type == null) return false;
        for (let data of this.roleItemPanel.listData) {
            if (data["role"] != null) {
                if(CacheManager.role.isCanUpgradeStrengthenEx(type, data.index)) return true;
            }
        }
        return false;
    }

    public hide():void {
        super.hide();
        this.roleIndex = this.roleItemPanel.selectedIndex = 0;
    }





}