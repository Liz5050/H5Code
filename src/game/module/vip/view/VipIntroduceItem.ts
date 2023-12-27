class VipIntroduceItem extends fairygui.GComponent
{
    private titleTxt:fairygui.GTextField;
    private descPanel:VipDescribeItem;
    private _data: VipLevelData;

    public constructor()
    {
        super();
    }

    protected constructFromXML(xml: any): void
    {
        super.constructFromXML(xml);

        this.titleTxt = this.getChild("txt_titel").asTextField;
        this.descPanel = this.getChild("panel_txt") as VipDescribeItem;
    }

    public update(data:VipLevelData):void
    {
        this._data = data;
        this.titleTxt.text = App.StringUtils.substitude(LangVip.LANG2, data.level);
        this.descPanel.update(data.desc);
    }
}