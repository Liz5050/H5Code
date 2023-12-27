/**
 * 任务对话模块
 */
class TaskDialogModule extends BaseWindow {
    // private tabController: fairygui.Controller;
    // private talkPanel: TaskDialogTalkPanel;
    // private getPanel: TaskDialogGetPanel;
    // private notCompletePanel: TaskDialogNotCompletedPanel;
    // private submitPanel: TaskDialogSubmitPanel;
    private thisGroup: fairygui.GGroup;
    private bgLoader: GLoader;
    private avatarLoader: GLoader;
    private titleTxt: fairygui.GTextField;
    private descTxt: fairygui.GRichTextField;
    private itemList: List;
    private getBtn: fairygui.GButton;
    private leftTimeTxt: fairygui.GRichTextField;

    private leftTime: number = 5;//秒
    private current: number = this.leftTime;
    private npcTask: any;
    private isHadGuide: boolean = true;

    public constructor(moduleId: ModuleEnum) {
        super(ModuleEnum[moduleId], "Main", moduleId, LayerManager.UI_Tips);
        this.isPopup = false;
        this.isAnimateShow = false;
        this.modalAlpha = 0;
    }

    public initOptUI(): void {
        // this.tabController = this.getController("c1");

        // this.getPanel = new TaskDialogGetPanel(this.getGObject("panel_get").asCom, this.tabController, 0);
        // this.notCompletePanel = new TaskDialogNotCompletedPanel(this.getGObject("panel_not").asCom, this.tabController, 1);
        // this.submitPanel = new TaskDialogSubmitPanel(this.getGObject("panel_submit").asCom, this.tabController, 2);
        // this.talkPanel = new TaskDialogTalkPanel(this.getGObject("panel_talk").asCom, this.tabController, 5);
        // this.frame.addClickListener(this.clickFrame, this);
        this.thisGroup = this.getGObject("group_this").asGroup;
        this.thisGroup.visible = false;
        this.bgLoader = <GLoader>this.getGObject("loader_bg");
        this.avatarLoader = <GLoader>this.getGObject("loader_avatar");
        this.titleTxt = this.getGObject("txt_title").asTextField;
        this.descTxt = this.getGObject("txt_desc").asRichTextField;
        this.itemList = new List(this.getGObject("list_item").asList);
        this.getBtn = this.getGObject("btn_get").asButton;
        this.leftTimeTxt = this.getGObject("txt_leftTime").asRichTextField;
        // this.getBtn.addClickListener(this.clickGet, this);
        // this.addClickListener(this.clickGet, this);
        GuideTargetManager.reg(GuideTargetName.TaskDialogGetBtn, this.getBtn);
        this.bgLoader.load(URLManager.getModuleImgUrl("bg.png", PackNameEnum.TaskDialog));
        this.bgLoader.addEventListener(GLoader.RES_READY, this.onBgLoaded, this);
    }

    public updateAll(): void {

    }

    /**
     * 根据npc身上的任务更新
     */
    public updateByNpcTasks(npcTasks: Array<any>): void {
        // if (npcTasks != null && npcTasks.length > 0) {
        // 	let npcTask: any = CacheManager.task.autoSelectNpcTask(npcTasks);
        // 	if (npcTask.status_I == ETaskStatus.ETaskStatusCanGet) {
        // 		this.tabController.selectedIndex = 0;
        // 		this.getPanel.updateByNpcTask(npcTask);
        // 	} else if (npcTask.status_I == ETaskStatus.ETaskStatusNotCompleted) {
        // 		this.tabController.selectedIndex = 1;
        // 		this.notCompletePanel.updateByNpcTask(npcTask);
        // 	} else if (npcTask.status_I == ETaskStatus.ETaskStatusHadCompleted) {
        // 		this.tabController.selectedIndex = 2;
        // 		this.submitPanel.updateByNpcTask(npcTask);
        // 	} else {
        // 		this.tabController.selectedIndex = 5;
        // 		this.talkPanel.updateAll();
        // 	}
        // } else {
        // 	let npcId: number = CacheManager.king.selectedNpcId;
        // 	if (npcId > 0) {
        // 		if (npcId == ConfigManager.const.getConstValue("MgRingTaskNpc") && CacheManager.task.canGetRingTask(ETaskGroup.ETaskGroupMgRing)) {//赏金任务使者
        // 			this.tabController.selectedIndex = 0;
        // 			this.getPanel.updateRingTask(npcId, ETaskGroup.ETaskGroupMgRing);
        // 		} else if (npcId == ConfigManager.const.getConstValue("MgGuildTaskNpc") && CacheManager.task.canGetRingTask(ETaskGroup.ETaskGroupMgGuild)) {//仙盟任务使者
        // 			this.tabController.selectedIndex = 0;
        // 			this.getPanel.updateRingTask(npcId, ETaskGroup.ETaskGroupMgGuild);
        // 		} else {
        // 			this.tabController.selectedIndex = 5;
        // 			this.talkPanel.updateAll();
        // 		}
        // 	}
        // }


        if (npcTasks != null && npcTasks.length > 0) {
            let npcTask: any = CacheManager.task.autoSelectNpcTask(npcTasks);
            this.updateByNpcTask(npcTask);
        } else {
            this.isHadGuide = false;
        }
        this.startTimer();
    }

