class ActivityWarfareCache implements ICache{
	protected iconId:IconResId;
	protected openInfo:any;
	protected _showIcon:boolean = false;
	public constructor() {
	}

	public updateOpenInfo(data:any):void {
		this.openInfo = data;
		this._showIcon = data != null;
		if(this._showIcon) {
			let isOpen:boolean = this.isOpen;
			if(this.showOpenTips()) {
				if(isOpen && ResourceManager.isPackageLoaded(PackNameEnum.HomeIcon)) {
					//显示活动开启提示
					EventManager.dispatch(LocalEventEnum.ActivityWarTipsUpdate,this.iconId);
				}
				else {
					App.TimerManager.doTimer(1000,0,this.onActivityTimeUpdate,this);
				}
			}
			EventManager.dispatch(LocalEventEnum.AddHomeIcon,this.iconId);
			EventManager.dispatch(LocalEventEnum.HomeIconSetTip,this.iconId,isOpen);
			EventManager.dispatch(LocalEventEnum.HomeIconSetTime,this.iconId,this.leftOpenTime);
		}
		else {
			App.TimerManager.remove(this.onActivityTimeUpdate,this);
			EventManager.dispatch(LocalEventEnum.RemoveHomeIcon,this.iconId);
			EventManager.dispatch(LocalEventEnum.ActivityWarTipsUpdate);
		}
		EventManager.dispatch(LocalEventEnum.HomeSetTrainRedTip, CacheManager.train.checkTips());
		
	}

	private onActivityTimeUpdate():void {
		if(this.isOpen && ResourceManager.isPackageLoaded(PackNameEnum.HomeIcon)) {
			App.TimerManager.remove(this.onActivityTimeUpdate,this);
			EventManager.dispatch(LocalEventEnum.ActivityWarTipsUpdate,this.iconId);
		}
	}
	
	public get showIcon():boolean {
		return this._showIcon && this.leftTime > 0;
	}

	public setOpenInfoAttr(attrName:string,value:any):void{
		if(this.openInfo && this.openInfo[attrName]!=null) {
			this.openInfo[attrName] = value;
		}
	}
	
	//距离开始时间
	public get leftOpenTime():number {
		if(!this.openInfo) {
			return 0;
		}
		return this.openInfo.openDt_DT - CacheManager.serverTime.getServerTime();
	}

	/**获取活动剩余时间 */
	public get leftTime():number {
		if(!this.openInfo) {
			return 0;
		}
		return this.openInfo.endDt_DT - CacheManager.serverTime.getServerTime();
	}

	public get isOpen():boolean {
		if(!ConfigManager.mgOpen.isOpenedByKey(IconResId[this.iconId],false)) {
			return false;
		}
		return this.leftTime > 0 && this.leftOpenTime <= 0;
	}

	//是否显示活动开启提示
	private showOpenTips():boolean {
		return (this.iconId == IconResId.TimeLimitBoss || 
		this.iconId == IconResId.CampBattle || 
		this.iconId == IconResId.GuildBattle || 
		this.iconId == IconResId.GuildDefend || 
		this.iconId == IconResId.CrossStair);
	}

	public clear():void {
		this.updateOpenInfo(null);
	}
}