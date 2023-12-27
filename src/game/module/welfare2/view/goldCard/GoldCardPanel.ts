class GoldCardPanel extends BaseTabView {
    private viewCtl:fairygui.Controller;
    private buyBtn:fairygui.GButton;
    private leftTimeTxt: fairygui.GTextField;
    private mc:UIMovieClip;

    public constructor(){
        super();
    }

    public initOptUI():void {
        this.viewCtl = this.getController("c1");
        this.buyBtn = this.getGObject("btn_buy").asButton;
        this.buyBtn.addClickListener(this.onClickBuy, this);
        this.leftTimeTxt = this.getGObject("txt_lefttime").asTextField;
        (this.getGObject("txt_desc").asRichTextField).text = HtmlUtil.colorSubstitude(LangWelfare.LANG21);
    }

    private onClickBuy():void {
        let rechargeInfos:any[] = ConfigManager.mgRecharge.getByType(ERechargeType.RechargeGoldCard);
        if (rechargeInfos&&rechargeInfos.length) {
            let info:any = rechargeInfos[0];
            EventManager.dispatch(LocalEventEnum.RechargeReqSDK,info.money, info.productId);
        }
    }

    public updateAll():void {
        let isGoldCard:boolean = CacheManager.welfare2.isGoldCard;
        this.isBuy = isGoldCard;
        if (isGoldCard) {
            let moreThan1Day:boolean = CacheManager.welfare2.goldCardLeftTime > 24 * 3600;
            this.count(moreThan1Day);
            if (!moreThan1Day) this.timer(true);
        }
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
        if(this.mc) {
            this.mc.destroy();
            this.mc = null;
        }

        super.hide();
    }

    private set isBuy(value:boolean) {
        if (value) {
            this.viewCtl.selectedIndex = 1;
        } else {
            if (CacheManager.welfare2.hasGoldCard) {
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
        let lefttime:number = CacheManager.welfare2.goldCardLeftTime;
        if (lefttime <= 0) {
            this.timer(false);
            this.updateAll();
            return;
        }
        let format:string = DateUtils.FORMAT_1;
        if (onlyShowDay && (typeof onlyShowDay) == "boolean") format = DateUtils.FORMAT_3;
        this.leftTimeTxt.text = App.StringUtils.substitude(LangWelfare.LANG10
            , App.DateUtils.getTimeStrBySeconds(lefttime, format));
    }
}