class GuildBattleMemberWindow extends BaseWindow {
	private list_member:List;
	public constructor() {
		super(PackNameEnum.Copy,"GuildBattleMemberWindow");
	}

	public initOptUI():void {
		this.list_member = new List(this.getGObject("list_member").asList);
	}

	public updateAll():void {
		let members:GuildBattlePlayerInfo[] = CacheManager.guildBattle.guildPlayerList();
		this.list_member.setVirtual(members);
		this.list_member.scrollToView(0);
	}
}