/**
 * 申请设置窗口
 */
class GuildApplySetWindow extends BaseWindow {
	private minLevelInput: NumberInput;
	private minFightInput: NumberInput;

	public constructor() {
		super(PackNameEnum.Guild, "WindowGuildApplySet");
	}

	public initOptUI(): void {
		this.minFightInput = <NumberInput>this.getGObject("input_fight");
		this.minLevelInput = <NumberInput>this.getGObject("input_level");
		this.minFightInput.max = Number.MAX_VALUE;
		this.minLevelInput.max = 1000;
		this.getGObject("btn_save").addClickListener(this.save, this);
		this.getGObject("btn_cancel").addClickListener(this.hide, this);
	}

	public updateAll(): void {

	}

	private save(): void {
		let minLevel: number = this.minLevelInput.value;
		let minFight: number = this.minFightInput.value;
		EventManager.dispatch(LocalEventEnum.GuildApplySetSave, { "level": minLevel, "fight": minFight, "condition": EGuildEnterCondition.EGuildEnterConditionCondition });
		this.hide();
	}
}