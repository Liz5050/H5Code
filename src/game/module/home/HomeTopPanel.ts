/**
 * 主界面顶部面板
 */
class HomeTopPanel extends fairygui.GComponent {
	private vipBtn: fairygui.GButton;
	private rechargeBtn: fairygui.GButton;
	private musicBtn: fairygui.GButton;
	private avatarLoader: GLoader;
	private nameTxt: fairygui.GTextField;
	private levelTxt: fairygui.GTextField;
	private coinBtn: fairygui.GButton;
	private goldBtn: fairygui.GButton;
	private coinTxt: fairygui.GTextField;
	private goldTxt: fairygui.GTextField;
	private fightPanel: FightPanel;
	//关卡
	private txt_coinPerHour: fairygui.GTextField;
	private txt_expPerHour: fairygui.GTextField;
	private touch_checkPoint: fairygui.GGraph;
	private group_checkPoint: fairygui.GGroup;
	// private tipCom: fairygui.GComponent;
	private guideClickView: GuideClickView2;
	private isGuiding: boolean;

	private cpClickFun: Function;
	private cpClickCaller: Function;

	private c1: fairygui.Controller;

	    /**体验卡显示 */
    private monthCardExpCom : MonthCardExpCom;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.vipBtn = this.getChild("btn_vip").asButton;
		this.rechargeBtn = this.getChild("btn_recharge").asButton;
		this.musicBtn = this.getChild("btn_music").asButton;
		this.avatarLoader = this.getChild("loader_mainAvatar") as GLoader;
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.levelTxt = this.getChild("txt_level").asTextField;
		this.coinBtn = this.getChild("btn_coin").asButton;
		this.goldBtn = this.getChild("btn_gold").asButton;
		this.coinTxt = this.getChild("txt_coin").asTextField;
		this.goldTxt = this.getChild("txt_gold").asTextField;
		this.fightPanel = <FightPanel>this.getChild("fightPanel");
		this.fightPanel.imgBg.visible = false;
		// this.fightPanel.align = fairygui.AlignType.Left;
		// this.fightPanel.mcX = -243;
		this.txt_coinPerHour = this.getChild("txt_coinPerHour").asTextField;
		this.txt_expPerHour = this.getChild("txt_expPerHour").asTextField;
		this.touch_checkPoint = this.getChild("touch_checkPoint").asGraph;
		this.group_checkPoint = this.getChild("group_checkPoint").asGroup;
		this.c1 = this.getController("c1");
		if (App.DeviceUtils.IsWXGame) {
			this.c1.setSelectedIndex(1);
		}
		else {
			this.c1.setSelectedIndex(1);
		}

		this.avatarLoader.addClickListener(this.clickBtn, this);
		this.vipBtn.addClickListener(this.clickBtn, this);
		this.rechargeBtn.addClickListener(this.clickBtn, this);
		this.musicBtn.addClickListener(this.clickBtn, this);
		this.coinBtn.addClickListener(this.clickBtn, this);
		this.goldBtn.addClickListener(this.clickBtn, this);
		this.touch_checkPoint.addClickListener(this.clickBtn, this);

		this.monthCardExpCom = this.getChild("monthCardExp") as MonthCardExpCom;
        //this.monthCardExpCom.visible = false;
		GuideTargetManager.reg(GuideTargetName.HomeTopPanelAvatarLoader, this.avatarLoader);

