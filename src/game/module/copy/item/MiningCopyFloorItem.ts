class MiningCopyFloorItem extends ListRenderer {
    private nameTxt: fairygui.GTextField;
    private minerTxt: fairygui.GTextField;
    private goBtn: fairygui.GButton;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);

        this.nameTxt = this.getChild("txt_name").asTextField;
        this.minerTxt = this.getChild("txt_miner").asTextField;
        this.goBtn = this.getChild("btn_go").asButton;
        this.goBtn.addClickListener(this.onClick, this);
    }

    public setData(data: any, index:number): void {
        this._data = data;
        this.nameTxt.text = App.StringUtils.substitude(LangMining.LANG13, data.floor);
        this.minerTxt.text = App.StringUtils.substitude(LangMining.LANG14, data.count);
    }

    private onClick() {
        EventManager.dispatch(LocalEventEnum.ReqEnterMiningCopy, CopyEnum.CopyMining, this._data.floor);
    }
}