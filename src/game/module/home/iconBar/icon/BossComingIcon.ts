class BossComingIcon extends fairygui.GButton {
	private loader_head:GLoader;
	private mc_progress:UIMovieClip;
	private mc_full:UIMovieClip;
	private shapeMask:egret.Shape;

	private startAngle:number = -90;

	// private bossComingCfg:any;
	private bossInfo:any;
	private hasTween:boolean = false;
	private _isShow: boolean = true;

	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.loader_head = this.getChild("loader_head") as GLoader;
		this.mc_progress = UIMovieManager.get(PackNameEnum.MCBossComing);
		let mcContainer:fairygui.GComponent = this.getChild("mc_container").asCom;
		mcContainer.addChild(this.mc_progress);
		this.mc_progress.setPlaySettings(0,-1,-1);
		this.mc_progress.playing = true;
		this.shapeMask = new egret.Shape();
		this.displayListContainer.addChild(this.shapeMask);
		mcContainer.mask = this.shapeMask;
		this.addClickListener(this.openBossComingHandler,this);
		this.setValue(1,4);
	}

	public updateAll():void {
		this.bossInfo = CacheManager.bossNew.getRefreshBossComingInfo();
		// this.bossComingCfg = ConfigManager.mgGameBoss.getBossComingCfgList(true)[0];
		this.updateBossComingProgress();
	}

	public updateGameBossInfo(data:any):void {
		if(!this.bossInfo || this.bossInfo.bossCode_I != data.val_I) return;

		// this.bossComingCfg = ConfigManager.mgGameBoss.getBossComingCfgList(true)[0];
		this.bossInfo = CacheManager.bossNew.getRefreshBossComingInfo();
		this.updateBossComingProgress();
	}

	public updateBossComing(data:any):void {
		if(data.length == 1) {
			//单个更新
			let bossInfo:any = data[0];
			if(this.bossInfo && this.bossInfo.bossCode_I != bossInfo.bossCode_I) return;
			if(!this.bossInfo || CacheManager.bossNew.isBossComingCd(bossInfo.bossCode_I)) {
				// this.bossComingCfg = ConfigManager.mgGameBoss.getBossComingCfgList(true)[0];
				this.bossInfo = CacheManager.bossNew.getRefreshBossComingInfo();
			}
		}
		else {
			//列表更新
			// this.bossComingCfg = ConfigManager.mgGameBoss.getBossComingCfgList(true)[0];
			this.bossInfo = CacheManager.bossNew.getRefreshBossComingInfo();
		}
		this.updateBossComingProgress();
	}

	public goTween(isShow:boolean): void {
		if(this._isShow == isShow) return;
		this._isShow = isShow;
		let _posX: number;
		if (this._isShow) {
			_posX = 11;
		} 
		else {
			_posX = -this.width - 11;
		}
		egret.Tween.removeTweens(this.parent);
		egret.Tween.get(this.parent).to({ x: _posX }, 400, egret.Ease.backInOut);
	}

	public get isShow(): boolean {
        return this._isShow;
    }

	private updateBossComingProgress():void {
		if(!this.bossInfo) return;
		let bossCfg:any = ConfigManager.boss.getByPk(this.bossInfo.bossCode_I);
		this.loader_head.load(URLManager.getIconUrl(bossCfg.avatarId,URLManager.AVATAR_ICON));
		let bossComingCfg:any = ConfigManager.mgGameBoss.getBossComingCfg(this.bossInfo.bossCode_I);

		let needKillCount:string[] = bossComingCfg.killBossCounts.split(",");
		let killIndex:number = this.bossInfo.beKilledTimes_I > 0 ? this.bossInfo.beKilledTimes_I : 0;
		if(killIndex >= needKillCount.length) {
			killIndex = needKillCount.length - 1;
		}
		let kills:number = this.bossInfo.progress_I;;
		this.setValue(kills,Number(needKillCount[killIndex]));
		// CommonUtils.setBtnTips(this,!CacheManager.bossNew.isBossComingCd(this.bossInfo.bossCode_I),88,20);
		if(!CacheManager.bossNew.isBossComingCd(this.bossInfo.bossCode_I)) {
			if(!this.mc_full) {
				this.mc_full = UIMovieManager.get(PackNameEnum.MCBossComingFull);
				this.mc_full.setPlaySettings(0,-1,0);
				this.mc_full.x = -32;
				this.mc_full.y = -40;
			}
			this.mc_full.playing = true;
			this.mc_full.visible = true;
			this.addChild(this.mc_full);
			if(!this.hasTween) {
				this.hasTween = true;
				egret.Tween.get(this,{loop:true}).wait(800).to({rotation:3},50).to({rotation:-3},50).to({rotation:3},50).to({rotation:0},50);
			}
		}
		else {
			if(this.mc_full) {
				this.mc_full.playing = false;
				this.mc_full.removeFromParent();
				this.mc_full = null;
			}
			egret.Tween.removeTweens(this);
			this.hasTween = false;
		}
	}

	private setValue(value:number,max:number):void {
		value = Math.min(value,max);
		let angle:number = value / max * 360 + this.startAngle;
		this.changeGraphics(angle);
	}

	private changeGraphics(angle: number) {
        let r: number = 60;
        this.shapeMask.graphics.clear();
        this.shapeMask.graphics.moveTo(71, 68);
        this.shapeMask.graphics.beginFill(0x00ffff, 1);
        this.shapeMask.graphics.lineTo(r, 0);
        this.shapeMask.graphics.drawArc(71, 68, r, this.startAngle * Math.PI / 180, angle * Math.PI / 180, false);
        this.shapeMask.graphics.lineTo(71, 68);
        this.shapeMask.graphics.endFill();
    }

	private openBossComingHandler():void {
		if(!this.bossInfo) return;
		let bossComingCfg:any = ConfigManager.mgGameBoss.getBossComingCfg(this.bossInfo.bossCode_I);
		EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.BossComing,{bossComingCfg:bossComingCfg});
	}
}