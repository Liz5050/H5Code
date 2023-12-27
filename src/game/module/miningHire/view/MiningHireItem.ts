class MiningHireItem extends ListRenderer {
    private manItem: MiningManItem;
    private itemList: List;
    private c1: fairygui.Controller;
    private c2: fairygui.Controller;//0.非最高级1.最高级
    private tipGroup: fairygui.GGroup;
    private c3: fairygui.Controller;
    private c4: fairygui.Controller;
    private hireBtn: fairygui.GButton;
    private itemCostTxt: fairygui.GRichTextField;
    private isItemEnough:boolean;
    private itemAmount: number;
    private itemCost: number;
    private mcClick: UIMovieClip;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);

        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");
        this.c3 = this.getController("c3");
        this.c4 = this.getController("c4");
        this.manItem = this.getChild("comp_man") as MiningManItem;
        this.itemList = new List(this.getChild("list_item").asList);
        this.tipGroup = this.getChild("group_tip").asGroup;
        this.hireBtn = this.getChild('btn_hire').asButton;
        this.hireBtn.addClickListener(this.onClickHire, this);
        this.itemCostTxt = this.getChild('txt_item_cost').asRichTextField;
    }

    /**
     *
     * @param data:SEncounterPlayer
     */
    public setData(data: any, index: number): void {
        this._data = data;
        this.manItem.update(data.id);
        this.c3.selectedIndex = data.id;
        this.updateSelect();
        if (data.id == 4) this.c2.selectedIndex = 1;

        let list:ItemData[] = ConfigManager.mining.getMinerReward(data.id, CacheManager.serverTime.serverOpenDay);
        this.tipGroup.x = 190 + (list.length - 1) * 99;
        this.itemList.data = list;

        //注册指引
        if (data.id == 4){
            GuideTargetManager.reg(GuideTargetName.MiningHireModuleMiningHireItem, this.hireBtn);
        }
    }

    public updateBtnFlag() {
        if (this.c2.selectedIndex == 1) {
            let isFree:boolean = CacheManager.mining.myMiningHireInfo ? CacheManager.mining.myMiningHireInfo.refreshCount_I <= 0 : false;
            if (isFree) {
                this.c4.selectedIndex = 1;
            } else {
                this.c4.selectedIndex = 0;
            }
            if(!this.mcClick) {
                this.mcClick = UIMovieManager.get(PackNameEnum.MCCommonButton);
                this.mcClick.x = -161 + 107 + 34 + 18;
                this.mcClick.y = -225 + 141 + 44 + 23;
                this.hireBtn.addChild(this.mcClick);
            }
            this.mcClick.setPlaySettings(0,-1,0,-1);
        } else {
            if (this.mcClick) {
                this.mcClick.destroy();
                this.mcClick = null;
            }
            this.c4.selectedIndex = this.itemCost > 0 ? 0 : 2;
        }
    }

    public recycleChild(): void {
        if (this.mcClick) {
            this.mcClick.destroy();
            this.mcClick = null;
        }
    }

    public updateItemCost():void {
        this.itemCost = this._data.costProp || 0;
        this.itemAmount = CacheManager.mining.costItemAmount;
        this.isItemEnough = this.itemAmount >= this.itemCost;
        this.itemCostTxt.text = HtmlUtil.html(this.itemAmount+'/' + this.itemCost, this.isItemEnough ? '#0df14b' : '#df140f');
    }

    public updateSelect():void {//去掉选中
        // this.c1.selectedIndex = this._data.id == CacheManager.mining.myMiningHireInfo.minerId_I ?  1 : 0;
    }

    public getSelect():boolean {
        return this.c1.selectedIndex == 1;
    }

    private onClickHire() {
        let isFree:boolean = CacheManager.mining.myMiningHireInfo ? CacheManager.mining.myMiningHireInfo.refreshCount_I <= 0 : false;
        if (!isFree && !this.isItemEnough && CacheManager.mining.autoBuy != 1) {
            EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": MiningCache.ITEM_COST_ID, "itemAmount": this.itemCost - this.itemAmount});
            return;
        }
        this.doHire();
    }

    private doHire() {
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
                    EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.MiningHire);
                }
            });
            return;
        }
        //采矿次数已用完
        if (CacheManager.mining.myMiningInfo.miningTimes_I >= ConfigManager.mining.getMiningStaticMiningCount(CacheManager.welfare2.isPrivilegeCard)) {
            Tip.showTip(LangMining.LANG57, Color.Red);
            return;
        }
        let minerId:number = this._data.id;
        let maxNum:number = ConfigManager.mining.getMinerDataListLength();
        if (minerId < maxNum) {
            AlertII.show(LangMining.LANG51, null, (type:AlertType)=>{
                if (type == AlertType.YES) {
                    EventManager.dispatch(LocalEventEnum.ReqOperateMining, minerId, CacheManager.mining.autoBuy);
                }
            });
            return;
        }
        EventManager.dispatch(LocalEventEnum.ReqOperateMining, minerId, CacheManager.mining.autoBuy);
    }
}