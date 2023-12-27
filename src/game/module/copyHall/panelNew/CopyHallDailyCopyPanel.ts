/**
 * 日常副本
 * @author zhh
 * @time 2018-05-28 17:17:26
 */
class CopyHallDailyCopyPanel extends BaseTabView {
    private c1: fairygui.Controller;
    private c2: fairygui.Controller;
    private c3: fairygui.Controller;

    private txtExp: fairygui.GRichTextField;
    private txtCopyTime: fairygui.GTextField;
    private ticketNumTxt: fairygui.GTextField;
    private btnExpcopy: fairygui.GButton;
    private btnSwordcopy: fairygui.GButton;
    private btnChallenge: fairygui.GButton;
    private groupInfo: fairygui.GGroup;
    private listExpchoose: List;
    private iconLoader: GLoader;

    //守护神剑UI
    private btnGo: fairygui.GButton;
    private txtDefTime: fairygui.GTextField;
    private listReward: List;
    private listRecord: List;

    private curCopyInf: any;
    private loaderBg: GLoader;
    public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index: number) {
        super();
    }

    public initOptUI(): void {
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");
        this.c3 = this.getController("c3");
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.txtExp = this.getGObject("txt_exp").asRichTextField;
        this.txtCopyTime = this.getGObject("txt_copyTime").asTextField;
        this.ticketNumTxt = this.getGObject("txt_num").asTextField;
        this.btnExpcopy = this.getGObject("btn_expCopy").asButton;
        this.btnSwordcopy = this.getGObject("btn_swordCopy").asButton;
        this.btnChallenge = this.getGObject("btn_challenge").asButton;
        this.groupInfo = this.getGObject("group_info").asGroup;
        this.listExpchoose = new List(this.getGObject("list_ExpChoose").asList);
        this.iconLoader = <GLoader>this.getGObject("loader_icon");
        let itemCfg: any = CacheManager.copy.getExpCopyAddItemInfo();
        this.iconLoader.load(URLManager.getIconUrl(itemCfg.icon, URLManager.ITEM_ICON))

        //守护神剑
        this.btnGo = this.getGObject("btn_go").asButton;
        this.txtDefTime = this.getGObject("txt_def_time").asTextField;
        this.listReward = new List(this.getGObject("list_reward").asList);
        this.listRecord = new List(this.getGObject("list_record").asList);

        this.btnExpcopy.addClickListener(this.onGUIBtnClick, this);
        this.btnSwordcopy.addClickListener(this.onGUIBtnClick, this);
        this.btnChallenge.addClickListener(this.onGUIBtnClick, this);
        this.iconLoader.addClickListener(this.onGUIBtnClick, this);
        this.btnGo.addClickListener(this.onGUIBtnClick, this);
        this.listExpchoose.list.addEventListener(fairygui.ItemEvent.CLICK, this.onGUIListSelect, this);
        this.c1.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onC1Change, this)
        //---- script make end ----


    }

    public updateAll(data?: any): void {
        let flag: boolean = ConfigManager.mgOpen.isTypeOpen(PanelTabType[PanelTabType.CopyDefend], EOpenCondType.EOpenCondTypeServerOpenDays);
        let idx: number = flag ? 0 : 1;
        this.c2.setSelectedIndex(idx);
        if (data) {
            if (data.copyType) {
                if (data.copyType == 2 && idx == 0) {
                    this.c1.setSelectedIndex(1);
                }
            }
        }
        switch (this.c1.selectedIndex) {
            case 0: //经验副本
                this.updateExpCopyView();
                break;
            case 1:
                this.updateDefendCopy();
                break;
        }
        this.checkBtnTips();
        this.loadBG();
    }

    private checkBtnTips(): void {
        CommonUtils.setBtnTips(this.btnExpcopy, CacheManager.copy.checkExpCopyTips());
        CommonUtils.setBtnTips(this.btnSwordcopy, CacheManager.copy.checkDefendTips());
    }

    private updateDefendCopy(): void {
        this.curCopyInf = ConfigManager.copy.getRoleDefendCopy();
        let rewards: any[] = [];
        if (this.curCopyInf.reward) {
            rewards = CommonUtils.configStrToArr(this.curCopyInf.reward, true);
        }
        this.listReward.setVirtual(rewards);
        let n: number = CacheManager.copy.getEnterLeftNum(CopyUtils.getRecordCode(this.curCopyInf));
        this.txtDefTime.text = App.StringUtils.substitude(LangCopyHall.L8, n);
        this.btnGo.text = CacheManager.copy.isDefendDlg() ? LangCopyHall.L21 : LangCopyHall.L37;
        this.listRecord.data = CacheManager.chat.dfCopyLog;
    }

    private updateExpCopyView(): void {
        this.curCopyInf = ConfigManager.copy.getCopysByType(ECopyType.ECopyMgNewExperience)[0];
        let str: string = HtmlUtil.colorSubstitude(LangCopyHall.L40, App.MathUtils.formatNum2(ConfigManager.expCopy.getCopyExp()));
        let lvExp: number = ConfigManager.expCopy.getCopyLevelExp();
        if (lvExp) {
            str += HtmlUtil.brText + HtmlUtil.colorSubstitude(LangCopyHall.L41, App.MathUtils.formatNum2(lvExp));
        }
        this.txtExp.text = str;
        let data: any[] = CopyUtils.getNewExpCopyExpRewardList();
        let isHas: boolean = data.length > 0;
        this.listExpchoose.list.visible = isHas;
        this.groupInfo.visible = !isHas;
        //this.imgBackdrop.visible = !isHas;
        if (isHas) {
            this.listExpchoose.setVirtual(data);
        }
        let leftNum: number = CacheManager.copy.getEnterLeftNum(this.curCopyInf);
        let flag: boolean = leftNum > 0;
        if (flag) {
            this.txtCopyTime.text = App.StringUtils.substitude(LangCopyHall.L8, leftNum);
        } else {
            let minLv: number = ConfigManager.vip.getAddCopyNumMiniVipLv(EVipAddType.EVipAddNewExperienceCopyNum);
            let info: any = ConfigManager.vip.getVipAddDict(EVipAddType.EVipAddNewExperienceCopyNum);
            if (CacheManager.vip.checkVipLevel(minLv)) {
                let nextAddInfo: any = ConfigManager.vip.getCopyNextAddInfo(EVipAddType.EVipAddNewExperienceCopyNum);
                let maxAddLv: number = ConfigManager.vip.getCopyAddNumMaxVipLv(EVipAddType.EVipAddNewExperienceCopyNum);
                if (!info[nextAddInfo.nextLv] || CacheManager.vip.vipLevel == maxAddLv) {
                    this.txtCopyTime.text = LangCopyHall.L26;
                } else {
                    this.txtCopyTime.text = App.StringUtils.substitude(LangCopyHall.L9, nextAddInfo.nextLv, nextAddInfo.addNum);
                }
            } else {
                this.txtCopyTime.text = App.StringUtils.substitude(LangCopyHall.L9, minLv, info[minLv]);
            }

        }
        this.updateTicketItem();
    }

    public updateTicketItem(): void {
        let itemInfo: any = CacheManager.copy.getExpCopyAddItemInfo();
        let itemNum: number = CacheManager.pack.propCache.getItemCountByCode2(itemInfo.code);
        this.ticketNumTxt.text = itemNum.toString();
        let idx: number = itemNum > 0 ? 0 : 1;
        this.c3.setSelectedIndex(0);//永远显示
        let leftNum: number = CacheManager.copy.getEnterLeftNum(this.curCopyInf);
        let isCanChallenge: boolean = leftNum > 0 || itemNum > 0;
        App.DisplayUtils.grayButton(this.btnChallenge,!isCanChallenge,!isCanChallenge);
    }

    private loadBG(): void {
        let bgUrl: string = URLManager.getModuleImgUrl(`daily_copy_bg${this.c1.selectedIndex}.jpg`, PackNameEnum.CopyHall);
        this.loaderBg.load(bgUrl);
    }

    private onC1Change(e: fairygui.StateChangeEvent): void {
        this.updateAll();
    }

    protected onGUIBtnClick(e: egret.TouchEvent): void {
        var btn: any = e.target;
        switch (btn) {
            case this.btnExpcopy:
                break;
            case this.btnSwordcopy:
                break;
            case this.btnGo:
                if (ItemsUtil.checkSmeltTips()) {
                    return;
                }
                if (CacheManager.copy.isDefendDlg()) {
                    //扫荡
                    EventManager.dispatch(LocalEventEnum.CopyDefendDlg);

                } else if (this.curCopyInf) {
                    if (ConfigManager.mgOpen.isTypeOpen(PanelTabType[PanelTabType.CopyDefend], EOpenCondType.EOpenCondTypeRoleState)) {
                        EventManager.dispatch(LocalEventEnum.CopyReqEnter, this.curCopyInf.code);
                    } else {
                        let val: number = ConfigManager.mgOpen.getOpenTypeValue(PanelTabType[PanelTabType.CopyDefend], EOpenCondType.EOpenCondTypeRoleState);
                        Tip.showLeftTip(`${val}转可挑战`);
                    }
                }
                break;
            case this.btnChallenge:
                //挑战
                if (this.curCopyInf) {
                    // EventManager.dispatch(LocalEventEnum.CopyReqEnter,this.curCopyInf.code);
                    let leftNum: number = CacheManager.copy.getEnterLeftNum(this.curCopyInf);
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
                                    EventManager.dispatch(LocalEventEnum.CopyReqEnter, this.curCopyInf.code);
                                }
                            }, this);
                        } else {
                            Tip.showLeftTip("副本可挑战次数不足");
                        }
                    } else {
                        EventManager.dispatch(LocalEventEnum.CopyReqEnter, this.curCopyInf.code);
                    }
                }
                break;
            case this.iconLoader:
                let itemInfo: any = CacheManager.copy.getExpCopyAddItemInfo();
                ToolTipManager.showByCode(itemInfo.code);
				break;

        }
    }
    protected onGUIListSelect(e: fairygui.ItemEvent): void {
        var item: ListRenderer = <ListRenderer>e.itemObject;
        if (item) {

        }
        var list: any = e.target;
        switch (list) {
            case this.listExpchoose.list:
                break;
        }

    }

    public hide(): void {
        super.hide();
        this.c1.setSelectedIndex(0);
    }


}