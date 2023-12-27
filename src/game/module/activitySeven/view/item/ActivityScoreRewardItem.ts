class ActivityScoreRewardItem extends ListRenderer { 
	private loader_bg:GLoader;
	private list_item:List;
	private txt_condition:fairygui.GRichTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.loader_bg = this.getChild("loader_bg") as GLoader;
		this.loader_bg.load(URLManager.getModuleImgUrl("score_itemBg.jpg",PackNameEnum.ActivitySeven));
		this.list_item = new List(this.getChild("list_item").asList);
		this.txt_condition = this.getChild("txt_condition").asRichTextField;
	}

	public setData(data:any):void {
		this._data = data;
		this.txt_condition.text = "达成" + HtmlUtil.html(data.target + "",Color.Color_5) + "项任务";
		this.list_item.data = RewardUtil.getStandeRewards(data.rewards);
	}
}