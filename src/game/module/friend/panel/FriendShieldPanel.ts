class FriendShieldPanel extends BaseTabView{
	private shieldList: List;
	private controller: fairygui.Controller;

	public constructor() {
		super();
		this.isDestroyOnHide = false;
	}

	public initOptUI(): void{
		this.shieldList = new List(this.getGObject("list_shield").asList);
		this.controller = this.getController("c1");
	}

	public updateAll(): void{
		//EventManager.dispatch(LocalEventEnum.GetFriendListByType, EFriendFlag.EFriendFlagBlackList);
		this.updateList();
	}

	public updateList(): void{
		let friendData: Array<any> = CacheManager.friend.getFriends(EFriendFlag.EFriendFlagBlackList);
		if(friendData.length > 0){
			this.controller.selectedIndex = 1;
			this.shieldList.setVirtual(friendData);
		}else{
			this.controller.selectedIndex = 0;
		}
	}
}