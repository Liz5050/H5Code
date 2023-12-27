class SevenDaysModule extends BaseWindow {
	private btn_reward:fairygui.GButton;
	private txt_days:fairygui.GTextField;
	private txt_desc:fairygui.GTextField;
	private loader_days:GLoader;
	private loader_guanggao:GLoader;
	private list_reward:List;
	private list_days:List;
	private configData:any[];
	private curSelectData:any;
	public constructor() {
		super(PackNameEnum.SevenDays,"Main",ModuleEnum.SevenDays)

	}
	public initOptUI():void{
		this.btn_reward = this.getGObject("btn_reward").asButton;
		this.txt_days = this.getGObject("txt_days").asTextField;
		this.txt_desc = this.getGObject("txt_desc").asTextField;
		this.list_reward = new List(this.getGObject("list_reward").asList);

		this.loader_days = <GLoader>this.getGObject("loader_days");
		this.loader_guanggao = <GLoader>this.getGObject("loader_guanggao");
		var com:fairygui.GComponent = this.getGObject("panel_days").asCom;
		this.list_days = new List(com.getChild("list_days").asList);
		this.list_days.list.addEventListener(fairygui.ItemEvent.CLICK,this.onClickDayItem,this)
		this.configData = ConfigManager.sevenDays.select({});
		App.ArrayUtils.sortOn(this.configData,"day");
		this.list_days.setVirtual(this.configData);
		this.btn_reward.addClickListener(this.onClickRewardBtn,this);
	}

	public updateAll(data?:any):void{
		this.list_days.setVirtual(this.configData);
		this.setDfSelect();
	}
	private setDfSelect():void{
		var idx:number = 0; //根据没领取的登录奖励 获取默认选中
		for(var i:number = 0;i<this.configData.length;i++){
			if(CacheManager.sevenDay.isDayCanGot(this.configData[i].day)){
				idx = i;
				break;
			}
		}
		this.list_days.selectedIndex = idx;
		this.list_days.scrollToView(idx);
		var item:SevenDayItem = this.list_days.selectedItem;
		item.selected = true;
		this.updateSelect();
	}
	private updateSelect():void{
		var item:SevenDayItem = this.list_days.selectedItem;
		var data:any = item.getData();
		this.curSelectData = data; 
		this.loader_days.load(URLManager.getPackResUrl(PackNameEnum.SevenDays,`img_day${data.day}`));
		this.loader_guanggao.load(URLManager.getPackResUrl(PackNameEnum.SevenDays,`img_day${data.day}_2`));
		this.txt_days.text = ""+data.day;
		this.txt_desc.text = data.rewardName || "";
		var items:ItemData[] = RewardUtil.getRewardCareer(data.rewardStr);		
		this.list_reward.setVirtual(items);
		var isGot:boolean = CacheManager.sevenDay.isDayCanGot(data.day);
		this.btn_reward.enabled = isGot;
	}
	
	private onClickDayItem(e:fairygui.ItemEvent):void{
		this.updateSelect();
	}
	private onClickRewardBtn(e:any):void{		
		EventManager.dispatch(LocalEventEnum.SevenDaysReqGetReward,this.curSelectData.day);
	}
	
}