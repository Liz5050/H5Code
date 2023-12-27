/**
 * 战斗模式选择
 * @author chris
 */
class FightModeChoose extends fairygui.GComponent
{
    private fmode:number = -1;
    private ctl:fairygui.Controller;

    public constructor()
    {
        super();
    }

    protected constructFromXML(xml: any): void
    {
        super.constructFromXML(xml);
        this.ctl = this.getController("c1");
    }

    public set fightMode(value:number)
    {
        if (this.fmode == value) return;
        this.fmode = value;
        this.ctl.selectedIndex = this.fmode;
    }
}