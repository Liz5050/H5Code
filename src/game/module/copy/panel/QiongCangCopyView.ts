class QiongCangCopyView extends WorldBossCopyPanel {
	private c1: fairygui.Controller;//归属信息显示控制
    private winnerTxt: fairygui.GTextField;
	private txt_exitTime:fairygui.GRichTextField;

	private leftTime:number = -1;
	public constructor(info:any) {
		super(info,"QiongCangCopyView");
	}

	public initOptUI():void {
        super.initOptUI();
		this.c1 = this.getController('subC1');
		this.winnerTxt = this.getGObject("txt_winner").asTextField;
		this.txt_exitTime = this.getGObject("txt_exitTime").asRichTextField;
	}

	protected addListenerOnShow(): void {
        super.addListenerOnShow();
		this.addListen1(NetEventEnum.BossRewardResult,this.onBossCopyResult,this);
	}

	public updateAll():void {
        super.updateAll();
		this.c1.selectedIndex = 0;
		this.opaque = false;//可穿透空白区域
	}

	public updateOwnerInfo(): void {
        super.updateOwnerInfo();
		let state:OwnerAttackBtnState;
		if(this.copyInf.copyType == ECopyType.ECopyMgQiongCangHall || this.copyInf.copyType == ECopyType.ECopyMgBossIntruder) {
			state = OwnerAttackBtnState.ROB;
		}
		else {
			state = OwnerAttackBtnState.CANCL;
		}
        this.setOwnerViewAttackBtnState(state);
    }

	private onBossCopyResult(data:any):void {
		this.opaque = true;//不可穿透空白区域
		// if(this.copyInf.copyType == ECopyType.ECopyMgBossIntruder) return;
		this.c1.selectedIndex = 1;
		this.winnerTxt.text = "最终归属者：" + data.ownerMiniPlayer.name_S;
		this.leftTime = this.copyInf.waitLeaveSec > 0 ? this.copyInf.waitLeaveSec : 30;
		this.txt_exitTime.text = "离开倒计时：" + HtmlUtil.html(App.DateUtils.getTimeStrBySeconds(this.leftTime,DateUtils.FORMAT_5,false),Color.Green2);
		App.TimerManager.doTimer(1000,0,this.onTimeUpdateHandler,this);
	}

	private onTimeUpdateHandler():void {
		this.leftTime --;
		if(this.leftTime <= 0) {
			this.removeTimer();
			return;
		}
		
		this.txt_exitTime.text = "离开倒计时：" + HtmlUtil.html(App.DateUtils.getTimeStrBySeconds(this.leftTime,DateUtils.FORMAT_5,false),Color.Green2);
	}

	private removeTimer():void {
		this.c1.selectedIndex = 0;
		this.leftTime = -1;
		App.TimerManager.remove(this.onTimeUpdateHandler,this);
	}

	/**打开奖励界面 */
	public onOpenRewardHandler(): void {
		let mapBossList: any[] = ConfigManager.mgGameBoss.getByMapId(CacheManager.map.mapId);
		let bossCode:number = 0;
		if (mapBossList && mapBossList.length > 0) {
			bossCode = mapBossList[0].bossCode;
		}
		if(!bossCode) return;
		if(this.copyInf.copyType == ECopyType.ECopyMgQiongCangHall) {
			EventManager.dispatch(UIEventEnum.BossRewardPanelOpen, bossCode);
		}
		else if(this.copyInf.copyType == ECopyType.ECopyMgQiongCangAttic){
			EventManager.dispatch(UIEventEnum.QiongCangBossRewardOpen, bossCode);
		}
		else if(this.copyInf.copyType == ECopyType.ECopyMgBossIntruder){
			EventManager.dispatch(UIEventEnum.BossComingRewardOpen,bossCode);
		}
	}

	public hide():void {
		this.removeTimer();
		super.hide();
	}
}