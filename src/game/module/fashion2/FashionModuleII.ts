class FashionModuleII extends BaseTabModule {
	// private bgLoader:GLoader;
	private rolePanel:RoleItemPanel;
	private roleIndex:number = -1;
	private fashionTypes: EFashionType[];

	public constructor(moduleId:ModuleEnum) {
		super(moduleId,PackNameEnum.FashionII);
	}

	public initOptUI():void {
		super.initOptUI();
		// this.bgLoader = this.getGObject("loader_bg") as GLoader;
		// this.bgLoader.load(URLManager.getModuleImgUrl("bg.jpg",PackNameEnum.FashionII));
		this.rolePanel = this.getGObject("panel_roleItem") as RoleItemPanel;
		this.rolePanel.setSelectChangedFun(this.onRoleIndexChanged, this);

		this.className = {
			[PanelTabType.FashionClothes]:["FashionPlayerPanel",FashionPlayerPanel,PackNameEnum.FashionPlayer],
			[PanelTabType.FashionWeapon]:["FashionPlayerPanel",FashionPlayerPanel,PackNameEnum.FashionPlayer],
			[PanelTabType.FashionWing]:["FashionPlayerPanel",FashionPlayerPanel,PackNameEnum.FashionPlayer],
			[PanelTabType.FashionTitle]:["FashionTitlePanel",FashionTitlePanel,PackNameEnum.FashionTitle]
		};

		this.fashionTypes = [EFashionType.EFashionClothes, EFashionType.EFashionWeapon, EFashionType.EFashionWing, null];
	}

	public updateAll():void {
		CacheManager.fashionPlayer.resetPlayerModel();
		this.rolePanel.updateRoles();
        this.roleIndex = this.rolePanel.selectedIndex;
		this.checkRedTip();
		this.updateSubView();
	}

	public updateTitleState():void {
		if(this.isTypePanel(PanelTabType.FashionTitle)) {
			this.curPanel.updateTitleState();
		}
	}

	public updateFashionInfo(): void{
		if(this.curPanel instanceof FashionPlayerPanel){
			this.curPanel.updateFashionInfo();
		}
		this.checkRedTip();
	}

	private onRoleIndexChanged(index: number, data: any):void {
		this.setRoleIndex(index);
	}

	protected updateSubView():void {
		this.checkRoleItemRedTip();
		this.roleIndex = this.rolePanel.getFirstFuncRedTip();
        this.setRoleIndex(this.roleIndex, true);
		if(this.curPanel instanceof FashionTitlePanel){
			this.tabBgType = TabBgType.None;
		}else{
			this.tabBgType = TabBgType.High;
		}
	}

	protected changeTitle():void {
		if(this.curType != PanelTabType.FashionTitle) {
			this.title = ModuleEnum[this.moduleId];
		}
		else {
			this.title = PanelTabType[this.curType];
		}
	}

	protected setRoleIndex(index:number,tabTypeChange:boolean = false):void {
		if(this.roleIndex == index && !tabTypeChange) return;
		if(this.roleIndex != -1) {
			//清理
		}
		this.roleIndex = index;
		this.rolePanel.selectedIndex = index;
		//更新对应角色视图
		if(this.curPanel) {
			this.curPanel.roleIndex = index;
		}
		this.checkRedTip();
	}

	/**检测角色头像红点 */
    private checkRoleItemRedTip(): void {
        if (!this.rolePanel.listData) return;
        let type: EFashionType = this.fashionTypes[this.curIndex];
        if (type == null) return;
        let index: number;
        for (let data of this.rolePanel.listData) {
            index = data["index"];
            if (data["role"] != null) {
                let isTip: boolean = CacheManager.fashionPlayer.checkTipsByIndexAndType(index, type);
                this.rolePanel.setRoleRedTip(index, isTip);
            }
        }
    }

    /**检测标签页红点 */
    private checkTabBtnRedTip(): void {
        for (let i: number = 0; i < this.fashionTypes.length; i++) {
            let type: EFashionType = this.fashionTypes[i];
			if (type == null) continue;
            let isTip: boolean = CacheManager.fashionPlayer.checkTipsByType(type);
            this.setBtnTips(this.tabTypes[i], isTip);
        }
    }

    private checkRedTip(): void {
        this.checkRoleItemRedTip();
        this.checkTabBtnRedTip();
    }

	public hide():void {
		super.hide();
		this.roleIndex = -1;
	}
}