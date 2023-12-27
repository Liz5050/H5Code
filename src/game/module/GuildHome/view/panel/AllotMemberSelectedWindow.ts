class AllotMemberSelectedWindow extends BaseWindow {
	private txt_count:fairygui.GTextField;
	private list_member:List;
	private btn_sure:fairygui.GButton;
	private uid:string;
	public constructor() {
		super(PackNameEnum.GuildHome,"AllotMemberSelectedWindow");
	}

	public initOptUI():void {
		this.txt_count = this.getGObject("txt_count").asTextField;
		this.list_member = new List(this.getGObject("list_member").asList);
		this.btn_sure = this.getGObject("btn_sure").asButton;
		this.btn_sure.addClickListener(this.hide,this);
	}

	/**
	 * 模块显示时开启的监听
	 * 这里只能使用this.addListen1()函数进行事件监听
	 */
    protected addListenerOnShow(): void {
		this.addListen1(LocalEventEnum.GuildAllocateItemUpdate,this.onAllocateUpdate,this);
    }

	public updateAll(uid:string):void {
		CacheManager.guildNew.allocateUid = uid;
		this.onAllocateUpdate();
		EventManager.dispatch(LocalEventEnum.GuildNewReqGuildMember, {guildId: 0});
	}

	public updateMember(members:any[]):void {
		members.sort(function (value1: any, value2: any): number {
			let score1:number = value1.mgNewGuildWarScore_I > 0 ? value1.mgNewGuildWarScore_I : 0; 
			let score2:number = value2.mgNewGuildWarScore_I > 0 ? value2.mgNewGuildWarScore_I : 0;
			return score2 - score1;
        });
		this.list_member.setVirtual(members);
	}

	private onAllocateUpdate():void {
		let allocateNum:number = CacheManager.guildNew.getStoreItemAllocateCount();
		let leftNum:number = CacheManager.guildNew.getStoreItemLeftCount();
		this.txt_count.text = "已分配：" + allocateNum + "/" + leftNum;
		this.list_member.list.refreshVirtualList();
	}
}