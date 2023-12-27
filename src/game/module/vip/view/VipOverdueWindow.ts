class VipOverdueWindow extends BaseWindow
{
    private renewBtn: fairygui.GButton;
    public constructor()
    {
        super(PackNameEnum.VIP, "WindowVipoOerdue");
    }

    public initOptUI(): void
    {
        this.renewBtn = this.getGObject("btn_renew").asButton;
        this.renewBtn.addClickListener(this.onClickRenew,this);
    }

    private onClickRenew(): void
    {
        EventManager.dispatch(UIEventEnum.VipRenewOpen);
        this.hide();
    }

}