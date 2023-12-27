class CrossStairCopyView extends BaseCopyPanel {
	private nameTxts:fairygui.GTextField[];
	private floorTxts:fairygui.GTextField[];

	private txt_nextCondition:fairygui.GRichTextField;
	private txt_leftTime:fairygui.GTextField;
	private btn_checkRank:fairygui.GButton;
	private txt_scoreReward:fairygui.GTextField;
	private btn_get_score:fairygui.GButton;
	private reward_group:fairygui.GGroup;
	private txt_floor:fairygui.GTextField;

	private rewardWindow:CrossStairRewardWindow;
	// private rankWindow:CrossStairRankWindow;

	private leftTime:number;
	private curTime:number;
	private scoreStr:string;
	private rewardCfg:any;
	private stairInfo:any;
	private canGet:boolean = false;
	public constructor(copyInf:any) {
		super(copyInf,"CrossStairCopyView");
		this.exitTips = LangArena.L52;
	}

	public initOptUI(): void {
		super.initOptUI();
		this.nameTxts = [];
		this.floorTxts = [];
		for(let i:number = 0; i < 3; i++) {
			let nameTxt:fairygui.GTextField = this.getGObject("txt_name_" + i).asTextField;
			this.nameTxts.push(nameTxt);

			let scoreTxt:fairygui.GTextField = this.getGObject("txt_floor_" + i).asTextField;
			this.floorTxts.push(scoreTxt);
		}

		this.txt_nextCondition = this.getGObject("txt_nextCondition").asRichTextField;
		this.txt_leftTime = this.getGObject("txt_leftTime").asTextField;
		this.txt_floor = this.getGObject("txt_floor").asTextField;

		this.reward_group = this.getGObject("reward_group").asGroup;
		this.txt_scoreReward = this.getGObject("txt_scoreReward").asTextField;
		this.btn_get_score = this.getGObject("btn_get_score").asButton;
		this.btn_get_score.addClickListener(this.onGetScoreRewardHandler,this);

		this.btn_checkRank = this.getGObject("btn_checkRank").asButton;
        this.btn_checkRank.addClickListener(this.onCheckRankHandler, this);
		this.scoreStr = HtmlUtil.html(LangArena.L42,Color.Color_7);
	}

	protected addListenerOnShow(): void {
		this.addListen1(NetEventEnum.CrossStairRankInfoUpdate,this.updateRankInfo,this);
		this.addListen1(NetEventEnum.CrossStairInfoUpdate,this.updateStairInfo,this);
		this.addListen1(NetEventEnum.CrossStairFloorRewardSuccess,this.updateFloorReward,this);
		if(this.stairInfo && this.stairInfo.floor_I != 1) {
			this.onSceneMapUpdate();
		}
		this.addListen1(UIEventEnum.SceneMapUpdated,this.onSceneMapUpdate,this);
    }

	public updateAll(data?:any):void {
		this.leftTime = CacheManager.crossStair.leftTime;
		if(!App.TimerManager.isExists(this.onTimerUpdate,this)) {
			this.curTime = egret.getTimer();
			this.txt_leftTime.text = App.DateUtils.getTimeStrBySeconds(this.leftTime,DateUtils.FORMAT_5,false);
			App.TimerManager.doTimer(1000,0,this.onTimerUpdate,this);
		}
		this.updateStairInfo();
		this.updateRankInfo();
	}

	/**
	 * 通关层数、领奖信息更新
	 */
	private updateStairInfo():void {
		this.stairInfo = CacheManager.crossStair.stairInfo;
		let floor:number = 0;
		let killNum:number = 0;
		if(this.stairInfo) {
			floor = this.stairInfo.floor_I;
			killNum = this.stairInfo.killNum_I
		}
		let nextCfg:any = ConfigManager.crossStair.getByPk(floor + 1);
		let curCfg:any = ConfigManager.crossStair.getByPk(floor);
		if(!nextCfg) {
			this.txt_nextCondition.text = App.StringUtils.substitude(LangArena.L47,killNum,curCfg.killNum);
		}
		else {
			if(curCfg) {
				this.txt_nextCondition.text = App.StringUtils.substitude(LangArena.L46,killNum,curCfg.killNum);
			}
		}
		this.txt_floor.text = App.StringUtils.substitude(LangArena.L44,floor);
		this.updateFloorReward();
	}

	/**
	 * 更新排行榜
	 */
	private updateRankInfo():void {
		if(this.rewardWindow && this.rewardWindow.isShow) {
			this.rewardWindow.updateRankInfo();
		}
		let ranks:any[] = CacheManager.crossStair.rankInfos;
		if(ranks && ranks.length > 0) {
			for(let i:number = 0; i < this.nameTxts.length; i++) {
				if(i < ranks.length) {
					this.nameTxts[i].text = ChatUtils.getPlayerName(ranks[i]);
					if(ranks[i].floor_I >= 9) {
						this.floorTxts[i].text = LangArena.L51;
					}
					else {
						this.floorTxts[i].text = App.StringUtils.substitude(LangArena.L44,ranks[i].floor_I + 1);
					}
					// App.DateUtils.formatDate(ranks[i].toTopDt_DT,DateUtils.FORMAT_HH_MM_SS);
				}
			}
		}
	}

	private updateFloorReward():void {
		this.rewardCfg = ConfigManager.crossStair.getCurFloorRewardCfg();
		let killNum:number = 0;
		let floor:number = 0;
		if(this.stairInfo) {
			killNum = this.stairInfo.killNum_I;
			floor = this.stairInfo.floor_I;
		}
		this.canGet = false;
		if(this.rewardCfg) {
			let color:number;
			if(floor > this.rewardCfg.floor || killNum >= this.rewardCfg.killNum) {
				color = Color.Green2;
				if(CacheManager.crossStair.rewardSuccess) {
					ProxyManager.gamePlay.getCrossStairFloorReward();//自动领取奖励
					CacheManager.crossStair.rewardSuccess = false;
				}
				// CommonUtils.setBtnTips(this.btn_get_score,true);
				killNum = this.rewardCfg.killNum;
				this.canGet = true;
			}
			else {
				color = Color.Red2;
				// CommonUtils.setBtnTips(this.btn_get_score,false);
			}
			
			this.txt_scoreReward.text = this.scoreStr + HtmlUtil.html(killNum + "/" + this.rewardCfg.killNum,color);
			this.reward_group.visible = true;
		}
		else {
			this.reward_group.visible = false;
		}
	}

	private onCheckRankHandler():void{
        // if(!this.rankWindow){
		// 	this.rankWindow = new CrossStairRankWindow();
		// }
		// this.rankWindow.show();
		this.openRewardHandler();
    }

	/**领取积分奖励 */
	private onGetScoreRewardHandler():void {
		this.openRewardHandler(1);
		// if(!this.canGet) {
		// 	// Tip.showTip(LangArena.L43);
		// 	this.openRewardHandler(1);
		// 	return;
		// }
		// ProxyManager.gamePlay.getCrossStairFloorReward();
	}

	private openRewardHandler(index:number = 0):void {
		if(!this.rewardWindow) {
			this.rewardWindow = new CrossStairRewardWindow();
		}
		this.rewardWindow.show(index);
	}

	private onTimerUpdate():void {
		let time:number = egret.getTimer();
		let sec:number = Math.round((time - this.curTime) / 1000);
		this.leftTime -= sec;
		this.curTime = time;
		if(this.leftTime < 0) {
			App.TimerManager.remove(this.onTimerUpdate,this);
			return;
		}
		this.txt_leftTime.text = App.DateUtils.getTimeStrBySeconds(this.leftTime,DateUtils.FORMAT_5,false);
	}
	
	private onSceneMapUpdate():void {
		if(this.stairInfo && this.stairInfo.floor_I != 1) {
			EventManager.dispatch(LocalEventEnum.ShowCrossStairFloorTips,this.stairInfo.floor_I,LangCheckPoint.L5);
		}
	}

	public hide():void {
		App.TimerManager.remove(this.onTimerUpdate,this);
		for(let i:number = 0; i < this.nameTxts.length; i++) {
			this.nameTxts[i].text = "虚位以待";
			this.floorTxts[i].text = "";
		}
		super.hide();
		// if(this.rankWindow && this.rankWindow.isShow) {
		// 	this.rankWindow.hide();
		// }

		if(this.rewardWindow && this.rewardWindow.isShow) {
			this.rewardWindow.hide();
		}
		this.stairInfo = null;
		this.rewardCfg = null;
		this.canGet = false;
	}
}