class WorldBossController extends BaseController {
	private _bossModule: WorldBossModule;
	private _killRecordWin: BossKillRecordWindow;
	private _explainWin: BossTireExplainWindow;
	private _curBossCode: number = 0; //当前要进入的boss
	private _curMapId: number = 0; //当前要进入的boss
	private _attrPanel:WorldBossAttrTipsPanel;
	public constructor() {
		super(ModuleEnum.WorldBoss);

	}
	public initView(): BaseGUIView {
		if (!this._bossModule) {
			this._bossModule = new WorldBossModule();
		}
		return this._bossModule;
	}

	public addListenerOnInit(): void {
		this.addListen0(LocalEventEnum.BossReqEnterCopy, this.onReqEnterBossCopy, this);

		this.addListen0(LocalEventEnum.BossRefrishNotice, this.onBossRefrishNoticeShow, this);

		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateGameBossList], this.onBossListUpdate, this); //所有boss
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateGameBoss], this.onBossListUpdate, this);//更新单个boss
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateBossMapRevivalTire], this.onRevivalTire, this);//更新单个boss
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGameBossDeathRecord], this.onBossDeath, this);//boss死亡记录
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGameBossDropRecord], this.onBossDropRecord, this);//boss掉落记录
	}

	public addListenerOnShow(): void {
		this.addListen1(UIEventEnum.BossExplainShow, this.onShowExplain, this);
		///this.addListen1(UIEventEnum.BossReqKillRecord, this.onReqKillRecord, this);
		this.addListen1(UIEventEnum.BossShowAttr, this.onShowBossAttr, this);
		this.addListen1(NetEventEnum.BossInfTireValue, this.onTireValue, this);
	}

	private onTireValue(valueNum: number, valueNumStr: string): void {
		if (this.isShow) {
			this._bossModule.curPanel.updateTireValue();
		}
	}

	/** boss复活疲劳BUF SIntDate */
	private onRevivalTire(data: any): void {
		var oldNum: number = CacheManager.buff.bossTireBuf.num;
		CacheManager.buff.setBossTireBuf(data);
		if (CacheManager.buff.bossTireBuf.num != oldNum) {
			EventManager.dispatch(LocalEventEnum.BuffChange);
		}
		if (CacheManager.buff.bossTireBuf.num >= 5) {
			var sec: number = CacheManager.buff.bossTireBuf.dt - CacheManager.serverTime.getServerTime();
			sec = Math.min(sec, 300);//最长5分钟
			var leftSec: number = Math.max(sec - 240, 0);
			if (leftSec > 0) {
				CacheManager.boss.reviveCityEnd = egret.getTimer() + leftSec * 1000; //一分钟内不能回城复活
			} else {
				CacheManager.boss.reviveCityEnd = 0;
			}

		}
	}

	/**boss刷新通知 */
	private onBossRefrishNoticeShow(bossCode: number): void {
		var w: WindowBossWarn = ObjectPool.pop("WindowBossWarn"); //弹出一个小框
		w.modal = false;
		w.show(bossCode);
		w.setXY(450, 300);
	}

	private onReqKillRecord(copyCode: number, bossCode: number): void {
		ProxyManager.boss.reqBossDeathRecord(copyCode, bossCode);
	}
	private onShowBossAttr(data:any):void{
		if(this.isShow){
			if(!this._attrPanel){
				this._attrPanel = new WorldBossAttrTipsPanel();
			}
			this._attrPanel.show(data);
		}
	}
	private onShowExplain(): void {
		if (!this._explainWin) {
			this._explainWin = new BossTireExplainWindow();
		}
		this._explainWin.show();
	}

	/** SeqGameBossDropRecord */
	protected onBossDropRecord(data: any): void {
		//console.log("--------onBossDropRecord:", data);
	}

	/** SeqGameBossDeathRecord */
	protected onBossDeath(data: any): void {

		if (!this._killRecordWin) {
			this._killRecordWin = new BossKillRecordWindow();
		}
		this._killRecordWin.show(true);
		this._killRecordWin.update(data.data);

	}

	protected onBossListUpdate(data: any): void {
		var isUpdate: boolean = !data.dict;
		var dataRet: any = data.dict ? data.dict : data;
		CacheManager.boss.setBossList(dataRet, isUpdate);
		EventManager.dispatch(NetEventEnum.BossInfUpdate);

	}


	/**
	 * 请求进入boss副本
	 */
	protected onReqEnterBossCopy(copyCode: number, mapId: number, bossCode: number): void {
		ProxyManager.boss.reqEnterBossCopy(copyCode, mapId);
		this._curBossCode = bossCode;
		this._curMapId = mapId;
		if (this.isShow) {
			this.hide();
		}
		if (this._curBossCode > 0) {
			App.TimerManager.doDelay(1000, this.routeToBoss, this);
		}
	}
	private routeToBoss(): void {
		EventManager.dispatch(LocalEventEnum.BossRouteToBossGrid, this._curBossCode, this._curMapId);
		this._curBossCode = 0;
	}
}	