class GuildStorePropAllotWindow extends BaseWindow {
	private list_prop:List;
	private txt_guildRank:fairygui.GTextField;
	private btn_allot:fairygui.GButton;
	public constructor() {
		super(PackNameEnum.GuildHome,"GuildStorePropAllotWindow");
	}

	public initOptUI():void {
		this.list_prop = new List(this.getGObject("list_prop").asList);
		this.txt_guildRank = this.getGObject("txt_guildRank").asTextField;
		this.btn_allot = this.getGObject("btn_allot").asButton;
		this.btn_allot.addClickListener(this.onAllocateItem,this);
	}

	protected addListenerOnShow(): void {
		this.addListen1(LocalEventEnum.GuildAllocateItemUpdate,this.onAllocateUpdate,this);
    }

	public updateAll():void {
		this.list_prop.setVirtual(CacheManager.guildNew.warehouseItems);
		let myGuildRank:number = CacheManager.guildBattle.myGuildRank;
		if(myGuildRank <= 0) {
			this.txt_guildRank.text = "本次仙盟争霸仙盟排名：未上榜";
		}
		else {
			this.txt_guildRank.text = "本次仙盟争霸仙盟排名奖励：第" + CacheManager.guildBattle.myGuildRank + "名"
		}
	}

	private onAllocateUpdate():void {
		this.list_prop.list.refreshVirtualList();
	}

	private onAllocateItem():void {
		EventManager.dispatch(LocalEventEnum.GuildReqAllocateItem);
	}

	public hide():void {
		super.hide();
		CacheManager.guildNew.clearAllocateInfo();
	}
}