		EventManager.addListener(LocalEventEnum.GuideSelectAutoXp, this.guideSelectAutoXp, this);
		EventManager.addListener(LocalEventEnum.HaveNoSound, this.soundUpdate, this);
	}

	public setCheckPointClickFun(fun: Function, caller: any): void {
		this.cpClickFun = fun;
		this.cpClickCaller = caller;
	}

	public updateAll(): void {
		this.updateAvatar();
		this.updateName();
		this.updateLevel();
		this.updateFight();
		this.updateVip();
		this.updateMoney();
		this.updateCheckPointExpRate();
		this.checkPointShow();
		this.soundUpdate();
	}

	public updateAvatar(): void {
		this.avatarLoader.load(URLManager.getPlayerHead(CacheManager.role.role.career_I));
	}

	public updateAvatarBtnTips(isShow: boolean): void {
		CommonUtils.setBtnTips(this, isShow, 98, 15);
	}

	public updateName(): void {
		this.nameTxt.text = CacheManager.role.player.name_S;
	}

	public updateLevel(): void {
		this.levelTxt.text = CacheManager.role.getLevelName();
	}

	public updateFight(): void {
		this.fightPanel.updateValue(CacheManager.role.combatCapabilities);
	}

	public updateVip(): void {
		//vip模块
		let vipLevel: number = CacheManager.vip.vipLevel;
		this.vipBtn.text = "P" + vipLevel;
		CommonUtils.setBtnTips(this.vipBtn, !!CacheManager.vip.getFirstVipLevelReward() || (CacheManager.vipGift.tabFlag && CacheManager.vipGift.checkVipGiftTips(EVipGiftPackageType.EVipGiftPackageTypeCommon)));
	}

	public updateVipGiftTips(): void {
		CommonUtils.setBtnTips(this.vipBtn, (CacheManager.vipGift.tabFlag && CacheManager.vipGift.checkVipGiftTips(EVipGiftPackageType.EVipGiftPackageTypeCommon)) || !!CacheManager.vip.getFirstVipLevelReward());
	}

	/**更新金钱 */
	public updateMoney(): void {
		let money: any = CacheManager.role.money;
		this.coinTxt.text = App.MathUtils.formatNum2(money.coinBind_L64);
		this.goldTxt.text = money.gold_I;//App.MathUtils.formatNum(money.gold_I,false,1,100000);
	}

	/**更新关卡效率 */
	public updateCheckPointExpRate(): void {
		let passNum: number = CacheManager.checkPoint.passPointNum;
		let cfg: any = ConfigManager.checkPoint.getCheckPoint(passNum + 1);
		if (!cfg) {
			cfg = ConfigManager.checkPoint.getCheckPoint(passNum);
		}

		this.txt_coinPerHour.text = HtmlUtil.html(App.MathUtils.formatNum2(cfg.hourCoin), Color.Green2) + "/小时";
		this.txt_expPerHour.text = HtmlUtil.html(App.MathUtils.formatNum2(cfg.hourExp), Color.Green2) + "/小时";
	}

	public checkPointShow(): void {
		// this.group_checkPoint.visible = CacheManager.role.checkPointShow == true;
		this.group_checkPoint.visible = true;//改为一直显示
	}

	private clickBtn(e: TouchEvent): void {
		let target: any = e.target;
		switch (target) {
			case this.rechargeBtn:
				HomeUtil.openRecharge();
				break;
			case this.musicBtn:
				CacheManager.sysSet.setValue(LocalEventEnum[LocalEventEnum.HaveNoSound], this.musicBtn.selected);
				break;
			case this.vipBtn:
				var roleLv: number = CacheManager.role.role.level_I;
				if (roleLv >= 1) {
					EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.VIP);
				} else {
					Tip.showTip("等级不足")
				}
				break;
			case this.avatarLoader:
				EventManager.dispatch(UIEventEnum.SyssetWindowOpen);
				if (this.isGuiding) {
					CacheManager.guide.isNeedGuideSelectAutoXp = true;
					this.hideGuide();
				}
				break;
			case this.coinBtn:
				EventManager.dispatch(UIEventEnum.QuickShopBuyOpen, ItemCodeConst.CoinOfShop);
				break;
			case this.goldBtn:
				HomeUtil.openRecharge(ViewIndex.One);
				break;
			case this.touch_checkPoint:
				if (this.cpClickFun != null && this.cpClickCaller != null) {
					this.cpClickFun.call(this.cpClickCaller);
				}
				break;
		}
	}

	/**
	 * 指引选择自动必杀
	 */
	private guideSelectAutoXp(step: number): void {
		if (this.guideClickView == null) {
			this.guideClickView = new GuideClickView2(1, false);
			// this.guideClickView.setMcXY(-60, -70);
			// this.guideClickView.setTipXY(135, 63);
			// this.guideClickView.updateTip("设置自动必杀", GuideArrowDirection.Right);
		}
		// this.addChild(this.guideClickView);
		this.guideClickView.addToParent(this, GuideArrowDirection.Right, 72, 60, false);
		this.isGuiding = true;
		App.TimerManager.doDelay(10000, () => {
			this.hideGuide();
		}, this);
	}

	private hideGuide(): void {
		if (this.guideClickView != null) {
			this.guideClickView.removeFromParent();
		}
		this.isGuiding = false;
	}

	/**
	 * 设置音乐
	 */
	private soundUpdate(): void {
		this.musicBtn.selected = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HaveNoSound]);
	}

	
    public updateMonthCardExp() {
        if(CacheManager.welfare2.isPrivilegeCard && CacheManager.welfare2.isPrivilegeCardExp) {
            this.monthCardExpCom.visible = true;
            this.monthCardExpCom.updateCardInfo(true);

        }
        else {
            this.monthCardExpCom.visible = false;
            this.monthCardExpCom.updateCardInfo(false);
        }
    }
}