/**
 * 实现IBaseView是为了和Module统一
 * 只是一个的fui内容装载器
 */
abstract class BaseContentView extends BaseGUIView {
	private moduleId: ModuleEnum;

	public constructor(pkgName: string, contentName: string, moduleId: ModuleEnum = null,parent:fairygui.GComponent=LayerManager.UI_Main) {
		super(parent);
		this.packageName = pkgName;
		this.viewName = contentName;
		this.moduleId = moduleId;
	}

	/**
	 * 初始化可操作UI组件。与UI编辑器中命名的组件对应。
	 */
	abstract initOptUI(): void;

	/**
	 * 界面打开时自动调用。根据缓存更新所有
	 */
	abstract updateAll(data?:any): void;

	public initUI(): void {
		super.initUI();
		this.initOptUI();
	}

	public onShow(data?:any): void {
		super.onShow(data);
		this.updateAll(data);
	}
}