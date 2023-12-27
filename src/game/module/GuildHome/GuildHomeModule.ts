/**
 * 仙盟主界面
 */
class GuildHomeModule extends BaseModule {
    private bgLoader: GLoader;
    private lobbyBtn: fairygui.GButton;
    private zhangbaBtn: fairygui.GButton;
    private activityBtn: fairygui.GButton;
    private bossBtn: fairygui.GButton;
    private chatBtn: fairygui.GButton;
    private btn_allot:fairygui.GButton;
    private btn_scoreWarehouse:fairygui.GButton;
    private rankList: List;

    public constructor() {
        super(ModuleEnum.GuildHome, PackNameEnum.GuildHome, "Main", LayerManager.UI_Cultivate);
    }

    public initOptUI(): void {
        this.bgLoader = <GLoader>this.getGObject("loader_bg");
        this.lobbyBtn = this.getGObject("btn_lobby").asButton;
        this.zhangbaBtn = this.getGObject("btn_zhengba").asButton;
        this.activityBtn = this.getGObject("btn_activity").asButton;
        this.bossBtn = this.getGObject("btn_boss").asButton;
        this.chatBtn = this.getGObject("btn_chat").asButton;
        this.btn_allot = this.getGObject("btn_allot").asButton;
        this.btn_scoreWarehouse = this.getGObject("btn_scoreWarehouse").asButton;
        this.rankList = new List(this.getGObject("list_contributionRank").asList);

        this.bgLoader.load(URLManager.getModuleImgUrl("home_bg.jpg", PackNameEnum.GuildActivity));

        this.lobbyBtn.addClickListener(this.clickBtn, this);
        this.zhangbaBtn.addClickListener(this.clickBtn, this);
        this.activityBtn.addClickListener(this.clickBtn, this);
        this.bossBtn.addClickListener(this.clickBtn, this);
        this.chatBtn.addClickListener(this.clickBtn, this);
        this.btn_allot.addClickListener(this.clickBtn, this);
        CommonUtils.setBtnTips(this.btn_allot,true);
        this.btn_scoreWarehouse.addClickListener(this.clickBtn, this);
        this.btn_allot.visible = false;
    }

    public updateAll(data: any = null): void {
        let px:number = 67;
        let py:number = 10;
        CommonUtils.setBtnTips(this.activityBtn, CacheManager.guildActivity.isActivityRedTip,px,py,false);
        CommonUtils.setBtnTips(this.lobbyBtn, CacheManager.guildNew.checkGuildLobbyTip(), 352,10,false);
        CommonUtils.setBtnTips(this.zhangbaBtn, CacheManager.guildBattle.checkTips(), px,py,false);
        CommonUtils.setBtnTips(this.bossBtn, CacheManager.guildCopy.checkTips(), px,py,false);
    }

    /**
     * 仓库物品更新
     */
    public updateWarehouseItems():void {
        this.btn_allot.visible = CacheManager.guildNew.showRewardAllot;
    }

    public updateRankList(data: Array<any>): void {
        this.rankList.data = data;
    }

    private clickBtn(e: egret.TouchEvent): void {
        switch (e.target as fairygui.GButton) {
            case this.lobbyBtn:
                HomeUtil.open(ModuleEnum.GuildNew, false, {}, ViewIndex.Two);
                break;
            case this.zhangbaBtn:
                // Tip.showTip("暂未开放");
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.GuildBattle, null, ViewIndex.Two);
                break;
            case this.activityBtn:
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.GuildActivity, {}, ViewIndex.Two);
                break;
            case this.bossBtn:
                // Tip.showTip("暂未开放");
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.GuildCopy, {}, ViewIndex.Two);
                break;
            case this.chatBtn:
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Chat, {chatType: EChatType.EChatTypeGuild});
                break;
            case this.btn_allot:
                if(!CacheManager.guildNew.isLeader) {
                    Tip.showRollTip("只有盟主才可分配奖励");
                    break;
                }
                EventManager.dispatch(UIEventEnum.GuildAllotRewardOpen);
                break;
            case this.btn_scoreWarehouse:
                EventManager.dispatch(UIEventEnum.GuildScoreWarehouseOpen);
                break;
        }
    }
}