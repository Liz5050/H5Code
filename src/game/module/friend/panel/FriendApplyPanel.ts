class FriendApplyPanel extends BaseTabView{
	private applyList: List;
	private controller: fairygui.Controller;

	public constructor() {
		super();
		this.isDestroyOnHide = false;
	}

	public initOptUI(): void{
		this.applyList = new List(this.getGObject("list_apply").asList);
		this.controller = this.getController("c1");
	}

	public updateAll(): void{
		// ProxyManager.friend.getFriendList(EFriendFlag.EFriendFlagBlackList)
		this.updateList();
	}

	public updateList(): void{
		let applyData: Array<any> = CacheManager.friend.getApplyPlayers();
		// this.controller.selectedIndex = 1;
		if(applyData.length > 0){
			this.controller.selectedIndex = 1;
			this.applyList.setVirtual(applyData);
		}else{
			this.controller.selectedIndex = 0;
		}
	}
}