class ChangeCareerStageItem extends ListRenderer {
    private static STATUS_FREE:number = 0;
    private static STATUS_ING:number = 1;

    private titleTxt: fairygui.GTextField;
    private stateViewCtl: fairygui.Controller;
    private statusViewCtl: fairygui.Controller;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);

        this.stateViewCtl = this.getController("c1");
        this.statusViewCtl = this.getController("c2");
        this.titleTxt = this.getChild("title").asTextField;
    }

    public setData(data: any, index: number): void {
        this._data = data;
        this.titleTxt.text = data.stageName;
        this.statusViewCtl.selectedIndex = index + 1 == CacheManager.role.getRoleSubState()
            ? ChangeCareerStageItem.STATUS_ING : ChangeCareerStageItem.STATUS_FREE;
        this.stateViewCtl.selectedIndex = CacheManager.role.getRoleState();
    }
}