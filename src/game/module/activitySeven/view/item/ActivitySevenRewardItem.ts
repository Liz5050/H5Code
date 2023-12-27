class ActivitySevenRewardItem extends ListRenderer{
	private c1:fairygui.Controller;
	private loader_bg:GLoader;
	private btn_get:fairygui.GButton;
	private txt_progress:fairygui.GTextField;
	private txt_condition:fairygui.GRichTextField;
	private list_item:List;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.loader_bg = this.getChild("loader_bg") as GLoader;
		this.loader_bg.load(URLManager.getModuleImgUrl("itemBg.jpg",PackNameEnum.ActivitySeven));
		this.txt_progress = this.getChild("txt_progress").asTextField;
		this.txt_condition = this.getChild("txt_condition").asRichTextField;
		this.list_item = new List(this.getChild("list_item").asList);
		this.btn_get = this.getChild("btn_get").asButton;
		this.btn_get.addClickListener(this.onGetRewardHandler,this);
	}

	public setData(data:any):void {
		this._data = data;
		let countStr:string;
		let process:number = CacheManager.activitySeven.getActivityTaskProcess(data.id);
		let color:number = Color.Green2;
		if(process < data.count) {
			color = Color.Red2;
		}
		
		let processStr:string = process + "";
		if(data.activityType == EActivityType.EActivityTypeMoneyCost && data.condition == "1") {
			countStr = Math.floor(data.count / 10000) + "";
			processStr = Math.floor(process / 10000) + "";
		}
		else {
			countStr = data.count + "";
		}
		this.txt_condition.text = App.StringUtils.substitude(data.desc,countStr);
		this.list_item.data = RewardUtil.getStandeRewards(data.rewards);
		this.txt_progress.color = color;
		this.txt_progress.text = processStr + "/" + countStr;
		this.btn_get.title = LangActivity.LANG2;
		if(CacheManager.activitySeven.canGet(data.id)) {
			//可领取
			this.c1.setSelectedIndex(1);
			App.DisplayUtils.grayButton(this.btn_get, false, false);
			CommonUtils.setBtnTips(this.btn_get,true);
		}
		else {
			CommonUtils.setBtnTips(this.btn_get,false);
			if(CacheManager.activitySeven.hadGet(data.id)) {
				//已领取
				this.c1.setSelectedIndex(2);
				App.DisplayUtils.grayButton(this.btn_get, true, true);
			}
			else {
				//未达成
				this.c1.setSelectedIndex(0);
				if(data.openKey) {
					this.btn_get.title = LangActivity.LANG3;
					App.DisplayUtils.grayButton(this.btn_get, false, false);
				}
				else {
					App.DisplayUtils.grayButton(this.btn_get, true, true);
				}
			}
		}
	}

	private onGetRewardHandler():void {
		if(this.c1.selectedIndex == 0) {
			let openParam:string[] = this._data.openKey.split(",");
			let moduleName:string = openParam[0];
			let typeName:string = openParam.length > 1 ? openParam[1] : "";
			let moduleId:ModuleEnum = ModuleEnum[moduleName];
			if(moduleId == ModuleEnum.GuildNew || moduleId == ModuleEnum.GuildActivity) {
				if(!CacheManager.guildNew.isJoinedGuild()) {
					Tip.showRollTip(LangActivity.LANG4);
					return;
				}
			}
			else if(moduleId == ModuleEnum.Recharge) {
				HomeUtil.openRecharge();
				return;
			}
			EventManager.dispatch(UIEventEnum.ModuleOpen,moduleId,{tabType:PanelTabType[typeName]},ViewIndex.Two);
			return;
		}
		MoveMotionUtil.itemListMoveToBag(this.list_item.list._children,0,LayerManager.UI_Popup);
		ProxyManager.activity.getActivitySevenReward(this._data.id);
	}
}