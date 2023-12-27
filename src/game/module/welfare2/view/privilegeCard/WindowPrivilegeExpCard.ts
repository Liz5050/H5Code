class WindowPrivilegeExpCard extends BaseWindow
{
    private optBtn : fairygui.GButton;
	private itemdata : any;
	private c1 : fairygui.Controller;
	private c2 : fairygui.Controller;
	private close_btn : fairygui.GButton;
	private mc : UIMovieClip;
	private txt_timeLeft: fairygui.GRichTextField;

	public constructor()
	{
		super(PackNameEnum.PrivilegeExpCard, "Main"); //null,LayerManager.UI_Tips
	}

	public initOptUI(): void
	{
		this.optBtn = this.getGObject("btn_opt").asButton;
		this.optBtn.addClickListener(this.onOptBtnClickHandler, this);
		this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");
		this.txt_timeLeft = this.getGObject("left_time").asRichTextField;
		this.close_btn = this.getGObject("close_btn").asButton;
		this.close_btn.addClickListener(this.hide,this);
		this.mc = UIMovieManager.get(PackNameEnum.MCRcgBtn2);
        this.optBtn.addChild(this.mc);
        this.mc.visible = this.mc.playing = true;
        this.mc.scaleX = 0.9;
        this.mc.scaleY = 1;
        this.mc.x = -4; //this.btnReward.x - 174;
        this.mc.y = -9;//this.btnReward.y - 215;

	}

	public updateAll(data : any) : void {
		this.itemdata = CacheManager.pack.propCache.getMonthExpCard(2);
		if(!this.itemdata) {
			this.c1.setSelectedIndex(1);
		}
		else {
			this.c1.setSelectedIndex(0);
		}

		if(CacheManager.welfare2.isPrivilegeCard) {
			this.c2.setSelectedIndex(1);
			this.timer(true);
			this.count(false);
		}
		else {
			this.c2.setSelectedIndex(0);
			this.timer(false);
		}
	}

	public onOptBtnClickHandler(): void {
		this.hide();
		if(this.itemdata) {
			EventManager.dispatch(LocalEventEnum.PackUse, this.itemdata);
		}
		else {
			this.onClickBuy();
			//HomeUtil.open(ModuleEnum.Welfare2, false,  { "tabType": PanelTabType.PrivilegeCard});
		}
		//EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.TimeLimitTask);
	}

	 private count(onlyShowDay:boolean = false) {
        let lefttime:number = CacheManager.welfare2.privilegeCardLeftTime;
        if (lefttime <= 0) {
            this.timer(false);
            this.c2.setSelectedIndex(0);
            //this.timer(false);
            //this.updateAll();
            return;
        }
        //this.leftDay = App.DateUtils.getDay(CacheManager.welfare2.privilegeCardLeftTime);
        let format:string = DateUtils.FORMAT_1;
        if (onlyShowDay && (typeof onlyShowDay) == "boolean") format = DateUtils.FORMAT_3;
        this.txt_timeLeft.text = App.StringUtils.substitude(LangWelfare.LANG11
            , App.DateUtils.getTimeStrBySeconds(lefttime, format));
    }

	private timer(value: boolean) {
        if (value) {
            App.TimerManager.doTimer(1000, 0, this.count, this);
        } else {
            App.TimerManager.remove(this.count, this);
        }
    }

	public onHide() {
		super.onHide();
		this.timer(false);
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
}