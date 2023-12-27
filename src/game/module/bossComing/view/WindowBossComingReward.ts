class WindowBossComingReward extends BaseContentView {
	private ownerList:List;
	private tipsTxt:fairygui.GTextField;
	// private bossList:any[];
	private closeBtn:fairygui.GButton;
	public constructor() {
		super(PackNameEnum.BossComing,"WindowBossComingReward");
		this.modal = true;
		this.modalAlpha = 0;
		this.isCenter = true;
		this.isPopup = true;
	}

	public initOptUI():void {
		this.ownerList = new List(this.getGObject("list_belong").asList);
		this.tipsTxt = this.getGObject("txt_tishi").asTextField;
		// this.bossList = ConfigManager.mgGameBoss.getByCopyCode(CopyEnum.CopyWorldBoss);

		this.closeBtn = this.getGObject("btn_close").asButton;
		this.closeBtn.addClickListener(this.hide,this);
	}

	/**模块显示时开启的监听 */
    protected addListenerOnShow(): void {
		this.addListen1(NetEventEnum.BossRewardResult,this.hide,this);
    }

	public updateAll(data:any = null):void {
		let cfg:any = ConfigManager.mgGameBoss.getByPk(data);
		if(!cfg) {
			this.hide();
			Log.trace(Log.TEST,"t_mg_game_boss error:",data);
			return;
		}
		
		let itemDatas:ItemData[] = RewardUtil.getRewards(cfg.showReward);
		this.ownerList.data = itemDatas;
	}
}