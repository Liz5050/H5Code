/**
 * 仙盟活动
 */
class GuildActivePanel extends BaseTabPanel {
	private c1: fairygui.Controller;
	private beastGodPanel: GuildBeastGodPanel;
	private beastBtn: fairygui.GButton;

	public initOptUI() {
		this.c1 = this.getController("c1");
		this.beastGodPanel = new GuildBeastGodPanel(this.getGObject("panel_beastGod").asCom, this.c1, 0);
		this.beastBtn = this.getGObject("btn_beast").asButton;
	}

	public updateAll(): void {
		this.selectTab(0, this.c1);
		this.updateBeastBtn();
	}

	/**
	 * 更新神兽挑战次数
	 */
	public updateBeastGodTimes(): void {
		this.beastGodPanel.updateTimes()
	}

	/**
	 * 更新兽粮
	 */
	public updateBeastGodFood(): void {
		this.beastGodPanel.updateFood()
		this.updateBeastBtn();
	}

	/**更新神兽Tab按钮状态 */
	public updateBeastBtn(): void {
		CommonUtils.setBtnTips(this.beastBtn, CacheManager.guild.getBeastFoodNum() > 0);
		this.beastGodPanel.updatePackFoodNum();
	}
}