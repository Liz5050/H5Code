/**
 * 指引目标对象管理
 */
class GuideTargetManager {
	private static objs: any = {};

	public constructor() {
	}

	/**
	 * 注册指引组件
	 * @param isAddToParent 特效是否加入组件所属父类中
	 * @param parent 组件所属父类
	 */
	public static reg(name: string, obj: fairygui.GObject, isAddToParent:boolean = false, parent: fairygui.GObject = null): void {
		GuideTargetManager.objs[name] = obj;
		if (GuideUtil.isObjTarget(name)) {
			if (isAddToParent) {
				if (parent == null) {
					parent = obj.parent;
				}
				let viewClassName: string = name.split("#")[0];
				GuideTargetManager.objs[viewClassName] = parent;
			}
		}
	}

	public static getObj(name: string): fairygui.GObject {
		return GuideTargetManager.objs[name];
	}

	public static getObjView(name: string): fairygui.GObject {
		let viewClassName: string = name.split("#")[0];
		return GuideTargetManager.objs[viewClassName];
	}
}