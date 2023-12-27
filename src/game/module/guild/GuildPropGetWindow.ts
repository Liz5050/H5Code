/**
 * 仙盟令牌获取窗口
 */
class GuildPropGetWindow extends BaseWindow {
	private bossLit: List;
	private needNumTxt: fairygui.GTextField;
	private haveNumTxt: fairygui.GTextField;

	public constructor() {
		super(PackNameEnum.Guild, "WindowGuildPropGet");
	}

	public initOptUI(): void {
		this.bossLit = new List(this.getGObject("list_boss").asList);
		this.needNumTxt = this.getGObject("txt_needNum").asTextField;
		this.haveNumTxt = this.getGObject("txt_haveNum").asTextField;
	}

	public updateAll(data: any = null): void {

	}
}