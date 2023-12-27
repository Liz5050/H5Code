class VipExperienceWindow extends BaseWindow
{
    private experienceBtn: fairygui.GButton;
    private descTxt: fairygui.GRichTextField;
    private tasteVipItem:ItemData;

    public constructor()
    {
        super(PackNameEnum.VIP, "WindowVipExperience");
    }

    public initOptUI(): void
    {
        this.descTxt = (this.getGObject("panel_experience") as fairygui.GComponent).getChild("txt-information").asRichTextField ;
        this.experienceBtn = this.getGObject("btn_experience").asButton;
        this.experienceBtn.addClickListener(this.onClickExp,this);
    }

    private onClickExp()
    {
        if (this.tasteVipItem)
        {
            EventManager.dispatch(LocalEventEnum.PackUseByCode, this.tasteVipItem, 1);
            this.hide();
        }
    }

    public updateAll():void
    {
        if (this.descTxt.text == "")
        {
            let noVipItems:VipShopItemData[] = ConfigManager.vip.getVipShopItems(false);
            let noVipItem:VipShopItemData = noVipItems && noVipItems.length ? noVipItems[0] : null;
            if (noVipItem)
            {
                this.descTxt.text = noVipItem.desc;
                this.tasteVipItem = new ItemData(noVipItem.itemCode);
            }
        }
    }
}