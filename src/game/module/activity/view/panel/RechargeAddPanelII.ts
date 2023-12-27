class RechargeAddPanelII extends ActivityBaseTabPanel {
	private list_item:List;
	private txt_recharge:fairygui.GRichTextField;
	public constructor() {
		super();
		this.activityType = ESpecialConditonType.ESpecialConditonTypeMgRecharge;
	}

	public initOptUI():void {
		super.initOptUI();
		this.list_item = new List(this.getGObject("list_item").asList);
		this.txt_recharge = this.getGObject("txt_recharge").asRichTextField;
	}

	public updateActicityInfo(info:ActivityInfo):void {
		super.updateActicityInfo(info);
		let rewardInfos:ActivityRewardInfo[] = this.activityInfo.rewardInfos;
		rewardInfos.sort(this.sortList);
		this.list_item.setVirtual(rewardInfos);
		this.txt_recharge.text = HtmlUtil.colorSubstitude(LangActivity.L20,CacheManager.activity.addRechargeNum);
	}

	public updateRewardGetInfo():void {
		this.list_item.data.sort(this.sortList);
		this.list_item.list.refreshVirtualList();
	}

	public updateRechargeNum():void {
		this.list_item.list.refreshVirtualList();
		this.txt_recharge.text = HtmlUtil.colorSubstitude(LangActivity.L20,CacheManager.activity.addRechargeNum);
	}

	private sortList(value1:ActivityRewardInfo,value2:ActivityRewardInfo):number {
		let getInfos:number[] = CacheManager.activity.getActivityGetRewardInfo(value1.code);
		let hadGet1:boolean = getInfos != null && getInfos[value1.index] > 0;
		let hadGet2:boolean = getInfos != null && getInfos[value2.index] > 0;
		if(!hadGet1 && hadGet2) return -1;
		if(hadGet1 && !hadGet2) return 1;
		return value1.index - value2.index;
	}
}