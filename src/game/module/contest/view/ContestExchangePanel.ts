class ContestExchangePanel extends BaseTabView {
    private timeTxt: fairygui.GRichTextField;
    private countTxt: fairygui.GRichTextField;
    private descTxt: fairygui.GRichTextField;
    private goodList: List;

    private planGoods: Array<any>;

    private countDown: number;
    private timerHandler: number = -1;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        this.timeTxt = this.getGObject("txt_time").asRichTextField;
        this.descTxt = this.getGObject("txt_desc").asRichTextField;
        this.countTxt = this.getGObject("txt_count").asRichTextField;
        this.goodList = new List(this.getGObject("list_item").asList);
    }

    public updateAll(data?: any): void {
        if (!this.goodList.data) {
            this.planGoods = ConfigManager.smeltPlan.select({"smeltCategory": SmeltCategoryConfig.CONTEST});
            this.sortGoods();
            this.goodList.data = this.planGoods;
            // this.goodList.setVirtual(planGoods);
            this.descTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG35);
        }
        this.updateItemCost();

        this.countDown = CacheManager.contest.leftTime;
        this.onCountDown();
		if(this.timerHandler == -1){
			this.timerHandler = egret.setInterval(this.onCountDown,this,1000);
		}
    }

    public updateItemCost():void {//    改成读道具
        // this.peakAssetTxt.text = App.StringUtils.substitude(LangPeak.SHOP2, CacheManager.pack.propCache.getItemCountByCode(ItemCodeConst.ContestToken));
        this.countTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG34, CacheManager.pack.propCache.getItemCountByCode(ItemCodeConst.ContestToken));
    }

    public updateInfo(): void{
        // this.goodList.refresh();
        this.sortGoods();
        this.goodList.data = this.planGoods;
        this.updateItemCost();
    }

    private sortGoods():void{
		if(this.planGoods && this.planGoods.length > 0){
			this.planGoods.sort((a: any, b:any): number =>{
				return this.getGoodSort(a,b);
			});
		}
	}

    private getGoodSort(a:any, b:any):number{
        if(this.isCanExchange(a) && !this.isCanExchange(b)){
            return -1;
        }else if(!this.isCanExchange(a) && this.isCanExchange(b)){
            return 1;
        }else{
            return a.smeltPlanCode - b.smeltPlanCode;
        }
    }

    private updateTimeTxt(): void{
        let timeStr: string = App.DateUtils.getTimeStrBySeconds(this.countDown, DateUtils.FORMAT_1);
		this.timeTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG36, timeStr);
	}

	private onCountDown(): void{
		this.countDown --;
		if(this.countDown <= 0){
			this.removeTimer();
		}
		this.updateTimeTxt();
	}

	private removeTimer():void {
        // App.TimerManager.remove(this.onCountDown, this);
		if(this.timerHandler != -1) {
			egret.clearInterval(this.timerHandler);
			this.timerHandler = -1;
		}
    }

     public isCanExchange(data: any): boolean {
        let hasBuyNum: number = 0;
        let limitNum: number = 0;
        let matData: ItemData = CommonUtils.configStrToArr(data.smeltMaterialList)[0];
        let isCanExchange = matData.getItemAmount() <= CacheManager.pack.propCache.getItemCountByCode(matData.getCode());
        if (data.limitNum) {
            if (data.limitType) {
                hasBuyNum = CacheManager.compose.limitGoods[data.smeltPlanCode] || 0;
                limitNum = data.limitNum - hasBuyNum;
            } else {
                limitNum = data.limitNum;
            }

            if(isCanExchange){
                isCanExchange = limitNum > 0;
            }
        }
        return isCanExchange;
    }

}