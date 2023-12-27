class ContestMatchWindow extends BaseWindow {
    private c1: fairygui.Controller;//n:1vn
    private bgLoader:GLoader;
    private bgLoader2: GLoader;
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
    private leftTime:number = -1;//弃用
    private curTime:number;
    /**做假匹配时间 */
	private matchingTime:number = -1;
    private timeIndex:number = -1;
    private playerList: List;
    private playerLast: ContestOpponentItem;
    private player1: any;//第一个对手
    private hasMatchComp: boolean;

	public constructor() {
		super(PackNameEnum.Contest,"ContestMatchWindow",null,LayerManager.UI_Popup);
		this.isCenter = true;
		this.isPopup = false;
	}

	public initOptUI():void {
		this.c1 = this.getController('c1');
		this.bgLoader = this.getGObject("bgLoader") as GLoader;
		this.bgLoader.load(URLManager.getModuleImgUrl("match_bg.png",PackNameEnum.Contest));
		this.bgLoader2 = this.getGObject("bgLoader_2") as GLoader;
		this.bgLoader2.load(URLManager.getModuleImgUrl("opponent_bg.png",PackNameEnum.Contest));

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

        this.playerList = new List(this.getGObject("list_n").asList);//h=84
        this.playerLast = this.getGObject('item_last') as ContestOpponentItem;
	}

	public updateAll(data:any = null):void {
		this.info = data;
		this.nameTxt_2.text = "???";
		this.stageTxt_2.text = "???";
		this.headIcon_2.clear();

		let opponents:any[] = data.players.data;
		let opponentsNum:number = opponents ? opponents.length : 0;
		if (opponentsNum <= 0) return;
		this.stageTxt_1.text = HtmlUtil.colorSubstitude(LangContest.LANG31, App.MathUtils.formatNum(CacheManager.role.combatCapabilities));
		this.c1.selectedIndex = opponentsNum;
		this.player1 = opponents[0];

		if(opponentsNum <= 1) {//匹配到一个对手时，做假倒计时
			this.curTime = egret.getTimer();
			this.matchingTime = 2//Math.round(App.MathUtils.getRandom(1,4));
			this.leftTime = 4;//弃用
			this.enterTimeTxt.text = "";
			this.matchingTxt.text = "匹配中...";
			this.matchingView.startMatch();
			this.timeIndex = egret.setInterval(this.onTimerHandler,this,1000);
		} else {
			if (opponentsNum % 2 != 0) {
                this.playerLast.setData(opponents.pop(), -1);
			}
			this.playerList.data = opponents;
            this.initEnterCountdown();
		}
	}

	private initEnterCountdown():void {
        this.onEnterCountdown();
        EventManager.addListener(LocalEventEnum.ContestMatchCountdownUpdate, this.onEnterCountdown, this);
        CacheManager.sysSet.autoCopy = false;
	}

	private onTimerHandler():void {
		let time:number = egret.getTimer();
        let interval:number = Math.round((time - this.curTime) / 1000);
        this.matchingTime -= interval;
        this.curTime = time;

		if(this.matchingTime <= 0) {
			this.matchingTxt.text = "";
			if(!this.hasMatchComp) {
				//做假匹配成功
                this.hasMatchComp = true;
				this.updateMatchInfo();
				this.matchingView.stopMatch();
			}
			this.removeTimer();
            this.initEnterCountdown();
		}
	}

	private onEnterCountdown():void {
        Log.trace(Log.OVN, `onEnterCountdown>结束时间戳:${CacheManager.contest.matchInfo.enterDt_I},倒计时:${CacheManager.serverTime.getServerTime() - CacheManager.contest.matchInfo.enterDt_I}S`);
        let leftTime:number = CacheManager.contest.getLastEnterTimer();
        if (leftTime >= 0) {
            this.enterTimeTxt.text = "进入倒计时" + leftTime + "秒";
        } else {
            this.hide();
        }
	}

	private updateMatchInfo():void {
		this.nameTxt_2.text = this.player1.name_S;
		this.stageTxt_2.text = HtmlUtil.colorSubstitude(LangContest.LANG31, App.MathUtils.formatNum(Number(this.player1.warfare_L64)));
		this.headIcon_2.load(URLManager.getPlayerHead(this.player1.career_I));
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
        EventManager.removeListener(LocalEventEnum.ContestMatchCountdownUpdate, this.onEnterCountdown, this);
        CacheManager.sysSet.autoCopy = true;
        this.hasMatchComp = false;
	}
}