/**
 * PK模式
 * @author chris
 */
class FightModePanel extends BaseWindow
{
    /** 战斗模式*/
    private mode: number;

    public constructor()
    {
        super(PackNameEnum.Home, "FightModePanel");
    }

    public initOptUI(): void
    {
        this.getGObject("btn_fightmode0").addClickListener(this.onClick0, this);
        this.getGObject("btn_fightmode1").addClickListener(this.onClick1, this);
        this.getGObject("btn_fightmode2").addClickListener(this.onClick2, this);
    }

    public onShow():void
    {
        super.onShow();
        this.mode = CacheManager.role.player.mode_I;
    }

    public updateAll(data?: any): void
    {
    }

    private onClick0()
    {
        if (this.mode == 0)
        {
            Tip.showTip(LangHome.LANG_1);
            return;
        }
        this.changeMode(0);
    }

    private onClick1()
    {
        if (this.mode == 1)
        {
            Tip.showTip(LangHome.LANG_1);
            return;
        }
        this.changeMode(1);
    }

    private onClick2()
    {
        if (this.mode == 2)
        {
            Tip.showTip(LangHome.LANG_1);
            return;
        }
        this.changeMode(2);
    }

    private changeMode(mode: number)
    {
        if (CacheManager.role.getRoleLevel() < 60)
        {
            Tip.showTip(LangHome.LANG_6);
            this.hide();
            return;
        }
        let msg: any = {};
        msg.cmd = "ECmdGameSetMode";
        msg.body = {
            "mode": mode
        };
        App.Socket.send(msg); //发送
        this.hide();
    }
}