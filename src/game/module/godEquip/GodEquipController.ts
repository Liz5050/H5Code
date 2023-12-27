/**
 * 神装
 */

class GodEquipController extends BaseController{
	private module: GodEquipModule;
	private godEquipDecomposeWindow: GodEquipDecomposeWindow;
	private shuraDecomposeWindow: ShuraDecomposeWindow;

	public constructor() {
		super(ModuleEnum.GodEquip);
		this.viewIndex = ViewIndex.Two;
	}

	public initView(): BaseGUIView {
		this.module = new GodEquipModule(this.moduleId);
		return this.module;
	}

	public addListenerOnInit(): void{
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGenerateGodEquip], this.onGenerateGodEquip, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameUpgradeGodEquip], this.onUpgradeGodEquip, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameDecomposeGodEquip], this.onDecomposeGodEquip, this);
		// this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetGenerateGodEquip], this.onGetGenerateGodEquip, this);


		// this.addListen0(LocalEventEnum.GetGenerateGodEquip,this.onGetGenerateGodEquipHandler,this);
		this.addListen0(NetEventEnum.packRolePackItemsChange, this.updateGodEquip, this);
		this.addListen0(NetEventEnum.packPosTypeRoleChange, this.updateGodEquip, this);
		this.addListen0(NetEventEnum.roleLevelUpdate, this.onRoleLevelUpdate, this);
		this.addListen0(NetEventEnum.roleCareerChanged, this.onRoleLevelUpdate, this);
		this.addListen0(LocalEventEnum.PlayerNewRoleUpdated, this.onOpenNewRole, this);

	}

	public addListenerOnShow(): void {
		this.addListen1(UIEventEnum.GodEquipDecomposeOpen, this.godEquipDecomposeOpen, this);
		this.addListen1(UIEventEnum.ShuraDecomposeOpen, this.shuraDecomposeOpen, this);
		this.addListen1(NetEventEnum.packPosTypePropChange, this.updateGodEquip, this);
		this.addListen1(NetEventEnum.packBackPackItemsChange, this.updatePackEquip, this);
	}

	// public onGetGenerateGodEquipHandler(index: number, type: number): void{
	// 	ProxyManager.godEquip.getGenerateGodEquip(index, type);
	// }

	private updatePackEquip(): void{
		if(this.module && this.module.isShow){
			this.module.updateDecomposeTips();
		}
	}

	private updateGodEquip(posTypes: number): void{
		if(posTypes){
			CacheManager.godEquip.setEquipByIndex(posTypes);
			CacheManager.shura.setEquipByIndex(posTypes);
		}else{
			CacheManager.godEquip.setEquips();
			CacheManager.shura.setEquips();
		}
		if(this.module && this.module.isShow){
			this.module.updateGodEquip();
		}
		if(this.shuraDecomposeWindow && this.shuraDecomposeWindow.isShow){
			this.shuraDecomposeWindow.updateAll();
		}
	}

	private onRoleLevelUpdate(): void{
		CacheManager.godEquip.setEquips();
		CacheManager.shura.setEquips();
		if(this.module && this.module.isShow){
			this.module.updateGodEquip();
		}
	}
	
	private onOpenNewRole(): void{
		CacheManager.godEquip.setEquips();
		if(this.module && this.module.isShow){
			this.module.updateGodEquip();
		}
	}

	private onGenerateGodEquip(data: any): void{
		// Tip.showTip("合成成功");
		Tip.addTip("合成成功，已自动穿戴至身上");
		if(this.module.isShow && data){
			this.module.onGenerateSuccess(data.type);
		}
	}

	private onUpgradeGodEquip(data: any): void{
		// Tip.showTip("升级成功");
		Tip.addTip("合成成功，已自动穿戴至身上");
		if(this.module.isShow && data){
			this.module.onGenerateSuccess(data.type);
		}
	}

	private onDecomposeGodEquip(data: any): void{
		if(data.uids.length > 0 && this.godEquipDecomposeWindow.isShow){
 			this.godEquipDecomposeWindow.updateItemDatas(data.uids[0]);
		}
		// if(this.module && this.module.isShow){
		// 	this.module.updateGetFragment(data.rewardAmount);
		// }
	}

	private godEquipDecomposeOpen(): any{
		if (!this.godEquipDecomposeWindow) {
			this.godEquipDecomposeWindow = new GodEquipDecomposeWindow();
		}
		this.godEquipDecomposeWindow.show();
	}

	private shuraDecomposeOpen(): any{
		if (!this.shuraDecomposeWindow) {
			this.shuraDecomposeWindow = new ShuraDecomposeWindow();
		}
		this.shuraDecomposeWindow.show();
	}

	// private onGetGenerateGodEquip(data: any): void{
	// 	if(data.itemWeaponCode){
	// 		// CacheManager.godEquip.updateEquip(data.itemWeaponCode);
	// 		if(this.isShow){
	// 			this.module.updateGenerateGodEquip(data.itemWeaponCode);
	// 		}
	// 	}
	// }
}