class PlayerModule extends BaseTabModule {
	private c1: fairygui.Controller;
	private roleItemPanel: RoleItemPanel;

	public constructor() {
		super(ModuleEnum.Player, PackNameEnum.Player);
	}

	public initOptUI(): void {
		super.initOptUI();
		this.c1 = this.getController("c1");
		this.roleItemPanel = <RoleItemPanel>this.getGObject("panel_roleItem");
		this.roleItemPanel.setSelectChangedFun(this.onRoleIndexChanged, this);
		this.className = { 
			[PanelTabType.Player]:["PlayerPanel", PlayerPanel],
			[PanelTabType.UniqueSkill]:["UniqueSkillPanel", UniqueSkillPanel, PackNameEnum.UniqueSkill],
			[PanelTabType.RoleState]:["ReincarnationPanel", ReincarnationPanel, PackNameEnum.Reincarnation]
		};

        //注册标签页
		let tabButtonItem: TabButtonItem;
		let panelTypeType: PanelTabType;
		let targetName: string = null;
		for(let item of this.tabBtnList.list._children) {
			tabButtonItem = item as TabButtonItem;
            panelTypeType = tabButtonItem.getData();
			if (panelTypeType == PanelTabType.RoleState) {
				targetName = GuideTargetName.PlayerModuleReincarnationTab;
			} else {
                targetName = null;
            }
            if (targetName) {
			    GuideTargetManager.reg(targetName, item);
            }
		}
	}

	//根据缓存更新
	public updateAll(): void {
		this.updateAllBtnTips();
	}

	protected updateSubView(): void {
		this.c1.selectedIndex = this.curIndex;
	}

	/**更新战力 */
	public updateFight(): void {
		if (this.isTypePanel(PanelTabType.Player)) {
			(this.curPanel as PlayerPanel).updateFight();
		}
	}

	/**更新角色等级 */
	public updateLevel(): void {
		if (this.isTypePanel(PanelTabType.RoleState)) {
			let panel: ReincarnationPanel = this.curPanel as ReincarnationPanel;
			panel.checkTips();
		}
		this.updateReincarnationTips();
	}

	/**更新装备 */
	public updateEquips(isReplace: boolean = false): void {
		if (this.isTypePanel(PanelTabType.Player)) {
			let panel: PlayerPanel = this.curPanel as PlayerPanel;
			panel.updateEquips(isReplace);
			panel.updateGodEquipTips();
		}
	}

	public setReplaceEquipEff(item: ItemData): void {
		if (this.isTypePanel(PanelTabType.Player) && this.curPanel instanceof PlayerPanel) {
			let panel: PlayerPanel = this.curPanel as PlayerPanel;
			panel.setReplaceEff(item);
		}
	}

	/**符文更新 */
	public updateRuneTips(): void {
		if (this.isTypePanel(PanelTabType.Player)) {
			let panel: PlayerPanel = this.curPanel as PlayerPanel;
			panel.updateRuneTips();
		}
		this.updatePlayerPanelTips();
	}

	public magicWeaponUpdate(): void {
		if (this.isTypePanel(PanelTabType.Player)) {
			let panel: PlayerPanel = this.curPanel as PlayerPanel;
			panel.updateMagicWeaponTips();
		}
		this.updatePlayerPanelTips();
	}

	public playerCopyUpdate():void{
		if (this.isTypePanel(PanelTabType.Player)) {
			let panel: PlayerPanel = this.curPanel as PlayerPanel;
			panel.updateMagicWeaponTips();
		}
		this.updatePlayerPanelTips();
	}

	/**更新金钱 */
	public updateBeastEquipExp(): void{
		if(this.curPanel instanceof PlayerPanel){
			this.curPanel.updateMoney();
		}
		this.updatePlayerPanelTips();
	}

	/**道具背包改变 */
	public onPropPackChange(): void {
		if (this.isTypePanel(PanelTabType.Player)) {
			let panel: PlayerPanel = this.curPanel as PlayerPanel;
			panel.updateGodEquipTips();
			panel.updateMagicWareTips();
			panel.updateRuneTips();
			panel.updateFashionTips();
			panel.updateChuanshiTips();
		}
		else if (this.isTypePanel(PanelTabType.RoleState)) {
			let panel: ReincarnationPanel = this.curPanel as ReincarnationPanel;
			panel.checkTips();
		}
		this.updateAllBtnTips();
	}

	/**物品使用次数更新 */
	public onUsedNumUpdate(): void {
		if (this.isTypePanel(PanelTabType.RoleState)) {
			let panel: ReincarnationPanel = this.curPanel as ReincarnationPanel;
			panel.checkTips();
		}
		this.updateReincarnationTips();
	}

	/**修为更新 */
	public updateStateValue(): void {
		if (this.isTypePanel(PanelTabType.RoleState)) {
			(this.curPanel as ReincarnationPanel).updateStateValue();
		}
		this.updateReincarnationTips();
	}

	/**转生等级更新 */
	public updateRoleStateLevel(): void {
		if (this.isTypePanel(PanelTabType.RoleState)) {
			(this.curPanel as ReincarnationPanel).updateRoleStateLevel();
		}
		this.updateUniqueSkillTips();
		this.updateReincarnationTips();
	}

	/**更新所有页签按钮红点 */
	private updateAllBtnTips(): void {
		this.updatePlayerPanelTips();
		this.updateUniqueSkillTips();
		this.updateReincarnationTips();
	}

	/**转生红点 */
	public updateReincarnationTips(): void {
		let flag: boolean = CacheManager.player.checkReincarnationTips();
		this.setBtnTips(PanelTabType.RoleState, flag);
	}

	/**角色红点 */
	public updatePlayerPanelTips(): void {
		this.setBtnTips(PanelTabType.Player, CacheManager.player.checkPlayerTip());
	}

	/**必杀红点 */
	public updateUniqueSkillTips(): void {
		this.setBtnTips(PanelTabType.UniqueSkill, CacheManager.uniqueSkill.checkBtnTip());
	}

	/**
	 * 更新人物模型
	 */
	public updatePlayerModel(attr: EEntityAttribute): void {
		if (this.isTypePanel(PanelTabType.Player)) {
			(this.curPanel as PlayerPanel).updateModelByType(attr);
		}
	}

	/**
     * 强化成功
     */
	public onStrengthenExUpgraded(info: SUpgradeStrengthenEx): void {
		this.updateMagicWareTips();
	}

	/**
     * 强化信息更新
     */
	public onStrengthenExUpdated(data: any = null): void {
		this.updateMagicWareTips();
	}

	public onHeartMethodUpData() : void {
		this.updateMagicWareTips();
	}

	/**
     * 激活成功
     */
	public onnStrengthenExActived(info: SUpgradeStrengthenEx): void {
		this.updateMagicWareTips();
	}

	/**更新法器红点 */
	private updateMagicWareTips(): void {
		if (this.curPanel instanceof PlayerPanel) {
			this.curPanel.updateMagicWareTips();
		}
		this.updatePlayerPanelTips();
	}

	public updateMagicWeaponTips() : void {
		if(this.curPanel instanceof PlayerPanel) {
			this.curPanel.updateMagicWeaponTips();
		}
		this.updatePlayerPanelTips();
	}

	private onRoleIndexChanged(index: number, data: any): void {

	}
}