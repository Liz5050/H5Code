class CampBattleRankRewardItem extends ListRenderer{
	private txt_rank:fairygui.GTextField;
	private list_item:List;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.txt_rank = this.getChild("txt_rank").asTextField;
		this.list_item = new List(this.getChild("list_item").asList);
	}

	public setData(data:any):void {
		this._data = data;
		let rewardStr:string[] = data.rewards.split("#");
		let itemDatas:ItemData[] = [];
		for(let i:number = 0; i < rewardStr.length; i++) {
			if(rewardStr[i] == "") {
				continue;
			}
			itemDatas.push(RewardUtil.getReward(rewardStr[i]));
		}
		this.list_item.data = itemDatas;
		if(data.rankStart == data.rankEnd) {
			this.txt_rank.text = App.StringUtils.substitude(LangArena.L45,data.rankStart);
		}
		else if(data.rankEnd > 200){
			this.txt_rank.text = LangArena.L50;
		}
		else {
			this.txt_rank.text = App.StringUtils.substitude(LangArena.L45,data.rankStart + "-" + data.rankEnd);
		}
	}
}