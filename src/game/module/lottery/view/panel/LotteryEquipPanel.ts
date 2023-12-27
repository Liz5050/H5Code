class LotteryEquipPanel extends LotteryBaseTabPanel {
	private mc1:UIMovieClip;
	private mc2:UIMovieClip;
	private bgLoader:GLoader;
    private txtOnePrice:fairygui.GTextField;
    private txtTenPrice:fairygui.GTextField;
    private txtBagCount1:fairygui.GRichTextField;
    private txtBagCount2:fairygui.GRichTextField;
    private btnStore:fairygui.GButton;
    private btnTen:fairygui.GButton;
    private btnOnce:fairygui.GButton;
	private btnHelp:fairygui.GButton;
    private listRecord:List;
    // private listLeft:List;
    // private listRight:List;
	private showItems:BaseItem[];
	private costIcon1:GLoader;
	private costIcon2:GLoader;

	private txt_pro : fairygui.GButton;

	private timeIndex:number = -1;
	private autoScroll:boolean = true;
	private mask_list:fairygui.GGraph;
	public constructor() {
		super();
		this.lotteryCategory = LotteryCategoryEnum.LotteryEquip;
	}

	public initOptUI():void {
		this.bgLoader = <GLoader>this.getGObject("bgLoader");
		this.bgLoader.load(URLManager.getModuleImgUrl("lotteryEquipBg.jpg",PackNameEnum.Lottery));

        this.txtOnePrice = this.getGObject("txt_onePrice").asTextField;
        this.txtTenPrice = this.getGObject("txt_tenPrice").asTextField;
        this.txtBagCount1 = this.getGObject("txt_bagCount1").asRichTextField;
        this.txtBagCount2 = this.getGObject("txt_bagCount2").asRichTextField;
		this.costIcon1 = this.getGObject("loader_propIcon1") as GLoader;
		this.costIcon2 = this.getGObject("loader_propIcon2") as GLoader;
		this.costIcon1.addClickListener(this.onItemClickHandler,this);
		this.costIcon2.addClickListener(this.onItemClickHandler,this);
        this.btnStore = this.getGObject("btn_store").asButton;
		this.btnStore.addClickListener(this.openLotteryStore,this);

        this.btnTen = this.getGObject("btn_ten").asButton;
		this.btnTen.title = this.buyStr;
		this.btnTen.addClickListener(this.onTenHandler,this);
        this.btnOnce = this.getGObject("btn_once").asButton;
		this.btnOnce.title = this.buyStr;
		this.btnOnce.addClickListener(this.onOnceHandler,this);
		this.btnOnce.titleFontSize = this.btnTen.titleFontSize = 22;
		this.btnHelp = this.getGObject("btn_help").asButton;
		this.btnHelp.addClickListener(this.onOpenExplainHandler,this);
		this.txt_pro = this.getGObject("txt_probability").asButton;
		this.txt_pro.addClickListener(this.openPorbWindow, this);
		
        this.listRecord = new List(this.getGObject("list_log").asList);
		this.mask_list = this.getGObject("mask_list").asGraph;

		this.listRecord.list.displayObject.mask = this.mask_list.displayObject;
		this.listRecord.list.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onLogTouchBeginHandler,this);
		this.listRecord.list.addEventListener(egret.TouchEvent.TOUCH_END,this.onLogTouchEndHandler,this);
		this.listRecord.list.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.onLogOutSideHandler,this);

		let typeItems:any[] = ConfigManager.lotteryShow.getItemsByLotteryType(LotteryCategoryEnum.LotteryEquip);
		this.showItems = [];
		for(let i:number = 0; i < 12; i++) {
			let item:BaseItem = this.getGObject("item_" + i) as BaseItem;
			item.isShowName = false;
			if (i == 0 || i == 6) {
				item.isShowGoldMc = false;
			}
			this.showItems.push(item);
			if(typeItems && i < typeItems.length) {
				let itemData:ItemData = new ItemData(typeItems[i].item);
				itemData.itemAmount = typeItems[i].num;
				item.setData(itemData);
			}
		}

		let container:fairygui.GComponent = this.getGObject("mc1_container").asCom;
		this.mc1 = UIMovieManager.get(PackNameEnum.MCEquipBest);
		container.addChild(this.mc1);

		container = this.getGObject("mc2_container").asCom;
		this.mc2 = UIMovieManager.get(PackNameEnum.MCEquipBest);
		container.addChild(this.mc2);

		// this.explainStr = "1、使用<font color='#09c73d'>装备灵钥</font>寻宝可以获得<font color='#09c73d'>神装</font>、<font color='#09c73d'>橙装</font>以及其他珍贵材料，飞速提升战力\n" +
		// 				  "2、玩家可以选择单次寻宝和十次寻宝，十次寻宝必定可以获得神装，也更容易获得其他极品道具\n" +
		// 				  "3、寻宝获得的道具存放在<font color='#09c73d'>寻宝仓库</font>\n" +
		// 				  "4、每日最多可寻宝10万次\n";

		GuideTargetManager.reg(GuideTargetName.LotteryEquipPanelOnceBtn, this.btnOnce);
		GuideTargetManager.reg(GuideTargetName.LotteryEquipPanelStoreBtn, this.btnStore);

	}

	private onLogTouchBeginHandler():void {
		this.autoScroll = false;
		//console.log("TouchBegin");
	}

	private onLogTouchEndHandler():void {
		this.autoScroll = true;
		//console.log("TouchEnd");
	}

	private onLogOutSideHandler():void {
		this.autoScroll = true;
		//console.log("TouchOutSide");
	}

	public updateAll(data?:any):void {
		super.updateAll();
		this.mc1.playing = true;
		this.mc2.playing = true;
		this.txt_pro.visible = Sdk.platform_config_data.is_treasure_hunt == 1;
		this.txtOnePrice.text = this.lotteryCfgs[0].cost;
		this.txtTenPrice.text = this.lotteryCfgs[1].cost;
		let iconUrl:string = ConfigManager.item.getByPk(this.lotteryCfgs[0].propCode).icon;
		this.costIcon1.load(URLManager.getIconUrl(iconUrl,URLManager.ITEM_ICON));
		iconUrl = ConfigManager.item.getByPk(this.lotteryCfgs[1].propCode).icon;
		this.costIcon2.load(URLManager.getIconUrl(iconUrl,URLManager.ITEM_ICON));
		this.onPosTypeBagChange();
		this.onLotteryEquipBagUpdate();
		this.updateRecord();
		this.listRecord.list.scrollToView(0);
		if(this.timeIndex == -1) {
			this.timeIndex = egret.setInterval(()=>{
				if(this.autoScroll && this.listRecord.data && this.listRecord.data.length >= 5) {
					this.listRecord.list.scrollPane.posY += 1;
				}
			},this,50);
		}
		// if(this.listRecord.data) {
		// 	this.listRecord.scrollToView(0);
		// }
	}

	/**背包道具更新 */
	public onPosTypeBagChange():void {
		let bagCount:number = CacheManager.pack.propCache.getItemCountByCode2(this.lotteryCfgs[0].propCode);
		let color:number = Color.Green2;
		if(bagCount < this.lotteryCfgs[0].propNum) {
			color = Color.Red;
		}
		this.txtBagCount1.text = HtmlUtil.html(bagCount + "/" + this.lotteryCfgs[0].propNum,color);

		bagCount = CacheManager.pack.propCache.getItemCountByCode2(this.lotteryCfgs[1].propCode);
		color = Color.Green2;
		if(bagCount < this.lotteryCfgs[1].propNum) {
			color = Color.Red;
		}
		this.txtBagCount2.text = HtmlUtil.html(bagCount + "/" + this.lotteryCfgs[1].propNum,color);
	}

	public onLotteryEquipBagUpdate():void {
		CommonUtils.setBtnTips(this.btnStore,CacheManager.pack.lotteryEquipPack.getHadTrueItem());
	}

	/**寻宝记录更新 */
	public updateRecord():void {
		let records:any[] = CacheManager.lottery.getLotteryRecords(this.lotteryCategory);
		let maskHegiht:number = 0;
		if(records) {
			maskHegiht = records.length >= 5 ? 150 : records.length * 34;
		}
		else {
			maskHegiht = 34;
		}
		this.mask_list.height = maskHegiht;
		this.listRecord.setVirtual(records,null,null,null,true);
		// this.listRecord.data = CacheManager.lottery.getLotteryRecords(this.lotteryCategory);
		this.listRecord.list.scrollPane.touchEffect = records && records.length >= 5;
	}

	private onItemClickHandler(evt:egret.TouchEvent):void {
		let item:GLoader = evt.currentTarget as GLoader;
		if(item == this.costIcon1) {
			ToolTipManager.showByCode(this.lotteryCfgs[0].propCode);
		}
		else if(item == this.costIcon2) {
			ToolTipManager.showByCode(this.lotteryCfgs[1].propCode);
		}
	}

	/**
	 * 活动说明
	 */
	private onOpenExplainHandler():void {
		EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:LangLottery.L14});
	}

	/**十连抽 */
	private onTenHandler():void {
		this.lottery(this.lotteryCfgs[1].amount);
	}

	/**抽一次 */
	private onOnceHandler():void {
		this.lottery(this.lotteryCfgs[0].amount);
	}

    private openPorbWindow() {
        EventManager.dispatch(UIEventEnum.LotteryProbilityOpen,1);
    }

	public hide():void {
		super.hide();
		if(this.timeIndex != -1){
			egret.clearInterval(this.timeIndex);
			this.timeIndex = -1;
		}
		this.mc1.playing = false;
		this.mc2.playing = false;
	}
}