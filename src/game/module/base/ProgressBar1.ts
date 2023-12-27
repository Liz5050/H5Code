/**
 * 通用进度条1
 */
class ProgressBar1 extends fairygui.GProgressBar {
	/**满级是否隐藏文本 */
	public isMaxHideTitle: boolean = true;
	private mc: UIMovieClip;
	private bar: fairygui.GImage;
	private titleTxt: fairygui.GTextField;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.bar = this.getChild("bar").asImage;
		this.titleTxt = this.getChild("title").asTextField;
		this.mc = UIMovieManager.get(PackNameEnum.MCProgressBarPoint, 20, -82);
		this.addChild(this.mc);
		this.mc.addRelation(this.bar, fairygui.RelationType.Right_Right);
		this.swapChildren(this.titleTxt, this.mc);
	}

	/**
	 * 设置进度
	 * @param current 当前进度值
	 * @param total 总进度值
	 * @param tweenTime 缓动时间，单位毫秒
	 */
	public setValue(current: number, total: number, tweenTime: number = 50): void {
		this.max = total;
		if (tweenTime > 0) {
			this.tweenValue(current, tweenTime / 1000);
		} else {
			this.update(current);
		}
		this.titleTxt.visible = !(this.isMaxHideTitle && current == total);
		this.mc.visible = current != 0;
	}

	public get progressTxt(): fairygui.GTextField {
		return this.titleTxt;
	}

}