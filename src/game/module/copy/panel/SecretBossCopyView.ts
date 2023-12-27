class SecretBossCopyView extends WorldBossCopyPanel {
	/**秘境boss 色子界面 */
	// private dicePanel: BossDicePanel;
	private leavePanel: SecretLeaveCounterView;
	private diceLifeSec: number = 10;
	public constructor(info:any) {
		super(info,"SecretBossCopyView");
	}

	public initOptUI():void {
		super.initOptUI();
		// this.dicePanel = new BossDicePanel(this.getGObject("panel_dice").asCom);
		this.leavePanel = new SecretLeaveCounterView(this.getGObject("panel_counter").asCom);
		// this.dicePanel.viewCom.visible = false;
		this.leavePanel.viewCom.visible = false;
	}

	public updateAll():void {
		super.updateAll();
		// if (!CacheManager.bossNew.diceInfo) {
		// 	this.showDicePanel(false);
		// }
		this.showLeavePanel(false, null);
	}

	// /**显示色子界面 */
	// public showDicePanel(isShow: boolean): void {
	// 	this.dicePanel.viewCom.visible = isShow;
	// 	if (isShow) {
	// 		this.dicePanel.updateAll();
	// 	} else {
	// 		this.dicePanel.stopTimer();
	// 	}
	// }
	/**显示离开倒计时界面 */
	public showLeavePanel(isShow: boolean, data: any): void {
		this.leavePanel.viewCom.visible = isShow;
		if (isShow) {
			this.ownerView.viewCom.visible = false;
			let sec: number = (this.copyInf.waitLeaveSec ? this.copyInf.waitLeaveSec : 60);
			this.leavePanel.updateAll({ ownerName: data.ownerMiniPlayer.name_S, waitLeaveSec: sec });
		} else {
			this.leavePanel.stopTimer();
		}
	}

	public hide(param: any = null, callBack: CallBack = null): void {
		super.hide(param, callBack);
		// this.dicePanel.stopTimer();
		this.leavePanel.stopTimer();
		// this.dicePanel.viewCom.visible = false;
		this.leavePanel.viewCom.visible = false;
	}
}