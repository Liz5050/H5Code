class BaseReviveWindow extends BaseWindow {
	protected tipTxt: fairygui.GTextField;
	protected btn_revive: fairygui.GButton;

	private tip: string;

	public constructor(contenName: string) {
		super(PackNameEnum.Resurgence, contenName, null, LayerManager.UI_Main);
	}
	public initOptUI(): void {
		this.btn_revive = this.getGObject("btn_revive").asButton;
		this.btn_revive.addClickListener(this.revive, this);
		var g: fairygui.GObject = this.getGObject("txt_tip");
		if (g) {
			this.tipTxt = g.asTextField;
		}

	}

	public updateAll(): void {

	}

	public onShow(): void {
		super.onShow();
		this.setTip(this.tip);
	}

	/**
	 * 设置提示
	 */
	public setTip(tip: string): void {
		this.tip = tip;
		if (this.tipTxt) {
			this.tipTxt.text = tip;
		}
	}
	/**
	 * 复活
	 */
	protected revive(): void {
		this.reviveNow();
	}

	/**立即复活 */
	protected reviveNow(): void {
		EventManager.dispatch(LocalEventEnum.Revive, { revivalType: ERevivalType.ERevivalTypeInSitu, priceUnit: EPriceUnit.EPriceUnitGold });
	}

	/**回城复活 */
	protected reviveToCity(): void {
		EventManager.dispatch(LocalEventEnum.Revive, { revivalType: ERevivalType.ERevivalTypeInBackToTheCity, priceUnit: 0 });
	}


}