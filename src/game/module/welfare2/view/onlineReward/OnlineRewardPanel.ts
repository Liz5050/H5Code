class OnlineRewardPanel extends BaseTabView {
	private loader_bg:GLoader;
	private list_item:List;
	private rewards:any[];
	public constructor() {
		super();
	}

	public initOptUI():void {
		this.loader_bg = this.getGObject("loader_bg") as GLoader;
		this.loader_bg.load(URLManager.getModuleImgUrl("bg5.jpg",PackNameEnum.Welfare2));
		this.list_item = new List(this.getGObject("list_item").asList);
		this.rewards = ConfigManager.online.getDayOnlineRewardCfgs();
		this.list_item.autoRecycle = true;
	}

	public updateAll():void {
		this.updateOnlineTime();
	}

	public updateOnlineTime():void {
		this.rewards.sort(function(value1:any,value2:any):number{
			let hadGet1:boolean = CacheManager.welfare2.onlineRewardHadGet(value1.type,value1.onlineMinute);
			let hadGet2:boolean = CacheManager.welfare2.onlineRewardHadGet(value2.type,value2.onlineMinute);
			if(!hadGet1 && hadGet2) return -1;
			if(hadGet1 && !hadGet2) return 1;
			return value1.onlineMinute - value2.onlineMinute;
		})
		this.list_item.data = this.rewards;
	}

	public hide():void {
		super.hide();
		this.list_item.data = null;
	}
}