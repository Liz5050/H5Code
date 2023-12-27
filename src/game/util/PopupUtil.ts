/**
 * 弹窗工具类
 */
class PopupUtil {
	public constructor() {
	}

	public static show(obj: fairygui.GObject, x: number = -1, y: number = -1): void {
		if (obj) {
			fairygui.GRoot.inst.showPopup(obj);
			if (x != -1 && y != -1) {
				obj.setXY(x, y);
			}
		}
	}

	public static hide(obj: fairygui.GObject): void {
		if (obj) {
			fairygui.GRoot.inst.hidePopup(obj);
		}
	}
}