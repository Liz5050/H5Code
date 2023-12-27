/**
 * 守擂商城
 */
class ContestShopPanel extends BaseTabView {
    private fightSpiritTxt: fairygui.GRichTextField;
    private goodList: List;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        this.fightSpiritTxt = this.getGObject("txt_fightSpirit").asRichTextField;
        this.goodList = new List(this.getGObject("list_item").asList);
    }

    public updateAll(data?: any): void {
        if (!this.goodList.data) {
            let datas: Array<any> = ConfigManager.shopSell.getShopList(ShopType.SHOP_FIGHTSPIRIT);
			this.goodList.setVirtual(datas);
        }
        this.updateFightingSpirit();
    }

    public updateFightingSpirit():void {
        this.fightSpiritTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG37, CacheManager.role.getMoney(EPriceUnit.EPriceUnitFightingSpirit));
    }

	 public updateInfo(): void{
        this.goodList.refresh();
        this.updateFightingSpirit();
    }

    // public updateLimit():void {
    //     let item:PeakShopItem;
    //     let idx:number = 0;
    //     while (idx < this.goodList.list.numChildren) {
    //         item = this.goodList.list.getChildAt(idx) as PeakShopItem;
    //         item.updateLimit();
    //         idx++;
    //     }
    // }
}