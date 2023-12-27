/**
 * 正常无任务对话面板
 */
class TaskDialogTalkPanel extends BaseTabPanel {
	private titleTxt: fairygui.GTextField;
	private descTxt: fairygui.GRichTextField;
	private npcTask: any;

	private npcId: number;
	private taskGroup: number;

	public initOptUI(): void {
		this.titleTxt = this.getGObject("txt_title").asTextField;
		this.descTxt = this.getGObject("txt_desc").asRichTextField;
	}

	public updateAll(): void {
		let npcId: number = CacheManager.king.selectedNpcId;
		this.npcId = npcId;
		if (npcId > 0) {
			let npcInfo: any = ConfigManager.npc.getByPk(npcId);
			this.titleTxt.text = npcInfo.name;
			this.descTxt.text = npcInfo.talk;
		}
	}

	public updateByNpcTask(npcTask: any): void {
		this.npcTask = npcTask;
	}
}