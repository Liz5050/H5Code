/**
 * 正常无任务面板
 */
class TaskDialogBasePanel extends BaseTabPanel{
	protected titleTxt:fairygui.GTextField;
	protected descTxt:fairygui.GRichTextField;

	protected npcTask:any;

	public initOptUI(): void {
		this.titleTxt = this.getGObject("txt_title").asTextField;
		this.descTxt = this.getGObject("txt_desc").asRichTextField;
	}

	public updateAll():void{
		let npcId:number = CacheManager.king.selectedNpcId;
		if(npcId > 0){
			let npcInfo:any = ConfigManager.npc.getByPk(npcId);
			this.titleTxt.text = npcInfo.name;
			this.descTxt.text = npcInfo.talk;
		}
	}

	public updateByNpcTask(npcTask:any):void{
		this.npcTask = npcTask;
	}
}