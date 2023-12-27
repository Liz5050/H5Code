class QualifyingStageRewardWindow extends BaseWindow {
    private rankList: List;

    public constructor() {
        super(PackNameEnum.Qualifying, "QualifyingStageRewardWindow");
    }

    public initOptUI(): void {
        this.rankList = new List(this.getGObject("list_rank").asList);
    }

    public updateAll(): void {
        if (!this.rankList.data) {
            let levelRewards:any[] = ConfigManager.qualifying.getLevelList();
            levelRewards.sort((r1:any, r2:any)=>{
                if (QualifyingCache.getLevelBig(r1.level) > QualifyingCache.getLevelBig(r2.level))
                    return -1;
                return r1.level - r2.level;
            });
            this.rankList.setVirtual(levelRewards);
        }
    }

}