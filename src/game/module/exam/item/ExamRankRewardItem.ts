class ExamRankRewardItem extends ListRenderer{
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
		let rewardStr:string[] = data.reward.split("#");
		let itemDatas:ItemData[] = [];
		for(let i:number = 0; i < rewardStr.length; i++) {
			if(rewardStr[i] == "") {
				continue;
			}
			itemDatas.push(RewardUtil.getReward(rewardStr[i]));
		}
		this.list_item.data = itemDatas;
		if(data.minRank == data.maxRank) {
			this.txt_rank.text = "第" + data.minRank + "名";
		}
		else {
			this.txt_rank.text = data.minRank + "-" + data.maxRank + "名";
		}
	}
}