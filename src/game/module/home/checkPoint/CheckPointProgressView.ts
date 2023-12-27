class CheckPointProgressView extends BaseView {
	private c1: fairygui.Controller;
	private progressBar: UIProgressBar;
	private autoBtn: fairygui.GButton;
	private guideClickView: GuideClickView2;
	private timeOutIdx: number;
	private mcFire: UIMovieClip;
	private mcFull: UIMovieClip;
	private autoMc: UIMovieClip;
	private txt_checkpoint:fairygui.GTextField;

	private SIZE: number = 113;
	private value: number = 0;
	private total: number = 0;
	public constructor(component: fairygui.GComponent) {
		super(component);
	}

	protected initOptUI(): void {
		this.c1 = this.getController("c1");
		this.progressBar = this.getGObject("progressBar_energy") as UIProgressBar;
		this.progressBar.setStyle(URLManager.getPackResUrl(PackNameEnum.Home, "checkpoint_bar"), "");
		this.progressBar.addEventListener(UIProgressBar.PROPGRESS_COMPLETE, this.onProgressComplete, this);
		this.txt_checkpoint = this.getGObject("txt_checkpoint").asTextField;

		let mcContainer: fairygui.GComponent = this.getGObject("mc_container").asCom;
		this.mcFire = UIMovieManager.get(PackNameEnum.MCCheckPointFire);
		this.mcFire.x = -188;
		this.mcFire.y = -184;
		this.mcFire.setDouble(true, -2);
		mcContainer.addChild(this.mcFire);
		this.mcFire.playing = false;
		this.mcFire.visible = false;

		this.mcFull = UIMovieManager.get(PackNameEnum.MCCheckPointFull);
		this.mcFull.x = -188;
		this.mcFull.y = -184;
		this.mcFull.setDouble(true, -2);
		mcContainer.addChild(this.mcFull);
		this.mcFull.playing = false;
		this.mcFull.visible = false;

		this.autoBtn = this.getGObject("btn_fightAuto").asButton;
		this.autoBtn.addClickListener(this.onAutoFightHandler, this);
		this.getGObject("btn_checkPoint").addClickListener(this.onEnterChallengeHandler, this);
		GuideTargetManager.reg(GuideTargetName.CheckPointBtn, this.view);
		GuideTargetManager.reg(GuideTargetName.CheckPointAutoBtn, this.autoBtn);
	}

	public updateAll(): void {
		let floor: number = CacheManager.checkPoint.passPointNum;
		this.view.visible = CacheManager.checkPoint.isCheckPointViewShow;//floor >= 11 && (ConfigManager.checkPoint.isCheckPointMap(floor + 1, CacheManager.map.mapId) || CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter));
		this.autoBtn.visible = floor >= 15;
		this.autoBtn.selected = CacheManager.checkPoint.isAuto;
		this.txt_checkpoint.text = (floor + 1) + "";

		if (!CacheManager.checkPoint.enterEncounter) {
			CacheManager.checkPoint.clientEnerge = 0;
		}
		this.value = -1;
		if (this.view.visible) {
			this.updateProgress();
			EventManager.dispatch(UIEventEnum.ViewOpened, this["__class__"]);
		}
		this.checkAutoMc();
	}

	public updateProgress(): void {
		if (!this.view.visible) return;
		let max: number = CacheManager.checkPoint.maxEnerge;
		if (!max) return;
		let min: number = Math.min(CacheManager.checkPoint.clientEnerge, max);
		// this.progressBar.setValue(min, max, true);
		this.setValue(min, max);
		this.mcFire.visible = true;
		this.mcFire.setPlaySettings(0, -1, 1, -1, () => {
			this.mcFire.visible = false;
			this.mcFire.playing = false;
		}, this);
		this.mcFire.playing = true;
	}

	public updateAutoCopyState(): void {
		if (CacheManager.sysSet.autoCopy) {
			this.onProgressComplete();
		}
	}

	private setValue(value: number, total: number): void {
		if (this.value == value && this.total == total) {
			return;
		}
		this.value = value;
		this.total = total;

		this.progressBar.setValue(value, total);

		if (value == total) {
			this.mcFull.visible = true;
			this.mcFull.playing = true;
			this.mcFire.visible = false;
			this.mcFire.playing = false;
		}
		else {
			this.mcFull.visible = false;
			this.mcFull.playing = false;
		}
		// let unitSize:number = this.SIZE / total;
		// this.maskObj.y = 171 - unitSize * value;
		this.onProgressComplete();
		// this.processGuide(value == total);
	}

	/**
     * 显示指引。已经设置了自动，指引挑战，否则指引自动
     */
	public showGuide(guideStepInfo: GuideStepInfo): void {
		if (this.guideClickView == null) {
			this.guideClickView = new GuideClickView2();
		}
		if (guideStepInfo == null) {
			guideStepInfo = new GuideStepInfo("guide_checkpoint_1", {});
		}

		App.TimerManager.remove(this.hideGuide, this);
		App.TimerManager.doDelay(5000, this.hideGuide, this);

		if (CacheManager.checkPoint.isAuto || !this.autoBtn.visible) {
			// this.guideClickView.setMcXY(200, -70);
			// this.guideClickView.clickMc.scaleX = -1;
			// this.guideClickView.setTipXY(10, 77);
			guideStepInfo.desc = "点击挑战关卡";
			this.guideClickView.addToParent(this.view, GuideArrowDirection.Left, 68, 66, false);
		} else {
			// this.guideClickView.setMcXY(200, 42);
			// this.guideClickView.clickMc.scaleX = -1;
			// this.guideClickView.setTipXY(10, 167);
			guideStepInfo.desc = "点击自动闯关";
			this.guideClickView.addToParent(this.autoBtn, GuideArrowDirection.Left);
		}
		this.guideClickView.guideKey = guideStepInfo.key;
		this.guideClickView.updateTip(guideStepInfo.desc);
		// this.view.addChild(this.guideClickView);
		

		// this.processGuide(this.mcFull.visible);
	}

	private hideGuide(): void {
		if (this.guideClickView) {
			this.guideClickView.removeFromParent();
		}
	}

	private processGuide(isShow: boolean): void {
		if (this.guideClickView && this.guideClickView.parent) {
			this.guideClickView.visible = isShow;
		}
	}

	private onProgressComplete(): void {
		if (!CacheManager.sysSet.autoCopy) return;
		if (CacheManager.checkPoint.isAuto) {
			//自动挑战关卡boss
			if (CacheManager.checkPoint.canChallenge) {
				Tip.showTaskTopTip("能量已满，即将自动挑战关卡BOSS");
				if (this.timeOutIdx != -1) {
					egret.clearTimeout(this.timeOutIdx);
				}
				this.timeOutIdx = egret.setTimeout(function () {
					this.timeOutIdx = -1;
					if (CacheManager.checkPoint.isAuto && CacheManager.checkPoint.canChallenge && !CacheManager.copy.isInCopy) {
						this.onEnterChallengeHandler();
					}
				}, this, 2000);
			}
		}
	}

	/**设置自动战斗 */
	private onAutoFightHandler(evt: egret.Event): void {
		let floor: number = CacheManager.checkPoint.passPointNum;
		if (floor < 9) {
			Tip.showTip("挑战第十关开启自动挑战");
			this.autoBtn.selected = false;
			return;
		}
		if (!CacheManager.checkPoint.isAuto) {
			let limitNumPack: number = ConfigManager.const.getConstValue("PersonalCopyBagFreeCapacity");
			if (!CacheManager.pack.backPackCache.isHasCapacity(limitNumPack)) {
				EventManager.dispatch(LocalEventEnum.ShowSmeltTipsWin, limitNumPack);
				CacheManager.checkPoint.isAuto = false;
				this.autoBtn.selected = false;
				return;
			}
		}
		CacheManager.checkPoint.isAuto = !CacheManager.checkPoint.isAuto;
		this.autoBtn.selected = CacheManager.checkPoint.isAuto;
		this.onProgressComplete();

		if (this.guideClickView != null && this.guideClickView.isShow) {
			this.guideClickView.removeFromParent();
			// EventManager.dispatch(UIEventEnum.GuideShow, true);
		}
		this.checkAutoMc();
	}

	/**挑战关卡boss */
	private onEnterChallengeHandler(): void {
		if (this.timeOutIdx != -1) {
			egret.clearTimeout(this.timeOutIdx);
			this.timeOutIdx = -1;
		}
		if (!CacheManager.checkPoint.canChallengeEx(true)) {
			CacheManager.checkPoint.isAuto = false;
			this.autoBtn.selected = false;
		} else {
			EventManager.dispatch(LocalEventEnum.EnterPointChallenge);
		}
		if (this.guideClickView != null && this.guideClickView.isShow) {
			this.guideClickView.onClick();
		}
	}

	/**
	 * 检测自动闯关特效
	 */
	private checkAutoMc(): void {
		if (CacheManager.checkPoint.passPointNum < ClientConst.CheckPointAutoMcPassPointNum && !this.autoBtn.selected) {
			if (this.autoMc == null) {
				this.autoMc = UIMovieManager.get(PackNameEnum.MCOneKey, -118, -156, 0.73, 0.7);
			}
			this.autoBtn.addChild(this.autoMc);
		} else {
			if (this.autoMc != null) {
				this.autoMc.removeFromParent();
			}
		}
	}
}