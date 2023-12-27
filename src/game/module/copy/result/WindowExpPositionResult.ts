class WindowExpPositionResult extends BaseWindow {
	private bgLoader:GLoader;
	private loader_title:GLoader;
	private txt_myExp:fairygui.GTextField;
	private list_item:List;
	private txtTime:fairygui.GRichTextField;
	private baseItem:BaseItem;

	private leftTime:number = 0;
	private curTime:number;
	private timeIndex:number = -1;
	public constructor() {
		super(PackNameEnum.Copy2,"ExpPositionResultWindow");
	}

	public initOptUI():void {
		this.bgLoader = this.getGObject("loader_result_Bg") as GLoader;
		this.bgLoader.load(URLManager.getModuleImgUrl("copy_result_win.png",PackNameEnum.Copy));

		this.loader_title = this.getGObject("loader_title") as GLoader;
		this.loader_title.load(URLManager.getModuleImgUrl("title_position.png",PackNameEnum.Copy));

		this.txt_myExp = this.getGObject("txt_myExp").asTextField;
		this.list_item = new List(this.getGObject("list_item").asList);
		this.txtTime = this.getGObject("timeTxt").asRichTextField;
		this.closeObj.visible = true;

		this.baseItem = this.getGObject("baseItem") as BaseItem;
		this.baseItem.isShowName = false;
	}

	public updateAll(data:any[]):void {

		if(this.timeIndex == -1) {
			this.curTime = egret.getTimer();
			this.leftTime = 10;
			this.txtTime.text = "(" + HtmlUtil.html(this.leftTime + "秒",Color.Green) + "后自动关闭)";
			// App.TimerManager.doTimer(1000,0,this.onTimerHandler,this);
			this.timeIndex = egret.setInterval(this.onTimerHandler,this,1000);
		}
		let selfRank:any = data.pop();
		this.txt_myExp.text = App.MathUtils.formatNum64(selfRank.exp_L64,false);
		this.list_item.data = data;

		let rewardCfg:any = ConfigManager.expPosition.getRankReward(CacheManager.posOccupy.myRank);
		if(rewardCfg) {
			this.baseItem.setData(RewardUtil.getStandeRewards(rewardCfg.reward)[0]);
			this.baseItem.visible = true;
		}
		else {
			this.baseItem.visible = false;
		}
	}

	private onTimerHandler():void {
		let time:number = egret.getTimer();
		this.leftTime -= Math.round((time - this.curTime)/1000);
		this.curTime = time;
		if(this.leftTime <= 0) {
			this.hide();
			return;
		}
		this.txtTime.text = "(" + HtmlUtil.html(this.leftTime + "秒",Color.Green) + "后自动关闭)";
	}

	private removeTimer():void {
		if(this.timeIndex != -1) {
			egret.clearInterval(this.timeIndex);
			this.timeIndex = -1;
		}
		// App.TimerManager.remove(this.onTimerHandler,this);
		this.leftTime = 0;
	}

	public hide():void {
		super.hide();
		this.removeTimer();
	}
}