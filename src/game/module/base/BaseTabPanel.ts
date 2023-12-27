/**
 * 基础标签面板
 */
abstract class BaseTabPanel extends BaseView {
	protected controller: fairygui.Controller;
	protected index: number;
	protected isAutoListener: boolean;
	/**
	 * 组件本身
	 * @param isAutoListener 新增TabPanelCtrl里面监听了 加个参数兼容旧的 以后用TabPanelCtrl管理就把该参数设置为false
	 */
	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index: number, isAutoListener: boolean = true) {
		super(view);
		this.controller = controller;
		this.index = index;
		this.isAutoListener = isAutoListener;
		if (this.isAutoListener) {
			this.controller.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onTabChanged, this);
		}
	}

	/**
     * 根据名称获取控制器
     */
	public getController(name: string = null): fairygui.Controller {
		let obj = this.view.getController(name)
		return obj;
	}

	/**
	 * 获取动效
	 */
	public getTransition(name: string): fairygui.Transition {
		let obj = this.view.getTransition(name);
		var packName: string;
		if (obj == null) {
			if (this.view.parent['packageName']) {
				packName = this.view.parent['packageName'];
			} else {
				packName = this.view.parent.packageItem.owner.name;
			}
			Log.trace(Log.UI, "找不到动效：", packName + ":" + name);
		}
		return obj;
	}

	public getIndex(): number {
		return this.index;
	}
	/**
	 * 销毁函数
	 */
	public destroy(): void {

	}
	/**
     * tab标签改变
     */
	protected onTabChanged(e: any): void {
		if (this.index == this.controller.selectedIndex) {
			this.updateAll();
			EventManager.dispatch(UIEventEnum.ViewOpened, this["__class__"]);
		}
	}

	/**
	 * 选中标签页
	 */
	protected selectTab(index: number, c: fairygui.Controller = null): void {
		let optC: fairygui.Controller;
		if (c == null) {
			optC = this.controller;
		} else {
			optC = c;
		}
		if (optC.selectedIndex == 0 && index == 0) {
			optC.selectedIndex = -1;
			optC.selectedIndex = 0;
		} else {
			optC.selectedIndex = index;
		}
	}
}