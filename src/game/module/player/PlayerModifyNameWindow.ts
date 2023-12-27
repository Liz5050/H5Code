/**
 * 改名
 */
class PlayerModifyNameWindow extends BaseWindow {
	private nameInput: fairygui.GTextInput;
	private okBtn: fairygui.GButton;

	public constructor() {
		super(PackNameEnum.Player, "WindowModifyName");
	}

	public initOptUI(): void {
		this.nameInput = this.getGObject("input_name").asTextInput;
		this.okBtn = this.getGObject("btn_ok").asButton;
		this.okBtn.addClickListener(this.clickOk, this);
	}

	public updateAll(data: any = null): void {
		this.nameInput.text = "";
	}

	private clickOk(e: any): void {
		let name: string = this.nameInput.text.trim();
		if (name.length == 0) {
			Tip.showTip("名称不能为空");
			return;
		}
		if (App.StringUtils.getStringLength(name) > 7 || name.indexOf(" ") != -1 || ConfigManager.chatFilter.isHasSensitive(name)) {
			Tip.showTip("名称不能超过7个字，不能包含空格和敏感词");
			return;
		}
		EventManager.dispatch(LocalEventEnum.PlayerModifyName, name);
		this.hide();
	}
}