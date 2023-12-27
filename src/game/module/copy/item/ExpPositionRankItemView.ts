class ExpPositionRankItemView extends ListRenderer {
	private c1:fairygui.Controller;
	private txt_rank:fairygui.GTextField;
	private txt_playerName:fairygui.GTextField;
	private txt_exp:fairygui.GTextField;
	private baseItem:BaseItem;
	private txt_count:fairygui.GTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.txt_rank = this.getChild("txt_rank").asTextField;
		this.txt_playerName = this.getChild("txt_playerName").asTextField;
		this.txt_exp = this.getChild("txt_exp").asTextField;
		this.baseItem = this.getChild("baseItem") as BaseItem;
		this.baseItem.isShowName = false;
		this.baseItem.isNameCount = false;
		this.txt_count = this.getChild("txt_count").asTextField;
		this.txt_count.text = "";
	}

	public setData(data:any,index:number):void {
		this._data = data;
		let rank:number = index + 1;		
		if(rank > 3) {
			this.c1.selectedIndex = 0;
		}
		else {
			this.c1.selectedIndex = rank;
		}
		this.txt_rank.text = "" + rank;
		this.txt_playerName.text = ChatUtils.getPlayerName(data);
		this.txt_exp.text = "" + Number(data.exp_L64);
		let rewardCfg:any = ConfigManager.expPosition.getRankReward(rank);
		if(rewardCfg) {
			let itemDatas:ItemData[] = RewardUtil.getStandeRewards(rewardCfg.reward);
			this.baseItem.setData(itemDatas[0]);
			this.txt_count.text = "X" + itemDatas[0].getItemAmount();
			this.baseItem.updateNum("");
		}
	}
}