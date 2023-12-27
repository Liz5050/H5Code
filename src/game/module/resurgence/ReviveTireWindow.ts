/**疲劳值复活 */
class ReviveTireWindow extends BaseReviveWindow {
	protected btn_cancel:fairygui.GButton;
	public txt_time: fairygui.GTextField;
	public constructor() {
		super("WindowReviveTwo");
	}
	public initOptUI(): void {
		super.initOptUI();
		this.txt_time = this.getGObject("txt_time").asTextField;
		this.btn_cancel = this.getGObject("btn_cancel").asButton;
		this.btn_cancel.addClickListener(this.onClickCancle, this);
	}
	protected onClickCancle(): void {
		this.hide();
		
	}
	public show(isCenter: boolean = true): void {
		super.show();
		App.TimerManager.doTimer(1000, 0, this.onTimer, this);
		this.onTimer();
	}
	public hide(): void {
		super.hide();
		App.TimerManager.remove(this.onTimer, this);
	}

	protected onTimer(): void {
		var sec: number = CacheManager.boss.reviveCityEnd - egret.getTimer();
		sec = Math.round(sec / 1000);
		this.txt_time.text = "" + sec;
		if (sec < 0) {			
			this.txt_time.text = "";
			this.hide();
		}
	}


}