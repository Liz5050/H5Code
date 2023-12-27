/**
 * 完成提交任务
 */
class TaskDialogSubmitPanel extends BaseTabPanel {
	private titleTxt: fairygui.GTextField;
	private descTxt: fairygui.GRichTextField;
	private rewardList: List;
	private timeTxt: fairygui.GTextField;
	private submitBtn: fairygui.GButton;
	private pointComp: fairygui.GComponent;

	private leftTime: number = 15;
	private current: number = this.leftTime;
	private npcTask: any;

	public initOptUI(): void {
		this.titleTxt = this.getGObject("txt_title").asTextField;
		this.descTxt = this.getGObject("txt_desc").asRichTextField;
		this.timeTxt = this.getGObject("txt_time").asTextField;
		this.rewardList = new List(this.getGObject("list_reward").asList);
		this.submitBtn = this.getGObject("btn_receive").asButton;
		this.submitBtn.addClickListener(this.submitTask, this);
		this.getGObject("loader_clickTitle").addClickListener(this.submitTask, this);
		this.getGObject("loader_click").addClickListener(this.submitTask, this);
		this.pointComp = this.getGObject("comp_point").asCom;
		this.pointComp.touchable = false;
	}

	public updateAll(): void {

	}

	public updateByNpcTask(npcTask: any): void {
		this.npcTask = npcTask;
		if (npcTask != null) {
			let npcInfo: any = ConfigManager.npc.getByPk(npcTask.task.endNpc_I);
			let task: any = ConfigManager.task.getByPk(npcTask.task.code_I);
			if (task != null) {
				this.titleTxt.text = task.name;
			} else {
				this.titleTxt.text = npcInfo.name;
			}

			let talkId: number = npcTask.task.endTalkId_I;
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
			this.startTimer(true);

			this.pointComp.visible = CacheManager.task.isInNewPlayerLevel;
		}
	}

	/**
	 * 启动/停止自动领取计时器
	 */
	public startTimer(isStart: boolean): void {
		this.stopTimer();
		if (isStart) {
			this.updateTip();
			App.TimerManager.doTimer(1000, this.leftTime, this.updateTip, this, this.submitTask, this);
		}
	}

	private stopTimer(): void {
		this.current = this.leftTime;
		App.TimerManager.remove(this.updateTip, this);
	}

	/**提交任务 */
	private submitTask(): void {
		if (this.npcTask != null) {
			EventManager.dispatch(LocalEventEnum.TaskSubmit, { "npcId": this.npcTask.task.endNpc_I, "taskCode": this.npcTask.task.code_I });
		}
	}

	private updateTip(): void {
		this.timeTxt.text = `${this.current}秒后自动领取奖励`;
		this.current--;
	}

}