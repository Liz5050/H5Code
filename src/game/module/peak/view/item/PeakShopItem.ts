class PeakShopItem extends ListRenderer {
    private shopItem: BaseItem;
    private nameTxt: fairygui.GRichTextField;
    private descTxt: fairygui.GTextField;
    private priceTxt: fairygui.GTextField;
    private limitTxt: fairygui.GRichTextField;
    private buyBtn: fairygui.GButton;

    private limitNum: number;
    private c1: fairygui.Controller;//0巅峰令1筹码

    public constructor() {
        super();
    }

    public constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.shopItem = <BaseItem>this.getChild("baseItem");
        this.nameTxt = this.getChild("txt_name").asRichTextField;
        this.descTxt = this.getChild("txt_desc").asTextField;
        this.priceTxt = this.getChild("txt_price").asTextField;
        this.limitTxt = this.getChild("txt_limit").asRichTextField;
        this.buyBtn = this.getChild("btn_buy").asButton;
        this.buyBtn.addClickListener(this.click, this);

    }

    public setData(data: any): void {
        this._data = data;
        if (data.smeltMaterialList) {
            this.c1.selectedIndex = 0;
            this.updateSmeltItem();//巅峰令合成
        } else {
            this.c1.selectedIndex = 1;
            this.updateChipsItem();//筹码
        }
        this.updateLimit();
    }

    private click(): void {
        if (this.c1.selectedIndex == 1) {
            EventManager.dispatch(UIEventEnum.QuickShopBuyOpen, this._data);
            // ProxyManager.shop.buyItem(0, this._data.shopCode, this._data.itemCode, 1, 0, false);
        } else {
            EventManager.dispatch(UIEventEnum.QuickComposeBuyOpen, this._data);
            // ProxyManager.compose.smelt(this._data.smeltPlanCode, 1);
        }
    }

    private updateChipsItem() {
        let data = this._data;
        let itemData: ItemData = new ItemData(data.itemCode);
        itemData.itemAmount = 1;
        this.shopItem.itemData = itemData;
        this.shopItem.showBind();
        this.shopItem.txtName.visible = false;
        this.nameTxt.text = `<font color = ${Color.ItemColor[this.shopItem.itemData.getColor()]}>${this.shopItem.itemData.getName(false)}</font>`;
        this.descTxt.text = data.usageTip;
        this.priceTxt.text = data.price;
        this.limitTxt.text = "";
    }

    private updateSmeltItem() {
        let data = this._data;
        let itemData: ItemData = CommonUtils.configStrToArr(data.smeltMainProduce)[0];
        let matData: ItemData = CommonUtils.configStrToArr(data.smeltMaterialList)[0];
        this.shopItem.itemData = itemData;
        this.shopItem.showBind();
        this.shopItem.txtName.visible = false;
        this.nameTxt.text = `<font color = ${Color.ItemColor[this.shopItem.itemData.getColor()]}>${this.shopItem.itemData.getName(false)}</font>`;
        this.descTxt.text = "";//data.usageTip;
        this.priceTxt.text = matData.getItemAmount() + "";
        this.limitTxt.text = "";
    }

    public updateLimit() {
        let data = this._data;
        let hasBuyNum: number = 0;
        if (this.c1.selectedIndex == 0) {
            if (data.limitNum) {
                if (data.limitType) {
                    hasBuyNum = CacheManager.compose.limitGoods[data.smeltPlanCode] || 0;
                    this.limitNum = data.limitNum - hasBuyNum;
                } else {
                    this.limitNum = data.limitNum;
                }
            }
        } else {
            if (data.limitNum) {
                let shop: any = CacheManager.shop.limitGoods[data.shopCode];
                if (shop && shop[data.itemCode]) {
                    hasBuyNum = shop[data.itemCode];
                    this.limitNum = data.limitNum - hasBuyNum;
                } else {
                    this.limitNum = data.limitNum;
                }
            }
        }
        this.limitTxt.text = ShopUtil.getLimitStr2(data.limitType, hasBuyNum, this.limitNum);
    }
}