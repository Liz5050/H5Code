class WindowRoleStateExchange extends BaseWindow {
	private exchangeList:List;

	private codes:number[];
	public constructor() {
		super(PackNameEnum.Reincarnation,"WindowExchange");
	}

	public initOptUI():void {
		this.exchangeList = new List(this.getGObject("list_exchange").asList);
		this.codes = [
			ItemCodeConst.CheckPointLvExp,
			ItemCodeConst.CopyRoleStateExp,
			ItemCodeConst.RoleLvExp,
			ItemCodeConst.SuperRoleLvExp];
		this.exchangeList.data = this.codes;
	}

	public updateAll():void {
		this.updateUsedNumItem();
	}

	public updateUsedNumItem():void {
		if(!this.codes) return;
		for(let i:number = 0; i < this.codes.length; i++){
			let item:RoleStateExchangeItem = this.exchangeList.list.getChildAt(i) as RoleStateExchangeItem;
			item.setData(this.codes[i]);
		}
	}

	public hide():void {
		super.hide();
		if(CacheManager.player.isFirstOpenRoleState) {
			CacheManager.player.isFirstOpenRoleState = false;
			EventManager.dispatch(LocalEventEnum.HomeSetBtnTip,ModuleEnum.Player,CacheManager.player.checkTips());
			ControllerManager.player.updateRoleStateTips();
		}
	}
}