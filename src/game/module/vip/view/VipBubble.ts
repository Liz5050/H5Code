/**
 * Vip气泡
 * @author Chris
 */
class VipBubble extends fairygui.GComponent
{
    private txtTime: fairygui.GRichTextField;
    private leftTime: number = 0;

    public constructor()
    {
        super();
    }

    protected constructFromXML(xml: any): void
    {
        super.constructFromXML(xml);
        this.txtTime = this.getChild("txt_viptime").asRichTextField;
    }

    public update(leftTime:number):void
    {
        this.leftTime = leftTime;
        let timeStr:string = App.StringUtils.substitude(LangVip.LANG3, App.DateUtils.getFormatBySecond(leftTime, 3));
        this.txtTime.text = HtmlUtil.html(timeStr, Color.Green);
    }

    public countdown():number
    {
        if (--this.leftTime > 0)
        {
            this.update(this.leftTime);
        }
        return this.leftTime;
    }
}