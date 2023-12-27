class KingBattleMatchView extends BaseContentView {
	private bgLoader:GLoader;
	private enterTimeTxt:fairygui.GTextField;
	private matchingTxt:fairygui.GTextField;
	private nameTxt_1:fairygui.GTextField;
	private nameTxt_2:fairygui.GTextField;
	private headIcon_1:GLoader;
	private headIcon_2:GLoader;
	private stageTxt_1:fairygui.GTextField;
	private stageTxt_2:fairygui.GTextField;

	private matchingView:MatchingTweenView;
	private maskObj:fairygui.GGraph;

	private info:any;
	private leftTime:number = -1;
	private curTime:number;
	/**做假匹配时间 */
	private matchingTime:number = -1;
	private timeIndex:number = -1;
	public constructor() {
		super(PackNameEnum.KingBattle,"KingBattleMatchView",null,LayerManager.UI_Popup);
		this.isCenter = true;
		this.modal = true;
	}

	public initOptUI():void {
		this.bgLoader = this.getGObject("bgLoader") as GLoader;
		this.bgLoader.load(URLManager.getModuleImgUrl("kingBattle/matchBg.png",PackNameEnum.Arena));

		this.enterTimeTxt = this.getGObject("enterTimeTxt").asTextField;
		this.matchingTxt = this.getGObject("matchingTxt").asTextField;

		this.nameTxt_1 = this.getGObject("nameTxt_1").asTextField;
		this.stageTxt_1 = this.getGObject("stageTxt_1").asTextField;
		this.headIcon_1 = this.getGObject("headIcon_1") as GLoader;
		let info:EntityInfo = CacheManager.role.entityInfo;
		this.nameTxt_1.text = info.name_S;
		this.headIcon_1.load(URLManager.getPlayerHead(info.career_SH));

		this.nameTxt_2 = this.getGObject("nameTxt_2").asTextField;
		this.stageTxt_2 = this.getGObject("stageTxt_2").asTextField;
		this.headIcon_2 = this.getGObject("headIcon_2") as GLoader;

		this.matchingView = new MatchingTweenView(this.getGObject("matching_tween").asCom);
		this.maskObj = this.getGObject("mask_shape").asGraph;
		this.matchingView.mask = this.maskObj.displayObject;
	}

	public updateAll(data:any = null):void {
		this.info = data;
		this.nameTxt_2.text = "???";
		this.stageTxt_2.text = "???";
		this.headIcon_2.clear();
		
		let info:any = CacheManager.arena.selfBattleInfo;
		this.stageTxt_1.text = ConfigManager.mgKingStife.getStageStrByLevel(info.level_I);

		if(this.timeIndex == -1) {
			this.curTime = egret.getTimer();
			this.matchingTime = Math.round(App.MathUtils.getRandom(1,3));
			this.leftTime = 4;
			this.enterTimeTxt.text = "";
			this.matchingTxt.text = "匹配中...";
			this.matchingView.startMatch();
			// App.TimerManager.doTimer(1000,0,this.onTimerHandler,this);
			this.timeIndex = egret.setInterval(this.onTimerHandler,this,1000);
		}
	}

	private onTimerHandler():void {
		let time:number = egret.getTimer();
		let interval:number = Math.round((time - this.curTime) / 1000);
		this.matchingTime -= interval;
        this.curTime = time;

		if(this.matchingTime <= 0) {
			this.matchingTxt.text = "";
			if(this.matchingTime == 0) {
				//做假匹配成功
				this.updateMatchInfo();
				this.matchingView.stopMatch();
			}
			this.leftTime -= interval;
			if(this.leftTime <= 0) {
				this.hide();
				EventManager.dispatch(LocalEventEnum.EnterKingBattle);
				return; 
			}
			this.enterTimeTxt.text = "进入倒计时" + this.leftTime + "秒";
		}
	}

	private updateMatchInfo():void {
		this.nameTxt_2.text = this.info.player.name_S;
		this.stageTxt_2.text = ConfigManager.mgKingStife.getStageStrByLevel(this.info.level_I);
		this.headIcon_2.load(URLManager.getPlayerHead(this.info.player.career_SH));
	}

	private removeTimer():void {
        // App.TimerManager.remove(this.onTimerHandler,this);
		if(this.timeIndex != -1) {
			egret.clearInterval(this.timeIndex);
			this.timeIndex = -1;
		}
        this.enterTimeTxt.text = "";
		this.leftTime = -1;
		this.matchingTime = -1;
    }

	public hide():void {
		super.hide();
		this.removeTimer();
	}
}