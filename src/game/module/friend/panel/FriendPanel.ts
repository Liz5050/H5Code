class FriendPanel extends BaseTabView{
	private friendList: List;
	private searchBtn: fairygui.GButton;

	public constructor() {
		super();
		this.isDestroyOnHide = false;
	}

	public initOptUI(): void{
		this.friendList = new List(this.getGObject("list_friend").asList);
		this.searchBtn = this.getGObject("btn_search").asButton;
		this.searchBtn.addClickListener(this.clickSearchBtn, this);
	}

	public updateAll(): void{
		// ProxyManager.friend.getFriendList(EFriendFlag.EFriendFlagFriend);
		//EventManager.dispatch(LocalEventEnum.GetFriendListByType, EFriendFlag.EFriendFlagFriend);
		this.updateList();
	}

	private clickSearchBtn(): void{
		EventManager.dispatch(UIEventEnum.SearchFriendOpen);
	}

	public updateList(): void{
		let friendData: Array<any> = CacheManager.friend.getFriends(EFriendFlag.EFriendFlagFriend);
		this.friendList.setVirtual(friendData);
	}
}