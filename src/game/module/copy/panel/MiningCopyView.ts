class MiningCopyView extends BaseCopyPanel {
    private nameTxt: fairygui.GTextField;
    private minerTxt: fairygui.GTextField;
    private miningTimeTxt: fairygui.GTextField;
    private fastBtn: fairygui.GButton;

    private leftSecs:number;
    private miningGroup: fairygui.GGroup;
    private mineIcon: fairygui.GButton;
    private robIcon: fairygui.GButton;
    private switchBtn: fairygui.GButton;
    private floorList: List;
    private c1: fairygui.Controller;
    private listBg: fairygui.GImage;

    public constructor(copyInfo:any) {
        super(copyInfo,"MiningCopyView");
        this.isCenter = true;
    }

    public initOptUI():void {
        super.initOptUI();
        this.nameTxt = this.getGObject("txt_name").asTextField;
        this.minerTxt = this.getGObject("txt_miner").asTextField;
        this.miningTimeTxt = this.getGObject("txt_miningTime").asTextField;
        this.fastBtn = this.getGObject("btn_fast").asButton;
        this.fastBtn.addClickListener(this.onClickFast, this);
        this.mineIcon = this.getGObject("icon_mine").asButton;
        this.mineIcon.addClickListener(this.onClickMine, this);
        this.robIcon = this.getGObject("icon_rob").asButton;
        this.robIcon.addClickListener(this.onClickRob, this);
        this.miningGroup = this.getGObject("group_mining").asGroup;
        this.switchBtn = this.getGObject("btn_switch").asButton;
        this.switchBtn.addClickListener(this.onClickSwitch, this);
        this.floorList = new List(this.getGObject("list_item").asList);
        this.c1 = this.getController('c1');
        this.listBg = this.getGObject("bg_list").asImage;
        this.XPSetBtn.visible = true;

        GuideTargetManager.reg(GuideTargetName.MiningCopyViewMineBtn, this.mineIcon);
        GuideTargetManager.reg(GuideTargetName.MiningCopyViewExitBtn, this.btn_exit);
    }

    /**模块显示时开启的监听 */
    protected addListenerOnShow(): void {
        this.addListen1(LocalEventEnum.UpdateMyMiningInfo, this.updateMyInfo, this);
        this.addListen1(LocalEventEnum.UpdateMiningInfo, this.updateSceneInfo, this);
        this.addListen1(LocalEventEnum.UpdatePlayerMiningInfo, this.updateSceneInfo, this);
        this.addListen1(LocalEventEnum.UpdateMyMiningCountdown, this.updateLeftTxt, this);
        this.addListen1(LocalEventEnum.UpdateMyRecordTips, this.updateMyRecordTips, this);
        this.addListen1(LocalEventEnum.UpdateMiningMaxFloor, this.updateFloorList, this);
    }

    public onShow(): void {
        super.onShow();
    }

    public onHide():void {
        this.c1.selectedIndex = 0;
        this.onClickSwitch();
        super.onHide();
    }

    public updateAll(): void {
        if (this.isShow) {
            this.XPSetBtn.selected = !CacheManager.sysSet.specialCopyAutoXP;
            this.updateMyInfo();
            this.updateSceneInfo();
            this.updateMyRecordTips();
            this.c1.selectedIndex = 0;
        }
    }

    private updateMyInfo() {
        this.leftSecs = CacheManager.mining.getMiningLeftSecs();
        this.miningGroup.visible = this.leftSecs > 0;
        this.updateLeftTxt();
    }

    private updateSceneInfo() {
        this.nameTxt.text = App.StringUtils.substitude(LangMining.LANG13, CacheManager.mining.curFloor);
        let workingList:any[] = CacheManager.mining.getSceneWrokingMinerList();
        this.minerTxt.text = App.StringUtils.substitude(LangMining.LANG14, workingList.length);
    }

    private updateMyRecordTips() {
        CommonUtils.setBtnTips(this.robIcon, CacheManager.mining.isRobbedRedTips);
    }

    private onClickRob() {
        EventManager.dispatch(UIEventEnum.OpenMiningRecord);
    }

    private onClickMine() {
        HomeUtil.open(ModuleEnum.MiningHire);
    }

    private onClickFast() {
        let leftSecs:number = CacheManager.mining.getMiningLeftSecs();
        if (leftSecs > 0) {
            let leftMin:number = leftSecs % 60 != 0 ? Math.floor(leftSecs / 60) + 1 : Math.floor(leftSecs / 60);
            // let totalMin:number = ConfigManager.mining.getMiningStaticDataMiningTime(CacheManager.welfare2.isPrivilegeCard);//总时长
            let fastPetMinCost:number = ConfigManager.mining.getMiningStaticDataKey("descTimeCost");//加速每分钟花费
            let cost:number = leftMin * fastPetMinCost;
            if (cost > 0) {
                AlertII.show(App.StringUtils.substitude(LangMining.LANG12, cost), null, (type:AlertType)=>{
                    if (type == AlertType.YES && MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold, cost)) {
                        EventManager.dispatch(LocalEventEnum.ReqFastMining);
                    }
                });
            }
        }
    }

    private updateLeftTxt() {
        this.leftSecs = CacheManager.mining.myLeftSecs;
        let timeStr:string;
        if (this.leftSecs > 0) {
            timeStr = App.DateUtils.getTimeStrBySeconds(this.leftSecs, DateUtils.FORMAT_6, false);
            this.miningTimeTxt.text = App.StringUtils.substitude(LangMining.LANG11, timeStr);
        } else {
            this.miningTimeTxt.text = LangMining.LANG16;
        }
    }

    protected exitCopy(): void {
        let mainPlayer:MainPlayer = CacheManager.king.leaderEntity;
        if(mainPlayer && mainPlayer.currentState == EntityModelStatus.ScaleTween) return;
        CacheManager.copy.isActiveLeft = true;
        CacheManager.task.gotoTaskFlag = false;
        EventManager.dispatch(LocalEventEnum.CopyReqExit);
    }

    private onClickSwitch() {
        this.updateFloorList();
    }

    private updateFloorList() {
        let isSelect:boolean = this.switchBtn.selected;
        if (isSelect) {
            let floorListExpCur = CacheManager.mining.getFloorListExceptCur();
            this.floorList.data = floorListExpCur;
            this.listBg.height = 73 + (floorListExpCur.length > 5 ? 5 * 73 : floorListExpCur.length * 73);
        } else {
            this.listBg.height = 73;
        }
    }
}