/**
 * 指引条件
 */
class GuideCondition {
	private static canGuideDict: any = {
		"390058_2": false
	}

	public constructor() {
	}

	/**
	 * 是否可以指引
	 */
	public static isCanGuide(key: string): boolean {
		if (GuideCondition.canGuideDict[key] == false) {
			return false;
		}
		return true;
	}

	public static setCanGuide(key: string, isCan: boolean): void {
		GuideCondition.canGuideDict[key] = isCan;
	}
}