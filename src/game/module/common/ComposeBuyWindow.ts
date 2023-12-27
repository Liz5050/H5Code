class ComposeBuyWindow extends BuyWindow {
    private _data: any;
    public constructor(){
        super();
    }

    public updateAll(data?:any):void{
        // "itemCode" : 100001001,
        //     "orderId" : 17,
        //     "price" : 10,
        //     "shopCode" : 1016
        // "limitNum" : 10,
        //     "limitType" : 2,
        //
        // "limitNum" : 20,
        //     "limitType" : 1,
        //     "showItemCode" : 40110221,
        //     "smeltCategory" : 2,
        //     "smeltMainProduce" : "40110221,100,100#",
        //     "smeltMaterialList" : "20000060,75#",
        //     "smeltPlanCode" : 169,
        //     "smeltType" : 4

        this._data = data;
        let smeltPlan:any = data;
        let matData: ItemData = CommonUtils.configStrToArr(smeltPlan.smeltMaterialList)[0];
        this.shopCfg = {
            limitNum:smeltPlan.limitNum,
            limitType:smeltPlan.limitType,
            price:matData.getItemAmount(),
            itemCode:smeltPlan.showItemCode,
            usageTip:""
        };
        this.code = smeltPlan.showItemCode;

        if(this._data.smeltCategory == SmeltCategoryConfig.CONTEST){
            this.c1.selectedIndex = 4;
        }else{
            this.c1.selectedIndex = 2;
        }

        this.fillData();
    }

    protected setLimit():void {
        if(this.shopCfg.limitNum){
            let hasCpNum: number = CacheManager.compose.limitGoods[this._data.smeltPlanCode] || 0;
            this.setInputMax(this.shopCfg.limitNum - hasCpNum);
            this.limitTxt.text = ShopUtil.getLimitStr2(this.shopCfg.limitType, hasCpNum, this.shopCfg.limitNum - hasCpNum);
        }
    }

    protected onBuyClickHandler():void {
        let price:number = this.shopCfg.price * this.number_input.value;
        let isMoney:boolean = this.getMoney() >= price;
        if(this.buyCallBack){
            this.buyCallBack.fun.call(this.buyCallBack.caller,isMoney);
        }
        if(this.number_input.max == 0){
            if(this._data.smeltCategory == SmeltCategoryConfig.CONTEST){
                Tip.showTip(LangShop.L7);
            }else{
                Tip.showTip(LangShop.L6);
            }
        }else if(isMoney) {
            ProxyManager.compose.smelt(this._data.smeltPlanCode, this.number_input.value);
        }else{
            if(this._data.smeltCategory == SmeltCategoryConfig.CONTEST){
                Tip.showTip(LangShop.L5);
            }else{
                Tip.showTip(LangShop.L4);
            }
        }
        this.hide();
    }

    protected getMoney():number {
        if(this._data.smeltCategory == SmeltCategoryConfig.CONTEST){
            return CacheManager.pack.propCache.getItemCountByCode(ItemCodeConst.ContestToken);
        }else{
            return CacheManager.pack.propCache.getItemCountByCode(PeakCache.ItemPeakCostId);
        }
        
    }

}