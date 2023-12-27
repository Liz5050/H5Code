class ChangeCareerController extends BaseController {
    private module: ChangeCareerModule;
    private stageWin: ChangeCareerStageWindow;
    private ccTaskVo: any;
    private ccTask: TaskBase;

    public constructor() {
        super(ModuleEnum.ChangeCareer);
        this.viewIndex = ViewIndex.Zero;
    }

    public initView(): BaseWindow {
        this.module = this.module || new ChangeCareerModule();
        return this.module;
    }

    public addListenerOnInit(): void {
        //任务相关
        this.addListen0(LocalEventEnum.TaskUpdateMy, this.onUpdateTask, this);
        this.addListen0(LocalEventEnum.TaskCanGetUpdated, this.onUpdateTask, this);
        this.addListen0(LocalEventEnum.TaskPlayerTaskUpdated, this.onUpdateTaskStatus, this);

        //
        this.addListen0(NetEventEnum.roleCareerChanged, this.onRoleCareerChange, this);
        this.addListen0(NetEventEnum.roleStateChanged, this.onRoleStateChange, this);
        //打开阶段目标
        this.addListen0(UIEventEnum.ChangeCareerStageOpen, this.onStageViewOpen, this);

        //一键完成
        this.addListen0(LocalEventEnum.ChangeCareerOneKey, this.onOneKey, this);
    }

    private onUpdateTask(): void {
        if (this.module && this.module.isShow) {
            this.module.updateAll();
        }
    }

    private onUpdateTaskStatus(): void {
        this.onUpdateTask();
        // if (this.ccTask && this.ccTask.isCompleted) {//完成转职任务后自动打开界面
        //     if (!this.module || !this.module.isShow) {
        //         this.module.show();
        //     }
        // }
    }

    private onRoleStateChange(): void {

    }

    private onRoleCareerChange(): void {

    }

    private onStageViewOpen() :void{
        if (!this.stageWin)
            this.stageWin = new ChangeCareerStageWindow();
        this.stageWin.show();
    }

    private onOneKey(): void {
        //判断元宝
        let alertMsg:string = App.StringUtils.substitude(LangChangeCareer.LANG1, ChangeCareerConfig.COST_ONEKEY);
        AlertII.show(alertMsg, null, this.doOnekey, this);
    }

    private doOnekey(alertType:AlertType): void {
        if (alertType == AlertType.YES && MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold, 1000)) {
            let msg: any = {"cmd": ECmdGame[ECmdGame.ECmdGameOneKeyRoleState3], "body": {}};
            App.Socket.send(msg);
        }
    }

    private getTaskVo() :void{
        //完成转职后不再做判断
        let ccTaskVo:any = CacheManager.task.getPlayerTaskByGroup(ETaskGroup.ETaskGroupChangeCareer);
        if (!ccTaskVo) ccTaskVo = CacheManager.task.getCanGetTaskByGroup(ETaskGroup.ETaskGroupChangeCareer);
        if (this.ccTaskVo != ccTaskVo) {
            this.ccTaskVo = ccTaskVo;
            this.ccTask = ccTaskVo ? TaskUtil.getPlayerTask(ccTaskVo) : null;
        }
    }

    public getTask() :TaskBase {
        this.getTaskVo();
        return this.ccTask;
    }
}