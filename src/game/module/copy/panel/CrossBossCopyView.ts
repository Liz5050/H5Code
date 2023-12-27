/**
 * 跨服boss副本内容界面
 * @author Chris
 */
class CrossBossCopyView extends WorldBossCopyPanel {
    private c1: fairygui.Controller;//归属
    private winnerTxt: fairygui.GTextField;
    private mapTxt: fairygui.GTextField;
    private reliveTxt: fairygui.GTextField;
    private mainBossCode: number;
    private c2: fairygui.Controller;//右上角

    public constructor(info:any) {
        super(info,"CrossBossCopyView");
    }

    public initOptUI():void {
        super.initOptUI();

        this.c1 = this.getController('ctl1');
        let rightTopComp:fairygui.GComponent = this.getGObject("comp_right").asCom;
        this.c2 = rightTopComp.getController('c1');
        this.winnerTxt = this.getGObject("txt_winner").asTextField;
        this.mapTxt = rightTopComp.getChild("txt_map").asTextField;
        this.reliveTxt = rightTopComp.getChild("txt_relive").asTextField;
    }

    protected addListenerOnShow(): void {
        super.addListenerOnShow();
        this.addListen1(NetEventEnum.BossListInfUpdate, this.onBossInfoUpdate, this);
        this.addListen1(NetEventEnum.BossInfUpdate, this.onBossInfoUpdate, this);
        this.addListen1(LocalEventEnum.CrossBossResult, this.onBossResult, this);
    }

    /**打开奖励界面 */
    public onOpenRewardHandler(): void {
        if (this.mainBossCode) {
            EventManager.dispatch(UIEventEnum.CrossBossRewardOpen, this.mainBossCode);
        }
    }

    public updateOwnerInfo(): void {
        super.updateOwnerInfo();
        this.setOwnerViewAttackBtnState(OwnerAttackBtnState.CANCL);
    }

    public updateAll():void {
        super.updateAll();

        this.c1.selectedIndex = 0;
        this.mainBossCode = CacheManager.crossBoss.curBossCode;
        this.updateBossCd();
        let copyInf:any = ConfigManager.copy.getByPk(CacheManager.copy.curCopyCode);
        if (copyInf) {
            let localLevel:number = CacheManager.crossBoss.getLocalBossLevel(this.mainBossCode);
            this.mapTxt.text = copyInf.name + (localLevel ? App.StringUtils.substitude(LangCrossBoss.LANG12, GameDef.NumberName[localLevel]) : "");
        }
    }

    private updateBossCd():void {
        if (this.countDown() > 0) {
            this.c2.selectedIndex = 1;
            App.TimerManager.doTimer(1000, 0, this.countDown, this);
        }
    }

    private countDown():number {
        let refreshDt:number = CacheManager.bossNew.getBossDt(this.mainBossCode);
        let leftTime:number;
        if (refreshDt > 0 && (leftTime = refreshDt - CacheManager.serverTime.getServerTime()) > 0) {
            this.reliveTxt.text = App.StringUtils.substitude(LangCrossBoss.LANG4, App.DateUtils.getTimeStrBySeconds(leftTime, "{2}:{1}:{0}", false));
        } else {
            this.c2.selectedIndex = 0;
            App.TimerManager.remove(this.countDown, this);
        }
        return leftTime;
    }

    private onBossInfoUpdate() {
        this.updateBossCd();
    }

    private onBossResult(rewardType:ECrossBossRewardType) {
        if (rewardType == ECrossBossRewardType.BOSS_OWN) {
            this.c1.selectedIndex = 1;
            let result:any = CacheManager.crossBoss.getResult(rewardType, false);
            this.winnerTxt.text = App.StringUtils.substitude(LangCrossBoss.LANG7, EntityUtil.getEntityServerName(result.ownerMiniPlayer));
            this.countDownToHideOwn(10);
        }
    }

    public hide(param: any = null, callBack: CallBack = null): void {
        super.hide(param, callBack);
        App.TimerManager.remove(this.countDown, this);
        this.countDownToHideOwn(0);
    }

    private countDownToHideOwn(cd: number) {
        if (cd > 0)
            App.TimerManager.doTimer(cd * 1000, 1, this.onCountdownToHideOwn, this);
        else
            App.TimerManager.remove(this.onCountdownToHideOwn, this);
    }

    private onCountdownToHideOwn() {
        this.c1.selectedIndex = 0;
    }
}