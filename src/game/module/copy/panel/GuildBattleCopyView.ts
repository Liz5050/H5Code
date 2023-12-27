class GuildBattleCopyView extends BaseCopyPanel {
	private mapChangeControll:fairygui.Controller;
	private switchBtn:fairygui.Controller;
	private c3:fairygui.Controller;
	private btn_guildScore:fairygui.GButton;
	private rankTxts:fairygui.GTextField[];
	private guildNameTxts:fairygui.GTextField[];
	private guildScoreTxts:fairygui.GTextField[];

	private txt_ownerGuild:fairygui.GTextField;
	private txt_leftTime:fairygui.GTextField;
	private battle_progress:GuildBattleProgressView;

	private btn_selfGuild:fairygui.GButton;
	private txt_playerNum:fairygui.GRichTextField;
	private txt_myGuildScore:fairygui.GRichTextField;
	private txt_myScore:fairygui.GRichTextField;

	private reward_group:fairygui.GGroup;
	private btn_scoreReward:fairygui.GButton;
	private txt_scoreReward:fairygui.GTextField;

	private changeMapBtn:fairygui.GButton[];
	private txt_battle_score:fairygui.GRichTextField;

	private txt_collecter:fairygui.GRichTextField;
	private txt_collectTime:fairygui.GTextField;
	private txt_collectGuildName:fairygui.GRichTextField;
	private collect_bar:GuildBattleCollectBarView;

	private changeMap_wait:ChangeMapWaitingView;

	private scoreRewardCfg:any;
	private staticCfg:any;
	private leftTime:number = 0;
	private position:number = -1;
	private leftCollectTime:number = 0;
	public constructor(info:any) {
		super(info,"GuildBattleCopyView");
		this.staticCfg = ConfigManager.guildBattle.getStaticCfg();
		this.exitTips = "确定退出仙盟争霸？";
	}

	public initOptUI(): void {
		super.initOptUI();
		this.mapChangeControll = this.getController("c2");
		this.c3 = this.getController("c3");
		let switchBtn:fairygui.GComponent = this.getGObject("switch_btn").asCom;
		this.switchBtn = switchBtn.getController("c1");
		this.btn_guildScore = this.getGObject("btn_guildScore").asButton;
		this.btn_guildScore.addClickListener(this.onOpenGuildRank,this);
		this.rankTxts = [];
		this.guildNameTxts = [];
		this.guildScoreTxts = [];
		for(let i:number = 0; i < 3; i++) {
			let txt:fairygui.GTextField = this.getGObject("txt_rank" + i).asTextField;
			this.rankTxts.push(txt);

			txt = this.getGObject("txt_guildName" + i).asTextField;
			this.guildNameTxts.push(txt);

			txt = this.getGObject("txt_guildScore" + i).asTextField;
			this.guildScoreTxts.push(txt);
		}

		this.txt_ownerGuild = this.getGObject("txt_ownerGuild").asTextField;
		this.txt_leftTime = this.getGObject("txt_leftTime").asTextField;
		this.battle_progress = new GuildBattleProgressView(this.getGObject("battle_progress").asCom);

		this.btn_selfGuild = this.getGObject("btn_selfGuild").asButton;
		this.btn_selfGuild.addClickListener(this.onCheckMyGuild,this);
		this.txt_playerNum = this.getGObject("txt_playerNum").asRichTextField;
		this.txt_myGuildScore = this.getGObject("txt_myGuildScore").asRichTextField;
		this.txt_myScore = this.getGObject("txt_myScore").asRichTextField;

		this.reward_group = this.getGObject("reward_group").asGroup;
		this.txt_scoreReward = this.getGObject("txt_scoreReward").asTextField;
		this.btn_scoreReward = this.getGObject("btn_scoreReward").asButton;
		this.btn_scoreReward.addClickListener(this.onGetScoreRewardHandler,this);

		this.changeMapBtn = [];
		for(let i:number = 0; i < 3; i++) {
			let btn:fairygui.GButton = switchBtn.getChild("btn_" + i).asButton;
			btn.addClickListener(this.onChangeMapHandler,this);
			this.changeMapBtn.push(btn);
		}
		this.txt_battle_score = switchBtn.getChild("txt_battle_score").asRichTextField;

		this.txt_collecter = this.getGObject("txt_collecter").asRichTextField;
		this.txt_collectTime = this.getGObject("txt_collectTime").asTextField;
		this.txt_collectGuildName = this.getGObject("txt_collectGuildName").asRichTextField;
		this.collect_bar = this.getGObject("collect_bar") as GuildBattleCollectBarView;

		// this.hurtView = new CopyHurtListView(this.getGObject("hurt_list").asCom);
	}

	public updateAll():void {
		this.txt_myScore.text = "我的积分：" + HtmlUtil.html(CacheManager.guildBattle.myScore + "",Color.Color_2);
		this.battle_progress.updateAll();
		this.updateScoreReward();
		this.updateMyGuildScore();
		this.updateGuildScoreRanks();
		this.sceneMapUpdate();
		this.updateMember();
		
		// this.hurtView.updateAll();

		if(!App.TimerManager.isExists(this.onTimerUpdate,this)) {
			this.leftTime = CacheManager.guildBattle.leftTime;
			this.txt_leftTime.text = App.DateUtils.getTimeStrBySeconds(this.leftTime,DateUtils.FORMAT_5,false);
			App.TimerManager.doTimer(1000,0,this.onTimerUpdate,this);
		}
	}

	 /**模块显示时开启的监听 */
    protected addListenerOnShow(): void {
		this.addListen1(LocalEventEnum.BattleObjChange,this.updateBattleObj,this);
	}

	private onTimerUpdate():void {
		this.leftTime --;
		if(this.leftTime <= 0) {
			App.TimerManager.remove(this.onTimerUpdate,this);
			return;
		}
		this.txt_leftTime.text = App.DateUtils.getTimeStrBySeconds(this.leftTime,DateUtils.FORMAT_5,false);
		this.leftCollectTime --;
		if(this.leftCollectTime >= 0) {
			this.txt_collectTime.text = App.DateUtils.getTimeStrBySeconds(this.leftCollectTime,DateUtils.FORMAT_5,false);
		}
	}

	public updateGuildScoreRanks():void {
		let ranks:any[] = CacheManager.guildBattle.guildRanks;
		if(ranks) {
			for(let i:number = 0; i < this.rankTxts.length; i++) {
				if(i < ranks.length) {
					this.rankTxts[i].text = ranks[i].rank_I + "";
					this.guildNameTxts[i].text = ranks[i].guildName_S;
					this.guildScoreTxts[i].text = ranks[i].score_I + "";
					if(ranks[i].rank_I == 1) {
						this.txt_ownerGuild.text = ranks[i].guildName_S;
					}
				}
				else {
					this.rankTxts[i].text = "" + (i + 1);
					this.guildNameTxts[i].text = "虚位以待";
					this.guildScoreTxts[i].text = "0";
					if(i == 0) {
						this.txt_ownerGuild.text = "虚位以待";
					}
				}
			}
		}
	}

	/**
	 * 更新我的仙盟积分
	 */
	public updateMyGuildScore():void {
		this.txt_myGuildScore.text = "仙盟积分：" + HtmlUtil.html(CacheManager.guildBattle.myGuildScore + "",Color.Color_2);
	}

	/**
	 * 积分更新
	 */
	public updateMyScore():void {
		this.txt_myScore.text = "我的积分：" + HtmlUtil.html(CacheManager.guildBattle.myScore + "",Color.Color_2);
		this.updateScoreRewardTxt();
	}

	/**
	 * 更新积分奖励
	 */
	public updateScoreReward():void {
		this.scoreRewardCfg = ConfigManager.guildBattle.getCurScoreRewardCfg();
		this.updateScoreRewardTxt();
	}

	private updateScoreRewardTxt():void {
		let myScore:number = CacheManager.guildBattle.myScore;
		if(this.scoreRewardCfg) {
			let color:string;
			if(myScore >= this.scoreRewardCfg.score) {
				color = Color.Color_6;
				CommonUtils.setBtnTips(this.btn_scoreReward,true);
			}
			else {
				color = Color.Color_4;
				CommonUtils.setBtnTips(this.btn_scoreReward,false);
			}
			
			this.txt_scoreReward.text = HtmlUtil.html(myScore + "/" + this.scoreRewardCfg.score,color);
			this.reward_group.visible = true;
		}
		else {
			this.reward_group.visible = false;
		}
		// if(this.rankWindow && this.rankWindow.isShow) {
		// 	this.rankWindow.updateScore();
		// }
	}

	/**
	 * 战功更新
	 */
	public updateMyBattleScore():void {
		if(this.position != EGuildBattlePosition.GuildBattle_1) return;
		let curScore:number = CacheManager.guildBattle.battleScore;
		let needScore:number = this.staticCfg.enterTemplePoint;
		let color:number;
		if(curScore < needScore) {
			color = Color.Red;
		}
		else {
			color = Color.Green2;
		}
		this.txt_battle_score.text = "我的战功：" + HtmlUtil.html(curScore + "/" + needScore,color);
		let enterNext:boolean = CacheManager.guildBattle.nextMapId != -1;
		this.changeMapBtn[this.position + 1].visible = enterNext;
		this.txt_battle_score.visible = !enterNext;
	}

	public updateCollectInfo():void {
		if(!CacheManager.guildBattle.hasCollecter) {
			this.c3.selectedIndex = 0;
			this.collect_bar.stopCollect();
			return;
		}
		this.c3.selectedIndex = 1;
		let collectInfo:any = CacheManager.guildBattle.collectInfo;
		this.txt_collecter.text = collectInfo.name_S + HtmlUtil.html("采集皇旗中",Color.BASIC_COLOR_3);
		this.leftCollectTime = collectInfo.leftSec_I;
		this.txt_collectTime.text = App.DateUtils.getTimeStrBySeconds(this.leftCollectTime,DateUtils.FORMAT_5,false);
		this.txt_collectGuildName.text = HtmlUtil.html("仙盟：",Color.Color_7) + collectInfo.guildName_S;
		if(this.position == EGuildBattlePosition.GuildBattle_2) {
			this.collect_bar.updateCollectTime(collectInfo);
		}
	}

	/**更新采集者护盾 */
	public updateCollecterShield(leftTime:number):void {
		let max:number = this.staticCfg.collectHurtTimes;
		this.collect_bar.updateShield(leftTime,max);
	}

	private updateBattleObj():void {
		if(this.position == EGuildBattlePosition.GuildBattle_2) {
			let battleObj: RpgGameObject = CacheManager.king.leaderEntity.battleObj;
			if(battleObj && !EntityUtil.isCollectionMonster(battleObj) &&!battleObj.isDead()) {
				this.collect_bar.visible = false;
			}
			else {
				this.collect_bar.visible = true;
			}
		}
	}

	public updateMember():void {
		this.txt_playerNum.text = "仙盟殿外：" + HtmlUtil.html(CacheManager.guildBattle.getMemberOnScene1() + "人",Color.Color_2);
	}

	/**
	 * 仙盟排行
	 */
	private onOpenGuildRank():void {
		EventManager.dispatch(UIEventEnum.GuildBattleRankOpen);
	}

	/**
	 * 本盟战况
	 */
	private onCheckMyGuild():void {
		EventManager.dispatch(UIEventEnum.GuildBattleMemberOpen);
	}

	/**领取积分奖励 */
	private onGetScoreRewardHandler():void {
		if(!this.scoreRewardCfg) {
			return;
		}
		if(CacheManager.guildBattle.myScore < this.scoreRewardCfg.score) {
			Tip.showTip("积分不足");
			return;
		}
		ProxyManager.guildBattle.scoreRewardGet(this.scoreRewardCfg.score);
	}

	/**
	 * 切换场景
	 */
	private onChangeMapHandler(evt:egret.TouchEvent):void {
		if(this.position == EGuildBattlePosition.GuildBattle_0) {
			let monster:RpgMonster = CacheManager.map.getNearestMonster();
			let bossInfo:EntityInfo = CacheManager.map.getBossEntityInfo();
			if(monster && !monster.isDead() || bossInfo) {
				Tip.showRollTip("击杀仙盟圣兽后方可进入练武场！");
				return;
			}
		}
		let btn:fairygui.GButton = evt.currentTarget as fairygui.GButton;
		let index:number = this.changeMapBtn.indexOf(btn);
		let mapId:number = CacheManager.guildBattle.maps[index];

		if(!this.changeMap_wait) {
			this.changeMap_wait = new ChangeMapWaitingView();
		}
		this.changeMap_wait.show(mapId);
		// ProxyManager.guildBattle.enterGuildBattle(mapId);
	}

	public sceneMapUpdate():void {
		this.position = CacheManager.guildBattle.position;
		this.switchBtn.selectedIndex = this.mapChangeControll.selectedIndex = this.position;
		this.battle_progress.updatePosition();
		// if(this.position == 0) {
		// 	let boss:RpgMonster = CacheManager.map.getNearestMonster();
		// 	this.hurtView.viewCom.visible = boss != null;
		// }
		this.updateMyBattleScore();
		if(this.position == EGuildBattlePosition.GuildBattle_2) {
			this.collect_bar.updateAll();
		}
		this.updateCollectInfo();
	}

	public hide():void {
		super.hide();
		App.TimerManager.remove(this.onTimerUpdate,this);
		this.leftTime = 0;
	}

	// private exitCopy(): void {
	// 	let mainPlayer:MainPlayer = CacheManager.king.leaderEntity;
	// 	if(mainPlayer && mainPlayer.currentState == EntityModelStatus.ScaleTween) return;
	// 	AlertII.show("确定退出仙盟争霸？",null,function(type:AlertType) {
	// 		if(type == AlertType.YES) {
	// 			CacheManager.copy.isActiveLeft = true;
	// 			CacheManager.task.gotoTaskFlag = false;
	// 			EventManager.dispatch(LocalEventEnum.CopyReqExit);
	// 		}
	// 	}, this);
	// }

}