class QiongCangBossController extends SubController {
	private enterAlert:QiongCangBossAlert;
	private rewardPanel:QiongCangBossRewardPanel;
	public constructor() {
		super();
	}

	public getModule(): any {
		return this._module;
	}

	protected addListenerOnInit():void {
		this.addListen0(LocalEventEnum.EnterQiongCangBoss, this.onEnterBossCopy, this);
		this.addListen0(LocalEventEnum.ShowQiongCangAlert,this.onShowAlertHandler,this);
		this.addListen0(NetEventEnum.packPosTypePropChange, this.checkTips, this);
		this.addListen0(NetEventEnum.moneyGoldUpdate, this.checkTips, this);
		this.addListen0(NetEventEnum.QiongCangBossOwnerTimesUpdate, this.checkTips, this);
		this.addListen0(UIEventEnum.QiongCangBossRewardOpen, this.openRewardPanel, this);
		this.addListen0(NetEventEnum.BossInfUpdate,this.onBossInfoUpdate,this);
    }

    public addListenerOnShow(): void {
    }

	private onEnterBossCopy(cfg:any):void {
		if(!cfg) return;
		let bossCode:number = cfg.bossCode;
		if(!CacheManager.bossNew.getBossIsOpened(bossCode)) {
			// Tip.showTip("暂未开启该BOSS");
			return;
		}
		if(!CacheManager.copy.checkCanEnterCopy()) {
			return;
		}
		if(CacheManager.bossNew.isBossCd(bossCode)) {
			Tip.showTip("BOSS暂未刷新");
			return;
		}
		let limitNumPack: number = ConfigManager.const.getConstValue("PersonalCopyBagFreeCapacity");
		if (!CacheManager.pack.backPackCache.isHasCapacity(limitNumPack)) {
            EventManager.dispatch(LocalEventEnum.ShowSmeltTipsWin, limitNumPack);
            return;
        }
		ProxyManager.boss.reqEnterBossCopy(cfg.copyCode,cfg.mapId);
	}

	private onShowAlertHandler(data:any,floor:number):void {
		if(!this.enterAlert) {
			this.enterAlert = new QiongCangBossAlert();
		}
		this.enterAlert.show({bossCfg:data,floor:floor});
	}

	private checkTips():void {
		if(this.isShow) {
			this.getModule().checkQiongCangBossTips();
		}
		EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.QiongCang,CacheManager.talentCultivate.checkTips());
	}

	private openRewardPanel(bossCode:number):void {
		if(!this.rewardPanel) {
			this.rewardPanel = new QiongCangBossRewardPanel();
		}
		this.rewardPanel.show(bossCode);
	}

	private onBossInfoUpdate(data:any):void {
		if(CacheManager.bossNew.checkBossCopy(data.val_I,null,ECopyType.ECopyMgQiongCangHall) ||
			CacheManager.bossNew.checkBossCopy(data.val_I,null,ECopyType.ECopyMgQiongCangAttic)) {
			this.checkTips();
		}
	}
}