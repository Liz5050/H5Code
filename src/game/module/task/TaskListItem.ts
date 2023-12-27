/**
 * 任务面板列表项
 */
class TaskListItem extends ListRenderer {
	public isGuiding: boolean;
	private flagLoader: GLoader;
	private statusTxt: fairygui.GRichTextField;
	private cDetail: fairygui.Controller;
	private cFly: fairygui.Controller;
	private titleBtn: fairygui.GButton;
	private detailPanel: fairygui.GComponent;
	private flyBtn: fairygui.GButton;
	private titleTxt: fairygui.GRichTextField;
	private descTxt: fairygui.GRichTextField;
	private detailDescTxt: fairygui.GRichTextField;
	private rewardList: List;
	private goBtn: fairygui.GButton;
	private finishBtn: fairygui.GButton;
	private arrow: GuideArrow;
	private finger: GuideFinger;

	private playerTask: TaskBase;
	private _isShowDetail: boolean;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.cDetail = this.getController("c1");
		this.titleBtn = this.getChild("panel_title").asButton;
		this.detailPanel = this.getChild("panel_detail").asCom;
		this.flagLoader = <GLoader>this.titleBtn.getChild("loader_flag");
		this.statusTxt = this.titleBtn.getChild("txt_status").asRichTextField;
		this.cFly = this.titleBtn.getController("c1");
		this.flyBtn = this.titleBtn.getChild("btn_fly").asButton;
		this.titleTxt = this.titleBtn.getChild("txt_title").asRichTextField;
		this.descTxt = this.titleBtn.getChild("txt_desc").asRichTextField;

		//详情
		this.detailDescTxt = this.detailPanel.getChild("txt_desc").asRichTextField;
		this.rewardList = new List(this.detailPanel.getChild("list_reward").asList);
		this.goBtn = this.detailPanel.getChild("btn_go").asButton;
		this.finishBtn = this.detailPanel.getChild("btn_finish").asButton;

		//点击
		this.flyBtn.addClickListener(this.clickFly, this);
		this.goBtn.addClickListener(this.clickGo, this);
		this.finishBtn.addClickListener(this.clickFinish, this);

		this.addClickListener(this.clickItem, this);
	}

	public setData(data: any): void {
		this._data = data;
		this.playerTask = <TaskBase>data;
		if (this.playerTask != null) {
			this.flagLoader.url = URLManager.getPackResUrl(PackNameEnum.Task, `flag_${this.playerTask.group}`);
			this.statusTxt.text = this.getHtmlState(this.playerTask.status);
			this.titleTxt.text = this.playerTask.moduleTitle;
			this.descTxt.text = this.playerTask.moduleDesc;
			this.flyBtn.visible = this.playerTask.isCanFly;
			let CIndex: number = this.playerTask.isCanFly ? 1 : 0;
			this.cFly.selectedIndex = CIndex;
			this.detailDescTxt.text = this.playerTask.modulDetail;

			this.rewardList.data = this.playerTask.getRewards();
			this.finishBtn.visible = TaskUtil.isGuildRing(this.playerTask.group);
		}
	}

	/**
	 * 显示前往指引
	 */
	public showGuideGoto(): void {
		this.isGuiding = true;

		if (this.finger == null) {
			this.finger = new GuideFinger();
		}
		this.finger.x = this.width / 2;
		this.finger.y = this.height / 2;
		this.addChild(this.finger);

		if (this.arrow == null) {
			this.arrow = new GuideArrow(GuideArrowDirection.Left, this.goBtn.width, this.goBtn.height);
		}
		this.arrow.x = this.goBtn.x;
		this.arrow.y = this.goBtn.y;
		this.detailPanel.addChild(this.arrow);
	}

	/**
	 * 是否显示任务详情
	 */
	public set isShowDetail(isShow: boolean) {
		if (isShow) {
			this.cDetail.selectedIndex = 1;
		} else {
			this.cDetail.selectedIndex = 0;
		}
		this.titleBtn.selected = isShow;
		this._isShowDetail = isShow;
	}

	public get isShowDetail(): boolean {
		return this._isShowDetail;
	}

	/**
	 * 控制list显示
	 */
	public get height(): number {
		if (this.cDetail && this.cDetail.selectedIndex == 1) {
			return 317;
		}
		return 97;
	}

	public get gotoBtn(): fairygui.GButton {
		return this.goBtn;
	}

	/**
	 * 小飞鞋传送
	 */
	private clickFly(e: any): void {
		this.gotoTask(true);
	}

	/**
	 * 点击前往
	 */
	private clickGo(e: any): void {
		this.gotoTask(false);
		if (this.isGuiding) {
			this.clearGuide();
		}
	}

	/**
	 * 清空指引
	 */
	public clearGuide(): void {
		this.isGuiding = false;
		if (this.finger != null) {
			this.finger.removeFromParent();
		}
		if (this.arrow != null) {
			this.arrow.removeFromParent();
		}
		EventManager.dispatch(UIEventEnum.GuideNextStep);
	}

	private gotoTask(isConvey: boolean = false): void {
		if (this.playerTask != null) {
			this.playerTask.gotoTask(isConvey);
		}
		CacheManager.task.updateCurrentTraceTask(this.playerTask.sPlayerTask);
		EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.Task);
	}

	/**
	 * 点击立即完成
	 */
	private clickFinish(): void {
		//TODO 立即完成仙盟任务
	}

	private clickItem(): void {
		if (this.isGuiding) {
			if (this.finger != null) {
				this.finger.removeFromParent();
			}
		}
	}

	/**
	 * 获取状态文本
	 */
	private getHtmlState(status: ETaskStatus): string {
		let text: string = "";
		if (status == ETaskStatus.ETaskStatusCanGet) {
			return `<font color='#01ab24'>可领取</font>`;
		} else if (status == ETaskStatus.ETaskStatusHadCompleted) {
			return `<font color='#01ab24'>已完成</font>`;
		} else {
			return `<font color='#fea700'>进行中</font>`;
		}
	}
}