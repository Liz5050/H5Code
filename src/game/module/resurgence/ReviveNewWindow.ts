/**原地复活和复活点复活 */
class ReviveNewWindow extends BaseReviveWindow {
	private static _inst: ReviveNewWindow;
	protected btn_cancel: fairygui.GButton;
	private btn_mount: fairygui.GButton;
	private btn_equip: fairygui.GButton;
	public constructor() {
		super("WindowReviveNew");
		this.isPopup = false;
	}

	public initOptUI(): void {
		super.initOptUI();
		this.btn_cancel = this.getGObject("btn_cancel").asButton;
		this.btn_cancel.addClickListener(this.onClickReviveToCity, this);

		this.btn_mount = this.getGObject("iconbutton2").asButton;
		this.btn_equip = this.getGObject("iconbutton1").asButton;
		this.btn_equip.addClickListener(this.onClickSysBtn, this);
		this.btn_mount.addClickListener(this.onClickSysBtn, this);
	}

	protected onClickReviveToCity(): void {
		if (CacheManager.boss.isCityReviveCd()) {
			EventManager.dispatch(LocalEventEnum.ReviveShowTireWin);
		} else {
			this.reviveToCity();
		}

	}

	protected onClickSysBtn(e: any): void {
		switch (e.target) {
			// case this.btn_mount:
			// 	EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PetMount);
			// 	break;
			case this.btn_equip:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Refine);
				break;

		}
		//this.hide();
	}

	public static get inst(): ReviveNewWindow {
		if (!ReviveNewWindow._inst) {
			ReviveNewWindow._inst = new ReviveNewWindow();
		}
		return ReviveNewWindow._inst;
	}

}