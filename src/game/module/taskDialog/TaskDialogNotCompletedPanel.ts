/**
 * 任务未完成，需要对话或进入副本等
 */
class TaskDialogNotCompletedPanel extends BaseTabPanel {
	private titleTxt: fairygui.GTextField;
	private descTxt: fairygui.GRichTextField;
	private rewardList: List;
	private timeTxt: fairygui.GTextField;
	private gotoBtn: fairygui.GButton;

	private leftTime: number = 5;
	private current: number = this.leftTime;
	private npcTask: any;
	private processContents: Array<any>;
	private npcId: number;
	private taskType: ETaskType;

	public initOptUI(): void {
		this.titleTxt = this.getGObject("txt_title").asTextField;
		this.descTxt = this.getGObject("txt_desc").asRichTextField;
		this.timeTxt = this.getGObject("txt_time").asTextField;
		this.rewardList = new List(this.getGObject("list_reward").asList);
		this.gotoBtn = this.getGObject("btn_goto").asButton;
		this.gotoBtn.addClickListener(this.gotoTask, this);
		this.getGObject("loader_clickTitle").addClickListener(this.gotoTask, this);
		this.getGObject("loader_click").addClickListener(this.gotoTask, this);
	}

	public updateAll(): void {

	}

	public updateByNpcTask(npcTask: any): void {
		let talkId: number;
		this.npcTask = npcTask;
		if (npcTask != null) {
			this.taskType = npcTask.task.type_I
			this.gotoBtn.text = this.getBtnName();
			let group: ETaskGroup = npcTask.task.group_I;
			if (TaskUtil.isRing(group)) {//循环任务特殊处理
				if (this.taskType == ETaskType.ETaskTypeTalk) {
					this.processContents = npcTask.task.processes.data[0].contents.data_I;
					this.npcId = this.processContents[0];
					talkId = this.processContents[1];
				} else {
					this.npcId = npcTask.task.endNpc_I;
					talkId = npcTask.task.notCompletedTalkId_I;
				}
			} else {
				if (npcTask.status_I == ETaskStatus.ETaskStatusCanGet) {
					this.npcId = npcTask.task.getNpc_I;
				} else {
					this.npcId = npcTask.task.endNpc_I;
				}
				talkId = npcTask.task.getTalkId_I;
			}
			let npcInfo: any = ConfigManager.npc.getByPk(npcTask.task.endNpc_I);
			let task: any = ConfigManager.task.getByPk(npcTask.task.code_I);
			if (task != null) {
				this.titleTxt.text = task.name;
			} else {
				this.titleTxt.text = npcInfo.name;
			}

			let talk: any = ConfigManager.taskTalk.getByPk(talkId);
			let desc: string = talk.talkStr;
			this.descTxt.text = desc;
			this.rewardList.data = TaskUtil.getTaskRewards(npcTask.task.rewards.data);
			this.rewardList.list.resizeToFit();
			let baseItem: BaseItem;
			for (let item of this.rewardList.list._children) {
				baseItem = (item as BaseItem);
				baseItem.showBind();
				baseItem.numTxt.text = App.MathUtils.formatNum(baseItem.itemData.getItemAmount());
			}
			this.startTimer(true);
		}
	}

	/**
	 * 启动/停止自动领取计时器
	 */
	public startTimer(isStart: boolean): void {
		this.stopTimer();
		if (isStart) {
			this.updateTip();
			App.TimerManager.doTimer(1000, this.leftTime, this.updateTip, this, this.gotoTask, this);
		}
	}

	private stopTimer(): void {
		this.current = this.leftTime;
		App.TimerManager.remove(this.updateTip, this);
	}

	/**去执行任务 */
	private gotoTask(): void {
		if (this.npcTask != null) {
			let taskType: ETaskType = this.npcTask.task.type_I;
			switch (taskType) {
				case ETaskType.ETaskTypeTalk:
					EventManager.dispatch(LocalEventEnum.TaskTalkToNpc, { "npcId": this.npcId, "taskCode": this.npcTask.task.code_I, "sProcesscode": this.npcTask.task.processes.data[0].code_I });
					break;
				case ETaskType.ETaskTypePassNewPlayerCopy:
					EventManager.dispatch(LocalEventEnum.CopyReqEnter, this.npcTask.task.copyCode_I);
					break;
				default:
					break;
			}
		}
		this.stopTimer();
		EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.TaskDialog);
	}

	private updateTip(): void {
		this.timeTxt.text = `${this.current}秒后自动${this.getBtnName()}`;
		this.current--;
	}

	private getBtnName(): string {
		switch (this.taskType) {
			case ETaskType.ETaskTypeTalk:
				return "完成任务";
			case ETaskType.ETaskTypePassNewPlayerCopy:
				return "进入副本";
			default:
				return "";
		}
	}

}