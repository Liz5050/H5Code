/**
 * 指引手指
 */
class GuideFinger extends fairygui.GComponent {
	private finger: fairygui.GImage;

	public constructor() {
		super();
		this.finger = fairygui.UIPackage.createObject(PackNameEnum.Guide, "img_finger").asImage;
		this.finger.scaleX = 0.7;
		this.finger.scaleY= 0.7;
		this.addChild(this.finger);
	}
}