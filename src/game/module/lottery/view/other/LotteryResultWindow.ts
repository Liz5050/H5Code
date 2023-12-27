class LotteryResultWindow extends BaseWindow {
	private txtPrice:fairygui.GTextField;
	private txtBagCount:fairygui.GRichTextField;
	private btnLottery:fairygui.GButton;
	private costIcon:GLoader;
	// private itemList:List;
	private items:ItemData[];

	private baseItems:BaseItem[];
	private item_mcContainer:fairygui.GComponent;
	private itemMc:UIMovieClip[];
	private timeIndexs:number[];
	private betterMc:UIMovieClip;
	private item_better:LotteryBetterItem;
	private betterTimeIndex:number = -1;

	private type:number;
	private times:number;

	private lotteryCfg:any;
    private lastClickTime: number = 0;
	private giveMoney:number;
	public constructor() {
		super(PackNameEnum.Lottery,"LotteryResultWindow");
		this.isAnimateShow = false;
		this.giveMoney = Math.floor(ConfigManager.const.getConstValue("LotteryGiveMoney") / 10000);
		this.isShowCloseObj = true;
	}

	public initOptUI():void {
		// this.itemList = new List(this.getGObject("list_item").asList);
		let mcTitle_container:fairygui.GComponent = this.getGObject("mcTitle_container").asCom;
		let titleMc:UIMovieClip = UIMovieManager.get(PackNameEnum.MCLotteryResultTitle);
		titleMc.setPlaySettings(0,-1,-1,-1);
		titleMc.playing = true;
		mcTitle_container.addChild(titleMc);

		this.txtPrice = this.getGObject("txt_price").asTextField;
		this.txtBagCount = this.getGObject("txt_bagCount").asRichTextField;
		this.costIcon = this.getGObject("loader_propIcon") as GLoader;
		this.costIcon.addClickListener(this.onItemClickHandler,this);
		this.btnLottery = this.getGObject("btn_lottery").asButton;
		this.btnLottery.addClickListener(this.onLotteryHandler,this);
		this.baseItems = [];
		this.itemMc = [];
		this.timeIndexs = [];
		for(let i:number = 0; i < 10; i++) {
			let item:BaseItem = this.getGObject("baseItem_" + i) as BaseItem;
			this.baseItems.push(item);
		}
		this.item_mcContainer = this.getGObject("item_mcContainer").asCom;
		this.betterMc = UIMovieManager.get(PackNameEnum.MCEquipBest);
		this.betterMc.x = 270;
		this.betterMc.y = 154;
		this.betterMc.setPlaySettings(0,-1,-1);
		this.betterMc.visible = false;
		this.betterMc.playing = false;
		this.addChild(this.betterMc);

		this.item_better = this.getGObject("item_better") as LotteryBetterItem;
		this.item_better.visible = false;
		GuideTargetManager.reg(GuideTargetName.LotteryResultWindowCloseBtn, this.closeObj);
	}

	public updateAll(data?:any):void {
		this.type = data.type;
		this.times = data.amount;
		this.clearEffect();
		if(!this.items) {
			this.lotteryCfg = ConfigManager.lottery.getByPk(this.type + "," + this.times);
			this.txtPrice.text = this.lotteryCfg.cost;
			let iconUrl:string = ConfigManager.item.getByPk(this.lotteryCfg.propCode).icon;
			this.costIcon.load(URLManager.getIconUrl(iconUrl,URLManager.ITEM_ICON));
			this.btnLottery.title = "寻宝" + GameDef.NumberName[this.lotteryCfg.amount] + "次";
			this.onPosTypeBagChange();
		}
		this.items = [];
		let sItems:any[] = data.records.data;
		let betterIndex:number = -1;
		let offsetTime:number = 0;
		for(let i:number = 0; i < sItems.length; i++) {
			this.items.push(new ItemData({"jsStr_S" : sItems[i].jsStr_S, "itemCode_I" : sItems[i].itemCode_I, "itemAmount_I" : sItems[i].num_I}));
			let item:BaseItem = this.baseItems[i];
			item.x = 171 + (i%4) * 125;
			item.y = 155 + Math.floor(i/4) * 104;
			item.visible = false;
			item.itemData = this.items[i];
			// let isSpecial:boolean = ConfigManager.lotteryShow.isSpecialRewardItem(this.type,sItems[i].itemCode_I);
			let delay:number = i*200 + 10;
			// if(i > betterIndex && betterIndex != -1) {
			// 	 delay += offsetTime;
			// }
			if(i == 0) {
				if(this.times == 1) {
					item.x = 355;
				}
				else {
					item.x = 171;
				}
			}
			if(!!item.itemData.getItemInfo().lotteryEffect) {
				// betterIndex = i;
				// offsetTime += 1200;
				if(betterIndex == -1) betterIndex = i;
				this.betterItems.unshift(item);
			}
			let timeIndex:number;
			timeIndex = egret.setTimeout(function(){
				let index:number = this.timeIndexs.indexOf(timeIndex);
				index != -1 && this.timeIndexs.splice(index,1);

				item.visible = true;
				item.scaleX = item.scaleY = 1.8;
				egret.Tween.get(item).to({scaleX:0.8,scaleY:0.8},260,egret.Ease.circOut);
				let effect:UIMovieClip = UIMovieManager.get(PackNameEnum.MCInnerPowerSmall);
				effect.x = item.x - 250;
				effect.y = item.y - 259;
				effect.playing = true;
				this.item_mcContainer.addChild(effect);
				this.itemMc.push(effect);
				effect.setPlaySettings(0,-1,1,-1,function(){
					let mcIndex:number = this.itemMc.indexOf(effect);
					mcIndex != -1 && this.itemMc.splice(mcIndex,1);
					UIMovieManager.push(effect);
				},this);
			},this,delay);
			this.timeIndexs.push(timeIndex);
		}
		
		let betterTimeDelay:number = betterIndex*200 + 10;
		if(this.betterTimeIndex == -1) {
			this.betterTimeIndex = egret.setTimeout(()=>{
				this.showBetter(this.betterItems.pop());
				this.betterTimeIndex = -1;
			},this,betterTimeDelay);
		}
	}

	private betterItems:BaseItem[] = [];
	private betterIsShow:boolean = false;
	private showBetter(betterItem:BaseItem):void {
		if(!betterItem) {
			return;
		}
		if(this.betterIsShow) {
			this.betterItems.unshift(betterItem);
			return;
		}
		this.betterIsShow = true;
		this.item_better.setData(betterItem.itemData);
		// let itemX:number = this.item_better.x = betterItem.x;
		// let itemY:number = this.item_better.y = betterItem.y;
		this.item_better.visible = true;
		this.item_better.alpha = 0;
		egret.Tween.get(this.item_better).to({x:360,alpha:1,scaleX:1.5,scaleY:1.5},260,egret.Ease.backInOut).call(()=>{
			this.betterMc.visible = true;
			this.betterMc.playing = true;
			this.item_better.playEffect();
		}).wait(1000).call(()=>{
			this.betterMc.visible = false;
			this.betterMc.playing = false;
			this.item_better.stopEffect();
		}).to({x:betterItem.x,y:betterItem.y,scaleX:0.8,scaleY:0.8},100,egret.Ease.circOut).call(()=>{
			this.item_better.visible = false;
			this.item_better.x = -60;
			this.item_better.y = 259;
			this.betterIsShow = false;
			this.showBetter(this.betterItems.pop());
		});
	}

	private clearEffect():void {
		if(this.betterTimeIndex != -1) {
			egret.clearTimeout(this.betterTimeIndex);
			this.betterTimeIndex = -1;
		}
		egret.Tween.removeTweens(this.item_better);
		this.item_better.stopEffect();
		this.item_better.x = -60;
		this.item_better.y = 259;
		this.item_better.scaleX = this.item_better.scaleY = 0.8;
		this.item_better.visible = false;
		this.item_better.alpha = 0;
		this.betterItems = [];
		this.betterIsShow = false;

		this.betterMc.visible = false;
		this.betterMc.playing = false;
		let indexLength:number = this.timeIndexs.length;
		let i:number = 0;
		for(i; i < indexLength; i++) {
			egret.clearTimeout(this.timeIndexs[i]);
		}
		this.timeIndexs = [];
		for(i = 0; i < this.baseItems.length; i++) {
			egret.Tween.removeTweens(this.baseItems[i]);
			this.baseItems[i].rotation = 0;
			this.baseItems[i].x = 171 + (i%4) * 125;
			this.baseItems[i].y = 155 + Math.floor(i/4) * 104;
			this.baseItems[i].visible = false;
			this.baseItems[i].scaleX = this.baseItems[i].scaleY = 0.8;
		}
		let mcLength:number = this.itemMc.length;
		for(i = 0; i < mcLength; i++) {
			this.itemMc[i].playing = false;
			UIMovieManager.push(this.itemMc[i]);
			this.itemMc[i] = null;
		}
		this.itemMc = [];
	}

	public onPosTypeBagChange():void {
		let bagCount:number = CacheManager.pack.propCache.getItemCountByCode2(this.lotteryCfg.propCode);
		let color:number = Color.Green2;
		if(bagCount < this.lotteryCfg.propNum) {
			color = Color.Red;
		}
		this.txtBagCount.text = HtmlUtil.html(bagCount + "/" + this.lotteryCfg.propNum,color);
	}

	private onItemClickHandler():void {
		ToolTipManager.showByCode(this.lotteryCfg.propCode);
	}

	private onLotteryHandler():void {
		// let now:number = egret.getTimer();
		// if (now - this.lastClickTime < 1500) {
		// 	return;
		// }
        // this.lastClickTime = now;

		let bagCount:number = CacheManager.pack.propCache.getItemCountByCode2(this.lotteryCfg.propCode);
		if(bagCount < this.lotteryCfg.propNum) {
			let diffNum:number = this.lotteryCfg.propNum - bagCount;
			let price:number = Math.floor(this.lotteryCfg.cost / this.lotteryCfg.propNum) * diffNum;
			if(!MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,price)) {
				this.hide();
				return;
			}
			let itemCfg:any = ConfigManager.item.getByPk(this.lotteryCfg.propCode);
			let tips:string = HtmlUtil.colorSubstitude(LangLottery.L12,price,this.giveMoney,this.lotteryCfg.propNum);//"道具数量不足，是否消耗" + price + "元宝购买" + HtmlUtil.html(itemCfg.name,Color.getItemColr(itemCfg.color)) + "*" + diffNum;
			AlertII.show(tips,AlertCheckEnum.LOTTERY_BUY_TIPS,function(type:AlertType) {
				if(type == AlertType.YES) {
					EventManager.dispatch(LocalEventEnum.LotteryRequest,this.type,this.times);
				}
			},this);
		}
		else {
			EventManager.dispatch(LocalEventEnum.LotteryRequest,this.type,this.times);
		}
	}

	public hide():void {
		super.hide();
		// egret.Tween.removeTweens(this.itemList.list);
		// this.itemList.list.scaleX = 0.8;
		// this.itemList.list.scaleY = 0.8;
		// this.itemList.list.alpha = 1;
		// this.itemList.data = null;
		this.clearEffect();
		this.items = null;
		// this.itemList.list.numItems = 0;
	}
}