class TaskModule extends BaseWindow {
	private taskList: List;
	private guidingItem: TaskListItem;

	public constructor(moduleId: ModuleEnum) {
		super(PackNameEnum.Task, "Main", moduleId);
	}

	public initOptUI(): void {
		this.taskList = new List(this.getGObject("list_task").asList);
		this.taskList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
	}

	public updateAll(): void {
		this.taskList.data = CacheManager.task.getModulePlayerTasks();
		this.taskList.selectedIndex = 0;
	}

	/**
	 * 指引点击前往任务
	 */
	public guideGotoTask(taskCode: number): void {
		let index: number = this.getTaskIndex(taskCode);
		let item: TaskListItem = <TaskListItem>this.taskList.list._children[index];
		if (item) {
			item.isShowDetail = false;
			this.taskList.list.setBoundsChangedFlag();
			item.showGuideGoto();
			this.taskList.scrollToView(index);
		}
		this.guidingItem = item;
	}

	public onHide(): void {
		super.onHide();
		if (this.guidingItem != null) {
			this.guidingItem.clearGuide();
		}
	}

	private onClickItem(e: fairygui.ItemEvent): void {
		let taskItem: TaskListItem = <TaskListItem>e.itemObject;
		if (taskItem.isShowDetail) {
			taskItem.isShowDetail = false;
			this.taskList.list.setBoundsChangedFlag();
			return;
		}
		let item: TaskListItem;
		for (let i = 0; i < this.taskList.list.numItems; i++) {
			item = <TaskListItem>this.taskList.list.getChildAt(i);
			item.isShowDetail = item == taskItem;
		}
		//重置位置
		this.taskList.list.setBoundsChangedFlag();
	}

	private getTaskIndex(code: number): number {
		for (let i: number = 0; i < this.taskList.data.length; i++) {
			if (code == this.taskList.data[i].code) {
				return i;
			}
		}
		return -1;
	}
}