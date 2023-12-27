class QualifyingStagePanel extends BaseTabView {
    private itemList: List;
    private myStageTxt: fairygui.GButton;
    private rankList: List;
    private c1: fairygui.Controller;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        this.c1 = this.getController('c1');
        this.itemList = new List(this.getGObject("list_item").asList);
        this.myStageTxt = this.getGObject('txt_my_stage').asButton;
        this.myStageTxt.addClickListener(this.onClick, this);
        this.rankList = new List(this.getGObject("list_rank").asList);
        this.getGObject('block_reward').addClickListener(this.onClickGet, this);
    }

    public updateAll(data?: any): void {
        if (!this.rankList.data) {
            let rankRewards:any[] = ConfigManager.crossStair.getAllRankCfgs(2);
            //段位奖励
            let levelRewards:any[] = ConfigManager.qualifying.getLevelList();
            levelRewards.sort((r1:any, r2:any)=>{
                if (QualifyingCache.getLevelBig(r1.level) > QualifyingCache.getLevelBig(r2.level))
                    return -1;
                return r1.level - r2.level;
            });
            this.rankList.setVirtual(rankRewards.concat(levelRewards));
        }
        let info: simple.SQualifyingInfo = CacheManager.qualifying.info;
        if (!info) return;
        let level:number = CacheManager.qualifying.level;
        this.myStageTxt.text = HtmlUtil.colorSubstitude(LangQualifying.LANG25, QualifyingCache.getLevelStr(level));
        this.updateDailyRewardFlag(info);
    }

    public updateDailyRewardFlag(info:simple.SQualifyingInfo) {
        let levelData:any = ConfigManager.qualifying.getLevelData(info.dayRewardLevel_I > 0 ? info.dayRewardLevel_I : info.level_I);
        let levelDayRewards:ItemData[] = RewardUtil.getStandeRewards(levelData.dayRewards);
        if (info.dayRewardLevel_I > 0) {
            this.c1.selectedIndex = info && info.hadGetDayReward_B ? 1 : 0;
        } else {
            levelDayRewards[0].itemAmount = 1;
            this.c1.selectedIndex = 0;
        }
        this.itemList.data = levelDayRewards;
        let item:BaseItem = this.itemList.list.getChildAt(0) as BaseItem;
        item && item.setNameVisible(false);
        CommonUtils.setBtnTips(item, info && !info.hadGetDayReward_B);
    }

    public hide():void {
        super.hide();
    }

    private onClick() {
        EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:HtmlUtil.colorSubstitude(LangQualifying.LANG31), title:LangQualifying.LANG21});
    }

    private onClickGet() {
        EventManager.dispatch(LocalEventEnum.QualifyingReqGetDayRewards);
    }
}