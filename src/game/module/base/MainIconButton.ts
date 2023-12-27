/**
 * 底部主功能复选按钮
 */
class MainIconButton extends BaseTipButton {

	public constructor() {
		super();
	}

	public set selected(selected: boolean) {
		if (selected) {
			this.setState(fairygui.GButton.DOWN);
		} else {
			this.setState(fairygui.GButton.UP);
		}
		this.setScale(1, 1);
		this.soundVolumeScale = selected ? 0 : 1;
	}
}