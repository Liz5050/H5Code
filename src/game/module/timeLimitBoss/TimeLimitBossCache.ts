class TimeLimitBossCache extends ActivityWarfareCache {
	private _hurtList:any[];
	private _firstHurt:any;
	private _myHurt:any;

	private _buffInfo:any;

	private _dropInfo:any;
	private static MAX_DROP:number = 80;//最大显示掉落数

	/**奖励金箱子、称号、银箱子 */
	private _rewardCodes:number[] = [40110219,40890167,40110220];
	private copyCfg:any;
	public constructor() {
		super();
		this.iconId = IconResId.TimeLimitBoss;
	}

	public updateHurtList(data:any):void {
		this._hurtList = data.hurtList.data;
		if(!this._hurtList || this._hurtList.length == 0) return;
		this._myHurt = this._hurtList.shift();
		if(this._hurtList.length > 0) {
			this._firstHurt = this._hurtList.shift();
		}
		else {
			this._firstHurt = this._myHurt;
		}
		EventManager.dispatch(NetEventEnum.BossHurtListUpdate);
	}

	/**
	 * buff更新
	 */
	public updateBuffInfo(data:any):void {
		this._buffInfo = data;
		EventManager.dispatch(NetEventEnum.TimeLimitBossBuffUpdate);
	}

	/**
	 * 掉落信息更新
	 * SWorldBossDropInfo
	 * int32 itemCode_I = 1;
	 * int32 dropNum_I = 2;
	 * int32 leftNum_I = 3;
	 * int32 leftTime_I = 4;
	 */
	public updateDropInfo(data:any):void {
		if(!data) {
			this._dropInfo = null;
			return;
		}

		let changeNum:number = 0;
		if(this._dropInfo) {
			//数量发生改变
			let leftNum:number = Math.round(data.leftNum_I / data.dropNum_I * TimeLimitBossCache.MAX_DROP);
			changeNum = this._dropInfo.leftNum_I - leftNum;
			if(changeNum > 0) {
				this._dropInfo.leftNum_I -= changeNum;
			}
			else {
				changeNum = 0;
			}
		}
		else {
			changeNum = -1;
			let dropNum:number = Math.min(data.dropNum_I,TimeLimitBossCache.MAX_DROP);
			TimeLimitBossCache.MAX_DROP = dropNum;

			let playerItems:any[] = [];
			let delayTime:number = data.leftTime_I < 20 ? 1000 : 3000;
			for(let i:number = 0; i < dropNum; i++) {
				playerItems.push({
					uid_S:"" + i,
					itemCode_I:data.itemCode_I,
					itemAmount_I:1,
				});
			}
			this._dropInfo = {
				itemCode_I:data.itemCode_I,
				point:{
					x_SH:18,
					y_SH:23
				},
				playerItem:{
					data:playerItems
				},
				rewardId:CacheManager.role.entityInfo.entityId,
				leftNum_I:dropNum,
				leftTime_I:data.leftTime_I,
				updateTime:egret.getTimer()
			}
			egret.setTimeout(function(){
				EventManager.dispatch(LocalEventEnum.TimeLimitBossShowDropBtn);
			},this,delayTime);
		}
		if(!this.copyCfg) {
			this.copyCfg = ConfigManager.copy.getByPk(CopyEnum.TimeLimitBoss);
		}
		if(this.copyCfg && CacheManager.map.mapId == this.copyCfg.intoMapId && ControllerManager.scene.sceneReady) {
			EventManager.dispatch(LocalEventEnum.TimeLimitBossDropUpdate,changeNum);
		}
	}

	public get dropInfo():any {
		return this._dropInfo;
	}

	public get buffInfo():any {
		return this._buffInfo;
	}

	public get nextBuffType():number {
		if(!this._buffInfo) {
			return -1;
		}
		return 0;
	}

	/**
	 * 伤害排名第一数据
	 */
	public get firstHurt():any {
		return this._firstHurt;
	}

	/**
	 * 我的伤害数据
	 */
	public get myHurt():any {
		return this._myHurt;
	}

	public get myScore():string {
		if(!this._myHurt) return "0";
		return App.MathUtils.formatNum64(this._myHurt.hurt_L64,false);
	}

	/**
	 * 伤害列表，第二名开始
	 */
	public get hurtList():any[] {
		return this._hurtList;
	}

	public get showIcon():boolean {
		return this._showIcon;
	}

	public get rewardCodes():number[] {
		return this._rewardCodes;
	}

	public get bossCode():number {
		if(!this.openInfo) return 0;
		return this.openInfo.bossCode_I;
	}
}