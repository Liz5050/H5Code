/**
 * 日常副本Item
 * @author zhh
 * @time 2019-03-14 10:16:07
 */
class DailyCopyItem extends ListRenderer {
    private c1:fairygui.Controller;
    private baseItem0:BaseItem;
    private baseItem1:BaseItem;
    private loaderBg:GLoader;
    private loaderIco:GLoader;
    private txtCnt0:fairygui.GTextField;
    private txtCnt1:fairygui.GTextField;
    private txtCopyCount:fairygui.GRichTextField;
    private txtItemCount:fairygui.GRichTextField;
    private btnStart:fairygui.GButton;
    private listReward:List;
    private _isHasExpReward:boolean = false;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.baseItem0 = <BaseItem>this.getChild("baseItem0");
        this.baseItem1 = <BaseItem>this.getChild("baseItem1");
        this.loaderBg = <GLoader>this.getChild("loader_bg");
        this.loaderIco = <GLoader>this.getChild("loader_ico");
        this.txtCnt0 = this.getChild("txt_cnt0").asTextField;
        this.txtCnt1 = this.getChild("txt_cnt1").asTextField;
        this.txtCopyCount = this.getChild("txt_copyCount").asRichTextField;
        this.txtItemCount = this.getChild("txt_itemCount").asRichTextField;
        this.btnStart = this.getChild("btn_start").asButton;
        this.listReward = new List(this.getChild("list_reward").asList);