    public onShow(): void {
        super.onShow();
        LayerManager.UI_Tips.addClickListener(this.clickGet, this);
    }

    public onHide(): void {
        super.onHide();
        this.stopTimer();
        LayerManager.UI_Tips.removeClickListener(this.clickGet, this);
    }

    private clickGet(): void {
        this.submitTask();
        this.hide();
        if (this.isHadGuide) {
            EventManager.dispatch(UIEventEnum.GuideNextStep);
        }
    }

    /**
     * 启动自动领取计时器
     */
    private startTimer(): void {
        this.stopTimer();
        this.updateTip();
        App.TimerManager.doTimer(1000, this.leftTime, this.updateTip, this, this.clickGet, this);
    }

    private stopTimer(): void {
        this.current = this.leftTime;
        App.TimerManager.remove(this.updateTip, this);
    }

    private updateTip(): void {
        this.leftTimeTxt.text = HtmlUtil.html(`${this.current}秒`, Color.Green2) + "后自动领取";
        this.current--;
    }

    public updateByNpcTask(npcTask: any): void {
        this.npcTask = npcTask;
        if (npcTask != null) {
            let npcInfo: any = ConfigManager.npc.getByPk(npcTask.task.endNpc_I);
            this.titleTxt.text = npcInfo.name;
            // let task: any = ConfigManager.task.getByPk(npcTask.task.code_I);
            // if (task != null) {
            // 	this.titleTxt.text = task.name;
            // } else {
            // 	this.titleTxt.text = npcInfo.name;
            // }

            let talkId: number = npcTask.task.endTalkId_I;
            let talk: any = ConfigManager.taskTalk.getByPk(talkId);
            let desc: string = "";
            let avatar: string = "default";
            if (talk != null) {
                desc = talk.talkStr;
                if (talkId == 60015) {
                    desc = desc.replace("[name]", CacheManager.role.player.name_S);
                }
                if (talk.npcImg != null) {
                    avatar = talk.npcImg;
                }
            }

            this.avatarLoader.load(URLManager.getTaskHead(avatar));
            this.descTxt.text = desc;
            this.itemList.data = TaskUtil.getTaskRewards(npcTask.task.rewards.data);
            // this.itemList.list.resizeToFit();
            let baseItem: BaseItem;
            for (let item of this.itemList.list._children) {
                baseItem = (item as BaseItem);
                baseItem.txtName.visible = false;
                baseItem.showBind();
                baseItem.numTxt.text = App.MathUtils.formatNum(baseItem.itemData.getItemAmount());
            }
            let taskCode: number = npcTask.task.code_I;
            let status: ETaskStatus = npcTask.status_I;
            this.isHadGuide = ConfigManager.guide.isHadGuide(npcTask.task.code_I);
            let guideInfo: GuideInfo = ConfigManager.guide.getGuideInfo(taskCode, status);
            this.isHadGuide = guideInfo != null;
            if (this.isHadGuide) {
                EventManager.dispatch(LocalEventEnum.GuideByTask, taskCode, status);
            }
        }
    }

    /**
     * 对话中点击遮罩自动领取
     */
    public onGuideMaskClick(): void {
        this.clickGet();
    }

    /**提交任务 */
    private submitTask(): void {
        if (this.npcTask != null) {
            EventManager.dispatch(LocalEventEnum.TaskSubmit, {
                "npcId": this.npcTask.task.endNpc_I,
                "taskCode": this.npcTask.task.code_I
            });
        }
    }

    private onBgLoaded(): void {
        this.thisGroup.visible = true;
        this.startTimer();
    }
}