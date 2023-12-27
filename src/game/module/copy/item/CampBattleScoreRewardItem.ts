class CampBattleScoreRewardItem extends ListRenderer {
	private c1:fairygui.Controller;
	private txt_score:fairygui.GRichTextField;
	private item:BaseItem;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.txt_score = this.getChild("txt_score").asRichTextField;
		this.item = this.getChild("baseItem") as BaseItem;
	}

	public setData(data:any):void {
		this._data = data;
		this.txt_score.text = data.score + "\n积分";
		this.item.itemData = RewardUtil.getReward(data.rewards);
		this.c1.selectedIndex = CacheManager.campBattle.hadGet(data.score) ? 1 : 0;
	}
}