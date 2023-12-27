class GuildBattleCache extends ActivityWarfareCache {
	private _guildRanks:any[] = [];
	private _playerRanks:any[] = [];
	private guildPlayerInfos:{[entityId:string]:GuildBattlePlayerInfo} = {};
	private guildPlayerArr:GuildBattlePlayerInfo[] = [];//保存数组，给List用

	private _collectInfo:any;
	private _winerInfo:any;

	private _myGuildScore:number = 0;//我的仙盟积分
	private _myScore:number = 0;//我的个人积分
	private _hadGetScore:number = -1;//已领取的最高积分奖励 小于该值的积分奖励配置都代表已领取
	private _myBattleScore:number = 0;//战功
	public dayRewardGet:number = 0;//每日奖励领取标志 0未领取 1已领
	public myGuildRank:number = -1;//我的仙盟排名

	private _onScene1:number = 0;//仙盟殿外人数统计
	private _maps:number[];
	private _mapNames:string[] = ["殿外","练武场","圣殿"];
	public constructor() {
		super();
		this.iconId = IconResId.GuildBattle;
	}

	// /**
	//  * 仙盟战开启信息
	//  */
	// public updateOpenInfo(data:any):void {
	// 	this.openInfo = data;
	// 	if(this.showIcon) {
	// 		EventManager.dispatch(LocalEventEnum.AddHomeIcon,IconResId.GuildBattle);
	// 		EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.GuildBattle,this.isOpen);
	// 		EventManager.dispatch(LocalEventEnum.HomeIconSetTime,IconResId.GuildBattle,this.leftOpenTime);
	// 		this._openDate = new Date(this.openInfo.openDt_DT * 1000);
	// 	}
	// 	else {
	// 		EventManager.dispatch(LocalEventEnum.RemoveHomeIcon,IconResId.GuildBattle);
	// 	}
	// }

	/**
	 * 更新仙盟排行
	 */
	public updateGuildRanks(data:any[]):void {
		this._guildRanks = data;
		EventManager.dispatch(NetEventEnum.GuildScoreRankUpdate);
	}

	public get guildRanks():any {
		return this._guildRanks;
	}

	/**
	 * 更新个人排名
	 */
	public updatePlayerRanks(data:any[]):void {
		this._playerRanks = data;
		EventManager.dispatch(NetEventEnum.PlayerScoreRankUpdate);
	}

	public get playerRanks():any[] {
		return this._playerRanks;
	}

	/**
	 * 更新仙盟积分
	 */
	public updateMyGuildScore(score:number):void {
		this._myGuildScore = score;
		EventManager.dispatch(NetEventEnum.MyGuildScoreUpdate);
	}

	/**
	 * 更新个人积分
	 * SMgNewGuildPlayerScore
	 * int updateType;
	 * int addScore;
	 * string name;
	 */
	public updateMyScore(data:any):void {
		let nameStr:string = HtmlUtil.html(data.name_S,Color.Green2);
		let score:number = data.addScore_I;
		let career:number = data.career_I;
		this._myScore += data.addScore_I;
		switch(data.updateType_I) {
			case EMgNewGuildUpdateType.EMgNewGuildUpdateTypeKillBoss:
				//击杀boss加分
				// Tip.showTip("杀怪获得积分+" + HtmlUtil.html("" + score,Color.Green2));
				break;
			case EMgNewGuildUpdateType.EMgNewGuildUpdateTypeKillPlayer:
				//击杀玩家加分
				Tip.showRollTip("你击杀了" + nameStr + "的" + CareerUtil.getCareerName(career));
				// Tip.showRollTip("成功击杀" + HtmlUtil.html(nameStr,Color.Green2) + "，积分+" + HtmlUtil.html("" + score,Color.Green2));
				break;
			case EMgNewGuildUpdateType.EMgNewGuildUpdateTypeAssist:
				//助攻加分
				Tip.showRollTip("助攻击杀" + nameStr + "的" + CareerUtil.getCareerName(career));
				break;
			case EMgNewGuildUpdateType.EMgNewGuildUpdateTypeTimer:
				//定时加分
				// Tip.showTip("获得持续参与奖，积分+" + HtmlUtil.html("" + score,Color.Green2));
				for(let entityId in this.guildPlayerInfos) {
					this.guildPlayerInfos[entityId].score += score;
				}
				break;
		}
		Tip.showTip("积分+" + score);
		EventManager.dispatch(NetEventEnum.GuildBattleMyScoreUpdate);
	}
	
	/**
	 * 更新仙盟成员信息
	 */
	public updateGuildPlayerInfo(data:any):void {
		let entityId:string = EntityUtil.getEntityId(data.player.entityId);
		let info:GuildBattlePlayerInfo = this.guildPlayerInfos[entityId];
		if(!info) {
			info = new GuildBattlePlayerInfo();
			this.guildPlayerInfos[entityId] = info;
			this.guildPlayerArr.push(info);
		}
		info.setData(data);
		if(EntityUtil.isMainPlayer(data.player.entityId)) {
			this._myScore = data.score_I;
			EventManager.dispatch(NetEventEnum.GuildBattleMyScoreUpdate);
		}
	}

	/**
	 * 仙盟成员信息列表更新
	 */
	public updateGuildPlayerInfoList(data:any[]):void {
		this.guildPlayerInfos = {};
		this.guildPlayerArr = [];
		for(let i:number = 0; i < data.length; i++) {
			this.updateGuildPlayerInfo(data[i]);
		}
		EventManager.dispatch(NetEventEnum.GuildBattleMemberPositionUpdate);
	}
	
	/**
	 * 更新采集信息
	 * SMgNewGuildCollectInfo
	 * int leftSec; 							//剩余时间
	 * int leftTimes;							//剩余攻击次数
	 * string name;							//采集者名字
	 * Message::Public::SEntityId entityId;	//采集者实体ID
	 */
	public updateCollectInfo(data:any):void {
		this._collectInfo = data;
		this._collectInfo.updateTime = egret.getTimer();
		EventManager.dispatch(NetEventEnum.GuildBattleCollectInfoUpdate);
	}

	/**
	 * 已领取积分奖励更新
	 */
	public updateHadGetScore(score:number):void {
		this._hadGetScore = score;
		EventManager.dispatch(NetEventEnum.GuildBattleScoreRewardUpdate);
	}

	/**
	 * 更新自己战功（不同于积分，战功用于进入第三个场景的凭证）
	 */
	public updateBattleScore(score:number):void {
		this._myBattleScore = score;
		EventManager.dispatch(NetEventEnum.GuildBattleScoreUpdate);
	}

	/**胜利仙盟更新 */
	public updateWiner(data:any):void {
		this._winerInfo = data;
	}

	/**我的仙盟是否是胜利仙盟 */
	public get isWiner():boolean {
		if(!this._winerInfo) {
			return false;
		}
		return CacheManager.guildNew.isMyGuild(this._winerInfo.guildId_I);
	}

	public get winerInfo():any {
		return this._winerInfo;
	}

	public guildPlayerList():GuildBattlePlayerInfo[] {
		return this.guildPlayerArr;
	}

	public getMemberInfo(entityId:string):GuildBattlePlayerInfo {
		return this.guildPlayerInfos[entityId];
	}

	/**
	 * 在仙盟殿外的成员数量
	 */
	public getMemberOnScene1():number {
		let count:number = 0;
		for(let i:number = 0; i < this.guildPlayerArr.length; i++) {
			let position:number = this.maps.indexOf(this.guildPlayerArr[i].mapId);
			if(position == EGuildBattlePosition.GuildBattle_0) {
				count++;
			}
		}
		return count;
	}

	public get myGuildScore():number {
		return this._myGuildScore;
	}

	public get myScore():number {
		return this._myScore;
	}

	public get battleScore():number {
		return this._myBattleScore;
	}

	/**
	 * 是否有人采集旗帜
	 */
	public get hasCollecter():boolean {
		return this._collectInfo != null && this._collectInfo.entityId != null && this._collectInfo.entityId.id_I > 0;
	}

	public get collectInfo():any {
		return this._collectInfo;
	}

	public get maps():number[] {
		if(!this._maps) {
			this._maps = [];
			let copyCfg:any = ConfigManager.copy.getByPk(CopyEnum.CopyGuildBattle);
			let mapStrs:string[] = copyCfg.maps.split("#");
			for(let i:number = 0; i < mapStrs.length; i++) {
				if(mapStrs[i] == "") continue;
				this._maps.push(Number(mapStrs[i]));
			}	
		}
		return this._maps;
	}

	/**获取当前所在位置 */
	public get position():number {
		let mapId:number = CacheManager.map.mapId;
		return this.maps.indexOf(mapId);
	}

	public get nextMapId():number {
		let position:number = this.position;
		if(position == EGuildBattlePosition.GuildBattle_1) {
			let staticCfg:any = ConfigManager.guildBattle.getStaticCfg();
			if(this._myBattleScore < staticCfg.enterTemplePoint) {
				//进入圣殿所需战功不足
				return -1;
			}
		}
		let nextId:number = -1;
		if(position < this.maps.length - 1) {	
			nextId = this.maps[position + 1];
		}
		return nextId;
	}

	public get lastMapId():number {
		let position:number = this.position;
		let lastId:number = -1;
		if(position != -1 && position > 0) {	
			lastId = this.maps[position - 1];
		}
		return lastId;
	}

	/**
	 * 积分奖励是否已领取
	 */
	public hadGet(score:number):boolean {
		return score <= this._hadGetScore;
	}

	// //距离开始时间
	// public get leftOpenTime():number {
	// 	if(!this.openInfo) {
	// 		return 0;
	// 	}
	// 	return this.openInfo.openDt_DT - CacheManager.serverTime.getServerTime();
	// }

	// /**获取活动剩余时间 */
	// public get leftTime():number {
	// 	if(!this.openInfo) {
	// 		return 0;
	// 	}
	// 	return this.openInfo.endDt_DT - CacheManager.serverTime.getServerTime();
	// }

	// public get isOpen():boolean {
	// 	return CacheManager.guildBattle.showIcon && CacheManager.guildBattle.leftOpenTime <= 0;
	// }

	public get openDate():Date {
		let date:Date;
		let serverDay:number = CacheManager.serverTime.serverOpenDay;
		if(serverDay <= 4) {
			let serverOpenTime:number = CacheManager.serverTime.openDate.getTime() + 3 * 24 * 60 * 60 * 1000;
			date = new Date(serverOpenTime);
			date.setHours(20);
		}
		else {
			let serverTime:number = CacheManager.serverTime.getServerMTime()
			date = new Date(serverTime);
			date.setHours(20);
			date.setMinutes(0);
			date.setSeconds(0);
			let week:number = date.getDay();
			let time:number = date.getTime() + ((6 - week) * 24 * 60 * 60 * 1000);
			date.setTime(time);
		}
		return date;
	}

	// /**
	//  * 是否显示图标
	//  */
	// public get showIcon():boolean {
	// 	return this.openInfo != null && this.leftTime > 0;
	// }

	public getPositionName(mapId:number):string {
		let position:number = this.maps.indexOf(mapId);
		if(position < 0) {
			return "";
		}
		return this._mapNames[position];
	}

	public checkTips():boolean {
		return this.isWiner && this.dayRewardGet == 0;
	}

	public clear():void {
		super.clear();
		this.guildPlayerInfos = {};
		this.guildPlayerArr = [];
		this._myScore = 0;
	}
}