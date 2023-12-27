class LegendCopyView extends BaseCopyPanel {
    private timeTxt: fairygui.GTextField;
    private nameLoader: GLoader;
    private lookupBtn: fairygui.GButton;
    private headList: List;
    private stepCount: number = 0;
    private interId: number;
    public constructor(copyInfo: any) {
        super(copyInfo, "LegendCopyView");
        this.isCenter = true;
    }

    public initOptUI(): void {
        super.initOptUI();
        this.nameLoader = this.getGObject("loader_name") as GLoader;
        this.timeTxt = this.getGObject("txt_time").asTextField;
        this.lookupBtn = this.getGObject("btn_lookup").asButton;
        this.lookupBtn.addClickListener(this.onClickLookup, this);
        this.headList = new List(this.getGObject("list_head").asList);
        this.headList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);

        this.XPSetBtn.visible = true;
    }

    protected addListenerOnShow(): void {
        super.addListenerOnShow();
        // App.TimerManager.doTimer(1000, 0, this.step, this);
        this.interId = egret.setInterval(this.step, this, 1000);
        this.addListen1(LocalEventEnum.MonsterDied, this.onMonsterDied, this);
    }

    public hide(param: any = null, callBack: CallBack = null): void {
        super.hide(param, callBack);
        // App.TimerManager.removeAll(this);
        egret.clearInterval(this.interId);
        this.stepCount = 0;
        // this.headList.setVirtual([]);
        this.headList.data = [];
    }

    public updateAll():void {
        super.updateAll();

        this.nameLoader.load(URLManager.getModuleImgUrl("title_" + this.copyInf.code + ".png", PackNameEnum.CopyLengend));
        // this.forceStep();
    }

    private onClickLookup() {
        EventManager.dispatch(UIEventEnum.CopyLegendStrategedOpen, this.copyInf.code);
    }

    private forceStep():void {
        if (this.parent)
            this.step(true);
    }

    private step(force:boolean = false) {
        if (ControllerManager.scene.sceneState != SceneStateEnum.AllReady) return;
        this.stepCount++;
        if (force || this.stepCount % 2 == 0) {//更新怪物列表
            let monsters:RpgGameObject[] = CacheManager.map.getTargetsSortByDis(0, -1, RpgObjectType.Monster);
            let first4:RpgGameObject[];
            if (monsters.length <= 4) first4 = monsters;
            else first4 = monsters.splice(0, 4);
            // this.headList.setVirtual(first4);
            this.headList.data = first4;
            this.headList.list.resizeToFit(4);
        }
        let leftTime:number = (CacheManager.copy.copyEndTime - egret.getTimer()) / 1000;
        this.timeTxt.text = App.StringUtils.substitude(LangLegend.LANG4, App.DateUtils.getTimeStrBySeconds(leftTime, DateUtils.FORMAT_5, false));
    }

    private onClickItem(evt:fairygui.ItemEvent) {
        let item:LegendBossHeadItem = (evt.itemObject as LegendBossHeadItem);
        // EventManager.dispatch(LocalEventEnum.FocusAttack, item.getData());
        // if (!CacheManager.king.isAutoFighting) EventManager.dispatch(LocalEventEnum.AutoStartFight);
        CacheManager.bossNew.battleObj = item.getData();
        // this.headList.list.refreshVirtualList();
        this.headList.data = this.headList.data;
        this.headList.list.resizeToFit(4);
    }

    private onMonsterDied() {
        App.TimerManager.doFrame(20, 1, this.forceStep, this);
    }
}