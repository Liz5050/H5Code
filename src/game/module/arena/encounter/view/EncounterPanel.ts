class EncounterPanel extends BaseTabView {
    private killValueTxt: fairygui.GTextField;
    private rankTxt: fairygui.GTextField;
    private pkTxt: fairygui.GTextField;
    private headIcon: GLoader;
    private itemList: List;
    private syncInfoTimeoutId: number;
    private c1: fairygui.Controller;
    private pkWarnTxt: fairygui.GTextField;
    private rankTxtBtn: fairygui.GButton;

    public constructor() {
        super();
    }

    public initOptUI():void{
        this.c1 = this.getController('c1');
        this.killValueTxt = this.getGObject("txt_kill").asTextField;
        this.rankTxt = this.getGObject("txt_rank").asTextField;
        this.rankTxtBtn = this.getGObject("btn_rank").asButton;
        this.rankTxtBtn.addClickListener(this.onClickRankTxt, this);
        this.pkTxt = this.getGObject("txt_pk").asTextField;
        this.pkWarnTxt = this.getGObject("txt_pk_warn").asTextField;
        this.headIcon = this.getGObject("icon_head") as GLoader;
        this.getGObject("icon_reward").asCom.addClickListener(this.onClickReward, this);
        this.itemList = new List(this.getGObject("list_item").asList);
        (this.getGObject("btn_privilegeSet") as PrivilegeSetBtn).fromCode = CopyEnum.CopyEncounter;
    }

    private onClickReward() {
        EventManager.dispatch(UIEventEnum.OpenEncounterReward);
    }

    private onClickRankTxt() {
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Rank, {type:EToplistType.EClientToplistTypeEncounter});
    }

    public updateAll(data?:any):void {
        this.syncInfo();
        EventManager.dispatch(LocalEventEnum.EncounterOpen);
        // this.updateInfo();
    }

    public updateInfo():void {
        let info:any = CacheManager.encounter.info;
        let pkScore:number = info.pkScore_I;
        this.headIcon.load(URLManager.getPlayerHead(CacheManager.role.role.career_I));
        this.killValueTxt.text = info.killScore_I + "";//App.StringUtils.substitude(LangArena.LANG10, info.killScore_I);
        // this.rankTxt.text = App.StringUtils.substitude(LangArena.LANG11, info.myRank_I);
        this.rankTxtBtn.text = HtmlUtil.html(info.myRank_I ? info.myRank_I : LangArena.LANG36, null, false, 0, "", true);
        this.pkTxt.text = pkScore + "";//App.StringUtils.substitude(pkScore<100 ? LangArena.LANG12:LangArena.c, pkScore);
        this.pkTxt.color = pkScore < 100 ? 0x0df14b : 0xec422e;
        if (pkScore > EncounterCache.FULL_PK_SCORE - 1) {
             this.pkWarnTxt.text = App.StringUtils.substitude(LangArena.LANG30, (pkScore - EncounterCache.FULL_PK_SCORE + 1));
        } else {
            this.pkWarnTxt.text = "";
        }
        this.itemList.data = info.targets.data;
        let targetLen:number = info.targets.data.length;
        this.c1.selectedIndex = targetLen > 0 ? 1 : 0;
        if (pkScore > 0) {
            let leftSyncSec:number = info.updateDt_I + 60 - CacheManager.serverTime.getServerTime();//更新剩余时间
            Log.trace(Log.ENCOUNTER, "updatePkAndList:", leftSyncSec, App.DateUtils.formatDate(info.updateDt_I, DateUtils.FORMAT_Y_M_D_HH_MM_SS), App.DateUtils.formatDate(CacheManager.serverTime.getServerTime(), DateUtils.FORMAT_Y_M_D_HH_MM_SS));
            if (leftSyncSec > 0) {
                this.delaySync(leftSyncSec * 1000);
            } else {
                this.delaySync(60 * 1000);
            }
        } else if (targetLen < 4) {
            Log.trace(Log.ENCOUNTER, "updateList:", App.DateUtils.formatDate(info.updateDt_I, DateUtils.FORMAT_Y_M_D_HH_MM_SS), App.DateUtils.formatDate(CacheManager.serverTime.getServerTime(), DateUtils.FORMAT_Y_M_D_HH_MM_SS));
            this.delaySync(60 * 1000);
        } else {
            Log.trace(Log.ENCOUNTER, "pk0 list4");
        }

        if(targetLen > 0) {
            let challengeBtn: fairygui.GButton = (this.itemList.list._children[0] as EncounterPlayerItem).getChallengeBtn();
            GuideTargetManager.reg(GuideTargetName.EncounterPanelChallengeBtn, challengeBtn);
            EventManager.dispatch(UIEventEnum.ViewOpened, this["__class__"], false);
        }
    }

    private delaySync(delay: number) {
        if (this.syncInfoTimeoutId > 0) egret.clearTimeout(this.syncInfoTimeoutId);
        this.syncInfoTimeoutId = egret.setTimeout(this.syncInfo, this, delay);
    }

    private syncInfo() {
        this.syncInfoTimeoutId = -1;
        EventManager.dispatch(LocalEventEnum.ReqEncounterInfo);
    }

    public hide():void {
        if (this.syncInfoTimeoutId > 0) egret.clearTimeout(this.syncInfoTimeoutId);
        super.hide();
        EventManager.dispatch(LocalEventEnum.EncounterClose);
    }

}