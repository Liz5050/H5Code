class CampBattleCopyView extends BaseCopyPanel {
	private c1:fairygui.Controller;
	private nameTxts:fairygui.GTextField[];
	private scoreTxts:fairygui.GTextField[];

    private txt_myScore:fairygui.GTextField;
    private txt_myScoreVal:fairygui.GTextField;
    private txt_myRank:fairygui.GTextField;

    private txt_leftTime:fairygui.GTextField;
    private txt_exchangeTime:fairygui.GTextField;

    private btn_checkRank:fairygui.GButton;

	private txt_scoreReward:fairygui.GTextField;
	private btn_get_score:fairygui.GButton;
	private reward_group:fairygui.GGroup;

	private leftTime:number;
	private exchangeTime:number = -1;
	private curTime:number;
	private scoreStr:string;
	private scoreRewardCfg:any;
	private rankWindow:CampBattleRankWindow;
	private timeIndex:number = -1;
	public constructor(copyInf:any) {
		super(copyInf,"CampBattleCopyView");
		this.exitTips = "是否退出血战五洲？\n退出后有30秒进入CD";
	}

	public initOptUI(): void {
		super.initOptUI();
		this.c1 = this.getController("c1");
		this.nameTxts = [];
		this.scoreTxts = [];
		for(let i:number = 0; i < 3; i++) {
			let nameTxt:fairygui.GTextField = this.getGObject("txt_name_" + i).asTextField;
			this.nameTxts.push(nameTxt);

			let scoreTxt:fairygui.GTextField = this.getGObject("txt_score_" + i).asTextField;
			this.scoreTxts.push(scoreTxt);
		}
        this.txt_myScore = this.getGObject("txt_myScore").asTextField;
        this.txt_myScoreVal = this.getGObject("txt_myScoreVal").asTextField;
        this.txt_myRank = this.getGObject("txt_myRank").asTextField;

        this.txt_leftTime = this.getGObject("txt_leftTime").asTextField;
        this.txt_exchangeTime = this.getGObject("txt_exchangeTime").asTextField;

		this.reward_group = this.getGObject("reward_group").asGroup;
		this.txt_scoreReward = this.getGObject("txt_scoreReward").asTextField;
		this.btn_get_score = this.getGObject("btn_get_score").asButton;
		this.btn_get_score.addClickListener(this.onGetScoreRewardHandler,this);

        this.btn_checkRank = this.getGObject("btn_checkRank").asButton;
        this.btn_checkRank.addClickListener(this.onCheckRankHandler, this);
		this.scoreStr = HtmlUtil.html("积分",Color.Color_7);
	}

	public updateAll(data?:any):void{
		this.leftTime = CacheManager.campBattle.leftTime;
		this.c1.setSelectedIndex(0);
		if(this.exchangeTime <= 0) {
			this.exchangeTime = CacheManager.campBattle.exchangeTime;
		}
		if(this.exchangeTime < 0) {
			this.exchangeTime = 0;
			this.c1.setSelectedIndex(1);
		}
		if(this.timeIndex == -1) {
			this.curTime = egret.getTimer();
			this.txt_leftTime.text = App.DateUtils.getTimeStrBySeconds(this.leftTime,DateUtils.FORMAT_5,false);
			this.txt_exchangeTime.text = App.DateUtils.getTimeStrBySeconds(this.exchangeTime,DateUtils.FORMAT_5,false);
			// App.TimerManager.doTimer(1000,0,this.onTimerUpdate,this);
			this.timeIndex = egret.setInterval(this.onTimerUpdate,this,1000);
		}
		this.updateScoreReward();
	}

	private onTimerUpdate():void {
		let time:number = egret.getTimer();
		let sec:number = Math.round((time - this.curTime) / 1000);
		this.leftTime -= sec;
		this.exchangeTime -= sec;
		this.curTime = time;
		if(this.leftTime < 0) {
			this.exchangeTime = -1;
			// App.TimerManager.remove(this.onTimerUpdate,this);
			if(this.timeIndex != -1) {
				egret.clearInterval(this.timeIndex);
				this.timeIndex = -1;
			}
			return;
		}
		this.txt_leftTime.text = App.DateUtils.getTimeStrBySeconds(this.leftTime,DateUtils.FORMAT_5,false);
		if(this.exchangeTime < 0) {
			this.exchangeTime = CacheManager.campBattle.exchangeTime;
		}
		if(this.exchangeTime < 0) {
			this.exchangeTime = 0;
			this.c1.setSelectedIndex(1);
		}
		else {
			this.txt_exchangeTime.text = App.DateUtils.getTimeStrBySeconds(this.exchangeTime,DateUtils.FORMAT_5,false);
		}
	}

	/**
	 * 积分更新
	 */
	public updateScore():void {
		this.txt_myScoreVal.text = CacheManager.campBattle.myScore + "";
		let myRank:number = CacheManager.campBattle.myRank;
		this.txt_myRank.text = myRank == 0 ? "排名：未上榜" : "排名：" + myRank;
		let scoreList:any[] = CacheManager.campBattle.scoreInfos;
		if(scoreList) {
			for(let i:number = 0; i < scoreList.length; i++) {
				if(i < this.nameTxts.length) {
					this.nameTxts[i].text = ChatUtils.getPlayerName(scoreList[i])
					this.scoreTxts[i].text = scoreList[i].score_I;
				}
			}
		}
		this.updateScoreRewardTxt();
	}

	/**
	 * 更新积分奖励
	 */
	public updateScoreReward():void {
		this.scoreRewardCfg = ConfigManager.campBattleScoreCfg.getCurScoreRewardCfg();
		this.updateScoreRewardTxt();
	}

	private updateScoreRewardTxt():void {
		let myScore:number = CacheManager.campBattle.myScore;
		if(this.scoreRewardCfg) {
			let color:number;
			if(myScore >= this.scoreRewardCfg.score) {
				color = Color.Green2
				CommonUtils.setBtnTips(this.btn_get_score,true);
			}
			else {
				color = Color.Red2;
				CommonUtils.setBtnTips(this.btn_get_score,false);
			}
			
			this.txt_scoreReward.text = this.scoreStr + HtmlUtil.html(myScore + "/" + this.scoreRewardCfg.score,color);
			this.reward_group.visible = true;
		}
		else {
			this.reward_group.visible = false;
		}
		if(this.rankWindow && this.rankWindow.isShow) {
			this.rankWindow.updateScore();
		}
	}

    private onCheckRankHandler():void{
        if(!this.rankWindow) {
			this.rankWindow = new CampBattleRankWindow();
		}
		this.rankWindow.show();
    }

	/**领取积分奖励 */
	private onGetScoreRewardHandler():void {
		if(!this.scoreRewardCfg) {
			return;
		}
		if(CacheManager.campBattle.myScore < this.scoreRewardCfg.score) {
			Tip.showTip("积分不足");
			return;
		}
		ProxyManager.gamePlay.getCampBattleScoreReward(this.scoreRewardCfg.score);
	}

	public hide():void {
		this.exchangeTime = -1;
		// App.TimerManager.remove(this.onTimerUpdate,this);
		if(this.timeIndex != -1) {
			egret.clearInterval(this.timeIndex);
			this.timeIndex = -1;
		}
		for(let i:number = 0; i < this.nameTxts.length; i++) {
			this.nameTxts[i].text = "虚位以待";
			this.scoreTxts[i].text = "0";
		}
		super.hide();
		if(this.rankWindow && this.rankWindow.isShow) {
			this.rankWindow.hide();
		}
	}
}