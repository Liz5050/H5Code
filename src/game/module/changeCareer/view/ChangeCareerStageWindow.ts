class ChangeCareerStageWindow extends BaseWindow {
    private titleTxt: fairygui.GTextField;
    private descTxt: fairygui.GRichTextField;
    private itemList: List;

    public constructor() {
        super(PackNameEnum.ChangeCareer, "WindowStageTarget");
    }

    public initOptUI(): void {
        this.titleTxt = this.getGObject("txt_title").asTextField;
        this.descTxt = this.getGObject("txt_information").asRichTextField;
        this.itemList = new List(this.getGObject("list_stage").asList);
        this.itemList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
    }

    public updateAll(): void {
        let roleState:number = CacheManager.role.getRoleState();
        let chapterDatas:Array<ChangeCareerChapterData> = ConfigManager.changeCareer.getChapterData(roleState);
        if (chapterDatas) {
            this.itemList.data = chapterDatas;
        }
        let roleSubState:number = CacheManager.role.getRoleSubState();
        this.itemList.selectedIndex = roleSubState - 1;
        this.updateContent(this.itemList.selectedData);
    }

    private onClickItem(e: fairygui.ItemEvent) {
        let item: ChangeCareerStageItem = <ChangeCareerStageItem>e.itemObject;
        let data: ChangeCareerChapterData = item.getData() as ChangeCareerChapterData;
        this.updateContent(data);
    }

    private updateContent(selectedData: ChangeCareerChapterData) {
        this.titleTxt.text = selectedData.stageTargetName;
        this.descTxt.text = selectedData.stageTargetDesc;
    }
}