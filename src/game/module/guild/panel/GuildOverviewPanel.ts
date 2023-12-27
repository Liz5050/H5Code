/**
 * 仙盟信息总览
 */
class GuildOverviewPanel extends BaseTabPanel {
	private c1: fairygui.Controller;
	private infoPanel: GuildInfoPanel;
	private memberPanel: GuildMemberPanel;
	private applyPanel: GuildApplyPanel;
	private listPanel: GuildListPanel;
	private redPacketPanel: GuildRedPacketPanel;

	public initOptUI() {
		this.c1 = this.getController("c1");
		this.infoPanel = new GuildInfoPanel(this.getGObject("panel_info").asCom, this.c1, 0);
		this.memberPanel = new GuildMemberPanel(this.getGObject("panel_member").asCom, this.c1, 1);
		this.applyPanel = new GuildApplyPanel(this.getGObject("panel_apply").asCom, this.c1, 2);
		this.listPanel = new GuildListPanel(this.getGObject("panel_guild").asCom, this.c1, 3);
		// this.redPacketPanel = new GuildRedPacketPanel(this.getGObject("panel_member").asCom, this.c1, 4);
	}

	public updateAll() {
		this.c1.selectedIndex = 0;
	}

	public updateByGuildInfo(guildInfo: any): void {
		this.infoPanel.updateByGuildInfo(guildInfo);
	}

	public updateApplyList(publicMiniPlayers: Array<any>): void {
		this.applyPanel.updateApplyList(publicMiniPlayers);
	}

	public updateMembers(members: Array<any>): void {
		this.memberPanel.updateMembers(members);
	}
	
	public updateGuilds(data:any):void{
		this.listPanel.updateGuilds(data);
	}
}