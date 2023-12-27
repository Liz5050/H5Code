/**
 * 功能开启预告窗口
 */
class OpenPreviewWindow extends BaseWindow {
	private iconLoader: GLoader;
	private descTxt: fairygui.GTextField;
	private openTxt: fairygui.GTextField;

	private cfg: any;

	public constructor() {
		super(PackNameEnum.Open, "WindowPeview");
	}

	public initOptUI(): void {
		this.iconLoader = <GLoader>this.getGObject("loader_icon");
		this.descTxt = this.getGObject("txt_desc").asTextField;
		this.openTxt = this.getGObject("txt_open").asTextField;
	}

	public onShow(data: any = null): void {
		super.onShow(data);
		this.cfg = data;
		if (this.cfg) {
			this.iconLoader.load(URLManager.getPackResUrl(PackNameEnum.Open, `preview_${this.cfg.openId}`));
			if (this.cfg.showDesc) {
				let descArray: Array<string> = (this.cfg.showDesc as string).split("#");
				if (descArray.length == 2) {
					this.descTxt.text = descArray[0];
					this.openTxt.text = descArray[1];
				}
			}
		}
	}

}