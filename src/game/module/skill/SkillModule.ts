class SkillModule extends BaseModule {
	private controller:fairygui.Controller;
	private skillPanel:SkillPanel;
    private nervePanel:NervePanel;

    private roleItemPanel: RoleItemPanel;
    private roleIndex: number = 0;
    private skillTabBtn: fairygui.GButton;

    private curIndex:number = -1;
    private forgeTypes:EStrengthenExType[];
    private tabBtns:fairygui.GButton[];
	public constructor() {
		super(ModuleEnum.Skill, PackNameEnum.Skill);
	}

	public initOptUI(): void {
        this.skillTabBtn = this.getGObject("btn_skill").asButton;
        this.forgeTypes = [null,null,EStrengthenExType.EStrengthenExTypeNerve];
        this.tabBtns = [this.skillTabBtn,this.getGObject("btn_internalWork").asButton,this.getGObject("btn_meridian").asButton];

		this.controller = this.getController("c1");
        this.controller.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onTabChanged, this);

        // this.skillPanel = new SkillPanel(this.getGObject("panel_skill").asCom,this.controller,0);
        // this.nervePanel = new NervePanel(this.getGObject("Meridian").asCom,this.controller,2);

        this.roleItemPanel = <RoleItemPanel>this.getGObject("PlayerRole");
        this.roleItemPanel.setSelectChangedFun(this.onRoleSelectChanged, this);

	}

	public updateAll(): void {
		this.roleIndex = 0;
        this.roleItemPanel.updateRoles();
		// this.controller.selectedIndex = 0;
		// this.skillPanel.updateAll(0);
		// this.updateBtnTips();
        this.setIndex(0);
	}

    public onStrengthenExUpdated(info: SUpgradeStrengthenEx): void {
        if (this.controller.selectedIndex == 2) {
            this.nervePanel.updateAll();
        }
    }

    private onTabChanged(e: any): void {
        this.setIndex(this.controller.selectedIndex);
    }

    private setIndex(index:number):void {
        if(this.curIndex == index) return;
        if(this.curIndex != -1) {
            //clear
        }
        this.curIndex = index;
        //改变索引，不发事件
        this.controller.setSelectedIndex(index);
        this.setRoleIndex(this.roleIndex);
    }

    private setRoleIndex(index:number):void {
        this.roleIndex = index;
        this.roleItemPanel.selectedIndex = index;
        if (this.controller.selectedIndex == 0) {
            this.skillPanel.roleIndex = index;
        }
        else if(this.controller.selectedIndex == 2){
            this.nervePanel.roleIndex = index;
        }
        // this.updateFight();
        this.onPropUpdate();
    }

    public onPropUpdate(): void {
        if (this.controller.selectedIndex == 2) {
            this.nervePanel.updateProp();
        }
        this.checkRoleItemRedTip();
        this.checkAllTabBtn();
    }

    public updateSkillOne(skillData: SkillData):void {
        if (this.controller.selectedIndex == 0) {
            this.skillPanel.updateUpdateSkillOne(skillData);
        }
    }

    private onRoleSelectChanged(index: number, data: any): void {
        this.setRoleIndex(index);
        // this.skillPanel.updateAll(index);
    }

    public updateMoney(): void {
        super.updateMoney();
        if (this.controller.selectedIndex == 0) {
        	this.skillPanel.updateListCostAndStatus();
		}
    }

    /**技能红点 */
    public updateBtnTips(): void {
        if(this.controller.selectedIndex != 0) return;
        CommonUtils.setBtnTips(this.skillTabBtn, CacheManager.skill.checkTips());
        for (let i = 0; i < 3; i++) {
            this.roleItemPanel.setRoleRedTip(i, CacheManager.skill.checkTips(i));
        }
    }

    /**检测角色头像红点 */
    private checkRoleItemRedTip(): void {
        if(!this.roleItemPanel.listData) return;
        if(this.controller.selectedIndex == 0) {
            this.updateBtnTips();
            return;
        }
        let type:EStrengthenExType = this.forgeTypes[this.controller.selectedIndex];
        if(type == null) return;
        let index: number;
        for (let data of this.roleItemPanel.listData) {
            index = data["index"];
            if (data["role"] != null) {
                this.roleItemPanel.setRoleRedTip(index, CacheManager.role.isCanUpgradeStrengthenEx(type, index));
            }
        }
    }

    private checkAllTabBtn():void {
        CommonUtils.setBtnTips(this.skillTabBtn, CacheManager.skill.checkTips());
        for(let i:number = 0; i < this.forgeTypes.length; i ++) {
            if(!this.forgeTypes[i]) continue;
            CommonUtils.setBtnTips(this.tabBtns[i], this.checkTabBtnTips(this.forgeTypes[i]));
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
        this.curIndex = -1;
        this.roleIndex = this.roleItemPanel.selectedIndex = 0;
    }
}