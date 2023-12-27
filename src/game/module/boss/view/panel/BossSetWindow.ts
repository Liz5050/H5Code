class BossSetWindow extends BaseWindow {
	private listBoss:List;
	// private autoFightBtn:fairygui.GButton;
    // private c1: fairygui.Controller;
	private copyCode:number;
    // private openPrivilegeBtn: fairygui.GButton;
	public constructor() {
		super(PackNameEnum.Boss,"WindowBossSet");
	}

	public initOptUI():void {
        // this.c1 = this.getController("c1");
		this.listBoss = new List(this.getGObject("list_boss").asList);
		// this.autoFightBtn = this.getGObject("btn_check").asButton;
		// this.autoFightBtn.addEventListener(fairygui.StateChangeEvent.CHANGED,this.onChangeHandler,this);
        // this.openPrivilegeBtn = this.getGObject("btn_privilege").asButton;
        // this.openPrivilegeBtn.addClickListener(this.onOpenPrivilege, this);
    }
	
	public updateAll(copyCode:number):void {
		this.copyCode = copyCode;
		let bossList: any[];
		if(copyCode == CopyEnum.QiongCangBoss) {
			bossList = ConfigManager.mgGameBoss.getQiongCangBossList();
		}
		else {
			bossList = ConfigManager.mgGameBoss.getByCopyCode(copyCode);
		}
		let copyCfg:any = ConfigManager.copy.getByPk(copyCode);
        this.listBoss.setVirtual(bossList);
		// this.checkAutoState();
		// this.c1.selectedIndex = CacheManager.welfare2.isPrivilegeCard && copyCfg.copyType == ECopyType.ECopyMgNewWorldBoss ? 1 : 0;
		// this.openPrivilegeBtn.visible = copyCfg.copyType == ECopyType.ECopyMgNewWorldBoss && this.c1.selectedIndex == 0;
	}

	// private onChangeHandler():void {
	// 	if(this.copyCode == CopyEnum.CopyWorldBoss) {
	// 		CacheManager.bossNew.autoFight = this.autoFightBtn.selected;
	// 	}
	// 	else if(this.copyCode == CopyEnum.CopyGodBoss) {
	// 		CacheManager.bossNew.autoFight2 = this.autoFightBtn.selected;
	// 	}
	// 	if(CacheManager.bossNew.autoFight || CacheManager.bossNew.autoFight2) {
	// 		egret.setTimeout(function(){
	// 			if(CacheManager.bossNew.autoFight || CacheManager.bossNew.autoFight2) {
	// 				EventManager.dispatch(LocalEventEnum.WorldBossAutoFight);
	// 			}
	// 		},this,2000);
	// 	}
	// }

	// private checkAutoState():void {
	// 	if(this.copyCode == CopyEnum.CopyWorldBoss) {
	// 		this.autoFightBtn.selected = CacheManager.bossNew.autoFight;
	// 	}
	// 	else if(this.copyCode == CopyEnum.CopyGodBoss) {
	// 		this.autoFightBtn.selected = CacheManager.bossNew.autoFight2;
	// 	}
	// }

    private onOpenPrivilege() {
        HomeUtil.open(ModuleEnum.Welfare2, false, {tabType: PanelTabType.PrivilegeCard});
        this.hide();
    }
}