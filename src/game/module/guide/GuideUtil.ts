class GuideUtil {
	public constructor() {
	}

	/**
	 * 是否为点击对象目标
	 * @param controller#name 或者 498,162,174,68 或者 498,162,100
	 */
	public static isObjTarget(target: string): boolean {
		return target != null && target.indexOf("#") != -1;
	}

	/**
	 * 获取指引对象
	 * @param target controller#name
	 */
	public static getTargetObj(target: string): fairygui.GObject {
		if (target == null || target == "") {
			return null;
		}
		let a: Array<string> = target.split("#");
		let controllerName: string = a[0];
		let targetName: string = a[1];
		return GuideTargetManager.getObj(targetName);
	}

	/**
	 * 获取目标区域
	 */
	public static getTargetArea(target: string): Array<number> {
		let rtn: Array<number> = [];
		let a: Array<string> = target.split(",");
		rtn = [Number(a[0]), Number(a[1]), Number(a[2])];
		if (a.length == 4) {
			rtn.push(Number(a[3]));
		}
		return rtn;
	}
}