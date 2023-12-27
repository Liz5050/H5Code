class LotteryAncientPanel extends LotteryBaseTabPanel {
    private btnHelp: fairygui.GButton;
    private btnOne: fairygui.GButton;
    private btnTen: fairygui.GButton;
    private listRecord: List;
    private txtPriceTen: fairygui.GTextField;
    private txtPriceOne: fairygui.GTextField;
    private txtItemTen: fairygui.GRichTextField;
    private txtItemOne: fairygui.GRichTextField;
    private btnPack: fairygui.GButton;
    private lotteryTimeTxt: fairygui.GTextField;
    private luckyTxt: fairygui.GTextField;
    private leftTimeTxt: fairygui.GTextField;
    private costIcon1: GLoader;
    private costIcon2: GLoader;
    private uiIsSet:boolean;
    private luckyProgress: LotteryLuckProgressView;
    private listItem: BaseItem[];
    private imgBest: GLoader;
    private itemBestCode: number;
    private timeProgress: LotteryAncientProgress;
    private itemBest: BaseItem;
    private mondayZeroTime: number;
    private freeTimes: number = 0;
    private txt_pro : fairygui.GButton;

    public constructor() {
        super();
        this.lotteryCategory = LotteryCategoryEnum.LotteryAncient;
    }

    public initOptUI():void {

        this.costIcon1 = <GLoader>this.getGObject("loader_propIcon1");
        this.costIcon2 = <GLoader>this.getGObject("loader_propIcon2");
        this.costIcon1.addClickListener(this.onItemClickHandler,this);
        this.costIcon2.addClickListener(this.onItemClickHandler,this);

        this.btnTen = this.getGObject("btn_ten").asButton;
        this.btnTen.title = this.tenStr;
        this.btnTen.addClickListener(this.onGUIBtnClick,this);
        this.btnOne = this.getGObject("btn_one").asButton;
        this.btnOne.addClickListener(this.onGUIBtnClick,this);
        this.btnOne.titleFontSize = this.btnTen.titleFontSize = 22;
        this.btnHelp = this.getGObject("btn_help").asButton;
        this.btnHelp.addClickListener(this.onGUIBtnClick,this);
        this.btnPack = this.getGObject("btn_pack").asButton;
        this.btnPack.addClickListener(this.onGUIBtnClick,this);
        this.imgBest = this.getGObject("img_best") as GLoader;
        this.imgBest.addClickListener(this.onGUIBtnClick,this);
        this.txtPriceTen = this.getGObject("txt_price_ten").asTextField;
        this.txtItemTen = this.getGObject("txt_item_ten").asRichTextField;
        this.txtPriceOne = this.getGObject("txt_price_one").asTextField;
        this.txtItemOne = this.getGObject("txt_item_one").asRichTextField;

        this.lotteryTimeTxt = this.getGObject("txt_lottery_time").asTextField;
        this.luckyTxt = this.getGObject("txt_lucky").asTextField;
        this.leftTimeTxt = this.getGObject("txt_left_time").asTextField;
        this.luckyProgress = new LotteryLuckProgressView(this.getGObject("lucky_progress").asCom);
        this.timeProgress = this.getGObject("ancient_progress") as LotteryAncientProgress;

        this.listItem = [];
        for(let i=1;i<=11;i++) {
            this.listItem.push(this.getGObject("baseItem" + i) as BaseItem);
        }
        this.itemBest = this.getGObject("baseItem999") as BaseItem;
        this.itemBest.bgUrl = null;
        this.itemBest.colorUrl = null;

        this.listRecord = new List(this.getGObject("list_log").asList);
        this.txt_pro = this.getGObject("txt_probability").asButton;
        this.txt_pro.addClickListener(this.openPorbWindow, this);

    }

    public updateAll(data?:any):void {
        super.updateAll();
        //
        this.txt_pro.visible = Sdk.platform_config_data.is_treasure_hunt == 1;
        
        if (!this.uiIsSet) {
            let typeItems:any[] = ConfigManager.lotteryShow.getItemsByLotteryType(this.lotteryCategory);
            let item:BaseItem;
            let itemIndex:number=0;
            let itemData:ItemData;
            let typeItemCfg:any;
            for(let i=0;i<typeItems.length;i++) {
                typeItemCfg = typeItems[i];
                if (typeItemCfg.valued == 1) {
                    this.itemBestCode = typeItems[i].item;
                    this.itemBest.itemData = new ItemData(this.itemBestCode);
                    this.itemBest.colorBgVisible = false;
                    this.itemBest.setNameVisible(false);
                    continue;
                }
                item = this.listItem[itemIndex];
                itemData = new ItemData(typeItemCfg.item);
                itemData.itemAmount = typeItemCfg.num;
                item.itemData = itemData;
                if (i < 6)
                    item.bgUrl = URLManager.getPackResUrl(PackNameEnum.Lottery,"goodBg");

                itemIndex++;
            }

            this.txtPriceOne.text = this.lotteryCfgs[0].cost;
            this.txtPriceTen.text = this.lotteryCfgs[1].cost;
            let iconUrl:string = ConfigManager.item.getByPk(this.lotteryCfgs[0].propCode).icon;
            this.costIcon1.load(URLManager.getIconUrl(iconUrl,URLManager.ITEM_ICON));
            iconUrl = ConfigManager.item.getByPk(this.lotteryCfgs[1].propCode).icon;
            this.costIcon2.load(URLManager.getIconUrl(iconUrl,URLManager.ITEM_ICON));

            this.uiIsSet = true;
        }

        this.updateLotteryInfo();
        this.onPosTypeBagChange();
        this.onLotteryAncientBagUpdate();
        this.countdownSunday();
        this.updateRecord();
        if(this.listRecord.data) {
			this.listRecord.scrollToView(0);
		}
    }

    public updateLotteryInfo():void {
        let info:any = CacheManager.lottery.getLotteryInfo(this.lotteryCategory);
        let times:number = 0;
        let bless = 0;
        if(info) {
            times = info.times;
            bless = info.bless;
            this.freeTimes = info.freeTime;
        }
        this.luckyProgress.setValue(bless,this.curTypeCfg.maxBless);
        this.luckyTxt.text = "" + bless;
        this.timeProgress.setValue(info);
        this.lotteryTimeTxt.text = "" + times;
        this.btnOne.text = this.freeTimes <= 0 ? this.onceStr : LangLottery.LANG4;
        if(this.freeTimes <= 0) {
            this.btnOne.title = this.onceStr;
            this.btnOne.titleFontSize = 22;
        }
        else {
            this.btnOne.title = LangLottery.LANG4;
            this.btnOne.titleFontSize = 28;
        }
        CommonUtils.setBtnTips(this.btnOne, this.freeTimes > 0);
    }

    /**背包道具更新 */
    public onPosTypeBagChange():void {
        let bagCount:number = CacheManager.pack.propCache.getItemCountByCode2(this.lotteryCfgs[0].propCode);
        let color:number = Color.Green2;
        if(bagCount < this.lotteryCfgs[0].propNum) {
            color = Color.Red;
        }
        this.txtItemOne.text = HtmlUtil.html(bagCount + "/" + this.lotteryCfgs[0].propNum,color);

        bagCount = CacheManager.pack.propCache.getItemCountByCode2(this.lotteryCfgs[1].propCode);
        color = Color.Green2;
        if(bagCount < this.lotteryCfgs[1].propNum) {
            color = Color.Red;
        }
        this.txtItemTen.text = HtmlUtil.html(bagCount + "/" + this.lotteryCfgs[1].propNum,color);
    }

    public onLotteryAncientBagUpdate():void {
        CommonUtils.setBtnTips(this.btnPack,CacheManager.pack.lotteryAncientPack.getHadTrueItem(),this.btnPack.width - 30, -15,false);
    }

    private countdownSunday():void {
        this.mondayZeroTime = App.DateUtils.getThisWeekOneDay(CacheManager.serverTime.getServerTime(), 7);
        App.TimerManager.doTimer(1000, 0, this.onCountdown, this);
    }

    private onCountdown():void {
        let leftTime:number = this.mondayZeroTime - CacheManager.serverTime.getServerTime();
        this.leftTimeTxt.text = App.StringUtils.substitude(LangLottery.LANG1, App.DateUtils.getTimeStrBySeconds(leftTime, DateUtils.FORMAT_1));
    }

    /**寻宝记录更新 */
    public updateRecord():void {
        this.listRecord.data = CacheManager.lottery.getLotteryRecords(this.lotteryCategory);
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
            case this.btnPack:
                this.openLotteryStore();
                break;
            case this.btnTen:
                this.lottery(this.lotteryCfgs[1].amount);
                break;
            case this.btnOne:
                this.lottery(this.lotteryCfgs[0].amount, this.freeTimes);
                break;
            case this.btnHelp:
                EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:LangLottery.LANG10});
                break;
            case this.imgBest:
                ToolTipManager.showByCode(this.itemBestCode);
                break;
        }
    }


    private openPorbWindow() {
        EventManager.dispatch(UIEventEnum.LotteryProbilityOpen, 3 );
    }

    public hide():void {
        super.hide();
        App.TimerManager.removeAll(this);
    }
}