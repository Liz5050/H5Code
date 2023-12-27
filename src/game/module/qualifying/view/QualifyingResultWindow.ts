class QualifyingResultWindow extends BaseWindow {
    private rankList: List;
    private c1: fairygui.Controller;//0比赛中1比赛结束
    private c2: fairygui.Controller;//0我方失败1我方胜利
    private confirmBtn: fairygui.GButton;
    private ourScoreTxt: fairygui.GTextField;
    private theirScoreTxt: fairygui.GTextField;
    private rewardList: List;
    private nextTxt: fairygui.GRichTextField;

    public constructor() {
        super(PackNameEnum.QualifyingResult, "QualifyingResultWindow");
    }

    public initOptUI(): void {
        this.c1 = this.getController('c1');
        this.c2 = this.getController('c2');
        this.rankList = new List(this.getGObject("list_rank").asList);
        this.rewardList = new List(this.getGObject("list_item").asList);
        this.confirmBtn = this.getGObject('btn_confirm').asButton;
        this.confirmBtn.addClickListener(this.onClickConfirm, this);
        this.ourScoreTxt = this.getGObject('txt_our_score').asTextField;
        this.theirScoreTxt = this.getGObject('txt_their_score').asTextField;
        this.nextTxt = this.getGObject('txt_next').asRichTextField;
    }

    public updateAll(data:any): void {
        let score1:number = 0;
        let score2:number = 0;
        if (data instanceof simple.SQualifyingCopyShowReward) {//有结果
            this.c1.selectedIndex = 1;
            score1 = data.score1_I;
            score2 = data.score2_I;
            let isWin:boolean = false;
            if (score1 == score2) {
                this.c2.selectedIndex = 2;
            } else {
                isWin = (score1 > score2 && CacheManager.qualifying.myCopyForce == EForce.EForceOne)
                || (score1 < score2 && CacheManager.qualifying.myCopyForce == EForce.EForceTwo);
                this.c2.selectedIndex = isWin ? 1 : 0;
            }
            this.rankList.data = this.sortByScore(data.ranks.data);
            //遍历设置mvp，1血，1采
            this.rankList.callItemsFunc("updateTags", data);

            let levelData:any = ConfigManager.qualifying.getLevelData(CacheManager.qualifying.level);
            let resultRewards:ItemData[] = RewardUtil.getStandeRewards(isWin ? levelData.winRewards : levelData.loseRewards);
            //额外奖励：段位win/lose奖励 + 差mvp，1采，1血（累加
            let exRewardNum:number = 0;
            let roleEntityId:any = CacheManager.role.entityInfo.entityId;
            if (EntityUtil.isSame(data.mvpId1, roleEntityId, true) || EntityUtil.isSame(data.mvpId2, roleEntityId, true))
                exRewardNum = ConfigManager.const.getConstValue("QualifyingMvp");
            if (EntityUtil.isSame(data.firstKillId, roleEntityId, true))
                exRewardNum = ConfigManager.const.getConstValue("QualifyingFirstKill");
            if (EntityUtil.isSame(data.firstCollectId, roleEntityId, true))
                exRewardNum = ConfigManager.const.getConstValue("QualifyingFirstCollect");
            for (let item of resultRewards) {
                if (item.getCode() == QualifyingCache.ITEM) {
                    item.itemAmount = item.getItemAmount() + exRewardNum;
                    break;
                }
            }
            this.rewardList.data = resultRewards;

            let curScore:number = CacheManager.qualifying.score;
            let nextData:any = ConfigManager.qualifying.getLevelData(CacheManager.qualifying.level + 1);
            if (nextData) {
                this.nextTxt.text = HtmlUtil.colorSubstitude(LangQualifying.LANG45, nextData.minScore - curScore, QualifyingCache.getLevelStr(nextData.level));
            } else {
                this.nextTxt.text = LangQualifying.LANG46;
            }
        } else {
            this.c1.selectedIndex = 0;
            score1 = data.score1_I;
            score2 = data.score2_I;
            this.rankList.data = this.sortByScore(data.ranks.data);
        }
        if (CacheManager.qualifying.myCopyForce == EForce.EForceOne) {
            this.ourScoreTxt.text = score1 + '';
            this.theirScoreTxt.text = score2 + '';
        } else {
            this.ourScoreTxt.text = score2 + '';
            this.theirScoreTxt.text = score1 + '';
        }

    }

    private onClickConfirm() {
        this.hide();
    }

    private sortByScore(list: simple.ISQualifyingPlayerCopyInfo[]) {
        return list.sort((r1:any, r2:any)=>{
            if (Number(r2.copyScore_I) == Number(r1.copyScore_I)) {
                if (r1.force_I == CacheManager.qualifying.myCopyForce) return -1;
                return 1;
            }
            return Number(r2.copyScore_I) - Number(r1.copyScore_I);
        });
    }

    public hide(param: any = null, callBack: CallBack = null):void {
        super.hide(param, callBack);
        CacheManager.qualifying.exitCopy();
        if (this.c1.selectedIndex == 1) HomeUtil.openQualifying();
    }
}