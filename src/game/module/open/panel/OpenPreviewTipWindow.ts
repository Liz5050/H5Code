/**
 * 预告提示
 */
class OpenPreviewTipWindow extends BaseWindow {
	private c1: fairygui.Controller;
	private iconLoader: fairygui.GLoader;
	private descTxt: fairygui.GTextField;

	private cfg: any;
	private lastCfg: any;

	public constructor() {
		super(PackNameEnum.Open, "WindowPreviewTip", null, ControllerManager.home.getView());
		this.modal = false;
		this.isCenter = false;
	}

	public initOptUI(): void {
		this.c1 = this.getController("c1");
		this.iconLoader = this.getGObject("loader_icon").asLoader;
		this.descTxt = this.getGObject("txt_desc").asTextField;
		this.iconLoader.addClickListener(this.clickIcon, this);
	}

	public onShow(data: any = null): void {
		if (data == this.lastCfg) {
			return;
		}
		this.x = 0;
		this.y = 173;
		this.cfg = data;
		if (this.cfg) {
			this.iconLoader.url = `ui://${PackNameEnum.Open}/preview_${this.cfg.openId}`;
			this.descTxt.text = (this.cfg.showName as string).replace("#", "\n");
		}
		this.lastCfg = data;
		this.c1.selectedIndex = 1;
	}

	private clickIcon(): void {
		this.c1.selectedIndex = 0;
		EventManager.dispatch(UIEventEnum.OpenPreviewWindowOpen, this.cfg);
	}
}