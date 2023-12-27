/**
 * 功能开启执行器
 */
class OpenExecutor {
	private home: HomeModule;
	private navbar: Navbar;
	private funOpenCfg: any;

	public constructor(home: HomeModule, navbar: Navbar) {
		this.home = home;
		this.navbar = navbar;
		// this.funOpenCfg = ConfigManager.client.getByKey("fun_open");
	}

	/**
	 * 检测所有按钮
	 */
	public checkAll(): void {
		let btnList: OpenButtonList;
		for (let posEnum in OpenButtonCfg.btnDict) {
			btnList = OpenButtonCfg.btnListDict[posEnum];
			btnList.update();
		}
	}

	/**
	 * 添加按钮到导航栏指定位置
	 */
	public addToNavbar(name: string, index: number, duration: number = 1000): void {
		let btnList: OpenButtonList = OpenButtonCfg.btnListDict["Navbar"];
		btnList.addToIndex(name, index, duration);
	}
}