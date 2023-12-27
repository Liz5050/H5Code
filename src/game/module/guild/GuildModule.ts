/**
 * 仙盟
 */
class GuildModule extends BaseModule {
	private controller: fairygui.Controller;
	private overviewPanel: GuildOverviewPanel;
	private skillPanel: GuildSkillPanel;
	private warehousePanel: GuildWarehousePanel;
	private activePanel: GuildActivePanel;
	private veinBtn: fairygui.GButton;
	private activeBtn:fairygui.GButton;

	public initOptUI(): void {
		this.controller = this.getController("c1");
		this.overviewPanel = new GuildOverviewPanel(this.getGObject("panel_overview").asCom, this.controller, 0);
		this.warehousePanel = new GuildWarehousePanel(this.getGObject("panel_warehouse").asCom, this.controller, 1);
		this.skillPanel = new GuildSkillPanel(this.getGObject("panel_skill").asCom, this.controller, 2);
		this.activePanel = new GuildActivePanel(this.getGObject("panel_active").asCom, this.controller, 3);

		this.veinBtn = this.getGObject("btn_heart").asButton;//心法按钮
		this.activeBtn = this.getGObject("btn_activity").asButton;//活动按钮
		this.updateVeinBtn();
		this.updateActiveBtn();
	}

	public updateAll(): void {

	}

	/**更新心法按钮红点提示 */
	public updateVeinBtn(): void {
		CommonUtils.setBtnTips(this.veinBtn, CacheManager.guild.isCanLevelUpVien);
	}

	/**更新活动按钮红点提示 */
	public updateActiveBtn(): void {
		CommonUtils.setBtnTips(this.activeBtn, CacheManager.guild.isActiveNotice);
	}

	public updateBeastBtn():void{
		this.activePanel.updateBeastBtn();
	}

	public onShow(data?: any): void {
		super.onShow(data);
		this.selectTab(0);
		EventManager.dispatch(LocalEventEnum.GuildGetInfo, { "guildId": 0 });
	}

	public updateByGuildInfo(guildInfo: any): void {
		this.overviewPanel.updateByGuildInfo(guildInfo);
	}

	public updateApplyList(publicMiniPlayers: Array<any>): void {
		this.overviewPanel.updateApplyList(publicMiniPlayers);
	}

	public updateMembers(members: Array<any>): void {
		this.overviewPanel.updateMembers(members);
	}

	/**
	 * 根据搜索结果返回
	 * @param data S2C_SSearchGuilds
	 * myRank totalNum guilds
	 */
	public updateGuilds(data: any): void {
		this.overviewPanel.updateGuilds(data);
	}

	public updateSkill(): void {
		this.skillPanel.updateAll();
		this.updateVeinBtn();
	}

	/**
	 * 更新仓库物品
	 */
	public updateWarehouseItems(): void {
		this.warehousePanel.updateItems();
	}

	/**
	 * 删除仓库物品
	 */
	public removeWarehouseItems(sPlayerItems: Array<any>): void {
		this.warehousePanel.removeItems(sPlayerItems);
	}

	/**
	 * 更新记录
	 */
	public updateWarehouseRecords(): void {
		this.warehousePanel.updateRecords();
	}

	/**
	 * 更新仓库积分
	 */
	public updateWarehouseScore(): void {
		this.warehousePanel.updateScore();
	}

	/**
	 * 更新次数
	 */
	public updateBeastGodTimes(): void {
		this.activePanel.updateBeastGodTimes();
	}

	/**
	 * 更新兽粮
	 */
	public updateBeastGodFood(): void {
		this.activePanel.updateBeastGodFood();
	}

}