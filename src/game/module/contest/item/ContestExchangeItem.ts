class ContestExchangeItem extends ListRenderer {
    private shopItem: BaseItem;
    // private nameTxt: fairygui.GRichTextField;
    private costTxt: fairygui.GTextField;
    private limitTxt: fairygui.GRichTextField;
    private exchangeBtn: fairygui.GButton;

    private limitNum: number;
    private isCanExchange: boolean;

    public constructor() {
        super();
    }

    public constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.shopItem = <BaseItem>this.getChild("baseItem");
        // this.nameTxt = this.getChild("txt_name").asRichTextField;
        this.costTxt = this.getChild("txt_cost").asTextField;
        this.limitTxt = this.getChild("txt_limit").asRichTextField;
        this.exchangeBtn = this.getChild("btn_exchange").asButton;
        this.exchangeBtn.addClickListener(this.click, this);

    }

	public setData(data: any): void {
        this._data = data;
		let itemData: ItemData = CommonUtils.configStrToArr(data.smeltMainProduce)[0];
        let matData: ItemData = CommonUtils.configStrToArr(data.smeltMaterialList)[0];
		this.shopItem.itemData = itemData;
        this.costTxt.text = matData.getItemAmount().toString();
        this.isCanExchange = matData.getItemAmount() <= CacheManager.pack.propCache.getItemCountByCode(matData.getCode());
        this.updateLimit();
	}

    private click(): void{
        EventManager.dispatch(UIEventEnum.QuickComposeBuyOpen, this._data);
    }

    public updateLimit() {
        let data = this._data;
        let hasBuyNum: number = 0;
        if (data.limitNum) {
            if (data.limitType) {
                hasBuyNum = CacheManager.compose.limitGoods[data.smeltPlanCode] || 0;
                this.limitNum = data.limitNum - hasBuyNum;
            } else {
                this.limitNum = data.limitNum;
            }
            this.limitTxt.text = ShopUtil.getLimitStr2(data.limitType, hasBuyNum, this.limitNum);

            // App.DisplayUtils.grayButton(this.exchangeBtn, this.limitNum <= 0, this.limitNum <= 0);
            if(this.isCanExchange){
                this.isCanExchange = this.limitNum > 0;
            }
        }else{
            this.limitTxt.text = "";
        }

        App.DisplayUtils.grayButton(this.exchangeBtn, !this.isCanExchange, !this.isCanExchange);
    }
}