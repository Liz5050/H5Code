class SkillModule2 extends BaseTabModule {

    private roleItemPanel: RoleItemPanel;
    private roleIndex: number = 0;
    private forgeTypes:EStrengthenExType[];
	public constructor() {
		super(ModuleEnum.Skill, PackNameEnum.Skill);
	}

	public initOptUI():void {
		super.initOptUI();
		this.className = {
            [PanelTabType.Skill]:["SkillPanel",SkillPanel],
            [PanelTabType.TrainGodWeapon]:["GodWeaponPanel",GodWeaponPanel,PackNameEnum.TrainGodWeaponPanel],
            [PanelTabType.InnerPower]:["InnerPowerPanel",InnerPowerPanel,PackNameEnum.InnerPower],
            [PanelTabType.Nerve]:["NervePanel",NervePanel],
            [PanelTabType.SkillCheats]:["SkillCheatsPanel",SkillCheatsPanel,PackNameEnum.SkillCheats]
        }

		this.roleItemPanel = <RoleItemPanel>this.getGObject("PlayerRole");
        this.roleItemPanel.setSelectChangedFun(this.onRoleSelectChanged, this);
		this.forgeTypes = [null,null,EStrengthenExType.EStrengthenExTypeInternalForce,EStrengthenExType.EStrengthenExTypeNerve];

        //注册标签页
		let tabButtonItem: TabButtonItem;
		let panelTypeType: PanelTabType;
		let targetName: string = GuideTargetName.SkillModule2SkillTab;
		for(let item of this.tabBtnList.list._children) {
			tabButtonItem = item as TabButtonItem;
			panelTypeType = tabButtonItem.data;
			if (panelTypeType == PanelTabType.InnerPower) {
				targetName = GuideTargetName.SkillModule2InnerPowerTab;
			}
			GuideTargetManager.reg(targetName, item);
		}
	}


	public updateAll(): void {
		this.roleIndex = 0;
        this.roleItemPanel.updateRoles();
        this.checkAllTabBtn();
        // this.setIndex(PanelTabType.Skill);
	}
    public updateGodWeapon():void{
        if(this.isTypePanel(PanelTabType.TrainGodWeapon)){
            this.curPanel.updateAll();
            App.SoundManager.playEffect(SoundName.Effect_QiangHuaChengGong);
        }
        this.updateGodWeaponTips();
    }

    public onStrengthenExUpdated(info: SUpgradeStrengthenEx): void {
        if (this.isTypePanel(PanelTabType.Nerve)) {
            this.curPanel["updateAll"]();
            this.checkRoleItemRedTip();
            this.setBtnTips(PanelTabType.Nerve, this.checkTabBtnTips(EStrengthenExType.EStrengthenExTypeNerve));
        }else if(info.type == EStrengthenExType.EStrengthenExTypeInternalForce && this.curPanel instanceof InnerPowerPanel){
            this.curPanel.updateBySUpgradeStrengthenEx(info);
            this.checkRoleItemRedTip();
            this.setBtnTips(PanelTabType.InnerPower, this.checkTabBtnTips(EStrengthenExType.EStrengthenExTypeInternalForce));
        }
    }

    /**
     * 激活成功
     */
    public onnStrengthenExActived(info: SUpgradeStrengthenEx): void {
        if (this.curPanel instanceof InnerPowerPanel) {
            this.curPanel.updateBySUpgradeStrengthenEx(info);
        }
        // this.checkRedTip();
    }

    private updateGodWeaponTips():void{
        this.setBtnTips(PanelTabType.TrainGodWeapon,CacheManager.godWeapon.checkTips());
    }

    /**
     * tab标签切换
     */
	protected onSelectBtnChange(): void {
		super.onSelectBtnChange();
	}

    protected updateSubView():void {
        this.checkRoleItemRedTip();
        this.setRoleIndex(this.getRedTipRoleIndex());
        this.roleItemPanel.visible = this.curType!=PanelTabType.TrainGodWeapon;
	}

    private setRoleIndex(index:number):void {
        this.roleIndex = index;
        this.roleItemPanel.selectedIndex = index;
		if(this.curPanel) {
			this.curPanel["roleIndex"] = index;
		}
        // this.onPropUpdate();
    }

    private getRedTipRoleIndex():number {
	    return this.roleItemPanel.getFirstFuncRedTip();
    }

    public onPropUpdate(): void {
        if (this.isTypePanel(PanelTabType.Nerve)) {
            this.curPanel["updateProp"]();
        }
        this.checkRoleItemRedTip();
        this.checkAllTabBtn();
    }

    public updateSkillOne(skillData: SkillData):void {
        if(this.curPanel instanceof SkillPanel){
            this.curPanel.updateUpdateSkillOne(skillData);
        }
    }
    public updateCheats():void{
        if(this.isTypePanel(PanelTabType.SkillCheats)){
            (<SkillCheatsPanel>this.curPanel).updateAll();
        }
    }
    public updateByEmbed(data:any):void{
        if(this.isTypePanel(PanelTabType.SkillCheats)){
            (<SkillCheatsPanel>this.curPanel).updateByEmbed(data);
        }
    }
    public addCheatEmbedItem(itemData:ItemData):void{
        if(this.isTypePanel(PanelTabType.SkillCheats)){
            (<SkillCheatsPanel>this.curPanel).addCheatEmbedItem(itemData);
        }
    }
    
    private onRoleSelectChanged(index: number, data: any): void {
        this.setRoleIndex(index);
    }

    public updateMoney(): void {
        super.updateMoney();
        if (this.isTypePanel(PanelTabType.Skill)) {
        	this.curPanel["updateListCostAndStatus"]();
		}else if (this.curPanel instanceof InnerPowerPanel) {
            // this.curPanel["updateMoney"]();
            this.curPanel.updateMoney();
        }
        this.checkRoleItemRedTip();
        this.checkAllTabBtn();
    }

    /**技能红点 */
    public updateSkillBtnTips(): void {
        if(!this.isTypePanel(PanelTabType.Skill)) return;
		this.setBtnTips(PanelTabType.Skill,CacheManager.skill.checkTips());
        // CommonUtils.setBtnTips(this.tab, CacheManager.skill.checkTips());
        for (let i = 0; i < 3; i++) {
            this.roleItemPanel.setRoleRedTip(i, CacheManager.skill.checkTips(i));
        }
    }

    /**检测角色头像红点 */
    private checkRoleItemRedTip(): void {
        if(!this.roleItemPanel.listData || !this.curPanel || !this.curPanel.isOpen()) return;
        if(this.isTypePanel(PanelTabType.Skill)) {
            this.updateSkillBtnTips();
            return;
        }
        
        let type:EStrengthenExType = this.forgeTypes[this.curIndex];
        let index: number;
        for (let data of this.roleItemPanel.listData) {
            index = data["index"];
            if (data["role"] != null) {
                
                let isTip: boolean = false;
                if(this.isTypePanel(PanelTabType.SkillCheats)) {
                    isTip = CacheManager.cheats.checkRoleTips(index);
                }else if(this.isTypePanel(PanelTabType.TrainGodWeapon)){
                    isTip = CacheManager.godWeapon.checkTips();
                }
                else {
                    if(type == EStrengthenExType.EStrengthenExTypeInternalForce){
                        isTip = CacheManager.role.isStrengthenExCanActive(type, index);
                    }
                    isTip = isTip || CacheManager.role.isCanUpgradeStrengthenEx(type, index);
                }

                this.roleItemPanel.setRoleRedTip(index, isTip);
            }
        }
    }

    private checkAllTabBtn():void {
        this.updateGodWeaponTips();
        this.setBtnTips(PanelTabType.Skill,CacheManager.skill.checkTips());
        for(let i:number = 0; i < this.tabTypes.length; i ++) {
            if(this.tabTypes[i] == PanelTabType.Skill || this.tabTypes[i] == PanelTabType.TrainGodWeapon) continue;
            if(this.tabTypes[i] == PanelTabType.SkillCheats){ //秘籍
                this.setBtnTips(this.tabTypes[i],CacheManager.cheats.checkTips());
                continue;
            }
			this.setBtnTips(this.tabTypes[i],this.checkTabBtnTips(this.forgeTypes[i]));
        }
    }

    /**检测页签按钮红点 */
    private checkTabBtnTips(type:EStrengthenExType):boolean {
        if(type == null) return false;
        for (let data of this.roleItemPanel.listData) {
            if (data["role"] != null) {
                let isTip: boolean = false;
                if(type == EStrengthenExType.EStrengthenExTypeInternalForce){
                    isTip = CacheManager.role.isStrengthenExCanActive(type, data.index);
                }
                isTip = isTip || CacheManager.role.isCanUpgradeStrengthenEx(type, data.index);
                if(isTip) return true;
            }
        }
        return false;
        
    }

    public onCheckPointUpdate():void{
        if(this.curPanel instanceof InnerPowerPanel){
            this.curPanel.updateBtn();
        }
    }

   

    public hide():void {
        super.hide();
        // this.curIndex = -1;
        this.roleIndex = this.roleItemPanel.selectedIndex = 0;
    }
}