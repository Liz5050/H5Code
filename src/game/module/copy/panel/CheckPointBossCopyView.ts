class CheckPointBossCopyView extends BaseCopyPanel {
	private list_rewrad:List;
	private monsterDied:boolean = false;
	public constructor(copyInfo:any) {
		super(copyInfo,"CheckPointBossCopyView");
		this.isCenter = true;
	}

	public initOptUI():void {
		super.initOptUI();
		this.list_rewrad = new List(this.getGObject("list_reward").asList,{isShowName:false});
	}

	protected addListenerOnShow(): void {
        //for override
        this.addListen1(LocalEventEnum.SwitchBossLifeBarVisible,this.onBossLifeBarVisibleChange,this);
		this.addListen1(LocalEventEnum.MonsterDied,this.onMonsterDiedHandler,this);
    }

	public updateAll():void {
		this.parent.setChildIndex(this,0);
		super.updateAll();
		this.monsterDied = false;
		this.onBossLifeBarVisibleChange();
		let passNum: number = CacheManager.checkPoint.passPointNum;
		let cfg: any = ConfigManager.checkPoint.getCheckPoint(passNum + 1);//当前正在挑战的boss关
		if(cfg && cfg.rewards) {
			this.list_rewrad.data = RewardUtil.getStandeRewards(cfg.rewards);
		}
		else {
			this.list_rewrad.data = null;
		}
	}

	private onMonsterDiedHandler():void {
		this.monsterDied = true;
		this.onBossLifeBarVisibleChange();
	}

	private onBossLifeBarVisibleChange():void {
		this.list_rewrad.list.visible = CacheManager.checkPoint.isShowBossLife && !this.monsterDied;
	}

	public hide():void {
		super.hide();
		this.monsterDied = false;
	}
}