class ActivityUpgradeFaBaoPanel extends ActivityBaseTabPanel {
	private list_item:List;
	private txt_myValue:fairygui.GRichTextField;
	public constructor() {
		super();
		this.activityType = ESpecialConditonType.ESpecialConditionTypeSpiritSports;
		this.desTitleStr = "";
	}

	public initOptUI():void {
		super.initOptUI();
		this.list_item = new List(this.getGObject("list_item").asList);
		this.txt_myValue = this.getGObject("txt_myValue").asRichTextField;
	}

	public updateAll():void {
		super.updateAll();
		if(!CacheManager.magicWeaponStrengthen.shapeInfo) {
			this.txt_myValue.text = "我的法宝等级：未激活";
		}
		else {
			let cfg:any = CacheManager.magicWeaponStrengthen.cfg;
			let star:number = cfg.star > 0 ? cfg.star : 0;
			this.txt_myValue.text = "我的法宝等级：" + HtmlUtil.html(cfg.stage + "阶" + star + "星",Color.Yellow);
		}
		
	}

	public updateActicityInfo(info:ActivityInfo):void {
		super.updateActicityInfo(info);
		this.activityInfo.rewardInfos.sort(this.sortRewardInfos);
		this.list_item.data = info.rewardInfos;
		this.list_item.scrollToView(0);
	}

	public updateRewardGetInfo():void {
		this.updateRewardNumList();
	}

	public updateRewardNumList():void {
		this.activityInfo.rewardInfos.sort(this.sortRewardInfos);
		this.list_item.data = this.activityInfo.rewardInfos;
	}

	private sortRewardInfos(value1:ActivityRewardInfo,value2:ActivityRewardInfo):number {
		let hadGetCount1:number = value1.hadGetCount;
		let hadGetCount2:number = value2.hadGetCount;
		if(hadGetCount1 <= 0 && hadGetCount2 > 0) return -1;
		if(hadGetCount1 > 0 && hadGetCount2 <= 0) return 1;
		return value1.conds[0] - value2.conds[0];
	}
}