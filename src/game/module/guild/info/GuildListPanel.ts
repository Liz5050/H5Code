/**
 * 仙盟列表
 */
class GuildListPanel extends BaseTabPanel {
	private guildList: List;
	/**S2C_SSearchGuilds */
	private response: any;

	public initOptUI() {
		this.guildList = new List(this.getGObject("list_guild").asList);
	}

	public updateAll() {
		EventManager.dispatch(LocalEventEnum.GuildSearch, { "name": "", "includeFull": true });
	}

	public updateGuilds(data: any): void {
		this.response = data;
		this.guildList.data = data.guilds.data;
		let listItem: GuildListApplyItem;
		for (let item of this.guildList.list._children) {
			listItem = <GuildListApplyItem>item;
			listItem.setButtonState(1);
		}
	}
}