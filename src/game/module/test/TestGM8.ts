class TestGM8 extends fairygui.GComponent {
	// private txt_offline:fairygui.GTextInput;
	private musicBtns:fairygui.GButton[];
	private musicResId:string[];

	private bgmSlider:fairygui.GSlider;
	private effectSlider:fairygui.GSlider;
	private txt_bgVol:fairygui.GTextField;
	private txt_effectVol:fairygui.GTextField;

	private txt_selfNum:fairygui.GTextInput;
	private txt_playerNum:fairygui.GTextInput;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.getChild("btn_worldboss").addClickListener(this.onRefreshWorldBoss,this);
		this.getChild("btn_secretBoss").addClickListener(this.onRefreshSecretBoss,this);
		this.getChild("btn_bossHome").addClickListener(this.onRefreshHomeBoss,this);
		this.getChild("btn_crossboss0").addClickListener(this.onRefreshCrossBoss0,this);
		this.getChild("btn_crossboss1").addClickListener(this.onRefreshCrossBoss1,this);
		this.getChild("btn_crossboss_time").addClickListener(this.onRefreshCrossBossTime,this);
		this.getChild("btn_qiongCang").addClickListener(this.onRefreshQiongCangBoss,this);
		this.getChild("btn_qiongCangCount").addClickListener(this.onRefreshQiongCangBossTime,this);
		this.getChild("btn_self").addClickListener(this.onCopySelfHandler,this);
		this.getChild("btn_player").addClickListener(this.onCopyPlayerHandler,this);
		this.getChild("btn_open_bitmap").addClickListener(this.onOpenBitmapRender,this);
		this.getChild("btn_close_bitmap").addClickListener(this.onCloseBitmapRender,this);
		this.getChild("btn_broad").addClickListener(this.onShowBroad,this);
		this.getChild("btn_boss").addClickListener(this.onEnterBroad,this);

		this.getChild("btn_offline").addClickListener(this.onOffLineClick,this);
		// this.txt_offline = this.getChild("txt_offline").asCom.getChildAt(1).asTextInput;

		this.getChild("btn_addBuff").addClickListener(this.onAddKillBossBuff,this);
		this.getChild("btn_nextCheckPoint").addClickListener(this.nextCheckPoint,this);
		this.musicBtns = [];
		this.musicResId = ["100000.mp3","100001.mp3","200000.mp3","200001.mp3"];
		for(let i:number = 0; i < 4; i++) {
			let btn:fairygui.GButton = this.getChild("btn_music_" + i).asButton;
			btn.addClickListener(this.onSwichtMusicHandler,this);
			this.musicBtns.push(btn);
		}

		this.bgmSlider = this.getChild("slider_bgmsound").asSlider;
		this.bgmSlider.max = 100;
		this.bgmSlider.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onBgmVolChangeHandler, this);

		this.effectSlider = this.getChild("slider_effectsound").asSlider;
		this.effectSlider.max = 100;
		this.effectSlider.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onEffectVolChangeHandler, this);

		this.txt_bgVol = this.getChild("txt_bgVol").asTextField;
		this.txt_effectVol = this.getChild("txt_effectVol").asTextField;

		this.txt_selfNum = this.getChild("txt_selfNum").asCom.getChildAt(1).asTextInput;
		this.txt_playerNum = this.getChild("txt_playerNum").asCom.getChildAt(1).asTextInput;
	}

	public updateAll():void {
		let _bgVolume:number = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.MusicVolume]);
		let _effectVolume:number = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.EffectVolume]);
		this.bgmSlider.value = _bgVolume * 100;
		this.effectSlider.value = _effectVolume * 100;
		this.txt_bgVol.text = "背景音量：" + _bgVolume;
		this.txt_effectVol.text = "特效音量：" + _effectVolume;
	}

	private onBgmVolChangeHandler():void
	{
		let _volume:number = this.bgmSlider.value / 100;
		CacheManager.sysSet.setValue(LocalEventEnum[LocalEventEnum.MusicVolume],_volume,true,-1,false);
		this.txt_bgVol.text = "背景音量：" + _volume;
		// this.updateMuteBtn();
	}

	private onEffectVolChangeHandler():void
	{
		let _volume:number = this.effectSlider.value / 100;
		CacheManager.sysSet.setValue(LocalEventEnum[LocalEventEnum.EffectVolume],_volume,true,-1,false);
		this.txt_effectVol.text = "特效音量：" + _volume;
		// this.updateMuteBtn();
	}

	/**
	 * 背景音乐切换
	 */
	private onSwichtMusicHandler(evt:egret.TouchEvent):void {
		let btn:fairygui.GButton = evt.currentTarget as fairygui.GButton;
		let index:number = this.musicBtns.indexOf(btn);
		if(index != -1 && index < this.musicResId.length) {
			App.SoundManager.playBg(this.musicResId[index]);
		}
	}

	/**跳转下一关 */
	private nextCheckPoint():void {
		ProxyManager.test.exeCmd(222,[]);
	}

	/**秒怪buff */
	private onAddKillBossBuff():void {
		ProxyManager.test.exeCmd(30,[10000000]);
	}

	private onOffLineClick():void {
		ProxyManager.test.exeCmd(221,[]);
		// let seconds:number = Number(this.txt_offline.text);
		// let seconds:number = 3600;
		// let day:number = Math.floor(seconds / 3600 / 24);
		// let hour:number = Math.floor(seconds / 3600) % 24;
		// let minute:number = Math.floor(seconds / 60) % 60;
		// let second:number = Math.round(seconds % 60);
		// ProxyManager.test.exeCmd(196,[day,hour,minute,second]);
	}

	private onRefreshHomeBoss():void {
		ProxyManager.test.exeCmd(220,[ECopyType.ECopyMgNewBossHome]);
	}

	private onRefreshWorldBoss():void {
		ProxyManager.test.exeCmd(220,[ECopyType.ECopyMgNewWorldBoss]);
	}

	private onRefreshSecretBoss():void {
		ProxyManager.test.exeCmd(220,[ECopyType.ECopyMgSecretBoss]);
		ProxyManager.test.exeCmd(220,[ECopyType.ECopyMgDarkSecretBoss]);
	}

	private onRefreshCrossBoss0():void {
		ProxyManager.test.exeCmd(220,[ECopyType.ECopyNewCrossBoss, 0]);
	}

	private onRefreshCrossBoss1():void {
		ProxyManager.test.exeCmd(220,[ECopyType.ECopyNewCrossBoss, 1]);
	}

	private onRefreshCrossBossTime():void {
		ProxyManager.test.exeCmd(228,[6, 9]);
	}

	private onRefreshQiongCangBoss():void {
		ProxyManager.test.exeCmd(220,[ECopyType.ECopyMgQiongCangAttic]);
		ProxyManager.test.exeCmd(220,[ECopyType.ECopyMgQiongCangHall]);
	}

	private onRefreshQiongCangBossTime():void {
		ProxyManager.test.exeCmd(228,[6, 9, 6]);
	}

	private onCopySelfHandler():void {
		let num:number = Number(this.txt_selfNum.text);
		ProxyManager.test.exeCmd(248,[num]);
	}

	private onCopyPlayerHandler():void {
		let num:number = Number(this.txt_playerNum.text);
		ProxyManager.test.exeCmd(248,[num,1]);
	}

	private onOpenBitmapRender():void {
		CacheManager.map.txtAsBitmap(1);
	}

	private onCloseBitmapRender():void {
		CacheManager.map.txtAsBitmap(0);
	}

	private onShowBroad():void{
		let text:string = this.getChild("txt_broad").asCom.getChildAt(1).asTextInput.text;
		if(text){
			ProxyManager.test.gmOperation(EGmOpType.EGmOpTypeTestBroadcastCachedPriority, null,[text]);
		}
	}

	private onEnterBroad():void{
		let text:string = this.getChild("txt_boss").asCom.getChildAt(1).asTextInput.text;
		if(text){
			let curMgBossInf:any = ConfigManager.mgGameBoss.getByPk(Number(text))
			EventManager.dispatch(LocalEventEnum.BossReqEnterCopy,curMgBossInf.copyCode,curMgBossInf.mapId,curMgBossInf.bossCode);	
		}
		HomeUtil.close(ModuleEnum.Test);
	}

}