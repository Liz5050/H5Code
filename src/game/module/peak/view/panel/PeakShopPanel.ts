/**
 * 巅峰商城
 * @author Chris
 */
class PeakShopPanel extends BaseTabView {
    private peakAssetTxt: fairygui.GRichTextField;
    private goodList: List;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        this.peakAssetTxt = this.getGObject("txt_peak").asRichTextField;
        this.goodList = new List(this.getGObject("list_item").asList);
    }

    public updateAll(data?: any): void {
        if (!this.goodList.data) {
            let planGoods:any[] = ConfigManager.smeltPlan.select({"smeltCategory": SmeltCategoryConfig.CAT_PEAK});
            this.goodList.data = planGoods;
            PeakCache.ItemPeakCostId = ConfigManager.peak.getStaticData("peakItemCode");
        }
        this.updatePeakItemCost();
    }

    public updatePeakItemCost():void {//    改成读道具
        this.peakAssetTxt.text = App.StringUtils.substitude(LangPeak.SHOP2, CacheManager.pack.propCache.getItemCountByCode(PeakCache.ItemPeakCostId));
    }

    public updatePeakLimit():void {//    限购数量变了
        let item:PeakShopItem;
        let idx:number = 0;
        while (idx < this.goodList.list.numChildren) {
            item = this.goodList.list.getChildAt(idx) as PeakShopItem;
            item.updateLimit();
            idx++;
        }
    }
}