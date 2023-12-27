/**
 * 主界面地图图标
 */
class HomeMapIcon extends fairygui.GButton {
	private bgLoader: GLoader;
	private nameLoader: GLoader;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.bgLoader = this.getChild("loader_bg") as GLoader;
		this.nameLoader = this.getChild("loader_name") as GLoader;
		this.bgLoader.load(URLManager.getModuleImgUrl("city/bg.png", PackNameEnum.Home));
		this.nameLoader.load(URLManager.getModuleImgUrl("city/999997.png", PackNameEnum.Home));
	}

	public updateAll(): void {

	}

}