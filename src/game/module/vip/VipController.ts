class VipController extends BaseController {
    private module: VipModule;
    private renewWindow: VipRenewWindow;
    private overdueWindow: VipOverdueWindow;
    private expWindow: VipExperienceWindow;
    private overdueTime: number = 0;
    private canOpenOverdue: boolean;
    private vipGiftCtrl:VipGiftController;

    public constructor() {
        super(ModuleEnum.VIP);
    }

    public initView(): BaseModule {
        this.module = new VipModule();
        this.vipGiftCtrl.setModule(this.module);
        return this.module;
    }

    public addListenerOnInit(): void {
        this.vipGiftCtrl = new VipGiftController();

        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateVIPInfo], this.onUpdateVipInfo, this);
        // this.addMsgListener(EGateCommand[EGateCommand.ECmdGateTestVIPCard], this.onUpdateTasteVipInfo, this);
        // this.addMsgListener(EGateCommand[EGateCommand.ECmdGateVIPUpgrade], this.onUpdateVipType, this);
        // this.addMsgListener(EGateCommand[EGateCommand.ECmdGateVIPInvalid], this.onInvalidVip, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateVIPLevelGiftBagRewardInfo], this.onVipLevelRewardInfo, this);

        // this.addListen0(UIEventEnum.VipRenewOpen, this.onOpenVipRenew, this);
        // this.addListen0(UIEventEnum.VipExperienceOpen, this.onOpenVipExp, this);
        // this.addListen0(UIEventEnum.SceneMapUpdated, this.onSceneMapUpdated, this);
        this.addListen0(LocalEventEnum.VipReqVipReward, this.onReqVipLevelReward, this);
    }

    protected addListenerOnShow(): void {
        this.addListen1(LocalEventEnum.PackUpdateCode, this.onPackUpdateCode, this);
    }

    private onPackUpdateCode(updateCode:number,itemCodes:number[]):void {
        if (updateCode == UpdateCodeConfig.EUpdateCodeVip) {
            this.isShow && this.module.updateVipItemGet();
        } else if (updateCode == UpdateCodeConfig.EUpdateCodeVipGiftPackage) {
            this.isShow && this.module.updateVipGiftItemGet();
        }
    }

    private closeRenew(): void {
        this.renewWindow && this.renewWindow.hide();
    }

    private onOpenVipRenew(e?: any): void {
        if (!this.renewWindow)
            this.renewWindow = new VipRenewWindow();
        this.renewWindow.show();
    }

    /**
     * 玩家VIP信息 - SVIPInfo
     * @param data
     */
    private onUpdateVipInfo(data: any): void {
        CacheManager.vip.updateVip(data);
        if (this.module && this.module.isShow) {
            this.module.updateAll();
        }
        this.closeRenew();
        // if (CacheManager.vip.isOverdue)
        // {
        this.onOpenOverdueWindow();
        // }
        EventManager.dispatch(LocalEventEnum.VipUpdate);
    }

    /**
     * 玩家VIP体验卡信息 - STestVIPCard
     * @param data
     */
    private onUpdateTasteVipInfo(data: any): void {
        CacheManager.vip.updateTasteVip(data);
    }

    /**
     * 玩家VIP升级 - SVIPUpgrade
     * @param data
     */
    private onUpdateVipType(data: any): void {
        CacheManager.vip.updateVipType(data);
    }

    /**
     * 玩家VIP失效
     * @param data
     */
    private onInvalidVip(data: any): void {//弹窗提示
        this.canOpenOverdue = true;//data.bVal_B;
        this.onOpenOverdueWindow();
    }

    private onSceneMapUpdated(): void {
        // if (CacheManager.vip.isOverdue)
        this.onOpenOverdueWindow();
    }

    private onOpenOverdueWindow(e?: any): void {
        // if (e != true && this.overdueTime > 0)
        //     return;
        // this.overdueTime++;
        if (!this.canOpenOverdue)
            return;
        if (!this.overdueWindow)
            this.overdueWindow = new VipOverdueWindow();
        this.overdueWindow.show();
        this.canOpenOverdue = false;
    }

    private onOpenVipExp(e?: any): void {
        if (!this.expWindow)
            this.expWindow = new VipExperienceWindow();
        this.expWindow.show();
    }

    /** SSVIPGiftBagInfos*/
    private onVipLevelRewardInfo(msg: any) {
        CacheManager.vip.updateVipLevelReward(msg.seq.data);
        if (this.isShow) {
            this.module.updateVipRewardGet();
            this.module.updateVipTips();
        }
    }

    private onReqVipLevelReward(level: number): void {
        let msg: any = {};
        msg.cmd = ECmdGame[ECmdGame.ECmdGameGetVipLevelGift];
        msg.body = {value_I: level};
        App.Socket.send(msg);
    }

}

class Vip3RewardController extends BaseController {

    public constructor() {
        super(ModuleEnum.Vip3Reward);
    }

    public initView(): BaseGUIView {
        this._view = new Vip3RewardPanel();
        return this._view;
    }
}