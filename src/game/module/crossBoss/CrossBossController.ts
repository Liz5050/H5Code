class CrossBossController extends BaseController {
    private module: CrossBossModule;
    private bossShowWin:CrossBossShowPanel;
    private bossRewardWin: CrossBossRewardPanel;

    public constructor(){
        super(ModuleEnum.CrossBoss);
    }

    // public getModule():CrossModule {
    //     return <CrossModule>this._module;
    // }
    public initView(): BaseModule {
        this.module = new CrossBossModule();
        return this.module;
    }

    protected addListenerOnInit(): void {
        this.addListen0(LocalEventEnum.CrossBossReqEnterCopy, this.onReqEnterBossCopy, this);
        this.addListen0(LocalEventEnum.CrossBossCanclOwn, this.onReqCanclBossOwn, this);
        this.addListen0(NetEventEnum.BossListInfUpdate, this.onBossInfoUpdate, this);
        this.addListen0(NetEventEnum.BossInfUpdate, this.onBossInfoUpdate, this);
        this.addListen0(UIEventEnum.CrossBossShowOpen, this.onOpenBossShowWin, this);
        this.addListen0(UIEventEnum.CrossBossRewardOpen, this.onOpenBossRewardWin, this);
        this.addListen0(UIEventEnum.CrossBossResultOpen, this.onOpenBossResultWin, this);
        this.addListen0(NetEventEnum.CrossBossCollectTimesUpdate,this.onLeftTimeUpdate,this);
        this.addListen0(NetEventEnum.CrossBossOwnTimesUpdate,this.onLeftTimeUpdate,this);
        this.addListen0(NetEventEnum.roleStateChanged, this.onRoleStateUpdate, this);

        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicNewCrossBossOpen],this.onOpenCrossBoss,this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicNewCrossBossCrossOpen],this.onOpenCrossBossCross,this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicNewCrossBossClose],this.onCloseCrossBoss,this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicNewCrossBossGetList],this.onCrossBossList,this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicNewCrossBossReward],this.onCrossBossReward,this);
    }

    public addListenerOnShow(): void {
        this.addListen0(NetEventEnum.copyLeft, this.onCopyLeft, this);

        ProxyManager.cross.reqGetCrossBossList();
    }

    private onCopyLeft(lastCopyType:number) {
        if (CopyUtils.isCrossBoss(lastCopyType)) {

            CacheManager.crossBoss.clearResult();
        }
    }

    /**
     * 进入副本
     * @param {number} bossCode
     */
    private onReqEnterBossCopy(bossCode:number) {
        //发进入boss副本协议
        let gameBoss:any = ConfigManager.mgGameBoss.getByPk(bossCode);
        if (gameBoss) {
            CacheManager.crossBoss.curBossCode = bossCode;
            ProxyManager.cross.reqEnterCrossBoss(gameBoss.copyCode,gameBoss.mapId);
        }
    }

    private onReqCanclBossOwn() {
        ProxyManager.cross.onReqCanclBossOwn();
        EventManager.dispatch(LocalEventEnum.AIStop);
    }

    private onOpenCrossBossCross() {
        CacheManager.crossBoss.isCrossOpen = true;
        this.onOpenCrossBoss();
    }

    private onOpenCrossBoss() {
        CacheManager.crossBoss.isOpen = true;
        // EventManager.dispatch(LocalEventEnum.AddHomeIcon, IconResId.Cross);
        this.onRoleStateUpdate();
    }

    private onCloseCrossBoss() {
        CacheManager.crossBoss.isOpen = false;
        // EventManager.dispatch(LocalEventEnum.RemoveHomeIcon, IconResId.Cross);
    }

    private onRoleStateUpdate() {
        if (ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.CrossBoss],false)) {
            ProxyManager.cross.reqGetCrossBossList();
            this.removeListener(NetEventEnum.roleStateChanged, this.onRoleStateUpdate, this);
        }
    }

    /**
     * SNewCrossBossFieldList
     */
    private onCrossBossList(msg:any) {
        CacheManager.crossBoss.updateBossList(msg.fieldList.data);
        this.isShow && this.module.updateCrossBoss();
        EventManager.dispatch(LocalEventEnum.CrossBossListUpdate);
        EventManager.dispatch(LocalEventEnum.CrossTips);
    }

    private onBossInfoUpdate() {
        if (this.isShow) {
            this.module.updateBossListCD();
        }
        EventManager.dispatch(LocalEventEnum.CrossTips);
    }

    private onOpenBossShowWin(data:any) {
        if (!this.bossShowWin) {
            this.bossShowWin = new CrossBossShowPanel();
        }
        this.bossShowWin.show(data);
    }

    private onOpenBossRewardWin(data:any) {
        if (!this.bossRewardWin) {
            this.bossRewardWin = new CrossBossRewardPanel();
        }
        this.bossRewardWin.show(data);
    }

    /**
     * 归属奖励 Message::Public::SNewCrossBossReward
     */
    private onCrossBossReward(msg:any) {
        CacheManager.crossBoss.updateResult(msg);
        EventManager.dispatch(LocalEventEnum.CrossBossResult, msg.type_I);
        let resultInfo:any = CacheManager.crossBoss.getResult(msg.type_I, true);
        this.onOpenBossResultWin(resultInfo);
    }

    private onLeftTimeUpdate() {
        this.isShow && this.module.updateBossLeftTimes();
        EventManager.dispatch(LocalEventEnum.CrossTips);
    }

    private onOpenBossResultWin(msg:any) {
        if (!msg) return;
        let resultWin:WindowBossResult = ControllerManager.bossNew.resultWindow;
        if (!resultWin || !resultWin.isShow) {
            if (msg.type_I == ECrossBossRewardType.COLLECT_OWN)
                show();
            else
                App.TimerManager.doDelay(4000, show, this);
        }

        function show() {
            if (CacheManager.copy.isInCopyByType(ECopyType.ECopyNewCrossBoss)) {
                if(!ControllerManager.bossNew.resultWindow) {
                    ControllerManager.bossNew.resultWindow = new WindowBossResult();
                }
                ControllerManager.bossNew.resultWindow.show(msg);
            }
        }
    }
}