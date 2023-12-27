/**
 * 设置窗口
 */
class SysSetWindow extends BaseWindow {
	private xpBtn: fairygui.GButton;
	private musicBtn: fairygui.GButton;
	private shakeBtn: fairygui.GButton;
	private btnAccount: fairygui.GButton;
	private btnEffect : fairygui.GButton;
	private btn_autoRelive:fairygui.GButton;
	private guideClickView: GuideClickView2;
	private isGuiding: boolean;

	public constructor() {
		super(PackNameEnum.Setup, "WindowSetup");
		// 已自动原地复活（设置）
	}

	public initOptUI(): void {
		this.xpBtn = this.getGObject("btn_xp").asButton;
		this.musicBtn = this.getGObject("btn_music").asButton;
		this.shakeBtn = this.getGObject("btn_shake").asButton;
		this.btnAccount = this.getGObject("btn_account").asButton;
		this.btnEffect = this.getGObject("btn_effect").asButton;
		this.btn_autoRelive = this.getGObject("btn_autoRelive").asButton;

		this.musicBtn.addClickListener(this.clickBtn, this);
		this.shakeBtn.addClickListener(this.clickBtn, this);
		this.xpBtn.addClickListener(this.clickBtn, this);
		this.btnAccount.addClickListener(this.clickBtn, this);
		this.btnEffect.addClickListener(this.clickBtn, this);
		this.btn_autoRelive.addClickListener(this.clickBtn,this);
		GuideTargetManager.reg(GuideTargetName.SysSetWindowXpBtn, this.xpBtn);
	}

	public updateAll(data: any = null): void {
		this.musicBtn.selected = !CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HaveNoSound]);
		this.shakeBtn.selected = !CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.NoShake]);
		if (CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.SysSettingGuide])) {
			CacheManager.sysSet.setValue(LocalEventEnum[LocalEventEnum.SysSettingGuide], false);
		}
		this.btnEffect.selected =  CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HideEffect]);
		this.xpBtn.selected = CacheManager.sysSet.isAutoXp;
		this.btnAccount.visible = Sdk.isNeedSwitchAccount;
		this.btn_autoRelive.selected = CacheManager.sysSet.getValue(LocalEventEnum.AutoRelive);
	}

	public onShow(data: any = null): void {
		super.onShow(data);
		if (CacheManager.guide.isNeedGuideSelectAutoXp) {
			this.guideSelectAutoXp();
		}
	}

	private clickBtn(e: TouchEvent): void {
		var btn: any = e.target;
		switch (btn) {
			case this.musicBtn:
				CacheManager.sysSet.setValue(LocalEventEnum[LocalEventEnum.HaveNoSound], !btn.selected);
				break;
			case this.shakeBtn:
				CacheManager.sysSet.setValue(LocalEventEnum[LocalEventEnum.NoShake], !btn.selected);
				break;
			case this.xpBtn:
				CacheManager.sysSet.isAutoXp = this.xpBtn.selected;
				if (this.isGuiding) {
					this.hideGuide();
					CacheManager.guide.isNeedGuideSelectAutoXp = false;
				}
				break;
			case this.btnAccount:
				Sdk.switchAccount();
				break;
			case this.btnEffect: 
				CacheManager.sysSet.setValue(LocalEventEnum[LocalEventEnum.HideEffect], btn.selected);
				break;
			case this.btn_autoRelive:
				CacheManager.sysSet.setValue(LocalEventEnum[LocalEventEnum.AutoRelive], btn.selected);
				break;
		}
	}

	/**
	 * 指引选择自动必杀
	 */
	private guideSelectAutoXp(): void {
		if (!CacheManager.sysSet.isAutoXp) {
			if (this.guideClickView == null) {
				this.guideClickView = new GuideClickView2();
				// this.guideClickView.setMcXY(-41, 45);
				// this.guideClickView.setTipXY(86, 205);
				// this.guideClickView.updateTip("勾选自动必杀", GuideArrowDirection.Bottom);
			}
			// this.addChild(this.guideClickView);
			this.guideClickView.addToParent(this.xpBtn);
			this.isGuiding = true;
			App.TimerManager.doDelay(10000, () => {
				this.hideGuide();
			}, this);
		}
	}

	private hideGuide(): void {
		if (this.guideClickView != null) {
			this.guideClickView.removeFromParent();
		}
		this.isGuiding = false;
	}
}