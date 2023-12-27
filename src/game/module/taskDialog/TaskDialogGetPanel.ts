/**
 * 领取任务面板
 */
class TaskDialogGetPanel extends BaseTabPanel {
	private titleTxt: fairygui.GTextField;
	private descTxt: fairygui.GRichTextField;
	private rewardList: List;
	private timeTxt: fairygui.GTextField;
	private getBtn: fairygui.GButton;

	private npcTask: any;
	private taskGroup: ETaskGroup;

	public initOptUI(): void {
		this.titleTxt = this.getGObject("txt_title").asTextField;
		this.descTxt = this.getGObject("txt_desc").asRichTextField;
		this.rewardList = new List(this.getGObject("list_reward").asList);
		this.getBtn = this.getGObject("btn_receiveTask").asButton;
		this.getBtn.addClickListener(this.getTask, this);
		this.getGObject("loader_clickTitle").addClickListener(this.getTask, this);
		this.getGObject("loader_click").addClickListener(this.getTask, this);
	}

	public updateAll(): void {

	}

	public updateByNpcTask(npcTask: any): void {
		this.taskGroup = null;
		this.npcTask = npcTask;
		if (npcTask != null) {
			let npcInfo: any = ConfigManager.npc.getByPk(npcTask.task.getNpc_I);
			let task: any = ConfigManager.task.getByPk(npcTask.task.code_I);
			if (task != null) {
				this.titleTxt.text = task.name;
			} else {
				this.titleTxt.text = npcInfo.name;
			}
			let talkId: number = npcTask.task.getTalkId_I;
			let talk: any = ConfigManager.taskTalk.getByPk(talkId);
			let desc: string = talk.talkStr;
			if (talkId == 60015) {
				desc = desc.replace("[name]", CacheManager.role.player.name_S);
			}
			this.descTxt.text = desc;
			this.rewardList.data = TaskUtil.getTaskRewards(npcTask.task.rewards.data);
			this.rewardList.list.resizeToFit();
			let baseItem: BaseItem;
			for (let item of this.rewardList.list._children) {
				baseItem = (item as BaseItem);
				baseItem.showBind();
				baseItem.numTxt.text = App.MathUtils.formatNum(baseItem.itemData.getItemAmount());
			}
		}
	}

	/**
	 * 处理接循环任务
	 */
	public updateRingTask(npcId: number, taskGroup: ETaskGroup): void {
		this.taskGroup = taskGroup;
		let npcInfo: any = ConfigManager.npc.getByPk(npcId);
		this.titleTxt.text = npcInfo.name;
		this.descTxt.text = npcInfo.talk;
		this.rewardList.data = null;
	}

	/**领取任务 */
	private getTask(): void {
		if (this.taskGroup != null) {
			EventManager.dispatch(LocalEventEnum.TaskRingGet, { "taskGroup": this.taskGroup });
		} else {
			if (this.npcTask != null) {
				EventManager.dispatch(LocalEventEnum.TaskGet, { "npcId": this.npcTask.task.getNpc_I, "taskCode": this.npcTask.task.code_I });
			}
		}

	}
}