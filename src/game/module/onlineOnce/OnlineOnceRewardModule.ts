class OnlineOnceRewardModule extends BaseModule {
	private c1:fairygui.Controller;
	private loader_bg:GLoader;
	private loader_topBg:GLoader;
	private txt_time:fairygui.GTextField;
	private btn_get:fairygui.GButton;
	private list_reward:List;
	private playerModel:PlayerModel;
	private modelId:number = 0;
	private onlineCfg:any;

	private leftGetTime:number = 0;
	public constructor(moduleId:ModuleEnum) {
		super(moduleId,PackNameEnum.OnlineReward);
	}

	public initOptUI():void {
		this.c1 = this.getController("c1");
		this.loader_bg = this.getGObject("loader_bg") as GLoader;
		this.loader_bg.load(URLManager.getModuleImgUrl("bg.jpg",PackNameEnum.OnlineReward));

		this.loader_topBg = this.getGObject("loader_topBg") as GLoader;
		this.loader_topBg.load(URLManager.getModuleImgUrl("topBg.jpg",PackNameEnum.OnlineReward));

		this.txt_time = this.getGObject("txt_time").asTextField;
		this.btn_get = this.getGObject("btn_get").asButton;
		this.btn_get.addClickListener(this.onClickHandler,this);
		this.list_reward = new List(this.getGObject("list_reward").asList);
		this.list_reward.data = RewardUtil.getStandeRewards(ConfigManager.sevenDays.getByPk(2).rewardStr);

		this.playerModel = new PlayerModel([EEntityAttribute.EAttributeClothes]);
		let container:egret.DisplayObjectContainer = this.getGObject("mc_container").asCom.displayListContainer;
		container.addChild(this.playerModel);

		this.onlineCfg = ConfigManager.online.getOnceOnlineRewardCfg();
		let itemCode:number = Number(this.onlineCfg.onlineRewardStr.split(",")[1]);
		let fashionCfg:any = ConfigManager.mgFashion.getFashionByItemCode(itemCode);
		this.modelId = fashionCfg.modelId;
	}

	public updateAll():void {
		this.playerModel.updatePlayer(this.modelId);
		this.updateRewardState();
	}

	public updateRewardState():void {
		let totalOnlineTime:number = CacheManager.serverTime.totalOnlineTime;
		let conditionSec:number = this.onlineCfg.onlineMinute * 60;
		if(CacheManager.welfare2.onlineRewardHadGet(this.onlineCfg.type,this.onlineCfg.onlineMinute)) {
			//已领取
			this.c1.selectedIndex = 2;
		}
		else {
			if(totalOnlineTime >= conditionSec) {
				//可领取
				this.c1.selectedIndex = 1;
				App.DisplayUtils.grayButton(this.btn_get, false, false);
			}
			else {
				//未达成
				this.c1.selectedIndex = 0;
				this.leftGetTime = conditionSec - totalOnlineTime;
				this.txt_time.text = "倒计时：" + App.DateUtils.getTimeStrBySeconds(this.leftGetTime,"{2}:{1}:{0}",false);
				if(!App.TimerManager.isExists(this.onTimerUpdate,this)) {
					App.TimerManager.doTimer(1000,this.leftGetTime,this.onTimerUpdate,this);
				}
			}
		}
	}

	private onTimerUpdate():void {
		this.leftGetTime --;
		if(this.leftGetTime <= 0) {
			this.c1.selectedIndex = 1;
			return;
		}
		this.txt_time.text = "倒计时：" + App.DateUtils.getTimeStrBySeconds(this.leftGetTime,"{2}:{1}:{0}",false);
	}

	private onClickHandler():void {
		EventManager.dispatch(LocalEventEnum.GetOnlineReward,this.onlineCfg.type,this.onlineCfg.onlineMinute);
	}

	public hide():void {
		super.hide();
		this.playerModel.updatePlayer(0);
		App.TimerManager.remove(this.onTimerUpdate,this)
	}
}