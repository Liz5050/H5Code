/**
 * 一个指引信息
 */
class GuideInfo {
	/**指引标识 */
	public key: string;
	public steps: Array<GuideStepInfo> = [];

	public constructor(key: string) {
		this.key = key;
	}

	public get hasNext(): boolean {
		return this.steps.length > 0;
	}
}