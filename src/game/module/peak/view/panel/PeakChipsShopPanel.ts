/**
 * 筹码商城
 * @author Chris
 */
class PeakChipsShopPanel extends BaseTabView {
    private peakChipsAssetTxt: fairygui.GRichTextField;
    private goodList: List;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        this.peakChipsAssetTxt = this.getGObject("txt_peak").asRichTextField;
        this.goodList = new List(this.getGObject("list_item").asList);
    }

    public updateAll(data?: any): void {
        if (!this.goodList.data) {
            this.goodList.data = ConfigManager.shopSell.getShopList(ShopType.SHOP_JETON);
        }
        this.updateJeton();
    }

    public updateJeton():void {
        this.peakChipsAssetTxt.text = App.StringUtils.substitude(LangPeak.SHOP3, CacheManager.role.getMoney(EPriceUnit.EPriceUnitJeton));
    }

    public updateLimit():void {
        let item:PeakShopItem;
        let idx:number = 0;
        while (idx < this.goodList.list.numChildren) {
            item = this.goodList.list.getChildAt(idx) as PeakShopItem;
            item.updateLimit();
            idx++;
        }
    }
}