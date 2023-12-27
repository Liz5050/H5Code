/**
 * UI视图基类，使用包加载的
 */
class BaseUIView extends fairygui.GComponent {
	private _packageName: string;
	/**是否关闭时销毁界面资源 */
    protected isDestroyOnHide: boolean = false;

	public constructor() {
		super();
	}

	public set packageName(packageName: string) {
		this._packageName = packageName;
	}

	public get packageName(): string {
		return this._packageName;
	}

	public onShow(): void {
		if (this.isDestroyOnHide) {
			if (!ResourceManager.isPackageLoaded(this.packageName)) {
				ResourceManager.load(this.packageName, UIManager.getPackNum(this.packageName), new CallBack(() => {
					FuiUtil.renderGComponent(this, this.packageName);
				}, this));
			} else {
				let isDestroyed: boolean = PackageDestroyManager.instance.isDestroyed(this);
				if (isDestroyed) {
					FuiUtil.renderGComponent(this, this.packageName);
				}
			}
			PackageDestroyManager.instance.onViewShowOrHide(this, true);
        }
	}

	public onHide(): void {
		if (this.isDestroyOnHide) {
            PackageDestroyManager.instance.onViewShowOrHide(this, false);
        }
	}
}