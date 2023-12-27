class PrivilegePanel extends BaseTabView {
    private buyBtn:fairygui.GButton;
    private descTxt:fairygui.GRichTextField;
    private fightComp:FightPanel;
    private viewCtl: fairygui.Controller;
    private leftTimeTxt: fairygui.GTextField;
    private firstTxt: fairygui.GTextField;
    private titleMc:MovieClip;
    private contain: fairygui.GComponent;
    private leftDay:number;
    private mc:UIMovieClip;
    // private btnCtl:fairygui.Controller;

    public constructor(){
        super();
    }

    public initOptUI():void {
        this.viewCtl = this.getController("c1");
        this.buyBtn = this.getGObject("btn_buy").asButton;
        this.buyBtn.addClickListener(this.onClickBuy, this);
        // this.btnCtl = this.getController("c2");
        (this.descTxt = this.getGObject("txt_desc").asRichTextField).text = HtmlUtil.colorSubstitude(LangWelfare.LANG20);
        this.firstTxt = this.getGObject("txt_first").asTextField;
        this.fightComp = <FightPanel>this.getGObject("comp_fight");
        this.leftTimeTxt = this.getGObject("txt_lefttime").asTextField;
        this.contain = this.getGObject("contain_1").asCom;
    }

    public updateAll():void {
        let isPrevilegeCard:boolean = CacheManager.welfare2.isPrivilegeCard && !CacheManager.welfare2.isPrivilegeCardExp;
        //使用体验卡后界面相当于未激活处理
        this.isBuy = isPrevilegeCard;
        if (isPrevilegeCard) {
            let moreThan1Day:boolean = CacheManager.welfare2.privilegeCardLeftTime > 24 * 3600;
            this.count(moreThan1Day);
            /*if (!moreThan1Day) */this.timer(true);
            // let canGet:boolean = CacheManager.welfare2.privilegeRewardFlag;
            // if (canGet) {
            //     // this.buyBtn.text = LangWelfare.LANG2;
            //     this.btnCtl.selectedIndex = 1;
            // } else {
            //     // this.buyBtn.text = LangWelfare.LANG3;
            //     this.btnCtl.selectedIndex = 2;
            // }
            // App.DisplayUtils.grayButton(this.buyBtn, !canGet, !canGet);
            this.firstTxt.visible = false;
        } else {
            // this.buyBtn.text = LangWelfare.LANG1;
            // this.btnCtl.selectedIndex = 0;
            App.DisplayUtils.grayButton(this.buyBtn, false, false);
            this.firstTxt.visible = CacheManager.welfare2.privilegeCardEntDt <= 0;
        }
        this.fightComp.updateValue(3600 * 3);
        if (!this.titleMc) {
            this.titleMc = ObjectPool.pop("MovieClip");
            this.titleMc.x = 0;
            this.titleMc.y = 0;
            this.titleMc.setScale(1.7);
            this.contain.displayListContainer.addChild(this.titleMc);
        }
        if (!this.titleMc.isPlaying) this.titleMc.playFile(ResourcePathUtils.getRPGGame_Title() + "200001", -1, ELoaderPriority.UI_EFFECT);


        this.mc = UIMovieManager.get(PackNameEnum.MCRcgBtn2);
        this.buyBtn.addChild(this.mc);
        this.mc.visible = this.mc.playing = true;
        this.mc.scaleX = 0.92;
        this.mc.scaleY = 1;
        this.mc.x = -8; //this.btnReward.x - 174;
        this.mc.y = -9;//this.btnReward.y - 215;
    }

    public hide():void {
        this.timer(false);
        if (this.titleMc) {
            this.titleMc.destroy();
            this.titleMc = null;
        }
        if(this.mc) {
            this.mc.destroy();
            this.mc = null;
        }
        this.leftDay = -1;
        super.hide();
    }

    private onClickBuy() {       
        // if (CacheManager.welfare2.isPrivilegeCard) {
        //     EventManager.dispatch(LocalEventEnum.ReqPrivilegeReward);
        //     this.flyIco();
        //     return;
        // }
        let rechargeInfos:any[] = ConfigManager.mgRecharge.getByType(ERechargeType.RechargePrivilegeCard);
        if (rechargeInfos&&rechargeInfos.length) {
            let info:any = rechargeInfos[0];
            EventManager.dispatch(LocalEventEnum.RechargeReqSDK,info.money,info.productId);
        }
    }

    // private flyIco():void{
    //     if(CacheManager.welfare2.privilegeRewardFlag){
    //         let cfg:any = ConfigManager.monthCardReward.getByPk("2");
    //         let rewardItem:ItemData = RewardUtil.getReward(cfg.rewards);
    //         let gp:egret.Point = this.buyBtn.parent.localToGlobal(this.buyBtn.x,this.buyBtn.y);
    //         Tip.addTip({itemCode:rewardItem.getCode(),x:gp.x,y:gp.y},TipType.PropIcon);
    //     }
    // }

    private set isBuy(value:boolean) {
        if (value) {
            this.viewCtl.selectedIndex = 1;
        } else {
            if (CacheManager.welfare2.hasPrivilegeCard) {
                this.viewCtl.selectedIndex = 2;
            } else {
                this.viewCtl.selectedIndex = 0;
            }
        }
    }

    private timer(value: boolean) {
        if (value) {
            App.TimerManager.doTimer(1000, 0, this.count, this);
        } else {
            App.TimerManager.remove(this.count, this);
        }
    }

    private count(onlyShowDay:boolean = false) {
        let lefttime:number = CacheManager.welfare2.privilegeCardLeftTime;
        if (lefttime <= 0) {
            this.timer(false);
            this.updateAll();
            return;
        }
        if (this.leftDay > 1 && this.leftDay == App.DateUtils.getDay(CacheManager.welfare2.privilegeCardLeftTime)) {
            return;
        }
        this.leftDay = App.DateUtils.getDay(CacheManager.welfare2.privilegeCardLeftTime);
        let format:string = DateUtils.FORMAT_1;
        if (onlyShowDay && (typeof onlyShowDay) == "boolean") format = DateUtils.FORMAT_3;
        this.leftTimeTxt.text = App.StringUtils.substitude(LangWelfare.LANG10
            , App.DateUtils.getTimeStrBySeconds(lefttime, format));
    }
}