class LotteryBaseTabPanel extends BaseTabView {
	protected lotteryCategory:LotteryCategoryEnum;
	protected curTypeCfg:any;
	protected lotteryCfgs:any[];
	protected onceStr:string;
	protected tenStr:string;
	protected buyStr:string;
	protected giveMoney:number = 10000;
	public constructor() {
		super();
		let cfg:any = ConfigManager.const.getByPk("LotteryGiveMoney");
		if(cfg && cfg.constValue > 0) {
			this.giveMoney = Math.floor(cfg.constValue / 10000);
		}
		this.buyStr = App.StringUtils.substitude(LangLottery.L11,this.giveMoney);
		this.tenStr = App.StringUtils.substitude(LangLottery.L13,this.giveMoney * 10,10);
		this.onceStr = App.StringUtils.substitude(LangLottery.L13,this.giveMoney,1);
	}

	public initOptUI():void {
	}

	public updateAll():void {
		this.curTypeCfg = ConfigManager.lotteryType.getCurrentTypeConfig(this.lotteryCategory);
		this.lotteryCfgs = ConfigManager.lottery.getLotteryTypeList(this.curTypeCfg.type);
		if(!CacheManager.lottery.isClick[this.lotteryCategory]) {
			EventManager.dispatch(LocalEventEnum.LotteryGetLog,this.lotteryCategory);
		}
	}

	protected openLotteryStore():void {
		EventManager.dispatch(UIEventEnum.LotteryPackOpen,this.lotteryCategory);
	}

	public updateLotteryInfo():void {
	}

	public updateRecord():void {
		
	}

	public onPosTypeBagChange():void {
		
	}

	protected lottery(count:number, freeTime:number = 0):void {
		let lotteryCfg:any = ConfigManager.lottery.getByPk(this.curTypeCfg.type + "," + count);
		let bagCount:number = CacheManager.pack.propCache.getItemCountByCode2(lotteryCfg.propCode);
		if(bagCount < lotteryCfg.propNum && freeTime <= 0) {
			let diffNum:number = lotteryCfg.propNum - bagCount;
			let price:number = Math.floor(lotteryCfg.cost / lotteryCfg.propNum) * diffNum;
			let itemCfg:any = ConfigManager.item.getByPk(lotteryCfg.propCode);
			let tips:string = HtmlUtil.colorSubstitude(LangLottery.L12,price,this.giveMoney*count,count);//"道具数量不足，是否消耗" + HtmlUtil.html(price + "",Color.Color_5) + "元宝购买\n" + HtmlUtil.html(itemCfg.name,Color.getItemColr(itemCfg.color)) + "*" + HtmlUtil.html(diffNum + "",Color.Color_6);
			AlertII.show(tips,AlertCheckEnum.LOTTERY_BUY_TIPS,function(type:AlertType) {
				if(type == AlertType.YES) {
					if(MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,price)) {
						EventManager.dispatch(LocalEventEnum.LotteryRequest,this.curTypeCfg.type,count);
					}
				}
			},this);
		}
		else {
			EventManager.dispatch(LocalEventEnum.LotteryRequest,this.curTypeCfg.type,count);
		}
	}

	public get category():LotteryCategoryEnum {
		return this.lotteryCategory;
	}
}