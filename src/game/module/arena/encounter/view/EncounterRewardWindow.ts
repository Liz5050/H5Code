class EncounterRewardWindow extends BaseWindow {
    private rankList: List;
    private rankTxt: fairygui.GRichTextField;
    public constructor(){
        super(PackNameEnum.Encounter,"EncounterRewardWindow");
    }

    public initOptUI():void {
        this.rankList = new List(this.getGObject("rank_list").asList);
        this.rankTxt = this.getGObject("txt_rank").asRichTextField;
    }

    public updateAll():void {
        if (!this.rankList.data) {
            this.rankList.data = ConfigManager.encounter.getRewardList();
        }

        let myRank:number = CacheManager.encounter.info.myRank_I;
        if (myRank != 0) {
            this.rankTxt.text = App.StringUtils.substitude(LangArena.LANG20, myRank);
        } else {
            this.rankTxt.text = App.StringUtils.substitude(LangArena.LANG20, LangArena.LANG28);
        }
    }


}