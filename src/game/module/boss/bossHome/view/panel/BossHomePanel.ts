class BossHomePanel extends BaseTabView {
	private c1:fairygui.Controller;
	private floorList:List;
	private floorDetailsView:BossHomeDetailsView;
	private bgLoader:GLoader;
	private floorCfgs:any[];

	private leftTime:number;
	private curTime:number;
	public constructor() {
		super();
	}

	public initOptUI():void {
		this.bgLoader = this.getGObject("loader_bg") as GLoader;
		this.bgLoader.load(URLManager.getModuleImgUrl("worldBossBg.png",PackNameEnum.Boss));
		
		this.c1 = this.getController("c1");
		this.floorList = new List(this.getGObject("list_bossFloor").asList);

		this.floorDetailsView = this.getGObject("floor_details") as BossHomeDetailsView;
		// let bossCfgs:any[] = ConfigManager.mgGameBoss.getByCopyType(ECopyType.ECopyMgNewBossHome);
		this.floorCfgs = ConfigManager.bossHomeReward.getFloorRewardList();
		this.floorList.data = this.floorCfgs;
		for(let i:number = 0; i < this.floorCfgs.length; i++) {
			this.floorList.list.getChildAt(i).addEventListener(BossHomeEnterItem.ITEM_CLICK,this.onEnterFloor,this);
		}
		this.floorDetailsView.setFloorCfgs(this.floorCfgs);
	}

	public updateAll():void {
		this.updateRefreshTime();
		if(!App.TimerManager.isExists(this.reqServerData,this)) {
            App.TimerManager.doTimer(3000,0,this.reqServerData,this);
        }
	}

	public updateRefreshTime():void {
		this.leftTime = CacheManager.bossNew.bossHomeRefresh - CacheManager.serverTime.getServerTime();
		if(this.leftTime > 0) {
			if(!App.TimerManager.isExists(this.onTimerUpdate,this)) {
				this.curTime = egret.getTimer();
				App.TimerManager.doTimer(1000,0,this.onTimerUpdate,this);
			}
		}
	}

	public updateBossList():void {
		if(this.c1.selectedIndex == 1) {
			this.floorDetailsView.updateBossList();
		}
	}

	private onTimerUpdate():void {
		let time:number = egret.getTimer();
		this.leftTime -= Math.round((time - this.curTime)/1000);
		this.curTime = time;
		if(this.leftTime < 0) {
			this.removeTimer();
			return;
		}
		this.floorDetailsView.updateTime(this.leftTime);
	}

	private removeTimer():void {
		App.TimerManager.remove(this.onTimerUpdate,this);
	}

	private reqServerData():void {
        ProxyManager.boss.reqBossList();
    }

	private onEnterFloor(evt:egret.Event):void {
		let index:number = this.floorCfgs.indexOf(evt.data);
		let curFloor:any = this.floorCfgs[index];
        let vipLv:number = curFloor.vipLevel > 0 ? curFloor.vipLevel : 0;
        if(CacheManager.vip.vipLevel < vipLv) {
            Tip.showTip("VIP等级不足");
            return;
        }
		this.c1.selectedIndex = 1;
		this.floorDetailsView.setIndex(index);
		// this.setIndex(index);
	}

	public hide():void {
		super.hide();
		this.floorDetailsView.hide();
		this.c1.selectedIndex = 0;
		App.TimerManager.remove(this.reqServerData,this);
	}
}