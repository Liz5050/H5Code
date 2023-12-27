class MiningHireModule extends BaseModule {
    private moneyCostTxt: fairygui.GRichTextField;
    private itemCostTxt: fairygui.GRichTextField;
    private countTxt: fairygui.GRichTextField;
    private upBtn: fairygui.GButton;
    private hireBtn: fairygui.GButton;
    // private pgBar: UIProgressBar;
    // private itemCheckBox: fairygui.GButton;
    private itemList: List;
    private itemAmount: number;
    private itemCostId:number;
    private miner_id:number; //记录
    private moneyNum : number;
    private moneyCheckBox: fairygui.GButton;
    private c2: fairygui.Controller;
    private itemCost: number;
    private costGroup: fairygui.GGroup;
    private itemPrice: number;
    private hireInfo: any;
    private mcUpGrade: UIMovieClip;
    private leftCountTxt: fairygui.GRichTextField;
    private autoBuyBtn: fairygui.GButton;

    public constructor(){
        super(ModuleEnum.MiningHire, PackNameEnum.MiningHire);
    }

    public initOptUI(): void {
        this.c2 = this.getController('c2');
        this.costGroup = this.getGObject('g_cost').asGroup;
        this.moneyCostTxt = this.getGObject("txt_money_cost").asRichTextField;
        this.itemCostTxt = this.getGObject("txt_item_cost").asRichTextField;
        this.countTxt = this.getGObject("txt_count").asRichTextField;
        this.leftCountTxt = this.getGObject("txt_left_time").asRichTextField;
        this.upBtn = this.getGObject("btn_up").asButton;
        this.upBtn.addClickListener(this.onClickUp, this);
        this.hireBtn = this.getGObject("btn_hire").asButton;
        this.hireBtn.addClickListener(this.onClickHire, this);
        // this.itemCheckBox = this.getGObject("cb_item").asButton;
        // this.itemCheckBox.addClickListener(this.onItemSelect, this);
        this.moneyCheckBox = this.getGObject("cb_money").asButton;
        this.moneyCheckBox.addClickListener(this.onAutoMoneySelect, this);
        // this.pgBar = this.getGObject("progressBar") as UIProgressBar;
        // this.pgBar.setStyle(URLManager.getCommonIcon("progressBar_4"), URLManager.getCommonIcon("bg_4"), 530, 25, 2, 2);
        // this.pgBar.labelType = BarLabelType.Current_Total;
        // this.pgBar.labelSize = 20;
        this.itemList = new List(this.getGObject("list_item").asList);
        this.itemCostId = Number(ConfigManager.mining.getMiningStaticDataKey("refreshItem"));
        let shopData:any = ConfigManager.shopSell.getByPk(ShopType.SHOP_QUICK + "," + this.itemCostId);
        this.itemPrice = shopData ? shopData.price : 0;
        this.miner_id = 0;

        this.mcUpGrade = UIMovieManager.get(PackNameEnum.MCOneKey);
        this.upBtn.addChild(this.mcUpGrade);
        this.mcUpGrade.visible = this.mcUpGrade.playing = false;
        this.mcUpGrade.scaleX = this.mcUpGrade.scaleY = 1;
        this.mcUpGrade.x = -165;
        this.mcUpGrade.y = -225;

        this.autoBuyBtn = this.getGObject("btn_autoBuy").asButton;
        this.autoBuyBtn.addClickListener(this.onClickAutoBuy, this);

        GuideTargetManager.reg(GuideTargetName.MiningHireModuleUpBtn, this.upBtn);
        GuideTargetManager.reg(GuideTargetName.MiningHireModuleHireBtn, this.hireBtn);
    }

    private onClickHire() {
        //挖矿中拦截
        if (CacheManager.mining.getMiningLeftSecs() > 0) {
            Tip.showTip(LangMining.LANG54, Color.Red);
            return;
        }
        //矿层满拦截
        if (CacheManager.mining.getSceneWrokingMinerList().length >= ConfigManager.mining.getMiningStaticDataKey("floorMaxPos")) {
            // Tip.showTip(LangMining.LANG55, Color.Red);
            AlertII.show(LangMining.LANG61, null, (type:AlertType)=>{
                //走去下一层的传送阵
                if (type == AlertType.YES) {
                    CacheManager.mining.gotoNextFloor();
                    this.hide();
                }
            });
            return;
        }
        //采矿次数已用完
        if (CacheManager.mining.myMiningInfo.miningTimes_I >= ConfigManager.mining.getMiningStaticMiningCount(CacheManager.welfare2.isPrivilegeCard)) {
            Tip.showTip(LangMining.LANG57, Color.Red);
            return;
        }
        let minerId:number = 1;
        let itemIndex:number = 0;
        let item:MiningHireItem;
        let numItem:number = this.itemList.list.numChildren;
        while(itemIndex < numItem) {
            item = <MiningHireItem>this.itemList.list.getChildAt(itemIndex);
            if (item.getSelect()) {
                minerId = item.getData().id;
                break;
            }
            itemIndex++;
        }
        if (minerId < numItem) {
            AlertII.show(LangMining.LANG51, null, (type:AlertType)=>{
                if (type == AlertType.YES) {
                    // this.itemCheckBox.selected = false;
                    EventManager.dispatch(LocalEventEnum.ReqOperateMining, minerId);
                }
            });
            return;
        }
        // this.itemCheckBox.selected = false;
        EventManager.dispatch(LocalEventEnum.ReqOperateMining, minerId);
    }

    private onClickUp() {
        if (/*this.itemCheckBox.selected &&*/ this.moneyNum == 0) {
            EventManager.dispatch(LocalEventEnum.ReqUpgradeMining, 0);
        }
        else {
            if (!this.moneyCheckBox.selected && !this.isItemEnough()) {
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.itemCostId, "itemAmount": this.itemCost - this.itemAmount});
                return;
            }
            EventManager.dispatch(LocalEventEnum.ReqUpgradeMining, this.moneyCheckBox.selected ? 0 : 1);
        }
    }

    private onItemSelect() {

    }

    private onAutoMoneySelect() {
        if (this.c2.selectedIndex != 2) this.c2.selectedIndex = this.moneyCheckBox.selected ? 1 : 0;
    }

    public updateAll(data?: any): void {
        let minerList:any[] = ConfigManager.mining.getMinerDataList();
        this.itemList.data = minerList;
        //当前选中的矿工，祝福值等
        this.updateRefreshInfo();
    }

    public updateRefreshInfo():void {
        this.hireInfo = CacheManager.mining.myMiningHireInfo || {minerId_I:1,lucky_I:0,refreshCount_I:0};
        if(this.hireInfo.minerId_I != this.miner_id) {
            this.miner_id = this.hireInfo.minerId_I;
        }
        let myMiningInfo:any = CacheManager.mining.myMiningInfo;
        // this.itemList.selectedIndex = hireInfo.minerId_I - 1;
        let itemIndex:number = 0;
        while(itemIndex < this.itemList.list.numChildren) {
            this.itemList.list.getChildAt(itemIndex)["updateSelect"]();
            itemIndex++;
        }
        this.updateItemCost();

        let miningCount:number = ConfigManager.mining.getMiningStaticMiningCount(CacheManager.welfare2.isPrivilegeCard);
        let leftMiningCount:number = miningCount - myMiningInfo.miningTimes_I;
        let miningCountStr:string = (leftMiningCount>0?leftMiningCount:0) + '/' + miningCount;
        if (leftMiningCount<=0) miningCountStr = HtmlUtil.html(miningCountStr, Color.Red);
        else miningCountStr = HtmlUtil.html(miningCountStr, Color.Green2);
        this.countTxt.text = App.StringUtils.substitude(LangMining.LANG32, miningCountStr);
        this.leftCountTxt.text = App.StringUtils.substitude(LangMining.LANG33, miningCountStr);
        this.itemList.callItemsFunc("updateBtnFlag");
    }

    public updateItemCost():void {
        /*let minerData:any = ConfigManager.mining.getMinerData(this.miner_id);
        this.itemCost = minerData.improveCostProp || 0;
        this.itemAmount = CacheManager.pack.propCache.getItemCountByCode(this.itemCostId);
        this.itemCostTxt.text = HtmlUtil.html(this.itemAmount+'/' + this.itemCost, this.isItemEnough() ? '#0df14b' : '#df140f');
        this.updateMoneyCost();*/
        this.itemList.callItemsFunc("updateItemCost");
    }

    private updateMoneyCost():void {
        this.costGroup.visible = this.itemCost > 0;
        let isFree:boolean = this.hireInfo.refreshCount_I <= 0;
        if (isFree) this.c2.selectedIndex = 2;
        this.mcUpGrade.visible = this.mcUpGrade.playing = isFree;
        let moneyCost:number = isFree ? 0 : this.itemCost * this.itemPrice; //moneyCostData.length ? Number(moneyCostData[hireInfo.refreshCount_I]) : Number(moneyCostData[moneyCostData.length-1]);
        if (moneyCost > 0 && this.itemAmount > 0) {
            moneyCost -= this.itemAmount * this.itemPrice;
            if (moneyCost < 0) moneyCost = 0;
        }
        let moneyStr:string = HtmlUtil.html(CacheManager.role.getMoney(EPriceUnit.EPriceUnitGold) + '/' + moneyCost, MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold, moneyCost, false) ? '#0df14b' : '#df140f');
        this.moneyCostTxt.text = App.StringUtils.substitude(LangMining.LANG31, moneyStr);
        this.moneyNum = moneyCost;
    }

    private isItemEnough():boolean {
        return this.itemAmount >= this.itemCost;
    }

    public hide():void {
        super.hide();
        this.c2.selectedIndex = 0;
        this.moneyCheckBox.selected = false;
        this.mcUpGrade.visible = this.mcUpGrade.playing = false;
    }

    private onClickAutoBuy() {
        CacheManager.mining.autoBuy = this.autoBuyBtn.selected ? 1 : 0;
    }
}