        this.btnStart.addClickListener(this.onGUIBtnClick, this);
        this.loaderIco.addClickListener(this.onGUIBtnClick, this);
        this.listReward.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----
        this.baseItem0.isShowName = false;
        this.baseItem1.isShowName = false;
        this.baseItem0.itemData = new ItemData(ItemCodeConst.Exp);        
        this.baseItem1.itemData = new ItemData(ItemCodeConst.LevelExp);
	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        if(this._data==CopyItem.NONE_DATA){
            this.setNoneStatus();
            return;
        }
        this._isHasExpReward = false;
        this.loaderBg.load(URLManager.getModuleImgUrl(`copy_daily_${this._data.copyType}.jpg`,PackNameEnum.CopyHall));
        if(this._data.copyType==ECopyType.ECopyMgNewExperience){
            this.updateExpCopyView();
            this.c1.setSelectedIndex(0);
        }else if(this._data.copyType==ECopyType.ECopyMgNormalDefense){
            this.updateDefendCopy();
            this.c1.setSelectedIndex(1);
        }
	}
    private hideExpRewardItem():void{
        this.baseItem0.visible = this.baseItem1.visible = false;
        this.txtCnt0.visible = this.txtCnt1.visible = false;
    }
    private setNoneStatus():void{
        this.loaderBg.load(URLManager.getModuleImgUrl(`copy_daily_none.jpg`,PackNameEnum.CopyHall));
        this.btnStart.text = LangCopyHall.L51;
        App.DisplayUtils.grayButton(this.btnStart,true,true);
        this.hideExpRewardItem();
        this.listReward.setVirtual([null,null,null,null,null]);
        for(let i:number = 0;i<this.listReward.list._children.length;i++){
            let baseItem:BaseItem = <BaseItem>this.listReward.list._children[i];
            if(baseItem){
                baseItem.icoUrl = URLManager.getModuleImgUrl("copy_none_ico.png",PackNameEnum.CopyHall);
            }
        }
        this.c1.setSelectedIndex(2);
    }

    private updateDefendCopy(): void {
        this.hideExpRewardItem();
        let rewards: any[] = [];
        if (this._data.reward) {
            rewards = CommonUtils.configStrToArr(this._data.reward, true);
        }
        this.listReward.renderProps = {isShowName:false};
        this.listReward.setVirtual(rewards);
        let n: number = CacheManager.copy.getEnterLeftNum(CopyUtils.getRecordCode(this._data));
        let isCanChallenge:boolean = n>0;
        let clr:any = isCanChallenge?Color.Color_6:Color.Color_4;
        this.txtCopyCount.text = App.StringUtils.substitude(LangCopyHall.L8, HtmlUtil.html(""+n,clr));
        this.btnStart.text = CacheManager.copy.isDefendDlg() ? LangCopyHall.L21 : LangCopyHall.L49;
        App.DisplayUtils.grayButton(this.btnStart,!isCanChallenge,!isCanChallenge);
    }

    private updateExpCopyView(): void {
        let itemCfg: any = CacheManager.copy.getExpCopyAddItemInfo();
        this.loaderIco.load(URLManager.getIconUrl(itemCfg.icon, URLManager.ITEM_ICON));
        this.txtCnt0.visible = true;
        this.baseItem0.visible = true;
        let xStr:string = " x ";
        this.txtCnt0.text = xStr+App.MathUtils.formatNum2(ConfigManager.expCopy.getCopyExp());
        let lvExp: number = ConfigManager.expCopy.getCopyLevelExp();
        if (lvExp) {
            this.txtCnt1.text = xStr+App.MathUtils.formatNum2(lvExp); 
            this.txtCnt1.visible = true;
            this.baseItem1.visible = true;
        }else{
            this.txtCnt1.visible = false;
            this.baseItem1.visible = false;
        }

        let data: any[] = CopyUtils.getNewExpCopyExpRewardList();
        let isHas: boolean = data.length > 0;
        this._isHasExpReward = isHas;
        if(!isHas){
            this.btnStart.text = LangCopyHall.L49;
        }else{
            this.btnStart.text = LangCopyHall.L50;
        }
        let leftNum: number = CacheManager.copy.getEnterLeftNum(this._data);
        let flag: boolean = leftNum > 0;
        if (flag) {
            this.txtCopyCount.text = App.StringUtils.substitude(LangCopyHall.L8, HtmlUtil.html(""+leftNum,Color.Color_6));
        } else {
            let minLv: number = ConfigManager.vip.getAddCopyNumMiniVipLv(EVipAddType.EVipAddNewExperienceCopyNum);
            let info: any = ConfigManager.vip.getVipAddDict(EVipAddType.EVipAddNewExperienceCopyNum);
            if (CacheManager.vip.checkVipLevel(minLv)) {
                let nextAddInfo: any = ConfigManager.vip.getCopyNextAddInfo(EVipAddType.EVipAddNewExperienceCopyNum);
                let maxAddLv: number = ConfigManager.vip.getCopyAddNumMaxVipLv(EVipAddType.EVipAddNewExperienceCopyNum);
                if (!info[nextAddInfo.nextLv] || CacheManager.vip.vipLevel == maxAddLv) {
                    this.txtCopyCount.text = this.txtCopyCount.text = App.StringUtils.substitude(LangCopyHall.L8, HtmlUtil.html("0",Color.Color_4));
                } else {
                    this.txtCopyCount.text = App.StringUtils.substitude(LangCopyHall.L9, nextAddInfo.nextLv, nextAddInfo.addNum);
                }
            } else {
                this.txtCopyCount.text = App.StringUtils.substitude(LangCopyHall.L9, minLv, info[minLv]);
            }

        }
        this.updateTicketItem();
    }

    public updateTicketItem(): void {
        let itemInfo: any = CacheManager.copy.getExpCopyAddItemInfo();
        let itemNum: number = CacheManager.pack.propCache.getItemCountByCode2(itemInfo.code);
        let clr:any = itemNum>0?Color.Color_6:Color.Color_4;
        this.txtItemCount.text = HtmlUtil.html(`(${itemNum.toString()})`,clr);
        /*
        let idx: number = itemNum > 0 ? 0 : 1;
        let leftNum: number = CacheManager.copy.getEnterLeftNum(this._data);
        let isCanChallenge: boolean = leftNum > 0 || itemNum > 0;
        */
        //App.DisplayUtils.grayButton(this.btnStart,!isCanChallenge,!isCanChallenge);
    }
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnStart:
                if(this._data.copyType==ECopyType.ECopyMgNewExperience){
                    this.dealExpCopyStart();
                }else if(this._data.copyType==ECopyType.ECopyMgNormalDefense){
                    this.dealDFCopyStart();
                }
                break;
            case this.loaderIco:
                let itemCfg: any = CacheManager.copy.getExpCopyAddItemInfo();
                ToolTipManager.showByCode(itemCfg.code);
                break;

        }
    }

    private dealDFCopyStart():void{
        if (ItemsUtil.checkSmeltTips()) {
            return;
        }
        if (CacheManager.copy.isDefendDlg()) {
            //扫荡
            EventManager.dispatch(LocalEventEnum.CopyDefendDlg);

        } else if (this._data) {
            if (ConfigManager.mgOpen.isTypeOpen(PanelTabType[PanelTabType.CopyDefend], EOpenCondType.EOpenCondTypeRoleState)) {
                EventManager.dispatch(LocalEventEnum.CopyReqEnter, this._data.code);
            } else {
                let val: number = ConfigManager.mgOpen.getOpenTypeValue(PanelTabType[PanelTabType.CopyDefend], EOpenCondType.EOpenCondTypeRoleState);
                Tip.showLeftTip(`${val}转可挑战`);
            }
        }
    }

    private dealExpCopyStart():void{
        //挑战
        if(this._isHasExpReward){
            EventManager.dispatch(LocalEventEnum.copyShowExpReward);
            return;
        }
        let leftNum: number = CacheManager.copy.getEnterLeftNum(this._data);
        if (leftNum <= 0) {
            let itemInfo: any = CacheManager.copy.getExpCopyAddItemInfo();
            let itemNum: number = CacheManager.pack.propCache.getItemCountByCode2(itemInfo.code);
            if (itemNum > 0) {
                let tips: string = "是否消耗一个" + HtmlUtil.html(itemInfo.name, "#01ab24") + "增加一次副本挑战次数？";
                Alert.alert(tips, () => {
                    let itemData: ItemData = CacheManager.pack.propCache.getItemByCode(itemInfo.code);
                    if (itemData) {
                        EventManager.dispatch(LocalEventEnum.PackUseByCode, itemData, 1);
                        // EventManager.dispatch(LocalEventEnum.PackUse, itemData);
                        // ProxyManager.pack.useItem(itemData.getUid(), 1, []);
                        EventManager.dispatch(LocalEventEnum.CopyReqEnter, this._data.code);
                    }
                }, this);
            } else {
                HomeUtil.open(ModuleEnum.PropGet,false,{itemCode:itemInfo.code});
            }
        } else {
            EventManager.dispatch(LocalEventEnum.CopyReqEnter, this._data.code);
        }
    }

    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:ListRenderer = <ListRenderer>e.itemObject;
        if(item){
            
        }

        var list: any = e.target;
        switch (list) {
            case this.listReward.list:
                break;

        }
               
    }


}