/**
 * 跨服BOSS模块
 * @author Chris
 */
class CrossModule extends BaseTabModule {
    private tipBtn: fairygui.GButton;

    public constructor() {
        super(ModuleEnum.Cross, PackNameEnum.Cross);
        this.indexTitle = true;
    }

    public initOptUI(): void {
        super.initOptUI();
        this.className = {
            // [PanelTabType.CrossBoss]:["CrossBossPanel",CrossBossPanel,PackNameEnum.CrossBoss],
            // [PanelTabType.CrossBossCross]:["CrossBossPanel",CrossBossPanel,PackNameEnum.CrossBoss],
            [PanelTabType.CrossEntrance]:["CrossEntrancePanel",CrossEntrancePanel],
            [PanelTabType.CrossBossGuild]:["CrossBossGuildPanel",CrossBossGuildPanel,PackNameEnum.CrossBossGuild],
            [PanelTabType.CrossDropLog]:["CrossDropLogPanel",CrossDropLogPanel,PackNameEnum.CrossBossGuild],
        };

        this.tipBtn = this.getGObject("btn_des").asButton;
        this.tipBtn.addClickListener(this.onOpenTips,this);
        this.tipBtn.visible = false;
        this.bottomArea = false;
    }

    public onShow(data?:any):void {
        super.onShow(data);
        // this.setBtnVisible(PanelTabType.CrossBossCross, CacheManager.crossBoss.isCrossOpen);
    }

    public updateAll(data?: any): void {
        this.checkAllTips();
    }

    // public updateCrossBoss() {
    //     if (this.isTypePanel(PanelTabType.CrossBoss)) {
    //         this.curPanel.updateAll();
    //     }
    // }

    public updateDropLog():void{
        if (this.isTypePanel(PanelTabType.CrossDropLog)) {
            this.curPanel.updateAll();
        }
    }

    public updateBossListCD() {
        /*if (this.isTypePanel(PanelTabType.CrossBoss)) {
            this.curPanel.updateBossListCD();
        }else */if(this.isTypePanel(PanelTabType.CrossBossGuild)){
            this.curPanel.updateAll();
        }
        //boss刷新 需要检查神兽入侵红点
        this.setBtnTips(PanelTabType.CrossBossGuild,CacheManager.crossBoss.isGuildBossTips());
    }

    // public updateBossLeftTimes() {
    //     if (this.isTypePanel(PanelTabType.CrossBoss)) {
    //         this.curPanel.updateBossLeftTimes();
    //     }
    // }

    protected updateSubView():void{
        if(this.isTypePanel(PanelTabType.CrossDropLog)){
            EventManager.dispatch(LocalEventEnum.CrossReqDropLog,ECachedDropLogMsgCopyType.ECachedDropLogMsgCopyTypeGBIC);
        }
    }

    private checkAllTips():void {
        // this.setBtnTips(PanelTabType.CrossBoss,CacheManager.crossBoss.checkTips(null, PanelTabType.CrossBoss));
        // this.setBtnTips(PanelTabType.CrossBossCross,CacheManager.crossBoss.checkTips(null, PanelTabType.CrossBossCross));
        this.setBtnTips(PanelTabType.CrossEntrance,CacheManager.crossBoss.checkTips(null, PanelTabType.CrossBossCross)
            || CacheManager.qualifying.checkOpenTips() || CacheManager.qualifying.checkFunTips());//几个跨服玩法的红点
        this.setBtnTips(PanelTabType.CrossBossGuild,CacheManager.crossBoss.isGuildBossTips());
    }

    private onOpenTips():void {
        let tipStr:string = LangCrossBoss.LANG11;
        if(this.isTypePanel(PanelTabType.CrossBossGuild)) {
            let copyInfo:any= ConfigManager.copy.getByPk(CopyEnum.CopyCrossGuildBoss);
            tipStr = copyInfo&&copyInfo.introduction?copyInfo.introduction:"";
            tipStr = HtmlUtil.br(tipStr);
        }        
        EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:tipStr});
    }
}