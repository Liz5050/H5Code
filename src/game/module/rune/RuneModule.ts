/**
 * 符文
 */
class RuneModule extends BaseTabModule{
	private roleItemPanel: RoleItemPanel; 
	private roleIndex: number = 0;

	public constructor() {
		super(ModuleEnum.Rune, PackNameEnum.Rune);
	}

	public initOptUI(): void{
		super.initOptUI();
		this.indexTitle = false;
		this.className = {
			[PanelTabType.RuneInlay]:["RuneInlayPanel",RuneInlayPanel],
			[PanelTabType.RuneDecompose]:["RuneDecomposePanel",RuneDecomposePanel]
		};

		this.roleItemPanel = <RoleItemPanel>this.getGObject("RoleItemPanel");
        this.roleItemPanel.setSelectChangedFun(this.onRoleSelectChanged, this);

		GuideTargetManager.reg(GuideTargetName.RuneDecomposeTab, this.getGObject("btn_inlay"));
		GuideTargetManager.reg(GuideTargetName.RuneCloseBtn, this.closeObj);
	}

	public updateAll(): void{
		this.roleItemPanel.updateRoles();
        this.roleIndex = this.roleItemPanel.selectedIndex;
		// this.updateRoleItemVisible();
		this.updateBtnTip();
	}

	public updateBtnTip(): void{
		this.setBtnTips(PanelTabType.RuneInlay, CacheManager.rune.checkTips());
		this.checkRoleItemRedTip();
		
	}

    protected updateSubView():void {
		this.checkRoleItemRedTip();
		this.roleIndex = this.roleItemPanel.getFirstFuncRedTip();
        this.setRoleIndex(this.roleIndex);
		if(this.curPanel instanceof RuneDecomposePanel){
			this.tabBgType = TabBgType.High;
		}else{
			this.tabBgType = TabBgType.Default;
		}
	}

	/**检测角色头像红点 */
    private checkRoleItemRedTip(): void {
        if (!this.roleItemPanel.listData) return;
        let index: number;
        for (let data of this.roleItemPanel.listData) {
            index = data["index"];
            if (data["role"] != null) {
                let isTip: boolean = CacheManager.rune.checkRoleTips(index);
                this.roleItemPanel.setRoleRedTip(index, isTip);
            }
        }
    }

	/**
    //  * tab标签切换
    //  */
	// protected onSelectBtnChange(): void {
	// 	super.onSelectBtnChange();
	// 	this.updateRoleItemVisible();
	// }

	// private updateRoleItemVisible(): void{
	// 	if(this.curPanel instanceof RuneDecomposePanel){
	// 		// this.roleItemPanel.visible = false;
	// 		this.controller.selectedIndex = 1;
	// 	}else{
	// 		// this.roleItemPanel.visible = true;
	// 		this.controller.selectedIndex = 0;
	// 	}
	// }

	private onRoleSelectChanged(index: number, data: any): void {
        this.setRoleIndex(index);
    }

	private setRoleIndex(index: number): void {
        this.roleIndex = index;
        this.roleItemPanel.selectedIndex = index;
		if(this.curPanel) {
			this.curPanel["roleIndex"] = index;
		}
    }

	// private setIndex(index: number): void {
    //     if (this.curIndex == index) return;
    //     if (this.curIndex != -1) {
    //         //清理上个索引的界面内容
    //     }
    //     this.curIndex = index;
    //     //仅改变按钮状态，不发事件
    //     this.controller.setSelectedIndex(index);
    //     this.setRoleIndex(this.roleIndex);
    // }

	/**更新符文镶嵌 */
	public updataRuneInlay(): void{
		if(this.curPanel instanceof RuneInlayPanel){
			this.curPanel.updateRune();
		}
		this.updateBtnTip();
	}

	/**背包更新，符文分解 */
	public updataRuneDecompose(): void{
		if(this.curPanel instanceof RuneDecomposePanel){
			this.curPanel.updateDecompose();
		}else if(this.curPanel instanceof RuneInlayPanel){
			this.curPanel.updateRune();
		}
		this.updateBtnTip();
	}

	public hide(): void {
        super.hide();
        this.curIndex = -1;
        this.roleIndex = this.roleItemPanel.selectedIndex = 0;
    }
}