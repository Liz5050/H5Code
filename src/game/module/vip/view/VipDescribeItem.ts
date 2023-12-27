/**
 * VipIntroceItem里面的上下滑动字体
 */
class VipDescribeItem extends fairygui.GComponent
{
    private txtInfo: fairygui.GRichTextField;

    public constructor()
    {
        super();
    }

    protected constructFromXML(xml: any): void
    {
        super.constructFromXML(xml);
        this.txtInfo = this.getChild("txt_infor").asRichTextField;
    }

    public update(infoText:string):void
    {
        this.txtInfo.text = infoText;
    }
}