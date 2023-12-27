class ForgeBaseTabPanel extends BaseTabView {

	protected _roleIndex:number;
	
	protected cfg:any;
	protected type:EStrengthenExType;
	protected level:number;
	protected useItemCode:number;
	public constructor() {
		super();
	}

	protected initOptUI():void {
	}

	public updateAll():void {
		this.level = CacheManager.role.getPlayerStrengthenExLevel(this.type, this.roleIndex);
		this.cfg = StrengthenExUtil.getCurrentCfg(this.type, this.roleIndex);
		this.useItemCode = ConfigManager.mgStrengthenEx.getUseItemCode(this.type);
	}

	public set roleIndex(roleIndex: number) {
		this._roleIndex = roleIndex;
		this.updateAll();
	}

	public get roleIndex(): number {
		return this._roleIndex;
	}

	public updateProp():void {

	}

	public updateBySUpgradeStrengthenEx(info: SUpgradeStrengthenEx = null):void {
		
	}

	protected onTouchCostIconHandler():void {
		ToolTipManager.showByCode(this.useItemCode);
	}
}