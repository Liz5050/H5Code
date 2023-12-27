/**
 * 主界面任务追踪界面
 */
class TaskTracePanel extends fairygui.GComponent {
    private titleTxt: fairygui.GRichTextField;
    private descTxt: fairygui.GRichTextField;
    private clickTxt: fairygui.GRichTextField;
    private guideClickView: GuideClickView2;
    private getMc: UIMovieClip;
    private endMc: UIMovieClip;
    private completeMc: UIMovieClip;
    private unCompleteMc: UIMovieClip;
    private touchGraph: fairygui.GGraph;
    private _friendIcon: HomeFriendIcon;

    private playerTask: TaskBase;
    private lastTaskCode: number = -1;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.titleTxt = this.getChild("txt_title").asRichTextField;
        this.descTxt = this.getChild("txt_desc").asRichTextField;
        this.touchGraph = this.getChild("graph_touch").asGraph;
        this.touchGraph.addClickListener(this.clickThis, this);
    }

    /**
     * 根据任务数据更新
     * @param sPlayerTask
     */
    public update(sPlayerTask: any): void {
        this.playerTask = TaskUtil.getPlayerTask(sPlayerTask);
        if (this.playerTask != null) {
            this.visible = true;

            this.titleTxt.text = this.playerTask.traceTitle;
            this.descTxt.text = this.playerTask.traceDesc;
            EventManager.dispatch(LocalEventEnum.GuideByTask, this.playerTask.code, this.playerTask.status);

            this.updateTaskTraceMc();

            if (this.playerTask.code != this.lastTaskCode || CacheManager.role.isLoginBack) {//切换任务
                CacheManager.role.isLoginBack = false;
                if (this.playerTask.isNeedAutoGoto) {//处理自动前往
                    this.gotoTask();
                }
                //播放特效
                this.playTaskMc(this.playerTask.status);
            }
            this.lastTaskCode = this.playerTask.code;
        }
    }

    /**
     * 前往完成任务
     */
    public gotoTask(): void {
        if (this.playerTask != null) {
            if (TaskUtil.isChangeCareer(this.playerTask.group) && this.playerTask.isCompleted && this.playerTask.getNpcId() == 2) {
                //主要是有的任务覆盖了gotoTask，如副本任务TaskPassNewPlayerCopy
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.ChangeCareer);
                return;
            } else {
                this.playerTask.gotoTask(false);
            }
        }
    }

    /**
     * 显示指引
     */
    // public showGuide(guideStepInfo: GuideStepInfo): void {
    //     if (this.guideClickView == null) {
    //         this.guideClickView = new GuideClickView();
    //         this.guideClickView.clickMc.setSize(256, 256);
    //         this.guideClickView.clickMc.setPivot(0.5, 0.5, true);
    //         this.guideClickView.clickMc.rotation = -45;
    //         this.guideClickView.setMcXY(173, 33);
    //         this.guideClickView.setTipXY(100, 32);
    //     }
    //     this.guideClickView.guideKey = guideStepInfo.key;
    //     this.guideClickView.updateTip(guideStepInfo.desc);
    //     this.addChild(this.guideClickView);

    //     // this.swapFriendIconIndex(false);
    // }

    public showGuide(guideStepInfo: GuideStepInfo): void {
        if (this.guideClickView == null) {
            this.guideClickView = new GuideClickView2(-1);
        }
        // this.guideClickView.guideKey = guideStepInfo.key;
        // this.guideClickView.updateTip(guideStepInfo.desc);
        // this.addChild(this.guideClickView);
        this.guideClickView.addToParent(this);

        // this.swapFriendIconIndex(false);
    }

    public set friendIcon(value: HomeFriendIcon) {
        this._friendIcon = value;
    }

    /**
     * 播放任务特效
     * @param status 任务状态
     */
    private playTaskMc(status: ETaskStatus): void {
        let mc: UIMovieClip;
        if (status == ETaskStatus.ETaskStatusNotCompleted) {
            if (this.getMc == null) {
                this.getMc = UIMovieManager.get(PackNameEnum.MCTaskGet);
            }
            mc = this.getMc;
        } else if (status == ETaskStatus.ETaskStatusHadCompleted) {
            // if (this.endMc == null) {
            //     this.endMc = UIMovieManager.get(PackNameEnum.MCTaskEnd);
            // }
            // mc = this.endMc;
            return;
        }

        if (mc) {
            this.addChild(mc);
            mc.x = -111;
            mc.y = -365;
            mc.autoRemove = true;
            mc.playing = true;
        }
    }

    private playUnCompleteMc(isPlay: boolean): void {
        if (isPlay) {
            if (this.unCompleteMc == null) {
                this.unCompleteMc = UIMovieManager.get(PackNameEnum.MCTaskUnComplete);
                this.unCompleteMc.setXY(-4, -6);
            }
            this.addChild(this.unCompleteMc);
            this.unCompleteMc.setPlaySettings(0, -1, -1, -1);
            this.unCompleteMc.playing = true;
            if (this.guideClickView && this.guideClickView.parent) {
                if (this.getChildIndex(this.unCompleteMc) > this.getChildIndex(this.guideClickView)) {
                    this.swapChildren(this.guideClickView, this.unCompleteMc);
                }
            }
        } else {
            if (this.unCompleteMc != null) {
                this.unCompleteMc.removeFromParent();
                this.unCompleteMc.playing = false;
            }
        }
    }

    public updateTaskTraceMc(): void {
        if (this.playerTask != null && ((this.playerTask.status == ETaskStatus.ETaskStatusHadCompleted && this.playerTask.type != ETaskType.ETaskTypeTalk) || (this.playerTask.isCheckPoint && CacheManager.checkPoint.canChallenge))) {
            if (this.completeMc == null) {
                this.completeMc = UIMovieManager.get(PackNameEnum.MCTaskComplete);
                this.completeMc.setXY(19, -6);
            }
            this.addChild(this.completeMc);
            this.completeMc.setPlaySettings(0, -1, -1, -1);
            this.completeMc.playing = true;
            this.playUnCompleteMc(false);

            if (this.guideClickView != null && this.guideClickView.parent != null) {//交换层级，点击层在最上
                if (this.getChildIndex(this.completeMc) > this.getChildIndex(this.guideClickView)) {
                    this.swapChildren(this.guideClickView, this.completeMc);
                }
            }
        } else {
            if (this.completeMc != null) {
                this.completeMc.removeFromParent();
                this.completeMc.playing = false;
            }
            if (this.playerTask != null && (this.playerTask.status == ETaskStatus.ETaskStatusNotCompleted || this.playerTask.type == ETaskType.ETaskTypeTalk)) {
                this.playUnCompleteMc(true);
            }
        }
    }

    public clickThis(e: TouchEvent = null): void {
        if (this.playerTask &&
            ((this.playerTask instanceof TaskCount && this.playerTask.isChallengeCheckPointTask) || this.playerTask.type == ETaskType.ETaskTypeKillBossCount) &&
            CacheManager.map.isInMainCity) {
            Tip.showLeftTip("请先传送到野外再进行任务");
            return;
        }
        if (CacheManager.guide.onClickTaskTracePanel()) {
            if (!CacheManager.checkPoint.canChallenge) {//目前点击触发的为挑战关卡
                Tip.showTaskTopTip(LangCheckPoint.L2);
                return;
            }
            return;
        }
        if (this.guideClickView != null && this.guideClickView.isShow) {
            if (this.playerTask instanceof TaskCount && this.playerTask.isChallengeCheckPointTask) {
                if (CacheManager.checkPoint.canChallenge) {
                    this.guideClickView.onClick();
                    // this.swapFriendIconIndex(true);
                }
            } else {
                this.guideClickView.onClick();
                // this.swapFriendIconIndex(true);
            }
        }

        this.gotoTask();
        if (e) {
            //阻止事件冒泡，否则瞬间显示GuideMask时触发了GuideMask的点击，而点击位置与下一步指引位置重合时导致跳过了下一步
            e.stopPropagation();
        }
    }

    /**
     * 交换层级。当有指引时，追踪在上，好友在下。反之
     * @param isFriendInTop 好友是否要在顶层
     */
    public swapFriendIconIndex(isFriendInTop: boolean): void {
        let friendIndex: number = this.parent.getChildIndex(this._friendIcon);
        let thisIndex: number = this.parent.getChildIndex(this);
        if ((isFriendInTop && friendIndex < thisIndex) || (!isFriendInTop && friendIndex > thisIndex)) {
            this.parent.swapChildren(this._friendIcon, this);
        }
    }
}