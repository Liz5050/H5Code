abstract class BaseView {
	/**自己的视图 */
	protected view: fairygui.GComponent;
	public constructor(view: fairygui.GComponent) {
		this.view = view;
		this.initOptUI();
	}

	/**
     * 根据名称获取子组件
     */
	protected getGObject(name: string): fairygui.GObject {
		let obj = this.view.getChild(name);
		var packName: string;
		if (obj == null) {
			if (this.view.parent['packageName']) {
				packName = this.view.parent['packageName'];
			} else {
				packName = this.view.parent.packageItem.owner.name;
			}
			Log.trace(Log.UI, "找不到组件：", packName + ":" + name);
		}
		return obj;
	}
	
	protected getController(name:string):fairygui.Controller{
		return this.view.getController(name)
	} 

	public get viewCom():fairygui.GComponent {
		return this.view;
	}
	
	/**
	 * 初始化可操作UI组件。与UI编辑器中命名的组件对应。
	 */
	protected abstract initOptUI(): void;

	/**
	 * 界面打开时自动调用。根据缓存更新所有
	 */
	abstract updateAll(data?: any): void;
}