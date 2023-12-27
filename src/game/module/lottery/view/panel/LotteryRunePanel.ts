class LotteryRunePanel extends LotteryBaseTabPanel {
	private bgLoader:GLoader;
    private bgLoader2:GLoader;
    private costIcon1:GLoader;
    private costIcon2:GLoader;
    private txtLucky:fairygui.GTextField;
    private txtTips:fairygui.GTextField;
    private txtOnePrice:fairygui.GTextField;
    private txtTenPrice:fairygui.GTextField;
    private txtLotteryCount:fairygui.GRichTextField;
    private txtBagCount1:fairygui.GRichTextField;
    private txtBagCount2:fairygui.GRichTextField;
    private btnShop:fairygui.GButton;
    private btnStore:fairygui.GButton;
    private btnTen:fairygui.GButton;
    private btnOnce:fairygui.GButton;
    private btnHelp:fairygui.GButton;
    private listItem:List;

	private luckyProgress:LotteryLuckProgressView;
	private rewardBoxs:LotteryRewardBoxView[];
	private explainStr:string;
    private txt_pro : fairygui.GButton;


	public constructor() {
		super();
		this.lotteryCategory = LotteryCategoryEnum.LotteryRune;
	}

	public initOptUI():void {
		this.bgLoader = <GLoader>this.getGObject("bgLoader");
		this.bgLoader.load(URLManager.getModuleImgUrl("lotteryRuneBg1.jpg",PackNameEnum.Lottery));
        this.bgLoader2 = <GLoader>this.getGObject("bgLoader2");
		this.bgLoader2.load(URLManager.getModuleImgUrl("lotteryRuneBg2.jpg",PackNameEnum.Lottery));
        this.costIcon1 = <GLoader>this.getGObject("loader_propIcon1");
        this.costIcon2 = <GLoader>this.getGObject("loader_propIcon2");
		this.costIcon1.addClickListener(this.onItemClickHandler,this);
		this.costIcon2.addClickListener(this.onItemClickHandler,this);

        this.txtLucky = this.getGObject("txt_lucky").asTextField;
        this.txtTips = this.getGObject("txt_tips").asTextField;
        this.txtOnePrice = this.getGObject("txt_onePrice").asTextField;
        this.txtTenPrice = this.getGObject("txt_tenPrice").asTextField;
        this.txtLotteryCount = this.getGObject("txt_lotteryCount").asRichTextField;
        this.txtBagCount1 = this.getGObject("txt_bagCount1").asRichTextField;
        this.txtBagCount2 = this.getGObject("txt_bagCount2").asRichTextField;
        this.btnShop = this.getGObject("btn_shop").asButton;
        this.btnStore = this.getGObject("btn_store").asButton;
        this.btnTen = this.getGObject("btn_ten").asButton;
        this.btnOnce = this.getGObject("btn_once").asButton;
		this.btnTen.title = this.buyStr;
		this.btnOnce.title = this.buyStr;
		// this.btnOnce.titleFontSize = this.btnTen.titleFontSize = 22;
        this.btnHelp = this.getGObject("btn_help").asButton;
        this.listItem = new List(this.getGObject("list_item").asList,{isSelectStatus:false});

		this.luckyProgress = new LotteryLuckProgressView(this.getGObject("lucky_progress").asCom);
		this.rewardBoxs = [];
		let rewardCfgs:any[] = ConfigManager.lotteryReward.getRewardByLotteryCategory(this.lotteryCategory);
		for(let i:number = 0; i < rewardCfgs.length; i++) {
			let obj:fairygui.GObject = this.getGObject("rewardBox_" + i);
			if(!obj) break;
			let box:LotteryRewardBoxView = new LotteryRewardBoxView(obj.asCom);
			box.updateAll(rewardCfgs[i]);
			this.rewardBoxs.push(box);
		}

        this.btnShop.addClickListener(this.onGUIBtnClick, this);
        this.btnStore.addClickListener(this.onGUIBtnClick, this);
        this.btnTen.addClickListener(this.onGUIBtnClick, this);
        this.btnOnce.addClickListener(this.onGUIBtnClick, this);
        this.btnHelp.addClickListener(this.onGUIBtnClick, this);
        this.txt_pro = this.getGObject("txt_probability").asButton;
        this.txt_pro.addClickListener(this.openPorbWindow, this);

		this.explainStr = "1、使用<font color='#09c73d'>符文灵匙</font>寻宝可以获得已解锁的高品质符文\n" +
		"2、寻宝十次更容易获得极品符文\n" +
		"3、符文寻宝累计次数达到指定数量时，还可以领取额外的<font color='#09c73d'>符文碎片</font>奖励，碎片可以在<font color='#09c73d'>碎片商店</font>兑换<font color='#09c73d'>金色符文</font>\n" +
		"4、符文寻宝累计次数<font color='#09c73d'>每周日晚23:59</font>重置\n" + 
		"5、如果寻宝未获得金色符文，则可以获得一定的祝福值，祝福值越高获得珍稀符文的概率越高\n" + 
		"6、当祝福值满时寻宝<font color='#09c73d'>必定</font>获得已解锁的金色符文\n" + 
		"7、寻宝获得金色符文会<font color='#09c73d'>重置</font>当前积累的祝福值\n" + 
		"8、每日最多可以寻宝10万次"
	}

	public updateAll(data?:any):void {
		super.updateAll();
        this.txt_pro.visible = Sdk.platform_config_data.is_treasure_hunt == 1;
		this.txtOnePrice.text = this.lotteryCfgs[0].cost;
		this.txtTenPrice.text = this.lotteryCfgs[1].cost;
		let iconUrl:string = ConfigManager.item.getByPk(this.lotteryCfgs[0].propCode).icon;
		this.costIcon1.load(URLManager.getIconUrl(iconUrl,URLManager.ITEM_ICON));
		iconUrl = ConfigManager.item.getByPk(this.lotteryCfgs[1].propCode).icon;
		this.costIcon2.load(URLManager.getIconUrl(iconUrl,URLManager.ITEM_ICON));
		this.updateRuneList();
		this.updateLotteryInfo();
		this.onPosTypeBagChange();
		this.onLotteryRuneBagUpdate();
	}

	/**
	 * 更新已解锁符文列表
	 * 不需要监听副本信息更新，没有在打开界面的情况下更新符文塔通关数
	 */
	private updateRuneList():void {
		let floor: number = CacheManager.copy.getCopyProcess(CopyEnum.CopyTower);
		let types:string[] = ConfigManager.mgRuneCopy.getRuneTypesByFloor(floor);
		let itemDatas:ItemData[] = [];
		for(let i:number = 0; i < types.length; i++) {
			if(types[i] == "" || !RuneUtil.isShowRune(Number(types[i]))) continue;
			itemDatas = itemDatas.concat(ConfigManager.item.selectCTAndColor(ECategory.ECategoryRune, Number(types[i]), EColor.EColorPurple, EColor.EColorGold,true));
		}
		if(itemDatas) {
			this.listItem.setVirtual(itemDatas);
		}
		CommonUtils.setBtnTips(this.btnShop, CacheManager.runeShop.checkExchangeTips());
	}
	
	/**更新寻宝信息 */
	public updateLotteryInfo():void {
		let info:any = CacheManager.lottery.getLotteryInfo(this.lotteryCategory);
		// optional int32 type = 1;   
		// optional int32 times = 2;   //寻宝次数(本周)
		// optional int32 bless = 3;   //祝福值
		// optional SeqInt hadGetRewards= 4; //已领取奖励
		let times:number = 0;
		let bless = 0;
		if(info) {
			times = info.times;
			bless = info.bless;
		}
		this.luckyProgress.setValue(bless,this.curTypeCfg.maxBless);
		this.txtLucky.text = "" + bless;
		this.txtLotteryCount.text = "额外奖励\n本周累计" + HtmlUtil.html(times + "",Color.BASIC_COLOR_12,false,20) + "次";
		for(let i:number = 0; i < this.rewardBoxs.length; i++) {
			this.rewardBoxs[i].updateLotteryInfo(info);
		}
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

	public onLotteryRuneBagUpdate():void {
		CommonUtils.setBtnTips(this.btnStore,CacheManager.pack.lotteryRunePack.getHadTrueItem());
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

	private onGUIBtnClick(e:egret.TouchEvent):void{
        let btn: any = e.target;
        switch (btn) {
            case this.btnShop:
				EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.RuneShop);
                break;
            case this.btnStore:
				this.openLotteryStore();
                break;
            case this.btnTen:
				this.lottery(this.lotteryCfgs[1].amount);
                break;
            case this.btnOnce:
				this.lottery(this.lotteryCfgs[0].amount);
                break;
            case this.btnHelp:
				EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:this.explainStr});
                break;
        }
    }

    private openPorbWindow() {
        EventManager.dispatch(UIEventEnum.LotteryProbilityOpen,2);
    }
}