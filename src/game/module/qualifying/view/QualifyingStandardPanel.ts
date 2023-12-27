class QualifyingStandardPanel extends BaseTabView {
    private itemList: List;
    private myGainTxt: fairygui.GRichTextField;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        this.itemList = new List(this.getGObject("list_item").asList);
        this.myGainTxt = this.getGObject('txt_gain').asRichTextField;
    }

    public updateAll(data?: any): void {
        if (!this.itemList.data) {
            let goalList:any[] = ConfigManager.qualifying.getGoalList();
            this.itemList.setVirtual(goalList);
        }
        let info:any = CacheManager.qualifying.info;
        this.updateFlags(info);
        this.myGainTxt.text = HtmlUtil.colorSubstitude(LangQualifying.LANG48, info.goalNum_I);
    }

    public updateFlags(data:any):void {
        this.itemList.callItemsFunc("updateFlag", data);
    }

    public hide():void {
        super.hide();
    }

}