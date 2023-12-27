class ChangeCareerModule extends BaseWindow
{
    private static STATUS_UNFINISH:number = 0;//未完成
    private static STATUS_FINISH:number = 1;//已完成
    private static STATUS_SUCESS:number = 2;//已成功转职

    private ccTask:TaskBase;
    private titleTxt: fairygui.GTextField;
    private taskTxt: fairygui.GRichTextField;
    private goBtn: fairygui.GButton;
    private viewCtl1: fairygui.Controller;
    private stageBtn: fairygui.GButton;
    private viewCtl2: fairygui.Controller;
    private tabPanels:Array<BaseTabPanel>;
    private curTabPanel:BaseTabPanel;
    private onekeyBtn: fairygui.GButton;
    private currentCareerTxt: fairygui.GTextField;
    private nextCareerTxt: fairygui.GTextField;
    private tabs: fairygui.GButton[];
    private lastIndex:number;

    public constructor()
    {
        super(PackNameEnum.ChangeCareer, "Main", ModuleEnum.ChangeCareer);
    }

    public initOptUI(): void
    {
        this.viewCtl1 = this.getController("c1");
        this.viewCtl1.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onTabChanged, this);
        this.viewCtl2 = this.getController("c2");
        this.tabPanels = [];
        this.tabPanels.push(new ChangeCareerTab1(this.getGObject("panel_career1").asCom, this.viewCtl1, 0));
        this.tabPanels.push(new ChangeCareerTab2(this.getGObject("panel_career2").asCom, this.viewCtl1, 1));
        this.tabPanels.push(new ChangeCareerTab3(this.getGObject("panel_career3").asCom, this.viewCtl1, 2));
        this.tabs = [];
        let tabBtn:fairygui.GButton;
        for (let i = 1; i <= 3; i++) {
            tabBtn = this.getGObject("btn_career" + i).asButton;
            tabBtn.visible = false;
            this.tabs.push(tabBtn);
        }

        this.currentCareerTxt = this.getGObject("txt_current").asTextField;
        this.nextCareerTxt = this.getGObject("txt_next").asTextField;
        this.titleTxt = this.getGObject("txt_title").asTextField;
        this.taskTxt = this.getGObject("txt_task").asRichTextField;
        this.goBtn = this.getGObject("btn_go").asButton;
        this.goBtn.addClickListener(this.onClickGo, this);
        this.stageBtn = this.getGObject("btn_stage").asButton;
        this.stageBtn.addClickListener(this.onClickStage, this);
        this.onekeyBtn = this.getGObject("btn_onekey").asButton;
        this.onekeyBtn.addClickListener(this.onClickOnekey, this);
    }

    public updateAll(data?:any): void
    {
        let roleState:number = CacheManager.role.getRoleState();
        let idx:number = roleState;
        if (data != null) {
            idx = data as number;
        } else if (ConfigManager.mgOpen.isOpenedByKey("ChangeCareer" + (roleState+1)) == false) {
            idx = roleState-1>0?roleState-1:0;//下一转还没开启
        }
        if (this.lastIndex == idx && data != null) return;
        this.lastIndex = idx;
        let career:number = CacheManager.role.getRoleCareer();
        this.viewCtl1.selectedIndex = idx;
        this.curTabPanel = this.tabPanels[idx];
        this.updateTask();
        this.updateContent(idx);
        this.updateTabs();
        this.updateStatus(idx, roleState);
    }

    public updateTask() {
        let ccTask:TaskBase = ControllerManager.changeCareer.getTask();
        if (this.ccTask != ccTask) {
            this.ccTask = ccTask;
        }
        if (this.ccTask) {
            this.taskTxt.text = this.ccTask.traceDesc;
        }
    }

    private updateContent(roleState:number) {
        let baseCareer:number = CacheManager.role.getBaseCareer();
        let stateData:ChangeCareerStateData = ConfigManager.changeCareer.getStateData(roleState, baseCareer);
        if (stateData) {
            this.titleTxt.text = stateData.subStateName;
            this.curTabPanel.updateAll(stateData);
        }
        let career:number = baseCareer + roleState * 1000;
        let currentCareerName:string = ConfigManager.mgCareer.getCareerName(career);
        this.currentCareerTxt.text = currentCareerName;
        let nextCareer:number = 1000 + career;
        let nextCareerCfg:any = ConfigManager.mgCareer.getByPk(nextCareer);
        let nextCareerName:string = nextCareerCfg ? nextCareerCfg.name : null;
        this.nextCareerTxt.text = nextCareerName || currentCareerName;
    }

    private updateTabs() :void{
        let roleState:number = CacheManager.role.getRoleState();
        for (let i = 0; i < roleState+1; i++) {
            if (ConfigManager.mgOpen.isOpenedByKey("ChangeCareer" + (i+1), false))
                this.tabs[i].visible = true;
        }
    }

    private updateStatus(curIdx:number, roleState:number) :void{
        if (curIdx < roleState)
            this.viewCtl2.selectedIndex = ChangeCareerModule.STATUS_SUCESS;
        else if (this.ccTask && this.ccTask.isCompleted) {
            this.viewCtl2.selectedIndex = ChangeCareerModule.STATUS_FINISH;
        } else {
            this.viewCtl2.selectedIndex = ChangeCareerModule.STATUS_UNFINISH;
        }
    }

    private onClickGo() :void {
        if (this.ccTask) {
            if (this.ccTask.isCompleted == false) {
                this.ccTask.gotoTask(false);
                this.hide();
                CacheManager.task.updateCurrentTraceTask(this.ccTask.sPlayerTask);
            } else {
                if (this.ccTask.task.type != ETaskType.ETaskTypeKillBossDropItem) {
                    if (this.ccTask.getNpcId() != 2) {
                        this.ccTask.gotoTask(false);
                        this.hide();
                        return;
                    }
                    EventManager.dispatch(LocalEventEnum.TaskSubmit, { "npcId": this.ccTask.sTask.endNpc_I, "taskCode": this.ccTask.sTask.code_I });
                } else {
                    EventManager.dispatch(LocalEventEnum.TaskKillBossDropSubmit, { "taskCode": this.ccTask.sTask.code_I });
                }
            }
        }
    }

    private onClickStage() :void {
        EventManager.dispatch(UIEventEnum.ChangeCareerStageOpen);
    }

    private onClickOnekey() :void {
        EventManager.dispatch(LocalEventEnum.ChangeCareerOneKey);
    }

    private onTabChanged(e: any) {
        this.updateAll(this.viewCtl1.selectedIndex);
    }

}