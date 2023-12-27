class MiningChallengeCopyView extends BaseCopyPanel {
    private nameTxt: fairygui.GTextField;
    private minerTxt: fairygui.GTextField;

    public constructor(copyInfo:any) {
        super(copyInfo,"MiningChallengeCopyView");
        this.isCenter = true;
    }

    public initOptUI():void {
        super.initOptUI();
        this.nameTxt = this.getGObject("txt_name").asTextField;
        this.minerTxt = this.getGObject("txt_miner").asTextField;
        this.XPSetBtn.visible = true;
    }

    public updateAll(): void {
        if (this.isShow) {
            this.XPSetBtn.selected = !CacheManager.sysSet.specialCopyAutoXP;
            this.updateSceneInfo();
        }
    }

    private updateSceneInfo() {
        this.nameTxt.text = App.StringUtils.substitude(LangMining.LANG13, CacheManager.mining.curFloor);
        let workingList:any[] = CacheManager.mining.getSceneWrokingMinerList();
        this.minerTxt.text = App.StringUtils.substitude(LangMining.LANG14, workingList.length);
    }
}