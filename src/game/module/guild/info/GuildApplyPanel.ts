/**
 * 仙盟申请
 */
class GuildApplyPanel extends BaseTabPanel {
	private c1: fairygui.Controller;
	private c2: fairygui.Controller;
	private appList: List;
	private autoBtn: fairygui.GButton;

	public initOptUI() {
		this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");
		this.appList = new List(this.getGObject("list_apply").asList);

		this.getGObject("btn_allagree").addClickListener(this.allAgree, this);
		this.getGObject("btn_allrefuse").addClickListener(this.allRefuse, this);
		this.getGObject("btn_setup").addClickListener(this.setup, this);
		this.getGObject("btn_set").addClickListener(this.setup, this);
		this.autoBtn = this.getGObject("btn_automatic").asButton;
		this.autoBtn.addClickListener(this.autoAgree, this);
	}

	public updateAll() {
		EventManager.dispatch(LocalEventEnum.GuildGetApplyList, { "guildId": 0 });
	}

	public updateApplyList(publicMiniPlayers: Array<any>): void {
		this.appList.data = publicMiniPlayers;
		this.c1.selectedIndex = CacheManager.guild.isCanDealApply ? 1 : 0;
		this.c2.selectedIndex = publicMiniPlayers.length > 0 ? 0 : 1;
	}

	private allAgree(): void {
		EventManager.dispatch(LocalEventEnum.GuildDealApply, { "playerId": 0, "isAgree": true });
	}

	private allRefuse(): void {
		EventManager.dispatch(LocalEventEnum.GuildDealApply, { "playerId": 0, "isAgree": false });
	}

	private setup(): void {
		EventManager.dispatch(UIEventEnum.GuildApplySetOpen);
	}

	/**
	 * 自动批准
	 */
	private autoAgree(): void {
		EventManager.dispatch(LocalEventEnum.GuildApplyAutoAgreeSave, { "isAutoAgree": this.autoBtn.selected });
	}
}