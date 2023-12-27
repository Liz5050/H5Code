class ActivityRankIcon extends BaseContentView {
	// private colorLoader: GLoader;
	private iconLoader: GLoader;
	private activityTankLoader: GLoader;
	private timeTxt: fairygui.GTextField;
	private mcColor: UIMovieClip;

	private itemData: ItemData;
	private count: number;
	private showTypes:ESpecialConditonType[];
	public constructor(parentObj: fairygui.GComponent) {
		super(PackNameEnum.HomeActivityRank, "ActivityRankIcon", null, parentObj);
	}

	public initOptUI(): void {
		// this.colorLoader = <GLoader>this.getGObject("loader_color");
		this.iconLoader = <GLoader>this.getGObject("loader_icon");
		this.activityTankLoader = <GLoader>this.getGObject("loader_actRank");
		this.timeTxt = this.getGObject("txt_time").asTextField;
		this.addClickListener(this.click, this);
	}

	public updateAll(data?: ActivityInfo) {
		let rankCfg: any = ConfigManager.toplistActive.getCurRankCfg();
		let rewardCfg: any;
		if(rankCfg){
			rewardCfg = ConfigManager.toplistActiveDatail.getTopListDetailRewardCfg(rankCfg.toplist, 1);
			if(rewardCfg) {
				let itemDatas:ItemData[] = RewardUtil.getStandeRewards(rewardCfg.rewardList);
				this.itemData = itemDatas[0];
				// this.colorLoader.load(this.itemData.getColorRes());
				this.iconLoader.load(this.itemData.getIconRes());
			}
			this.activityTankLoader.text = rankCfg.name;
			this.activityTankLoader.load(URLManager.getModuleImgUrl(`activityRankIcon/${rankCfg.toplist}.png`, PackNameEnum.Home));
		}
		App.TimerManager.remove(this.countDown, this);
		this.count = data.leftShowTime;
		this.updateTxt();
		App.TimerManager.doTimer(1000, 0, this.countDown, this);
		this.addItemEff();
	}

	private updateTxt(): void{
		let timeStr: string = App.DateUtils.getTimeStrBySeconds(this.count, "{2}:{1}:{0}", false, true);
		this.timeTxt.text = timeStr;
	}

	public countDown(): void {
		this.count --;
		if(this.count <= 0){
			EventManager.dispatch(UIEventEnum.HomeActicityRankIcon);
		}
		this.updateTxt();
	}

	private addItemEff(): void {		
		this.removeEff();
		this.addEff();
	}

	private addEff():void {
		if(this.mcColor == null){
			this.mcColor = UIMovieManager.get(PackNameEnum.MCActivityRankIcon, -75, -88, 1, 1);
			this.view.addChild(this.mcColor);
			this.mcColor.playing = true;
			this.mcColor.frame = 0;
		}
	}
	private removeEff(): void {
		if (this.mcColor) {
			UIMovieManager.push(this.mcColor);
			this.mcColor = null;
		}
	}

	private click(): void{
		if(!this.showTypes) {
			//从开服冲榜按钮打开活动界面，只在界面显示以下3种活动
			this.showTypes = [
				ESpecialConditonType.ESpecialConditonTypeToplistActiveOpen,
				ESpecialConditonType.ESpecialConditonTypeReachGoal,
				ESpecialConditonType.ESpecialConditionTypeNewServerLimitBuy];
		}
		HomeUtil.openActivityByType(ESpecialConditonType.ESpecialConditonTypeToplistActiveOpen,this.showTypes);
	}
}